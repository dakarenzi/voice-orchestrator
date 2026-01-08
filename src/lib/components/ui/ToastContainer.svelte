<script lang="ts">
    import { toast } from '$lib/stores/toast.svelte';
    import { CheckCircle, AlertCircle, X } from 'lucide-svelte';
    import { fly } from 'svelte/transition';
</script>

<div class="fixed bottom-4 right-4 space-y-2 z-50">
    {#each toast.toasts as t (t.id)}
        <div 
            transition:fly={{ x: 20 }}
            class={`p-4 rounded-lg shadow-lg text-white flex items-center gap-2 ${t.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}
        >
            {#if t.type === 'success'}
                <CheckCircle size={18} />
            {:else}
                <AlertCircle size={18} />
            {/if}
            {t.msg}
            <button class="ml-auto" onclick={() => toast.remove(t.id)}>
                <X size={14} />
            </button>
        </div>
    {/each}
</div>
