<script lang="ts">
    import Label from "$lib/components/ui/Label.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import { CheckCircle2, AlertCircle, Terminal, Rocket } from "lucide-svelte";
    import type { WizardData } from "$lib/types/schemas";

    export let data: Partial<WizardData>;
</script>

<div class="space-y-8">
    <div class="space-y-2 text-center mb-8">
        <h3 class="text-2xl font-semibold">Review & Deploy</h3>
        <p class="text-muted-foreground">
            Double check your settings before we ignite the engine.
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Summary Card -->
        <Card class="p-6 space-y-4">
            <h4 class="font-semibold flex items-center mb-4">
                <CheckCircle2 class="w-5 h-5 mr-2 text-green-500" />
                Configuration Summary
            </h4>

            <div class="space-y-3 text-sm">
                <div class="flex justify-between border-b pb-2">
                    <span class="text-muted-foreground">Identity</span>
                    <span class="font-medium text-right"
                        >{data.step1?.agentName || "N/A"} @ {data.step1
                            ?.companyName || "N/A"}</span
                    >
                </div>
                <div class="flex justify-between border-b pb-2">
                    <span class="text-muted-foreground">Industry</span>
                    <span class="font-medium capitalize"
                        >{data.step1?.industry || "N/A"}</span
                    >
                </div>
                <div class="flex justify-between border-b pb-2">
                    <span class="text-muted-foreground">Knowledge Base</span>
                    <span class="font-medium"
                        >{(data.step2?.faqs?.length || 0) +
                            (data.step2?.documents?.length || 0)} sources</span
                    >
                </div>
                <div class="flex justify-between border-b pb-2">
                    <span class="text-muted-foreground">Voice ID</span>
                    <span
                        class="font-medium font-mono text-xs truncate max-w-[100px]"
                        >{data.step4?.voiceId || "Default"}</span
                    >
                </div>
            </div>
        </Card>

        <!-- Deployment Check -->
        <Card class="p-6 bg-muted/20 border-dashed">
            <h4 class="font-semibold flex items-center mb-4">
                <Terminal class="w-5 h-5 mr-2" />
                Pre-Flight Checks
            </h4>
            <ul class="space-y-2 text-sm">
                <li class="flex items-center text-green-600">
                    <CheckCircle2 class="w-4 h-4 mr-2" /> Validated business profile
                </li>
                <li class="flex items-center text-green-600">
                    <CheckCircle2 class="w-4 h-4 mr-2" /> Knowledge base indexed
                </li>
                {#if !data.step3?.crm && !data.step3?.calendar}
                    <li class="flex items-center text-amber-600">
                        <AlertCircle class="w-4 h-4 mr-2" /> No integrations connected
                        (Optional)
                    </li>
                {:else}
                    <li class="flex items-center text-green-600">
                        <CheckCircle2 class="w-4 h-4 mr-2" /> Integrations verified
                    </li>
                {/if}
                <li class="flex items-center text-green-600">
                    <CheckCircle2 class="w-4 h-4 mr-2" /> Voice synthesis ready
                </li>
            </ul>
        </Card>
    </div>

    <div
        class="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-lg p-6 text-center"
    >
        <h4 class="text-blue-800 dark:text-blue-300 font-semibold mb-2">
            Ready for liftoff?
        </h4>
        <p class="text-sm text-blue-600 dark:text-blue-400 mb-0">
            Clicking Deploy will provision your agent, generate the system
            prompt, and make it available in your dashboard instantly.
        </p>
    </div>
</div>
