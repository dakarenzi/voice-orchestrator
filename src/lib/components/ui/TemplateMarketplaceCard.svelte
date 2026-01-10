<script lang="ts">
    import { Clock } from "lucide-svelte";

    interface Template {
        name: string;
        category: string;
        deployTime: string;
    }

    interface Props {
        template: Template;
    }

    let { template }: Props = $props();
</script>

<article class="template-card">
    <div class="category-badge">{template.category}</div>
    <h3 class="template-name">{template.name}</h3>
    <div class="template-footer">
        <span class="deploy-time">
            <Clock size={14} />
            {template.deployTime} to deploy
        </span>
    </div>
</article>

<style>
    .template-card {
        position: relative;
        background-color: var(--bg-surface);
        border: 1px solid var(--border-default);
        border-radius: 12px;
        padding: 1.5rem;
        cursor: pointer;
        transition: all 0.2s ease;
    }

    .template-card:hover {
        border-color: var(--accent-primary);
        box-shadow:
            0 0 0 1px var(--accent-primary),
            var(--shadow-md);
        transform: translateY(-2px);
    }

    .category-badge {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        background-color: var(--bg-accent-subtle);
        color: var(--text-accent);
        border-radius: 6px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
        margin-bottom: 1rem;
    }

    .template-name {
        margin: 0 0 1rem 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    .template-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-top: 1rem;
        border-top: 1px solid var(--border-subtle);
    }

    .deploy-time {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }
</style>
