-- Migration: Create agent_templates table

CREATE TABLE IF NOT EXISTS agent_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    
    -- Categorization (Stored as text for Enums)
    industry TEXT NOT NULL,
    use_case TEXT NOT NULL,
    
    -- Display
    description TEXT NOT NULL,
    long_description TEXT,
    icon_url TEXT,
    tags TEXT NOT NULL, -- Stored as JSON array
    
    -- Configuration (JSON columns for nested objects)
    config_channels TEXT NOT NULL,      -- JSON
    config_pipeline TEXT NOT NULL,      -- JSON
    config_behavior TEXT NOT NULL,      -- JSON
    config_knowledge TEXT NOT NULL,     -- JSON
    config_voice TEXT NOT NULL,         -- JSON
    
    -- Metadata
    is_public BOOLEAN NOT NULL DEFAULT 0,
    created_by TEXT, -- 'system' or orgId. Foreign key constraint handled at app level or unrelated to agents table directly.
    usage_count INTEGER NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance filtering and sorting
CREATE INDEX IF NOT EXISTS idx_agent_templates_industry ON agent_templates(industry);
CREATE INDEX IF NOT EXISTS idx_agent_templates_use_case ON agent_templates(use_case);
CREATE INDEX IF NOT EXISTS idx_agent_templates_featured ON agent_templates(featured);
CREATE INDEX IF NOT EXISTS idx_agent_templates_is_public ON agent_templates(is_public);
CREATE INDEX IF NOT EXISTS idx_agent_templates_slug ON agent_templates(slug);

-- Note: 
-- updated_at trigger might be needed depending on D1 behavior, 
-- but application-level update is often preferred in simple D1 setups.
