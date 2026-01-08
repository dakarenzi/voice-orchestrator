<script lang="ts">
    interface Props {
        content: string;
        children?: import("svelte").Snippet;
    }
    let { content, children }: Props = $props();
</script>

<div class="group relative inline-block">
    {@render children?.()}
    <div
        class="absolute bottom-full left-1/2 mb-2 -translate-x-1/2 whitespace-nowrap rounded bg-foreground px-2 py-1 text-xs text-background opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none z-50"
    >
        {content}
        <div
            class="absolute top-full left-1/2 -ml-1 border-4 border-transparent border-t-foreground"
        ></div>
    </div>
</div>
