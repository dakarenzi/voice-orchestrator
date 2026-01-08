<script lang="ts">
    import { landingContent } from "$lib/content/landing";
    import { staggerChildren } from "$lib/utils/animations";
    import FeatureCard from "./FeatureCard.svelte";
    import { Phone, MessageSquare, Share2 } from "lucide-svelte";

    const { features } = landingContent;

    // Map string icon names to components
    const iconMap: Record<string, any> = {
        phone: Phone,
        "message-square": MessageSquare,
        "share-2": Share2,
    };
</script>

<section id="features" class="py-24 bg-background">
    <div class="container px-4 md:px-6 mx-auto">
        <div class="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 class="text-3xl font-bold tracking-tighter md:text-4xl">
                {features.headline}
            </h2>
            <p class="text-muted-foreground text-lg">{features.subheadline}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8" use:staggerChildren>
            {#each features.cards as card}
                <div class="h-full">
                    <FeatureCard
                        icon={iconMap[card.icon]}
                        headline={card.headline}
                        body={card.body}
                        badge={card.badge}
                    />
                </div>
            {/each}
        </div>
    </div>
</section>
