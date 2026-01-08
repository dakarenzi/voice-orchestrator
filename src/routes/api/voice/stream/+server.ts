
import type { RequestHandler } from './$types';
import { logger } from '$lib/utils/logger';

// Helper to create WAV header
function createWavHeader(length: number, sampleRate: number = 48000) {
  const buffer = new ArrayBuffer(44);
  const view = new DataView(buffer);
  
  // RIFF chunk descriptor
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + length, true);
  writeString(view, 8, 'WAVE');
  
  // fmt sub-chunk
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true); // AudioFormat (1 for PCM)
  view.setUint16(22, 1, true); // NumChannels (1)
  view.setUint32(24, sampleRate, true); // SampleRate
  view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
  view.setUint16(32, 2, true); // BlockAlign (NumChannels * BitsPerSample/8)
  view.setUint16(34, 16, true); // BitsPerSample
  
  // data sub-chunk
  writeString(view, 36, 'data');
  view.setUint32(40, length, true);
  
  return new Uint8Array(buffer);
}

function writeString(view: DataView, offset: number, string: string) {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
}

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
  let currentAgentId: string | null = null;
  let currentSessionId: string | null = null;
  
  // Audio Recording Buffer
  let audioChunks: Uint8Array[] = [];
  let totalLength = 0;
  
  const saveRecording = async () => {
    if (!currentSessionId || audioChunks.length === 0 || !platform?.env?.BUCKET) return;
    
    try {
      const db = platform?.env?.DB;
      const bucket = platform.env.BUCKET;
      
      // Merge chunks
      const combined = new Uint8Array(totalLength);
      let offset = 0;
      for (const chunk of audioChunks) {
        combined.set(chunk, offset);
        offset += chunk.length;
      }
      
      // Add WAV Header (Assuming 48kHz for Web; Telnyx might be 8kHz but for now standardizing on Web default)
      // In a real app, detect sample rate from source.
      const wavHeader = createWavHeader(totalLength, 48000);
      const finalBuffer = new Uint8Array(wavHeader.length + combined.length);
      finalBuffer.set(wavHeader, 0);
      finalBuffer.set(combined, wavHeader.length);
      
      const fileName = `recordings/${currentSessionId}.wav`;
      
      // Upload to R2
      await bucket.put(fileName, finalBuffer, {
        httpMetadata: { contentType: 'audio/wav' }
      });
      
      logger.info('Recording saved to R2', { fileName, size: finalBuffer.length });
      
      // Update Conversation Metadata
      // We need to fetch existing metadata first or perform a JSON patch if D1 supports it (it handles JSON functions)
      // Simpler: Just fetch conversation, update metadata, save back.
      const convo = await db.prepare('SELECT metadata FROM conversations WHERE session_id = ?').bind(currentSessionId).first();
      
      if (convo) {
        const metadata = convo.metadata ? JSON.parse(convo.metadata as string) : {};
        metadata.recordingUrl = `/api/recordings/${currentSessionId}`;
        
        await db.prepare('UPDATE conversations SET metadata = ? WHERE session_id = ?')
          .bind(JSON.stringify(metadata), currentSessionId)
          .run();
      }
      
      // Clear buffer
      audioChunks = [];
      totalLength = 0;
      
    } catch (e: any) {
      logger.error('Failed to save recording', { error: e.message });
    }
  };

  server.addEventListener('message', async (event: any) => {
    try {
      const message = JSON.parse(event.data as string);

      if (message.type === 'start_session') {
        currentAgentId = message.agent_id;
        logger.info('Starting Voice Session', { agentId: currentAgentId });
        
        const db = platform?.env?.DB;
        const agent = await db?.prepare('SELECT * FROM agents WHERE id = ?').bind(message.agent_id).first();
        if (!agent) {
          server.send(JSON.stringify({ type: 'error', message: 'Agent not found' }));
          return;
        }

        currentSessionId = crypto.randomUUID();

        // Create initial conversation record if not exists (Web call)
        // Check if session_id provided in start_session (Telnyx passes it usually)
        if (message.session_id) {
           currentSessionId = message.session_id;
        } else {
           // Create DB record for Web Call
           await db.prepare(
            'INSERT INTO conversations (id, agent_id, channel, session_id, started_at, status, metadata) VALUES (?, ?, ?, ?, ?, ?, ?)'
           ).bind(currentSessionId, currentAgentId, 'web', currentSessionId, Date.now(), 'active', '{}').run();
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
               
               // Save transcript to DB (Messages)
               await db.prepare('INSERT INTO messages (id, conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?, ?)')
                .bind(crypto.randomUUID(), currentSessionId, 'user', userText, Date.now()).run();

               // Simulate LLM & TTS
               server.send(JSON.stringify({ type: 'status', state: 'thinking' }));
               setTimeout(async () => {
                 server.send(JSON.stringify({ type: 'status', state: 'speaking' }));
                 const responseText = "I processed that request.";
                 
                 server.send(JSON.stringify({ 
                   type: 'agent_response', 
                   text: responseText, 
                   audio_url: '' 
                 }));

                 await db.prepare('INSERT INTO messages (id, conversation_id, role, content, timestamp) VALUES (?, ?, ?, ?, ?)')
                  .bind(crypto.randomUUID(), currentSessionId, 'agent', responseText, Date.now()).run();

                 server.send(JSON.stringify({ type: 'status', state: 'listening' }));
               }, 1000);
            }
          };
        }

        server.send(JSON.stringify({ type: 'session_started', session_id: currentSessionId }));

      } else if (message.type === 'audio_chunk' || (message.event === 'media' && message.media)) {
        // Handle Incoming Audio
        let data: string = '';
        if (message.type === 'audio_chunk') data = message.data;
        else if (message.event === 'media') data = message.media.payload;

        if (data) {
          const binary = Uint8Array.from(atob(data), c => c.charCodeAt(0));
          audioChunks.push(binary);
          totalLength += binary.length;
          
          // Forward to Deepgram if open
          // if (deepgramWs && deepgramWs.readyState === WebSocket.OPEN) deepgramWs.send(binary);
        }

      } else if (message.type === 'end_session') {
        if (deepgramWs) deepgramWs.close();
        
        // Save Recording
        await saveRecording();
        
        // Update status
        if (currentSessionId) {
            const db = platform?.env?.DB;
            await db?.prepare("UPDATE conversations SET status = 'completed', ended_at = ? WHERE session_id = ?")
                .bind(Date.now(), currentSessionId).run();
        }

        server.close();
      }

    } catch (err: any) {
      logger.error('WebSocket Error', { error: err.message });
    }
  });
  
  // Safety net: Save on close if not explicitly ended
  server.addEventListener('close', async () => {
      if (audioChunks.length > 0) {
          await saveRecording();
      }
  });

  return new Response(null, { status: 101, webSocket: client } as any);
};
