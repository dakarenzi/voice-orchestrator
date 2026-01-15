
import type { Agent } from '$lib/types';
import { goto } from '$app/navigation';

export type WizardStep =
    | 'identity'
    | 'behavior'
    | 'voice'
    | 'knowledge'
    | 'connect'
    | 'handoff'
    | 'review';

export const STEPS: WizardStep[] = [
    'identity',
    'behavior',
    'voice',
    'knowledge',
    'connect',
    'handoff',
    'review'
];

interface WizardData {
    name: string;
    role: string; // e.g., 'Customer Support', 'Sales'
    systemPrompt: string;
    voiceId: string;
    knowledgeBase: string; // Placeholder for file ID or text
    llmProvider: 'inworld' | 'openai' | 'anthropic';
    handoffRules: string;
}

const DEFAULT_DATA: WizardData = {
    name: '',
    role: '',
    systemPrompt: 'You are a helpful AI assistant.',
    voiceId: '',
    knowledgeBase: '',
    llmProvider: 'inworld',
    handoffRules: ''
};

class WizardStore {
    currentStep = $state<WizardStep>('identity');
    data = $state<WizardData>({ ...DEFAULT_DATA });
    isSaving = $state(false);

    get progress() {
        const index = STEPS.indexOf(this.currentStep);
        return Math.round(((index + 1) / STEPS.length) * 100);
    }

    get canGoNext() {
        switch (this.currentStep) {
            case 'identity': return this.data.name.length > 2;
            case 'behavior': return this.data.systemPrompt.length > 10;
            case 'voice': return !!this.data.voiceId;
            // Other steps optional for now
            default: return true;
        }
    }

    setStep(step: WizardStep) {
        this.currentStep = step;
        // Update URL query param logic could go here
    }

    next() {
        const index = STEPS.indexOf(this.currentStep);
        if (index < STEPS.length - 1) {
            this.setStep(STEPS[index + 1]);
        }
    }

    back() {
        const index = STEPS.indexOf(this.currentStep);
        if (index > 0) {
            this.setStep(STEPS[index - 1]);
        }
    }

    reset() {
        this.data = { ...DEFAULT_DATA };
        this.currentStep = 'identity';
    }

    async save() {
        this.isSaving = true;
        try {
            // Find the selected voice to get its provider
            const voiceStoreModule = await import('./voiceStore.svelte');
            const voiceStore = voiceStoreModule.voiceStore;
            const selectedVoice = voiceStore.voices.find(v => v.id === this.data.voiceId);

            // Construct payload matching flattened CreateAgentSchema
            const payload = {
                name: this.data.name,
                description: `Agent for ${this.data.role}`,

                voiceProvider: selectedVoice?.provider || 'elevenlabs',
                voiceId: selectedVoice?.externalId || this.data.voiceId || 'default',
                voiceConfig: {},

                llmProvider: this.data.llmProvider === 'anthropic' ? 'openai' : this.data.llmProvider,
                llmModel: 'gpt-4-turbo',
                systemPrompt: this.data.systemPrompt,

                tools: [],
                channels: ['web'],
                templateId: undefined
            };

            const response = await fetch('/api/agents', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                console.error('Failed to create agent:', error);
                throw new Error(error.error || 'Failed to create agent');
            }

            const result = await response.json();
            console.log('Agent created:', result);

            // Wait a small delay to ensure DB propagation if needed, then redirect
            await new Promise(r => setTimeout(r, 500));
            goto('/app/agents');
        } catch (error) {
            console.error('Error saving agent:', error);
            alert('Failed to save agent. Please try again.'); // Simple error feedback
        } finally {
            this.isSaving = false;
        }
    }
}

export const wizardStore = new WizardStore();
