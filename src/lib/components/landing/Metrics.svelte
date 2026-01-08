<script lang="ts">
    import { landingContent } from "$lib/content/landing";
    import { fadeInUp } from "$lib/utils/animations";

    const metrics = landingContent.metrics;
</script>

<section class="py-24 bg-muted/20 relative overflow-hidden">
    <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] -z-10"
    ></div>

    <div class="container px-4 md:px-6 mx-auto">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            {#each metrics as metric, i}
                <div
                    class="p-8 rounded-2xl border bg-background/50 backdrop-blur-sm shadow-sm hover:border-primary/30 transition-colors text-center"
                    use:fadeInUp={{ delay: i * 100 }}
                >
                    <div
                        class="text-4xl md:text-5xl font-bold text-primary mb-2 tracking-tight"
                    >
                        {metric.value}
                    </div>
                    <div class="text-lg font-semibold mb-1">{metric.label}</div>
                    <p class="text-muted-foreground">{metric.description}</p>
                </div>
            {/each}
        </div>
    </div>
</section>
