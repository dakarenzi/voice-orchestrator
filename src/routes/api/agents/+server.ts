
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CreateAgentSchema } from '$lib/utils/validation';
import type { Agent } from '$lib/types';

export const GET: RequestHandler = async ({ platform, url }) => {
  const db = platform?.env?.DB;
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || 'all';

  // Placeholder tenant ID until auth is fully hooked up
  const tenantId = 'org_demo';

  let query = 'SELECT * FROM agents WHERE tenant_id = ?';
  const params: string[] = [tenantId];

  if (search) {
    query += ' AND name LIKE ?';
    params.push(`%${search}%`);
  }

  if (status !== 'all') {
    query += ' AND status = ?';
    params.push(status);
  }

  query += ' ORDER BY created_at DESC';

  try {
    const { results } = await db.prepare(query).bind(...params).all();

    // Map DB snake_case to API camelCase
    const agents: Agent[] = results.map((row: any) => ({
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      description: row.description,
      voiceProvider: row.voice_provider,
      voiceId: row.voice_id,
      voiceConfig: row.voice_config ? JSON.parse(row.voice_config) : undefined,
      llmProvider: row.llm_provider,
      llmModel: row.llm_model,
      systemPrompt: row.system_prompt,
      tools: row.tools ? JSON.parse(row.tools) : [],
      channels: row.channels ? JSON.parse(row.channels) : [],
      status: row.status,
      templateId: row.template_id,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      sttProvider: 'deepgram' // Hardcoded default
    }));

    return json(agents);
  } catch (e: any) {
    console.error('GET /api/agents error:', e);
    return json({ error: e.message }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, platform }) => {
  const db = platform?.env?.DB;
  try {
    const body = await request.json();
    const validation = CreateAgentSchema.safeParse(body);

    if (!validation.success) {
      return json({ error: 'Validation failed', details: validation.error }, { status: 400 });
    }

    const data = validation.data;
    const id = crypto.randomUUID();
    const now = Date.now();
    const tenantId = 'org_demo'; // Placeholder

    // Ensure tenant exists (Foreign Key Constraint)
    await db.prepare(`
      INSERT OR IGNORE INTO tenants (id, name, created_at, updated_at)
      VALUES (?, ?, ?, ?)
    `).bind(tenantId, 'Demo Org', now, now).run();

    await db.prepare(`
      INSERT INTO agents (
        id, tenant_id, name, description, 
        voice_provider, voice_id, voice_config, 
        llm_provider, llm_model, system_prompt, 
        tools, channels, status, template_id, 
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      id,
      tenantId,
      data.name,
      data.description || null,
      data.voiceProvider,
      data.voiceId,
      JSON.stringify(data.voiceConfig || {}),
      data.llmProvider,
      data.llmModel,
      data.systemPrompt,
      JSON.stringify(data.tools),
      JSON.stringify(data.channels),
      'idle', // Default status
      data.templateId || null,
      now,
      now
    ).run();

    return json({ id, ...data, sttProvider: 'deepgram', status: 'idle', createdAt: now, updatedAt: now }, { status: 201 });
  } catch (e: any) {
    console.error('POST /api/agents error:', e);
    // Return more details about the error (e.g. constraint failed)
    return json({ error: e.message, cause: e.cause }, { status: 500 });
  }
};

export const PUT: RequestHandler = async ({ request, platform }) => {
  const db = platform?.env?.DB;
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return json({ error: 'Agent ID is required' }, { status: 400 });
    }

    // Use CreateAgentSchema for validation as Update is basically a partial create but we usually send full object from builder
    // Or we can use UpdateAgentSchema for partial updates. 
    // The builder sends the FULL agent object, so CreateAgentSchema (or partial) is fine.
    // Let's safeParse with checks.

    // Construct update query dynamically or fixed set
    const now = Date.now();

    // Ideally we validate the payload. 
    // const validation = CreateAgentSchema.partial().safeParse(updates);

    await db.prepare(`
      UPDATE agents SET
        name = coalesce(?, name),
        description = coalesce(?, description),
        voice_provider = coalesce(?, voice_provider),
        voice_id = coalesce(?, voice_id),
        voice_config = coalesce(?, voice_config),
        llm_provider = coalesce(?, llm_provider),
        llm_model = coalesce(?, llm_model),
        system_prompt = coalesce(?, system_prompt),
        tools = coalesce(?, tools),
        channels = coalesce(?, channels),
        status = coalesce(?, status),
        updated_at = ?
      WHERE id = ?
    `).bind(
      updates.name,
      updates.description || null,
      updates.voiceProvider,
      updates.voiceId,
      updates.voiceConfig ? JSON.stringify(updates.voiceConfig) : null,
      updates.llmProvider,
      updates.llmModel,
      updates.systemPrompt,
      updates.tools ? JSON.stringify(updates.tools) : null,
      updates.channels ? JSON.stringify(updates.channels) : null,
      updates.status,
      now,
      id
    ).run();

    return json({ success: true, id, updatedAt: now });

  } catch (e: any) {
    console.error('PUT /api/agents error:', e);
    return json({ error: e.message, cause: e.cause }, { status: 500 });
  }
};
