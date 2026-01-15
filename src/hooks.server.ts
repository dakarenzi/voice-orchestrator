import type { Handle } from '@sveltejs/kit';
import { withClerkHandler } from 'svelte-clerk/server';
import { sequence } from '@sveltejs/kit/hooks';
import { env } from '$env/dynamic/private';

// const clerkHandle = withClerkHandler({
//     debug: true,
//     signInUrl: '/sign-in',
//     signUpUrl: '/sign-up',
// });

// export const handle: Handle = sequence(clerkHandle);

// Temporary bypass
export const handle: Handle = async ({ event, resolve }) => {
    return resolve(event);
};
