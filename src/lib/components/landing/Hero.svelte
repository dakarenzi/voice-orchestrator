<script lang="ts">
    import { landingContent } from "$lib/content/landing";
    import { fadeInUp } from "$lib/utils/animations";
    import AnimatedGraph from "./AnimatedGraph.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";
    import { ArrowRight, PlayCircle } from "lucide-svelte";

    const { hero } = landingContent;
</script>

<section
    class="relative min-h-[90vh] flex flex-col items-center justify-center pt-32 pb-16 overflow-hidden"
>
    <!-- Background Effects -->
    <div
        class="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary)/0.15),transparent_70%)]"
    ></div>

    <div
        class="container px-4 md:px-6 relative z-10 flex flex-col items-center text-center"
    >
        <!-- Text Content -->
        <div class="max-w-3xl mx-auto space-y-8">
            <div
                class="inline-flex items-center justify-center hero-animate"
                style="animation-delay: 100ms"
            >
                <Badge
                    variant="outline"
                    class="px-4 py-1.5 text-sm backdrop-blur-sm bg-background/50 border-primary/20 text-foreground"
                >
                    {hero.eyebrow}
                </Badge>
            </div>

            <h1
                class="text-4xl md:text-6xl/tight font-bold tracking-tighter text-foreground hero-animate"
                style="animation-delay: 200ms"
            >
                {hero.headline}
            </h1>

            <p
                class="text-xl text-muted-foreground max-w-[42rem] mx-auto hero-animate"
                style="animation-delay: 300ms"
            >
                {hero.subheadline}
            </p>

            <div
                class="flex flex-col sm:flex-row gap-4 justify-center pt-4 hero-animate"
                style="animation-delay: 400ms"
            >
                <Button
                    href={hero.ctaPrimary.href}
                    size="lg"
                    class="group relative overflow-hidden shadow-glow"
                >
                    {hero.ctaPrimary.text}
                    <ArrowRight
                        class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1"
                    />
                    <div
                        class="absolute inset-0 -z-10 bg-gradient-to-r from-primary to-blue-600 opacity-100 transition-opacity"
                    ></div>
                </Button>

                <Button
                    href={hero.ctaSecondary.href}
                    variant="outline"
                    size="lg"
                    class="group backdrop-blur-sm bg-background/50"
                >
                    <PlayCircle class="mr-2 h-4 w-4" />
                    {hero.ctaSecondary.text}
                </Button>
            </div>
        </div>

        <!-- Visual Content -->
        <div class="w-full mt-16 hero-animate" style="animation-delay: 600ms">
            <AnimatedGraph />
        </div>
    </div>
</section>

<style>
    .hero-animate {
        opacity: 0;
        animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>
