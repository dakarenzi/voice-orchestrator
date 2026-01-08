import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ request }) => {
    const upgradeHeader = request.headers.get('Upgrade');
    if (!upgradeHeader || upgradeHeader !== 'websocket') {
        return new Response('Expected Upgrade: websocket', { status: 426 });
    }

    // Cloudflare Workers specific WebSocket handling would go here
    // using available Durable Objects or basic key/pair
    const [client, server] = Object.values(new WebSocketPair());

    server.accept();
    server.addEventListener('message', event => {
        console.log('WS Message:', event.data);
        server.send('Echo: ' + event.data);
    });

    return new Response(null, {
        status: 101,
        webSocket: client
    });
};
