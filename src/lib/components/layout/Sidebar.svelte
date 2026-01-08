<script lang="ts">
    import { page } from '$app/stores';
    import { 
        LayoutDashboard, Users, MessageSquare, Activity, Settings, 
        LogOut, Menu, Phone, Mic
    } from 'lucide-svelte';

    const links = [
        { href: '/', label: 'Overview', icon: LayoutDashboard },
        { href: '/agents', label: 'Agents', icon: Users },
        { href: '/session', label: 'Live Sessions', icon: Phone },
        { href: '/analytics', label: 'Analytics', icon: Activity },
        { href: '/settings', label: 'Settings', icon: Settings },
    ];
</script>

<aside class="w-64 border-r bg-card h-screen flex flex-col fixed left-0 top-0">
    <div class="p-6 border-b flex items-center gap-2">
        <div class="bg-primary/10 p-2 rounded-lg text-primary">
            <Mic size={24} />
        </div>
        <span class="font-bold text-lg">Voice<span class="text-primary">Orchestra</span></span>
    </div>

    <nav class="flex-1 p-4 space-y-1 overflow-y-auto">
        {#each links as link}
            <a 
                href={link.href} 
                class={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    $page.url.pathname === link.href 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
                <link.icon size={18} />
                {link.label}
            </a>
        {/each}
    </nav>

    <div class="p-4 border-t">
        <button class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
            <LogOut size={18} />
            Sign Out
        </button>
    </div>
</aside>
