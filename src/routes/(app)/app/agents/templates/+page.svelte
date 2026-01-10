<script lang="ts">
    import { page } from "$app/stores";
    import { goto } from "$app/navigation";
    import { INDUSTRIES, TEMPLATE_CATEGORIES } from "$lib/types/template";
    import Input from "$lib/components/ui/Input.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import CardContent from "$lib/components/ui/CardContent.svelte";
    import {
        Search,
        Filter,
        Sparkles,
        Users,
        MessageSquare,
        Phone,
        Globe,
        Share2,
    } from "lucide-svelte";
    import type { PageData } from "./$types";

    export let data: PageData;
    let { templates, filters } = data;

    // Reactive update when data changes (SSR/Client nav)
    $: ({ templates, filters } = data);

    let searchQuery = filters.search || "";
    let selectedIndustry = filters.industry || "all";
    let selectedUseCase = filters.useCase || "all";
    let showFeaturedOnly = filters.featured || false;

    let industries = INDUSTRIES;
    let useCases = TEMPLATE_CATEGORIES;

    let searchTimeout: NodeJS.Timeout;

    function updateFilters() {
        const params = new URLSearchParams($page.url.searchParams);

        if (selectedIndustry && selectedIndustry !== "all")
            params.set("industry", selectedIndustry);
        else params.delete("industry");

        if (selectedUseCase && selectedUseCase !== "all")
            params.set("useCase", selectedUseCase);
        else params.delete("useCase");

        if (searchQuery) params.set("q", searchQuery);
        else params.delete("q");

        if (showFeaturedOnly) params.set("featured", "true");
        else params.delete("featured");

        goto(`?${params.toString()}`, { keepFocus: true, noScroll: true });
    }

    function handleSearch(e: Event) {
        const value = (e.target as HTMLInputElement).value;
        searchQuery = value;
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(updateFilters, 300);
    }

    function clearFilters() {
        searchQuery = "";
        selectedIndustry = "all";
        selectedUseCase = "all";
        showFeaturedOnly = false;
        goto("/app/agents/templates");
    }
</script>

