<script lang="ts">
    import { Label } from "$lib/components/ui/label";
    import { Input } from "$lib/components/ui/input";
    import { Button } from "$lib/components/ui/button";
    import {
        Select,
        SelectContent,
        SelectItem,
        SelectTrigger,
        SelectValue,
    } from "$lib/components/ui/select";
    import type { WizardData } from "$lib/types/schemas";

    export let data: Partial<WizardData["step1"]>;
</script>

<div class="space-y-6">
    <div class="space-y-2 text-center mb-8">
        <h3 class="text-2xl font-semibold">Tell us about your business</h3>
        <p class="text-muted-foreground">
            This helps the AI understand who it's representing.
        </p>
    </div>

    <div class="grid gap-4 py-4">
        <div class="grid grid-cols-2 gap-4">
            <div class="space-y-2">
                <Label for="companyName">Company Name</Label>
                <Input
                    id="companyName"
                    placeholder="Acme Corp"
                    bind:value={data.companyName}
                />
            </div>
            <div class="space-y-2">
                <Label for="agentName">Agent Name</Label>
                <Input
                    id="agentName"
                    placeholder="Sarah"
                    bind:value={data.agentName}
                />
            </div>
        </div>

        <div class="space-y-2">
            <Label for="industry">Industry</Label>
            <Select
                selected={{ value: data.industry, label: data.industry }}
                onSelectedChange={(v) => (data.industry = v?.value)}
            >
                <SelectTrigger>
                    <SelectValue placeholder="Select an industry" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="healthcare">Healthcare</SelectItem>
                    <SelectItem value="ecommerce">E-Commerce</SelectItem>
                    <SelectItem value="real-estate">Real Estate</SelectItem>
                    <SelectItem value="technology">Technology/SaaS</SelectItem>
                    <SelectItem value="retail">Retail</SelectItem>
                    <SelectItem value="hospitality">Hospitality</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div class="space-y-2">
            <Label for="website">Website URL</Label>
            <Input
                id="website"
                placeholder="https://example.com"
                bind:value={data.website}
            />
            <p class="text-[0.8rem] text-muted-foreground">
                We'll scan this to learn about your business (optional).
            </p>
        </div>

        <div class="space-y-2">
            <Label for="supportEmail">Support Email</Label>
            <Input
                id="supportEmail"
                type="email"
                placeholder="support@example.com"
                bind:value={data.supportEmail}
            />
            <p class="text-[0.8rem] text-muted-foreground">
                Where should the agent send escalation tickets?
            </p>
        </div>
    </div>
</div>
