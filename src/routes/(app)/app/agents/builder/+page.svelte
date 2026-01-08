<script lang="ts">
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { builderStore } from "$lib/stores/agentBuilder";
  import {
    Mic,
    Brain,
    Volume2,
    Globe,
    Save,
    ArrowLeft,
    MessageSquare,
    Settings,
    GripVertical,
    Check,
    Activity,
  } from "lucide-svelte";

  // Import sub-components
  import ChannelConfig from "$lib/components/builder/ChannelConfig.svelte";
  import STTConfig from "$lib/components/builder/STTConfig.svelte";
  import LLMConfig from "$lib/components/builder/LLMConfig.svelte";
  import TTSConfig from "$lib/components/builder/TTSConfig.svelte";

  // Providers Palette
  const providers = [
    {
      type: "stt",
      id: "deepgram",
      name: "Deepgram",
      icon: Mic,
      color: "text-orange-600 bg-orange-100",
    },
    {
      type: "llm",
      id: "inworld",
      name: "Inworld AI",
      icon: Brain,
      color: "text-purple-600 bg-purple-100",
    },
    {
      type: "llm",
      id: "openai",
      name: "OpenAI GPT-4",
      icon: Brain,
      color: "text-green-600 bg-green-100",
    },
    {
      type: "tts",
      id: "elevenlabs",
      name: "ElevenLabs",
      icon: Volume2,
      color: "text-pink-600 bg-pink-100",
    },
    {
      type: "tts",
      id: "cartesia",
      name: "Cartesia",
      icon: Volume2,
      color: "text-blue-600 bg-blue-100",
    },
    {
      type: "tts",
      id: "google",
      name: "Google TTS",
      icon: Volume2,
      color: "text-red-600 bg-red-100",
    },
  ];

  let saving = false;

  async function handleSave() {
    saving = true;
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify($builderStore.agent),
      });
      if (res.ok) {
        goto("/agents");
      }
    } catch (e) {
      console.error(e);
    } finally {
      saving = false;
    }
  }

  // Drag and Drop Logic
  function handleDragStart(e: DragEvent, provider: any) {
    if (e.dataTransfer) {
      e.dataTransfer.setData("application/json", JSON.stringify(provider));
      e.dataTransfer.effectAllowed = "copy";
    }
  }

  function handleDrop(e: DragEvent, targetType: "stt" | "llm" | "tts") {
    e.preventDefault();
    const data = e.dataTransfer?.getData("application/json");
    if (data) {
      const provider = JSON.parse(data);
      if (provider.type === targetType) {
        // Map drag type to config key
        const key =
          targetType === "stt"
            ? "sttProvider"
            : targetType === "llm"
              ? "llmProvider"
              : "voiceProvider";

        builderStore.updateConfig(key, provider.id);
        builderStore.selectNode(targetType);
      }
    }
  }

  function handleDragOver(e: DragEvent) {
    e.preventDefault();
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
  }
</script>

