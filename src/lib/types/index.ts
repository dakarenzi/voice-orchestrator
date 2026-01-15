export type AgentStatus = 'idle' | 'active' | 'error' | 'maintenance';
export type Channel = 'web' | 'phone' | 'whatsapp';
export type MessageRole = 'user' | 'agent' | 'system';

export interface Tenant {
  id: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  createdAt: number;
  updatedAt: number;
}

export interface User {
  id: string;
  tenantId: string;
  email: string;
  name?: string;
  role: 'owner' | 'admin' | 'member';
  createdAt: number;
  updatedAt: number;
}

export interface VoiceConfig {
  id: string;
  provider: 'deepgram' | 'elevenlabs' | 'cartesia' | 'inworld';
  voiceId: string;
  displayName: string;
  gender?: 'male' | 'female' | 'neutral';
  accent?: string;
  description?: string;
  latencyTier: 'ultra-fast' | 'fast' | 'balanced' | 'quality';
  costTier: 'economy' | 'standard' | 'premium';
  isFeatured: boolean;
  previewUrl?: string;
  metadata?: Record<string, any>;
  createdAt: number;
}

export interface AgentConfig {
  voiceProvider: 'deepgram' | 'elevenlabs' | 'cartesia' | 'inworld';
  voiceId: string;
  voiceConfig?: Record<string, any>;
  llmProvider: 'anthropic' | 'openai';
  llmModel: string;
  systemPrompt: string;
}

export interface Agent {
  id: string;
  tenantId: string;
  name: string;
  description?: string;

  // Flattened config for easier access, but stored structurally
  voiceProvider: string;
  voiceId: string;
  voiceConfig?: Record<string, any>;
  llmProvider: string;
  llmModel: string;
  systemPrompt: string;

  tools: string[];
  channels: Channel[];

  status: AgentStatus;
  templateId?: string;

  createdAt: number;
  updatedAt: number;
}

export interface AgentSession {
  id: string;
  agentId: string;
  channel: Channel;
  userIdentifier?: string;

  startedAt: number;
  endedAt?: number;

  messageCount: number;
  durationSeconds?: number;
  tokenUsage?: {
    input: number;
    output: number;
  };

  status: 'active' | 'completed' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  total?: number;
  limit: number;
  offset: number;
}

