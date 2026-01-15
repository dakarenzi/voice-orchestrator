import { z } from 'zod';

// Flattened schema for production
export const CreateAgentSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional(),

  // Flattened Config
  voiceProvider: z.enum(['deepgram', 'elevenlabs', 'cartesia', 'inworld']),
  voiceId: z.string().min(1),
  voiceConfig: z.record(z.any()).optional(),

  llmProvider: z.enum(['anthropic', 'openai']),
  llmModel: z.string().default('gpt-4-turbo'),
  systemPrompt: z.string().min(10),

  tools: z.array(z.string()).default([]),
  channels: z.array(z.enum(['web', 'phone', 'whatsapp'])).default(['web']),

  templateId: z.string().optional()
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