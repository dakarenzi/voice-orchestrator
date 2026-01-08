import { z } from 'zod';

export const AgentConfigSchema = z.object({
  voiceProvider: z.enum(['elevenlabs', 'cartesia', 'google']),
  voiceId: z.string().min(1),
  sttProvider: z.enum(['deepgram']),
  llmProvider: z.enum(['inworld', 'openai']),
  systemPrompt: z.string()
});

export const CreateAgentSchema = z.object({
  name: z.string().min(2).max(50),
  phoneNumber: z.string().optional(),
  config: AgentConfigSchema
});

export const UpdateAgentSchema = CreateAgentSchema.partial().extend({
  status: z.enum(['active', 'inactive', 'maintenance']).optional()
});

export const CreateConversationSchema = z.object({
  agentId: z.string().uuid(),
  channel: z.enum(['web', 'phone', 'whatsapp']),
  metadata: z.record(z.any()).optional()
});

export const EnvSchema = z.object({
  DB: z.any(),
  TELNYX_API_KEY: z.string().min(1),
  DEEPGRAM_API_KEY: z.string().min(1),
  INWORLD_API_KEY: z.string().min(1),
  ELEVENLABS_API_KEY: z.string().min(1)
});