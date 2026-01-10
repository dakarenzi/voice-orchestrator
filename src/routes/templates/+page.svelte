<script lang="ts">
    import { templates, listTemplates } from "$lib/templates/registry";
    import TemplateCard from "$lib/components/templates/TemplateCard.svelte";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import { Search, Filter, Sparkles } from "lucide-svelte";
    import { Badge } from "$lib/components/ui/badge";
    import { fade } from "svelte/transition";

    let searchQuery = "";
    let selectedCategory: string | null = null;
    let selectedIndustry: string | null = null;

    // Derive filtered templates
    $: filteredTemplates = templates.filter((t) => {
        const matchesSearch =
            t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            t.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory
            ? t.category === selectedCategory
            : true;
        const matchesIndustry = selectedIndustry
            ? t.industry.includes(selectedIndustry as any)
            : true;

        return matchesSearch && matchesCategory && matchesIndustry;
    });

    const categories = Array.from(new Set(templates.map((t) => t.category)));
    const industries = Array.from(
        new Set(templates.flatMap((t) => t.industry)),
    );
</script>

<div
    class="container mx-auto py-12 px-4 max-w-7xl animate-in fade-in duration-500"
>
    <!-- Hero Section -->
    <div class="text-center mb-16 space-y-4">
        <div
            class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-primary/10 text-primary hover:bg-primary/20 mb-4"
        >
            <Sparkles class="w-3 h-3 mr-1" />
            Template Gallery
        </div>
        <h1
            class="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"
        >
            Launch Your AI Agent in Minutes
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose from our collection of production-ready templates.
            Pre-trained, compliant, and ready to deploy.
        </p>
    </div>

    <!-- Filters & Search -->
    <div
        class="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between sticky top-4 z-10 bg-background/80 backdrop-blur-md p-4 rounded-xl border shadow-sm"
    >
        <div class="relative w-full md:w-96">
            <Search
                class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            />
            <Input
                type="search"
                placeholder="Search templates..."
                class="pl-9"
                bind:value={searchQuery}
            />
        </div>

        <div
            class="flex gap-2 overflow-x-auto pb-2 md:pb-0 w-full md:w-auto no-scrollbar"
        >
            <Button
                variant={selectedCategory === null ? "default" : "outline"}
                size="sm"
                onclick={() => (selectedCategory = null)}
            >
                All
            </Button>
            {#each categories as cat}
                <Button
                    variant={selectedCategory === cat ? "default" : "outline"}
                    size="sm"
                    class="capitalize whitespace-nowrap"
                    onclick={() =>
                        (selectedCategory =
                            selectedCategory === cat ? null : cat)}
                >
                    {cat.replace("-", " ")}
                </Button>
            {/each}
        </div>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each filteredTemplates as template (template.id)}
            <div in:fade={{ duration: 300 }}>
                <TemplateCard {template} />
            </div>
        {/each}
    </div>

    <!-- Empty State -->
    {#if filteredTemplates.length === 0}
        <div class="text-center py-20">
            <div
                class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4"
            >
                <search class="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 class="text-xl font-semibold mb-2">No templates found</h3>
            <p class="text-muted-foreground mb-6">
                Try adjusting your search or filters.
            </p>
            <Button
                variant="outline"
                onclick={() => {
                    searchQuery = "";
                    selectedCategory = null;
                }}
            >
                Clear Filters
            </Button>
        </div>
    {/if}
</div>
