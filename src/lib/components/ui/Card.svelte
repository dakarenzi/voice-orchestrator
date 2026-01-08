<script lang="ts">
    interface Props {
        children?: import('svelte').Snippet;
        class?: string;
    }
    let { children, class: className }: Props = $props();
</script>

<div class={`rounded-lg border bg-card text-card-foreground shadow-sm ${className || ''}`}>
    {@render children?.()}
</div>
