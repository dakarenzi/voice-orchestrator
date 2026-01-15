
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
        name: 'Deepgram Asteria',
        provider: 'deepgram',
        externalId: 'aura-asteria-en', // Correct Aura model ID
        gender: 'female',
        accent: 'American',
        description: 'Balanced and clear. Good for general purpose.',
        previewUrl: '#',
        tags: ['balanced', 'clear']
    }
];

class VoiceStore {
    voices = $state<VoiceProfile[]>(MOCK_VOICES);
    selectedVoiceId = $state<string | null>(null);
    isPlaying = $state<string | null>(null); // ID of voice currently playing
    audioElement: HTMLAudioElement | null = null;

    get selectedVoice() {
        return this.voices.find(v => v.id === this.selectedVoiceId);
    }

    async playPreview(id: string) {
        // Stop current if playing
        if (this.isPlaying) {
            this.audioElement?.pause();
            const wasPlaying = this.isPlaying;
            this.isPlaying = null;
            if (wasPlaying === id) return; // Toggle off
        }

        this.isPlaying = id;
        const voice = this.voices.find(v => v.id === id);
        if (!voice) return;

        try {
            const response = await fetch('/api/voice/voices/preview', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    voiceId: voice.externalId,
                    text: `Hello, I am ${voice.name}. This is a preview of my voice.`
                })
            });

            if (!response.ok) throw new Error('Preview failed');

            const blob = await response.blob();
            const url = URL.createObjectURL(blob);

            this.audioElement = new Audio(url);
            this.audioElement.onended = () => {
                if (this.isPlaying === id) this.isPlaying = null;
            };
            await this.audioElement.play();

        } catch (e) {
            console.error('Failed to play preview', e);
            this.isPlaying = null;
        }
    }

    setFilter(query: string) {
        // Simple client-side search logic could go here
    }
}

export const voiceStore = new VoiceStore();
