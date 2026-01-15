-- Migration: Create agents table

CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    org_id TEXT NOT NULL,
    name TEXT NOT NULL,
    config TEXT NOT NULL, -- JSON
    status TEXT NOT NULL, -- 'active', 'inactive', 'maintenance'
    phone_number TEXT,
    created_at INTEGER NOT NULL,
    updated_at INTEGER
);

CREATE INDEX IF NOT EXISTS idx_agents_org_id ON agents(org_id);
