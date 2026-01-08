
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { CreateAgentSchema } from '$lib/utils/validation';

export const GET: RequestHandler = async ({ platform, url }) => {
  const db = platform?.env?.DB;
  const search = url.searchParams.get('search') || '';
  const status = url.searchParams.get('status') || 'all';
  
  let query = 'SELECT * FROM agents WHERE 1=1';
  const params: string[] = [];
  
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
    const agents = results.map((row: any) => ({
      ...row,
      config: JSON.parse(row.config)
    }));
    return json(agents);
  } catch (e: any) {
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

    const { name, config, phoneNumber } = validation.data;
    const id = crypto.randomUUID();
    const now = Date.now();

    await db.prepare(
      'INSERT INTO agents (id, org_id, name, config, status, phone_number, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(
      id, 
      'default-org', // Auth placeholder
      name, 
      JSON.stringify(config), 
      'inactive',
      phoneNumber || null,
      now
    ).run();

    return json({ id, status: 'inactive' }, { status: 201 });
  } catch (e: any) {
    return json({ error: e.message }, { status: 500 });
  }
};
