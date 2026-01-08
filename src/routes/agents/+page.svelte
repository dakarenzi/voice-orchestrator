<script lang="ts">
    import { Users, Plus, Edit, Trash2 } from "lucide-svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import CardContent from "$lib/components/ui/CardContent.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";

    // Mock Agents
    let agents = [
        {
            id: "1",
            name: "Customer Support Bot",
            status: "active",
            type: "inbound",
            model: "Inworld",
        },
        {
            id: "2",
            name: "Sales Representative",
            status: "inactive",
            type: "outbound",
            model: "Inworld",
        },
    ];
</script>

<div class="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
    <div class="flex justify-between items-center">
        <div>
            <h2 class="text-3xl font-bold tracking-tight">Voice Agents</h2>
            <p class="text-muted-foreground mt-2">Manage your AI workforce.</p>
        </div>
        <Button class="gap-2"><Plus size={16} /> Create Agent</Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each agents as agent}
            <Card
                class="hover:border-primary/50 transition-colors cursor-pointer group relative overflow-hidden"
            >
                <CardContent class="p-6 space-y-4">
                    <div class="flex justify-between items-start">
                        <div class="p-3 bg-primary/10 text-primary rounded-xl">
                            <Users size={24} />
                        </div>
                        <Badge
                            variant={agent.status === "active"
                                ? "success"
                                : "outline"}>{agent.status}</Badge
                        >
                    </div>

                    <div>
                        <h3 class="font-bold text-lg">{agent.name}</h3>
                        <p class="text-sm text-muted-foreground">
                            Powered by {agent.model}
                        </p>
                    </div>

                    <div
                        class="pt-4 border-t flex items-center justify-between text-sm text-muted-foreground"
                    >
                        <span class="capitalize">{agent.type} Call</span>
                        <div
                            class="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                            <Button variant="ghost" size="icon" class="h-8 w-8"
                                ><Edit size={14} /></Button
                            >
                            <Button
                                variant="ghost"
                                size="icon"
                                class="h-8 w-8 text-destructive"
                                ><Trash2 size={14} /></Button
                            >
                        </div>
                    </div>
                </CardContent>
            </Card>
        {/each}

        <!-- Add New Card -->
        <div
            class="border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-8 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer min-h-[200px]"
        >
            <Plus size={32} class="mb-2" />
            <span class="font-medium">Create New Agent</span>
        </div>
    </div>
</div>
