<script lang="ts">
    import { Badge } from "$lib/components/ui/badge";
    import { Button } from "$lib/components/ui/button";
    import {
        Card,
        CardContent,
        CardDescription,
        CardFooter,
        CardHeader,
        CardTitle,
    } from "$lib/components/ui/card";
    import { Input } from "$lib/components/ui/input";
    import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from "$lib/components/ui/select";
    import { ArrowRight, Bot, Search, Star } from "lucide-svelte";
    import type { AgentTemplate } from "$lib/types/template";

    export let template: AgentTemplate;
</script>

<Card
    class="hover:shadow-lg transition-all duration-300 flex flex-col h-full bg-card/50 backdrop-blur-sm border-muted"
>
    <CardHeader>
        <div class="flex justify-between items-start mb-2">
            <Badge
                variant={template.complexity === "advanced"
                    ? "destructive"
                    : template.complexity === "intermediate"
                      ? "default"
                      : "secondary"}
                class="uppercase text-[10px]"
            >
                {template.complexity}
            </Badge>
            {#if template.featured}
                <div class="flex items-center text-amber-500">
                    <Star class="w-4 h-4 fill-current" />
                </div>
            {/if}
        </div>
        <CardTitle class="text-xl line-clamp-1">{template.name}</CardTitle>
        <CardDescription class="line-clamp-2 h-10"
            >{template.description}</CardDescription
        >
    </CardHeader>

    <CardContent class="flex-grow space-y-4">
        <div class="flex flex-wrap gap-2">
            {#each template.industry.slice(0, 3) as ind}
                <Badge variant="outline" class="text-xs bg-muted/50"
                    >{ind}</Badge
                >
            {/each}
            {#if template.industry.length > 3}
                <Badge variant="outline" class="text-xs bg-muted/50"
                    >+{template.industry.length - 3}</Badge
                >
            {/if}
        </div>

        <!-- Integrations Section -->
        {#if template.integrations.crm || template.integrations.calendar}
            <div class="text-xs text-muted-foreground">
                <p class="font-medium mb-1">Integrates with:</p>
                <div class="flex gap-2 text-[10px] items-center">
                    {#if template.integrations.crm}
                        <span
                            class="bg-secondary px-1.5 py-0.5 rounded capitalize"
                            >{template.integrations.crm.type}</span
                        >
                    {/if}
                    {#if template.integrations.calendar}
                        <span
                            class="bg-secondary px-1.5 py-0.5 rounded capitalize"
                            >{template.integrations.calendar.type}</span
                        >
                    {/if}
                </div>
            </div>
        {/if}
    </CardContent>

    <CardFooter class="pt-4 mt-auto border-t border-muted/50">
        <Button
            variant="ghost"
            class="w-full group hover:bg-primary/10 hover:text-primary transition-colors"
            href="/templates/{template.slug}/customize"
        >
            Use Template
            <ArrowRight
                class="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
            />
        </Button>
    </CardFooter>
</Card>
