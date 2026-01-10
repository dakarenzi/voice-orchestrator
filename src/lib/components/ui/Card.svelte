<script lang="ts">
    interface Props {
        children?: import("svelte").Snippet;
        class?: string;
    }
    let { children, class: className }: Props = $props();
</script>

<div
    class={`rounded-xl border border-brd-default bg-bg-surface text-txt-primary shadow-sm card ${className || ""}`}
>
    {@render children?.()}
</div>
