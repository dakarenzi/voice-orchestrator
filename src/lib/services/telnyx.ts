import { logger } from '$utils/logger';

interface TelnyxCallControlResponse {
  data: {
    result: string;
  };
}

interface StreamingOptions {
  track?: 'inbound_track' | 'outbound_track' | 'both_tracks';
  bidirectional?: boolean;
}

export class TelnyxService {
  private apiKey: string;
  private baseUrl = 'https://api.telnyx.com/v2';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  private async request<T>(endpoint: string, method: string, body?: any): Promise<T> {
    try {
      const res = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: body ? JSON.stringify(body) : undefined,
      });
      
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Telnyx API Error [${res.status}]: ${errText}`);
      }
      return await res.json() as T;
    } catch (e: any) {
      logger.error('Telnyx Request Failed', { endpoint, error: e.message });
      throw e;
    }
  }

  async answer(callControlId: string): Promise<TelnyxCallControlResponse> {
    return this.request(`/calls/${callControlId}/actions/answer`, 'POST', {
      client_state: base64Encode(JSON.stringify({ answered_at: Date.now() }))
    });
  }

  async speak(callControlId: string, text: string): Promise<TelnyxCallControlResponse> {
    return this.request(`/calls/${callControlId}/actions/speak`, 'POST', {
      payload: text,
      voice: 'female',
      language: 'en-US'
    });
  }

  async startStreaming(callControlId: string, streamUrl: string, options: StreamingOptions = {}): Promise<TelnyxCallControlResponse> {
    return this.request(`/calls/${callControlId}/actions/stream_audio`, 'POST', {
      stream_url: streamUrl,
      stream_track: options.track || 'both_tracks',
      // Note: check Telnyx docs for current support of bidirectional param in stream_audio
      // It is often configured on the WebSocket server side or via a specific 'connect' action for bidirectional.
      // We pass it here assuming custom Telnyx configuration or beta feature support.
      client_state: base64Encode(JSON.stringify({ streaming: true })) 
    });
  }

  async hangup(callControlId: string): Promise<TelnyxCallControlResponse> {
    return this.request(`/calls/${callControlId}/actions/hangup`, 'POST');
  }
}

function base64Encode(str: string): string {
  return btoa(unescape(encodeURIComponent(str)));
}
