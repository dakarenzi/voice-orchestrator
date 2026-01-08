
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform, url }) => {
  const db = platform?.env?.DB;
  const range = url.searchParams.get('range') || '7d'; // 7d, 30d
  
  // Calculate date boundary
  const days = range === '30d' ? 30 : 7;
  const boundary = Date.now() - (days * 24 * 60 * 60 * 1000);

  try {
    // 1. Calls per day
    const { results: dailyCalls } = await db.prepare(`
      SELECT 
        strftime('%Y-%m-%d', datetime(started_at / 1000, 'unixepoch')) as date,
        COUNT(*) as count
      FROM conversations 
      WHERE started_at > ?
      GROUP BY date
      ORDER BY date ASC
    `).bind(boundary).all();

    // 2. Channel Distribution
    const { results: channels } = await db.prepare(`
      SELECT channel, COUNT(*) as count 
      FROM conversations 
      WHERE started_at > ? 
      GROUP BY channel
    `).bind(boundary).all();

    return json({
      dailyCalls: {
        labels: dailyCalls.map((r: any) => r.date),
        data: dailyCalls.map((r: any) => r.count)
      },
      channels: {
        labels: channels.map((r: any) => r.channel),
        data: channels.map((r: any) => r.count)
      }
    });
  } catch (e: any) {
    return json({ error: e.message }, { status: 500 });
  }
};
