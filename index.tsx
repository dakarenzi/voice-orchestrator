import React, { useState, useEffect, useMemo } from 'react';
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
  AlertCircle,
  X,
  Save,
  Search
} from 'lucide-react';

// --- Types (Mirroring Session 1 Architecture) ---

type AgentStatus = 'active' | 'inactive' | 'maintenance';

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

interface Conversation {
  id: string;
  agentId: string;
  agentName: string;
  channel: 'web' | 'phone';
  status: 'active' | 'completed' | 'failed';
  startedAt: number;
  durationSeconds: number;
}

// --- Mock Data & Services ---

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
  { id: 'c1', agentId: '1', agentName: 'Customer Support Bot', channel: 'web', status: 'completed', startedAt: Date.now() - 120000, durationSeconds: 245 },
  { id: 'c2', agentId: '1', agentName: 'Customer Support Bot', channel: 'phone', status: 'active', startedAt: Date.now() - 30000, durationSeconds: 30 },
  { id: 'c3', agentId: '2', agentName: 'Sales Representative', channel: 'web', status: 'failed', startedAt: Date.now() - 3600000, durationSeconds: 12 },
  { id: 'c4', agentId: '1', agentName: 'Customer Support Bot', channel: 'phone', status: 'completed', startedAt: Date.now() - 7200000, durationSeconds: 520 },
  { id: 'c5', agentId: '2', agentName: 'Sales Representative', channel: 'phone', status: 'completed', startedAt: Date.now() - 86400000, durationSeconds: 120 },
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

const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline', size?: 'sm' | 'md' | 'lg' }> = ({ 
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
    lg: "h-11 px-8"
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

