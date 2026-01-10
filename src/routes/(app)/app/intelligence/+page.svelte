<script lang="ts">
    import { Brain, Key, CheckCircle2, XCircle } from "lucide-svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import CardContent from "$lib/components/ui/CardContent.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";
    import Input from "$lib/components/ui/Input.svelte";

    let providers = [
        {
            id: "openai",
            name: "OpenAI",
            status: "connected",
            model: "GPT-4o",
            apiKey: "sk-proj-...",
        },
        {
            id: "anthropic",
            name: "Anthropic",
            status: "not_connected",
            model: "Claude 3.5 Sonnet",
            apiKey: "",
        },
        {
            id: "groq",
            name: "Groq",
            status: "not_connected",
            model: "Llama 3 70B",
            apiKey: "",
        },
    ];
</script>

<div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
    <div>
        <h2 class="text-3xl font-bold tracking-tight text-txt-primary">
            Intelligence
        </h2>
        <p class="text-txt-muted mt-2">
            Manage your LLM providers and knowledge sources.
        </p>
    </div>

    <div class="space-y-6">
        {#each providers as provider}
            <Card class="overflow-hidden">
                <CardContent class="p-6">
                    <div class="flex items-start justify-between gap-4">
                        <div class="flex items-start gap-4">
                            <div
                                class="p-3 bg-bg-surface-raised rounded-xl flex items-center justify-center text-acn-primary"
                            >
                                <Brain size={24} />
                            </div>
                            <div>
                                <h3
                                    class="font-bold text-lg flex items-center gap-2 text-txt-primary"
                                >
                                    {provider.name}
                                    <Badge
                                        variant={provider.status === "connected"
                                            ? "success"
                                            : "outline"}
                                    >
                                        {provider.status === "connected"
                                            ? "Connected"
                                            : "Not Connected"}
                                    </Badge>
                                </h3>
                                <p class="text-sm text-txt-muted mt-1">
                                    Default Model: {provider.model}
                                </p>
                            </div>
                        </div>
                        <Button variant="outline" size="sm">Configure</Button>
                    </div>

                    {#if provider.status === "not_connected"}
                        <div class="mt-6 flex gap-3 items-end">
                            <div class="grow space-y-2">
                                <label
                                    for={`key-${provider.id}`}
                                    class="text-sm font-medium">API Key</label
                                >
                                <Input
                                    id={`key-${provider.id}`}
                                    type="password"
                                    placeholder={`Enter your ${provider.name} API Key`}
                                />
                            </div>
                            <Button>Connect</Button>
                        </div>
                    {:else}
                        <div
                            class="mt-6 flex items-center gap-2 text-sm text-status-success bg-status-success-bg px-3 py-2 rounded-md border border-status-success/20 w-fit status-success"
                        >
                            <CheckCircle2 size={16} />
                            <span>Successfully connected</span>
                        </div>
                    {/if}
                </CardContent>
            </Card>
        {/each}
    </div>
</div>
