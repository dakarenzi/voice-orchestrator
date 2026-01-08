<script lang="ts">
    import Sidebar from "$lib/components/layout/Sidebar.svelte";

    let { children } = $props();
</script>

<div class="flex min-h-screen bg-background text-foreground">
    <Sidebar />
    <main class="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {@render children?.()}
    </main>
</div>
