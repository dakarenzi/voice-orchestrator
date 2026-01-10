<script lang="ts">
  import { builderStore } from "$lib/stores/agentBuilder";
  import { Brain } from "lucide-svelte";
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-bold mb-1">Intelligence</h3>
    <p class="text-sm text-muted-foreground">
      Define the agent's personality and knowledge.
    </p>
  </div>

  <div class="p-4 border rounded-xl bg-card/50 space-y-4 shadow-sm">
    <div class="flex items-center gap-3 pb-4 border-b">
      <div
        class="p-2.5 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg"
      >
        <Brain size={20} />
      </div>
      <div>
        <div class="font-bold capitalize">
          {$builderStore.agent.config?.llmProvider}
        </div>
        <div class="text-xs text-muted-foreground">Active Provider</div>
      </div>
    </div>

    <div class="space-y-4">
      <div class="space-y-2">
        <label class="text-sm font-medium" for="system-prompt"
          >System Prompt</label
        >
        <textarea
          id="system-prompt"
          class="flex min-h-[200px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 font-mono"
          placeholder="You are a helpful assistant..."
          bind:value={$builderStore.agent.config!.systemPrompt}
          oninput={(e) =>
            builderStore.updateConfig("systemPrompt", e.currentTarget.value)}
        ></textarea>
        <p class="text-xs text-muted-foreground">
          Instructions for how the agent should behave.
        </p>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium" for="temp">Temperature</label>
          <span class="text-xs font-mono bg-muted px-2 py-0.5 rounded">0.7</span
          >
        </div>
        <input
          id="temp"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value="0.7"
          class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
    </div>
  </div>
</div>
