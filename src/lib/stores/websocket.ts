
import { writable } from 'svelte/store';

interface Message {
  speaker: 'user' | 'agent';
  text: string;
  timestamp: number;
}

interface WebSocketState {
  connected: boolean;
  sessionId: string | null;
  messages: Message[];
  status: 'idle' | 'listening' | 'thinking' | 'speaking';
  error: string | null;
}

function createWebSocketStore() {
  const { subscribe, set, update } = writable<WebSocketState>({
    connected: false,
    sessionId: null,
    messages: [],
    status: 'idle',
    error: null
  });

  let ws: WebSocket | null = null;

  return {
    subscribe,
    connect: (url: string, agentId: string) => {
      try {
        ws = new WebSocket(url);
        
        ws.onopen = () => {
          ws?.send(JSON.stringify({ type: 'start_session', agent_id: agentId }));
          update(s => ({ ...s, connected: true, error: null }));
        };

        ws.onmessage = (event) => {
          const msg = JSON.parse(event.data);
          
          switch (msg.type) {
            case 'session_started':
              update(s => ({ ...s, sessionId: msg.session_id, status: 'listening' }));
              break;
            case 'status':
              update(s => ({ ...s, status: msg.state }));
              break;
            case 'transcript':
              update(s => ({ 
                ...s, 
                messages: [...s.messages, { speaker: msg.speaker, text: msg.text, timestamp: Date.now() }] 
              }));
              break;
            case 'agent_response':
              update(s => ({ 
                ...s, 
                messages: [...s.messages, { speaker: 'agent', text: msg.text, timestamp: Date.now() }] 
              }));
              // Handle Audio Playback here if not handled by AudioContext
              break;
            case 'error':
              update(s => ({ ...s, error: msg.message }));
              break;
          }
        };

        ws.onclose = () => {
          update(s => ({ ...s, connected: false, status: 'idle' }));
        };

      } catch (e: any) {
        update(s => ({ ...s, error: e.message }));
      }
    },
    
    sendAudio: (base64Data: string) => {
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ type: 'audio_chunk', data: base64Data }));
      }
    },
    
    disconnect: () => {
      if (ws) {
        ws.send(JSON.stringify({ type: 'end_session' }));
        ws.close();
      }
      update(s => ({ ...s, connected: false, status: 'idle' }));
    }
  };
}

export const websocket = createWebSocketStore();
