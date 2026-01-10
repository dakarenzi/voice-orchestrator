
import type { AgentTemplate } from '$lib/types/template';

export const saasOnboardingTemplate: AgentTemplate = {
    id: "saas-onboarding-001",
    name: "SaaS Onboarding Specialist",
    slug: "saas-onboarding",
    category: "sales", // Could be sales or support, strictly "sales" based on category type
    industry: ["tech", "saas"],
    description: "Qualify leads, book demos, and guide new users through setup",
    longDescription: `
    An intelligent B2B assistant that engages website visitors to qualify sales leads and book demos with Account Executives.
    Also handles initial user onboarding questions to reduce churn.
    
    Capabilities:
    - BANT Qualification (Budget, Authority, Need, Time)
    - Schedule demos directly into HubSpot/Salesforce calendar
    - Answer technical product questions
    - Push qualified leads to CRM
  `,
    complexity: "intermediate",
    featured: true,

    behavior: {
        goal: "Qualify inbound leads and schedule demos for the sales team",
        personality: {
            tone: "professional",
            pacing: "fast", // Tech world moves fast
            verbosity: "concise",
            emotionalRange: "neutral"
        },
        systemPrompt: `You are {{agentName}}, a sales development representative (SDR) for {{companyName}}, a SaaS platform for {{solutionArea}}.

    YOUR GOAL:
    - Qualify leads by asking about their role, team size, and pain points.
    - If qualified (decision maker + budget), try to book a demo.
    - If technical support needed, guide them to documentation.

    QUALIFICATION CRITERIA:
    - Must be looking for a solution in {{solutionArea}}
    - Team size > {{minTeamSize}}
    
    KEY QUESTIONS TO ASK:
    1. "What challenge are you trying to solve today?"
    2. "How large is your team?"
    3. "Are you evaluating this for an immediate project?"

    If they ask about pricing, say plans start at \${{minPrice}} but enterprise options vary.
    
    Never be pushy. Be helpful and consultative.`,

        guardrails: {
            neverDiscuss: ["competitor features in detail", "roadmap promises", "discounts"],
            alwaysEscalateTo: ["security compliance questions", "enterprise pricing negotiation"],
            complianceRules: [
                { type: "GDPR", description: "Cookie/Tracking consent", action: "log_consent" }
            ],
            offensiveLanguagePolicy: "ignore"
        },

        conversationFlow: {
            greeting: "Hi there! Welcome to {{companyName}}. I'm {{agentName}}. Are you looking to improve your {{solutionArea}}?",

            mainLoop: [
                {
                    intent: "book_demo",
                    response: "I can definitely set up a demo for you. First, just a few quick questions to make sure we're a good fit.",
                    actions: ["start_qualification"]
                },
                {
                    intent: "pricing_inquiry",
                    response: "Our pricing starts at \${{minPrice}}/mo. For larger teams, we have custom enterprise plans. How many seats are you looking for?",
                    actions: []
                }
            ],

            closingLines: ["Thanks! Check your email for the calendar invite.", "Great chatting with you."],
            fallbackResponses: ["Could you clarify? I want to make sure I get you to the right team."]
        }
    },

    channels: {
        voice: { enabled: false, inbound: { provider: "twilio", greeting: "", transferEnabled: false }, outbound: { enabled: false, consentRequired: true } },
        chat: {
            enabled: true,
            webWidget: { position: "bottom-right", theme: "dark", welcomeMessage: "Hi! How can I help you scale?" },
            typing: { showTypingIndicator: true, responseDelayMs: 500 }
        },
        whatsapp: { enabled: false, businessProfile: { greeting: "", businessHours: null } },
        social: {
            twitter: { enabled: true }, // Engage on social
            discord: { enabled: false },
            telegram: { enabled: false }
        }
    },

    voice: {
        provider: "cartesia", // Very fast low latency
        voiceId: "tech-startup-male",
        voicePreview: "",
        alternativeVoices: [],
        settings: { stability: 0.5, similarity: 0.8, speed: 1.2, pitch: 0 },
        sttConfig: { provider: "deepgram", language: "en", model: "nova-2", punctuate: true, profanityFilter: false }
    },

    visual: {
        avatar: { type: "image", url: "https://cdn.voiceorchestrator.com/avatars/tech-sdr.png", animation: "none" },
        branding: { primaryColor: "#6366F1", accentColor: "#4F46E5", logo: null }
    },

    knowledgeBase: {
        preSeededFAQs: [
            { question: "Do you offer a free trial?", answer: "Yes, we offer a 14-day free trial with full feature access." },
            { question: "Does it integrate with Slack?", answer: "Yes, we have a native Slack integration." }
        ],
        intents: [
            { name: "book_demo", examples: ["schedule demo", "talk to sales"] },
            { name: "pricing", examples: ["how much", "cost", "enterprise plan"] }
        ],
        entities: [
            { name: "team_size", type: "regex", pattern: "\\d+" },
            { name: "company_email", type: "regex", pattern: "business_email" }
        ],
        documents: { sampleDocs: [], requiredDocs: ["Pricing Sheet", "Feature List"] },
        vectorStore: { provider: "pinecone", preIndexed: false }
    },

    integrations: {
        crm: {
            type: "hubspot",
            actions: [
                { name: "create_lead", trigger: "qualification_complete", mapping: { email: "{{email}}", score: "{{leadScore}}" } }
            ],
            fields: [{ agentField: "email", crmField: "email" }]
        },
        calendar: {
            type: "google",
            actions: [{ name: "schedule_demo", mapping: { attendee: "{{email}}" } }]
        },
        custom: { apiEndpoints: [] }
    },

    analytics: {
        preConfiguredDashboard: {
            name: "SDR Performance",
            widgets: [
                { type: "metric", label: "Demos Booked", query: "count(demo_booked)" },
                { type: "metric", label: "Lead Quality Score", query: "avg(lead_score)" }
            ]
        },
        kpis: [],
        alertThresholds: []
    },

    compliance: {
        dataRetention: { conversationLogs: 180, audioRecordings: 0, piiHandling: "mask" },
        certifications: ["SOC2"],
        consentFlow: { type: "implicit", message: "By chatting you agree to our privacy policy.", required: false }
    },

    customization: {
        required: [
            { key: "companyName", label: "Company Name", type: "text" },
            { key: "solutionArea", label: "Solution Area", type: "text", placeholder: "Project Management, HR, etc." },
            { key: "minPrice", label: "Starting Price", type: "number", default: 99 }
        ],
        optional: [
            { key: "minTeamSize", label: "Min Team Size to Qualify", type: "number", default: 5 }
        ],
        validation: []
    },

    testing: {
        testScenarios: [
            { name: "Qualified Lead", steps: [{ user: "I want a demo", expected: "qualify" }, { user: "We have 50 people", expected: "book demo" }] }
        ],
        demoWebWidget: "https://demo.voiceorchestrator.com/saas"
    },

    deployment: {
        estimatedSetupTime: 15,
        prerequisites: ["HubSpot Account", "Calendar Link"],
        postDeploymentChecklist: ["Test CRM sync"]
    },

    version: "1.0.0",
    changelog: [],
    deprecated: false
};
