<script lang="ts">
    import type { HTMLButtonAttributes } from "svelte/elements";

    interface Props {
        variant?:
            | "primary"
            | "secondary"
            | "ghost"
            | "destructive"
            | "outline"
            | "link";
        size?: "sm" | "md" | "lg" | "icon";
        href?: string;
        children?: import("svelte").Snippet;
        [key: string]: any;
    }

    let {
        variant = "primary",
        size = "md",
        href = undefined,
        class: className,
        children,
        ...rest
    }: Props = $props();

    const baseClass =
        "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95";

    const variants = {
        primary:
            "bg-gradient-to-r from-acn-primary to-acn-soft text-txt-inverse shadow-md hover:shadow-lg hover:scale-[1.02]",
        secondary:
            "bg-bg-surface border-2 border-acn-primary text-acn-primary hover:bg-bg-default",
        ghost: "hover:bg-bg-surface-raised hover:text-txt-primary text-txt-secondary",
        destructive:
            "bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md hover:shadow-lg hover:scale-[1.02]",
        outline:
            "border border-brd-default bg-bg-surface hover:bg-bg-default text-txt-secondary hover:text-txt-primary",
        link: "text-acn-primary underline-offset-4 hover:underline",
    };

    const sizes = {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
    };

    const classes = $derived(
        `${baseClass} ${variants[variant]} ${sizes[size]} ${className || ""}`,
    );
</script>

{#if href}
    <a {href} class={classes} {...rest}>
        {@render children?.()}
    </a>
{:else}
    <button class={classes} {...rest}>
        {@render children?.()}
    </button>
{/if}
