import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ url }) => {
    // Webhook verification challenge
    const mode = url.searchParams.get('hub.mode');
    const token = url.searchParams.get('hub.verify_token');
    const challenge = url.searchParams.get('hub.challenge');

    if (mode === 'subscribe' && token === 'MY_VERIFY_TOKEN') {
        return new Response(challenge);
    }
    return new Response('Forbidden', { status: 403 });
};

export const POST: RequestHandler = async ({ request }) => {
    const data = await request.json();
    console.log('Received WhatsApp Webhook:', data);
    // Agent Task: Process message -> SessionManager -> Reply
    return json({ status: 'ok' });
};
