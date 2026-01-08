<script lang="ts">
    import { fadeInUp } from "$lib/utils/animations";
    import Badge from "$lib/components/ui/Badge.svelte";
</script>

<section class="py-24 bg-background">
    <div class="container px-4 md:px-6 mx-auto">
        <div
            class="relative rounded-xl border bg-card shadow-2xl overflow-hidden max-w-5xl mx-auto aspect-[16/9] md:aspect-[21/9] flex items-center justify-center bg-muted/10 group"
            use:fadeInUp
        >
            <div
                class="absolute inset-0 bg-gradient-to-tr from-primary/5 to-secondary/5"
            ></div>

            <!-- Mock UI Content -->
            <div
                class="text-center space-y-4 opacity-50 group-hover:opacity-100 transition-opacity"
            >
                <p class="text-2xl font-bold text-muted-foreground">
                    Interactive Builder UI
                </p>
                <p class="text-sm text-muted-foreground">
                    Visual flow editor for complex agent behaviors
                </p>
            </div>

            <!-- Badges -->
            <div class="absolute top-8 left-8">
                <Badge variant="outline" class="bg-background/80 backdrop-blur"
                    >Multi-provider</Badge
                >
            </div>
            <div class="absolute bottom-8 right-8">
                <Badge variant="outline" class="bg-background/80 backdrop-blur"
                    >Real-time testing</Badge
                >
            </div>
            <div class="absolute bottom-8 left-8">
                <Badge variant="outline" class="bg-background/80 backdrop-blur"
                    >Version control</Badge
                >
            </div>
        </div>
    </div>
</section>
