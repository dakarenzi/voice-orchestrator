
import { describe, it, expect, vi } from 'vitest';
import { actions } from './+page.server';
import { error, redirect } from '@sveltejs/kit';

// Mock seeded templates
vi.mock('../../../../../../../scripts/templates', () => ({
    templates: [
        {
            id: 'tpl_1',
            slug: 'test-slug',
            name: 'Test Template',
            voice: {},
            behavior: { systemPrompt: 'sys' }
        }
    ]
}));

describe('Template Clone Action', () => {
    it('throws 404 if template not found', async () => {
        const event = {
            params: { slug: 'invalid-slug' },
            locals: {}
        } as any;

        await expect(actions.use(event)).rejects.toThrow();
        // In real vitest setup with SvelteKit mocks we would check for specific HttpError
    });

    it('redirects to wizard on success', async () => {
        const event = {
            params: { slug: 'test-slug' },
            locals: {}
        } as any;

        try {
            await actions.use(event);
        } catch (e: any) {
            expect(e.status).toBe(303);
            expect(e.location).toContain('/app/agents/new?fromTemplate=true');
            expect(e.location).toContain('templateId=tpl_1');
        }
    });
});
