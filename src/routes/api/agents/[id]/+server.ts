
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { UpdateAgentSchema } from '$lib/utils/validation';

export const GET: RequestHandler = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  const { id } = params;
  
  const agent = await db.prepare('SELECT * FROM agents WHERE id = ?').bind(id).first();
  
  if (!agent) return json({ error: 'Agent not found' }, { status: 404 });
  
  return json({
    ...agent,
    config: JSON.parse(agent.config as string)
  });
};

export const PATCH: RequestHandler = async ({ request, platform, params }) => {
  const db = platform?.env?.DB;
  const { id } = params;
  
  try {
    const body = await request.json();
    const validation = UpdateAgentSchema.safeParse(body);
    
    if (!validation.success) {
      return json({ error: 'Invalid data' }, { status: 400 });
    }

    const updates = validation.data;
    const fields: string[] = [];
    const values: any[] = [];

    if (updates.name) { fields.push('name = ?'); values.push(updates.name); }
    if (updates.status) { fields.push('status = ?'); values.push(updates.status); }
    if (updates.config) { fields.push('config = ?'); values.push(JSON.stringify(updates.config)); }
    
    if (fields.length === 0) return json({ success: true }); // Nothing to update

    values.push(id);
    await db.prepare(`UPDATE agents SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();

    return json({ success: true });
  } catch (e: any) {
    return json({ error: e.message }, { status: 500 });
  }
};

export const DELETE: RequestHandler = async ({ platform, params }) => {
  const db = platform?.env?.DB;
  const { id } = params;
  await db.prepare('DELETE FROM agents WHERE id = ?').bind(id).run();
  return json({ success: true });
};
