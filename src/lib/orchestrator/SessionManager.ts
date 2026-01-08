import type { AgentConfig } from '$lib/types';
import type { STTService, LLMService, TTSService } from './types';
import { DeepgramService } from './services/stt';
import { InworldService } from './services/llm';
import { ElevenLabsService } from './services/tts';

export class SessionManager {
    private stt: STTService;
    private llm: LLMService;
    private tts: TTSService;

    constructor(env: App.Platform['env']) {
        // Initialize services with env vars
        this.stt = new DeepgramService(env.DEEPGRAM_API_KEY || 'mock');
        this.llm = new InworldService(env.INWORLD_API_KEY || 'mock', env.INWORLD_SCENE || 'workspace');
        this.tts = new ElevenLabsService(env.ELEVENLABS_API_KEY || 'mock');
    }

    async handleInputText(text: string, sessionId: string): Promise<string> {
        console.log(`[Session ${sessionId}] Processing text: ${text}`);
        const response = await this.llm.generateResponse(text);
        return response as string;
    }

    async handleAudioStream(stream: ReadableStream, sessionId: string) {
        console.log(`[Session ${sessionId}] Processing audio stream`);
        // Pipeline: Audio -> STT -> LLM -> TTS -> Audio
    }
}
