
<script lang="ts">
  import { builderStore } from '$lib/stores/agentBuilder';
  import { Volume2, Play } from 'lucide-svelte';

  // Mock voice lists
  const voices = {
    elevenlabs: [
      { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
      { id: 'AZnzlk1XvdvUeBnXmlld', name: 'Domi' },
      { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella' }
    ],
    cartesia: [
      { id: 'sales-voice-v1', name: 'Sales Professional' },
      { id: 'support-calm', name: 'Calm Support' }
    ],
    google: [
        { id: 'en-US-Neural2-A', name: 'US English Neural A' }
    ]
  };

  $: provider = $builderStore.agent.config?.voiceProvider || 'elevenlabs';
  $: availableVoices = voices[provider as keyof typeof voices] || [];
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-medium mb-2">Voice Synthesis</h3>
    <p class="text-sm text-muted-foreground mb-4">Choose how the agent sounds.</p>
  </div>

  <div class="p-4 border rounded-lg bg-card space-y-4">
    <div class="flex items-center gap-3 mb-4">
      <div class="p-2 bg-pink-100 text-pink-600 rounded-lg">
        <Volume2 size={24} />
      </div>
      <div>
        <div class="font-medium capitalize">{provider}</div>
        <div class="text-xs text-muted-foreground">Current Provider</div>
      </div>
    </div>

    <div class="space-y-3">
      <div class="space-y-1">
        <label class="text-sm font-medium">Select Voice</label>
        <div class="flex gap-2">
          <select 
            class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            value={$builderStore.agent.config?.voiceId}
            on:change={(e) => builderStore.updateConfig('voiceId', e.currentTarget.value)}
          >
            {#each availableVoices as voice}
              <option value={voice.id}>{voice.name}</option>
            {/each}
          </select>
          <button class="h-9 w-9 flex items-center justify-center rounded-md border bg-secondary hover:bg-secondary/80">
            <Play size={14} />
          </button>
        </div>
      </div>

      <div class="space-y-1">
        <label class="text-sm font-medium">Stability</label>
        <input type="range" min="0" max="1" step="0.1" value="0.5" class="w-full" />
      </div>
    </div>
  </div>
</div>
