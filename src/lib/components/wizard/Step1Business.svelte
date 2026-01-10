<script lang="ts">
    import Label from "$lib/components/ui/Label.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import Textarea from "$lib/components/ui/Textarea.svelte";
    import Select from "$lib/components/ui/Select.svelte";
    import type { WizardData } from "$lib/types/schemas";

    export let data: Partial<WizardData["step1"]>;
</script>

<div class="space-y-6">
    <div class="space-y-2 text-center mb-8">
        <h3 class="text-2xl font-semibold">Business Information</h3>
        <p class="text-muted-foreground">
            Tell us about your company to customize the AI's knowledge.
        </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="space-y-2">
            <Label>Agent Name</Label>
            <Input placeholder="e.g. Sarah" bind:value={data.agentName} />
        </div>

        <div class="space-y-2">
            <Label>Company Name</Label>
            <Input
                placeholder="e.g. Acme Services"
                bind:value={data.companyName}
            />
        </div>

        <div class="space-y-2">
            <Label>Industry</Label>
            <Select bind:value={data.industry}>
                <option value="automotive">Automotive</option>
                <option value="healthcare">Healthcare</option>
                <option value="real-estate">Real Estate</option>
                <option value="retail">Retail</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
            </Select>
        </div>

        <div class="space-y-2">
            <Label>Support Email (Optional)</Label>
            <Input
                placeholder="support@example.com"
                type="email"
                bind:value={data.supportEmail}
            />
        </div>
    </div>

    <div class="space-y-2">
        <Label>Primary Website (Optional)</Label>
        <Input
            placeholder="https://example.com"
            type="url"
            bind:value={data.website}
        />
    </div>
</div>
