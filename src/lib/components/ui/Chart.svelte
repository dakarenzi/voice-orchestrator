<script lang="ts">
    import { onMount } from "svelte";
    import { Chart, registerables } from "chart.js";
    import type { ChartConfiguration } from "chart.js";

    Chart.register(...registerables);

    interface Props {
        type: ChartConfiguration["type"];
        data: ChartConfiguration["data"];
        options?: ChartConfiguration["options"];
        class?: string;
    }

    let { type, data, options, class: className }: Props = $props();
    let chartInstance: Chart | null = null;
    let canvas: HTMLCanvasElement;

    function initChart(node: HTMLCanvasElement) {
        chartInstance = new Chart(node, {
            type,
            data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                ...options,
            },
        });

        return {
            update(newData: any) {
                // Optimization: Deep compare or just update
                // For now, destroy and recreate or update data props
                if (chartInstance) {
                    chartInstance.data = newData.data;
                    chartInstance.update();
                }
            },
            destroy() {
                chartInstance?.destroy();
            },
        };
    }

    // Reactivity for data updates
    $effect(() => {
        if (chartInstance) {
            chartInstance.data = data;
            chartInstance.update();
        }
    });
</script>

<div class={className}>
    <canvas bind:this={canvas} use:initChart></canvas>
</div>
