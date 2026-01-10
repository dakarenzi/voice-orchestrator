<script lang="ts">
    import { wizardStore } from "$lib/stores/wizardStore.svelte";
    import Label from "$lib/components/ui/Label.svelte";
    import Select from "$lib/components/ui/Select.svelte";
</script>

<div class="space-y-6">
    <div class="text-center space-y-2 mb-8">
        <h2 class="text-2xl font-bold">Connect Intelligence</h2>
        <p class="text-muted-foreground">
            Select the brain powering your agent.
        </p>
    </div>

    <div class="max-w-md mx-auto space-y-4">
        <div class="space-y-2">
            <Label>LLM Provider</Label>
            <Select bind:value={wizardStore.data.llmProvider}>
                <option value="inworld">Inworld AI (Contextual)</option>
                <option value="openai">OpenAI GPT-4o</option>
                <option value="anthropic">Anthropic Claude 3.5 Sonnet</option>
            </Select>
            <p class="text-xs text-muted-foreground">
                Inworld is recommended for character-based agents. GPT-4o is
                best for logic/tasks.
            </p>
        </div>

        <!-- Future: API Key input if needed -->
    </div>
</div>
