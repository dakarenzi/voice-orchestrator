import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
    try {
        const body = await request.json();
        const DEEPGRAM_WORKER_URL = 'https://deepgram-unified.weathered-firefly-2bcf.workers.dev';

        const workerResponse = await fetch(`${DEEPGRAM_WORKER_URL}/voices/preview`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        if (!workerResponse.ok) {
            return new Response(await workerResponse.text(), { status: workerResponse.status });
        }

        const audioBlob = await workerResponse.blob();

        return new Response(audioBlob, {
            headers: {
                'Content-Type': 'audio/wav',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('Preview proxy error:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch preview' }), { status: 500 });
    }
};
