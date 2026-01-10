<script lang="ts">
    import { onMount, type Snippet } from "svelte";
    import {
        applyWidgetTheme,
        type WidgetThemeMode,
    } from "$lib/embed/widget-theme";

    interface Props {
        themeMode?: WidgetThemeMode;
        children: Snippet;
    }

    let { themeMode = "auto", children }: Props = $props();

    onMount(() => {
        applyWidgetTheme(themeMode);
    });
</script>

<div class="voice-widget">
    {@render children()}
</div>

<style>
    .voice-widget {
        /* Widget-specific theming */
        --widget-bg: var(--bg-surface);
        --widget-border: var(--border-default);

        background-color: var(--widget-bg);
        border: 1px solid var(--widget-border);
        border-radius: 16px;
        box-shadow: var(--shadow-lg);

        /* Ensure isolation from host page */
        all: initial;
        display: block;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto,
            Helvetica, Arial, sans-serif;
        box-sizing: border-box;
    }

    /* Reset box-sizing for all elements inside the widget */
    .voice-widget :global(*) {
        box-sizing: border-box;
    }
</style>
