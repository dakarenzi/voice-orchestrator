
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ platform }) => {
  const db = platform?.env?.DB;
  
  // Parallel execution of analytical queries
  const [agents, conversations, success] = await Promise.all([
    db.prepare('SELECT COUNT(*) as count FROM agents').first(),
    db.prepare("SELECT COUNT(*) as count FROM conversations WHERE started_at > ?").bind(Date.now() - 86400000).first(),
    db.prepare("SELECT COUNT(*) as total, SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed FROM conversations").first()
  ]);
  
  // Calculate success rate safely
  const totalCalls = success.total as number;
  const completedCalls = success.completed as number;
  const successRate = totalCalls > 0 ? (completedCalls / totalCalls) * 100 : 0;

  return json({
    activeCalls: 0, // In production, query a Durable Object or KV for live session count
    totalAgents: agents.count,
    conversationsToday: conversations.count,
    successRate: parseFloat(successRate.toFixed(1))
  });
};
