<script lang="ts">
    import { page } from "$app/stores";
    import { getTemplateBySlug } from "$lib/templates/registry";
    import { type WizardData } from "$lib/types/schemas";
    import { Button } from "$lib/components/ui/button";
    import { toast } from "svelte-sonner";
    import { fade } from "svelte/transition";
    import { Check, ChevronRight, ChevronLeft } from "lucide-svelte";

    // Dynamic Step Components
    import Step1Business from "$lib/components/wizard/Step1Business.svelte";
    import Step2Knowledge from "$lib/components/wizard/Step2Knowledge.svelte";
    import Step3Integrations from "$lib/components/wizard/Step3Integrations.svelte";
    import Step4Voice from "$lib/components/wizard/Step4Voice.svelte";
    import Step5Deploy from "$lib/components/wizard/Step5Deploy.svelte";

    $: slug = $page.params.slug as string;
    $: template = getTemplateBySlug(slug);

    let currentStep = 1;
    const totalSteps = 5;

    // Initialize with empty defaults structure
    let formData: {
        templateId: string;
        step1: Partial<WizardData["step1"]>;
        step2: Partial<WizardData["step2"]>;
        step3: Partial<WizardData["step3"]>;
        step4: Partial<WizardData["step4"]>;
    } = {
        templateId: "",
        step1: {},
        step2: { faqs: [], documents: [] },
        step3: {},
        step4: {}, // Initialize step4 to avoid undefined error
    };

    // Reactive update to set templateId once template is loaded
    $: if (template && !formData.templateId) {
        formData.templateId = template.id;
    }

    function nextStep() {
        if (currentStep < totalSteps) {
            // TODO: Validate current step
            currentStep++;
        } else {
            deployAgent();
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            currentStep--;
        }
    }

    function deployAgent() {
        toast.info("Deploying agent...");
        // TODO: Call API
        setTimeout(() => {
            toast.success("Agent Deployed Successfully!");
            // goto('/app/agents/new/success');
        }, 2000);
    }
</script>

<div class="min-h-screen bg-muted/20 flex flex-col">
    {#if template}
        <!-- Wizard Header -->
        <header class="bg-background border-b py-4 sticky top-0 z-50">
            <div
                class="container max-w-4xl mx-auto px-4 flex justify-between items-center"
            >
                <div>
                    <h2 class="font-semibold text-lg flex items-center">
                        <span class="text-muted-foreground font-normal mr-2"
                            >New Agent:</span
                        >
                        {template.name}
                    </h2>
                </div>
                <div class="flex items-center text-sm text-muted-foreground">
                    Step {currentStep} of {totalSteps}
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="flex-grow container max-w-4xl mx-auto px-4 py-8">
            <!-- Progress Bar -->
            <div class="w-full bg-muted h-2 rounded-full mb-8 overflow-hidden">
                <div
                    class="bg-primary h-full transition-all duration-300 ease-out"
                    style="width: {(currentStep / totalSteps) * 100}%"
                ></div>
            </div>

            <div
                class="bg-card border rounded-xl shadow-sm p-6 md:p-10 min-h-[500px] relative overflow-hidden"
            >
                <!-- Step Render Logic -->
                {#key currentStep}
                    <div in:fade={{ duration: 300 }} class="h-full">
                        {#if currentStep === 1}
                            <Step1Business bind:data={formData.step1} />
                        {:else if currentStep === 2}
                            <Step2Knowledge bind:data={formData.step2} />
                        {:else if currentStep === 3}
                            <Step3Integrations bind:data={formData.step3} />
                        {:else if currentStep === 4}
                            <Step4Voice bind:data={formData.step4} />
                        {:else if currentStep === 5}
                            <Step5Deploy
                                bind:data={
                                    formData as unknown as Partial<WizardData>
                                }
                            />
                        {/if}
                    </div>
                {/key}
            </div>

            <!-- Footer Navigation -->
            <div class="flex justify-between mt-8">
                <Button
                    variant="outline"
                    onclick={prevStep}
                    disabled={currentStep === 1}
                >
                    <ChevronLeft class="w-4 h-4 mr-2" />
                    Back
                </Button>
                <Button onclick={nextStep} class="min-w-[140px]">
                    {#if currentStep === totalSteps}
                        Deploy Agent
                        <Check class="w-4 h-4 ml-2" />
                    {:else}
                        Next Step
                        <ChevronRight class="w-4 h-4 ml-2" />
                    {/if}
                </Button>
            </div>
        </main>
    {:else}
        <div class="container py-20 text-center">
            <h1 class="text-2xl font-bold">Template not found</h1>
        </div>
    {/if}
</div>
