<script lang="ts">
    import type { HTMLLabelAttributes } from 'svelte/elements';

    interface Props extends HTMLLabelAttributes {
        children?: import('svelte').Snippet;
    }

    let { children, class: className, ...rest }: Props = $props();
</script>

<label class={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className || ''}`} {...rest}>
    {@render children?.()}
</label>
