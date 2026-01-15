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

// Flattened Agent Schema
export interface Agent {
    id: string;
    tenantId: string;
    name: string;
    description?: string;

    // Voice
    voiceProvider: string;
    voiceId: string;
    voiceConfig?: Record<string, any>;

    // LLM
    llmProvider: string;
    llmModel: string;
    systemPrompt: string;

    // Config
    tools: string[];
    channels: string[];

    status: AgentStatus;
    templateId?: string;

    createdAt: number;
    updatedAt: number;
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
