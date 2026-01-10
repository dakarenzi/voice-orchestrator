
import type { AgentTemplate, TemplateCategory } from '$lib/types/template';

// Import all templates
import { ecommerceSupportTemplate } from './ecommerce-support';
import { healthcareSchedulerTemplate } from './healthcare-scheduler';
import { saasOnboardingTemplate } from './saas-onboarding';
import { realEstateLeadTemplate } from './real-estate-lead';
import { restaurantReservationTemplate } from './restaurant-reservation';

// Central Registry
export const templates: AgentTemplate[] = [
    ecommerceSupportTemplate,
    healthcareSchedulerTemplate,
    saasOnboardingTemplate,
    realEstateLeadTemplate,
    restaurantReservationTemplate
];

/**
 * Get a template by its slug
 */
export function getTemplateBySlug(slug: string): AgentTemplate | undefined {
    return templates.find(t => t.slug === slug);
}

/**
 * Get a template by its ID
 */
export function getTemplateById(id: string): AgentTemplate | undefined {
    return templates.find(t => t.id === id);
}

/**
 * List templates filtered by category or industry
 */
export function listTemplates(filters: { category?: TemplateCategory; industry?: string } = {}): AgentTemplate[] {
    let result = templates;

    if (filters.category) {
        result = result.filter(t => t.category === filters.category);
    }

    if (filters.industry) {
        result = result.filter(t => t.industry.includes(filters.industry as any));
    }

    return result;
}

/**
 * Get featured templates
 */
export function getFeaturedTemplates(): AgentTemplate[] {
    return templates.filter(t => t.featured);
}
