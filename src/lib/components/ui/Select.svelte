<script lang="ts">
    import type { HTMLSelectAttributes } from 'svelte/elements';

    interface Props extends HTMLSelectAttributes {
        value?: any;
        children?: import('svelte').Snippet;
    }

    let { value = $bindable(), children, class: className, ...rest }: Props = $props();
</script>

<div class="relative">
    <select 
        bind:value 
        class={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${className || ''}`} 
        {...rest}
    >
        {@render children?.()}
    </select>
</div>
