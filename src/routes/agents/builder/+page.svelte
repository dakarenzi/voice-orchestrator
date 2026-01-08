
<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  
  // Stores and State
  let step = 1;
  let loading = false;
  let error = '';
  
  let agent = {
    name: '',
    status: 'inactive',
    config: {
      voiceProvider: 'elevenlabs',
      voiceId: '',
      sttProvider: 'deepgram',
      llmProvider: 'inworld',
      systemPrompt: ''
    }
  };

  async function saveAgent() {
    loading = true;
    try {
      const res = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(agent)
      });
      
      if (!res.ok) throw new Error('Failed to save agent');
      
      goto('/agents');
    } catch (e: any) {
      error = e.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="max-w-4xl mx-auto py-8 px-4">
  <div class="flex items-center justify-between mb-8">
    <h1 class="text-2xl font-bold">Create New Agent</h1>
    <div class="text-sm text-gray-500">Step {step} of 4</div>
  </div>

  {#if error}
    <div class="bg-red-100 text-red-700 p-4 rounded mb-4">{error}</div>
  {/if}

  <div class="bg-white rounded-lg shadow-sm border p-6">
    {#if step === 1}
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Basic Information</h2>
        <div>
          <label class="block text-sm font-medium mb-1">Agent Name</label>
          <input type="text" bind:value={agent.name} class="w-full border rounded p-2" placeholder="e.g. Support Bot" />
        </div>
      </div>
    {:else if step === 2}
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Speech Recognition (STT)</h2>
        <div class="p-4 border rounded bg-blue-50 text-blue-800">
          Using <strong>Deepgram Nova-2</strong> for ultra-low latency transcription.
        </div>
      </div>
    {:else if step === 3}
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Intelligence (LLM)</h2>
        <div>
          <label class="block text-sm font-medium mb-1">System Prompt</label>
          <textarea bind:value={agent.config.systemPrompt} class="w-full border rounded p-2 h-40" placeholder="You are..."></textarea>
        </div>
      </div>
    {:else if step === 4}
      <div class="space-y-4">
        <h2 class="text-xl font-semibold">Voice Synthesis (TTS)</h2>
        <div>
          <label class="block text-sm font-medium mb-1">Provider</label>
          <select bind:value={agent.config.voiceProvider} class="w-full border rounded p-2">
            <option value="elevenlabs">ElevenLabs</option>
            <option value="cartesia">Cartesia</option>
          </select>
        </div>
        <div>
           <label class="block text-sm font-medium mb-1">Voice ID</label>
           <input type="text" bind:value={agent.config.voiceId} class="w-full border rounded p-2" />
        </div>
      </div>
    {/if}

    <div class="flex justify-between mt-8 pt-4 border-t">
      <button class="px-4 py-2 border rounded" on:click={() => step = Math.max(1, step - 1)} disabled={step === 1}>Previous</button>
      {#if step < 4}
        <button class="px-4 py-2 bg-black text-white rounded" on:click={() => step = Math.min(4, step + 1)}>Next</button>
      {:else}
        <button class="px-4 py-2 bg-green-600 text-white rounded" on:click={saveAgent} disabled={loading}>
          {loading ? 'Saving...' : 'Create Agent'}
        </button>
      {/if}
    </div>
  </div>
</div>
