<script lang="ts">
    import {
        Phone,
        Users,
        MessageSquare,
        Activity,
        Layers,
        Mic,
        Clock,
    } from "lucide-svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import CardContent from "$lib/components/ui/CardContent.svelte";
    import CardHeader from "$lib/components/ui/CardHeader.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";
    import CallStatus from "$lib/components/CallStatus.svelte";

    // Mock Data
    const conversations = [
        {
            id: "1",
            agentName: "Customer Support",
            channel: "web",
            status: "active" as const,
            startedAt: Date.now() - 1000 * 60 * 2,
        },
        {
            id: "2",
            agentName: "Sales Bot",
            channel: "phone",
            status: "ended" as const,
            startedAt: Date.now() - 1000 * 60 * 15,
        },
        {
            id: "3",
            agentName: "Reservation",
            channel: "phone",
            status: "ended" as const,
            startedAt: Date.now() - 1000 * 60 * 45,
        },
    ];

    const agents = [{ id: 1 }, { id: 2 }, { id: 3 }];
    const activeCalls = 1;
</script>

<div
    class="flex flex-col gap-8 max-w-6xl mx-auto animate-in fade-in duration-500"
>
    <div>
        <h1 class="text-3xl font-bold tracking-tight text-txt-primary">
            Dashboard
        </h1>
        <p class="text-txt-muted mt-2">Platform Overview</p>
    </div>

    <!-- Metric Cards -->
    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
            <CardContent class="pt-6 flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-txt-muted">
                        Active Calls
                    </p>
                    <div class="text-2xl font-bold text-status-success mt-2">
                        {activeCalls}
                    </div>
                </div>
                <div
                    class="p-3 bg-status-success-bg text-status-success rounded-full"
                >
                    <Phone size={24} />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent class="pt-6 flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-txt-muted">
                        Total Agents
                    </p>
                    <div class="text-2xl font-bold mt-2 text-txt-primary">
                        {agents.length}
                    </div>
                </div>
                <div
                    class="p-3 bg-acn-primary/10 text-acn-primary rounded-full"
                >
                    <Users size={24} />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent class="pt-6 flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-txt-muted">
                        Conversations (24h)
                    </p>
                    <div class="text-2xl font-bold mt-2 text-txt-primary">
                        142
                    </div>
                </div>
                <div
                    class="p-3 bg-status-info-bg text-status-info rounded-full"
                >
                    <MessageSquare size={24} />
                </div>
            </CardContent>
        </Card>
        <Card>
            <CardContent class="pt-6 flex items-center justify-between">
                <div>
                    <p class="text-sm font-medium text-txt-muted">
                        Success Rate
                    </p>
                    <div class="text-2xl font-bold mt-2 text-txt-primary">
                        94.2%
                    </div>
                </div>
                <div
                    class="p-3 bg-status-warning-bg text-status-warning rounded-full"
                >
                    <Activity size={24} />
                </div>
            </CardContent>
        </Card>
    </div>

    <!-- Live Feed & Health -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card class="lg:col-span-2">
            <CardHeader>
                <h3
                    class="font-semibold text-lg flex items-center gap-2 text-txt-primary"
                >
                    <Layers size={18} /> Live Conversation Feed
                </h3>
            </CardHeader>
            <CardContent>
                <div class="space-y-4">
                    {#each conversations as c}
                        <div
                            class="flex items-center justify-between border-b border-brd-subtle pb-4 last:border-0 last:pb-0"
                        >
                            <div class="flex items-center gap-4">
                                <div
                                    class={`p-2 rounded-full ${c.status === "active" ? "bg-status-success-bg text-status-success animate-pulse" : "bg-bg-surface-raised text-txt-muted"}`}
                                >
                                    {#if c.channel === "web"}
                                        <Mic size={18} />
                                    {:else}
                                        <Phone size={18} />
                                    {/if}
                                </div>
                                <div>
                                    <p
                                        class="font-medium text-sm text-txt-primary"
                                    >
                                        {c.agentName}
                                    </p>
                                    <p
                                        class="text-xs text-txt-muted flex items-center gap-1"
                                    >
                                        <Clock size={10} />
                                        {new Date(
                                            c.startedAt,
                                        ).toLocaleTimeString()}
                                    </p>
                                </div>
                            </div>
                            <CallStatus status={c.status} />
                        </div>
                    {/each}
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader
                ><h3 class="font-semibold text-lg text-txt-primary">
                    Platform Health
                </h3></CardHeader
            >
            <CardContent class="space-y-4">
                {#each ["Deepgram STT", "Inworld AI", "ElevenLabs TTS", "Telnyx Voice"] as s}
                    <div
                        class="flex justify-between items-center p-3 border border-brd-default rounded-lg bg-bg-surface-raised/50"
                    >
                        <span class="text-sm font-medium text-txt-primary"
                            >{s}</span
                        >
                        <div
                            class="flex items-center gap-1.5 text-xs text-status-success font-medium"
                        >
                            <div
                                class="w-2 h-2 rounded-full bg-status-success animate-pulse"
                            ></div>
                            Operational
                        </div>
                    </div>
                {/each}
            </CardContent>
        </Card>
    </div>
</div>
