
# VoiceOrchestrator

A multi-channel Voice AI Agent Platform built on Cloudflare Pages, SvelteKit, and D1.

## Architecture

- **Frontend**: SvelteKit, Tailwind CSS, shadcn-svelte
- **Backend**: Cloudflare Workers (Edge), D1 (SQLite), Durable Objects (WebSocket)
- **AI Pipeline**:
  - STT: Deepgram Nova-2
  - LLM: Inworld AI / OpenAI
  - TTS: ElevenLabs / Cartesia
- **Telephony**: Telnyx

## Setup & Deployment

### 1. Prerequisites
- Cloudflare Account
- Node.js 18+
- Wrangler CLI (`npm install -g wrangler`)

### 2. Database Setup
Create the D1 database:
```bash
wrangler d1 create voice-orchestrator
```
Copy the `database_id` into `wrangler.toml`.

Apply the schema:
```bash
wrangler d1 execute voice-orchestrator --file=migrations/0001_initial.sql
```

### 3. Environment Secrets
Set your API keys securely in Cloudflare:
```bash
wrangler secret put DEEPGRAM_API_KEY
wrangler secret put INWORLD_API_KEY
wrangler secret put ELEVENLABS_API_KEY
wrangler secret put TELNYX_API_KEY
wrangler secret put JWT_SECRET
```

### 4. Local Development
```bash
# Install dependencies
npm install

# Run development server (with local D1 mock)
npm run dev
```

### 5. Production Deployment
```bash
npm run build
wrangler pages publish .svelte-kit/cloudflare
```

## Features

- **Agent Builder**: Drag-and-drop pipeline configuration.
- **Real-time Voice**: WebSocket streaming with visualizer.
- **Analytics**: Call volume, success rates, and channel distribution.
- **Multi-channel**: Support for Web (webrtc/websocket) and Phone (SIP/PSTN).

## API Endpoints

- `GET /api/agents` - List agents
- `POST /api/agents` - Create agent
- `POST /api/webhooks/telnyx` - Handle inbound calls
- `ws:// /api/voice/stream` - WebSocket audio stream

## License
MIT
