<script lang="ts">
    import { Download, AlertCircle } from "lucide-svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import CardContent from "$lib/components/ui/CardContent.svelte";
    import CardHeader from "$lib/components/ui/CardHeader.svelte";
    import Select from "$lib/components/ui/Select.svelte";
    import Chart from "$lib/components/ui/Chart.svelte";

    let range = $state("7d");

    const chartData = {
        line: {
            labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            datasets: [
                {
                    label: "Total Calls",
                    data: [12, 19, 3, 5, 2, 3, 20],
                    fill: true,
                    backgroundColor: "rgba(59, 130, 246, 0.1)",
                    borderColor: "rgb(59, 130, 246)",
                    tension: 0.4,
                },
            ],
        },
        doughnut: {
            labels: ["Web", "Phone", "WhatsApp"],
            datasets: [
                {
                    data: [120, 80, 45],
                    backgroundColor: [
                        "rgba(59, 130, 246, 0.8)",
                        "rgba(16, 185, 129, 0.8)",
                        "rgba(245, 158, 11, 0.8)",
                    ],
                    borderWidth: 1,
                },
            ],
        },
    };
</script>

<div class="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
    <div class="flex justify-between items-center">
        <div>
            <h2 class="text-3xl font-bold tracking-tight">Analytics</h2>
            <p class="text-muted-foreground mt-2">
                Deep dive into conversation metrics.
            </p>
        </div>
        <div class="flex gap-2">
            <Select class="w-40" bind:value={range}>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
            </Select>
            <Button variant="outline"
                ><Download size={16} class="mr-2" /> Export</Button
            >
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card class="p-6">
            <h3 class="text-lg font-semibold mb-6">Call Volume Trend</h3>
            <div class="h-64 flex items-center justify-center">
                <Chart
                    type="line"
                    data={chartData.line}
                    options={{
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                    }}
                />
            </div>
        </Card>
        <Card class="p-6">
            <h3 class="text-lg font-semibold mb-6">Channel Distribution</h3>
            <div class="h-64 flex items-center justify-center">
                <div class="w-2/3 h-full flex justify-center">
                    <Chart
                        type="doughnut"
                        data={chartData.doughnut}
                        options={{ maintainAspectRatio: false }}
                    />
                </div>
            </div>
        </Card>
    </div>

    <Card>
        <CardHeader
            ><h3 class="text-lg font-semibold">
                Detailed Call Metrics
            </h3></CardHeader
        >
        <CardContent>
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b text-left">
                        <th class="pb-3 font-medium text-muted-foreground"
                            >Metric</th
                        >
                        <th class="pb-3 font-medium text-muted-foreground"
                            >Value</th
                        >
                        <th class="pb-3 font-medium text-muted-foreground"
                            >Change</th
                        >
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <tr
                        ><td class="py-3">Avg. Duration</td><td class="py-3"
                            >4m 12s</td
                        ><td class="py-3 text-green-500">+12%</td></tr
                    >
                    <tr
                        ><td class="py-3">Sentiment Score</td><td class="py-3"
                            >8.4/10</td
                        ><td class="py-3 text-green-500">+5%</td></tr
                    >
                    <tr
                        ><td class="py-3">User Interruptions</td><td
                            class="py-3">2.1 avg</td
                        ><td class="py-3 text-red-500">+0.5</td></tr
                    >
                    <tr
                        ><td class="py-3">First Response Time</td><td
                            class="py-3">1.2s</td
                        ><td class="py-3 text-green-500">-0.3s</td></tr
                    >
                </tbody>
            </table>
        </CardContent>
    </Card>
</div>
