
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types'; // Using relative path for types in this location
import { env } from '$env/dynamic/private';

export const GET: RequestHandler = async ({ platform }) => {
    // Inspect what's available in platform.env vs $env/dynamic/private
    const diagnostics = {
        platformParams: !!platform,
        platformEnv: !!platform?.env,
        bindings: {
            DB: !!platform?.env?.DB, // Check D1 binding
            CLERK_SECRET_KEY: !!env.CLERK_SECRET_KEY, // Check SvelteKit env
            PUBLIC_CLERK_PUBLISHABLE_KEY: !!env.PUBLIC_CLERK_PUBLISHABLE_KEY,
            DEEPGRAM_API_KEY: !!env.DEEPGRAM_API_KEY,
        },
        envKeysFound: Object.keys(env || {}).filter(k => !k.startsWith('npm_')), // List non-npm keys
    };

    return json(diagnostics);
};
