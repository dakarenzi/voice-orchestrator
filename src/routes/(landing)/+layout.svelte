<script lang="ts">
    import { landingContent } from "$lib/content/landing";
    import Button from "$lib/components/ui/Button.svelte";
    import { Sun, Moon, Github, Twitter, Linkedin } from "lucide-svelte";
    import { onMount } from "svelte";
    import { SignedIn, SignedOut, UserButton } from "svelte-clerk";
    import { theme } from "$lib/stores/theme";

    let { children } = $props();
    let scrollY = $state(0);

    function toggleTheme() {
        theme.toggle();
    }

    onMount(() => {
        theme.init();
    });

    const isScrolled = $derived(scrollY > 20);
    const { nav, footer } = landingContent;
</script>

<svelte:window bind:scrollY />

<div
    class="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-primary/20"
>
    <!-- Navbar -->
    <header
        class={`fixed top-0 w-full z-50 transition-all duration-300 border-b ${isScrolled ? "bg-background/80 backdrop-blur-md border-border shadow-sm" : "bg-transparent border-transparent"}`}
    >
        <div
            class="container mx-auto px-4 h-16 flex items-center justify-between"
        >
            <a href="/" class="flex items-center gap-2 font-bold text-xl group">
                <div
                    class="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground transition-transform group-hover:scale-105"
                >
                    V
                </div>
                <span>VoiceOrchestrator</span>
            </a>

            <nav class="hidden md:flex items-center gap-8">
                {#each nav.links as link}
                    <a
                        href={link.href}
                        class="text-sm font-medium hover:text-primary transition-colors"
                    >
                        {link.label}
                    </a>
                {/each}
            </nav>

            <div class="flex items-center gap-4">
                <button
                    onclick={toggleTheme}
                    class="p-2 rounded-md hover:bg-accent hover:text-accent-foreground transition-colors"
                    aria-label="Toggle theme"
                >
                    {#if theme}
                        {#if $theme === "dark" || $theme === "high-contrast"}
                            <Moon class="w-5 h-5" />
                        {:else}
                            <Sun class="w-5 h-5" />
                        {/if}
                    {/if}
                </button>

                <div class="flex items-center gap-4">
                    <SignedOut>
                        <Button href="/sign-in" variant="ghost" size="sm"
                            >Sign In</Button
                        >
                        <Button href="/sign-up" variant="primary" size="sm"
                            >Get Started</Button
                        >
                    </SignedOut>
                    <SignedIn>
                        <Button href="/app" variant="outline" size="sm"
                            >Dashboard</Button
                        >
                        <div class="flex items-center">
                            <UserButton afterSignOutUrl="/" />
                        </div>
                    </SignedIn>
                </div>
            </div>
        </div>
    </header>

    <main class="flex-1">
        {@render children?.()}
    </main>

    <footer class="bg-muted/20 border-t pt-16 pb-8">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
                {#each footer.columns as col}
                    <div>
                        <h4 class="font-bold mb-4">{col.title}</h4>
                        <ul class="space-y-2 text-sm text-muted-foreground">
                            {#each col.links as link}
                                <li>
                                    <a
                                        href={link.href}
                                        class="hover:text-primary transition-colors"
                                        >{link.label}</a
                                    >
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/each}
            </div>

            <div
                class="pt-8 border-t flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground"
            >
                <div class="flex items-center gap-2">
                    <div
                        class="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold"
                    >
                        V
                    </div>
                    <span>© {new Date().getFullYear()} VoiceOrchestrator.</span
                    >
                </div>

                <div class="flex items-center gap-6">
                    <a href="https://twitter.com" class="hover:text-foreground"
                        ><Twitter class="w-4 h-4" /></a
                    >
                    <a href="https://github.com" class="hover:text-foreground"
                        ><Github class="w-4 h-4" /></a
                    >
                    <a href="https://linkedin.com" class="hover:text-foreground"
                        ><Linkedin class="w-4 h-4" /></a
                    >
                </div>
            </div>
        </div>
    </footer>
</div>
