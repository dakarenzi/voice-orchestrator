
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { logger } from '$lib/utils/logger';
import { TelnyxService } from '$lib/services/telnyx';

export const POST: RequestHandler = async ({ request, platform }) => {
  const signature = request.headers.get('telnyx-signature-ed25519');
  const timestamp = request.headers.get('telnyx-timestamp');
  const body = await request.text();

  // 1. Validate Signature (Mocked for now, assumes middleware handles it)
  if (!signature || !timestamp) {
    logger.error('Missing Telnyx signature headers');
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const payload = JSON.parse(body);
  const event = payload.data.event_type;
  const callControlId = payload.data.payload.call_control_id;
  const toNumber = payload.data.payload.to;

  logger.info(`Received Telnyx Event: ${event}`, { callControlId });

  // Initialize Services
  const db = platform?.env?.DB;
  const telnyx = new TelnyxService(platform?.env?.TELNYX_API_KEY || '');

  try {
    switch(event) {
      case 'call.initiated':
        // 1. Lookup Agent by phone number
        const agent = await db?.prepare('SELECT * FROM agents WHERE phone_number = ? LIMIT 1').bind(toNumber).first();
        
        if (!agent) {
          logger.warn('No agent found for number', { toNumber });
          await telnyx.speak(callControlId, "I'm sorry, this number is not configured.");
          await telnyx.hangup(callControlId);
          return json({ status: 'rejected' });
        }

        // 2. Create Conversation Record
        const conversationId = crypto.randomUUID();
        await db?.prepare(
          'INSERT INTO conversations (id, agent_id, channel, session_id, started_at) VALUES (?, ?, ?, ?, ?)'
        ).bind(conversationId, agent.id, 'phone', callControlId, Date.now()).run();

        // 3. Answer Call
        await telnyx.answer(callControlId);
        logger.info('Call answered', { conversationId });
        break;

      case 'call.answered':
        // 4. Start Media Stream
        const streamUrl = `wss://${new URL(request.url).host}/api/voice/stream`;
        await telnyx.startStreaming(callControlId, streamUrl, {
          track: 'both_tracks',
          bidirectional: true
        });
        break;

      case 'call.hangup':
        // 6. Cleanup
        await db?.prepare('UPDATE conversations SET ended_at = ?, status = ? WHERE session_id = ?')
          .bind(Date.now(), 'completed', callControlId).run();
        logger.info('Call ended');
        break;
    }
  } catch (err: any) {
    logger.error('Error processing webhook', { error: err.message });
    try { await telnyx.hangup(callControlId); } catch(e) {}
    return json({ error: err.message }, { status: 500 });
  }

  return json({ status: 'ok' });
};
