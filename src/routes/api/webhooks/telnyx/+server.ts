import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, platform }) => {
  const data = await request.json();
  console.log('Received Telnyx Webhook:', data);

  const event = data.data;

  // Agent Task: Handle 'call.initiated', 'call.answered', 'call.hangup'

  if (event.event_type === 'call.initiated') {
    const callControlId = event.payload.call_control_id;
    console.log(`Responding to call ${callControlId}`);
    // Send answer command to Telnyx
    return json({
      command: 'answer',
      payload: { call_control_id: callControlId }
    }); // Note: This is usually done via a separate POST, not response body in webhook V2, depending on config.
    // But we will return 200 OK to acknowledge.
  }

  return json({ status: 'received' });
};