<div class="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
    <!-- Header -->
    <div
        class="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
    >
        <div>
            <h1 class="text-3xl font-bold tracking-tight text-txt-primary">
                Agent Templates
            </h1>
            <p class="text-txt-muted mt-2 text-lg">
                Start with a pre-built agent and customize it for your business.
            </p>
        </div>
        <div class="hidden md:block">
            <Button variant="outline" href="/app/agents">View My Agents</Button>
        </div>
    </div>

    <!-- Filters -->
    <div
        class="bg-bg-surface border border-brd-default rounded-xl p-4 space-y-4 shadow-sm"
    >
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div class="relative col-span-1 md:col-span-2">
                <Search
                    class="absolute left-3 top-1/2 -translate-y-1/2 text-txt-muted"
                    size={16}
                />
                <Input
                    placeholder="Search templates..."
                    class="pl-9"
                    value={searchQuery}
                    oninput={handleSearch}
                />
            </div>

            <select
                class="flex h-10 w-full rounded-md border border-brd-default bg-bg-surface px-3 py-2 text-sm ring-offset-bg-default file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-txt-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acn-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-txt-primary"
                bind:value={selectedIndustry}
                onchange={updateFilters}
            >
                <option value="all">All Industries</option>
                {#each industries as ind}
                    <option value={ind}
                        >{ind
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}</option
                    >
                {/each}
            </select>

            <select
                class="flex h-10 w-full rounded-md border border-brd-default bg-bg-surface px-3 py-2 text-sm ring-offset-bg-default file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-txt-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acn-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-txt-primary"
                bind:value={selectedUseCase}
                onchange={updateFilters}
            >
                <option value="all">All Use Cases</option>
                {#each useCases as uc}
                    <option value={uc}
                        >{uc
                            .replace("-", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}</option
                    >
                {/each}
            </select>
        </div>

        <div
            class="flex flex-wrap items-center justify-between gap-4 pt-2 border-t"
        >
            <label
                class="flex items-center gap-2 text-sm cursor-pointer select-none"
            >
                <input
                    type="checkbox"
                    class="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                    bind:checked={showFeaturedOnly}
                    onchange={updateFilters}
                />
                <span>Show Featured Only</span>
            </label>

            {#if searchQuery || selectedIndustry !== "all" || selectedUseCase !== "all" || showFeaturedOnly}
                <Button
                    variant="ghost"
                    size="sm"
                    class="text-muted-foreground hover:text-foreground h-8"
                    onclick={clearFilters}
                >
                    Clear filters
                </Button>
            {/if}
        </div>
    </div>

    <!-- Grid -->
    {#if templates.length === 0}
        <div
            class="text-center py-20 border-2 border-dashed rounded-xl bg-muted/10"
        >
            <div
                class="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4"
            >
                <Filter class="text-muted-foreground" size={24} />
            </div>
            <h3 class="text-lg font-semibold">No templates found</h3>
            <p class="text-muted-foreground mt-1 max-w-sm mx-auto">
                We couldn't find any templates matching your filters. Try
                adjusting them or clear all filters.
            </p>
            <Button variant="outline" class="mt-6" onclick={clearFilters}
                >Clear filters</Button
            >
        </div>
    {:else}
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {#each templates as template}
                <div
                    class="group bg-bg-surface rounded-2xl shadow-sm hover:shadow-2xl border border-brd-default overflow-hidden transition-all duration-300 hover:-translate-y-1 flex flex-col h-full"
                >
                    <!-- Gradient Header -->
                    <div
                        class={`h-32 relative overflow-hidden bg-gradient-to-br ${
                            template.industry === "retail"
                                ? "from-green-500 to-emerald-600"
                                : template.industry === "healthcare"
                                  ? "from-teal-500 to-cyan-600"
                                  : template.industry === "restaurant" ||
                                      template.industry === "hospitality"
                                    ? "from-orange-500 to-red-600"
                                    : template.industry === "education"
                                      ? "from-indigo-500 to-blue-600"
                                      : template.industry === "real-estate"
                                        ? "from-slate-600 to-blue-600"
                                        : "from-blue-500 to-indigo-600" /* SaaS/Default */
                        }`}
                    >
                        <div class="absolute inset-0 bg-black/10"></div>
                        <div
                            class="absolute inset-0 flex items-center justify-center"
                        >
                            <div
                                class="text-white opacity-90 transform group-hover:scale-110 transition-transform duration-300"
                            >
                                {#if template.industry === "retail"}<Share2
                                        size={48}
                                        strokeWidth={1.5}
                                    />
                                {:else if template.industry === "healthcare"}<Sparkles
                                        size={48}
                                        strokeWidth={1.5}
                                    />
                                {:else if template.industry === "restaurant"}<MessageSquare
                                        size={48}
                                        strokeWidth={1.5}
                                    />
                                {:else if template.industry === "real-estate"}<Globe
                                        size={48}
                                        strokeWidth={1.5}
                                    />
                                {:else}<Sparkles
                                        size={48}
                                        strokeWidth={1.5}
                                    />{/if}
                            </div>
                        </div>

                        {#if template.featured}
                            <div
                                class="absolute top-3 right-3 bg-amber-400 text-amber-900 px-2 py-1 rounded-full shadow-lg flex items-center gap-1 text-xs font-bold"
                            >
                                <Sparkles size={12} /> Featured
                            </div>
                        {/if}
                    </div>

                    <!-- Content -->
                    <div class="p-6 flex flex-col flex-1">
                        <div class="flex items-center justify-between mb-3">
                            <span
                                class="px-3 py-1 bg-bg-accent-subtle text-acn-primary text-xs font-semibold rounded-full capitalize"
                            >
                                {(Array.isArray(template.industry)
                                    ? template.industry[0]
                                    : template.industry
                                ).replace("-", " ")}
                            </span>
                            <div class="flex items-center gap-1 text-amber-500">
                                <!-- Mock rating for design consistency -->
                                <Sparkles class="w-3 h-3 fill-amber-500" />
                                <span
                                    class="text-sm font-semibold text-txt-secondary"
                                    >4.9</span
                                >
                            </div>
                        </div>

                        <h3
                            class="text-xl font-bold text-txt-primary mb-2 group-hover:text-acn-primary transition-colors line-clamp-1"
                        >
                            {template.name}
                        </h3>

                        <p
                            class="text-txt-secondary text-sm mb-4 line-clamp-2 min-h-[40px]"
                        >
                            {template.description}
                        </p>

                        <!-- Channels & Stats -->
                        <div
                            class="flex items-center gap-3 mb-6 pt-4 border-t border-brd-subtle"
                        >
                            <div class="flex gap-2 text-txt-muted">
                                {#if template.channels?.voice?.inbound}<Phone
                                        size={16}
                                        class="text-txt-secondary"
                                    />{/if}
                                {#if template.channels?.chat?.enabled}<MessageSquare
                                        size={16}
                                        class="text-txt-secondary"
                                    />{/if}
                                {#if template.channels?.whatsapp?.enabled}<Share2
                                        size={16}
                                        class="text-txt-secondary"
                                    />{/if}
                            </div>
                            <div
                                class="flex-1 text-right text-xs text-txt-muted font-medium flex items-center justify-end gap-1"
                            >
                                <Users size={14} />
                                {template.usageCount?.toLocaleString() || 0} uses
                            </div>
                        </div>

                        <div class="mt-auto">
                            <Button
                                class="w-full flex items-center justify-center gap-2"
                                variant="primary"
                                href={`/app/agents/templates/${template.slug}`}
                            >
                                <Sparkles size={16} /> Use Template
                            </Button>
                        </div>
                    </div>
                </div>
            {/each}
        </div>
    {/if}
</div>