const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse rounded-md bg-muted ${className}`} />
);

// --- Feature Views ---

const DashboardView: React.FC<{ agents: Agent[]; conversations: Conversation[]; isLoading: boolean }> = ({ agents, conversations, isLoading }) => {
  const activeCalls = conversations.filter(c => c.status === 'active').length;
  const totalConversations = conversations.length;
  const successRate = useMemo(() => {
    const completed = conversations.filter(c => c.status === 'completed').length;
    return totalConversations > 0 ? ((completed / totalConversations) * 100).toFixed(1) : '0.0';
  }, [conversations]);

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-32 w-full" />)}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Real-time overview of your voice agent fleet.</p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Total Agents</h3>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agents.length}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {agents.filter(a => a.status === 'active').length} active now
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Active Calls</h3>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500 flex items-center gap-2">
              {activeCalls > 0 && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
              )}
              {activeCalls}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Live sessions</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Conversations</h3>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConversations}</div>
            <p className="text-xs text-muted-foreground mt-1">Lifetime total</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-medium">Success Rate</h3>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{successRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">Completed calls</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & System Status */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-lg">Recent Activity</h3>
                <p className="text-sm text-muted-foreground">Latest conversations across all channels.</p>
              </div>
              <Button variant="ghost" size="sm"><History size={16} /></Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {conversations.slice(0, 5).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${item.status === 'active' ? 'bg-green-500' : item.status === 'completed' ? 'bg-blue-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="font-medium text-sm">{item.agentName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        {item.channel === 'web' ? <MessageSquare size={10} /> : <Phone size={10} />}
                        {new Date(item.startedAt).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{Math.floor(item.durationSeconds / 60)}m {item.durationSeconds % 60}s</p>
                    <Badge variant={item.status === 'active' ? 'success' : item.status === 'completed' ? 'default' : 'destructive'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <h3 className="font-semibold text-lg">System Status</h3>
            <p className="text-sm text-muted-foreground">Operational health of external services.</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { name: 'Deepgram STT', status: 'Operational', color: 'text-green-500' },
                { name: 'Inworld AI', status: 'Operational', color: 'text-green-500' },
                { name: 'ElevenLabs TTS', status: 'Operational', color: 'text-green-500' },
                { name: 'Cartesia TTS', status: 'Operational', color: 'text-green-500' },
                { name: 'Telnyx Voice', status: 'Degraded', color: 'text-yellow-500' },
              ].map((service, i) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                  <span className="text-sm font-medium">{service.name}</span>
                  <span className={`text-xs ${service.color} flex items-center gap-1.5`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${service.color.replace('text-', 'bg-')}`} />
                    {service.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const AgentsView: React.FC<{ agents: Agent[]; setAgents: React.Dispatch<React.SetStateAction<Agent[]>> }> = ({ agents, setAgents }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState<Partial<Agent>>({
    name: '',
    config: {
      voiceProvider: 'elevenlabs',
      voiceId: '',
      sttProvider: 'deepgram',
      llmProvider: 'inworld',
      systemPrompt: ''
    }
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newAgent: Agent = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name || 'New Agent',
      status: 'inactive',
      created_at: Date.now(),
      config: formData.config as AgentConfig
    };
    setAgents([...agents, newAgent]);
    setIsCreating(false);
    setFormData({ name: '', config: { voiceProvider: 'elevenlabs', voiceId: '', sttProvider: 'deepgram', llmProvider: 'inworld', systemPrompt: '' } });
  };

  const deleteAgent = (id: string) => {
    if (confirm('Are you sure you want to delete this agent?')) {
      setAgents(agents.filter(a => a.id !== id));
    }
  };

  if (isCreating) {
    return (
      <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">Create New Agent</h2>
            <p className="text-muted-foreground">Configure your agent's voice, brain, and personality.</p>
          </div>
          <Button variant="ghost" onClick={() => setIsCreating(false)}><X size={20} /></Button>
        </div>
        
        <Card>
          <form onSubmit={handleCreate}>
            <CardContent className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input 
                  id="name" 
                  placeholder="e.g. Sales Assistant" 
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  required 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Voice Provider</Label>
                  <Select 
                    value={formData.config?.voiceProvider}
                    onChange={e => setFormData({
                      ...formData, 
                      config: { ...formData.config!, voiceProvider: e.target.value as any }
                    })}
                  >
                    <option value="elevenlabs">ElevenLabs (High Quality)</option>
                    <option value="cartesia">Cartesia (Low Latency)</option>
                    <option value="google">Google TTS (Standard)</option>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Voice ID</Label>
                  <Input 
                    placeholder="Provider-specific Voice ID" 
                    value={formData.config?.voiceId}
                    onChange={e => setFormData({
                      ...formData, 
                      config: { ...formData.config!, voiceId: e.target.value }
                    })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>System Prompt (Personality)</Label>
                <textarea 
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  placeholder="You are a helpful assistant..."
                  value={formData.config?.systemPrompt}
                  onChange={e => setFormData({
                    ...formData, 
                    config: { ...formData.config!, systemPrompt: e.target.value }
                  })}
                  required
                />
              </div>
            </CardContent>
            <div className="flex justify-end gap-3 p-6 border-t bg-muted/20">
              <Button type="button" variant="ghost" onClick={() => setIsCreating(false)}>Cancel</Button>
              <Button type="submit">Create Agent</Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Agents</h2>
          <p className="text-muted-foreground mt-2">Manage your fleet of AI agents.</p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="gap-2">
          <Plus size={18} /> New Agent
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {agents.map(agent => (
          <Card key={agent.id} className="overflow-hidden hover:border-primary/50 transition-colors">
            <CardHeader className="bg-muted/30 pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-lg text-primary">
                    <Mic size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold">{agent.name}</h3>
                    <p className="text-xs text-muted-foreground">ID: {agent.id}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0"><MoreVertical size={16} /></Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Status</span>
                <Badge variant={agent.status === 'active' ? 'success' : 'default'}>{agent.status}</Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Voice</span>
                <span className="font-medium capitalize">{agent.config.voiceProvider}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">LLM</span>
                <span className="font-medium capitalize">{agent.config.llmProvider}</span>
              </div>
              <div className="pt-2 flex gap-2">
                <Button variant="outline" className="w-full text-xs">Test Voice</Button>
                <Button variant="outline" className="w-full text-xs" onClick={() => deleteAgent(agent.id)}>
                  <Trash2 size={14} className="mr-1" /> Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SettingsView: React.FC = () => {
  const [keys, setKeys] = useState({
    deepgram: '',
    elevenlabs: '',
    inworld: '',
    telnyx: ''
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Settings saved to local environment!');
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground mt-2">Configure external service connections and API keys.</p>
      </div>

      <Card>
        <form onSubmit={handleSave}>
          <CardHeader>
            <h3 className="text-lg font-medium">API Configuration</h3>
            <p className="text-sm text-muted-foreground">Enter your keys for the underlying AI services.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="deepgram">Deepgram API Key (STT)</Label>
              <div className="relative">
                <Input 
                  id="deepgram" 
                  type="password" 
                  value={keys.deepgram} 
                  onChange={e => setKeys({...keys, deepgram: e.target.value})}
                  placeholder="sk-..." 
                />
                <CheckCircle className="absolute right-3 top-2.5 text-green-500 w-4 h-4 opacity-0" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="inworld">Inworld API Key (LLM)</Label>
              <Input 
                id="inworld" 
                type="password" 
                value={keys.inworld}
                onChange={e => setKeys({...keys, inworld: e.target.value})}
                placeholder="key-..." 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="elevenlabs">ElevenLabs API Key (TTS)</Label>
              <Input 
                id="elevenlabs" 
                type="password" 
                value={keys.elevenlabs}
                onChange={e => setKeys({...keys, elevenlabs: e.target.value})}
                placeholder="xi-..." 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telnyx">Telnyx API Key (Telephony)</Label>
              <Input 
                id="telnyx" 
                type="password" 
                value={keys.telnyx}
                onChange={e => setKeys({...keys, telnyx: e.target.value})}
                placeholder="KEY..." 
              />
            </div>
          </CardContent>
          <div className="flex justify-end p-6 border-t bg-muted/20">
            <Button type="submit" className="gap-2">
              <Save size={16} /> Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

// --- Main Layout ---

const App = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);
  
  // State for data
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [conversations, setConversations] = useState<Conversation[]>(INITIAL_CONVERSATIONS);

  useEffect(() => {
    // Simulate initial data load
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background text-foreground transition-colors duration-300 font-sans">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background h-screen sticky top-0 px-4 py-6 z-20">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg">
            <Mic size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight">VoiceOrch</span>
        </div>

        <nav className="space-y-1 flex-1">
          <Button 
            variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'} 
            className={`w-full justify-start gap-3 ${activeTab === 'dashboard' ? 'font-semibold' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <LayoutDashboard size={18} />
            Dashboard
          </Button>
          <Button 
            variant={activeTab === 'agents' ? 'secondary' : 'ghost'} 
            className={`w-full justify-start gap-3 ${activeTab === 'agents' ? 'font-semibold' : ''}`}
            onClick={() => setActiveTab('agents')}
          >
            <Users size={18} />
            Agents
          </Button>
          <Button 
            variant={activeTab === 'settings' ? 'secondary' : 'ghost'} 
            className={`w-full justify-start gap-3 ${activeTab === 'settings' ? 'font-semibold' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={18} />
            Settings
          </Button>
        </nav>

        <div className="mt-auto border-t pt-4">
          <Button variant="ghost" className="w-full justify-start gap-3" onClick={toggleTheme}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </Button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden p-4 border-b flex justify-between items-center bg-background sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
            <Mic size={16} />
          </div>
          <span className="font-bold">VoiceOrchestrator</span>
        </div>
        <div className="flex gap-2">
           <Button variant="ghost" size="sm" onClick={() => setActiveTab('dashboard')}><LayoutDashboard size={20}/></Button>
           <Button variant="ghost" size="sm" onClick={() => setActiveTab('agents')}><Users size={20}/></Button>
           <Button variant="ghost" size="sm" onClick={toggleTheme}>
             {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 bg-muted/20 overflow-y-auto">
        {activeTab === 'dashboard' && <DashboardView agents={agents} conversations={conversations} isLoading={isLoading} />}
        {activeTab === 'agents' && <AgentsView agents={agents} setAgents={setAgents} />}
        {activeTab === 'settings' && <SettingsView />}
      </main>
    </div>
  );
};

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