<div class="h-[calc(100vh-64px)] flex flex-col bg-slate-50 dark:bg-slate-900">
  <!-- Header -->
  <header
    class="h-16 border-b bg-background px-6 flex items-center justify-between shrink-0"
  >
    <div class="flex items-center gap-4">
      <button
        class="hover:bg-accent p-2 rounded-full"
        on:click={() => goto("/agents")}
      >
        <ArrowLeft size={20} />
      </button>
      <div>
        <input
          type="text"
          value={$builderStore.agent.name}
          on:input={(e) => builderStore.updateName(e.currentTarget.value)}
          class="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 p-0"
          placeholder="Agent Name"
        />
        <div class="flex items-center gap-2 text-xs text-muted-foreground">
          <span class="w-2 h-2 rounded-full bg-yellow-500"></span>
          Draft
        </div>
      </div>
    </div>
    <div class="flex gap-2">
      <button
        class="px-4 py-2 bg-primary text-primary-foreground rounded-md flex items-center gap-2"
        on:click={handleSave}
      >
        {#if saving}
          <Activity size={16} class="animate-spin" /> Saving...
        {:else}
          <Save size={16} /> Save Pipeline
        {/if}
      </button>
    </div>
  </header>

  <div class="flex-1 flex overflow-hidden">
    <!-- Left Sidebar: Palette -->
    <aside
      class="w-64 border-r bg-background p-4 flex flex-col gap-6 overflow-y-auto"
    >
      <div>
        <h3
          class="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider"
        >
          Providers
        </h3>
        <div class="space-y-3">
          {#each providers as p}
            <div
              draggable="true"
              on:dragstart={(e) => handleDragStart(e, p)}
              class="flex items-center gap-3 p-3 rounded-lg border bg-card hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
            >
              <div class={`p-2 rounded-md ${p.color}`}>
                <svelte:component this={p.icon} size={18} />
              </div>
              <span class="text-sm font-medium">{p.name}</span>
              <GripVertical size={14} class="ml-auto text-muted-foreground" />
            </div>
          {/each}
        </div>
      </div>

      <div
        class="mt-auto p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-xs text-blue-700 dark:text-blue-300"
      >
        <p class="font-semibold mb-1">Tip:</p>
        Drag providers from this list onto the pipeline slots in the center canvas
        to configure your agent.
      </div>
    </aside>

    <!-- Center: Canvas -->
    <main class="flex-1 bg-slate-50 dark:bg-slate-950 relative overflow-y-auto">
      <div
        class="absolute inset-0 pointer-events-none opacity-[0.03]"
        style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"
      ></div>

      <div
        class="max-w-3xl mx-auto py-12 px-4 flex flex-col items-center gap-8 relative z-10"
      >
        <!-- Identity Node -->
        <div
          class={`w-80 p-4 rounded-xl border-2 bg-card shadow-sm transition-all cursor-pointer relative ${$builderStore.selectedNode === "identity" ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
          on:click={() => builderStore.selectNode("identity")}
        >
          <div class="flex items-center gap-4">
            <div
              class="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center"
            >
              <Settings size={20} />
            </div>
            <div>
              <div class="font-semibold">Agent Identity</div>
              <div class="text-xs text-muted-foreground">
                Name, Status, Metadata
              </div>
            </div>
          </div>
          <!-- Connection Line -->
          <div class="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-slate-300"></div>
        </div>

        <!-- Channel Node -->
        <div
          class={`w-80 p-4 rounded-xl border-2 bg-card shadow-sm transition-all cursor-pointer relative ${$builderStore.selectedNode === "channel" ? "border-primary ring-2 ring-primary/20" : "border-border"}`}
          on:click={() => builderStore.selectNode("channel")}
        >
          <div class="flex items-center gap-4">
            <div
              class="h-10 w-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center"
            >
              <Globe size={20} />
            </div>
            <div>
              <div class="font-semibold">Channel</div>
              <div class="text-xs text-muted-foreground">Web & Telephony</div>
            </div>
          </div>
          <div class="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-slate-300"></div>
        </div>

        <!-- STT Node -->
        <div
          class={`w-80 p-4 rounded-xl border-2 border-dashed bg-card/50 hover:bg-card shadow-sm transition-all cursor-pointer relative group ${$builderStore.selectedNode === "stt" ? "border-primary border-solid ring-2 ring-primary/20" : "border-slate-300"}`}
          on:click={() => builderStore.selectNode("stt")}
          on:drop={(e) => handleDrop(e, "stt")}
          on:dragover={handleDragOver}
        >
          <div class="flex items-center gap-4">
            <div
              class="h-10 w-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center group-hover:scale-110 transition-transform"
            >
              <Mic size={20} />
            </div>
            <div>
              <div class="font-semibold">Input (STT)</div>
              <div class="text-xs text-primary font-medium capitalize">
                {$builderStore.agent.config?.sttProvider}
              </div>
            </div>
          </div>
          <div class="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-slate-300"></div>
        </div>

        <!-- LLM Node -->
        <div
          class={`w-80 p-4 rounded-xl border-2 border-dashed bg-card/50 hover:bg-card shadow-sm transition-all cursor-pointer relative group ${$builderStore.selectedNode === "llm" ? "border-primary border-solid ring-2 ring-primary/20" : "border-slate-300"}`}
          on:click={() => builderStore.selectNode("llm")}
          on:drop={(e) => handleDrop(e, "llm")}
          on:dragover={handleDragOver}
        >
          <div class="flex items-center gap-4">
            <div
              class="h-10 w-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform"
            >
              <Brain size={20} />
            </div>
            <div>
              <div class="font-semibold">Brain (LLM)</div>
              <div class="text-xs text-primary font-medium capitalize">
                {$builderStore.agent.config?.llmProvider}
              </div>
            </div>
          </div>
          <div class="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-slate-300"></div>
        </div>

        <!-- TTS Node -->
        <div
          class={`w-80 p-4 rounded-xl border-2 border-dashed bg-card/50 hover:bg-card shadow-sm transition-all cursor-pointer relative group ${$builderStore.selectedNode === "tts" ? "border-primary border-solid ring-2 ring-primary/20" : "border-slate-300"}`}
          on:click={() => builderStore.selectNode("tts")}
          on:drop={(e) => handleDrop(e, "tts")}
          on:dragover={handleDragOver}
        >
          <div class="flex items-center gap-4">
            <div
              class="h-10 w-10 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform"
            >
              <Volume2 size={20} />
            </div>
            <div>
              <div class="font-semibold">Output (TTS)</div>
              <div class="text-xs text-primary font-medium capitalize">
                {$builderStore.agent.config?.voiceProvider}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Right Sidebar: Config -->
    <aside
      class="w-80 border-l bg-background p-6 overflow-y-auto shadow-xl z-20"
    >
      {#if $builderStore.selectedNode === "identity"}
        <div class="space-y-6">
          <h3 class="text-lg font-medium">Agent Identity</h3>
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium">Internal Name</label>
              <input
                type="text"
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                bind:value={$builderStore.agent.name}
                on:input={(e) => builderStore.updateName(e.currentTarget.value)}
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium">Status</label>
              <select
                class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                bind:value={$builderStore.agent.status}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </div>
      {:else if $builderStore.selectedNode === "channel"}
        <ChannelConfig />
      {:else if $builderStore.selectedNode === "stt"}
        <STTConfig />
      {:else if $builderStore.selectedNode === "llm"}
        <LLMConfig />
      {:else if $builderStore.selectedNode === "tts"}
        <TTSConfig />
      {:else}
        <div
          class="h-full flex flex-col items-center justify-center text-center text-muted-foreground p-4"
        >
          <Settings size={48} class="mb-4 opacity-20" />
          <p>Select a node in the pipeline to configure its settings.</p>
        </div>
      {/if}
    </aside>
  </div>
</div>
