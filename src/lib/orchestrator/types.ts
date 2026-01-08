import type { AgentConfig } from '$lib/types';

export interface AudioBuffer {
    data: Uint8Array;
    encoding: 'pcm_s16le' | 'mulaw';
    sampleRate: number;
}

export interface OrchestratorEvent {
    type: 'input.text' | 'input.audio' | 'control.start' | 'control.stop';
    payload: any;
    sessionId: string;
}

export interface STTService {
    transcribeStream(audioStream: ReadableStream<Uint8Array>): AsyncGenerator<string>;
}

export interface LLMService {
    generateResponse(input: string, context?: any): Promise<string | AsyncGenerator<string>>;
}

export interface TTSService {
    generateSpeech(text: string, voiceId: string): Promise<AudioBuffer>;
    streamSpeech(textStream: AsyncGenerator<string>, voiceId: string): AsyncGenerator<AudioBuffer>;
}
