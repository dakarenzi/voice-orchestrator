
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logger } from '$lib/utils/logger';
import { CreateConversationSchema } from '$lib/utils/validation';
import type { Conversation } from '$lib/types';

export const GET: RequestHandler = async ({ platform, url }) => {
  const db = platform?.env?.DB;
  if (!db) return json({ error: 'Database not available' }, { status: 500 });

  const limit = Math.min(Number(url.searchParams.get('limit')) || 20, 100);
  const offset = Number(url.searchParams.get('offset')) || 0;

  try {
    // Join with agents to get agent name
    const { results } = await db.prepare(
      `SELECT c.*, a.name as agent_name 
       FROM conversations c 
       LEFT JOIN agents a ON c.agent_id = a.id 
       ORDER BY c.started_at DESC 
       LIMIT ? OFFSET ?`
    ).bind(limit, offset).all();

    // Map DB columns (snake_case) to API types (camelCase)
    const conversations: Conversation[] = results.map((row: any) => ({
      id: row.id,
      agentId: row.agent_id,
      agentName: row.agent_name,
      channel: row.channel as any,
      sessionId: row.session_id,
      status: row.status as any,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined,
      durationSeconds: row.ended_at ? Math.floor((row.ended_at - row.started_at) / 1000) : undefined
    }));

    return json({ data: conversations, limit, offset });
  } catch (e: any) {
    logger.error('Failed to fetch conversations', { error: e.message });
    return json({ error: 'Database error' }, { status: 500 });
  }
};

export const POST: RequestHandler = async ({ request, platform }) => {
  const db = platform?.env?.DB;
  if (!db) return json({ error: 'Database not available' }, { status: 500 });

  try {
    const body = await request.json();
    const validation = CreateConversationSchema.safeParse(body);
    
    if (!validation.success) {
      return json({ error: 'Validation failed', details: validation.error }, { status: 400 });
    }

    const { agentId, channel, metadata } = validation.data;
    const id = crypto.randomUUID();
    const startedAt = Date.now();

    await db.prepare(
      'INSERT INTO conversations (id, agent_id, channel, started_at, metadata, status) VALUES (?, ?, ?, ?, ?, ?)'
    ).bind(id, agentId, channel, startedAt, JSON.stringify(metadata || {}), 'active').run();

    return json({ id, status: 'active', startedAt });
  } catch (e: any) {
    logger.error('Failed to create conversation', { error: e.message });
    return json({ error: 'Database error' }, { status: 500 });
  }
};
