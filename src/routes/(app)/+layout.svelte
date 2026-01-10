<script lang="ts">
    import Sidebar from "$lib/components/layout/Sidebar.svelte";
    import { afterNavigate } from "$app/navigation";

    let { children } = $props();
    let mainElement: HTMLElement;

    afterNavigate(() => {
        if (mainElement) {
            mainElement.scrollTo({ top: 0, behavior: "instant" });
        }
    });
</script>

<div class="flex min-h-screen bg-background text-foreground">
    <Sidebar />
    <main
        bind:this={mainElement}
        class="flex-1 ml-64 p-8 overflow-y-auto h-screen"
    >
        {@render children?.()}
    </main>
</div>
