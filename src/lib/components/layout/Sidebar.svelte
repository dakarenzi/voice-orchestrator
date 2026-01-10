<script lang="ts">
    import { page } from "$app/stores";
    import {
        LayoutDashboard,
        Users,
        MessageSquare,
        Activity,
        Settings,
        LogOut,
        Menu,
        Phone,
        Mic,
        Brain,
        Sparkles,
        X,
    } from "lucide-svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import ThemeToggle from "$lib/components/ThemeToggle.svelte";

    const links = [
        { href: "/app", label: "Overview", icon: LayoutDashboard },
        { href: "/app/agents", label: "Agents", icon: Users },
        { href: "/app/agents/templates", label: "Templates", icon: Sparkles },
        { href: "/app/voices", label: "Voice Library", icon: Mic },
        { href: "/app/session", label: "Live Sessions", icon: Phone },
        { href: "/app/intelligence", label: "Intelligence", icon: Brain },
        { href: "/app/analytics", label: "Analytics", icon: Activity },
    ];

    let isOpen = false;

    function toggleSidebar() {
        isOpen = !isOpen;
    }
</script>

<!-- Mobile Toggle -->
<div class="lg:hidden fixed top-4 left-4 z-50">
    <button
        on:click={toggleSidebar}
        class="p-2 bg-bg-surface/80 backdrop-blur-md border border-brd-default rounded-xl shadow-sm hover:bg-bg-surface transition-colors text-txt-primary"
    >
        {#if isOpen}
            <X size={24} />
        {:else}
            <Menu size={24} />
        {/if}
    </button>
</div>

<!-- Overlay -->
{#if isOpen}
    <div
        class="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden"
        on:click={toggleSidebar}
        role="button"
        tabindex="0"
        on:keydown={(e) => e.key === "Enter" && toggleSidebar()}
    ></div>
{/if}

<aside
    class={`
    fixed left-0 top-0 h-screen w-72 border-r border-brd-default bg-bg-default flex flex-col z-50 transition-transform duration-300 lg:translate-x-0 shadow-lg lg:shadow-none
    ${isOpen ? "translate-x-0" : "-translate-x-full"}
`}
>
    <!-- Logo Header -->
    <div class="p-6 border-b border-brd-default flex items-center gap-3">
        <div
            class="bg-gradient-to-br from-acn-primary to-acn-soft p-2.5 rounded-xl text-txt-inverse shadow-lg shadow-acn-primary/20"
        >
            <Mic size={24} strokeWidth={2.5} />
        </div>
        <div>
            <span class="font-extrabold text-xl tracking-tight text-txt-primary"
                >Voice<span class="text-acn-primary">Orchestrator</span></span
            >
            <div
                class="text-[10px] uppercase tracking-wider font-semibold text-txt-muted"
            >
                Enterprise AI
            </div>
        </div>
    </div>

    <nav class="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
        <div
            class="px-3 py-2 text-xs font-semibold text-txt-muted uppercase tracking-wider"
        >
            Main Menu
        </div>
        {#each links as link}
            <a
                href={link.href}
                class={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    $page.url.pathname === link.href ||
                    ($page.url.pathname.startsWith(link.href) &&
                        link.href !== "/app")
                        ? "bg-bg-accent-subtle text-acn-primary shadow-sm border border-acn-primary/20"
                        : "text-txt-secondary hover:bg-bg-surface-raised hover:text-txt-primary hover:translate-x-1"
                }`}
            >
                <div
                    class={`${$page.url.pathname === link.href || ($page.url.pathname.startsWith(link.href) && link.href !== "/app") ? "text-acn-primary" : "text-txt-muted group-hover:text-txt-secondary"}`}
                >
                    <link.icon size={20} strokeWidth={2} />
                </div>
                {link.label}
                {#if $page.url.pathname === link.href}
                    <div
                        class="ml-auto w-1.5 h-1.5 rounded-full bg-acn-primary animate-pulse"
                    ></div>
                {/if}
            </a>
        {/each}

        <div
            class="px-3 py-2 mt-6 text-xs font-semibold text-txt-muted uppercase tracking-wider"
        >
            System
        </div>
        <div class="px-4 py-2">
            <ThemeToggle />
        </div>
        <a
            href="/app/settings"
            class="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-txt-secondary hover:bg-bg-surface-raised hover:text-txt-primary transition-all hover:translate-x-1"
        >
            <div class="text-txt-muted group-hover:text-txt-secondary">
                <Settings size={20} />
            </div>
            Settings
        </a>
    </nav>

    <!-- Footer Profile / Logout -->
    <div class="p-4 border-t border-brd-default bg-bg-surface-raised/50">
        <button
            class="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-semibold text-txt-secondary hover:bg-bg-surface hover:shadow-md hover:text-status-error transition-all border border-transparent hover:border-brd-default group"
        >
            <LogOut
                size={18}
                class="group-hover:text-status-error transition-colors"
            />
            Sign Out
        </button>
    </div>
</aside>
