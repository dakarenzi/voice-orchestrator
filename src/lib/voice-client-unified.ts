export class VoiceClientUnified {
    private ws: WebSocket | null = null;
    private audioContext: AudioContext | null = null;
    private mediaStream: MediaStream | null = null;
    private audioWorklet: AudioWorkletNode | null = null;
    private audioQueue: Uint8Array[] = [];
    private isPlaying = false;

    async connect(agentId: string): Promise<void> {
        // Determine the websocket URL based on environment
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        const host = window.location.host;
        // Assuming the voice pipeline is deployed at a specific path or subdomain, 
        // or proxying via the main app.
        // Given the user instructions, they deploy the worker separately. 
        // Usually this means a different domain or a specific route if routed via Cloudflare.
        // For now, I'll assume it's under /api/voice-session or similar if proxied, 
        // OR we need the actual worker URL.
        // The user example used: `wss://your-domain.com/voice/session?agentId=${agentId}`
        // I will use a relative path `/api/voice/session` assuming next.config proxies it or 
        // it's the same domain.
        // Wait, `voice-pipeline` is a separate worker. 
        // The user needs to configure the URL. I'll use a placeholder or env var if possible.
        // I'll stick to the user's example style but make it relative to current origin for now, 
        // or `wss://voice.your-domain.com` if they set it up that way.
        // I will use `/api/voice/session` and assume the user proxies it in `vite.config` or standard routing.
        // Actually, looking at `voice-router.ts`, it handles `/session`.
        // So the URL should be `wss://<worker-domain>/session`.
        // I'll leave it as a configurable arg or default to a reasonable path.

        // Changing to absolute path as per typical separate worker deployment
        // Users normally replace this with their actual worker domain
        const wsUrl = `wss://${window.location.host}/voice/session?agentId=${agentId}`;

        this.ws = new WebSocket(wsUrl);

        return new Promise((resolve, reject) => {
            this.ws!.addEventListener('open', () => {
                console.log('[VoiceClientUnified] Connected');
                this.ws!.send(JSON.stringify({
                    type: 'start_session',
                    agentId,
                }));
            });

            this.ws!.addEventListener('message', (event) => {
                const message = JSON.parse(event.data);
                this.handleMessage(message);

                if (message.type === 'session_started') {
                    resolve();
                }
            });

            this.ws!.addEventListener('error', (error) => {
                console.error('[VoiceClientUnified] Error:', error);
                reject(error);
            });
        });
    }

    async startListening(): Promise<void> {
        this.audioContext = new AudioContext({ sampleRate: 16000 });

        this.mediaStream = await navigator.mediaDevices.getUserMedia({
            audio: {
                channelCount: 1,
                sampleRate: 16000,
                echoCancellation: true,
                noiseSuppression: true,
                autoGainControl: true,
            },
        });

        const source = this.audioContext.createMediaStreamSource(this.mediaStream);

        // Use ScriptProcessor for compatibility (or AudioWorklet for better performance)
        const processor = this.audioContext.createScriptProcessor(4096, 1, 1);

        processor.onaudioprocess = (event) => {
            const inputData = event.inputBuffer.getChannelData(0);
            this.sendAudio(inputData);
        };

        source.connect(processor);
        processor.connect(this.audioContext.destination);
    }

    private sendAudio(audioData: Float32Array): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

        // Convert Float32 to Int16 (PCM16)
        const pcm16 = new Int16Array(audioData.length);
        for (let i = 0; i < audioData.length; i++) {
            const s = Math.max(-1, Math.min(1, audioData[i]));
            pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
        }

        // Convert to base64
        const bytes = new Uint8Array(pcm16.buffer);
        const base64 = btoa(String.fromCharCode(...bytes));

        this.ws.send(JSON.stringify({
            type: 'audio_chunk',
            audio: base64,
        }));
    }

    private handleMessage(message: any): void {
        switch (message.type) {
            case 'transcript':
                console.log(`[${message.isFinal ? 'FINAL' : 'interim'}] ${message.text}`);
                this.onTranscript?.(message.text, message.isFinal);
                break;

            case 'agent_speaking':
                console.log('[Agent]', message.text);
                this.onAgentResponse?.(message.text);
                break;

            case 'audio_chunk':
                this.queueAudio(message.audio);
                break;

            case 'audio_complete':
                console.log('[VoiceClientUnified] Audio playback complete');
                break;

            case 'session_ended':
                console.log('[VoiceClientUnified] Session stats:', message.stats);
                this.onSessionEnd?.(message.stats);
                break;

            case 'error':
                console.error('[VoiceClientUnified] Error:', message.message);
                this.onError?.(message.message);
                break;
        }
    }

    private queueAudio(base64Audio: string): void {
        // Decode base64 to PCM16
        const binaryString = atob(base64Audio);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        this.audioQueue.push(bytes);

        if (!this.isPlaying) {
            this.playQueuedAudio();
        }
    }

    private async playQueuedAudio(): Promise<void> {
        if (!this.audioContext || this.audioQueue.length === 0) return;

        this.isPlaying = true;

        while (this.audioQueue.length > 0) {
            const bytes = this.audioQueue.shift()!;

            // Convert PCM16 to Float32
            const pcm16 = new Int16Array(bytes.buffer);
            const float32 = new Float32Array(pcm16.length);
            for (let i = 0; i < pcm16.length; i++) {
                float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7FFF);
            }

            // Create and play audio buffer
            const buffer = this.audioContext.createBuffer(1, float32.length, 16000);
            buffer.copyToChannel(float32, 0);

            await new Promise<void>((resolve) => {
                const source = this.audioContext!.createBufferSource();
                source.buffer = buffer;
                source.connect(this.audioContext!.destination);
                source.onended = () => resolve();
                source.start();
            });
        }

        this.isPlaying = false;
    }

    interrupt(): void {
        // Clear audio queue and interrupt
        this.audioQueue = [];
        this.isPlaying = false;
        this.ws?.send(JSON.stringify({ type: 'interrupt' }));
    }

    disconnect(): void {
        this.ws?.send(JSON.stringify({ type: 'end_session' }));
        this.ws?.close();
        this.mediaStream?.getTracks().forEach(track => track.stop());
        this.audioContext?.close();
    }

    // Event handlers
    onTranscript?: (text: string, isFinal: boolean) => void;
    onAgentResponse?: (text: string) => void;
    onSessionEnd?: (stats: any) => void;
    onError?: (message: string) => void;
}
