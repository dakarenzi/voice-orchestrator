<script lang="ts">
    interface Props {
        children?: import('svelte').Snippet;
        class?: string;
    }
    let { children, class: className }: Props = $props();
</script>

<div class={`p-6 pt-0 ${className || ''}`}>
    {@render children?.()}
</div>
