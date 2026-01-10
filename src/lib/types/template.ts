
import type { Agent } from './index';

export const TEMPLATE_CATEGORIES = [
    'customer-support',
    'sales',
    'marketing',
    'operations',
    'hr',
    'other'
] as const;

export type TemplateCategory = typeof TEMPLATE_CATEGORIES[number];

export const INDUSTRIES = [
    'retail',
    'ecommerce',
    'd2c',
    'healthcare',
    'tech',
    'finance',
    'real-estate',
    'hospitality',
    'travel',
    'nonprofit',
    'automotive',
    'education',
    'legal',
    'saas',
    'restaurant',
    'medical',
    'dental',
    'wellness',
    'other'
] as const;

export type Industry = typeof INDUSTRIES[number];

export interface ComplianceRule {
    type: 'GDPR' | 'HIPAA' | 'PCI-DSS' | 'SOC2' | string;
    description: string;
    action: string;
}

export interface VerificationStep {
    field: string;
    prompt: string;
    validation: string;
    maxAttempts: number;
}

export interface ConversationNode {
    intent: string;
    response: string;
    actions?: string[];
}

export interface BusinessHours {
    timezone: string;
    schedule: Record<string, { start: string; end: string } | null>; // 'monday': {start: '09:00', end: '17:00'}
}

export interface FAQ {
    question: string;
    answer: string;
}

export interface Intent {
    name: string;
    examples: string[];
}

export interface Entity {
    name: string;
    pattern?: string;
    type?: 'dynamic' | 'regex' | 'list';
}

export interface IntegrationAction {
    name: string;
    trigger?: string;
    mapping?: Record<string, string>; // agentField -> externalField
    endpoint?: string;
    auth?: string;
    requiresApproval?: boolean;
    maxAmount?: number;
}

export interface FieldMapping {
    agentField: string;
    crmField: string;
}

export interface APIEndpoint {
    name: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    url: string;
    headers?: Record<string, string>;
}

export interface Dashboard {
    name: string;
    widgets: Array<{
        type: 'metric' | 'chart';
        label: string;
        query: string;
    }>;
}

export interface KPI {
    name: string;
    target: number;
    unit: string;
}

export interface AlertThreshold {
    metric: string;
    condition: string;
    action: string;
}

export interface ConsentFlow {
    type: 'opt-in' | 'opt-out' | 'implicit';
    message: string;
    required: boolean;
}

export interface CustomizationField {
    key: string;
    label: string;
    type: 'text' | 'number' | 'email' | 'schedule' | 'textarea' | 'select' | 'boolean';
    placeholder?: string;
    default?: any;
    min?: number;
    max?: number;
    helpText?: string;
    validation?: {
        minLength?: number;
        maxLength?: number;
    };
}

export interface ValidationRule {
    field: string;
    rule: string;
    errorMessage: string;
}

export interface TestScenario {
    name: string;
    steps: Array<{
        user: string;
        expected: string;
    }>;
}

export interface ChangelogEntry {
    version: string;
    date: string;
    changes: string;
}

export interface AgentTemplate {
    // Meta Information
    id: string;
    name: string;
    slug: string; // e.g., "ecommerce-support-voice"
    category: TemplateCategory;
    industry: Industry[];
    description: string;
    longDescription: string;
    thumbnail?: string;
    previewVideo?: string; // Demo video URL
    complexity: 'basic' | 'intermediate' | 'advanced';
    featured: boolean;

    // Pre-configured Agent Behavior
    behavior: {
        goal: string; // "Handle customer support inquiries and route complex issues"
        personality: {
            tone: 'professional' | 'friendly' | 'casual' | 'empathetic' | 'authoritative';
            pacing: 'fast' | 'moderate' | 'slow';
            verbosity: 'concise' | 'balanced' | 'detailed';
            emotionalRange: 'neutral' | 'expressive' | 'highly-expressive';
        };
        systemPrompt: string; // Full pre-written prompt with {{placeholders}}
        guardrails: {
            neverDiscuss: string[]; // ["pricing changes", "medical advice"]
            alwaysEscalateTo: string[]; // ["refunds over $500", "legal threats"]
            complianceRules: ComplianceRule[]; // GDPR, HIPAA, etc.
            offensiveLanguagePolicy: 'ignore' | 'warn' | 'terminate';
        };
        conversationFlow: {
            greeting: string; // "Hi! I'm {{agentName}} from {{companyName}}. How can I help?"
            verification?: VerificationStep[]; // ["email", "order_number"]
            mainLoop: ConversationNode[]; // Pre-built conversation tree
            closingLines: string[];
            fallbackResponses: string[];
        };
    };

