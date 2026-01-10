<script lang="ts">
    import { Label } from "$lib/components/ui/label";
    import { Slider } from "$lib/components/ui/slider";
    import { Button } from "$lib/components/ui/button";
    import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from "$lib/components/ui/select";
    import { Play, Pause, Mic2, Activity } from "lucide-svelte";
    import type { WizardData } from "$lib/types/schemas";

    export let data: Partial<WizardData["step4"]>;

    // Mock voice list - usually fetched from API
    const voices = [
        {
            id: "ErXwobaYiN019PkySvjV",
            name: "Rachel",
            gender: "Female",
            style: "Professional",
        },
        {
            id: "21m00Tcm4TlvDq8ikWAM",
            name: "Josh",
            gender: "Male",
            style: "Calm",
        },
        {
            id: "AZnzlk1XvdvUeBnXmlld",
            name: "Domi",
            gender: "Female",
            style: "Energetic",
        },
        {
            id: "EXAVITQu4vr4xnSDxMaL",
            name: "Bella",
            gender: "Female",
            style: "Soft",
        },
    ];

    let playing = false;

    function togglePreview() {
        playing = !playing;
        // Simulate audio playback stop after 3s
        if (playing) {
            setTimeout(() => (playing = false), 3000);
        }
    }
</script>

<div class="space-y-8">
    <div class="space-y-2 text-center mb-8">
        <h3 class="text-2xl font-semibold">Voice & Personality</h3>
        <p class="text-muted-foreground">
            Choose how your AI agent sounds to customers.
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Voice Selection -->
        <div class="space-y-6">
            <div class="space-y-2">
                <Label>Select Voice</Label>
                <Select
                    selected={{
                        value: data.voiceId,
                        label: voices.find((v) => v.id === data.voiceId)?.name,
                    }}
                    onSelectedChange={(v) => (data.voiceId = v?.value)}
                >
                    <SelectTrigger class="w-full">
                        <SelectValue placeholder="Choose a voice" />
                    </SelectTrigger>
                    <SelectContent>
                        {#each voices as voice}
                            <SelectItem value={voice.id}>
                                <div
                                    class="flex items-center justify-between w-full min-w-[200px]"
                                >
                                    <span>{voice.name}</span>
                                    <span
                                        class="text-xs text-muted-foreground ml-2"
                                        >({voice.gender} - {voice.style})</span
                                    >
                                </div>
                            </SelectItem>
                        {/each}
                    </SelectContent>
                </Select>
            </div>

            <div
                class="bg-card border rounded-xl p-6 flex flex-col items-center justify-center space-y-4 min-h-[160px]"
            >
                {#if data.voiceId}
                    <div
                        class="relative w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                    >
                        {#if playing}
                            <span
                                class="absolute inset-0 rounded-full animate-ping bg-primary/20"
                            ></span>
                        {/if}
                        <Mic2 class="w-8 h-8 text-primary relative z-10" />
                    </div>

                    <div class="text-center space-y-1">
                        <h4 class="font-medium">
                            {voices.find((v) => v.id === data.voiceId)?.name}
                        </h4>
                        <p class="text-xs text-muted-foreground">
                            High quality • English (US)
                        </p>
                    </div>

                    <Button
                        variant="outline"
                        size="sm"
                        class="rounded-full"
                        onclick={togglePreview}
                    >
                        {#if playing}
                            <Pause class="w-4 h-4 mr-2" /> Stop
                        {:else}
                            <Play class="w-4 h-4 mr-2" /> Preview Voice
                        {/if}
                    </Button>
                {:else}
                    <p class="text-muted-foreground text-sm">
                        Select a voice to preview
                    </p>
                {/if}
            </div>
        </div>

        <!-- Settings -->
        <div class="space-y-6">
            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <Label>Speed (Rate)</Label>
                    <span class="text-xs text-muted-foreground"
                        >{data.speed}x</span
                    >
                </div>
                <Slider
                    bind:value={[data.speed]}
                    min={0.5}
                    max={1.5}
                    step={0.1}
                />
            </div>

            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <Label>Pitch</Label>
                    <span class="text-xs text-muted-foreground"
                        >{data.pitch > 0 ? "+" : ""}{data.pitch}</span
                    >
                </div>
                <Slider bind:value={[data.pitch]} min={-10} max={10} step={1} />
            </div>

            <div class="space-y-4">
                <div class="flex justify-between items-center">
                    <Label>Stability</Label>
                    <span class="text-xs text-muted-foreground"
                        >{Math.round(data.stability * 100)}%</span
                    >
                </div>
                <Slider
                    bind:value={[data.stability]}
                    min={0}
                    max={1}
                    step={0.05}
                />
                <p class="text-[0.7rem] text-muted-foreground">
                    Lower stability = more emotion (but wilder). Higher = more
                    robotic/consistent.
                </p>
            </div>
        </div>
    </div>
</div>
