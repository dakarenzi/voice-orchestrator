<script lang="ts">
    interface Props {
        status: "active" | "idle" | "error" | "training";
        showLabel?: boolean;
    }

    let { status, showLabel = true }: Props = $props();

    const statusConfig = {
        active: {
            icon: "●",
            label: "Active",
            ariaLabel: "Agent is active",
        },
        idle: {
            icon: "○",
            label: "Idle",
            ariaLabel: "Agent is idle",
        },
        error: {
            icon: "✕",
            label: "Error",
            ariaLabel: "Agent has an error",
        },
        training: {
            icon: "⟳",
            label: "Training",
            ariaLabel: "Agent is training",
        },
    };

    const config = $derived(statusConfig[status]);
</script>

<div
    class="agent-status"
    data-status={status}
    role="status"
    aria-label={config.ariaLabel}
>
    <span class="status-indicator" aria-hidden="true">
        {config.icon}
    </span>
    {#if showLabel}
        <span class="status-text">{config.label}</span>
    {/if}
</div>

<style>
    .agent-status {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        font-size: 0.875rem;
        font-weight: 500;
    }

    .status-indicator {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 1.25rem;
        height: 1.25rem;
        font-size: 1rem;
        line-height: 1;
    }

    .agent-status[data-status="active"] .status-indicator,
    .agent-status[data-status="active"] .status-text {
        color: var(--agent-active);
    }

    .agent-status[data-status="idle"] .status-indicator,
    .agent-status[data-status="idle"] .status-text {
        color: var(--agent-idle);
    }

    .agent-status[data-status="error"] .status-indicator,
    .agent-status[data-status="error"] .status-text {
        color: var(--agent-error);
    }

    .agent-status[data-status="training"] .status-indicator,
    .agent-status[data-status="training"] .status-text {
        color: var(--agent-training);
    }

    /* Animation for training status */
    .agent-status[data-status="training"] .status-indicator {
        animation: rotate 2s linear infinite;
    }

    @keyframes rotate {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }

    /* High contrast mode - stop animation to reduce motion */
    [data-theme="high-contrast"]
        .agent-status[data-status="training"]
        .status-indicator {
        animation: none;
    }

    @media (prefers-reduced-motion: reduce) {
        .agent-status[data-status="training"] .status-indicator {
            animation: none;
        }
    }
</style>
