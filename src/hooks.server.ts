import type { Handle } from '@sveltejs/kit';
import { withClerkHandler } from 'svelte-clerk/server';
import { sequence } from '@sveltejs/kit/hooks';
import { env } from '$env/dynamic/private';

const clerkHandle = withClerkHandler({
    debug: true,
    signInUrl: '/sign-in',
    signUpUrl: '/sign-up',
});

// Defensive handle: Only run Clerk if keys are present
export const handle: Handle = async ({ event, resolve }) => {
    if (!env.CLERK_SECRET_KEY) {
        console.error('CRITICAL: CLERK_SECRET_KEY is missing from environment. Bypassing auth.');
        return resolve(event);
    }
    return clerkHandle({ event, resolve });
};
