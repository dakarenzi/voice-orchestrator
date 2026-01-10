<script lang="ts">
    import type { PageData } from "./$types";
    import { enhance } from "$app/forms";
    import Button from "$lib/components/ui/Button.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import CardContent from "$lib/components/ui/CardContent.svelte";
    import {
        ChevronLeft,
        Sparkles,
        CheckCircle,
        Mic,
        Play,
        MessageCircle,
        ArrowRight,
        BookOpen,
        Globe,
        FileText,
        Users,
    } from "lucide-svelte";

    import { onMount } from "svelte";
    import { afterNavigate } from "$app/navigation";

    export let data: PageData;
    let { template } = data;
    $: ({ template } = data);

    let isPlayingAudio = false;

    function toggleAudio() {
        isPlayingAudio = !isPlayingAudio;
        // Mock audio toggle
        setTimeout(() => (isPlayingAudio = false), 3000);
    }
</script>

<div class="max-w-5xl mx-auto pb-24 animate-in fade-in duration-500">
    <!-- Breadcrumb -->
    <div class="py-4 text-sm text-txt-muted flex items-center gap-2">
        <a
            href="/app/agents/templates"
            class="hover:text-txt-primary flex items-center gap-1"
        >
            <ChevronLeft size={14} /> Back to Templates
        </a>
        <span>/</span>
        <span class="capitalize">{template.industry}</span>
        <span>/</span>
        <span class="text-txt-primary font-medium">{template.name}</span>
    </div>

    <!-- Hero -->
    <div
        class="relative overflow-hidden rounded-3xl bg-bg-surface border border-brd-default shadow-sm mb-10"
    >
        <!-- Decorative Background -->
        <div
            class={`absolute top-0 left-0 w-full h-full opacity-40 bg-gradient-to-br ${
                template.industry === "retail"
                    ? "from-green-500/30 to-emerald-600/30"
                    : template.industry === "healthcare"
                      ? "from-teal-500/30 to-cyan-600/30"
                      : "from-blue-500/30 to-indigo-600/30"
            }`}
        ></div>

        <div
            class="relative p-8 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10"
        >
            <div class="lg:col-span-2 space-y-6">
                <div class="flex flex-wrap gap-3 items-center">
                    <div
                        class={`p-3 rounded-2xl bg-gradient-to-br text-white shadow-lg ${
                            template.industry === "retail"
                                ? "from-green-500 to-emerald-600"
                                : template.industry === "healthcare"
                                  ? "from-teal-500 to-cyan-600"
                                  : "from-blue-500 to-indigo-600"
                        }`}
                    >
                        <div class="text-3xl">
                            {template.iconUrl || "🤖"}
                        </div>
                    </div>
                    <Badge
                        variant="secondary"
                        class="capitalize px-3 py-1 text-sm"
                        >{template.industry}</Badge
                    >
                    {#if template.featured}
                        <Badge
                            variant="warning"
                            class="flex gap-1 items-center px-3 py-1 text-sm shadow-sm"
                            ><Sparkles size={12} /> Featured</Badge
                        >
                    {/if}
                </div>

                <div>
                    <h1
                        class="text-4xl md:text-5xl font-extrabold tracking-tight text-txt-primary mb-4"
                    >
                        {template.name}
                    </h1>
                    <p
                        class="text-xl text-txt-secondary leading-relaxed max-w-2xl"
                    >
                        {template.description}
                    </p>
                </div>

                {#if template.longDescription}
                    <div
                        class="prose prose-slate text-txt-secondary max-w-none border-t border-brd-subtle pt-6"
                    >
                        {@html template.longDescription.replace(/\n/g, "<br/>")}
                    </div>
                {/if}

                <div
                    class="flex items-center gap-4 text-sm text-txt-muted pt-2"
                >
                    <div class="flex items-center gap-1">
                        <Users size={16} />
                        <strong
                            >{template.usageCount?.toLocaleString() ||
                                0}</strong
                        > uses
                    </div>
                    <span>•</span>
                    <div class="flex items-center gap-1">
                        <CheckCircle size={16} class="text-status-success" /> Verified
                        Template
                    </div>
                </div>
            </div>

            <!-- Sticky Sidebar CTA -->
            <div class="lg:col-span-1">
                <div
                    class="bg-bg-surface rounded-2xl shadow-xl border border-brd-subtle p-6 space-y-6 sticky top-24"
                >
                    <div class="text-center space-y-2">
                        <h3 class="font-bold text-xl text-txt-primary">
                            Ready to deploy?
                        </h3>
                        <p class="text-txt-secondary">
                            Launch this agent in your workspace in ~2 minutes.
                        </p>
                    </div>

                    <form
                        method="POST"
                        action="?/use"
                        use:enhance
                        class="space-y-4"
                    >
                        <Button
                            class="w-full h-14 text-lg font-bold shadow-lg shadow-blue-500/20"
                            size="lg"
                            variant="primary"
                        >
                            <Sparkles class="mr-2" size={20} /> Use Template
                        </Button>
                        <p class="text-xs text-center text-slate-400">
                            Includes 14-day free trial on Pro plan
                        </p>
                    </form>

                    <div class="space-y-3 pt-6 border-t border-brd-subtle">
                        <div
                            class="flex items-center gap-3 text-sm text-txt-secondary"
                        >
                            <div
                                class="p-1.5 bg-status-success-bg text-status-success rounded-full"
                            >
                                <CheckCircle size={14} />
                            </div>
                            Pre-configured prompts
                        </div>
                        <div
                            class="flex items-center gap-3 text-sm text-txt-secondary"
                        >
                            <div
                                class="p-1.5 bg-status-success-bg text-status-success rounded-full"
                            >
                                <CheckCircle size={14} />
                            </div>
                            Industry best practices
                        </div>
                        <div
                            class="flex items-center gap-3 text-sm text-txt-secondary"
                        >
                            <div
                                class="p-1.5 bg-status-success-bg text-status-success rounded-full"
                            >
                                <CheckCircle size={14} />
                            </div>
                            Full source access
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-12 mt-16">
        <!-- What's Included -->
        <div class="space-y-6">
            <h2 class="text-2xl font-bold">What's Included</h2>

            <div class="space-y-4">
                <div class="flex items-start gap-4">
                    <div class="p-2 bg-muted rounded-lg">
                        <MessageCircle size={20} />
                    </div>
                    <div>
                        <h3 class="font-semibold">Optimized Channels</h3>
                        <p class="text-sm text-muted-foreground">
                            Configured for
                            {[
                                template.channels?.voice?.inbound
                                    ? "Inbound Voice"
                                    : "",
                                template.channels?.chat?.enabled
                                    ? "Web Chat"
                                    : "",
                                template.channels?.whatsapp?.enabled
                                    ? "WhatsApp"
                                    : "",
                            ]
                                .filter(Boolean)
                                .join(", ")}.
                        </p>
                    </div>
                </div>

                <div class="flex items-start gap-4">
                    <div
                        class="p-2 bg-bg-surface-raised rounded-lg text-acn-primary"
                    >
                        <Mic size={20} />
                    </div>
                    <div>
                        <h3 class="font-semibold text-txt-primary">
                            Professional Voice Profile
                        </h3>
                        <p class="text-sm text-txt-muted mb-2">
                            {template.voice?.voiceId || "Default Voice"}
                        </p>
                        <Button
                            variant="outline"
                            size="sm"
                            class="gap-2 h-8"
                            onclick={toggleAudio}
                        >
                            {#if isPlayingAudio}
                                <span class="animate-pulse">Playing...</span>
                            {:else}
                                <Play size={12} /> Play Sample
                            {/if}
                        </Button>
                    </div>
                </div>

                <div class="flex items-start gap-4">
                    <div class="p-2 bg-muted rounded-lg">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <h3 class="font-semibold">Knowledge Requirements</h3>
                        <p class="text-sm text-muted-foreground mb-2">
                            Pre-structured to ingest:
                        </p>
                        <ul class="text-sm gap-2 grid">
                            {#each template.knowledgeBase?.documents?.requiredDocs || [] as doc}
                                <li
                                    class="flex items-center gap-2 border px-2 py-1 rounded bg-background"
                                >
                                    <FileText size={12} />
                                    <span class="text-muted-foreground"
                                        >{doc}</span
                                    >
                                    <span class="text-xs text-red-500"
                                        >*Req</span
                                    >
                                </li>
                            {/each}
                        </ul>
                    </div>
                </div>
            </div>
        </div>

        <!-- Sample Conversation -->
        <div class="space-y-6">
            <h2 class="text-2xl font-bold">See It In Action</h2>
            <Card class="bg-slate-50 dark:bg-slate-900 border-dashed">
                <CardContent class="p-6 space-y-4">
                    <div class="flex gap-3">
                        <div
                            class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0"
                        >
                            👤
                        </div>
                        <div
                            class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm max-w-[85%]"
                        >
                            Hi, I ordered a jacket last week but it hasn't
                            arrived.
                        </div>
                    </div>

                    <div class="flex gap-3 flex-row-reverse">
                        <div
                            class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-lg"
                        >
                            {template.iconUrl}
                        </div>
                        <div
                            class="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none shadow-sm text-sm max-w-[85%]"
                        >
                            I can help with that! Do you have your order number
                            handy? It usually starts with #ORD.
                        </div>
                    </div>

                    <div class="flex gap-3">
                        <div
                            class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0"
                        >
                            👤
                        </div>
                        <div
                            class="bg-white dark:bg-slate-800 p-3 rounded-2xl rounded-tl-none shadow-sm text-sm max-w-[85%]"
                        >
                            Yes, it's #ORD-99281.
                        </div>
                    </div>

                    <div class="flex gap-3 flex-row-reverse">
                        <div
                            class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-lg"
                        >
                            {template.iconUrl}
                        </div>
                        <div
                            class="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-none shadow-sm text-sm max-w-[85%]"
                        >
                            Thanks using our tracker... I see that order is
                            marked "Out for Delivery" today by 5 PM. Is there
                            anything else I can check for you?
                        </div>
                    </div>

                    <p
                        class="text-xs text-center text-muted-foreground pt-2 italic"
                    >
                        Sample conversation. The agent will adapt to your rules.
                    </p>
                </CardContent>
            </Card>
        </div>
    </div>
</div>

<!-- Mobile Sticky Bottom Bar -->
<div
    class="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-background border-t z-50"
>
    <form method="POST" action="?/use" use:enhance>
        <Button
            class="w-full shadow-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
            size="lg">Use This Template</Button
        >
    </form>
</div>
