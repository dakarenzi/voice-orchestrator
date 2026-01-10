<script lang="ts">
    interface Call {
        time: string;
        caller: string;
        duration: string;
        status: "active" | "ended" | string;
    }

    interface Props {
        calls: Call[];
    }

    let { calls }: Props = $props();
</script>

<div class="table-container">
    <table class="call-log-table">
        <thead>
            <tr>
                <th>Time</th>
                <th>Caller</th>
                <th>Duration</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            {#each calls as call}
                <tr>
                    <td class="time-cell">{call.time}</td>
                    <td class="caller-cell">{call.caller}</td>
                    <td>{call.duration}</td>
                    <td>
                        <span
                            class="status-indicator"
                            data-status={call.status}
                        >
                            {call.status}
                        </span>
                    </td>
                </tr>
            {/each}
        </tbody>
    </table>
</div>

<style>
    .table-container {
        overflow-x: auto;
        border: 1px solid var(--border-default);
        border-radius: 8px;
        background-color: var(--bg-surface);
    }

    .call-log-table {
        width: 100%;
        border-collapse: collapse;
    }

    .call-log-table thead {
        background-color: var(--bg-surface-raised);
        border-bottom: 1px solid var(--border-default);
    }

    .call-log-table th {
        padding: 0.75rem 1rem;
        text-align: left;
        font-size: 0.875rem;
        font-weight: 600;
        color: var(--text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .call-log-table td {
        padding: 1rem;
        border-bottom: 1px solid var(--border-subtle);
        color: var(--text-primary);
    }

    .call-log-table tbody tr:hover {
        background-color: var(--bg-surface-raised);
    }

    .time-cell {
        font-family: "SF Mono", "Monaco", "Courier New", monospace;
        font-size: 0.875rem;
        color: var(--text-secondary);
    }

    .status-indicator {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: capitalize;
    }

    .status-indicator::before {
        content: "";
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background-color: currentColor;
    }

    .status-indicator[data-status="active"] {
        background-color: var(--status-success-bg);
        color: var(--status-success);
    }

    .status-indicator[data-status="ended"] {
        background-color: var(--bg-surface-raised);
        color: var(--text-muted);
    }

    .status-indicator[data-status="incoming"] {
        background-color: var(--status-warning-bg);
        color: var(--status-warning);
    }
</style>
