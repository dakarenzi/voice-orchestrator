<script lang="ts">
    import { VoiceClientUnified } from "$lib/voice-client-unified";
    import { onMount, onDestroy } from "svelte";
    import { Send } from "lucide-svelte";

    let {
        agentId,
        agentName,
        agentType = "chat",
    } = $props<{
        agentId: string;
        agentName: string;
        agentType?: "voice" | "chat";
    }>();

    let client: VoiceClientUnified | null = null;
    let messages = $state<
        Array<{ role: "user" | "agent"; text: string; timestamp: number }>
    >([]);
    let inputText = $state("");
    let isConnected = $state(false);
    let isListening = $state(false);
    let isSending = $state(false);
    let transcript = $state("");

    onMount(async () => {
        if (agentType === "voice") {
            await initVoiceClient();
        }
    });

    onDestroy(() => {
        client?.disconnect();
    });

    async function initVoiceClient() {
        client = new VoiceClientUnified();

        client.onTranscript = (text, isFinal) => {
            transcript = text;
            if (isFinal) {
                addMessage("user", text);
                transcript = "";
            }
        };

        client.onAgentResponse = (text) => {
            addMessage("agent", text);
        };

        client.onError = (message) => {
            console.error("Voice error:", message);
        };

        try {
            await client.connect(agentId);
            isConnected = true;
        } catch (e) {
            console.error("Failed to connect voice client:", e);
        }
    }

    async function toggleVoice() {
        if (!client) return;

        if (isListening) {
            client.interrupt();
            isListening = false;
        } else {
            await client.startListening();
            isListening = true;
        }
    }

    async function sendTextMessage() {
        if (!inputText.trim()) return;

        const text = inputText.trim();
        inputText = "";
        isSending = true;

        addMessage("user", text);

        try {
            const response = await fetch(`/api/agents/${agentId}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: text }),
            });

            const data = await response.json();
            addMessage("agent", data.response);
        } catch (error) {
            console.error("Chat error:", error);
            addMessage(
                "agent",
                "Sorry, I encountered an error. Please try again.",
            );
        } finally {
            isSending = false;
        }
    }

    function addMessage(role: "user" | "agent", text: string) {
        messages = [...messages, { role, text, timestamp: Date.now() }];

        // Auto-scroll to bottom
        setTimeout(() => {
            const container = document.querySelector(".messages-container");
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        }, 10);
    }

    function handleKeyPress(event: KeyboardEvent) {
        if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            sendTextMessage();
        }
    }
</script>

<div class="agent-preview">
    <div class="preview-header">
        <div class="agent-info">
            <div class="agent-avatar">
                {agentName[0]}
            </div>
            <div>
                <h3>{agentName}</h3>
                <p class="status">
                    {#if agentType === "voice"}
                        {isConnected
                            ? isListening
                                ? "🔴 Listening..."
                                : "✓ Connected"
                            : "⚪ Connecting..."}
                    {:else}
                        ✓ Ready to chat
                    {/if}
                </p>
            </div>
        </div>

        {#if agentType === "voice"}
            <button
                class="voice-toggle"
                class:active={isListening}
                onclick={toggleVoice}
                disabled={!isConnected}
            >
                {isListening ? "⏹️ Stop" : "🎤 Talk"}
            </button>
        {/if}
    </div>

    <div class="messages-container">
        {#if messages.length === 0}
            <div class="empty-state">
                <div class="empty-icon">💬</div>
                <h4>Start a conversation</h4>
                <p>
                    {#if agentType === "voice"}
                        Click the microphone to start talking
                    {:else}
                        Type a message below to chat with your agent
                    {/if}
                </p>
            </div>
        {:else}
            {#each messages as message}
                <div class="message {message.role}">
                    <div class="message-bubble">
                        {message.text}
                    </div>
                    <div class="message-time">
                        {new Date(message.timestamp).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </div>
                </div>
            {/each}
        {/if}

        {#if transcript}
            <div class="message user interim">
                <div class="message-bubble">
                    {transcript}
                    <span class="typing-indicator">...</span>
                </div>
            </div>
        {/if}

        {#if isSending}
            <div class="message agent">
                <div class="message-bubble typing">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        {/if}
    </div>

    {#if agentType === "chat"}
        <div class="input-container">
            <textarea
                bind:value={inputText}
                onkeypress={handleKeyPress}
                placeholder="Type your message..."
                rows="1"
                disabled={isSending}
            ></textarea>
            <button
                class="send-btn"
                onclick={sendTextMessage}
                disabled={!inputText.trim() || isSending}
            >
                <Send size={20} />
            </button>
        </div>
    {/if}
</div>

<style>
    .agent-preview {
        display: flex;
        flex-direction: column;
        height: 600px;
        width: 100%;
        max-width: 450px; /* Limit width */
        border: 1px solid #e5e5e5;
        border-radius: 12px;
        background: white;
        overflow: hidden;
        box-shadow:
            0 20px 25px -5px rgb(0 0 0 / 0.1),
            0 8px 10px -6px rgb(0 0 0 / 0.1);
    }

    .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.5rem;
        border-bottom: 1px solid #e5e5e5;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .agent-info {
        display: flex;
        align-items: center;
        gap: 1rem;
    }

    .agent-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.5rem;
        font-weight: 600;
    }

    .agent-info h3 {
        margin: 0;
        font-size: 1.125rem;
        font-weight: 600;
    }

    .status {
        margin: 0;
        font-size: 0.875rem;
        opacity: 0.9;
    }

    .voice-toggle {
        padding: 0.5rem 1rem;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.1);
        color: white;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
    }

    .voice-toggle:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.2);
        transform: translateY(-1px);
    }

    .voice-toggle.active {
        background: #ef4444;
        border-color: #ef4444;
        animation: pulse 2s infinite;
    }

    @keyframes pulse {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0.7;
        }
    }

    .messages-container {
        flex: 1;
        overflow-y: auto;
        padding: 1.5rem;
        background: #f9fafb;
        color: #1f2937; /* Ensure text matches light theme */
    }

    .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        text-align: center;
        color: #9ca3af;
    }

    .empty-icon {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .empty-state h4 {
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
        color: #6b7280;
    }

    .empty-state p {
        margin: 0;
        font-size: 0.875rem;
    }

    .message {
        margin-bottom: 1rem;
        display: flex;
        flex-direction: column;
    }

    .message.user {
        align-items: flex-end;
    }

    .message.agent {
        align-items: flex-start;
    }

    .message-bubble {
        max-width: 70%;
        padding: 0.75rem 1rem;
        border-radius: 12px;
        word-wrap: break-word;
    }

    .message.user .message-bubble {
        background: #3b82f6;
        color: white;
        border-bottom-right-radius: 4px;
    }

    .message.agent .message-bubble {
        background: white;
        color: #1f2937;
        border: 1px solid #e5e5e5;
        border-bottom-left-radius: 4px;
    }

    .message.interim .message-bubble {
        opacity: 0.6;
    }

    .message-time {
        font-size: 0.75rem;
        color: #9ca3af;
        margin-top: 0.25rem;
    }

    .typing-indicator {
        margin-left: 0.5rem;
        animation: blink 1s infinite;
    }

    @keyframes blink {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: 0;
        }
    }

    .message-bubble.typing {
        display: flex;
        gap: 0.25rem;
        padding: 1rem;
    }

    .message-bubble.typing span {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background: #9ca3af;
        animation: bounce 1.4s infinite ease-in-out both;
    }

    .message-bubble.typing span:nth-child(1) {
        animation-delay: -0.32s;
    }

    .message-bubble.typing span:nth-child(2) {
        animation-delay: -0.16s;
    }

    @keyframes bounce {
        0%,
        80%,
        100% {
            transform: scale(0);
        }
        40% {
            transform: scale(1);
        }
    }

    .input-container {
        display: flex;
        gap: 0.75rem;
        padding: 1rem 1.5rem;
        border-top: 1px solid #e5e5e5;
        background: white;
    }

    textarea {
        flex: 1;
        padding: 0.75rem;
        border: 1px solid #e5e5e5;
        border-radius: 8px;
        font-family: inherit;
        font-size: 0.875rem;
        resize: none;
        max-height: 120px;
        color: #1f2937;
    }

    textarea:focus {
        outline: none;
        border-color: #3b82f6;
    }

    .send-btn {
        width: 40px;
        height: 40px;
        border: none;
        border-radius: 8px;
        background: #3b82f6;
        color: white;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
    }

    .send-btn:hover:not(:disabled) {
        background: #2563eb;
        transform: translateY(-1px);
    }

    .send-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
</style>
