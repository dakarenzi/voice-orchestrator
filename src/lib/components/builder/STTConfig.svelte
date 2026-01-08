
<script lang="ts">
  import { builderStore } from '$lib/stores/agentBuilder';
  import { Mic, Settings2 } from 'lucide-svelte';
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-medium mb-2">Speech to Text</h3>
    <p class="text-sm text-muted-foreground mb-4">Configure how the agent listens to input.</p>
  </div>

  <div class="p-4 border rounded-lg bg-card space-y-4">
    <div class="flex items-center gap-3 mb-4">
      <div class="p-2 bg-orange-100 text-orange-600 rounded-lg">
        <Mic size={24} />
      </div>
      <div>
        <div class="font-medium capitalize">{$builderStore.agent.config?.sttProvider}</div>
        <div class="text-xs text-muted-foreground">Current Provider</div>
      </div>
    </div>

    {#if $builderStore.agent.config?.sttProvider === 'deepgram'}
      <div class="space-y-3">
        <div class="space-y-1">
          <label class="text-sm font-medium">Model</label>
          <select class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <option value="nova-2">Nova-2 (Recommended)</option>
            <option value="nova">Nova</option>
            <option value="general">General</option>
          </select>
        </div>
        
        <div class="space-y-1">
          <label class="text-sm font-medium">Language</label>
          <select class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
            <option value="en-US">English (US)</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>

        <div class="flex items-center justify-between pt-2">
           <label class="text-sm">Smart Formatting</label>
           <input type="checkbox" checked class="accent-primary" />
        </div>
        <div class="flex items-center justify-between">
           <label class="text-sm">Endpointing (VAD)</label>
           <input type="number" value="300" class="w-20 rounded-md border px-2 py-1 text-sm" />
        </div>
      </div>
    {/if}
  </div>
</div>
