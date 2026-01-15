export interface STTConfig {
    model?: string;
    language?: string;
    smart_format?: boolean;
    punctuate?: boolean;
    interim_results?: boolean;
    endpointing?: number;
    vad_events?: boolean;
    encoding?: string;
    sample_rate?: number;
}

export interface TTSConfig {
    voiceId?: string;
    text?: string;
    model?: string;
    encoding?: string;
    sample_rate?: number;
    container?: string;
    bit_rate?: number;
}

export interface AudioChunk {
    data: string; // base64
}

export interface TranscriptChunk {
    text: string;
    isFinal: boolean;
    speechFinal?: boolean;
    confidence?: number;
}

export interface ClientMessage {
    type: 'start_session' | 'audio_chunk' | 'text_input' | 'interrupt' | 'end_session';
    agentId?: string;
    config?: any;
    audio?: string; // base64
    text?: string;
}

export interface ServerMessage {
    type: 'session_started' | 'transcript' | 'audio_chunk' | 'audio_complete' | 'session_ended' | 'error' | 'thinking' | 'agent_speaking' | 'interrupted';
    sessionId?: string;
    text?: string;
    isFinal?: boolean;
    audio?: string;
    format?: 'pcm16';
    stats?: SessionStats;
    message?: string;
}

export interface SessionStats {
    duration: number;
    messageCount: number;
    audioInputDuration: number;
    audioOutputDuration: number;
    sttCost: number;
    ttsCost: number;
    llmCost: number;
}
