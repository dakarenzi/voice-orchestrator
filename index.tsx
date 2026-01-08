
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LayoutDashboard, 
  Mic, 
  Settings, 
  Sun, 
  Moon, 
  Users, 
  Phone, 
  MessageSquare, 
  Activity,
  History,
  Plus,
  Trash2,
  MoreVertical,
  CheckCircle,
  X,
  Save,
  Play,
  Square,
  Clock,
  FileText,
  PhoneOff,
  MicOff,
  Download,
  Edit,
  AlertCircle
} from 'lucide-react';

// --- Types ---

type AgentStatus = 'active' | 'inactive' | 'maintenance';
type CallStatus = 'active' | 'completed' | 'failed';
type Speaker = 'user' | 'agent' | 'system';

interface AgentConfig {
  voiceProvider: 'elevenlabs' | 'cartesia' | 'google';
  voiceId: string;
  sttProvider: 'deepgram';
  llmProvider: 'inworld';
  systemPrompt: string;
}

interface Agent {
  id: string;
  name: string;
  config: AgentConfig;
  status: AgentStatus;
  created_at: number;
}

interface Message {
  id: string;
  speaker: Speaker;
  text: string;
  timestamp: number;
  isFinal?: boolean;
}

interface Conversation {
  id: string;
  agentId: string;
  agentName: string;
  channel: 'web' | 'phone';
  status: CallStatus;
  startedAt: number;
  durationSeconds: number;
  messages: Message[];
}

// --- Mock Data ---

const INITIAL_AGENTS: Agent[] = [
  {
    id: '1',
    name: 'Customer Support Bot',
    status: 'active',
    created_at: Date.now() - 86400000 * 10,
    config: {
      voiceProvider: 'elevenlabs',
      voiceId: 'ErXwobaYiN019PkySvjV',
      sttProvider: 'deepgram',
      llmProvider: 'inworld',
      systemPrompt: 'You are a helpful customer support agent for VoiceOrchestrator.'
    }
  },
  {
    id: '2',
    name: 'Sales Representative',
    status: 'inactive',
    created_at: Date.now() - 86400000 * 5,
    config: {
      voiceProvider: 'cartesia',
      voiceId: 'sales-voice-v1',
      sttProvider: 'deepgram',
      llmProvider: 'inworld',
      systemPrompt: 'You are an aggressive but polite sales representative.'
    }
  }
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  { 
    id: 'c1', agentId: '1', agentName: 'Customer Support Bot', channel: 'web', status: 'completed', startedAt: Date.now() - 120000, durationSeconds: 245,
    messages: [
      { id: 'm1', speaker: 'agent', text: 'Hello! How can I help you today?', timestamp: Date.now() - 120000 },
      { id: 'm2', speaker: 'user', text: 'I have a problem with my order.', timestamp: Date.now() - 115000 },
      { id: 'm3', speaker: 'agent', text: 'I can certainly help with that. What is your order number?', timestamp: Date.now() - 110000 }
    ]
  },
  { id: 'c2', agentId: '1', agentName: 'Customer Support Bot', channel: 'phone', status: 'active', startedAt: Date.now() - 30000, durationSeconds: 30, messages: [] },
  { id: 'c3', agentId: '2', agentName: 'Sales Representative', channel: 'web', status: 'failed', startedAt: Date.now() - 3600000, durationSeconds: 12, messages: [] },
  { id: 'c4', agentId: '1', agentName: 'Customer Support Bot', channel: 'phone', status: 'completed', startedAt: Date.now() - 7200000, durationSeconds: 520, messages: [] },
];

// --- UI Components ---

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`rounded-lg border bg-card text-card-foreground shadow-sm ${className}`}>
    {children}
  </div>
);

const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>
    {children}
  </div>
);

