import { TTSConfig, AudioChunk } from '../../contracts/voice-types';

interface Env {
    DEEPGRAM_API_KEY: string;
}

interface DeepgramTTSRequest {
    text: string;
    model?: string;
    encoding?: string;
    sample_rate?: number;
    container?: string;
    bit_rate?: number;
}

interface DeepgramVoice {
    name: string;
    canonical_name: string;
    gender: 'male' | 'female';
    language: string;
    accent: string;
    model_name: string;
}

/**
 * Deepgram Aura TTS Provider
 * Models: aura-asteria-en, aura-luna-en, aura-stella-en, aura-athena-en, 
 *         aura-hera-en, aura-orion-en, aura-arcas-en, aura-perseus-en, aura-angus-en, aura-orpheus-en, aura-helios-en, aura-zeus-en
 */
export class DeepgramTTSProvider {
    private apiKey: string;
    private readonly baseUrl = 'https://api.deepgram.com/v1/speak';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    /**
     * List available Aura voices
     */
    async listVoices(): Promise<DeepgramVoice[]> {
        // Deepgram Aura voices (as of 2024)
        return [
            {
                name: 'Asteria',
                canonical_name: 'aura-asteria-en',
                gender: 'female',
                language: 'en',
                accent: 'American',
                model_name: 'aura-asteria-en',
            },
            {
                name: 'Luna',
                canonical_name: 'aura-luna-en',
                gender: 'female',
                language: 'en',
                accent: 'American',
                model_name: 'aura-luna-en',
            },
            {
                name: 'Stella',
                canonical_name: 'aura-stella-en',
                gender: 'female',
                language: 'en',
                accent: 'American',
                model_name: 'aura-stella-en',
            },
            {
                name: 'Athena',
                canonical_name: 'aura-athena-en',
                gender: 'female',
                language: 'en',
                accent: 'British',
                model_name: 'aura-athena-en',
            },
            {
                name: 'Hera',
                canonical_name: 'aura-hera-en',
                gender: 'female',
                language: 'en',
                accent: 'American',
                model_name: 'aura-hera-en',
            },
            {
                name: 'Orion',
                canonical_name: 'aura-orion-en',
                gender: 'male',
                language: 'en',
                accent: 'American',
                model_name: 'aura-orion-en',
            },
            {
                name: 'Arcas',
                canonical_name: 'aura-arcas-en',
                gender: 'male',
                language: 'en',
                accent: 'American',
                model_name: 'aura-arcas-en',
            },
            {
                name: 'Perseus',
                canonical_name: 'aura-perseus-en',
                gender: 'male',
                language: 'en',
                accent: 'American',
                model_name: 'aura-perseus-en',
            },
            {
                name: 'Angus',
                canonical_name: 'aura-angus-en',
                gender: 'male',
                language: 'en',
                accent: 'Irish',
                model_name: 'aura-angus-en',
            },
            {
                name: 'Orpheus',
                canonical_name: 'aura-orpheus-en',
                gender: 'male',
                language: 'en',
                accent: 'American',
                model_name: 'aura-orpheus-en',
            },
            {
                name: 'Helios',
                canonical_name: 'aura-helios-en',
                gender: 'male',
                language: 'en',
                accent: 'British',
                model_name: 'aura-helios-en',
            },
            {
                name: 'Zeus',
                canonical_name: 'aura-zeus-en',
                gender: 'male',
                language: 'en',
                accent: 'American',
                model_name: 'aura-zeus-en',
            },
        ];
    }

    /**
     * Generate preview audio for a voice
     */
    async previewVoice(voiceModel: string, text?: string): Promise<ArrayBuffer> {
        const sampleText = text ||
            "Hello! This is a preview of my voice. I can help with customer support, sales, and more.";

        return await this.synthesize({
            text: sampleText,
            voiceId: voiceModel,
        });
    }

