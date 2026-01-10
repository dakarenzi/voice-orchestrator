
import { describe, it, expect } from 'vitest';
import { mapTemplateToAgent } from './template-mapper';
import type { AgentTemplate } from '../../types/template';

// Mock template for testing
const mockTemplate: AgentTemplate = {
    id: 'test_tpl',
    name: 'Test Agent',
    slug: 'test-agent',
    industry: 'retail',
    useCase: 'inbound-support',
    description: 'Test Description',
    tags: ['test'],
    config: {
        channels: {
            voiceInbound: true,
            voiceOutbound: false,
            webChat: true,
            whatsapp: false,
            social: false
        },
        pipeline: {
            sttProvider: 'deepgram',
            llmProvider: 'anthropic',
            llmModel: 'claude-3-5-sonnet',
            ttsProvider: 'elevenlabs'
        },
        behavior: {
            systemPrompt: 'Test Prompt',
            tone: ['friendly'],
            fallbackRules: 'Fallback',
            escalationTriggers: ['Escalate']
        },
        knowledge: {
            sources: [],
            defaultContext: 'Context'
        },
        voice: {
            defaultVoiceProfileId: 'voice_123',
            voiceDescription: 'Voice Desc',
            allowCustomVoice: true
        }
    },
    isPublic: true,
    usageCount: 0,
    featured: false,
    createdAt: '',
    updatedAt: ''
};

describe('mapTemplateToAgent', () => {
    it('maps basic fields correctly', () => {
        const agent = mapTemplateToAgent(mockTemplate, 'org_123', 'user_456');
        expect(agent.name).toBe('Test Agent');
        expect(agent.orgId).toBe('org_123');
        expect(agent.status).toBe('inactive');
    });

    it('maps pipeline config correctly', () => {
        const agent = mapTemplateToAgent(mockTemplate, 'org_123', 'user_456');
        expect(agent.config.llmProvider).toBe('anthropic');
        expect(agent.config.voiceProvider).toBe('elevenlabs');
        expect(agent.config.sttProvider).toBe('deepgram');
    });

    it('maps voice profile correctly', () => {
        const agent = mapTemplateToAgent(mockTemplate, 'org_123', 'user_456');
        expect(agent.config.voiceId).toBe('voice_123');
    });

    it('constructs specific system prompt', () => {
        const agent = mapTemplateToAgent(mockTemplate, 'org_123', 'user_456');
        expect(agent.config.systemPrompt).toContain('Test Prompt');
        expect(agent.config.systemPrompt).toContain('Tone: friendly');
    });
});
