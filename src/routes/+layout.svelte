<script lang="ts">
    import "../app.css"; // Will be created from existing tailwind logic or empty if using CDN
    import Sidebar from "$lib/components/layout/Sidebar.svelte";
    import ToastContainer from "$lib/components/ui/ToastContainer.svelte";

    interface Props {
        children?: import("svelte").Snippet;
    }

    let { children }: Props = $props();
</script>

<div class="flex min-h-screen bg-background text-foreground">
    <Sidebar />
    <main class="flex-1 ml-64 p-8 overflow-y-auto h-screen">
        {@render children?.()}
    </main>
    <ToastContainer />
</div>
