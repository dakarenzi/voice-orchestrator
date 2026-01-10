<script lang="ts">
    import { wizardStore } from "$lib/stores/wizardStore.svelte";
    import { voiceStore } from "$lib/stores/voiceStore.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import { User, Mic, Brain, ScrollText } from "lucide-svelte";

    const selectedVoice = $derived(
        voiceStore.voices.find((v) => v.id === wizardStore.data.voiceId),
    );
</script>

<div class="space-y-6">
    <div class="text-center space-y-2 mb-8">
        <h2 class="text-2xl font-bold">Review & Create</h2>
        <p class="text-muted-foreground">
            Ready to bring <strong>{wizardStore.data.name}</strong> to life?
        </p>
    </div>

    <div class="grid gap-4 max-w-2xl mx-auto">
        <Card class="p-6 space-y-4">
            <div class="flex items-center gap-4">
                <div
                    class="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                >
                    <User size={24} />
                </div>
                <div>
                    <h3 class="font-bold">{wizardStore.data.name}</h3>
                    <p class="text-sm text-muted-foreground">
                        {wizardStore.data.role}
                    </p>
                </div>
            </div>

            <div class="grid grid-cols-2 gap-4 py-4 border-t border-b">
                <div class="space-y-1">
                    <span
                        class="text-xs text-muted-foreground flex items-center gap-1"
                        ><Mic size={12} /> Voice</span
                    >
                    <p class="font-medium text-sm">
                        {selectedVoice?.name || "None"}
                    </p>
                </div>
                <div class="space-y-1">
                    <span
                        class="text-xs text-muted-foreground flex items-center gap-1"
                        ><Brain size={12} /> Brain</span
                    >
                    <p class="font-medium text-sm capitalize">
                        {wizardStore.data.llmProvider}
                    </p>
                </div>
            </div>

            <div class="space-y-2">
                <span
                    class="text-xs text-muted-foreground flex items-center gap-1"
                    ><ScrollText size={12} /> System Prompt</span
                >
                <p class="text-xs bg-muted p-3 rounded-md line-clamp-3 italic">
                    {wizardStore.data.systemPrompt}
                </p>
            </div>
        </Card>
    </div>
</div>
