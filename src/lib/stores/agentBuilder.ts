
import { writable } from 'svelte/store';
import type { Agent, AgentConfig } from '$lib/types';

const defaultConfig: AgentConfig = {
  voiceProvider: 'elevenlabs',
  voiceId: '21m00Tcm4TlvDq8ikWAM',
  sttProvider: 'deepgram',
  llmProvider: 'inworld',
  systemPrompt: 'You are a helpful and polite voice assistant.'
};

const defaultAgent: Partial<Agent> = {
  name: 'New Voice Agent',
  status: 'inactive',
  config: defaultConfig
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
    setAgent: (agent: Partial<Agent>) => update(s => ({ ...s, agent })),
    updateName: (name: string) => update(s => ({ ...s, agent: { ...s.agent, name } })),
    updateConfig: (key: keyof AgentConfig, value: any) => 
      update(s => ({ 
        ...s, 
        agent: { 
          ...s.agent, 
          config: { ...s.agent.config!, [key]: value } 
        } 
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
