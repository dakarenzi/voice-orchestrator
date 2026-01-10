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
      color: "text-status-warning bg-status-warning-bg",
    },
    {
      type: "llm",
      id: "inworld",
      name: "Inworld AI",
      icon: Brain,
      color: "text-acn-primary bg-acn-primary/10",
    },
    {
      type: "llm",
      id: "openai",
      name: "OpenAI GPT-4",
      icon: Brain,
      color: "text-status-success bg-status-success-bg",
    },
    {
      type: "tts",
      id: "elevenlabs",
      name: "ElevenLabs",
      icon: Volume2,
      color: "text-status-info bg-status-info-bg",
    },
    {
      type: "tts",
      id: "cartesia",
      name: "Cartesia",
      icon: Volume2,
      color: "text-acn-primary bg-acn-primary/10",
    },
    {
      type: "tts",
      id: "google",
      name: "Google TTS",
      icon: Volume2,
      color: "text-status-error bg-status-error-bg",
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
        goto("/app/agents");
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

<div class="h-[calc(100vh-64px)] flex flex-col bg-bg-surface-raised">
  <!-- Header -->
  <header
    class="h-16 border-b border-brd-default bg-bg-surface px-6 flex items-center justify-between shrink-0"
  >
    <div class="flex items-center gap-4">
      <button
        class="hover:bg-bg-surface-raised p-2 rounded-full text-txt-primary"
        onclick={() => goto("/app/agents")}
      >
        <ArrowLeft size={20} />
      </button>
      <div>
        <input
          type="text"
          value={$builderStore.agent.name}
          oninput={(e) => builderStore.updateName(e.currentTarget.value)}
          class="text-lg font-semibold bg-transparent border-none focus:outline-none focus:ring-0 p-0 text-txt-primary"
          placeholder="Agent Name"
        />
        <div class="flex items-center gap-2 text-xs text-txt-muted">
          <span class="w-2 h-2 rounded-full bg-status-warning"></span>
          Draft
        </div>
      </div>
    </div>
    <div class="flex gap-2">
      <button
        class="px-4 py-2 bg-acn-primary text-txt-inverse rounded-md flex items-center gap-2 font-bold shadow-lg shadow-acn-primary/20"
        onclick={handleSave}
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
      class="w-64 border-r border-brd-default bg-bg-surface p-4 flex flex-col gap-6 overflow-y-auto"
    >
      <div>
        <h3
          class="text-sm font-semibold text-txt-muted mb-4 uppercase tracking-wider"
        >
          Providers
        </h3>
        <div class="space-y-3">
          {#each providers as p}
            <div
              draggable="true"
              ondragstart={(e) => handleDragStart(e, p)}
              class="flex items-center gap-3 p-3 rounded-lg border border-brd-default bg-bg-surface text-txt-primary hover:shadow-md cursor-grab active:cursor-grabbing transition-all"
            >
              <div class={`p-2 rounded-md ${p.color}`}>
                <svelte:component this={p.icon} size={18} />
              </div>
              <span class="text-sm font-medium">{p.name}</span>
              <GripVertical size={14} class="ml-auto text-txt-muted" />
            </div>
          {/each}
        </div>
      </div>

      <div
        class="mt-auto p-4 bg-status-info-bg rounded-lg text-xs text-status-info"
      >
        <p class="font-semibold mb-1">Tip:</p>
        Drag providers from this list onto the pipeline slots in the center canvas
        to configure your agent.
      </div>
    </aside>

    <!-- Center: Canvas -->
    <main class="flex-1 bg-bg-surface-raised relative overflow-y-auto">
      <div
        class="absolute inset-0 pointer-events-none opacity-[0.03]"
        style="background-image: radial-gradient(#000 1px, transparent 1px); background-size: 20px 20px;"
      ></div>

      <div
        class="max-w-3xl mx-auto py-12 px-4 flex flex-col items-center gap-8 relative z-10"
      >
        <!-- Identity Node -->
        <div
          class={`w-80 p-4 rounded-xl border-2 bg-bg-surface text-txt-primary shadow-sm transition-all cursor-pointer relative ${$builderStore.selectedNode === "identity" ? "border-acn-primary ring-2 ring-acn-primary/20" : "border-brd-default"}`}
          onclick={() => builderStore.selectNode("identity")}
        >
          <div class="flex items-center gap-4">
            <div
              class="h-10 w-10 rounded-full bg-bg-surface-raised flex items-center justify-center"
            >
              <Settings size={20} />
            </div>
            <div>
              <div class="font-semibold">Agent Identity</div>
              <div class="text-xs text-txt-muted">Name, Status, Metadata</div>
            </div>
          </div>
          <!-- Connection Line -->
          <div
            class="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-brd-default"
          ></div>
        </div>

        <!-- Channel Node -->
        <div
          class={`w-80 p-4 rounded-xl border-2 bg-bg-surface text-txt-primary shadow-sm transition-all cursor-pointer relative ${$builderStore.selectedNode === "channel" ? "border-acn-primary ring-2 ring-acn-primary/20" : "border-brd-default"}`}
          onclick={() => builderStore.selectNode("channel")}
        >
          <div class="flex items-center gap-4">
            <div
              class="h-10 w-10 rounded-full bg-status-info-bg text-status-info flex items-center justify-center"
            >
              <Globe size={20} />
            </div>
            <div>
              <div class="font-semibold">Channel</div>
              <div class="text-xs text-txt-muted">Web & Telephony</div>
            </div>
          </div>
          <div
            class="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-brd-default"
          ></div>
        </div>

        <!-- STT Node -->
        <div
          class={`w-80 p-4 rounded-xl border-2 border-dashed bg-bg-surface-raised/50 hover:bg-bg-surface text-txt-primary shadow-sm transition-all cursor-pointer relative group ${$builderStore.selectedNode === "stt" ? "border-acn-primary border-solid ring-2 ring-acn-primary/20" : "border-brd-default"}`}
          onclick={() => builderStore.selectNode("stt")}
          ondrop={(e) => handleDrop(e, "stt")}
          ondragover={handleDragOver}
        >
          <div class="flex items-center gap-4">
            <div
              class="h-10 w-10 rounded-full bg-status-warning-bg text-status-warning flex items-center justify-center group-hover:scale-110 transition-transform"
            >
              <Mic size={20} />
            </div>
            <div>
              <div class="font-semibold">Input (STT)</div>
              <div class="text-xs text-acn-primary font-medium capitalize">
                {$builderStore.agent.config?.sttProvider}
              </div>
            </div>
          </div>
          <div
            class="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-brd-default"
          ></div>
        </div>

        <!-- LLM Node -->
        <div
          class={`w-80 p-4 rounded-xl border-2 border-dashed bg-bg-surface-raised/50 hover:bg-bg-surface text-txt-primary shadow-sm transition-all cursor-pointer relative group ${$builderStore.selectedNode === "llm" ? "border-acn-primary border-solid ring-2 ring-acn-primary/20" : "border-brd-default"}`}
          onclick={() => builderStore.selectNode("llm")}
          ondrop={(e) => handleDrop(e, "llm")}
          ondragover={handleDragOver}
        >
          <div class="flex items-center gap-4">
            <div
              class="h-10 w-10 rounded-full bg-acn-primary/10 text-acn-primary flex items-center justify-center group-hover:scale-110 transition-transform"
            >
              <Brain size={20} />
            </div>
            <div>
              <div class="font-semibold">Brain (LLM)</div>
              <div class="text-xs text-acn-primary font-medium capitalize">
                {$builderStore.agent.config?.llmProvider}
              </div>
            </div>
          </div>
          <div
            class="absolute -bottom-8 left-1/2 w-0.5 h-8 bg-brd-default"
          ></div>
        </div>

        <!-- TTS Node -->
        <div
          class={`w-80 p-4 rounded-xl border-2 border-dashed bg-bg-surface-raised/50 hover:bg-bg-surface text-txt-primary shadow-sm transition-all cursor-pointer relative group ${$builderStore.selectedNode === "tts" ? "border-acn-primary border-solid ring-2 ring-acn-primary/20" : "border-brd-default"}`}
          onclick={() => builderStore.selectNode("tts")}
          ondrop={(e) => handleDrop(e, "tts")}
          ondragover={handleDragOver}
        >
          <div class="flex items-center gap-4">
            <div
              class="h-10 w-10 rounded-full bg-status-error-bg text-status-error flex items-center justify-center group-hover:scale-110 transition-transform"
            >
              <Volume2 size={20} />
            </div>
            <div>
              <div class="font-semibold">Output (TTS)</div>
              <div class="text-xs text-acn-primary font-medium capitalize">
                {$builderStore.agent.config?.voiceProvider}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Right Sidebar: Config -->
    <aside
      class="w-80 border-l border-brd-default bg-bg-surface p-6 overflow-y-auto shadow-xl z-20"
    >
      {#if $builderStore.selectedNode === "identity"}
        <div class="space-y-6">
          <h3 class="text-lg font-medium text-txt-primary">Agent Identity</h3>
          <div class="space-y-4">
            <div class="space-y-2">
              <label class="text-sm font-medium text-txt-primary"
                >Internal Name</label
              >
              <input
                type="text"
                class="flex h-9 w-full rounded-md border border-brd-default bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-acn-primary text-txt-primary"
                bind:value={$builderStore.agent.name}
                oninput={(e) => builderStore.updateName(e.currentTarget.value)}
              />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-medium text-txt-primary">Status</label>
              <select
                class="flex h-9 w-full rounded-md border border-brd-default bg-bg-surface px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-acn-primary text-txt-primary"
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
          class="h-full flex flex-col items-center justify-center text-center text-txt-muted p-4"
        >
          <Settings size={48} class="mb-4 opacity-20" />
          <p>Select a node in the pipeline to configure its settings.</p>
        </div>
      {/if}
    </aside>
  </div>
</div>
