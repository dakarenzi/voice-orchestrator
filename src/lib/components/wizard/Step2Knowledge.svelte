<script lang="ts">
    import Label from "$lib/components/ui/Label.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import Textarea from "$lib/components/ui/Textarea.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import { Plus, Trash2, FileText, Globe } from "lucide-svelte";
    import type { WizardData } from "$lib/types/schemas";

    export let data: Partial<WizardData["step2"]>;

    function addFAQ() {
        data.faqs = [...(data.faqs || []), { question: "", answer: "" }];
    }

    function removeFAQ(index: number) {
        data.faqs = data.faqs?.filter((_, i) => i !== index);
    }

    function addDoc() {
        // Simple string array for URLs
        // In a real app, this might be a file upload handler
        // For now, we'll just push an empty string to be bound to an input
        // However, `data.documents` is string[], so we need to handle that.
        // Let's assume we want to bind to indices.
        // Simplified: Just one "Add Document URL" input that pushes to array
        // Or a list of inputs.
        data.documents = [...(data.documents || []), ""];
    }

    function removeDoc(index: number) {
        data.documents = data.documents?.filter((_, i) => i !== index);
    }
</script>

<div class="space-y-6">
    <div class="space-y-2 text-center mb-8">
        <h3 class="text-2xl font-semibold">Teach your agent</h3>
        <p class="text-muted-foreground">
            Add knowledge sources or specific Q&A pairs.
        </p>
    </div>

    <!-- Documents / URLs -->
    <div class="space-y-4 border rounded-lg p-4 bg-muted/10">
        <div class="flex items-center justify-between">
            <h4 class="font-medium flex items-center">
                <Globe class="w-4 h-4 mr-2" />
                Website & Documents
            </h4>
            <Button variant="outline" size="sm" onclick={addDoc}>
                <Plus class="w-4 h-4 mr-1" /> Add URL
            </Button>
        </div>

        <div class="space-y-3">
            {#if data.documents && data.documents.length > 0}
                {#each data.documents as doc, i}
                    <div class="flex gap-2">
                        <Input
                            placeholder="https://..."
                            bind:value={data.documents[i]}
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            onclick={() => removeDoc(i)}
                            class="text-muted-foreground hover:text-destructive"
                        >
                            <Trash2 class="w-4 h-4" />
                        </Button>
                    </div>
                {/each}
            {:else}
                <p
                    class="text-sm text-muted-foreground italic text-center py-2"
                >
                    No documents added yet.
                </p>
            {/if}
        </div>
    </div>

    <!-- Custom Instructions -->
    <div class="space-y-2">
        <Label for="customInstructions"
            >Custom Instructions (System Prompt)</Label
        >
        <Textarea
            id="customInstructions"
            placeholder="e.g., 'Always be polite but firm about our 30-day return policy...'"
            class="min-h-[100px]"
            bind:value={data.customInstructions}
        />
        <p class="text-[0.8rem] text-muted-foreground">
            Specific rules or personality traits for your agent.
        </p>
    </div>

    <!-- FAQs -->
    <div class="space-y-4">
        <div class="flex items-center justify-between">
            <h4 class="font-medium flex items-center">
                <FileText class="w-4 h-4 mr-2" />
                Frequently Asked Questions
            </h4>
            <Button variant="outline" size="sm" onclick={addFAQ}>
                <Plus class="w-4 h-4 mr-1" /> Add FAQ
            </Button>
        </div>

        <div class="space-y-4">
            {#if data.faqs && data.faqs.length > 0}
                {#each data.faqs as faq, i}
                    <div
                        class="relative grid gap-3 p-4 border rounded-lg bg-card group"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            class="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:bg-destructive/10"
                            onclick={() => removeFAQ(i)}
                        >
                            <Trash2 class="w-4 h-4" />
                        </Button>
                        <div class="space-y-1">
                            <Label>Question</Label>
                            <Input
                                placeholder="e.g. What are your hours?"
                                bind:value={faq.question}
                            />
                        </div>
                        <div class="space-y-1">
                            <Label>Answer</Label>
                            <Textarea
                                placeholder="e.g. We are open 9-5 daily."
                                class="min-h-[60px]"
                                bind:value={faq.answer}
                            />
                        </div>
                    </div>
                {/each}
            {:else}
                <div
                    class="text-center py-8 border-2 border-dashed rounded-lg text-muted-foreground"
                >
                    No FAQs added. Add common questions to help your agent.
                </div>
            {/if}
        </div>
    </div>
</div>