const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`p-6 pt-0 ${className}`}>
    {children}
  </div>
);

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline', size?: 'sm' | 'md' | 'lg' | 'icon' }> = ({ 
  children, variant = 'primary', size = 'md', className = '', ...props 
}) => {
  const baseClass = "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";
  
  const variants = {
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  };
  
  const sizes = {
    sm: "h-9 px-3",
    md: "h-10 px-4 py-2",
    lg: "h-11 px-8",
    icon: "h-10 w-10"
  };

  return (
    <button className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input 
    className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => (
  <textarea 
    className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    {...props}
  />
);

const Label: React.FC<{ children: React.ReactNode; htmlFor?: string; className?: string }> = ({ children, htmlFor, className = '' }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>
    {children}
  </label>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', children, ...props }) => (
  <div className="relative">
    <select 
      className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${className}`}
      {...props}
    >
      {children}
    </select>
    <div className="absolute right-3 top-3 pointer-events-none opacity-50">
      <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  </div>
);

const Badge: React.FC<{ children: React.ReactNode; variant?: 'default' | 'success' | 'warning' | 'destructive' | 'outline' }> = ({ children, variant = 'default' }) => {
  const variants = {
    default: "bg-primary text-primary-foreground",
    success: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/20 border",
    warning: "bg-yellow-500/15 text-yellow-700 dark:text-yellow-400 border-yellow-500/20 border",
    destructive: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20 border",
    outline: "text-foreground border"
  };
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]}`}>
      {children}
    </div>
  );
};

// --- Feature Components ---

