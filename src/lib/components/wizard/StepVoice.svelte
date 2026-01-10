<script lang="ts">
    import { wizardStore } from "$lib/stores/wizardStore.svelte";
    import { voiceStore } from "$lib/stores/voiceStore.svelte";
    import { Play, Pause, Check } from "lucide-svelte";
    import Button from "$lib/components/ui/Button.svelte";

    // In a real app, you might want to filter voices here based on role
</script>

<div class="space-y-6">
    <div class="text-center space-y-2 mb-8">
        <h2 class="text-2xl font-bold">Choose a Voice</h2>
        <p class="text-muted-foreground">
            Select the voice that best fits your brand.
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each voiceStore.voices as voice}
            <div
                class={`group relative rounded-xl border p-4 cursor-pointer transition-all ${
                    wizardStore.data.voiceId === voice.id
                        ? "border-primary ring-1 ring-primary bg-primary/5"
                        : "hover:border-primary/50"
                }`}
                onclick={() => (wizardStore.data.voiceId = voice.id)}
            >
                <div class="flex justify-between items-start">
                    <div class="flex items-center gap-3">
                        <div
                            class="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold"
                        >
                            {voice.name.charAt(0)}
                        </div>
                        <div>
                            <div class="font-semibold">{voice.name}</div>
                            <div
                                class="text-xs text-muted-foreground capitalize"
                            >
                                {voice.gender} • {voice.accent}
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="ghost"
                        size="icon"
                        class="h-8 w-8 rounded-full"
                        onclick={(e: MouseEvent) => {
                            e.stopPropagation();
                            voiceStore.playPreview(voice.id);
                        }}
                    >
                        {#if voiceStore.isPlaying === voice.id}
                            <Pause size={16} />
                        {:else}
                            <Play size={16} />
                        {/if}
                    </Button>
                </div>

                <p class="text-xs text-muted-foreground mt-3 line-clamp-2">
                    {voice.description}
                </p>

                {#if wizardStore.data.voiceId === voice.id}
                    <div
                        class="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-0.5"
                    >
                        <Check size={12} />
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>
