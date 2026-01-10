import type { Agent, AgentConfig } from '$lib/types/index';
import type { AgentTemplate } from '$lib/types/template';

/**
 * Transforms an AgentTemplate into a new Agent configuration.
 * Handles both V1 (nested config) and V2 (flat) schemas.
 * 
 * @param template The source AgentTemplate
 * @param orgId The organization ID creating the agent
 * @param userId The user ID requesting the creation
 * @returns A partial Agent object ready for insertion (excluding ID and timestamps)
 */
export function mapTemplateToAgent(
    template: AgentTemplate,
    orgId: string,
    userId: string
): Omit<Agent, 'id' | 'createdAt' | 'updatedAt'> {

    const t = template as any; // Cast to any to handle hybrid schemas safely

    // Helper to get nested or flat config
    const pipeline = t.pipeline || t.config?.pipeline || {};
    const voice = t.voice || t.config?.voice || {};
    const behavior = t.behavior || t.config?.behavior || {};

    // 1. Map Configuration
    const agentConfig: AgentConfig = {
        // 1.1 Voice Mapping
        voiceProvider: (pipeline.ttsProvider as any) || 'elevenlabs',
        voiceId: (voice.voiceId || voice.defaultVoiceProfileId) || 'default-voice-id', // V2 uses voiceId, V1 used defaultVoiceProfileId

        // 1.2 STT Mapping
        sttProvider: 'deepgram',

        // 1.3 LLM Mapping
        llmProvider: (pipeline.llmProvider as any) || 'inworld',

        // 1.4 Behavior / Prompt Mapping
        systemPrompt: buildSystemPrompt(t),
    };

    // 2. Return the new Agent object
    return {
        orgId: orgId,
        name: template.name,
        status: 'inactive',
        config: agentConfig,
    };
}

/**
 * Helper to construct the full system prompt from template behavior settings.
 */
function buildSystemPrompt(template: any): string {
    const behavior = template.behavior || template.config?.behavior || {};

    const systemPrompt = behavior.systemPrompt || '';

    // V1 used array, V2 uses object. handle both or V2 specific structures
    // V2 personality is an object, V1 tone was an array
    let toneInstruction = '';

    if (Array.isArray(behavior.tone)) {
        toneInstruction = `Tone: ${behavior.tone.join(', ')}.`;
    } else if (behavior.personality?.tone) {
        toneInstruction = `Tone: ${behavior.personality.tone}.`;
    }

    const escalationTriggers = behavior.escalationTriggers || behavior.guardrails?.alwaysEscalateTo || [];
    const escalationInstruction = Array.isArray(escalationTriggers) && escalationTriggers.length > 0
        ? `Escalation Triggers: ${escalationTriggers.join(', ')}.`
        : '';

    const fallbackRules = behavior.fallbackRules || (behavior.conversationFlow?.fallbackResponses ? "Use fallback responses provided." : "");

    return `
${systemPrompt}

${toneInstruction}
${fallbackRules ? `Fallback Rules: ${fallbackRules}` : ''}
${escalationInstruction}
`.trim();
}
