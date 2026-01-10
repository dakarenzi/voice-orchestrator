<script lang="ts">
    import { wizardStore } from "$lib/stores/wizardStore.svelte";
    import Label from "$lib/components/ui/Label.svelte";
    import { Sparkles } from "lucide-svelte";
</script>

<div class="space-y-6">
    <div class="text-center space-y-2 mb-8">
        <h2 class="text-2xl font-bold">Define the Behavior</h2>
        <p class="text-muted-foreground">
            How should your agent act and speak?
        </p>
    </div>

    <div class="bg-card p-6 rounded-xl border shadow-sm space-y-4">
        <div class="flex justify-between items-center">
            <Label>System Prompt / Core Instructions</Label>
            <button
                class="text-xs text-primary flex items-center gap-1 hover:underline"
            >
                <Sparkles size={12} /> Generate with AI
            </button>
        </div>

        <textarea
            bind:value={wizardStore.data.systemPrompt}
            class="min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="You are a helpful assistant for Acme Corp. You answer calls politely..."
        ></textarea>

        <div class="bg-muted/50 p-4 rounded-lg text-xs space-y-2">
            <p class="font-medium">Tips for a good prompt:</p>
            <ul class="list-disc list-inside space-y-1 text-muted-foreground">
                <li>Clearly state the agent's name and company.</li>
                <li>Define the tone (e.g., "Professional but friendly").</li>
                <li>Outline the main goal of the conversation.</li>
                <li>Specify what to do if the user asks for a human.</li>
            </ul>
        </div>
    </div>
</div>
