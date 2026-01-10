<script lang="ts">
    import Badge from "$lib/components/ui/Badge.svelte";
    // Assuming we use lucide-svelte, need to handle dynamic icon loading or accept component
    // For simplicity, we accept the icon component or name. Ideally pass component.
    // But content.ts has strings. I'll map them or just use a placeholder icon for now if name is passed.
    // Actually, simpler to just accept an icon snippet/component store.
    // For this pattern, I'll assume usage like <FeatureCard icon={Zap} ... />
    import { type Component } from "svelte";

    interface Props {
        icon: Component;
        headline: string;
        body: string;
        badge?: string;
    }

    let { icon: Icon, headline, body, badge }: Props = $props();
</script>

<div
    class="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:shadow-lg dark:hover:shadow-primary/5"
>
    <div class="mb-4 flex items-center justify-between">
        <div
            class="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
        >
            <Icon class="h-6 w-6" />
        </div>
        {#if badge}
            <Badge variant="outline" class="font-normal">{badge}</Badge>
        {/if}
    </div>

    <h3 class="mb-2 text-xl font-bold tracking-tight text-foreground">
        {headline}
    </h3>
    <p class="text-muted-foreground">{body}</p>

    <div
        class="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100"
    ></div>
</div>
