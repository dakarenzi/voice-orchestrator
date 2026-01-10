<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";

    interface Props extends Omit<HTMLInputAttributes, "value"> {
        value: number[];
        onValueChange?: (value: number[]) => void;
        min?: number;
        max?: number;
        step?: number;
    }

    let {
        value = [0],
        onValueChange,
        min = 0,
        max = 100,
        step = 1,
        class: className,
        ...rest
    }: Props = $props();

    function handleChange(e: Event) {
        const newValue = [Number((e.target as HTMLInputElement).value)];
        if (onValueChange) onValueChange(newValue);
    }
</script>

<div
    class={`relative flex w-full touch-none select-none items-center ${className || ""}`}
>
    <input
        type="range"
        {min}
        {max}
        {step}
        value={value[0]}
        oninput={handleChange}
        class="w-full h-2 bg-secondary rounded-lg appearance-none cursor-pointer accent-primary"
        {...rest}
    />
</div>

<style>
    input[type="range"]::-webkit-slider-thumb {
        appearance: none;
        width: 1.25rem;
        height: 1.25rem;
        background: hsl(var(--primary));
        border: 2px solid hsl(var(--background));
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    input[type="range"]::-moz-range-thumb {
        width: 1.25rem;
        height: 1.25rem;
        background: hsl(var(--primary));
        border: 2px solid hsl(var(--background));
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
</style>
