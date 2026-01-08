<script lang="ts">
    import { landingContent } from "$lib/content/landing";
    import { Zap, Mic, Sparkles, Volume2 } from "lucide-svelte";
    import { fadeInUp } from "$lib/utils/animations";

    const { howItWorks } = landingContent;

    const iconMap: Record<string, any> = {
        zap: Zap,
        mic: Mic,
        sparkles: Sparkles,
        "volume-2": Volume2,
    };
</script>

<section id="how-it-works" class="py-24 bg-muted/30 overflow-hidden">
    <div class="container px-4 md:px-6 mx-auto">
        <div class="text-center mb-16" use:fadeInUp>
            <h2 class="text-3xl font-bold tracking-tighter md:text-4xl">
                {howItWorks.headline}
            </h2>
        </div>

        <div class="relative max-w-4xl mx-auto mb-16">
            <!-- Connecting Line -->
            <div
                class="hidden md:block absolute top-12 left-0 w-full h-0.5 border-t-2 border-dashed border-muted-foreground/30 -z-10"
            ></div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
                {#each howItWorks.steps as step, i}
                    {@const Icon = iconMap[step.icon]}
                    <div
                        class="flex flex-col items-center text-center space-y-4"
                        use:fadeInUp={{ delay: i * 100 }}
                    >
                        <div
                            class="w-24 h-24 rounded-full bg-background border-2 border-primary/20 flex items-center justify-center shadow-lg relative"
                        >
                            <Icon class="w-10 h-10 text-primary" />
                            <div
                                class="absolute -bottom-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full"
                            >
                                {i + 1}
                            </div>
                        </div>
                        <div>
                            <h3 class="font-bold text-lg">{step.title}</h3>
                            <p class="text-sm text-muted-foreground">
                                {step.description}
                            </p>
                        </div>
                    </div>
                {/each}
            </div>
        </div>

        <!-- Code Snippet -->
        <div
            class="max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl border bg-[#0d1117]"
            use:fadeInUp={{ delay: 400 }}
        >
            <div
                class="bg-[#161b22] px-4 py-2 flex items-center gap-2 border-b border-[#30363d]"
            >
                <div class="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
                <div class="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
                <div class="w-3 h-3 rounded-full bg-[#27c93f]"></div>
                <span class="ml-2 text-xs text-gray-400 font-mono"
                    >workflow.ts</span
                >
            </div>
            <pre
                class="p-6 md:p-8 overflow-x-auto text-sm md:text-base font-mono leading-relaxed text-[#c9d1d9] bg-transparent"><code
                    >{howItWorks.codeSnippet}</code
                ></pre>
        </div>
    </div>
</section>
