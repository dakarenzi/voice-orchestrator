<script lang="ts">
    import { landingContent } from "$lib/content/landing";
    import Tooltip from "$lib/components/ui/Tooltip.svelte";
    import { fadeInUp } from "$lib/utils/animations";
    import { ArrowRight } from "lucide-svelte";

    const { integrations } = landingContent;
</script>

<section id="integrations" class="py-24 bg-background border-y">
    <div class="container px-4 md:px-6 mx-auto">
        <div class="text-center mb-16" use:fadeInUp>
            <h2 class="text-3xl font-bold tracking-tighter md:text-4xl">
                {integrations.headline}
            </h2>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {#each integrations.partners as partner, i}
                <div
                    class="flex justify-center"
                    use:fadeInUp={{ delay: i * 50 }}
                >
                    <Tooltip content={partner.category}>
                        <div
                            class="w-40 h-24 flex items-center justify-center rounded-lg border bg-card hover:border-primary/50 hover:shadow-glow transition-all duration-300 grayscale hover:grayscale-0 p-4"
                        >
                            <span class="font-bold text-lg">{partner.name}</span
                            >
                            <!-- If actual logos existed: <img src={partner.logo} alt={partner.name} class="max-h-12 w-auto" /> -->
                        </div>
                    </Tooltip>
                </div>
            {/each}
        </div>

        <div class="text-center" use:fadeInUp={{ delay: 400 }}>
            <a
                href="/docs/api"
                class="inline-flex items-center text-primary hover:underline font-medium"
            >
                View Full API Documentation <ArrowRight class="ml-2 h-4 w-4" />
            </a>
        </div>
    </div>
</section>
