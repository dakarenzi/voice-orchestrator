<script lang="ts">
    interface Props {
        status: "incoming" | "active" | "ended";
        label?: string;
    }

    let { status, label = "" }: Props = $props();

    const statusConfig = {
        incoming: {
            icon: "📞",
            ariaLabel: "Incoming call",
        },
        active: {
            icon: "✓",
            ariaLabel: "Active call",
        },
        ended: {
            icon: "○",
            ariaLabel: "Call ended",
        },
    };

    const config = $derived(statusConfig[status]);
</script>

<div
    class="call-status"
    data-status={status}
    role="status"
    aria-label="{config.ariaLabel}: {label}"
>
    <span class="status-icon" aria-hidden="true">{config.icon}</span>
    <span class="status-label">{label || config.ariaLabel}</span>
</div>

<style>
    .call-status {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.375rem 0.75rem;
        border-radius: 9999px;
        size: 0.875rem;
        font-weight: 500;
        border: 1px solid currentColor;
    }

    .call-status[data-status="incoming"] {
        background-color: var(--status-info-bg);
        color: var(--call-incoming);
    }

    .call-status[data-status="active"] {
        background-color: var(--status-success-bg);
        color: var(--call-active);
    }

    .call-status[data-status="ended"] {
        background-color: var(--bg-surface-raised);
        color: var(--call-ended);
    }

    .status-icon {
        flex-shrink: 0;
        font-size: 1rem;
        line-height: 1;
    }

    /* High contrast enhancements */
    [data-theme="high-contrast"] .call-status {
        border-width: 2px;
    }
</style>
