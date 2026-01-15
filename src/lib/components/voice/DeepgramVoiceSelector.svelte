<script lang="ts">
    import { onMount } from "svelte";

    interface DeepgramVoice {
        name: string;
        canonical_name: string;
        gender: "male" | "female";
        accent: string;
    }

    let voices: DeepgramVoice[] = [];
    export let selectedVoice: DeepgramVoice | null = null;
    let isPlaying = false;
    let audioElement: HTMLAudioElement;

    onMount(async () => {
        // Assuming proxy or direct call
        const response = await fetch("/api/voice/voices");
        const data = await response.json();
        voices = data.voices;
    });

    async function previewVoice(voice: DeepgramVoice) {
        if (isPlaying) {
            audioElement?.pause();
            isPlaying = false;
            return;
        }

        isPlaying = true;

        const response = await fetch("/api/voice/voices/preview", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                voiceId: voice.canonical_name,
            }),
        });

        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);

        audioElement = new Audio(audioUrl);
        audioElement.onended = () => {
            isPlaying = false;
        };
        await audioElement.play();
    }

    function selectVoice(voice: DeepgramVoice) {
        selectedVoice = voice;
        // Dispatch event using standard DOM event or Svelte dispatch
        // Svelte 4/5 way: Create CustomEvent
        const event = new CustomEvent("voiceSelected", { detail: voice });
        // In Svelte file, we can use createEventDispatcher but the user code used dispatchEvent(event) which is native
        // I'll stick to user code but ensure it works in Svelte context.
        const element = document.querySelector(".voice-selector");
        if (element) {
            element.dispatchEvent(event);
        }
    }

    // Group voices by gender
    $: femaleVoices = voices.filter((v) => v.gender === "female");
    $: maleVoices = voices.filter((v) => v.gender === "male");
</script>

<div class="voice-selector">
    <h2>Choose a Voice</h2>
    <p class="subtitle">Select the voice that best fits your brand.</p>

    {#if femaleVoices.length > 0}
        <div class="voice-section">
            <h3>Female Voices</h3>
            <div class="voice-grid">
                {#each femaleVoices as voice}
                    <div
                        class="voice-card"
                        class:selected={selectedVoice?.canonical_name ===
                            voice.canonical_name}
                        on:click={() => selectVoice(voice)}
                        on:keydown={(e) =>
                            e.key === "Enter" && selectVoice(voice)}
                        role="button"
                        tabindex="0"
                    >
                        <div class="voice-header">
                            <div class="voice-avatar">
                                {voice.name[0]}
                            </div>
                            <div class="voice-info">
                                <h4>{voice.name}</h4>
                                <p class="accent">{voice.accent}</p>
                            </div>
                            <button
                                class="play-btn"
                                on:click|stopPropagation={() =>
                                    previewVoice(voice)}
                                aria-label="Preview voice"
                            >
                                {isPlaying ? "⏸" : "▶"}
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}

    {#if maleVoices.length > 0}
        <div class="voice-section">
            <h3>Male Voices</h3>
            <div class="voice-grid">
                {#each maleVoices as voice}
                    <div
                        class="voice-card"
                        class:selected={selectedVoice?.canonical_name ===
                            voice.canonical_name}
                        on:click={() => selectVoice(voice)}
                        on:keydown={(e) =>
                            e.key === "Enter" && selectVoice(voice)}
                        role="button"
                        tabindex="0"
                    >
                        <div class="voice-header">
                            <div class="voice-avatar">
                                {voice.name[0]}
                            </div>
                            <div class="voice-info">
                                <h4>{voice.name}</h4>
                                <p class="accent">{voice.accent}</p>
                            </div>
                            <button
                                class="play-btn"
                                on:click|stopPropagation={() =>
                                    previewVoice(voice)}
                                aria-label="Preview voice"
                            >
                                {isPlaying ? "⏸" : "▶"}
                            </button>
                        </div>
                    </div>
                {/each}
            </div>
        </div>
    {/if}
</div>

<style>
    .voice-selector {
        padding: 2rem;
    }

    h2 {
        font-size: 2rem;
        font-weight: 700;
        margin-bottom: 0.5rem;
    }

    .subtitle {
        color: #666;
        margin-bottom: 2rem;
    }

    .voice-section {
        margin-bottom: 3rem;
    }

    .voice-section h3 {
        font-size: 1.25rem;
        font-weight: 600;
        margin-bottom: 1rem;
    }

    .voice-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
    }

    .voice-card {
        border: 2px solid #e5e5e5;
        border-radius: 12px;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.2s;
    }

    .voice-card:hover {
        border-color: #3b82f6;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
    }

    .voice-card.selected {
        border-color: #3b82f6;
        background: #eff6ff;
    }

    .voice-header {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .voice-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 1.5rem;
        font-weight: 600;
    }

    .voice-info {
        flex: 1;
    }

    .voice-info h4 {
        font-size: 1.125rem;
        font-weight: 600;
        margin-bottom: 0.25rem;
    }

    .accent {
        font-size: 0.875rem;
        color: #666;
    }

    .play-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: #3b82f6;
        color: white;
        font-size: 1.25rem;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .play-btn:hover {
        background: #2563eb;
        transform: scale(1.05);
    }
</style>
