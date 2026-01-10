<script lang="ts">
    import {
        Mic,
        Phone,
        PhoneOff,
        Settings,
        Volume2,
        User,
        Bot,
        AlertCircle,
        MicOff,
    } from "lucide-svelte";
    import Button from "$lib/components/ui/Button.svelte";
    import Card from "$lib/components/ui/Card.svelte";
    import CardContent from "$lib/components/ui/CardContent.svelte";
    import Badge from "$lib/components/ui/Badge.svelte";

    let isCallActive = $state(false);
    let micMuted = $state(false);
    let connectionStatus = $state<"disconnected" | "connecting" | "connected">(
        "disconnected",
    );

    // Mock transcript
    let transcript = $state([{ role: "system", text: "Ready to connect." }]);

    function toggleCall() {
        if (isCallActive) {
            // End call
            connectionStatus = "disconnected";
            isCallActive = false;
            transcript.push({ role: "system", text: "Call ended." });
        } else {
            // Start call
            connectionStatus = "connecting";
            transcript.push({ role: "system", text: "Connecting to agent..." });

            setTimeout(() => {
                connectionStatus = "connected";
                isCallActive = true;
                transcript.push({
                    role: "agent",
                    text: "Hello! How can I help you today?",
                });
            }, 1500);
        }
    }

    function toggleMic() {
        micMuted = !micMuted;
    }
</script>

<div class="max-w-6xl mx-auto space-y-6 h-[calc(100vh-100px)] flex flex-col">
    <!-- Header -->
    <div class="flex justify-between items-center shrink-0">
        <div>
            <h2 class="text-3xl font-bold tracking-tight text-txt-primary">
                Studio
            </h2>
            <p class="text-txt-muted mt-2">Real-time testing environment.</p>
        </div>
        <div class="flex items-center gap-4">
            <div
                class="flex items-center gap-2 px-3 py-1.5 bg-bg-surface border border-brd-default rounded-full text-sm text-txt-primary"
            >
                <div
                    class={`w-2 h-2 rounded-full ${connectionStatus === "connected" ? "bg-status-success animate-pulse" : connectionStatus === "connecting" ? "bg-status-warning" : "bg-bg-surface-raised text-txt-muted"}`}
                ></div>
                <span class="capitalize">{connectionStatus}</span>
            </div>
            <Button variant="outline" size="icon"><Settings size={20} /></Button
            >
        </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 grow min-h-0">
        <!-- Main Visualizer Area -->
        <Card
            class="lg:col-span-2 flex flex-col border-0 shadow-lg bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative"
        >
            <div
                class="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"
            ></div>

            <div
                class="grow flex flex-col items-center justify-center relative z-10"
            >
                <!-- Visualizer Circle -->
                <div class="relative">
                    {#if connectionStatus === "connected"}
                        <div
                            class="absolute inset-0 bg-primary/20 blur-3xl animate-pulse rounded-full"
                        ></div>
                    {/if}
                    <div
                        class={`w-32 h-32 rounded-full border-4 flex items-center justify-center transition-all duration-500 ${isCallActive ? "border-acn-primary shadow-[0_0_30px_rgba(59,130,246,0.5)]" : "border-brd-default bg-bg-surface-raised/50"}`}
                    >
                        <Bot
                            size={48}
                            class={isCallActive
                                ? "text-primary"
                                : "text-slate-500"}
                        />
                    </div>
                </div>

                {#if isCallActive}
                    <div class="mt-8 flex gap-1 items-end h-8">
                        {#each Array(5) as _, i}
                            <div
                                class="w-1 bg-primary/80 rounded-full animate-bounce"
                                style={`height: ${Math.random() * 20 + 10}px; animation-delay: ${i * 0.1}s`}
                            ></div>
                        {/each}
                    </div>
                {/if}
            </div>

            <!-- Controls -->
            <div
                class="p-8 flex justify-center items-center gap-6 relative z-10 bg-slate-900/50 backdrop-blur-md border-t border-white/10"
            >
                <Button
                    variant="secondary"
                    size="icon"
                    class={`h-14 w-14 rounded-full transition-all ${micMuted ? "bg-red-500/20 text-red-500 hover:bg-red-500/30" : "bg-white/10 hover:bg-white/20"}`}
                    onclick={toggleMic}
                >
                    {#if micMuted}
                        <MicOff size={24} />
                    {:else}
                        <Mic size={24} />
                    {/if}
                </Button>

                <Button
                    variant={isCallActive ? "destructive" : "primary"}
                    size="lg"
                    class="h-16 px-8 rounded-full text-lg shadow-lg"
                    onclick={toggleCall}
                >
                    {#if isCallActive}
                        <PhoneOff size={24} class="mr-2" /> End Call
                    {:else}
                        <Phone size={24} class="mr-2" /> Start Call
                    {/if}
                </Button>

                <Button
                    variant="secondary"
                    size="icon"
                    class="h-14 w-14 rounded-full bg-white/10 hover:bg-white/20"
                >
                    <Volume2 size={24} />
                </Button>
            </div>
        </Card>

        <!-- Right Panel: Configurations & Transcript -->
        <div class="flex flex-col gap-6 min-h-0">
            <!-- Agent Config Summary -->
            <Card>
                <CardContent class="p-4 space-y-4">
                    <div class="flex items-center gap-3">
                        <div
                            class="h-10 w-10 rounded-full bg-acn-primary/10 flex items-center justify-center text-acn-primary"
                        >
                            <Bot size={20} />
                        </div>
                        <div>
                            <h3 class="font-bold text-txt-primary">
                                Customer Support Bot
                            </h3>
                            <p class="text-xs text-txt-muted">
                                Inworld • Sarah Voice
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <!-- Transcript -->
            <Card class="grow flex flex-col min-h-0">
                <div
                    class="p-4 border-b border-brd-default font-medium flex items-center gap-2 text-txt-primary"
                >
                    <span class="h-2 w-2 rounded-full bg-status-success"></span>
                    Live Transcript
                </div>
                <CardContent class="p-0 grow overflow-y-auto scrollbar-hide">
                    <div class="p-4 space-y-4">
                        {#each transcript as msg}
                            {#if msg.role === "system"}
                                <div class="flex justify-center">
                                    <Badge
                                        variant="outline"
                                        class="text-xs text-muted-foreground font-normal"
                                        >{msg.text}</Badge
                                    >
                                </div>
                            {:else}
                                <div
                                    class={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
                                >
                                    <div
                                        class={`h-8 w-8 rounded-full shrink-0 flex items-center justify-center ${msg.role === "user" ? "bg-acn-primary text-txt-inverse" : "bg-bg-surface-raised text-txt-primary"}`}
                                    >
                                        {#if msg.role === "user"}
                                            <User size={14} />
                                        {:else}
                                            <Bot size={14} />
                                        {/if}
                                    </div>
                                    <div
                                        class={`p-3 rounded-2xl text-sm max-w-[80%] ${msg.role === "user" ? "bg-acn-primary text-txt-inverse rounded-tr-sm" : "bg-bg-surface-raised text-txt-primary rounded-tl-sm"}`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            {/if}
                        {/each}
                    </div>
                </CardContent>
            </Card>
        </div>
    </div>
</div>
