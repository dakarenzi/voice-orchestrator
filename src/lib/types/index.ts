export type AgentStatus = 'active' | 'inactive' | 'maintenance';
export type Channel = 'web' | 'phone' | 'whatsapp';
export type CallStatus = 'active' | 'completed' | 'failed';
export type MessageRole = 'user' | 'agent' | 'system';

export interface AgentConfig {
  voiceProvider: 'elevenlabs' | 'cartesia' | 'google';
  voiceId: string;
  sttProvider: 'deepgram';
  llmProvider: 'inworld' | 'openai';
  systemPrompt: string;
}

export interface Agent {
  id: string;
  orgId: string;
  name: string;
  phoneNumber?: string;
  config: AgentConfig;
  status: AgentStatus;
  createdAt: number;
  updatedAt?: number;
}

export interface Conversation {
  id: string;
  agentId: string;
  agentName?: string; // Joined field
  channel: Channel;
  sessionId?: string;
  status: CallStatus;
  metadata?: Record<string, any>;
  startedAt: number;
  endedAt?: number;
  durationSeconds?: number; // Calculated
}

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  audioUrl?: string;
  timestamp: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  limit: number;
  offset: number;
}

export interface TelnyxEvent {
  data: {
    event_type: string;
    id: string;
    payload: {
      call_control_id: string;
      connection_id: string;
      from: string;
      to: string;
      direction: 'inbound' | 'outbound';
      state: string;
    };
  };
}
