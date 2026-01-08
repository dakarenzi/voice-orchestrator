export type AgentStatus = 'active' | 'inactive' | 'maintenance';
export type CallStatus = 'active' | 'completed' | 'failed';
export type Speaker = 'user' | 'agent' | 'system';

export interface AgentConfig {
    voiceProvider: 'elevenlabs' | 'cartesia' | 'google';
    voiceId: string;
    sttProvider: 'deepgram';
    llmProvider: 'inworld';
    systemPrompt: string;
}

export interface Agent {
    id: string;
    name: string;
    config: AgentConfig;
    status: AgentStatus;
    created_at: number;
}

export interface Message {
    id: string;
    speaker: Speaker;
    text: string;
    timestamp: number;
}

export interface Conversation {
    id: string;
    agentId: string;
    agentName: string;
    channel: 'web' | 'phone';
    status: CallStatus;
    startedAt: number;
    durationSeconds: number;
    messages: Message[];
    metadata?: {
        recordingUrl?: string;
    };
}
