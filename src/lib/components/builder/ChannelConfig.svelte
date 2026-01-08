
<script lang="ts">
  import { builderStore } from '$lib/stores/agentBuilder';
  import { Phone, Globe, MessageCircle } from 'lucide-react';

  // In a real app, this might be part of the Agent object, 
  // currently the types.ts Agent interface doesn't explicitly store 'channel' 
  // in the top level for configuration persistence (it's mostly for runtime conversations),
  // but we'll assume we can store it or it's implied by the phone_number field.
  
  let phoneNumber = '';
</script>

<div class="space-y-6">
  <div>
    <h3 class="text-lg font-medium mb-2">Communication Channels</h3>
    <p class="text-sm text-muted-foreground mb-4">Select where this agent will be deployed.</p>
  </div>

  <div class="grid grid-cols-1 gap-4">
    <!-- Web Channel -->
    <div class="border rounded-lg p-4 flex items-center justify-between bg-secondary/20 border-primary">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-blue-100 text-blue-600 rounded-lg">
          <Globe size={24} />
        </div>
        <div>
          <div class="font-medium">WebRTC / WebSocket</div>
          <div class="text-xs text-muted-foreground">Browser-based real-time audio</div>
        </div>
      </div>
      <div class="px-2 py-1 bg-green-100 text-green-700 text-xs rounded font-medium">Active</div>
    </div>

    <!-- Telephony -->
    <div class="border rounded-lg p-4 flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="p-2 bg-purple-100 text-purple-600 rounded-lg">
            <Phone size={24} />
          </div>
          <div>
            <div class="font-medium">Telephony (Telnyx)</div>
            <div class="text-xs text-muted-foreground">PSTN / SIP Trunking</div>
          </div>
        </div>
        <input type="checkbox" class="toggle" checked />
      </div>
      
      <div class="pl-14 space-y-2">
        <label class="text-xs font-medium uppercase text-muted-foreground">Assigned Number</label>
        <input 
          type="text" 
          placeholder="+1 (555) 000-0000" 
          class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          bind:value={phoneNumber}
          on:input={(e) => builderStore.updateConfig('phoneNumber' as any, e.currentTarget.value)}
        />
        <p class="text-xs text-muted-foreground">Calls to this number will be handled by this agent.</p>
      </div>
    </div>
  </div>
</div>
