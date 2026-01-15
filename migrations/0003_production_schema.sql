-- Enable foreign key constraints
PRAGMA foreign_keys = ON;

-- Tenants: Organizations or individual accounts
CREATE TABLE tenants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  plan TEXT DEFAULT 'free', -- 'free', 'pro', 'enterprise'
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- Users: Members of a tenant
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'member', -- 'owner', 'admin', 'member'
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);

-- Voice Configs: Available voices from providers
CREATE TABLE voice_configs (
  id TEXT PRIMARY KEY,
  provider TEXT NOT NULL, -- 'deepgram', 'elevenlabs', 'cartesia', 'inworld'
  voice_id TEXT NOT NULL, -- External ID from provider
  display_name TEXT NOT NULL,
  gender TEXT, -- 'male', 'female', 'neutral'
  accent TEXT,
  description TEXT,
  latency_tier TEXT, -- 'ultra-fast', 'fast', 'balanced', 'quality'
  cost_tier TEXT, -- 'economy', 'standard', 'premium'
  is_featured BOOLEAN DEFAULT 0,
  preview_url TEXT,
  metadata JSON,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE INDEX idx_voices_provider ON voice_configs(provider);
CREATE INDEX idx_voices_featured ON voice_configs(is_featured);

-- Agents: Re-defining agents table for production
-- Note: We are dropping the old table to ensure clean state for the new schema
DROP TABLE IF EXISTS agents;

CREATE TABLE agents (
  id TEXT PRIMARY KEY,
  tenant_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  
  -- Voice Configuration
  voice_provider TEXT NOT NULL,
  voice_id TEXT NOT NULL,
  voice_config JSON, -- Provider-specific settings (stability, similarity_boost, etc.)
  
  -- LLM Configuration
  llm_provider TEXT NOT NULL, -- 'anthropic', 'openai'
  llm_model TEXT NOT NULL,
  system_prompt TEXT NOT NULL,
  
  -- Capabilities
  tools JSON DEFAULT '[]', -- Array of enabled tool IDs
  channels JSON DEFAULT '["web"]', -- ['web', 'whatsapp', 'voice']
  
  -- State
  status TEXT DEFAULT 'idle', -- 'idle', 'active', 'error', 'maintenance'
  template_id TEXT,
  
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

CREATE INDEX idx_agents_tenant ON agents(tenant_id);
CREATE INDEX idx_agents_status ON agents(tenant_id, status);

-- Agent Sessions: Track live conversations
CREATE TABLE agent_sessions (
  id TEXT PRIMARY KEY,
  agent_id TEXT NOT NULL,
  channel TEXT NOT NULL, -- 'web', 'whatsapp', 'voice'
  user_identifier TEXT, -- User ID, phone number, or session cookie
  
  started_at INTEGER NOT NULL,
  ended_at INTEGER,
  
  -- Analytics
  message_count INTEGER DEFAULT 0,
  duration_seconds INTEGER,
  token_usage JSON, -- { "input": 0, "output": 0 }
  
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'error'
  FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_agent ON agent_sessions(agent_id);
CREATE INDEX idx_sessions_active ON agent_sessions(status, started_at);
