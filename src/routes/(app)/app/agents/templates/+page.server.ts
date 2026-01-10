import type { PageServerLoad } from './$types';
import { templates } from '$lib/templates';
import type { AgentTemplate } from '$lib/types/template';
// In a real app, we would query D1 here. For now we will return mock data.
// import { getTemplates } from '$lib/server/db'; 

export const load: PageServerLoad = async ({ url }) => {
    const industry = url.searchParams.get('industry');
    const useCase = url.searchParams.get('useCase');
    const search = url.searchParams.get('search')?.toLowerCase();
    const featured = url.searchParams.get('featured') === 'true';

    let filteredTemplates = templates;

    if (industry && industry !== 'all') {
        filteredTemplates = filteredTemplates.filter(t => {
            if (Array.isArray(t.industry)) {
                return t.industry.includes(industry);
            }
            return t.industry === industry;
        });
    }

    if (useCase && useCase !== 'all') {
        filteredTemplates = filteredTemplates.filter(t => t.useCase === useCase || t.category === useCase);
    }

    if (search) {
        filteredTemplates = filteredTemplates.filter(t =>
            t.name?.toLowerCase().includes(search) ||
            t.description?.toLowerCase().includes(search) ||
            (Array.isArray(t.tags) && t.tags.some((tag: string) => tag.toLowerCase().includes(search)))
        );
    }

    if (featured) {
        filteredTemplates = filteredTemplates.filter(t => t.featured);
    }

    // Get unique filters for dropdowns
    const industries = ['all', ...new Set(templates.map(t => t.industry))];
    const useCases = ['all', ...new Set(templates.map(t => t.useCase))];

    return {
        templates: filteredTemplates,
        filters: {
            industry,
            useCase,
            search,
            featured
        },
        options: {
            industries,
            useCases
        }
    };
};
