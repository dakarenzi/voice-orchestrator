<script lang="ts">
    import { onMount } from "svelte";
    import { setupScrollAnimations } from "$lib/utils/animations";
    import Hero from "$lib/components/landing/Hero.svelte";
    import Features from "$lib/components/landing/Features.svelte";
    import HowItWorks from "$lib/components/landing/HowItWorks.svelte";
    import AgentBuilderPreview from "$lib/components/landing/AgentBuilderPreview.svelte";
    import Integrations from "$lib/components/landing/Integrations.svelte";
    import Metrics from "$lib/components/landing/Metrics.svelte";
    import Pricing from "$lib/components/landing/Pricing.svelte";
    import FinalCTA from "$lib/components/landing/FinalCTA.svelte";

    onMount(() => {
        setupScrollAnimations();
    });
</script>

<svelte:head>
    <title>VoiceOrchestrator - Multi-Channel AI Agent Platform</title>
    <meta
        name="description"
        content="Build voice and chat AI agents that work seamlessly across phone calls, web chat, WhatsApp, and social platforms."
    />
</svelte:head>

<div class="landing-page overflow-x-hidden">
    <Hero />
    <Features />
    <HowItWorks />
    <AgentBuilderPreview />
    <Integrations />
    <Metrics />
    <Pricing />
    <FinalCTA />
</div>
