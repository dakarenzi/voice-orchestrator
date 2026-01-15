import { STTConfig, TranscriptChunk } from '../../contracts/voice-types';

export class DeepgramSTTProvider {
    private apiKey: string;
    private readonly baseUrl = 'wss://api.deepgram.com/v1/listen';

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async createStream(
        config: STTConfig | undefined,
        onTranscript: (chunk: TranscriptChunk) => void,
        onError: (error: Error) => void
    ): Promise<WritableStream<Uint8Array>> {
        const params = new URLSearchParams({
            model: config?.model || 'nova-2',
            language: config?.language || 'en',
            smart_format: config?.smart_format ? 'true' : 'true',
            punctuate: config?.punctuate ? 'true' : 'true',
            interim_results: config?.interim_results ? 'true' : 'true',
            endpointing: config?.endpointing ? config.endpointing.toString() : '300',
            vad_events: config?.vad_events ? 'true' : 'true',
            encoding: 'linear16',
            sample_rate: '16000', // Assuming 16k sample rate from client
        });

        const socket = new WebSocket(`${this.baseUrl}?${params.toString()}`, [
            'token',
            this.apiKey
        ]);

        socket.onopen = () => {
            console.log('[Deepgram STT] Connected');
        };

        socket.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.channel?.alternatives?.[0]) {
                    const alt = data.channel.alternatives[0];
                    if (alt.transcript) {
                        onTranscript({
                            text: alt.transcript,
                            isFinal: data.is_final,
                            speechFinal: data.speech_final
                        });
                    }
                }
            } catch (e) {
                console.error('[Deepgram STT] Parse error:', e);
            }
        };

        socket.onerror = (error) => {
            console.error('[Deepgram STT] WebSocket Error:', error);
            onError(new Error('Deepgram STT WebSocket Error'));
        };

        socket.onclose = () => {
            console.log('[Deepgram STT] WebSocket Closed');
        };

        // Return a WritableStream that sends audio to this socket
        return new WritableStream({
            write(chunk: Uint8Array) {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(chunk);
                }
            },
            close() {
                if (socket.readyState === WebSocket.OPEN) {
                    // Send standard close frame to Deepgram
                    socket.send(JSON.stringify({ type: 'CloseStream' }));
                    socket.close();
                }
            },
            abort(reason) {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.close();
                }
            }
        });

    }
}
