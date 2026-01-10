<script lang="ts">
    import Badge from "$lib/components/ui/Badge.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import CardHeader from "$lib/components/ui/CardHeader.svelte";
    import CardContent from "$lib/components/ui/CardContent.svelte";
    import { ArrowRight, Bot, Search, Star } from "lucide-svelte";
    import type { AgentTemplate } from "$lib/types/template";

    interface Props {
        template: AgentTemplate;
    }

    let { template }: Props = $props();
</script>

<Card
    class="h-full flex flex-col group hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 bg-gradient-to-br from-card to-card/50"
>
    <CardHeader class="pb-4">
        <div class="flex justify-between items-start mb-2">
            <div
                class="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300"
            >
                <Bot class="w-6 h-6" />
            </div>
            <div class="flex gap-2">
                {#if template.featured}
                    <Badge
                        variant="secondary"
                        class="bg-amber-500/10 text-amber-600 border-amber-500/20"
                    >
                        <Star class="w-3 h-3 mr-1 fill-current" /> Featured
                    </Badge>
                {/if}
            </div>
        </div>
        <div>
            <h3
                class="text-xl font-bold group-hover:text-primary transition-colors"
            >
                {template.name}
            </h3>
            <p class="text-sm text-muted-foreground line-clamp-2 mt-1">
                {template.description}
            </p>
        </div>
    </CardHeader>

    <CardContent class="flex-grow">
        <div class="flex flex-wrap gap-2 mb-6">
            {#each template.industry as ind}
                <Badge variant="outline" class="capitalize text-[0.7rem]">
                    {ind}
                </Badge>
            {/each}
        </div>

        <div class="space-y-3">
            <div class="flex items-center text-sm text-muted-foreground">
                <div class="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                {template.industry.length} Industry sectors
            </div>
            <div class="flex items-center text-sm text-muted-foreground">
                <div class="w-1.5 h-1.5 rounded-full bg-primary mr-2" />
                Ready to deploy
            </div>
        </div>
    </CardContent>

    <div class="p-6 pt-0 mt-auto">
        <Button href={`/templates/${template.slug}`} class="w-full group">
            View Details
            <ArrowRight
                class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
            />
        </Button>
    </div>
</Card>
