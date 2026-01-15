
import { writable } from 'svelte/store';
import type { Agent, AgentConfig } from '$lib/types';

const defaultAgent: Partial<Agent> = {
  name: 'New Voice Agent',
  status: 'inactive',
  voiceProvider: 'elevenlabs',
  voiceId: '21m00Tcm4TlvDq8ikWAM',
  sttProvider: 'deepgram',
  llmProvider: 'inworld',
  systemPrompt: 'You are a helpful and polite voice assistant.',
  channels: ['web'],
  tools: []
};

function createBuilderStore() {
  const { subscribe, set, update } = writable<{
    agent: Partial<Agent>;
    selectedNode: 'identity' | 'channel' | 'stt' | 'llm' | 'tts' | null;
  }>({
    agent: JSON.parse(JSON.stringify(defaultAgent)),
    selectedNode: 'identity'
  });

  return {
    subscribe,
    setAgent: (agent: Partial<Agent>) => set({ agent, selectedNode: 'identity' }),
    updateName: (name: string) => update(s => ({ ...s, agent: { ...s.agent, name } })),
    // Generic update for flattened fields
    updateConfig: (key: keyof Agent, value: any) =>
      update(s => ({
        ...s,
        agent: { ...s.agent, [key]: value }
      })),
    selectNode: (node: 'identity' | 'channel' | 'stt' | 'llm' | 'tts' | null) =>
      update(s => ({ ...s, selectedNode: node })),
    reset: () => set({
      agent: JSON.parse(JSON.stringify(defaultAgent)),
      selectedNode: 'identity'
    })
  };
}

export const builderStore = createBuilderStore();
