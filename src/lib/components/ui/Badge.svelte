<script lang="ts">
    interface Props {
        children?: import("svelte").Snippet;
        variant?:
            | "default"
            | "success"
            | "warning"
            | "destructive"
            | "outline"
            | "secondary"
            | "info";
        class?: string;
    }

    let { children, variant = "default", class: className }: Props = $props();

    const variants = {
        default: "bg-acn-primary/10 text-acn-primary border-acn-primary/20",
        secondary: "bg-bg-surface-raised text-txt-secondary border-brd-default",
        success:
            "bg-status-success-bg text-status-success border-status-success/20 status-success",
        warning:
            "bg-status-warning-bg text-status-warning border-status-warning/20 status-warning",
        destructive:
            "bg-status-error-bg text-status-error border-status-error/20 status-error",
        info: "bg-status-info-bg text-status-info border-status-info/20 status-info",
        outline: "text-txt-secondary border-brd-default",
    };
</script>

<div
    class={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className || ""}`}
>
    {@render children?.()}
</div>
