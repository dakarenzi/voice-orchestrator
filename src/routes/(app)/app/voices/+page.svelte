<script lang="ts">
    import { voiceStore } from "$lib/stores/voiceStore.svelte";
    import { Search, Play, Pause, BadgeCheck } from "lucide-svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";

    let searchQuery = $state("");

    // Derived filtered voices
    let filteredVoices = $derived(
        voiceStore.voices.filter(
            (v) =>
                v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                v.tags.some((t) =>
                    t.toLowerCase().includes(searchQuery.toLowerCase()),
                ),
        ),
    );
</script>

<div class="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
    <div
        class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
    >
        <div>
            <h2 class="text-3xl font-bold tracking-tight text-txt-primary">
                Voice Library
            </h2>
            <p class="text-txt-muted mt-2">
                Browse and preview available voices for your agents.
            </p>
        </div>
        <div class="relative w-full md:w-72">
            <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted"
                size={16}
            />
            <Input
                placeholder="Search voices..."
                class="pl-9"
                bind:value={searchQuery}
            />
        </div>
    </div>

    {#if filteredVoices.length === 0}
        <div class="text-center py-12 text-txt-muted">
            No voices found matching "{searchQuery}"
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each filteredVoices as voice}
                <div
                    class="group relative rounded-xl border border-brd-default bg-bg-surface text-txt-primary shadow-sm hover:shadow-md transition-all"
                >
                    <div class="p-6 space-y-4">
                        <div class="flex justify-between items-start">
                            <div class="space-y-1">
                                <h3
                                    class="font-semibold text-lg flex items-center gap-2 text-txt-primary"
                                >
                                    {voice.name}
                                    {#if voice.provider === "elevenlabs"}
                                        <BadgeCheck
                                            size={16}
                                            class="text-status-info"
                                        />
                                    {/if}
                                </h3>
                                <p class="text-xs text-txt-muted capitalize">
                                    {voice.gender} • {voice.accent}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                class="rounded-full bg-acn-primary/10 text-acn-primary hover:bg-acn-primary/20 hover:scale-110 transition-all font-bold"
                                onclick={() => voiceStore.playPreview(voice.id)}
                            >
                                {#if voiceStore.isPlaying === voice.id}
                                    <Pause size={20} />
                                {:else}
                                    <Play size={20} />
                                {/if}
                            </Button>
                        </div>

                        <p class="text-sm text-txt-muted line-clamp-2">
                            {voice.description}
                        </p>

                        <div class="flex flex-wrap gap-2 pt-2">
                            {#each voice.tags as tag}
                                <Badge variant="outline" class="text-xs">
                                    {tag}
                                </Badge>
                            {/each}
                        </div>
                    </div>

                    <div
                        class="px-6 py-4 border-t border-brd-default bg-bg-surface-raised rounded-b-xl flex justify-between items-center"
                    >
                        <span
                            class="text-xs font-medium text-txt-muted uppercase tracking-wider"
                        >
                            {voice.provider}
                        </span>
                        <Button variant="outline" size="sm" class="h-8">
                            Select
                        </Button>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
