<script lang="ts">
    import { landingContent } from "$lib/content/landing";
    import Button from "$lib/components/ui/Button.svelte";
    import { Check } from "lucide-svelte";
    import { fadeInUp } from "$lib/utils/animations";

    const { pricing } = landingContent;
</script>

<section id="pricing" class="py-24 bg-background">
    <div class="container px-4 md:px-6 mx-auto">
        <div class="text-center mb-16" use:fadeInUp>
            <h2 class="text-3xl font-bold tracking-tighter md:text-4xl">
                {pricing.headline}
            </h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {#each pricing.tiers as tier, i}
                <div
                    class={`relative rounded-2xl border p-8 flex flex-col ${tier.highlight ? "border-primary shadow-glow bg-primary/5" : "bg-card"}`}
                    use:fadeInUp={{ delay: i * 100 }}
                >
                    {#if tier.highlight}
                        <div
                            class="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium"
                        >
                            Most Popular
                        </div>
                    {/if}

                    <div class="mb-6">
                        <h3 class="font-semibold text-lg">{tier.name}</h3>
                        <div class="mt-2 flex items-baseline gap-1">
                            <span class="text-3xl font-bold">{tier.price}</span>
                            {#if tier.price !== "Custom" && tier.price !== "Free"}
                                <span class="text-muted-foreground">/mo</span>
                            {/if}
                        </div>
                    </div>

                    <ul class="space-y-3 mb-8 flex-1">
                        {#each tier.features as feature}
                            <li class="flex items-center gap-2">
                                <Check class="h-4 w-4 text-primary shrink-0" />
                                <span class="text-sm text-muted-foreground"
                                    >{feature}</span
                                >
                            </li>
                        {/each}
                    </ul>

                    <Button
                        variant={tier.highlight ? "primary" : "outline"}
                        class="w-full"
                    >
                        {tier.cta}
                    </Button>
                </div>
            {/each}
        </div>
    </div>
</section>
