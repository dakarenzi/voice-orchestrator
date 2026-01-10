
import { z } from "zod";

// --- Step 1: Business Info ---
export const businessInfoSchema = z.object({
    agentName: z.string().min(2, "Agent name must be at least 2 characters"),
    companyName: z.string().min(2, "Company name must be at least 2 characters"),
    industry: z.string().min(1, "Please select an industry"),
    useCase: z.string().optional(),
    supportEmail: z.string().email("Invalid email address").optional().or(z.literal("")),
    website: z.string().url("Invalid URL").optional().or(z.literal("")),
    targetAudience: z.string().optional()
});

// --- Step 2: Knowledge Base ---
export const knowledgeBaseSchema = z.object({
    faqs: z.array(z.object({
        question: z.string().min(3, "Question too short"),
        answer: z.string().min(3, "Answer too short")
    })).default([]),
    documents: z.array(z.string().url()).default([]), // URLs
    customInstructions: z.string().optional()
});

// --- Step 3: Integrations ---
// This is dynamic based on template, but we define common shapes
export const crmIntegrationSchema = z.object({
    provider: z.string(),
    apiKey: z.string().min(1, "API Key is required"),
    apiUrl: z.string().url().optional()
});

export const calendarIntegrationSchema = z.object({
    provider: z.string(),
    calendarId: z.string().optional(),
    authCode: z.string().optional() // For OAuth flow
});

// --- Step 4: Voice & Avatar ---
export const voiceConfigSchema = z.object({
    provider: z.string(),
    voiceId: z.string().min(1, "Voice selection is required"),
    speed: z.number().min(0.5).max(2.0).default(1.0),
    pitch: z.number().min(-12).max(12).default(0),
    stability: z.number().min(0).max(1).default(0.5)
});

// --- Combined Wizard Schema ---
export const wizardSchema = z.object({
    templateId: z.string(),
    step1: businessInfoSchema,
    step2: knowledgeBaseSchema,
    step3: z.object({
        crm: crmIntegrationSchema.optional(),
        calendar: calendarIntegrationSchema.optional()
    }).optional(),
    step4: voiceConfigSchema
});

export type WizardData = z.infer<typeof wizardSchema>;
