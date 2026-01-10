import type { PageServerLoad, Actions } from './$types';
import { error, redirect } from '@sveltejs/kit';
import { mapTemplateToAgent } from '$lib/utils/template-mapper';
import { templates } from '$lib/templates';

export const load: PageServerLoad = async ({ params }) => {
    const { slug } = params;

    // Find template from our seeded data
    const template = templates.find(t => t.slug === slug);

    if (!template) {
        throw error(404, 'Template not found');
    }

    return { template };
};

export const actions: Actions = {
    use: async ({ params, locals }) => {
        const { slug } = params;
        const template = templates.find(t => t.slug === slug);

        if (!template) {
            throw error(404, 'Template not found');
        }


        // 4. Redirect to wizard
        const newAgentId = `draft_${Date.now()}`;
        throw redirect(303, `/app/agents/new?fromTemplate=true&templateId=${template.id}`);
    }
};


