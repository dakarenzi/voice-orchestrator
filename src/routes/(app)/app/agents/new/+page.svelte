<script lang="ts">
    import { page } from "$app/stores";
    import { wizardStore } from "$lib/stores/wizardStore.svelte";
    import WizardLayout from "$lib/components/wizard/WizardLayout.svelte";
    import { CheckCircle2 } from "lucide-svelte";

    import StepIdentity from "$lib/components/wizard/StepIdentity.svelte";
    import StepBehavior from "$lib/components/wizard/StepBehavior.svelte";
    import StepVoice from "$lib/components/wizard/StepVoice.svelte";
    import StepKnowledge from "$lib/components/wizard/StepKnowledge.svelte";
    import StepConnect from "$lib/components/wizard/StepConnect.svelte";
    import StepReview from "$lib/components/wizard/StepReview.svelte";

    import { onMount } from "svelte";
    import { templates } from "$lib/templates";
    import { mapTemplateToAgent } from "$lib/utils/template-mapper";

    const fromTemplate = $derived(
        $page.url.searchParams.get("fromTemplate") === "true",
    );
    const templateId = $derived($page.url.searchParams.get("templateId"));

    // Reset store on mount, BUT load template if present
    $effect(() => {
        if (fromTemplate && templateId) {
            const tData = templates.find((t) => t.id === templateId);
            if (tData) {
                const mapped = mapTemplateToAgent(
                    tData,
                    "org_demo",
                    "user_demo",
                );

                // Overwrite wizard store with template data
                wizardStore.data.name = `${tData.name}`;
                wizardStore.data.systemPrompt = mapped.systemPrompt;
                wizardStore.data.llmProvider = mapped.llmProvider as any;
                wizardStore.data.voiceId = mapped.voiceId;

                // Set initial step to allow review
                // wizardStore.currentStep = 'identity';
            }
        } else {
            // Only reset if NOT from template, to ensure clean slate for "New Agent"
            // But actually, we should verify if we should reset on *exit*, not on entry if we want persistent drafts.
            // For now, let's just NOT reset if we are loading a template.
        }

        return () => {
            // Cleanup on destroy
            wizardStore.reset();
        };
    });
</script>

{#if fromTemplate}
    <div
        class="bg-green-500/10 border-b border-green-500/20 px-6 py-3 flex items-center justify-center gap-2 text-sm text-green-700 dark:text-green-400"
    >
        <CheckCircle2 size={16} />
        <span>
            Agent initialized from template: <strong>{templateId}</strong>. You
            can customize it below.
        </span>
    </div>
{/if}

<WizardLayout>
    {#if wizardStore.currentStep === "identity"}
        <StepIdentity />
    {:else if wizardStore.currentStep === "behavior"}
        <StepBehavior />
    {:else if wizardStore.currentStep === "voice"}
        <StepVoice />
    {:else if wizardStore.currentStep === "knowledge"}
        <StepKnowledge />
    {:else if wizardStore.currentStep === "connect" || wizardStore.currentStep === "handoff"}
        <!-- Reuse StepConnect for both or simple placeholder for handoff -->
        <StepConnect />
    {:else if wizardStore.currentStep === "review"}
        <StepReview />
    {/if}
</WizardLayout>
