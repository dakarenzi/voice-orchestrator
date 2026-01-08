<script lang="ts">
    interface Props {
        children?: import('svelte').Snippet;
        class?: string;
    }
    let { children, class: className }: Props = $props();
</script>

<div class={`flex flex-col space-y-1.5 p-6 ${className || ''}`}>
    {@render children?.()}
</div>
