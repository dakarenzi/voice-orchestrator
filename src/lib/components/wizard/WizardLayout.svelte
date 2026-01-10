<script lang="ts">
    import { wizardStore, STEPS } from "$lib/stores/wizardStore.svelte";
    import { ArrowLeft, ArrowRight, Save } from "lucide-svelte";
    import Button from "$lib/components/ui/Button.svelte";

    let { children } = $props();

    const isLastStep = $derived(wizardStore.currentStep === "review");
    const progress = $derived(wizardStore.progress);
</script>

<div class="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500 py-8">
    <!-- Header -->
    <div class="space-y-4">
        <div
            class="flex justify-between items-center text-sm font-medium text-muted-foreground"
        >
            <span
                >Step {STEPS.indexOf(wizardStore.currentStep) + 1} of {STEPS.length}</span
            >
            <span class="capitalize">{wizardStore.currentStep}</span>
        </div>
        <div class="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
                class="h-full bg-primary transition-all duration-500 ease-out"
                style="width: {progress}%"
            ></div>
        </div>
    </div>

    <!-- Content -->
    <div class="min-h-[400px]">
        {@render children()}
    </div>

    <!-- Footer Controls -->
    <div class="flex justify-between items-center pt-8 border-t">
        <Button
            variant="outline"
            onclick={() => wizardStore.back()}
            disabled={STEPS.indexOf(wizardStore.currentStep) === 0}
        >
            <ArrowLeft size={16} class="mr-2" /> Back
        </Button>

        {#if isLastStep}
            <Button
                onclick={() => wizardStore.save()}
                disabled={wizardStore.isSaving}
                class="min-w-[120px]"
            >
                {#if wizardStore.isSaving}
                    Saving...
                {:else}
                    <Save size={16} class="mr-2" /> Create Agent
                {/if}
            </Button>
        {:else}
            <Button
                onclick={() => wizardStore.next()}
                disabled={!wizardStore.canGoNext}
                class="min-w-[120px]"
            >
                Next <ArrowRight size={16} class="ml-2" />
            </Button>
        {/if}
    </div>
</div>
