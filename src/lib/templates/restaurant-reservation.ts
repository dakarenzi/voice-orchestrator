
import type { AgentTemplate } from '$lib/types/template';

export const restaurantReservationTemplate: AgentTemplate = {
    id: "restaurant-reservation-001",
    name: "Restaurant Host AI",
    slug: "restaurant-reservation",
    category: "customer-support", // or operations
    industry: ["restaurant", "hospitality"],
    description: "Handles table reservations, large party inquiries, and menu questions",
    longDescription: `
    A 24/7 AI Host that answers the phone when your staff is busy.
    
    Capabilities:
    - Books tables via integration (OpenTable, Resy, or Custom)
    - Answers FAQ: "Do you have parking?", "Is there a corkage fee?"
    - Takes messages for large parties (10+)
    - Sends SMS confirmations
    
    Never miss a reservation call during service.
  `,
    complexity: "basic",
    featured: false,

    behavior: {
        goal: "Handle reservation requests and answer FAQ to free up staff",
        personality: {
            tone: "friendly",
            pacing: "moderate",
            verbosity: "concise",
            emotionalRange: "neutral"
        },
        systemPrompt: `You are the AI Host for {{restaurantName}}, a {{cuisineType}} restaurant.

    YOUR ROLE:
    - Answer phones professionally.
    - Check availability for table reservations.
    - Answer questions about the menu, parking, and dress code.
    - If party size > {{maxAutoBookSize}}, take a message for the manager.

    INFORMATION:
    - Location: {{address}}
    - Parking: {{parkingInfo}}
    - Corkage Fee: \${{corkageFee}}
    - Dress Code: {{dressCode}}

    AVAILABILITY LOGIC:
    - We are open {{openingHours}}.
    - Reservations generally limited to 90 minutes.
    
    Ideally, guide them to book via SMS link if the conversation gets complex.`,

        guardrails: {
            neverDiscuss: ["recipes", "owner personal info", "employee schedules"],
            alwaysEscalateTo: ["complaints about food poisoning", "press inquiries", "parties > 20"],
            complianceRules: [],
            offensiveLanguagePolicy: "terminate"
        },

        conversationFlow: {
            greeting: "Good evening, thank you for calling {{restaurantName}}. How can I help you?",

            mainLoop: [
                {
                    intent: "book_table",
                    response: "I can help with that. For how many people and what date?",
                    actions: ["check_availability"]
                },
                {
                    intent: "ask_menu",
                    response: "We serve {{cuisineType}}. Our most popular dishes are {{popularDishes}}. Would you like me to text you the full menu?",
                    actions: ["send_sms"]
                }
            ],

            closingLines: ["We look forward to seeing you!", "Have a great night."],
            fallbackResponses: ["Sorry, it's a bit loud in here. Could you say that again?"]
        }
    },

    channels: {
        voice: {
            enabled: true,
            inbound: { provider: "telnyx", greeting: "Thanks for calling {{restaurantName}}.", transferEnabled: true },
            outbound: { enabled: false, consentRequired: true }
        },
        chat: {
            enabled: true,
            webWidget: { position: "bottom-right", theme: "auto", welcomeMessage: "Book a table now!" },
            typing: { showTypingIndicator: true, responseDelayMs: 600 }
        },
        whatsapp: { enabled: true, businessProfile: { greeting: "Ready to book?", businessHours: null } },
        social: { twitter: { enabled: false }, discord: { enabled: false }, telegram: { enabled: false } }
    },

    voice: {
        provider: "elevenlabs",
        voiceId: "MF3mGyEYCl7XYWbV9V6O", // Polished host voice
        voicePreview: "",
        alternativeVoices: [],
        settings: { stability: 0.5, similarity: 0.7, speed: 1.0, pitch: 1.0 }, // Slightly higher pitch
        sttConfig: { provider: "deepgram", language: "en", model: "nova-2", punctuate: true, profanityFilter: false }
    },

    visual: {
        avatar: { type: "image", url: "https://cdn.voiceorchestrator.com/avatars/hostess.png", animation: "none" },
        branding: { primaryColor: "#111827", accentColor: "#F59E0B", logo: null }
    },

    knowledgeBase: {
        preSeededFAQs: [
            { question: "Do you have vegan options?", answer: "Yes, we have several vegan dishes including {{veganOptions}}." },
            { question: "Are you kid friendly?", answer: "Yes, we have a kids menu and high chairs available." }
        ],
        intents: [
            { name: "book_table", examples: ["table for 2", "reservation"] },
            { name: "cancel", examples: ["cancel my reservation"] },
            { name: "info", examples: ["parking", "menu", "hours"] }
        ],
        entities: [
            { name: "party_size", type: "regex", pattern: "\\d+" },
            { name: "reservation_time", type: "dynamic" }
        ],
        documents: { sampleDocs: [], requiredDocs: ["Menu PDF"] },
        vectorStore: { provider: "cloudflare-vectorize", preIndexed: false }
    },

    integrations: {
        custom: {
            webhookUrl: "https://api.opentable.com/...", // Mock
            apiEndpoints: [
                { name: "check_availability", method: "GET", url: "https://api.reservations.com/check" }
            ]
        }
    },

    analytics: {
        preConfiguredDashboard: {
            name: "Front of House",
            widgets: [
                { type: "metric", label: "Covers Booked", query: "sum(party_size)" }
            ]
        },
        kpis: [],
        alertThresholds: []
    },

    compliance: {
        dataRetention: { conversationLogs: 30, audioRecordings: 7, piiHandling: "mask" },
        certifications: [],
        consentFlow: { type: "implicit", message: "Calls recorded.", required: false }
    },

    customization: {
        required: [
            { key: "restaurantName", label: "Restaurant Name", type: "text" },
            { key: "cuisineType", label: "Cuisine", type: "text", placeholder: "Italian, Sushi, etc." },
            { key: "maxAutoBookSize", label: "Max Party Size for Auto-Book", type: "number", default: 8 }
        ],
        optional: [
            { key: "corkageFee", label: "Corkage Fee ($)", type: "number", default: 25 },
            { key: "dressCode", label: "Dress Code", type: "select", default: "Casual", helpText: "Casual, Smart Casual, Formal" }
        ],
        validation: []
    },

    testing: {
        testScenarios: [
            { name: "Dinner Reservation", steps: [{ user: "Table for 2 tonight at 7", expected: "check availability" }] },
            { name: "Large Party", steps: [{ user: "I have a party of 50", expected: "take message / escalate" }] }
        ],
        demoWebWidget: "https://demo.voiceorchestrator.com/restaurant"
    },

    deployment: {
        estimatedSetupTime: 10,
        prerequisites: ["Reservation System API"],
        postDeploymentChecklist: ["Test SMS confirmation"]
    },

    version: "1.0.0",
    changelog: [],
    deprecated: false
};
