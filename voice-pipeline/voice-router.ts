interface Env {
    VOICE_SESSION_UNIFIED: DurableObjectNamespace;
    DEEPGRAM: Fetcher;
}

export { VoiceSessionUnifiedDO } from './voice-session-do-unified';

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        const url = new URL(request.url);

        // Health check
        if (url.pathname === '/health') {
            return Response.json({
                status: 'ok',
                provider: 'deepgram-unified',
                timestamp: Date.now(),
            });
        }

        // List available voices
        if (url.pathname === '/voices' && request.method === 'GET') {
            return env.DEEPGRAM.fetch(new Request('http://deepgram/voices', request));
        }

        // Preview voice
        if (url.pathname === '/voices/preview' && request.method === 'POST') {
            return env.DEEPGRAM.fetch(request);
        }

        // Start voice session
        if (url.pathname === '/session') {
            const agentId = url.searchParams.get('agentId');
            if (!agentId) {
                return new Response('Missing agentId', { status: 400 });
            }

            // Create Durable Object for this session
            const id = env.VOICE_SESSION_UNIFIED.idFromName(agentId); // Using AgentID as name for singleton per agent? No, rename.
            // Actually, we probably want a unique session ID, or using agentId means one session per agent globally?
            // The user code used `idFromName(agentId)`, which implies one DO per agent. 
            // If we want multiple concurrent users for the same agent, we should generate a random ID or use `newUniqueId()`.
            // BUT, DOs are often used to coordinate state. If the agent has shared state, this is correct.
            // If it's just a session handler, `newUniqueId()` is better to scale.
            // User prompt used: `env.VOICE_SESSION_UNIFIED.idFromName(agentId)`. 
            // I will stick to user prompt but add a comment.

            const stub = env.VOICE_SESSION_UNIFIED.get(id);

            return stub.fetch(request);
        }

        // Cost estimation
        if (url.pathname === '/cost/estimate' && request.method === 'POST') {
            const { audioSeconds, responseText } = await request.json();

            // STT cost: ~$0.0043 per minute (Nova-2)
            const sttCost = (audioSeconds / 60) * 0.0043;

            // TTS cost: ~$0.015 per 1k characters (Aura)
            const ttsCost = (responseText.length / 1000) * 0.015;

            return Response.json({
                stt: sttCost,
                tts: ttsCost,
                total: sttCost + ttsCost,
                breakdown: {
                    stt: {
                        seconds: audioSeconds,
                        minutes: audioSeconds / 60,
                        rate: '$0.0043/min',
                    },
                    tts: {
                        characters: responseText.length,
                        rate: '$0.015/1k chars',
                    },
                },
            });
        }

        return new Response('Not found', { status: 404 });
    },
};
