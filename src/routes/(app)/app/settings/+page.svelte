<script lang="ts">
    import { Globe, Link as LinkIcon, Bell, Save } from "lucide-svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import Label from "$lib/components/ui/Label.svelte";
    import Select from "$lib/components/ui/Select.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import CardHeader from "$lib/components/ui/CardHeader.svelte";
    import CardContent from "$lib/components/ui/CardContent.svelte";
    import { toast } from "$lib/stores/toast.svelte";

    let orgName = $state("My Voice Org");
    let webhookUrl = $state(
        "https://voiceorchestrator.com/api/webhooks/telnyx",
    );
    let locale = $state("en");
    let notifications = $state({ failure: true, summary: false });

    function handleSave() {
        toast.add("Settings saved successfully", "success");
    }

    function copyWebhook() {
        navigator.clipboard.writeText(webhookUrl);
        toast.add("Webhook URL copied to clipboard", "success");
    }
</script>

<div class="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
    <div class="flex justify-between items-center">
        <div>
            <h2 class="text-3xl font-bold tracking-tight text-txt-primary">
                Settings
            </h2>
            <p class="text-txt-muted mt-2">
                Manage your organization and integrations.
            </p>
        </div>
        <Button onclick={handleSave} class="gap-2"
            ><Save size={16} /> Save All</Button
        >
    </div>

    <div class="grid gap-6">
        <Card>
            <CardHeader>
                <h3 class="text-lg font-semibold flex items-center gap-2">
                    <Globe size={18} /> Organization
                </h3>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div class="space-y-2">
                        <Label>Organization Name</Label>
                        <Input bind:value={orgName} />
                    </div>
                    <div class="space-y-2">
                        <Label>Language</Label>
                        <Select bind:value={locale}>
                            <option value="en">English</option>
                            <option value="es">Español</option>
                            <option value="fr">Français</option>
                        </Select>
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <h3 class="text-lg font-semibold flex items-center gap-2">
                    <LinkIcon size={18} /> Integrations
                </h3>
            </CardHeader>
            <CardContent class="space-y-4">
                <div class="space-y-2">
                    <Label>Webhook URL</Label>
                    <div class="flex gap-2">
                        <Input
                            bind:value={webhookUrl}
                            class="font-mono text-sm"
                        />
                        <Button variant="outline" onclick={copyWebhook}
                            >Copy</Button
                        >
                    </div>
                    <p class="text-xs text-txt-muted">
                        Endpoints for inbound Telnyx calls.
                    </p>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <h3 class="text-lg font-semibold flex items-center gap-2">
                    <Bell size={18} /> Notifications
                </h3>
            </CardHeader>
            <CardContent class="space-y-4">
                <div
                    class="flex items-center justify-between p-3 border border-brd-default rounded-lg"
                >
                    <div>
                        <p class="font-medium">Call Failures</p>
                        <p class="text-xs text-txt-muted">
                            Notify when a call ends with an error.
                        </p>
                    </div>
                    <div class="flex items-center gap-2">
                        <span class="text-sm text-txt-muted"
                            >{notifications.failure ? "On" : "Off"}</span
                        >
                        <button
                            onclick={() =>
                                (notifications.failure =
                                    !notifications.failure)}
                            class={`w-10 h-6 rounded-full p-1 transition-colors ${notifications.failure ? "bg-acn-primary" : "bg-bg-badge-default"}`}
                        >
                            <div
                                class={`w-4 h-4 rounded-full bg-txt-inverse transition-transform ${notifications.failure ? "translate-x-4" : ""}`}
                            ></div>
                        </button>
                    </div>
                </div>
            </CardContent>
        </Card>
    </div>
</div>
