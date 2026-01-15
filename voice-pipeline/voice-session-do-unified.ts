import { DurableObject } from 'cloudflare:workers';
import { ClientMessage, ServerMessage, TranscriptChunk, SessionStats } from './contracts/voice-types';

interface Env {
    DEEPGRAM: Fetcher; // Single unified Deepgram service
    DB: D1Database;
    OPENAI_API_KEY: string;
}

interface Message {
    role: 'user' | 'assistant';
    content: string;
    timestamp: number;
}

interface AgentConfig {
    id: string;
    name: string;
    systemPrompt: string;
    voiceId: string; // Deepgram Aura model name
    llmModel: string;
    voiceConfig: {
        sttModel?: string;
        language?: string;
        punctuate?: boolean;
    };
}

export class VoiceSessionUnifiedDO extends DurableObject {
    private sessions: Map<WebSocket, SessionState> = new Map();

    constructor(state: DurableObjectState, env: Env) {
        super(state, env);
    }

    async fetch(request: Request): Promise<Response> {
        if (request.headers.get('Upgrade') !== 'websocket') {
            return new Response('Expected WebSocket', { status: 426 });
        }

        const pair = new WebSocketPair();
        const [client, server] = Object.values(pair);

        this.ctx.acceptWebSocket(server);

        return new Response(null, {
            status: 101,
            webSocket: client,
        });
    }

    async webSocketMessage(ws: WebSocket, message: string | ArrayBuffer) {
        try {
            const data: ClientMessage = JSON.parse(message as string);

            switch (data.type) {
                case 'start_session':
                    await this.handleStartSession(ws, data.agentId, data.config);
                    break;
                case 'audio_chunk':
                    await this.handleAudioChunk(ws, data.audio);
                    break;
                case 'text_input':
                    await this.handleTextInput(ws, data.text);
                    break;
                case 'interrupt':
                    await this.handleInterrupt(ws);
                    break;
                case 'end_session':
                    await this.handleEndSession(ws);
                    break;
            }
        } catch (error) {
            console.error('[VoiceSessionUnified] Error handling message:', error);
            this.send(ws, {
                type: 'error',
                message: error instanceof Error ? error.message : 'Unknown error',
            });
        }
    }

    async webSocketClose(ws: WebSocket, code: number, reason: string) {
        console.log('[VoiceSessionUnified] WebSocket closed:', code, reason);
        await this.cleanup(ws);
    }

    async webSocketError(ws: WebSocket, error: unknown) {
        console.error('[VoiceSessionUnified] WebSocket error:', error);
        await this.cleanup(ws);
    }

    private async handleStartSession(ws: WebSocket, agentId: string | undefined, config?: any) {
        if (!agentId) {
            this.send(ws, { type: 'error', message: 'Agent ID required' });
            return;
        }
        const agent = await this.loadAgent(agentId);
        if (!agent) {
            this.send(ws, { type: 'error', message: 'Agent not found' });
            ws.close(1008, 'Agent not found');
            return;
        }

        const sessionId = crypto.randomUUID();
        const startTime = Date.now();

        const state: SessionState = {
            sessionId,
            agentId,
            agent,
            conversationHistory: [],
            currentSpeaker: 'none',
            startTime,
            stats: {
                duration: 0,
                messageCount: 0,
                audioInputDuration: 0,
                audioOutputDuration: 0,
                sttCost: 0,
                ttsCost: 0,
                llmCost: 0,
            },
            config: config || {},
        };

        this.sessions.set(ws, state);

        // Create unified Deepgram pipeline (single WebSocket for STT)
        const pipelineWs = await this.connectDeepgramPipeline(ws, state);
        state.pipelineConnection = pipelineWs;

        try {
            // Store session in DB
            await this.env.DB.prepare(`
          INSERT INTO agent_sessions (id, agent_id, channel, started_at, status)
          VALUES (?, ?, 'voice', ?, 'active')
        `).bind(sessionId, agentId, startTime).run();
        } catch (e) {
            console.warn('DB Error saving session:', e);
            // Continue even if DB fails, don't crash the call
        }

        this.send(ws, { type: 'session_started', sessionId });
    }

