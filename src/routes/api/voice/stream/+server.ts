
import type { RequestHandler } from './$types';
import { logger } from '$lib/utils/logger';

// Cloudflare Workers WebSocket implementation
export const GET: RequestHandler = async ({ request, platform }) => {
  const upgradeHeader = request.headers.get('Upgrade');
  if (!upgradeHeader || upgradeHeader !== 'websocket') {
    return new Response('Expected Upgrade: websocket', { status: 426 });
  }

  // @ts-ignore - WebSocketPair is a global in Cloudflare Workers
  const webSocketPair = new WebSocketPair();
  const [client, server] = Object.values(webSocketPair) as [any, any];

  server.accept();

  let deepgramWs: WebSocket | null = null;
  
  server.addEventListener('message', async (event: any) => {
    try {
      const message = JSON.parse(event.data as string);

      if (message.type === 'start_session') {
        logger.info('Starting Voice Session', { agentId: message.agent_id });
        
        const db = platform?.env?.DB;
        const agent = await db?.prepare('SELECT * FROM agents WHERE id = ?').bind(message.agent_id).first();
        if (!agent) {
          server.send(JSON.stringify({ type: 'error', message: 'Agent not found' }));
          return;
        }

        // Simulate Deepgram Connection
        // @ts-ignore
        deepgramWs = new WebSocket('wss://api.deepgram.com/v1/listen?encoding=linear16&sample_rate=48000&channels=1', ['token', platform?.env?.DEEPGRAM_API_KEY]);
        
        if (deepgramWs) {
          deepgramWs.onopen = () => server.send(JSON.stringify({ type: 'status', state: 'listening' }));
          deepgramWs.onmessage = async (dgEvent: any) => {
            const transcriptData = JSON.parse(dgEvent.data);
            if (transcriptData.channel?.alternatives?.[0]?.transcript && transcriptData.is_final) {
               const userText = transcriptData.channel.alternatives[0].transcript;
               server.send(JSON.stringify({ type: 'transcript', text: userText, speaker: 'user', is_final: true }));
               
               // Simulate LLM & TTS
               server.send(JSON.stringify({ type: 'status', state: 'thinking' }));
               setTimeout(() => {
                 server.send(JSON.stringify({ type: 'status', state: 'speaking' }));
                 server.send(JSON.stringify({ 
                   type: 'agent_response', 
                   text: "I processed that request.", 
                   audio_url: '' 
                 }));
                 server.send(JSON.stringify({ type: 'status', state: 'listening' }));
               }, 1000);
            }
          };
        }

        server.send(JSON.stringify({ type: 'session_started', session_id: crypto.randomUUID() }));

      } else if (message.type === 'end_session') {
        if (deepgramWs) deepgramWs.close();
        server.close();
      }

    } catch (err) {
      logger.error('WebSocket Error', { error: err });
    }
  });

  return new Response(null, { status: 101, webSocket: client } as any);
};