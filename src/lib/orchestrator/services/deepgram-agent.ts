import type { Agent } from '$lib/types';

export interface DeepgramAgentConfig {
    apiKey: string;
    agent: Agent;
}

export class DeepgramOrchestrator {
    private ws: WebSocket | null = null;
    private apiKey: string;
    private agent: Agent;

    constructor(config: DeepgramAgentConfig) {
        this.apiKey = config.apiKey;
        this.agent = config.agent;
    }

    /**
     * Connects to Deepgram Voice Agent API.
     * url: wss://agent.deepgram.com/agent
     */
    async connect(): Promise<WebSocket> {
        const url = 'wss://agent.deepgram.com/agent';

        // Deepgram expects config as query params or initial message.
        // For the Agent API, we often pass model/voice in the URL or headers.
        // NOTE: Standard browser WebSocket doesn't support headers easily, 
        // but since this runs on Cloudflare Workers, we can use the standard WebSocket API.

        // Construct URL with configuration
        // Reference: Deepgram flow usually involves setting options in the initial connect
        const params = new URLSearchParams({
            model: this.agent.voiceConfig?.model || 'nova-2', // STT Model
            voice: this.agent.voiceId || 'aura-asteria-en', // TTS Voice
        });

        // Add additional configuration for independent agent thinking if supported via URL
        // or we might need to send a "Configure" message after connection.

        this.ws = new WebSocket(`${url}?${params.toString()}`, [
            'token',
            this.apiKey
        ]);

        return new Promise((resolve, reject) => {
            if (!this.ws) return reject('WebSocket not initialized');

            this.ws.onopen = () => {
                console.log('Connected to Deepgram Agent API');
                this.configureSession();
                resolve(this.ws!);
            };

            this.ws.onerror = (err) => {
                console.error('Deepgram WebSocket Error:', err);
                reject(err);
            };

            this.ws.onclose = () => {
                console.log('Deepgram WebSocket Closed');
            };

            this.ws.onmessage = (event) => {
                this.handleMessage(event);
            };
        });
    }

    /**
     * Sends initial configuration (System Prompt, etc).
     */
    private configureSession() {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        // Send System Prompt and other "context" setup
        // Protocol details depend on Deepgram Agent API specific JSON messages
        const configMessage = {
            type: 'SettingsConfiguration',
            audio: {
                input: {
                    encoding: 'linear16',
                    sample_rate: 8000 // Telnyx usually is 8000 or 16000
                },
                output: {
                    encoding: 'mulaw', // Telephony standard
                    sample_rate: 8000
                }
            },
            agent: {
                think: {
                    provider: {
                        type: 'open_ai'
                    },
                    model: this.agent.llmModel || 'gpt-4-turbo',
                    instructions: this.agent.systemPrompt
                }
            }
        };

        this.ws.send(JSON.stringify(configMessage));
    }

    /**
     * Handles incoming messages from Deepgram (Audio, Text, Metrics).
     */
    private handleMessage(event: MessageEvent) {
        // Parse message
        // If audio -> forward to Telnyx (caller of this orchestrator handles this via callback?)
        // Ideally this class should expose an onAudio callback
    }

    public sendAudio(chunk: ArrayBuffer) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this.ws.send(chunk);
        }
    }
}