    // Channel Configuration
    channels: {
        voice: {
            enabled: boolean;
            inbound: {
                provider: 'telnyx' | 'twilio' | string;
                greeting: string;
                holdMusic?: string;
                transferEnabled: boolean;
            };
            outbound: {
                enabled: boolean;
                callScript?: string | null;
                consentRequired: boolean;
            };
        };
        chat: {
            enabled: boolean;
            webWidget: {
                position: 'bottom-right' | 'bottom-left' | string;
                theme: 'light' | 'dark' | 'auto' | string;
                welcomeMessage: string;
            };
            typing: {
                showTypingIndicator: boolean;
                responseDelayMs: number; // Simulate human typing
            };
        };
        whatsapp: {
            enabled: boolean;
            businessProfile: {
                greeting: string;
                awayMessage?: string;
                businessHours?: BusinessHours | null;
            };
        };
        social: {
            twitter: { enabled: boolean };
            discord: { enabled: boolean };
            telegram: { enabled: boolean };
        };
    };

    // Voice & Audio Configuration
    voice: {
        provider: 'elevenlabs' | 'cartesia' | 'google' | 'inworld' | string;
        voiceId: string; // Pre-selected voice
        voicePreview: string; // Audio sample URL
        alternativeVoices: string[]; // User can swap
        settings: {
            stability: number; // 0-1
            similarity: number; // 0-1
            speed: number; // 0.5-2.0
            pitch: number; // -12 to +12 semitones
        };
        sttConfig: {
            provider: 'deepgram' | 'assemblyai' | string;
            language: string; // 'en-US'
            model: string; // 'nova-2'
            punctuate: boolean;
            profanityFilter: boolean;
        };
    };

    // Visual Identity
    visual: {
        avatar: {
            type: 'image' | 'waveform' | 'animated' | 'video';
            url?: string;
            color?: string; // For waveform
            animation?: 'pulse' | 'bounce' | 'wave' | string;
        };
        branding: {
            primaryColor: string;
            accentColor: string;
            logo?: string | null;
        };
    };

    // Knowledge Base (Pre-seeded)
    knowledgeBase: {
        preSeededFAQs: FAQ[]; // Industry-specific Q&As
        intents: Intent[]; // Pre-trained intents
        entities: Entity[]; // Recognized entities (product names, etc.)
        documents: {
            sampleDocs: string[]; // URLs to example docs
            requiredDocs: string[]; // What user must provide
        };
        vectorStore: {
            provider: 'cloudflare-vectorize' | 'pinecone' | string;
            preIndexed: boolean; // If pre-seeded FAQs are already embedded
        };
    };

    // Integrations (Pre-mapped)
    integrations: {
        crm?: {
            type: 'salesforce' | 'hubspot' | 'pipedrive' | 'custom' | string;
            actions: IntegrationAction[]; // Pre-defined: "create_ticket", "log_call"
            fields: FieldMapping[]; // Map agent data → CRM fields
        };
        helpdesk?: {
            type: 'zendesk' | 'intercom' | 'freshdesk' | string;
            actions: IntegrationAction[];
        };
        payment?: {
            type: 'stripe' | 'square' | string;
            actions: IntegrationAction[]; // "check_payment_status", "refund"
        };
        calendar?: {
            type: 'google' | 'outlook' | string;
            actions: IntegrationAction[]; // "book_appointment"
        };
        custom: {
            webhookUrl?: string | null;
            apiEndpoints?: APIEndpoint[];
        };
    };

    // Analytics & Reporting
    analytics: {
        preConfiguredDashboard: Dashboard;
        kpis: KPI[]; // Industry-specific metrics
        alertThresholds: AlertThreshold[];
    };

    // Compliance & Security
    compliance: {
        dataRetention: {
            conversationLogs: number; // days
            audioRecordings: number; // days
            piiHandling: 'mask' | 'encrypt' | 'delete' | string;
        };
        certifications: string[]; // ('GDPR' | 'HIPAA' | 'SOC2' | 'PCI-DSS')[]
        consentFlow?: ConsentFlow;
    };

    // User Customization Requirements
    customization: {
        required: CustomizationField[];
        optional: CustomizationField[];
        validation: ValidationRule[];
    };

    // Testing & Simulation
    testing: {
        testScenarios: TestScenario[]; // Pre-written test conversations
        demoPhoneNumber?: string; // Twilio test number
        demoWebWidget: string; // URL to live demo
    };

    // Deployment
    deployment: {
        estimatedSetupTime: number; // minutes
        prerequisites: string[];
        postDeploymentChecklist: string[];
    };

    // Versioning
    version: string;
    changelog: ChangelogEntry[];
    deprecated: boolean;

    // Compatibility fields for gradual migration (optional but helps avoid instant breaks)
    // These match the OLD schema but mapped from new data
    useCase: string;
    iconUrl?: string;
    usageCount?: number;
    toJSON?: () => any;
}
