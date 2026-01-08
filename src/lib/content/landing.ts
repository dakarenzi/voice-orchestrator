export const landingContent = {
    nav: {
        links: [
            { label: 'Features', href: '#features' },
            { label: 'How It Works', href: '#how-it-works' },
            { label: 'Integrations', href: '#integrations' },
            { label: 'Pricing', href: '#pricing' }
        ]
    },
    hero: {
        eyebrow: "Powered by Cloudflare • Enterprise-Ready • Open API",
        headline: "Orchestrate AI Agents\nAcross Every Channel",
        subheadline: "Build voice and chat AI agents that work seamlessly across phone calls, web chat, WhatsApp, and social platforms.\nOne orchestration layer, infinite possibilities.",
        ctaPrimary: { text: "Launch Console", href: "/app" },
        ctaSecondary: { text: "Watch Demo", href: "#demo" }
    },
    features: {
        headline: "Multi-Channel AI Orchestration",
        subheadline: "Deploy once, run everywhere. Our platform handles the complexity of voice and chat protocols so you can focus on agent logic.",
        cards: [
            {
                icon: "phone",
                headline: "Inbound & Outbound Calls",
                body: "Handle voice calls with real-time STT via Deepgram, intelligent responses from Inworld, and natural TTS from ElevenLabs or Cartesia.",
                badge: "< 2s latency"
            },
            {
                icon: "message-square",
                headline: "Interactive Chat Interfaces",
                body: "Deploy conversational AI agents on your website with WebSocket streaming, live transcripts, and audio playback.",
                badge: "Real-time"
            },
            {
                icon: "share-2",
                headline: "Social Platform Integration",
                body: "Respond to WhatsApp Business messages, Twitter DMs, and Discord mentions with consistent AI personas.",
                badge: "Multi-tenant"
            }
        ]
    },
    howItWorks: {
        headline: "How It Works",
        steps: [
            { icon: "zap", title: "Trigger", description: "Inbound Event" },
            { icon: "mic", title: "Transcribe", description: "Speech-to-Text" },
            { icon: "sparkles", title: "Process", description: "LLM Response" },
            { icon: "volume-2", title: "Respond", description: "Text-to-Speech" }
        ],
        codeSnippet: `// Example: Handle inbound call
const agent = await loadAgent(phoneNumber);
const transcript = await deepgram.transcribe(audioStream);
const response = await inworld.chat(agent.id, transcript);
const audio = await elevenlabs.synthesize(response.text);`
    },
    integrations: {
        headline: "Seamless Integrations",
        partners: [
            { name: "Deepgram", category: "Speech-to-Text", logo: "/logos/deepgram.svg" }, // Placeholders
            { name: "Inworld AI", category: "LLM", logo: "/logos/inworld.svg" },
            { name: "ElevenLabs", category: "Text-to-Speech", logo: "/logos/elevenlabs.svg" },
            { name: "Cartesia", category: "Fast TTS", logo: "/logos/cartesia.svg" },
            { name: "Google Cloud", category: "Cloud Services", logo: "/logos/google.svg" },
            { name: "Telnyx", category: "Telephony", logo: "/logos/telnyx.svg" },
            { name: "Cloudflare", category: "Infrastructure", logo: "/logos/cloudflare.svg" },
            { name: "OpenAI", category: "LLM", logo: "/logos/openai.svg" }
        ]
    },
    metrics: [
        { value: "< 2s", label: "Latency", description: "From speech input to AI response" },
        { value: "99.9%", label: "Uptime", description: "Cloudflare global edge network" },
        { value: "Auto-Scaling", label: "Concurrency", description: "Handle 1 to 100,000 concurrent calls" }
    ],
    pricing: {
        headline: "Simple, Transparent Pricing",
        tiers: [
            {
                name: "Developer",
                price: "Free",
                features: ["1,000 calls/mo", "Community Support", "1 Agent"],
                cta: "Start Free",
                highlight: false
            },
            {
                name: "Professional",
                price: "$99/mo",
                features: ["50,000 calls/mo", "Priority Support", "Unlimited Agents", "Custom Voices"],
                cta: "Get Started",
                highlight: true
            },
            {
                name: "Enterprise",
                price: "Custom",
                features: ["Unlimited calls", "Dedicated Support", "SLA", "Private Cloud"],
                cta: "Contact Sales",
                highlight: false
            }
        ]
    },
    finalCta: {
        headline: "Ready to Build?",
        subheadline: "Deploy your first AI agent in minutes",
        cta: "Get Started Free",
        finePrint: "No credit card required • 1,000 free calls"
    },
    footer: {
        columns: [
            {
                title: "Product",
                links: [
                    { label: "Features", href: "#features" },
                    { label: "Pricing", href: "#pricing" },
                    { label: "Docs", href: "https://docs.voiceorchestrator.com" },
                    { label: "Changelog", href: "/changelog" }
                ]
            },
            {
                title: "Company",
                links: [
                    { label: "About", href: "/about" },
                    { label: "Blog", href: "/blog" },
                    { label: "Careers", href: "/careers" },
                    { label: "Contact", href: "/contact" }
                ]
            },
            {
                title: "Resources",
                links: [
                    { label: "API Reference", href: "/docs/api" },
                    { label: "Guides", href: "/docs/guides" },
                    { label: "Status", href: "/status" },
                    { label: "GitHub", href: "https://github.com" }
                ]
            },
            {
                title: "Legal",
                links: [
                    { label: "Terms", href: "/terms" },
                    { label: "Privacy", href: "/privacy" },
                    { label: "Security", href: "/security" },
                    { label: "Compliance", href: "/compliance" }
                ]
            }
        ]
    }
}
