<script lang="ts">
    import { theme, type Theme, resolveTheme } from "$lib/stores/theme";
    import { onMount } from "svelte";

    let currentTheme = $state<Theme>("system");

    // Use store subscribe but adapt for Svelte 5 state
    onMount(() => {
        const unsubscribe = theme.subscribe((value) => {
            currentTheme = value;
        });

        theme.init();
        window.addEventListener("keydown", handleKeyboard);

        return () => {
            unsubscribe();
            window.removeEventListener("keydown", handleKeyboard);
        };
    });

    const resolvedTheme = $derived(resolveTheme(currentTheme));

    function cycleTheme() {
        // Add transition class
        if (typeof document !== "undefined") {
            document.documentElement.classList.add("theme-transitioning");

            theme.toggle();

            // Remove transition class after animation
            setTimeout(() => {
                document.documentElement.classList.remove(
                    "theme-transitioning",
                );
            }, 200);
        }
    }

    // Keyboard shortcut: Ctrl/Cmd + Shift + T
    function handleKeyboard(e: KeyboardEvent) {
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
            e.preventDefault();
            cycleTheme();
        }
    }

    function getThemeLabel(t: Theme): string {
        const resolved = resolveTheme(t);
        switch (resolved) {
            case "light":
                return "Light mode";
            case "dark":
                return "Dark mode";
            case "high-contrast":
                return "High contrast mode";
            default:
                return "Theme";
        }
    }

    function getNextThemeLabel(t: Theme): string {
        const resolved = resolveTheme(t);
        switch (resolved) {
            case "light":
                return "Switch to dark mode";
            case "dark":
                return "Switch to high contrast mode";
            case "high-contrast":
                return "Switch to light mode";
            default:
                return "Switch theme";
        }
    }
</script>

<button
    onclick={cycleTheme}
    class="theme-toggle"
    aria-label={getNextThemeLabel(currentTheme)}
    title="{getNextThemeLabel(currentTheme)} (Ctrl+Shift+T)"
>
    {#if resolvedTheme === "light"}
        <!-- Sun icon for light mode -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="4"></circle>
            <path d="M12 2v2"></path>
            <path d="M12 20v2"></path>
            <path d="m4.93 4.93 1.41 1.41"></path>
            <path d="m17.66 17.66 1.41 1.41"></path>
            <path d="M2 12h2"></path>
            <path d="M20 12h2"></path>
            <path d="m6.34 17.66-1.41 1.41"></path>
            <path d="m19.07 4.93-1.41 1.41"></path>
        </svg>
    {:else if resolvedTheme === "dark"}
        <!-- Moon icon for dark mode -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"></path>
        </svg>
    {:else}
        <!-- Contrast icon for high-contrast mode -->
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
        >
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 2v20"></path>
        </svg>
    {/if}
    <span class="sr-only">{getThemeLabel(currentTheme)}</span>
</button>

<style>
    .theme-toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        padding: 0;
        border: 1px solid var(--border-default);
        border-radius: 8px;
        background-color: var(--bg-surface);
        color: var(--text-secondary);
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .theme-toggle:hover {
        background-color: var(--bg-surface-raised);
        color: var(--text-primary);
        border-color: var(--border-strong);
    }

    .theme-toggle:active {
        transform: scale(0.95);
    }

    .theme-toggle svg {
        flex-shrink: 0;
    }

    /* Screen reader only text */
    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border-width: 0;
    }

    /* High contrast mode enhancements */
    [data-theme="high-contrast"] .theme-toggle {
        border-width: 2px;
    }

    [data-theme="high-contrast"] .theme-toggle:focus-visible {
        outline: 3px solid var(--color-focus-ring);
        outline-offset: 3px;
    }
</style>
