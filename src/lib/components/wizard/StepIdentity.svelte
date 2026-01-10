<script lang="ts">
    import { wizardStore } from "$lib/stores/wizardStore.svelte";
    import Input from "$lib/components/ui/Input.svelte";
    import Label from "$lib/components/ui/Label.svelte";
    import Select from "$lib/components/ui/Select.svelte";
    import { User } from "lucide-svelte";
</script>

<div class="space-y-6">
    <div class="text-center space-y-2 mb-8">
        <h2 class="text-2xl font-bold">
            First, let's give your agent an identity.
        </h2>
        <p class="text-muted-foreground">
            What will this agent be doing for your organization?
        </p>
    </div>

    <div
        class="max-w-md mx-auto space-y-6 bg-card p-6 rounded-xl border shadow-sm"
    >
        <div class="space-y-2">
            <Label>Agent Name</Label>
            <div class="relative">
                <User
                    class="absolute left-3 top-2.5 text-muted-foreground"
                    size={16}
                />
                <Input
                    placeholder="e.g. Sales Assistant"
                    class="pl-9"
                    bind:value={wizardStore.data.name}
                />
            </div>
            <p class="text-xs text-muted-foreground">
                This name will be visible in your dashboard.
            </p>
        </div>

        <div class="space-y-2">
            <Label>Role / Type</Label>
            <Select bind:value={wizardStore.data.role}>
                <option value="" disabled selected>Select a role...</option>
                <option value="Customer Support">Customer Support</option>
                <option value="Sales Representative"
                    >Sales Representative</option
                >
                <option value="Receptionist">Receptionist</option>
                <option value="Technical Support">Technical Support</option>
                <option value="Other">Other</option>
            </Select>
        </div>
    </div>
</div>
