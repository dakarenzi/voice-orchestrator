
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
            // Mock API call
            console.log('Saving agent:', $state.snapshot(this.data));
            await new Promise(r => setTimeout(r, 1000));
            goto('/app/agents');
        } finally {
            this.isSaving = false;
        }
    }
}

export const wizardStore = new WizardStore();
