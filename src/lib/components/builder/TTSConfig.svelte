<script lang="ts">
  import { builderStore } from "$lib/stores/agentBuilder";
  import { Volume2, Play } from "lucide-svelte";

  // Mock voice lists
  const voices = {
    elevenlabs: [
      { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel" },
      { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi" },
      { id: "EXAVITQu4vr4xnSDxMaL", name: "Bella" },
    ],
    cartesia: [
      { id: "sales-voice-v1", name: "Sales Professional" },
      { id: "support-calm", name: "Calm Support" },
    ],
    google: [{ id: "en-US-Neural2-A", name: "US English Neural A" }],
  };

  let provider = $derived(
    $builderStore.agent.config?.voiceProvider || "elevenlabs",
  );
  let availableVoices = $derived(voices[provider as keyof typeof voices] || []);
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-bold mb-1">Voice Synthesis</h3>
    <p class="text-sm text-muted-foreground">Choose how the agent sounds.</p>
  </div>

  <div class="p-4 border rounded-xl bg-card/50 space-y-4 shadow-sm">
    <div class="flex items-center gap-3 pb-4 border-b">
      <div
        class="p-2.5 bg-pink-100 dark:bg-pink-500/20 text-pink-600 dark:text-pink-400 rounded-lg"
      >
        <Volume2 size={20} />
      </div>
      <div>
        <div class="font-bold capitalize">{provider}</div>
        <div class="text-xs text-muted-foreground">Active Provider</div>
      </div>
    </div>

    <div class="space-y-4">
      <div class="space-y-2">
        <label class="text-sm font-medium" for="voice-select"
          >Select Voice</label
        >
        <div class="flex gap-2">
          <div class="relative flex-1">
            <select
              id="voice-select"
              class="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none"
              value={$builderStore.agent.config?.voiceId}
              onchange={(e) =>
                builderStore.updateConfig("voiceId", e.currentTarget.value)}
            >
              {#each availableVoices as voice}
                <option value={voice.id}>{voice.name}</option>
              {/each}
            </select>
            <!-- Custom chevron could go here -->
          </div>
          <button
            class="h-10 w-10 flex items-center justify-center rounded-md border bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors"
            aria-label="Preview Voice"
          >
            <Play size={16} class="ml-0.5" />
          </button>
        </div>
      </div>

      <div class="space-y-2">
        <div class="flex justify-between items-center">
          <label class="text-sm font-medium" for="stability">Stability</label>
          <span class="text-xs font-mono bg-muted px-2 py-0.5 rounded">0.5</span
          >
        </div>
        <input
          id="stability"
          type="range"
          min="0"
          max="1"
          step="0.1"
          value="0.5"
          class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        />
      </div>
    </div>
  </div>
</div>
