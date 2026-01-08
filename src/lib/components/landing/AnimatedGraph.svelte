<script>
    import { onMount } from "svelte";
</script>

<div
    class="relative w-full h-[400px] md:h-[500px] flex items-center justify-center overflow-hidden"
>
    <!-- Background Grid -->
    <div
        class="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
    ></div>
    <div
        class="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent"
    ></div>

    <!-- Graph Visual -->
    <svg
        class="w-full h-full max-w-3xl"
        viewBox="0 0 800 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <!-- Definitions for gradients -->
        <defs>
            <linearGradient
                id="line-gradient"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="0%"
            >
                <stop
                    offset="0%"
                    stop-color="hsl(var(--primary))"
                    stop-opacity="0"
                />
                <stop
                    offset="50%"
                    stop-color="hsl(var(--primary))"
                    stop-opacity="1"
                />
                <stop
                    offset="100%"
                    stop-color="hsl(var(--secondary))"
                    stop-opacity="0"
                />
            </linearGradient>
            <marker
                id="orb-blue"
                viewBox="0 0 10 10"
                refX="5"
                refY="5"
                markerWidth="6"
                markerHeight="6"
            >
                <circle cx="5" cy="5" r="5" fill="hsl(var(--primary))" />
            </marker>
        </defs>

        <!-- Connecting Lines -->
        <g class="lines opacity-30">
            <!-- Central to Phone -->
            <path
                d="M400 200 L 200 100"
                stroke="url(#line-gradient)"
                stroke-width="2"
                class="animate-pulse-slow"
            />
            <!-- Central to Chat -->
            <path
                d="M400 200 L 600 100"
                stroke="url(#line-gradient)"
                stroke-width="2"
                class="animate-[pulse_3s_ease-in-out_infinite_100ms]"
            />
            <!-- Central to WhatsApp -->
            <path
                d="M400 200 L 200 300"
                stroke="url(#line-gradient)"
                stroke-width="2"
                class="animate-[pulse_4s_ease-in-out_infinite_200ms]"
            />
            <!-- Central to Twitter -->
            <path
                d="M400 200 L 600 300"
                stroke="url(#line-gradient)"
                stroke-width="2"
                class="animate-[pulse_5s_ease-in-out_infinite_300ms]"
            />
        </g>

        <!-- Data Pulses (simulated with circles moving along paths) -->
        <circle r="4" fill="hsl(var(--accent))" class="animate-travel-1">
            <animateMotion
                repeatCount="indefinite"
                dur="3s"
                path="M400 200 L 200 100"
            />
            <animate
                attributeName="opacity"
                values="0;1;0"
                dur="3s"
                repeatCount="indefinite"
            />
        </circle>
        <circle r="4" fill="hsl(var(--secondary))" class="animate-travel-2">
            <animateMotion
                repeatCount="indefinite"
                dur="4s"
                path="M400 200 L 600 300"
            />
            <animate
                attributeName="opacity"
                values="0;1;0"
                dur="4s"
                repeatCount="indefinite"
            />
        </circle>

        <!-- Nodes -->
        <!-- Central Node (Orchestrator) -->
        <g transform="translate(400, 200)">
            <circle
                r="40"
                fill="hsl(var(--background))"
                stroke="hsl(var(--primary))"
                stroke-width="2"
                class="animate-pulse shadow-glow"
            />
            <circle r="20" fill="hsl(var(--primary)/0.2)" />
            <text
                x="0"
                y="5"
                text-anchor="middle"
                fill="hsl(var(--foreground))"
                font-size="12"
                font-weight="bold"
                class="pointer-events-none select-none">HUB</text
            >
        </g>

        <!-- Phone Node -->
        <g
            transform="translate(200, 100)"
            class="delay-[800ms] animate-fade-in-up opacity-0"
        >
            <circle
                r="25"
                fill="hsl(var(--card))"
                stroke="hsl(var(--muted-foreground))"
                stroke-width="2"
            />
            <text
                x="0"
                y="5"
                text-anchor="middle"
                fill="hsl(var(--muted-foreground))"
                font-size="10">PHONE</text
            >
        </g>

        <!-- Chat Node -->
        <g
            transform="translate(600, 100)"
            class="delay-[900ms] animate-fade-in-up opacity-0"
        >
            <circle
                r="25"
                fill="hsl(var(--card))"
                stroke="hsl(var(--muted-foreground))"
                stroke-width="2"
            />
            <text
                x="0"
                y="5"
                text-anchor="middle"
                fill="hsl(var(--muted-foreground))"
                font-size="10">CHAT</text
            >
        </g>

        <!-- WhatsApp Node -->
        <g
            transform="translate(200, 300)"
            class="delay-[1000ms] animate-fade-in-up opacity-0"
        >
            <circle
                r="25"
                fill="hsl(var(--card))"
                stroke="hsl(var(--muted-foreground))"
                stroke-width="2"
            />
            <text
                x="0"
                y="5"
                text-anchor="middle"
                fill="hsl(var(--muted-foreground))"
                font-size="10">WHATSAPP</text
            >
        </g>

        <!-- Twitter Node -->
        <g
            transform="translate(600, 300)"
            class="delay-[1100ms] animate-fade-in-up opacity-0"
        >
            <circle
                r="25"
                fill="hsl(var(--card))"
                stroke="hsl(var(--muted-foreground))"
                stroke-width="2"
            />
            <text
                x="0"
                y="5"
                text-anchor="middle"
                fill="hsl(var(--muted-foreground))"
                font-size="10">SOCIAL</text
            >
        </g>
    </svg>
</div>

<style>
    /* Custom keyframes for dot movement are handled by animateMotion SVG, clean and performant */
    .shadow-glow {
        filter: drop-shadow(0 0 15px hsl(var(--primary) / 0.5));
    }
</style>
