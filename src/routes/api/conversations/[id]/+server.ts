
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logger } from '$lib/utils/logger';
import type { Conversation, Message } from '$lib/types';

export const GET: RequestHandler = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) return json({ error: 'Database not available' }, { status: 500 });
  
  const { id } = params;

  try {
    const row = await db.prepare('SELECT * FROM conversations WHERE id = ?').bind(id).first();
    
    if (!row) return json({ error: 'Not found' }, { status: 404 });

    const conversation: Conversation = {
      id: row.id,
      agentId: row.agent_id,
      channel: row.channel as any,
      sessionId: row.session_id,
      status: row.status as any,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      metadata: row.metadata ? JSON.parse(row.metadata) : undefined
    };

    const { results: messageRows } = await db.prepare(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC'
    ).bind(id).all();

    const messages: Message[] = messageRows.map((m: any) => ({
      id: m.id,
      conversationId: m.conversation_id,
      role: m.role as any,
      content: m.content,
      audioUrl: m.audio_url,
      timestamp: m.timestamp
    }));

    return json({ conversation, messages });
  } catch (e: any) {
    logger.error(`Failed to fetch conversation ${id}`, { error: e.message });
    return json({ error: 'Internal Server Error' }, { status: 500 });
  }
};

export const PATCH: RequestHandler = async ({ request, platform, params }) => {
  const db = platform?.env?.DB;
  if (!db) return json({ error: 'Database not available' }, { status: 500 });

  const { id } = params;
  
  try {
    const updates = await request.json() as Record<string, any>;
    const allowed = ['status', 'ended_at', 'metadata'];
    const fields = Object.keys(updates).filter(k => allowed.includes(k));

    if (fields.length === 0) return json({ error: 'No valid fields' }, { status: 400 });

    // Map camelCase to snake_case for DB
    const dbFields = fields.map(k => {
      if (k === 'endedAt') return 'ended_at';
      return k;
    });
    
    const values = fields.map(k => {
      if (k === 'metadata') return JSON.stringify(updates[k]);
      return updates[k];
    });

    const setClause = dbFields.map(k => `${k} = ?`).join(', ');
    
    await db.prepare(`UPDATE conversations SET ${setClause} WHERE id = ?`)
      .bind(...values, id).run();

    return json({ success: true });
  } catch (e: any) {
    logger.error('Failed to update conversation', { id, error: e.message });
    return json({ error: 'Database error' }, { status: 500 });
  }
};
