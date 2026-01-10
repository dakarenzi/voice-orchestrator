
import { templates } from '../src/lib/templates/registry';

// Mock DB Driver for demonstration/verification purposes
const db = {
    select: () => ({
        from: (table: string) => ({
            where: (col: string, val: string) => ({
                first: async () => null // always return null to simulate new insert
            })
        })
    }),
    insert: (table: string) => ({
        values: async (data: any) => {
            // no-op
        }
    })
};

async function seedTemplates() {
    console.log('Starting template seeding...');
    let successCount = 0;
    let skippedCount = 0;

    for (const template of templates) {
        try {
            // Check if template already exists
            const existing = await db
                .select()
                .from('agent_templates')
                .where('id', template.id)
                .first();

            if (existing) {
                console.log(`[SKIP] Template ${template.id} already exists`);
                skippedCount++;
                continue;
            }

            // Handle both old (config wrapper) and new (top-level) schema structures
            // We use 'any' cast to access potential old properties safely
            const t = template as any;

            // Extract core components regardless of schema version
            const channels = t.channels || t.config?.channels;
            const behavior = t.behavior || t.config?.behavior;
            const voice = t.voice || t.config?.voice;
            const pipeline = t.pipeline || t.config?.pipeline;
            const knowledge = t.knowledgeBase || t.config?.knowledge;

            // Insert template
            const record = {
                id: t.id,
                name: t.name,
                slug: t.slug,
                // Handle enum vs string array for industry
                industry: Array.isArray(t.industry) ? JSON.stringify(t.industry) : t.industry,
                use_case: t.useCase || t.category, // Map category to use_case if needed
                description: t.description,
                long_description: t.longDescription,
                icon_url: t.iconUrl || t.visual?.avatar?.url, // New visual.avatar.url fallback
                tags: JSON.stringify(t.tags || []),

                // Serialized Configuration Fields
                config_channels: JSON.stringify(channels || {}),
                config_behavior: JSON.stringify(behavior || {}),
                config_voice: JSON.stringify(voice || {}),
                config_knowledge: JSON.stringify(knowledge || {}),

                // New fields for V2 schema (will be NULL for old templates)
                visual_config: t.visual ? JSON.stringify(t.visual) : null,
                integrations_config: t.integrations ? JSON.stringify(t.integrations) : null,
                analytics_config: t.analytics ? JSON.stringify(t.analytics) : null,
                compliance_config: t.compliance ? JSON.stringify(t.compliance) : null,

                is_public: t.isPublic ? 1 : 0,
                usage_count: t.usageCount || 0,
                featured: t.featured ? 1 : 0,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            await db.insert('agent_templates').values(record);

            console.log(`[OK]   Seeded template: ${t.name} (${t.id})`);
            successCount++;
        } catch (err) {
            console.error(`[ERR]  Failed to seed ${template.name}:`, err);
        }
    }

    console.log('---');
    console.log(`Seeding complete. Inserted: ${successCount}, Skipped: ${skippedCount}`);
}

// Execute
seedTemplates().then(() => {
    process.exit(0);
}).catch(err => {
    console.error('Fatal error seeding templates:', err);
    process.exit(1);
});