    private async connectDeepgramPipeline(clientWs: WebSocket, state: SessionState): Promise<WebSocket> {
        // Connect to unified Deepgram pipeline
        // Service binding access via fetch, but we need websocket upgrade
        const pipelineUrl = 'http://deepgram-unified/pipeline'; // URL doesn't matter much for bindings, but protocol does

        // Durable Objects calling other workers via bindings with upgrade
        const response = await this.env.DEEPGRAM.fetch(new Request(pipelineUrl, {
            headers: { Upgrade: 'websocket' }
        }));

        if (!response.webSocket) {
            throw new Error('Failed to connect to Deepgram pipeline');
        }

        const pipelineWs = response.webSocket;
        pipelineWs.accept();

        // Start pipeline with both STT and TTS config
        pipelineWs.send(JSON.stringify({
            type: 'start',
            sttConfig: {
                model: state.agent.voiceConfig?.sttModel || 'nova-2-phonecall',
                language: state.agent.voiceConfig?.language || 'en',
                punctuate: state.agent.voiceConfig?.punctuate ?? true,
                interim_results: true,
                endpointing: 300,
                vad_events: true,
            },
            ttsConfig: {
                voiceId: state.agent.voiceId,
            },
        }));

        pipelineWs.addEventListener('message', async (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'transcript') {
                const chunk: TranscriptChunk = message.data;

                // Send transcript to client
                this.send(clientWs, {
                    type: 'transcript',
                    text: chunk.text,
                    isFinal: chunk.isFinal,
                });

                // When speech is final, generate agent response
                if (chunk.speechFinal && chunk.text.trim()) {
                    state.conversationHistory.push({
                        role: 'user',
                        content: chunk.text,
                        timestamp: Date.now(),
                    });

                    state.stats.messageCount++;

                    // Estimate STT cost (Nova-2: ~$0.0043 per minute)
                    // Rough estimate based on average speech rate
                    const estimatedSeconds = chunk.text.split(' ').length / 2.5; // ~150 words per minute
                    state.stats.sttCost += (estimatedSeconds / 60) * 0.0043;

                    await this.generateAgentResponse(clientWs, state, pipelineWs);
                }
            } else if (message.type === 'audio') {
                // Forward audio chunks from TTS to client
                this.send(clientWs, {
                    type: 'audio_chunk',
                    audio: message.data,
                    format: 'pcm16',
                });
            } else if (message.type === 'synthesis_complete') {
                this.send(clientWs, { type: 'audio_complete' });
                state.currentSpeaker = 'none';
            }
        });

        pipelineWs.addEventListener('error', (error) => {
            console.error('[VoiceSessionUnified] Pipeline error:', error);
            this.send(clientWs, {
                type: 'error',
                message: 'Voice pipeline error',
            });
        });

        // We don't have to explicitly open it as .accept() does it for server side 
        // but here we are client to the service binding. 
        // Actually, response.webSocket is already open? 
        // For Service Bindings, it returns a WebSocket immediately.

