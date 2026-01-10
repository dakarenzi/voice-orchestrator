<script lang="ts">
    import { page } from "$app/stores";
    import { getTemplateBySlug } from "$lib/templates/registry";
    import { Button } from "$lib/components/ui/button";
    import { Badge } from "$lib/components/ui/badge";
    import {
        ArrowLeft,
        Play,
        CheckCircle2,
        Shield,
        Zap,
        Globe,
        MessageSquare,
        Phone,
    } from "lucide-svelte";
    import { fade, fly } from "svelte/transition";

    $: slug = $page.params.slug;
    $: template = getTemplateBySlug(slug);

    const steps = [
        { title: "Select Template", desc: "You are here" },
        { title: "Customize", desc: "Configure behavior & voice" },
        { title: "Connect", desc: "Link phone & integrations" },
        { title: "Deploy", desc: "Go live instantly" },
    ];
</script>

<div class="min-h-screen pb-20">
    {#if template}
        <!-- Hero Header -->
        <div class="relative overflow-hidden border-b bg-muted/20 pb-12 pt-8">
            <div class="container max-w-6xl mx-auto px-4">
                <Button
                    variant="ghost"
                    href="/templates"
                    class="mb-6 -ml-2 text-muted-foreground hover:text-foreground"
                >
                    <ArrowLeft class="w-4 h-4 mr-2" />
                    Back to Gallery
                </Button>

                <div class="flex flex-col md:flex-row gap-8 items-start">
                    <!-- Icon/Avatar -->
                    <div class="relative shrink-0">
                        <div
                            class="w-24 h-24 md:w-32 md:h-32 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border flex items-center justify-center shadow-lg"
                        >
                            {#if template.visual.avatar.type === "image" && template.visual.avatar.url}
                                <img
                                    src={template.visual.avatar.url}
                                    alt={template.name}
                                    class="w-full h-full object-cover rounded-2xl"
                                />
                            {:else}
                                <Zap class="w-12 h-12 text-primary" />
                            {/if}
                        </div>
                        {#if template.featured}
                            <Badge
                                class="absolute -top-3 -right-3 border-background border-2 shadow-sm"
                                variant="default">Featured</Badge
                            >
                        {/if}
                    </div>

                    <!-- Content -->
                    <div class="flex-1 space-y-4">
                        <div class="flex flex-wrap gap-2 mb-2">
                            <Badge variant="outline" class="capitalize"
                                >{template.category.replace("-", " ")}</Badge
                            >
                            {#each template.industry as ind}
                                <Badge
                                    variant="secondary"
                                    class="bg-primary/5 text-primary capitalize"
                                    >{ind}</Badge
                                >
                            {/each}
                        </div>

                        <h1
                            class="text-3xl md:text-5xl font-bold tracking-tight"
                        >
                            {template.name}
                        </h1>
                        <p
                            class="text-lg md:text-xl text-muted-foreground max-w-2xl"
                        >
                            {template.description}
                        </p>

                        <div class="flex flex-wrap gap-4 pt-2">
                            <Button
                                size="lg"
                                class="shadow-lg shadow-primary/20"
                                href="/templates/{template.slug}/customize"
                            >
                                Use This Template
                                <Zap class="w-4 h-4 ml-2" />
                            </Button>
                            {#if template.voice.voicePreview}
                                <Button variant="outline" size="lg">
                                    <Play class="w-4 h-4 mr-2" />
                                    Listen to Voice
                                </Button>
                            {/if}
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div
            class="container max-w-6xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12"
        >
            <!-- Left Column: Details -->
            <div class="lg:col-span-2 space-y-12">
                <!-- Behavior Section -->
                <section class="space-y-6">
                    <h3 class="text-2xl font-bold flex items-center">
                        <MessageSquare class="w-6 h-6 mr-3 text-primary" />
                        What This Agent Does
                    </h3>
                    <div
                        class="prose dark:prose-invert max-w-none text-muted-foreground"
                    >
                        <p class="whitespace-pre-line">
                            {template.longDescription}
                        </p>
                    </div>

                    <div class="bg-card border rounded-xl p-6 shadow-sm">
                        <h4 class="font-semibold mb-4 text-foreground">
                            Conversation Capabilities
                        </h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {#each template.knowledgeBase.intents as intent}
                                <div class="flex items-start">
                                    <CheckCircle2
                                        class="w-5 h-5 mr-3 text-green-500 shrink-0 mt-0.5"
                                    />
                                    <div>
                                        <span
                                            class="font-medium block text-foreground capitalize"
                                            >{intent.name.replace(
                                                /_/g,
                                                " ",
                                            )}</span
                                        >
                                        <span
                                            class="text-sm text-muted-foreground"
                                            >"{intent.examples[0]}"</span
                                        >
                                    </div>
                                </div>
                            {/each}
                        </div>
                    </div>
                </section>

                <!-- Compliance Section -->
                <section class="space-y-6">
                    <h3 class="text-2xl font-bold flex items-center">
                        <Shield class="w-6 h-6 mr-3 text-primary" />
                        Compliance & Safety
                    </h3>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {#each template.behavior.guardrails.complianceRules as rule}
                            <div class="border rounded-lg p-4 bg-muted/10">
                                <div class="flex items-center gap-2 mb-2">
                                    <Badge
                                        variant="outline"
                                        class="font-mono text-[10px]"
                                        >{rule.type}</Badge
                                    >
                                </div>
                                <p class="text-sm font-medium">
                                    {rule.description}
                                </p>
                            </div>
                        {/each}
                    </div>
                </section>
            </div>

            <!-- Right Column: Sidebar -->
            <div class="space-y-8">
                <!-- Setup steps -->
                <div class="border rounded-xl p-6 bg-card sticky top-24">
                    <h4 class="font-semibold mb-6">Setup Process</h4>
                    <div class="space-y-6">
                        {#each steps as step, i}
                            <div class="flex gap-4">
                                <div class="flex flex-col items-center">
                                    <div
                                        class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                                    {i === 0
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted text-muted-foreground'}"
                                    >
                                        {i + 1}
                                    </div>
                                    {#if i < steps.length - 1}
                                        <div
                                            class="w-0.5 h-full bg-muted mt-2 min-h-[20px]"
                                        ></div>
                                    {/if}
                                </div>
                                <div>
                                    <h5
                                        class="font-medium text-sm {i === 0
                                            ? 'text-foreground'
                                            : 'text-muted-foreground'}"
                                    >
                                        {step.title}
                                    </h5>
                                    <p class="text-xs text-muted-foreground">
                                        {step.desc}
                                    </p>
                                </div>
                            </div>
                        {/each}
                    </div>

                    <div class="mt-8 pt-6 border-t">
                        <div
                            class="flex justify-between items-center text-sm mb-2"
                        >
                            <span class="text-muted-foreground"
                                >Estimated Setup</span
                            >
                            <span class="font-medium"
                                >{template.deployment.estimatedSetupTime} mins</span
                            >
                        </div>
                        <div class="flex justify-between items-center text-sm">
                            <span class="text-muted-foreground">Complexity</span
                            >
                            <span class="capitalize font-medium"
                                >{template.complexity}</span
                            >
                        </div>
                    </div>
                </div>

                <!-- Integrations List -->
                <div class="border rounded-xl p-6 bg-muted/10">
                    <h4 class="font-semibold mb-4 flex items-center">
                        <Globe class="w-4 h-4 mr-2" />
                        Integrations
                    </h4>
                    <div class="space-y-3">
                        {#if template.integrations.crm}
                            <div
                                class="flex items-center justify-between text-sm"
                            >
                                <span>CRM</span>
                                <Badge variant="secondary" class="capitalize"
                                    >{template.integrations.crm.type}</Badge
                                >
                            </div>
                        {/if}
                        {#if template.integrations.payment}
                            <div
                                class="flex items-center justify-between text-sm"
                            >
                                <span>Payment</span>
                                <Badge variant="secondary" class="capitalize"
                                    >{template.integrations.payment.type}</Badge
                                >
                            </div>
                        {/if}
                        {#if template.integrations.calendar}
                            <div
                                class="flex items-center justify-between text-sm"
                            >
                                <span>Calendar</span>
                                <Badge variant="secondary" class="capitalize"
                                    >{template.integrations.calendar
                                        .type}</Badge
                                >
                            </div>
                        {/if}
                    </div>
                </div>
            </div>
        </div>
    {:else}
        <div class="container py-20 text-center">
            <h1 class="text-2xl font-bold">Template not found</h1>
            <Button href="/templates" variant="link" class="mt-4"
                >Back to Gallery</Button
            >
        </div>
    {/if}
</div>
