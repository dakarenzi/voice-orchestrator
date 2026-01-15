import { DeepgramOrchestrator } from '../lib/orchestrator/services/deepgram-agent';
import type { Agent } from '../lib/types';

interface Env {
    DEEPGRAM_API_KEY: string;
    DB: D1Database;
}

export default {
    async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
        const upgradeHeader = request.headers.get('Upgrade');
        if (!upgradeHeader || upgradeHeader !== 'websocket') {
            return new Response('Expected Upgrade: websocket', { status: 426 });
        }

        const url = new URL(request.url);
        const agentId = url.searchParams.get('agentId');

        // TODO: Fetch Real Agent from DB
        // For now, mock it to test the pipeline
        const mockAgent: Agent = {
            tenantId: 'demo',
            name: 'Demo Agent',
            status: 'active',
            voiceProvider: 'deepgram',
            voiceId: 'aura-asteria-en', // Deepgram Voice ID
            llmProvider: 'openai',
            llmModel: 'gpt-4-turbo',
            systemPrompt: 'You are a helpful assistant. Keep your answers short.',
            tools: [],
            channels: ['voice']
        };

        const orchestrator = new DeepgramOrchestrator({
            apiKey: env.DEEPGRAM_API_KEY,
            agent: mockAgent
        });

        const [client, server] = Object.values(new WebSocketPair());

        // Handle Telnyx Stream
        server.accept();
        server.addEventListener('message', async (event) => {
            // Telnyx sends JSON control messages (start, stop) AND binary audio (sometimes base64 encoded JSON)
            // We need to parse Telnyx protocol here.

            // SIMPLIFICATION: Assuming we receive raw audio or handle Telnyx specific parsing
            // For now, let's just log connection.
            console.log('Telnyx Message:', event.data);

            // If audio data, orchestrator.sendAudio(data);
        });

        // Connect to Deepgram
        try {
            await orchestrator.connect();
            // TODO: Pipe orchestrator output back to 'server' (Telnyx)
        } catch (e) {
            console.error('Failed to connect orchestrator', e);
            server.close(1011, 'Orchestrator Failed');
        }

        return new Response(null, {
            status: 101,
            webSocket: client,
        });
    }
};
