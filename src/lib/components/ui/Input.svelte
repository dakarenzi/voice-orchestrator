<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    interface Props extends HTMLInputAttributes {
        value?: string | number;
    }

    let { value = $bindable(), class: className, ...rest }: Props = $props();
</script>

<input
    bind:value
    class={`flex h-10 w-full rounded-md border border-brd-default bg-bg-surface px-3 py-2 text-sm ring-offset-bg-default file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-txt-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-acn-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-txt-primary input ${className || ""}`}
    {...rest}
/>
