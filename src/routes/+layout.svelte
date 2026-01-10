<script lang="ts">
    import "../app.css";
    import "$lib/styles/globals.css";
    import ToastContainer from "$lib/components/ui/ToastContainer.svelte";
    import ThemeToggle from "$lib/components/ThemeToggle.svelte";
    import { onMount } from "svelte";
    import { theme } from "$lib/stores/theme";
    import { ClerkProvider } from "svelte-clerk";

    import { env } from "$env/dynamic/public";

    let { children, data } = $props();

    onMount(() => {
        theme.init();
    });
</script>

<svelte:head>
    <!-- Dynamic theme color for mobile browsers -->
    <meta
        name="theme-color"
        content="#0a0a0a"
        media="(prefers-color-scheme: dark)"
    />
    <meta
        name="theme-color"
        content="#ffffff"
        media="(prefers-color-scheme: light)"
    />
</svelte:head>

<ClerkProvider {data} publishableKey={env.PUBLIC_CLERK_PUBLISHABLE_KEY}>
    {@render children?.()}
</ClerkProvider>

<ToastContainer />

<style>
    :global(body) {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
    }
</style>
