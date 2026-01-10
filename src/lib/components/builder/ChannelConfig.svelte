<script lang="ts">
  import { builderStore } from "$lib/stores/agentBuilder";
  import { Phone, Globe, MessageCircle } from "lucide-svelte";

  let phoneNumber = $state("");
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-bold mb-1">Communication Channels</h3>
    <p class="text-sm text-muted-foreground">
      Select where this agent will be deployed.
    </p>
  </div>

  <div class="grid grid-cols-1 gap-4">
    <!-- Web Channel -->
    <div
      class="border rounded-xl p-4 flex items-center justify-between bg-primary/5 border-primary shadow-sm"
    >
      <div class="flex items-center gap-3">
        <div
          class="p-2.5 bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400 rounded-lg"
        >
          <Globe size={20} />
        </div>
        <div>
          <div class="font-bold">WebRTC / WebSocket</div>
          <div class="text-xs text-muted-foreground">
            Browser-based real-time audio
          </div>
        </div>
      </div>
      <div
        class="px-2.5 py-1 bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300 text-xs rounded-full font-bold"
      >
        Active
      </div>
    </div>

    <!-- Telephony -->
    <div class="border rounded-xl p-4 flex flex-col gap-4 bg-card shadow-sm">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div
            class="p-2.5 bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 rounded-lg"
          >
            <Phone size={20} />
          </div>
          <div>
            <div class="font-bold">Telephony (Telnyx)</div>
            <div class="text-xs text-muted-foreground">PSTN / SIP Trunking</div>
          </div>
        </div>
        <!-- Toggle Switch -->
        <label class="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" checked class="sr-only peer" />
          <div
            class="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"
          ></div>
        </label>
      </div>

      <div class="pl-14 space-y-2">
        <label
          class="text-xs font-bold uppercase text-muted-foreground tracking-wider"
          for="phone-num">Assigned Number</label
        >
        <input
          id="phone-num"
          type="text"
          placeholder="+1 (555) 000-0000"
          class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          bind:value={phoneNumber}
          oninput={(e) =>
            builderStore.updateConfig("phoneNumber", e.currentTarget.value)}
        />
        <p class="text-xs text-muted-foreground">
          Calls to this number will be handled by this agent.
        </p>
      </div>
    </div>
  </div>
</div>
