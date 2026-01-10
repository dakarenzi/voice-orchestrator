
import type { AgentTemplate } from '$lib/types/template';

export const realEstateLeadTemplate: AgentTemplate = {
    id: "real-estate-lead-001",
    name: "Real Estate ISA (Inside Sales Agent)",
    slug: "real-estate-lead-qualification",
    category: "sales",
    industry: ["real-estate"],
    description: "24/7 lead qualification for buyers and sellers",
    longDescription: `
    A persistent and friendly Inside Sales Agent (ISA) that follows up with real estate leads instantly.
    
    Capabilities:
    - Speed to lead: Calls new leads within 2 minutes
    - Qualification: Determines Buyer vs Seller, Timeline, Budget, and Mortgage status
    - Appointment Setting: Books listing appointments or buyer consultations
    - Re-engagement: Follows up with old leads
    
    Integrates with Follow Up Boss, KvCore, and LionDesk.
  `,
    complexity: "intermediate",
    featured: true,

    behavior: {
        goal: "Qualify inbound real estate leads and book appointments for the agent",
        personality: {
            tone: "friendly",
            pacing: "moderate",
            verbosity: "balanced",
            emotionalRange: "expressive"
        },
        systemPrompt: `You are {{agentName}}, an assistant for {{brokerageName}}, working with {{realtorName}}.

    YOUR GOAL:
    - Contact new leads immediately to see if they are making a move.
    - Qualify them on: Location, Price, Timeline, and Motivation.
    - If valid, book a face-to-face or Zoom with {{realtorName}}.

    QUALIFICATION SCRIPT:
    1. "Saw you were looking at homes in {{targetArea}}. Are you looking to make a move soon?"
    2. "Are you currently renting or do you own a home you'd need to sell?"
    3. "what is your price range?"
    4. "Have you spoken with a lender yet?"

    CRITICAL RULES:
    - If they have an agent, politely end the call (ethics).
    - If they are "just looking", offers to send them market updates.
    - If motivated, push for the appointment: "Does tomorrow at 4pm work for a quick strategy call?"`,

        guardrails: {
            neverDiscuss: ["legal advice", "Fair Housing protected classes usage", "commission negotiation"],
            alwaysEscalateTo: ["motivated seller ready to list now", "angry homeowner"],
            complianceRules: [
                { type: "TCPA", description: "Respect Do Not Call / Opt-outs", action: "end_call_dnc" }
            ],
            offensiveLanguagePolicy: "ignore"
        },

        conversationFlow: {
            greeting: "Hi, this is {{agentName}} with {{brokerageName}}. I saw you checked out some properties on our site in {{targetArea}}.",

            mainLoop: [
                {
                    intent: "qualify_buyer",
                    response: "Great area! Are you looking to buy in the next 3-6 months, or just browsing?",
                    actions: ["log_timeline"]
                },
                {
                    intent: "book_consultation",
                    response: "The market is moving fast. I can have {{realtorName}} show you a few options this weekend. What time works best?",
                    actions: ["book_calendar"]
                }
            ],

            closingLines: ["Sounds good, I'll have {{realtorName}} reach out.", "Happy house hunting!"],
            fallbackResponses: ["Could you repeat that? I want to make sure I update your profile correctly."]
        }
    },

    channels: {
        voice: {
            enabled: true,
            inbound: { provider: "twilio", greeting: "Thanks for calling {{brokerageName}}.", transferEnabled: true },
            outbound: { enabled: true, callScript: "Hi {{leadName}}, this is {{agentName}}...", consentRequired: true }
        },
        chat: {
            enabled: false,
            webWidget: { position: "bottom-right", theme: "light", welcomeMessage: "" },
            typing: { showTypingIndicator: false, responseDelayMs: 0 }
        },
        whatsapp: { enabled: true, businessProfile: { greeting: "Hi! Saw you liked 123 Main St.", businessHours: null } },
        social: { twitter: { enabled: false }, discord: { enabled: false }, telegram: { enabled: false } }
    },

    voice: {
        provider: "elevenlabs",
        voiceId: "EXAVITQu4vr4xnSDxMaL", // Friendly female
        voicePreview: "",
        alternativeVoices: [],
        settings: { stability: 0.6, similarity: 0.8, speed: 1.05, pitch: 0 },
        sttConfig: { provider: "deepgram", language: "en", model: "nova-2", punctuate: true, profanityFilter: false }
    },

    visual: {
        avatar: { type: "image", url: "https://cdn.voiceorchestrator.com/avatars/realtor-assistant.png", animation: "pulse" },
        branding: { primaryColor: "#C2410C", accentColor: "#FFF7ED", logo: null }
    },

    knowledgeBase: {
        preSeededFAQs: [
            { question: "What is your commission?", answer: "Commission is negotiable and varies. {{realtorName}} can explain our value packages in person." },
            { question: "How's the market?", answer: "It's a {{marketType}} market right now. Inventory is {{inventoryLevel}}." }
        ],
        intents: [
            { name: "buying", examples: ["want to buy", "looking for home"] },
            { name: "selling", examples: ["sell my house", "home value"] },
            { name: "just_looking", examples: ["browsing", "curious"] }
        ],
        entities: [
            { name: "price_range", pattern: "\\d+(?:,\\d{3})*(?:k|m)?" },
            { name: "location", type: "dynamic" }
        ],
        documents: { sampleDocs: [], requiredDocs: [] },
        vectorStore: { provider: "cloudflare-vectorize", preIndexed: false }
    },

    integrations: {
        crm: {
            type: "custom", // FollowUpBoss via API
            actions: [
                { name: "update_lead", trigger: "qualification", mapping: { stage: "{{stage}}" } }
            ],
            fields: []
        },
        calendar: {
            type: "google",
            actions: [{ name: "book_consultation", mapping: { summary: "Consultation with {{leadName}}" } }]
        },
        custom: { apiEndpoints: [] }
    },

    analytics: {
        preConfiguredDashboard: {
            name: "ISA Performance",
            widgets: [
                { type: "metric", label: "Calls made", query: "count(outbound_calls)" },
                { type: "metric", label: "Appointments Set", query: "count(appointment_set)" }
            ]
        },
        kpis: [],
        alertThresholds: []
    },

    compliance: {
        dataRetention: { conversationLogs: 365, audioRecordings: 365, piiHandling: "encrypt" },
        certifications: [],
        consentFlow: { type: "implicit", message: "Calls recorded for training.", required: false }
    },

    customization: {
        required: [
            { key: "brokerageName", label: "Brokerage Name", type: "text" },
            { key: "realtorName", label: "Agent/Team Lead Name", type: "text" },
            { key: "targetArea", label: "Target City/Area", type: "text" }
        ],
        optional: [
            { key: "marketType", label: "Current Market Type", type: "select", default: "Seller's", helpText: "Seller's, Buyer's, or Balanced" }
        ],
        validation: []
    },

    testing: {
        testScenarios: [
            { name: "Motivated Buyer", steps: [{ user: "I need to move in 30 days", expected: "qualify + book" }] },
            { name: "Has an Agent", steps: [{ user: "I'm working with Jim from ReMax", expected: "polite exit" }] }
        ],
        demoWebWidget: "https://demo.voiceorchestrator.com/realestate"
    },

    deployment: {
        estimatedSetupTime: 20,
        prerequisites: ["Twilio Number", "CRM API Key"],
        postDeploymentChecklist: ["Verify lead routing"]
    },

    version: "1.0.0",
    changelog: [],
    deprecated: false
};
