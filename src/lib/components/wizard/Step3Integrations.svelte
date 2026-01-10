<script lang="ts">
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { Switch } from "$lib/components/ui/switch";
    import { Button } from "$lib/components/ui/button";
    import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from "$lib/components/ui/select";
    import { Link, Calendar, CreditCard, LayoutGrid } from "lucide-svelte";
    import type { WizardData } from "$lib/types/schemas";
    import type { AgentTemplate } from "$lib/types/template";
    import { getTemplateBySlug } from "$lib/templates/registry";
    import { page } from "$app/stores";

    // In a real app we'd pass this as a prop, but for self-containment we fetch again or assume passed
    export let data: Partial<WizardData["step3"]>;

    // We need to know which integrations the template SUPPORTS to show the right UI
    $: template = getTemplateBySlug($page.params.slug);

    // Helper validation to ensure object structure exists before binding
    $: {
        if (template?.integrations.crm && !data.crm)
            data.crm = { provider: template.integrations.crm.type, apiKey: "" };
        if (template?.integrations.calendar && !data.calendar)
            data.calendar = { provider: template.integrations.calendar.type };
    }
</script>

<div class="space-y-6">
    <div class="space-y-2 text-center mb-8">
        <h3 class="text-2xl font-semibold">Connect your tools</h3>
        <p class="text-muted-foreground">
            Link your existing software stack to the agent.
        </p>
    </div>

    {#if template}
        <!-- CRM Integration -->
        {#if template.integrations.crm}
            <div class="border rounded-xl p-6 bg-card space-y-4">
                <div class="flex items-center gap-3 mb-2">
                    <div
                        class="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300"
                    >
                        <LayoutGrid class="w-5 h-5" />
                    </div>
                    <div>
                        <h4 class="font-semibold">CRM Connection</h4>
                        <p class="text-sm text-muted-foreground">
                            Sync contacts and log conversations.
                        </p>
                    </div>
                </div>

                <div class="grid gap-4 pl-0 md:pl-14">
                    <div class="space-y-2">
                        <Label>Provider</Label>
                        <Select
                            disabled
                            selected={{
                                value: template.integrations.crm.type,
                                label: template.integrations.crm.type,
                            }}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent
                                ><SelectItem
                                    value={template.integrations.crm.type}
                                    class="capitalize"
                                    >{template.integrations.crm
                                        .type}</SelectItem
                                ></SelectContent
                            >
                        </Select>
                    </div>

                    {#if data.crm}
                        <div class="space-y-2">
                            <Label>API Key</Label>
                            <Input
                                type="password"
                                placeholder="sk_live_..."
                                bind:value={data.crm.apiKey}
                            />
                        </div>
                        <div class="space-y-2">
                            <Label>Instance URL (Optional)</Label>
                            <Input
                                placeholder="https://your-instance.com"
                                bind:value={data.crm.apiUrl}
                            />
                        </div>
                    {/if}
                </div>
            </div>
        {/if}

        <!-- Calendar Integration -->
        {#if template.integrations.calendar}
            <div class="border rounded-xl p-6 bg-card space-y-4">
                <div class="flex items-center gap-3 mb-2">
                    <div
                        class="p-2 bg-orange-100 dark:bg-orange-900 rounded-lg text-orange-600 dark:text-orange-300"
                    >
                        <Calendar class="w-5 h-5" />
                    </div>
                    <div>
                        <h4 class="font-semibold">Calendar Sync</h4>
                        <p class="text-sm text-muted-foreground">
                            Allow the agent to book appointments.
                        </p>
                    </div>
                </div>

                <div class="pl-0 md:pl-14">
                    {#if data.calendar}
                        <Button variant="outline" class="w-full justify-start">
                            <Link class="w-4 h-4 mr-2" />
                            Connect {template.integrations.calendar.type} Calendar
                            (OAuth)
                        </Button>
                        <p class="text-xs text-muted-foreground mt-2">
                            You will be redirected to sign in.
                        </p>
                    {/if}
                </div>
            </div>
        {/if}

        {#if !template.integrations.crm && !template.integrations.calendar}
            <div class="text-center py-10 text-muted-foreground italic">
                No integrations required for this template.
            </div>
        {/if}
    {/if}
</div>
