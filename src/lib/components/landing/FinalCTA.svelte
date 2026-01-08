<script lang="ts">
    import { landingContent } from "$lib/content/landing";
    import Button from "$lib/components/ui/Button.svelte";
    import { ArrowRight } from "lucide-svelte";
    import { fadeInUp } from "$lib/utils/animations";

    const { finalCta } = landingContent;
</script>

<section
    class="py-32 relative overflow-hidden flex items-center justify-center"
>
    <div
        class="absolute inset-0 -z-10 bg-gradient-to-t from-primary/20 via-background to-background"
    ></div>

    <div class="container px-4 text-center" use:fadeInUp>
        <h2 class="text-4xl md:text-5xl font-bold tracking-tighter mb-6">
            {finalCta.headline}
        </h2>
        <p class="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {finalCta.subheadline}
        </p>

        <div class="flex flex-col items-center gap-4">
            <Button size="lg" href="/app" class="px-8 shadow-glow">
                {finalCta.cta}
                <ArrowRight class="ml-2 h-5 w-5" />
            </Button>
            <p class="text-sm text-muted-foreground">{finalCta.finePrint}</p>
        </div>
    </div>
</section>
