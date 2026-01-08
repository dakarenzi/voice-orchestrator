<script lang="ts">
    import { Download, Play, Pause } from "lucide-svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import CardContent from "$lib/components/ui/CardContent.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";

    // Mock Data
    const calls = [
        {
            id: "c1",
            agentName: "Customer Support Bot",
            channel: "web",
            status: "completed",
            duration: "4m 5s",
            time: new Date().toLocaleString(),
            recording: "#",
        },
        {
            id: "c2",
            agentName: "Sales Bot",
            channel: "phone",
            status: "active",
            duration: "30s",
            time: new Date().toLocaleString(),
            recording: null,
        },
        {
            id: "c3",
            agentName: "Reservation",
            channel: "phone",
            status: "failed",
            duration: "12s",
            time: new Date().toLocaleString(),
            recording: null,
        },
    ];

    let playingId = $state<string | null>(null);

    function togglePlay(id: string) {
        if (playingId === id) {
            playingId = null;
        } else {
            playingId = id;
            // Mock play logic
            setTimeout(() => (playingId = null), 3000);
        }
    }
</script>

<div class="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
    <div class="flex justify-between items-center">
        <div>
            <h2 class="text-3xl font-bold tracking-tight">Call Logs</h2>
            <p class="text-muted-foreground mt-2">
                History of all interactions.
            </p>
        </div>
        <Button variant="outline"
            ><Download size={16} class="mr-2" /> Export CSV</Button
        >
    </div>

    <Card>
        <CardContent class="p-0">
            <div class="rounded-md border">
                <table class="w-full text-sm">
                    <thead class="bg-muted/50">
                        <tr
                            class="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted"
                        >
                            <th
                                class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                                >Status</th
                            >
                            <th
                                class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                                >Agent</th
                            >
                            <th
                                class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                                >Channel</th
                            >
                            <th
                                class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                                >Duration</th
                            >
                            <th
                                class="h-12 px-4 text-left align-middle font-medium text-muted-foreground"
                                >Time</th
                            >
                            <th
                                class="h-12 px-4 text-right align-middle font-medium text-muted-foreground"
                                >Actions</th
                            >
                        </tr>
                    </thead>
                    <tbody>
                        {#each calls as call}
                            <tr
                                class="border-b transition-colors hover:bg-muted/50"
                            >
                                <td class="p-4 align-middle">
                                    <Badge
                                        variant={call.status === "active"
                                            ? "success"
                                            : call.status === "failed"
                                              ? "destructive"
                                              : "outline"}
                                    >
                                        {call.status}
                                    </Badge>
                                </td>
                                <td class="p-4 align-middle font-medium"
                                    >{call.agentName}</td
                                >
                                <td class="p-4 align-middle capitalize"
                                    >{call.channel}</td
                                >
                                <td class="p-4 align-middle">{call.duration}</td
                                >
                                <td class="p-4 align-middle">{call.time}</td>
                                <td class="p-4 align-middle text-right">
                                    {#if call.recording}
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            class={playingId === call.id
                                                ? "text-primary bg-primary/10"
                                                : ""}
                                            onclick={() => togglePlay(call.id)}
                                        >
                                            {#if playingId === call.id}
                                                <Pause size={16} />
                                            {:else}
                                                <Play size={16} />
                                            {/if}
                                            <span class="ml-2"
                                                >{playingId === call.id
                                                    ? "Stop"
                                                    : "Play"}</span
                                            >
                                        </Button>
                                    {/if}
                                </td>
                            </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </CardContent>
    </Card>
</div>