    /**
     * Synthesize speech (non-streaming)
     * Returns audio in specified format
     */
    async synthesize(config: TTSConfig & { text: string }): Promise<ArrayBuffer> {
        const params = new URLSearchParams({
            model: config.voiceId || 'aura-asteria-en',
            encoding: 'linear16', // or 'mp3', 'opus', 'aac', 'flac'
            sample_rate: '24000',
            container: 'wav', // 'wav', 'none'
        });

        const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: config.text,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Deepgram TTS error: ${response.status} - ${error}`);
        }

        return await response.arrayBuffer();
    }

    /**
     * Stream synthesis for real-time playback
     * Deepgram Aura supports streaming with very low latency
     */
    async *streamSynthesize(config: TTSConfig & { text: string }): AsyncGenerator<Uint8Array> {
        const params = new URLSearchParams({
            model: config.voiceId || 'aura-asteria-en',
            encoding: 'linear16',
            sample_rate: '16000', // Match STT sample rate for consistency
            container: 'none',
        });

        const response = await fetch(`${this.baseUrl}?${params.toString()}`, {
            method: 'POST',
            headers: {
                'Authorization': `Token ${this.apiKey}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                text: config.text,
            }),
        });

        if (!response.ok) {
            // Try to read the error body if possible
            let errorMsg = `Deepgram TTS stream error: ${response.status}`;
            try {
                const errorText = await response.text();
                if (errorText) errorMsg += ` - ${errorText}`;
            } catch (e) { }
            throw new Error(errorMsg);
        }

        if (!response.body) {
            throw new Error('Response body is null');
        }

        const reader = response.body.getReader();

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                if (value) yield value;
            }
        } finally {
            reader.releaseLock();
        }
    }

    /**
     * Calculate estimated cost for TTS
     * Deepgram Aura pricing: ~$0.015 per 1,000 characters (pay-as-you-go)
     * Growth plan: ~$0.012 per 1,000 characters
     */
    estimateCost(text: string, plan: 'payg' | 'growth' = 'payg'): number {
        const charCount = text.length;
        const costPer1kChars = plan === 'payg' ? 0.015 : 0.012;
        return (charCount / 1000) * costPer1kChars;
    }

    /**
     * Get metadata about request
     */
    async getRequestMetadata(response: Response): Promise<{
        modelUuid: string;
        charCount: number;
        transferEncoding: string;
        date: string;
    }> {
        return {
            modelUuid: response.headers.get('dg-model-uuid') || '',
            charCount: parseInt(response.headers.get('dg-char-count') || '0'),
            transferEncoding: response.headers.get('transfer-encoding') || '',
            date: response.headers.get('date') || '',
        };
    }
}

// Cloudflare Worker handler
export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);
        const provider = new DeepgramTTSProvider(env.DEEPGRAM_API_KEY);

        try {
            // List voices
            if (url.pathname === '/voices' && request.method === 'GET') {
                const voices = await provider.listVoices();
                return Response.json({ voices });
            }

            // Preview voice
            if (url.pathname === '/voices/preview' && request.method === 'POST') {
                const { voiceId, text } = await request.json();
                const audio = await provider.previewVoice(voiceId, text);

                return new Response(audio, {
                    headers: {
                        'Content-Type': 'audio/wav',
                        'Cache-Control': 'public, max-age=3600',
                    },
                });
            }

            // Synthesize (non-streaming)
            if (url.pathname === '/synthesize' && request.method === 'POST') {
                const config = await request.json();
                const audio = await provider.synthesize(config);

                return new Response(audio, {
                    headers: {
                        'Content-Type': 'audio/wav',
                        'X-Sample-Rate': '24000',
                        'X-Encoding': 'linear16',
                    },
                });
            }

            // Stream synthesis
            if (url.pathname === '/synthesize/stream' && request.method === 'POST') {
                const config = await request.json();

                const stream = new ReadableStream({
                    async start(controller) {
                        try {
                            for await (const chunk of provider.streamSynthesize(config)) {
                                controller.enqueue(chunk);
                            }
                            controller.close();
                        } catch (error) {
                            controller.error(error);
                        }
                    },
                });

                return new Response(stream, {
                    headers: {
                        'Content-Type': 'audio/l16',
                        'X-Sample-Rate': '16000',
                        'X-Channels': '1',
                        'X-Encoding': 'linear16',
                    },
                });
            }

            // Estimate cost
            if (url.pathname === '/cost/estimate' && request.method === 'POST') {
                const { text, plan } = await request.json();
                const cost = provider.estimateCost(text, plan);
                return Response.json({ cost, characters: text.length });
            }

            return new Response('Not found', { status: 404 });
        } catch (error) {
            console.error('[Deepgram TTS Worker] Error:', error);
            return Response.json(
                { error: error instanceof Error ? error.message : 'Unknown error' },
                { status: 500 }
            );
        }
    },
};
