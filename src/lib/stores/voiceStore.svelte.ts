
export interface VoiceProfile {
    id: string;
    name: string;
    provider: 'elevenlabs' | 'cartesia' | 'deepgram' | 'google';
    externalId: string;
    gender: 'male' | 'female' | 'neutral';
    accent: string;
    description: string;
    previewUrl: string;
    tags: string[];
}

const MOCK_VOICES: VoiceProfile[] = [
    {
        id: 'v1',
        name: 'Professional Sarah',
        provider: 'elevenlabs',
        externalId: '21m00Tcm4TlvDq8ikWAM',
        gender: 'female',
        accent: 'American',
        description: 'Warm, professional, and articulate. Perfect for customer support.',
        previewUrl: '#',
        tags: ['business', 'calm', 'support']
    },
    {
        id: 'v2',
        name: 'Casual Adam',
        provider: 'elevenlabs',
        externalId: 'pNInz6obpgDQGcFmaJgB',
        gender: 'male',
        accent: 'American',
        description: 'Friendly, deep, and conversational. Great for sales and casual chat.',
        previewUrl: '#',
        tags: ['sales', 'deep', 'friendly']
    },
    {
        id: 'v3',
        name: 'Fast Cartesia',
        provider: 'cartesia',
        externalId: 'cartesia-fast-1',
        gender: 'female',
        accent: 'British',
        description: 'Extremely low latency. Robotic but very fast.',
        previewUrl: '#',
        tags: ['fast', 'robotic']
    },
    {
        id: 'v4',
        name: 'Deepgram Nova',
        provider: 'deepgram',
        externalId: 'nova-2',
        gender: 'neutral',
        accent: 'Transatlantic',
        description: 'Balanced and clear. Good for general purpose.',
        previewUrl: '#',
        tags: ['balanced', 'clear']
    }
];

class VoiceStore {
    voices = $state<VoiceProfile[]>(MOCK_VOICES);
    selectedVoiceId = $state<string | null>(null);
    isPlaying = $state<string | null>(null); // ID of voice currently playing

    get selectedVoice() {
        return this.voices.find(v => v.id === this.selectedVoiceId);
    }

    playPreview(id: string) {
        if (this.isPlaying === id) {
            this.isPlaying = null;
            // Stop audio logic would go here
        } else {
            this.isPlaying = id;
            // Play audio logic would go here
            // Mock stop after 3s
            setTimeout(() => {
                if (this.isPlaying === id) this.isPlaying = null;
            }, 3000);
        }
    }

    setFilter(query: string) {
        // Simple client-side search logic could go here
    }
}

export const voiceStore = new VoiceStore();
