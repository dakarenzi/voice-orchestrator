import type { STTService } from '../types';

export class DeepgramService implements STTService {
    private apiKey: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
    }

    async *transcribeStream(audioStream: ReadableStream<Uint8Array>): AsyncGenerator<string> {
        // Agent Task: Implement Deepgram streaming websocket connection here
        // For now, yield mock data
        yield "Hello";
        yield " world";
        yield " this is a transcription.";
    }
}
