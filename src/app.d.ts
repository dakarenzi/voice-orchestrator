// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
    namespace App {
        // interface Error {}
        // interface locals {}
        // interface PageData {}
        // interface PageState {}
        interface Platform {
            env: {
                // Add Cloudflare Env bindings here
                GEMINI_API_KEY: string;
                DEEPGRAM_API_KEY: string;
                INWORLD_API_KEY: string;
                INWORLD_SCENE: string;
                ELEVENLABS_API_KEY: string;
                DB: D1Database;
            }
            context: {
                waitUntil(promise: Promise<any>): void;
            }
            caches: CacheStorage & { default: Cache }
        }
    }
}

export { };
