import { DeepgramSTTProvider } from './stt';
import { DeepgramTTSProvider } from './tts';
import { STTConfig, TTSConfig, TranscriptChunk } from '../../contracts/voice-types';

interface Env {
    DEEPGRAM_API_KEY: string;
}

/**
 * Unified Deepgram provider that handles both STT and TTS
 * Optimized for single-provider workflows with minimal latency
 */
export class DeepgramUnifiedProvider {
    private stt: DeepgramSTTProvider;
    private tts: DeepgramTTSProvider;

    constructor(apiKey: string) {
        this.stt = new DeepgramSTTProvider(apiKey);
        this.tts = new DeepgramTTSProvider(apiKey);
    }

    /**
     * Create a full voice conversation pipeline
     * Audio in -> Transcript -> Your LLM -> Audio out
     */
    async createVoicePipeline(config: {
        sttConfig?: STTConfig;
        ttsConfig?: Omit<TTSConfig, 'text'>;
        onTranscript: (chunk: TranscriptChunk) => void;
        onAudioChunk: (audio: Uint8Array) => void;
        onError: (error: Error) => void;
    }) {
        // Create STT stream
        const sttStream = await this.stt.createStream(
            config.sttConfig,
            config.onTranscript,
            config.onError
        );

        return {
            // Write audio to STT
            writeAudio: async (audioChunk: Uint8Array) => {
                const writer = sttStream.getWriter();
                await writer.write(audioChunk);
                writer.releaseLock();
            },

            // Synthesize response and stream audio out
            synthesizeResponse: async (text: string) => {
                const ttsConfig = { ...config.ttsConfig, text } as TTSConfig & { text: string };

                for await (const audioChunk of this.tts.streamSynthesize(ttsConfig)) {
                    config.onAudioChunk(audioChunk);
                }
            },

            // Close the pipeline
            close: async () => {
                const writer = sttStream.getWriter();
                await writer.close();
            },
        };
    }

    /**
     * Get both STT and TTS providers
     */
    getProviders() {
        return {
            stt: this.stt,
            tts: this.tts,
        };
    }

    /**
     * Calculate total cost for a conversation turn
     */
    estimateTurnCost(audioSeconds: number, responseText: string): {
        stt: number;
        tts: number;
        total: number;
    } {
        // Deepgram STT: ~$0.0043 per minute for Nova-2
        const sttCost = (audioSeconds / 60) * 0.0043;

        // Deepgram TTS: ~$0.015 per 1k characters
        const ttsCost = this.tts.estimateCost(responseText);

        return {
            stt: sttCost,
            tts: ttsCost,
            total: sttCost + ttsCost,
        };
    }
}

// Cloudflare Worker handler for unified endpoint
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // Health check
        if (url.pathname === '/health') {
            return Response.json({ status: 'ok', provider: 'deepgram-unified' });
        }

        // Get available voices for TTS
        if (url.pathname === '/voices' && request.method === 'GET') {
            const provider = new DeepgramUnifiedProvider(env.DEEPGRAM_API_KEY);
            const voices = await provider.getProviders().tts.listVoices();
            return Response.json({ voices });
        }

        // Preview voice
        if (url.pathname === '/voices/preview' && request.method === 'POST') {
            const provider = new DeepgramUnifiedProvider(env.DEEPGRAM_API_KEY);
            const { voiceId, text } = await request.json();
            const audio = await provider.getProviders().tts.previewVoice(voiceId, text);

            return new Response(audio, {
                headers: {
                    'Content-Type': 'audio/wav',
                    'Cache-Control': 'public, max-age=3600',
                },
            });
        }

        // Full-duplex voice pipeline WebSocket
        if (url.pathname === '/pipeline') {
            if (request.headers.get('Upgrade') !== 'websocket') {
                return new Response('Expected WebSocket', { status: 426 });
            }

            const pair = new WebSocketPair();
            const [client, server] = Object.values(pair);

            server.accept();

            const provider = new DeepgramUnifiedProvider(env.DEEPGRAM_API_KEY);
            let pipeline: Awaited<ReturnType<typeof provider.createVoicePipeline>> | null = null;

            server.addEventListener('message', async (event) => {
                try {
                    const message = JSON.parse(event.data as string);

                    if (message.type === 'start') {
                        pipeline = await provider.createVoicePipeline({
                            sttConfig: message.sttConfig,
                            ttsConfig: message.ttsConfig,

                            onTranscript: (chunk) => {
                                server.send(JSON.stringify({
                                    type: 'transcript',
                                    data: chunk,
                                }));
                            },

                            onAudioChunk: (audio) => {
                                const base64 = btoa(String.fromCharCode(...audio));
                                server.send(JSON.stringify({
                                    type: 'audio',
                                    data: base64,
                                }));
                            },

                            onError: (error) => {
                                server.send(JSON.stringify({
                                    type: 'error',
                                    message: error.message,
                                }));
                            },
                        });

                        server.send(JSON.stringify({ type: 'ready' }));
                    } else if (message.type === 'audio' && pipeline) {
                        const audioData = Uint8Array.from(atob(message.data), c => c.charCodeAt(0));
                        await pipeline.writeAudio(audioData);
                    } else if (message.type === 'synthesize' && pipeline) {
                        await pipeline.synthesizeResponse(message.text);
                        server.send(JSON.stringify({ type: 'synthesis_complete' }));
                    } else if (message.type === 'stop' && pipeline) {
                        await pipeline.close();
                        pipeline = null;
                    }
                } catch (error) {
                    console.error('[Unified Pipeline] Error:', error);
                    server.send(JSON.stringify({
                        type: 'error',
                        message: error instanceof Error ? error.message : 'Unknown error',
                    }));
                }
            });

            server.addEventListener('close', async () => {
                if (pipeline) {
                    await pipeline.close();
                }
            });

            return new Response(null, { status: 101, webSocket: client });
        }

        return new Response('Not found', { status: 404 });
    },
};