        return pipelineWs;
    }

    private async handleAudioChunk(ws: WebSocket, audioBase64: string | undefined) {
        if (!audioBase64) return;
        const state = this.sessions.get(ws);
        if (!state || !state.pipelineConnection) return;

        // Forward audio to Deepgram pipeline
        state.pipelineConnection.send(JSON.stringify({
            type: 'audio',
            data: audioBase64,
        }));

        state.currentSpeaker = 'user';
    }

    private async handleTextInput(ws: WebSocket, text: string | undefined) {
        if (!text) return;
        const state = this.sessions.get(ws);
        if (!state) return;

        // Direct text input (for testing without voice)
        state.conversationHistory.push({
            role: 'user',
            content: text,
            timestamp: Date.now(),
        });

        state.stats.messageCount++;

        await this.generateAgentResponse(ws, state, state.pipelineConnection!);
    }

    private async generateAgentResponse(ws: WebSocket, state: SessionState, pipelineWs: WebSocket) {
        state.currentSpeaker = 'agent';

        this.send(ws, { type: 'thinking' });

        try {
            // Call OpenAI LLM
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.env.OPENAI_API_KEY}`,
                },
                body: JSON.stringify({
                    model: state.agent.llmModel || 'gpt-4-turbo', // Default to GPT-4 Turbo
                    messages: [
                        { role: 'system', content: state.agent.systemPrompt },
                        ...state.conversationHistory.map(m => ({
                            role: m.role,
                            content: m.content,
                        }))
                    ],
                    max_tokens: 300,
                }),
            });

            if (!response.ok) {
                console.warn('LLM Error, using fallback response', response.status);
                await this.mockAgentResponse(ws, state, pipelineWs, "I'm having trouble connecting to my brain right now, but I hear you.");
                return;
            }

            const result: any = await response.json();
            const agentText = result.choices[0].message.content;

            state.conversationHistory.push({
                role: 'assistant',
                content: agentText,
                timestamp: Date.now(),
            });

            // Estimate LLM cost (Rough GPT-4 Turbo pricing)
            // Input: $0.01 / 1k tokens, Output: $0.03 / 1k tokens
            const inputTokens = result.usage?.prompt_tokens || 0;
            const outputTokens = result.usage?.completion_tokens || 0;
            state.stats.llmCost += (inputTokens * 0.00001) + (outputTokens * 0.00003);

            // Estimate TTS cost (Aura: ~$0.015 per 1k chars)
            state.stats.ttsCost += (agentText.length / 1000) * 0.015;

            // Send text to client
            this.send(ws, {
                type: 'agent_speaking',
                text: agentText,
            });

            // Request TTS synthesis through pipeline
            pipelineWs.send(JSON.stringify({
                type: 'synthesize',
                text: agentText,
            }));

        } catch (error) {
            console.error('[VoiceSessionUnified] Error generating response:', error);
            this.send(ws, {
                type: 'error',
                message: 'Failed to generate response',
            });
            state.currentSpeaker = 'none';
        }
    }

    private async mockAgentResponse(ws: WebSocket, state: SessionState, pipelineWs: WebSocket, text: string) {
        state.conversationHistory.push({
            role: 'assistant',
            content: text,
            timestamp: Date.now(),
        });
        this.send(ws, {
            type: 'agent_speaking',
            text: text,
        });
        pipelineWs.send(JSON.stringify({
            type: 'synthesize',
            text: text,
        }));
    }

    private async handleInterrupt(ws: WebSocket) {
        const state = this.sessions.get(ws);
        if (!state) return;

        state.currentSpeaker = 'none';
        this.send(ws, { type: 'interrupted' });
    }

    private async handleEndSession(ws: WebSocket) {
        await this.cleanup(ws);
        ws.close(1000, 'Session ended by client');
    }

    private async cleanup(ws: WebSocket) {
        const state = this.sessions.get(ws);
        if (!state) return;

        // Close pipeline connection
        if (state.pipelineConnection) {
            state.pipelineConnection.send(JSON.stringify({ type: 'stop' }));
            state.pipelineConnection.close();
        }

        // Calculate final stats
        state.stats.duration = (Date.now() - state.startTime) / 1000;

        try {
            // Update session in DB
            await this.env.DB.prepare(`
          UPDATE agent_sessions 
          SET ended_at = ?, duration_seconds = ?, message_count = ?, status = 'completed'
          WHERE id = ?
        `).bind(
                Date.now(),
                state.stats.duration,
                state.stats.messageCount,
                state.sessionId
            ).run();
        } catch (e) { console.warn("DB Update failed", e) }

        // Send final stats to client
        this.send(ws, {
            type: 'session_ended',
            stats: state.stats,
        });

        this.sessions.delete(ws);
    }

    private async loadAgent(agentId: string): Promise<AgentConfig | null> {
        try {
            const result = await this.env.DB.prepare(`
          SELECT id, name, system_prompt, voice_id, llm_model, voice_config
          FROM agents
          WHERE id = ?
        `).bind(agentId).first();

            if (!result) return {
                // Mock fallback if not found in DB for testing
                id: agentId,
                name: 'Demo Agent',
                systemPrompt: 'You are a helpful assistant.',
                voiceId: 'aura-asteria-en',
                llmModel: 'claude-3-haiku-20240307',
                voiceConfig: {}
            };

            return {
                id: result.id as string,
                name: result.name as string,
                systemPrompt: result.system_prompt as string,
                voiceId: result.voice_id as string,
                llmModel: result.llm_model as string,
                voiceConfig: result.voice_config ? JSON.parse(result.voice_config as string) : {},
            };
        } catch (e) {
            console.warn("Agent load failed, using mock", e);
            return {
                id: agentId,
                name: 'Demo Agent',
                systemPrompt: 'You are a helpful assistant.',
                voiceId: 'aura-asteria-en',
                llmModel: 'claude-3-haiku-20240307',
                voiceConfig: {}
            };
        }
    }

    private send(ws: WebSocket, message: ServerMessage) {
        try {
            ws.send(JSON.stringify(message));
        } catch (error) {
            console.error('[VoiceSessionUnified] Failed to send message:', error);
        }
    }
}

interface SessionState {
    sessionId: string;
    agentId: string;
    agent: AgentConfig;
    conversationHistory: Message[];
    currentSpeaker: 'user' | 'agent' | 'none';
    startTime: number;
    stats: SessionStats;
    config: any;
    pipelineConnection?: WebSocket;
}
