<script lang="ts">
    import type { Snippet } from "svelte";

    interface Props {
        title: string;
        status: "active" | "idle" | "error";
        children: Snippet;
    }

    let { title, status = "idle", children }: Props = $props();
</script>

<div class="card" data-status={status}>
    <div class="card-header">
        <h3>{title}</h3>
        <span class="status-badge">{status}</span>
    </div>
    <div class="card-content">
        {@render children()}
    </div>
</div>

<style>
    .card {
        background-color: var(--bg-surface);
        border: 1px solid var(--border-default);
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: var(--shadow-sm);
        transition: box-shadow 0.2s ease;
    }

    .card:hover {
        box-shadow: var(--shadow-md);
    }

    .card-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 1rem;
    }

    .card h3 {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
        color: var(--text-primary);
    }

    .status-badge {
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .card[data-status="active"] .status-badge {
        background-color: var(--status-success-bg);
        color: var(--status-success);
    }

    .card[data-status="idle"] .status-badge {
        background-color: var(--bg-surface-raised);
        color: var(--text-muted);
    }

    .card[data-status="error"] .status-badge {
        background-color: var(--status-error-bg);
        color: var(--status-error);
    }
</style>
