<script lang="ts">
    import { Users, Plus, Edit, Trash2 } from "lucide-svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import CardContent from "$lib/components/ui/CardContent.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";
    import AgentStatus from "$lib/components/AgentStatus.svelte";

    // Mock Agents
    let agents = [
        {
            id: "1",
            name: "Customer Support Bot",
            status: "active" as const,
            type: "inbound",
            model: "Inworld",
        },
        {
            id: "2",
            name: "Sales Representative",
            status: "idle" as const,
            type: "outbound",
            model: "Inworld",
        },
    ];
</script>

<div class="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
    <div class="flex justify-between items-center">
        <div>
            <h2 class="text-3xl font-bold tracking-tight text-txt-primary">
                Voice Agents
            </h2>
            <p class="text-txt-muted mt-2">Manage your AI workforce.</p>
        </div>
        <Button href="/app/agents/new" class="gap-2"
            ><Plus size={16} /> Create Agent</Button
        >
    </div>

    {#if agents.length === 0}
        <div
            class="text-center py-24 border-2 border-dashed border-brd-default rounded-xl bg-bg-surface-raised/30"
        >
            <div
                class="mx-auto w-16 h-16 rounded-full bg-acn-primary/10 flex items-center justify-center mb-6"
            >
                <Users class="text-acn-primary" size={32} />
            </div>
            <h2 class="text-2xl font-bold text-txt-primary">
                Create Your First AI Agent
            </h2>
            <p class="text-txt-muted mt-2 mb-8 max-w-sm mx-auto">
                Start from scratch or jumpstart your journey with a pre-built
                template.
            </p>

            <div class="flex flex-col sm:flex-row gap-4 justify-center">
                <Button href="/app/agents/new" variant="primary">
                    Create from Scratch
                </Button>
                <Button href="/app/agents/templates" variant="secondary">
                    Browse Templates
                </Button>
            </div>
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each agents as agent}
                <Card
                    class="hover:border-primary/50 transition-colors cursor-pointer group relative overflow-hidden"
                >
                    <CardContent class="p-6 space-y-4">
                        <div class="flex justify-between items-start">
                            <div
                                class="p-3 bg-acn-primary/10 text-acn-primary rounded-xl"
                            >
                                <Users size={24} />
                            </div>
                            <AgentStatus status={agent.status} />
                        </div>

                        <div>
                            <h3 class="font-bold text-lg text-txt-primary">
                                {agent.name}
                            </h3>
                            <p class="text-sm text-txt-muted">
                                Powered by {agent.model}
                            </p>
                        </div>

                        <div
                            class="pt-4 border-t border-brd-subtle flex items-center justify-between text-sm text-txt-muted"
                        >
                            <span class="capitalize">{agent.type} Call</span>
                            <div
                                class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="h-8 w-8 text-txt-secondary hover:text-txt-primary"
                                    ><Edit size={14} /></Button
                                >
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    class="h-8 w-8 text-status-error hover:bg-status-error/10"
                                    ><Trash2 size={14} /></Button
                                >
                            </div>
                        </div>
                    </CardContent>
                </Card>
            {/each}

            <!-- Add New Card -->
            <a
                href="/app/agents/new"
                class="border-2 border-dashed border-brd-default rounded-lg flex flex-col items-center justify-center p-8 text-txt-muted hover:border-acn-primary hover:text-acn-primary hover:bg-acn-primary/5 transition-all cursor-pointer min-h-[200px]"
            >
                <Plus size={32} class="mb-2" />
                <span class="font-medium">Create New Agent</span>
            </a>
        </div>
    {/if}
</div>
