<script lang="ts">
    import { cn } from '$lib/utils'; // We'll need a utils file for class merging, or just use template literals

    interface Props {
        children?: import('svelte').Snippet;
        variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline';
        class?: string;
    }

    let { children, variant = 'default', class: className }: Props = $props();

    const variants = {
        default: "bg-primary text-primary-foreground",
        success: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20 border",
        warning: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 border",
        destructive: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20 border",
        outline: "text-foreground border"
    };
</script>

<div class={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variants[variant]} ${className || ''}`}>
    {@render children?.()}
</div>
