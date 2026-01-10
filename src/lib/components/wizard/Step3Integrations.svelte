<script lang="ts">
    import Label from "$lib/components/ui/Label.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import Switch from "$lib/components/ui/Switch.svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Select from "$lib/components/ui/Select.svelte";
    const { SelectContent, SelectItem, SelectTrigger, SelectValue } =
        Select as any;
    import { Link, Calendar, CreditCard, LayoutGrid } from "lucide-svelte";
    import type { WizardData } from "$lib/types/schemas";
    import type { AgentTemplate } from "$lib/types/template";
    import { getTemplateBySlug } from "$lib/templates/registry";
    import { page } from "$app/stores";

    export let data: WizardData["step3"] = {};

    // We need to know which integrations the template SUPPORTS to show the right UI
    $: template = getTemplateBySlug($page.params.slug);
</script>

<div class="space-y-8">
    <div class="space-y-2 text-center mb-8">
        <h3 class="text-2xl font-semibold">Connect & Integrate</h3>
        <p class="text-muted-foreground">
            Connect your existing tools to automate workflows.
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Calendar Integration -->
        <div
            class="bg-card border rounded-xl p-6 space-y-4 hover:shadow-md transition-shadow"
        >
            <div class="flex items-center justify-between">
                <div
                    class="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center"
                >
                    <Calendar class="w-6 h-6 text-blue-500" />
                </div>
                <Switch
                    checked={!!data.calendar}
                    onCheckedChange={(v) => {
                        if (v) data.calendar = { provider: "google-calendar" };
                        else data.calendar = undefined;
                    }}
                />
            </div>
            <div>
                <h4 class="font-medium">Calendar Booking</h4>
                <p class="text-sm text-muted-foreground">
                    Allow the AI to book appointments directly.
                </p>
            </div>
            {#if data.calendar}
                <div
                    class="pt-4 space-y-4 animate-in fade-in slide-in-from-top-2"
                >
                    <div class="space-y-2">
                        <Label>Provider</Label>
                        <Select bind:value={data.calendar.provider}>
                            <option value="calendly">Calendly</option>
                            <option value="google-calendar"
                                >Google Calendar</option
                            >
                            <option value="outlook">Outlook</option>
                        </Select>
                    </div>
                    <div class="space-y-2">
                        <Label>Calendar ID / Link</Label>
                        <Input
                            placeholder="primary"
                            bind:value={data.calendar.calendarId}
                        />
                    </div>
                </div>
            {/if}
        </div>

        <!-- CRM / Database -->
        <div
            class="bg-card border rounded-xl p-6 space-y-4 hover:shadow-md transition-shadow"
        >
            <div class="flex items-center justify-between">
                <div
                    class="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center"
                >
                    <LayoutGrid class="w-6 h-6 text-purple-500" />
                </div>
                <Switch
                    checked={!!data.crm}
                    onCheckedChange={(v) => {
                        if (v) data.crm = { provider: "hubspot", apiKey: "" };
                        else data.crm = undefined;
                    }}
                />
            </div>
            <div>
                <h4 class="font-medium">CRM Integration</h4>
                <p class="text-sm text-muted-foreground">
                    Send lead data directly to your CRM.
                </p>
            </div>
            {#if data.crm}
                <div class="pt-4 space-y-4">
                    <div class="space-y-2">
                        <Label>CRM Provider</Label>
                        <Select bind:value={data.crm.provider}>
                            <option value="hubspot">HubSpot</option>
                            <option value="salesforce">Salesforce</option>
                            <option value="notion">Notion</option>
                            <option value="zapier">Zapier (Webhook)</option>
                        </Select>
                    </div>
                    <div class="space-y-2">
                        <Label>API Key</Label>
                        <Input
                            type="password"
                            placeholder="sk_..."
                            bind:value={data.crm.apiKey}
                        />
                    </div>
                </div>
            {/if}
        </div>
    </div>

    <!-- Webhook URL (Advanced) -->
    <div class="bg-card border rounded-xl p-6 space-y-4">
        <div class="flex items-center space-x-2">
            <Link class="w-5 h-5 text-primary" />
            <h4 class="font-medium">Direct Webhook Notification</h4>
        </div>
        <div class="space-y-2">
            <Label>Webhook URL (Optional)</Label>
            <Input
                placeholder="https://your-api.com/webhooks/calls"
                bind:value={data.webhookUrl}
            />
            <p class="text-[0.7rem] text-muted-foreground">
                We'll send a POST request with the call transcript and results.
            </p>
        </div>
    </div>
</div>