const AgentsView: React.FC<{ 
  agents: Agent[]; 
  onSave: (agent: Agent) => void;
  onDelete: (id: string) => void;
}> = ({ agents, onSave, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentAgent, setCurrentAgent] = useState<Partial<Agent>>({});

  const handleEdit = (agent: Agent) => {
    setCurrentAgent({ ...agent });
    setIsEditing(true);
  };

  const handleCreate = () => {
    setCurrentAgent({
      id: crypto.randomUUID(),
      name: 'New Agent',
      status: 'inactive',
      created_at: Date.now(),
      config: {
        voiceProvider: 'elevenlabs',
        voiceId: '',
        sttProvider: 'deepgram',
        llmProvider: 'inworld',
        systemPrompt: 'You are a helpful assistant.'
      }
    });
    setIsEditing(true);
  };

  const saveAgent = () => {
    if (currentAgent.name && currentAgent.id) {
      onSave(currentAgent as Agent);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="max-w-3xl mx-auto animate-in fade-in zoom-in duration-300">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="outline" size="icon" onClick={() => setIsEditing(false)}>
            <X size={18} />
          </Button>
          <h2 className="text-2xl font-bold">{currentAgent.id ? 'Edit Agent' : 'Create Agent'}</h2>
        </div>

        <Card>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Agent Name</Label>
                <Input 
                  value={currentAgent.name} 
                  onChange={e => setCurrentAgent(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Support Bot"
                />
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select 
                  value={currentAgent.status} 
                  onChange={e => setCurrentAgent(p => ({ ...p, status: e.target.value as AgentStatus }))}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="maintenance">Maintenance</option>
                </Select>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Voice Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Voice Provider</Label>
                  <Select 
                    value={currentAgent.config?.voiceProvider} 
                    onChange={e => setCurrentAgent(p => ({ 
                      ...p, config: { ...p.config!, voiceProvider: e.target.value as any } 
                    }))}
                  >
                    <option value="elevenlabs">ElevenLabs</option>
                    <option value="cartesia">Cartesia</option>
                    <option value="google">Google Cloud TTS</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Voice ID</Label>
                  <Input 
                    value={currentAgent.config?.voiceId} 
                    onChange={e => setCurrentAgent(p => ({ 
                      ...p, config: { ...p.config!, voiceId: e.target.value } 
                    }))}
                    placeholder="Provider specific Voice ID"
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-4">Intelligence</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                   <Label>LLM Provider</Label>
                   <Select disabled value="inworld">
                     <option value="inworld">Inworld AI (Default)</option>
                   </Select>
                </div>
                <div className="space-y-2">
                  <Label>System Prompt</Label>
                  <Textarea 
                    className="h-32 font-mono text-sm"
                    value={currentAgent.config?.systemPrompt}
                    onChange={e => setCurrentAgent(p => ({ 
                      ...p, config: { ...p.config!, systemPrompt: e.target.value } 
                    }))}
                    placeholder="Define the agent's personality and instructions..."
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={saveAgent} className="gap-2">
                <Save size={16} /> Save Agent
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
          <p className="text-muted-foreground mt-2">Manage your fleet of voice AI agents.</p>
        </div>
        <Button onClick={handleCreate} className="gap-2">
          <Plus size={16} /> Create Agent
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => (
          <Card key={agent.id} className="group relative overflow-hidden transition-all hover:shadow-md">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div className="bg-primary/10 p-2.5 rounded-lg text-primary mb-3">
                  <Users size={24} />
                </div>
                <Badge variant={agent.status === 'active' ? 'success' : agent.status === 'maintenance' ? 'warning' : 'outline'}>
                  {agent.status}
                </Badge>
              </div>
              <h3 className="font-bold text-lg">{agent.name}</h3>
              <p className="text-xs text-muted-foreground">ID: {agent.id.substring(0, 8)}...</p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-2 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Mic size={14} /> {agent.config.voiceProvider}
                </div>
                <div className="flex items-center gap-2">
                  <Activity size={14} /> {agent.config.llmProvider}
                </div>
              </div>
              <div className="pt-4 border-t flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                 <Button variant="ghost" size="sm" onClick={() => onDelete(agent.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10">
                   <Trash2 size={16} />
                 </Button>
                 <Button variant="outline" size="sm" onClick={() => handleEdit(agent)} className="gap-2">
                   <Edit size={14} /> Configure
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        
        {/* Empty State Create Card */}
        <button 
          onClick={handleCreate}
          className="flex flex-col items-center justify-center rounded-lg border border-dashed hover:bg-accent/50 transition-colors h-full min-h-[250px] p-6 text-muted-foreground hover:text-foreground"
        >
          <div className="bg-muted p-4 rounded-full mb-4">
            <Plus size={24} />
          </div>
          <span className="font-medium">Deploy New Agent</span>
        </button>
      </div>
    </div>
  );
};

const SettingsView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-2">Platform configuration and status.</p>
      </div>

      <div className="grid gap-8">
        {/* Service Status */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Activity size={20} /> Service Integration Status
            </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Deepgram STT', status: 'operational', ping: '45ms' },
              { name: 'ElevenLabs TTS', status: 'operational', ping: '120ms' },
              { name: 'Cartesia TTS', status: 'operational', ping: '30ms' },
              { name: 'Inworld AI', status: 'operational', ping: '210ms' },
              { name: 'Telnyx Voice', status: 'degraded', ping: '500ms' },
            ].map((service) => (
              <div key={service.name} className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2.5 h-2.5 rounded-full ${service.status === 'operational' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                  <span className="font-medium">{service.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{service.ping}</span>
                  <Badge variant={service.status === 'operational' ? 'success' : 'warning'}>
                    {service.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Organization Config */}
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Settings size={20} /> Organization Configuration
            </h3>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Organization Name</Label>
                <Input defaultValue="Acme Corp Voice Team" />
              </div>
              <div className="space-y-2">
                <Label>Default Language</Label>
                <Select defaultValue="en-US">
                  <option value="en-US">English (US)</option>
                  <option value="en-GB">English (UK)</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
               <Label>Webhook Callback URL</Label>
               <div className="flex gap-2">
                 <Input readOnly value="https://api.voiceorchestrator.com/webhooks/telnyx" className="font-mono text-muted-foreground" />
                 <Button variant="outline">Copy</Button>
               </div>
               <p className="text-xs text-muted-foreground">Configure this URL in your Telnyx Mission Control Portal.</p>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
             <h3 className="text-lg font-semibold flex items-center gap-2">
               <AlertCircle size={20} /> Notification Preferences
             </h3>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Call Failure Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive emails when calls fail unexpectedly.</p>
              </div>
              <div className="h-6 w-11 bg-primary rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full transition-transform" />
              </div>
            </div>
            <div className="flex items-center justify-between border-t pt-4">
              <div className="space-y-0.5">
                <Label className="text-base">Daily Summary</Label>
                <p className="text-sm text-muted-foreground">Get a daily report of conversation metrics.</p>
              </div>
              <div className="h-6 w-11 bg-muted rounded-full relative cursor-pointer">
                <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full transition-transform" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex justify-end">
        <Button size="lg">Save All Changes</Button>
      </div>
    </div>
  );
};

const VoiceChatView: React.FC<{ agents: Agent[] }> = ({ agents }) => {
  const [selectedAgent, setSelectedAgent] = useState<string>(agents[0]?.id || '');
  const [sessionStatus, setSessionStatus] = useState<'idle' | 'connecting' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [messages, setMessages] = useState<Message[]>([]);
  const [duration, setDuration] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<number>();

  // --- Audio Visualizer Effect ---
  useEffect(() => {
    if (sessionStatus === 'idle') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    const draw = () => {
      const width = canvas.width;
      const height = canvas.height;
      ctx.clearRect(0, 0, width, height);

      // Draw Waveform
      ctx.lineWidth = 2;
      ctx.strokeStyle = sessionStatus === 'speaking' ? '#3b82f6' : '#22c55e'; // Blue for agent, Green for user
      ctx.beginPath();

      const sliceWidth = width * 1.0 / 50;
      let x = 0;

      for (let i = 0; i < 50; i++) {
        // Mock audio data logic
        const isActive = sessionStatus === 'listening' || sessionStatus === 'speaking';
        const v = isActive ? Math.random() * 0.5 + 0.25 : 0.5;
        const y = v * height;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);

        x += sliceWidth;
      }
      ctx.lineTo(canvas.width, canvas.height / 2);
      ctx.stroke();

      animationId = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(animationId);
  }, [sessionStatus]);

  // --- Timer Effect ---
  useEffect(() => {
    if (sessionStatus !== 'idle' && sessionStatus !== 'connecting') {
      timerRef.current = window.setInterval(() => setDuration(d => d + 1), 1000);
    } else {
      clearInterval(timerRef.current);
      if (sessionStatus === 'idle') setDuration(0);
    }
    return () => clearInterval(timerRef.current);
  }, [sessionStatus]);

  // --- Simulation Logic ---
  const startSession = () => {
    setSessionStatus('connecting');
    setMessages([]);
    
    setTimeout(() => {
      setSessionStatus('listening');
      addMessage('system', 'Session connected via WebSocket.');
      // Simulate Agent Greeting
      setTimeout(() => {
        setSessionStatus('speaking');
        addMessage('agent', "Hello! I'm " + (agents.find(a => a.id === selectedAgent)?.name || 'Agent') + ". How can I assist you?");
        setTimeout(() => setSessionStatus('listening'), 2500);
      }, 500);
    }, 1000);
  };

  const endSession = () => {
    setSessionStatus('idle');
    addMessage('system', 'Session ended.');
  };

  const addMessage = (speaker: Speaker, text: string) => {
    setMessages(prev => [...prev, { id: Math.random().toString(), speaker, text, timestamp: Date.now() }]);
  };

  // Simulate User Speaking Interaction
  const simulateUserSpeech = () => {
    if (sessionStatus !== 'listening') return;
    setSessionStatus('listening'); // Ensure visuals match
    
    // Simulate finding transcript after delay
    setTimeout(() => {
      addMessage('user', "I'd like to check the status of my order #12345.");
      setSessionStatus('thinking');
      
      // Agent Thinking...
      setTimeout(() => {
        setSessionStatus('speaking');
        addMessage('agent', "Let me check that for you... Okay, I see order #12345 is currently out for delivery.");
        setTimeout(() => setSessionStatus('listening'), 3000);
      }, 2000);
    }, 1500);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in duration-500 h-[calc(100vh-140px)]">
      {/* Controls & Config */}
      <div className="md:col-span-1 space-y-4">
        <Card className="h-full flex flex-col">
          <CardHeader>
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Settings size={18} /> Configuration
            </h3>
          </CardHeader>
          <CardContent className="space-y-6 flex-1">
             <div className="space-y-2">
               <Label>Select Agent</Label>
               <Select value={selectedAgent} onChange={e => setSelectedAgent(e.target.value)} disabled={sessionStatus !== 'idle'}>
                 {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
               </Select>
             </div>

             <div className="space-y-2">
               <Label>Input Device</Label>
               <Select disabled={sessionStatus !== 'idle'}>
                 <option>Default Microphone</option>
               </Select>
             </div>

             <div className="p-4 bg-muted/50 rounded-lg space-y-3">
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Status</span>
                 <Badge variant={
                   sessionStatus === 'idle' ? 'outline' : 
                   sessionStatus === 'connecting' ? 'warning' : 'success'
                 }>
                   {sessionStatus.toUpperCase()}
                 </Badge>
               </div>
               <div className="flex justify-between text-sm">
                 <span className="text-muted-foreground">Duration</span>
                 <span className="font-mono">{formatTime(duration)}</span>
               </div>
             </div>
          </CardContent>
          
          <div className="p-6 border-t mt-auto space-y-3">
             {sessionStatus === 'idle' ? (
               <Button className="w-full h-12 text-lg gap-2" onClick={startSession}>
                 <Mic size={20} /> Start Session
               </Button>
             ) : (
               <Button variant="destructive" className="w-full h-12 text-lg gap-2" onClick={endSession}>
                 <PhoneOff size={20} /> End Call
               </Button>
             )}
             
             {sessionStatus === 'listening' && (
               <Button variant="outline" className="w-full" onClick={simulateUserSpeech}>
                 <Play size={16} className="mr-2" /> Simulate Speech
               </Button>
             )}
          </div>
        </Card>
      </div>

      {/* Transcript & Visualizer */}
      <div className="md:col-span-2 flex flex-col gap-4 h-full">
        {/* Transcript Area */}
        <Card className="flex-1 overflow-hidden flex flex-col">
          <CardHeader className="pb-2 border-b">
             <h3 className="font-semibold flex items-center gap-2">
               <MessageSquare size={18} /> Live Transcript
             </h3>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
             {messages.length === 0 && (
               <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                 <Mic size={48} className="mb-2" />
                 <p>Start a session to begin transcription</p>
               </div>
             )}
             {messages.map((msg) => (
               <div key={msg.id} className={`flex ${msg.speaker === 'user' ? 'justify-end' : 'justify-start'}`}>
                 <div className={`max-w-[80%] rounded-lg p-3 ${
                   msg.speaker === 'user' 
                     ? 'bg-primary text-primary-foreground' 
                     : msg.speaker === 'system' 
                     ? 'bg-muted text-xs text-center w-full' 
                     : 'bg-secondary'
                 }`}>
                   {msg.speaker !== 'system' && <p className="text-xs opacity-70 mb-1 capitalize">{msg.speaker}</p>}
                   <p className="text-sm">{msg.text}</p>
                 </div>
               </div>
             ))}
             {sessionStatus === 'thinking' && (
               <div className="flex justify-start animate-pulse">
                 <div className="bg-secondary rounded-lg p-3">
                   <p className="text-sm text-muted-foreground">Thinking...</p>
                 </div>
               </div>
             )}
          </CardContent>
        </Card>

        {/* Audio Waveform */}
        <Card className="h-32 shrink-0 bg-black overflow-hidden relative">
           <canvas ref={canvasRef} className="w-full h-full" width={600} height={128} />
           <div className="absolute top-2 right-2 flex gap-2">
             {sessionStatus === 'listening' && <Badge variant="success" className="animate-pulse">Listening</Badge>}
             {sessionStatus === 'speaking' && <Badge className="bg-blue-500 animate-pulse">Speaking</Badge>}
           </div>
        </Card>
      </div>
    </div>
  );
};

const CallLogsView: React.FC<{ conversations: Conversation[] }> = ({ conversations }) => {
  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Call Logs</h2>
          <p className="text-muted-foreground mt-2">History of all inbound and outbound calls.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline"><Download size={16} className="mr-2"/> Export CSV</Button>
        </div>
      </div>

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 border-b">
              <tr>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Agent</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Channel</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Duration</th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Time</th>
                <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {conversations.map((call) => (
                <tr key={call.id} className="border-b transition-colors hover:bg-muted/50">
                  <td className="p-4 align-middle">
                    <Badge variant={call.status === 'active' ? 'success' : call.status === 'completed' ? 'default' : 'destructive'}>
                      {call.status}
                    </Badge>
                  </td>
                  <td className="p-4 align-middle font-medium">{call.agentName}</td>
                  <td className="p-4 align-middle flex items-center gap-2">
                    {call.channel === 'web' ? <Mic size={14} /> : <Phone size={14} />}
                    <span className="capitalize">{call.channel}</span>
                  </td>
                  <td className="p-4 align-middle">
                    {Math.floor(call.durationSeconds / 60)}m {call.durationSeconds % 60}s
                  </td>
                  <td className="p-4 align-middle text-muted-foreground">
                    {new Date(call.startedAt).toLocaleString()}
                  </td>
                  <td className="p-4 align-middle text-right">
                    <Button variant="ghost" size="icon"><FileText size={16} /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

const DashboardView: React.FC<{ agents: Agent[]; conversations: Conversation[]; isLoading: boolean }> = ({ agents, conversations, isLoading }) => {
  const activeCalls = conversations.filter(c => c.status === 'active').length;
  const totalConversations = conversations.length;
  const successRate = totalConversations > 0 ? ((conversations.filter(c => c.status === 'completed').length / totalConversations) * 100).toFixed(1) : '0.0';

  if(isLoading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Real-time overview of your voice agent fleet.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{agents.length}</div><p className="text-xs text-muted-foreground">Total Agents</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold text-green-500">{activeCalls}</div><p className="text-xs text-muted-foreground">Active Calls</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{totalConversations}</div><p className="text-xs text-muted-foreground">Total Conversations</p></CardContent></Card>
        <Card><CardContent className="pt-6"><div className="text-2xl font-bold">{successRate}%</div><p className="text-xs text-muted-foreground">Success Rate</p></CardContent></Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">Recent Activity</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversations.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-muted text-muted-foreground'}`}>
                      {c.channel === 'web' ? <Mic size={16} /> : <Phone size={16} />}
                    </div>
                    <div>
                       <p className="text-sm font-medium">{c.agentName}</p>
                       <p className="text-xs text-muted-foreground">{new Date(c.startedAt).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <Badge variant={c.status === 'active' ? 'success' : 'outline'}>{c.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <h3 className="font-semibold text-lg">Platform Health</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
               <div className="flex justify-between items-center">
                 <span className="text-sm font-medium">Deepgram STT</span>
                 <div className="flex items-center gap-2 text-xs text-green-600"><CheckCircle size={14}/> Operational</div>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm font-medium">Inworld AI</span>
                 <div className="flex items-center gap-2 text-xs text-green-600"><CheckCircle size={14}/> Operational</div>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-sm font-medium">ElevenLabs TTS</span>
                 <div className="flex items-center gap-2 text-xs text-green-600"><CheckCircle size={14}/> Operational</div>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- Main Layout ---

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('voice-chat'); // Default to Voice Chat for Session 2 testing
  const [isLoading, setIsLoading] = useState(false);
  
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);

  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // --- Actions ---
  const handleSaveAgent = (updatedAgent: Agent) => {
    setAgents(prev => {
      const idx = prev.findIndex(a => a.id === updatedAgent.id);
      if (idx >= 0) {
        const newAgents = [...prev];
        newAgents[idx] = updatedAgent;
        return newAgents;
      }
      return [...prev, updatedAgent];
    });
  };

  const handleDeleteAgent = (id: string) => {
    setAgents(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground transition-colors duration-300 font-sans">
      <aside className="hidden md:flex w-64 flex-col border-r bg-background h-screen sticky top-0 px-4 py-6 z-20">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Mic size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">VoiceOrch</span>
        </div>

        <nav className="space-y-1 flex-1">
          <Button variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('dashboard')}>
            <LayoutDashboard size={18} /> Dashboard
          </Button>
          <Button variant={activeTab === 'voice-chat' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('voice-chat')}>
            <Mic size={18} /> Voice Chat
          </Button>
           <Button variant={activeTab === 'call-logs' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('call-logs')}>
            <History size={18} /> Call Logs
          </Button>
          <Button variant={activeTab === 'agents' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('agents')}>
            <Users size={18} /> Agents
          </Button>
          <Button variant={activeTab === 'settings' ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab('settings')}>
            <Settings size={18} /> Settings
          </Button>
        </nav>

        <div className="mt-auto border-t pt-4">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-8 bg-muted/20 overflow-y-auto">
        {activeTab === 'dashboard' && <DashboardView agents={agents} conversations={conversations} isLoading={isLoading} />}
        {activeTab === 'voice-chat' && <VoiceChatView agents={agents} />}
        {activeTab === 'call-logs' && <CallLogsView conversations={conversations} />}
        {activeTab === 'agents' && <AgentsView agents={agents} onSave={handleSaveAgent} onDelete={handleDeleteAgent} />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
