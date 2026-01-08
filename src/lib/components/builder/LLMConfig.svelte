
<script lang="ts">
  import { builderStore } from '$lib/stores/agentBuilder';
  import { Brain, Sparkles } from 'lucide-react';
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-medium mb-2">Intelligence</h3>
    <p class="text-sm text-muted-foreground mb-4">Define the agent's personality and knowledge.</p>
  </div>

  <div class="p-4 border rounded-lg bg-card space-y-4">
    <div class="flex items-center gap-3 mb-4">
      <div class="p-2 bg-purple-100 text-purple-600 rounded-lg">
        <Brain size={24} />
      </div>
      <div>
        <div class="font-medium capitalize">{$builderStore.agent.config?.llmProvider}</div>
        <div class="text-xs text-muted-foreground">Current Provider</div>
      </div>
    </div>

    <div class="space-y-3">
      <div class="space-y-1">
        <label class="text-sm font-medium">System Prompt</label>
        <textarea 
          class="flex min-h-[200px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring font-mono"
          placeholder="You are a helpful assistant..."
          bind:value={$builderStore.agent.config!.systemPrompt}
          on:input={(e) => builderStore.updateConfig('systemPrompt', e.currentTarget.value)}
        ></textarea>
        <p class="text-xs text-muted-foreground">Instructions for how the agent should behave.</p>
      </div>

      <div class="space-y-1">
        <label class="text-sm font-medium">Temperature</label>
        <div class="flex items-center gap-4">
          <input type="range" min="0" max="1" step="0.1" value="0.7" class="flex-1" />
          <span class="text-sm w-8">0.7</span>
        </div>
      </div>
    </div>
  </div>
</div>
