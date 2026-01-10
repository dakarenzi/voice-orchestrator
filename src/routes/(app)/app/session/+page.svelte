<script lang="ts">
    import { Download, Play, Pause } from "lucide-svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import CardContent from "$lib/components/ui/CardContent.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";
    import CallLogTable from "$lib/components/ui/CallLogTable.svelte";

    // Mock Data
    const calls = [
        {
            id: "c1",
            caller: "Customer Support Bot",
            channel: "web",
            status: "ended",
            duration: "4m 5s",
            time: new Date().toLocaleTimeString(),
            recording: "#",
        },
        {
            id: "c2",
            caller: "Sales Bot",
            channel: "phone",
            status: "active",
            duration: "30s",
            time: new Date().toLocaleTimeString(),
            recording: null,
        },
        {
            id: "c3",
            caller: "Reservation",
            channel: "phone",
            status: "incoming",
            duration: "12s",
            time: new Date().toLocaleTimeString(),
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
            <h2 class="text-3xl font-bold tracking-tight text-txt-primary">
                Call Logs
            </h2>
            <p class="text-txt-muted mt-2">History of all interactions.</p>
        </div>
        <Button variant="outline"
            ><Download size={16} class="mr-2" /> Export CSV</Button
        >
    </div>

    <CallLogTable {calls} />
</div>
