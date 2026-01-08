
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  LayoutDashboard, Mic, Settings, Sun, Moon, Users, Phone, MessageSquare, 
  Activity, History, Plus, Trash2, CheckCircle, X, Save, Play, PhoneOff, 
  Download, Edit, AlertCircle, Globe, BarChart3, ArrowRight, Brain, Volume2, 
  Database, RefreshCw, Layers, Clock
} from 'lucide-react';
import { Chart } from 'react-chartjs-2';

// Import i18n
import { I18nProvider, useI18n } from './src/lib/i18n/context';

// --- Toast System ---
const ToastContext = React.createContext<{ addToast: (msg: string, type: 'success' | 'error') => void }>({ addToast: () => {} });

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<{ id: string; msg: string; type: 'success' | 'error' }[]>([]);

  const addToast = (msg: string, type: 'success' | 'error') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(t => (
          <div key={t.id} className={`p-4 rounded-lg shadow-lg text-white flex items-center gap-2 animate-in slide-in-from-right ${t.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
            {t.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {t.msg}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const useToast = () => React.useContext(ToastContext);

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
      systemPrompt: 'You are a helpful customer support agent.'
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
      systemPrompt: 'You are an aggressive sales representative.'
    }
  }
];

const INITIAL_CONVERSATIONS: Conversation[] = [
  { 
    id: 'c1', agentId: '1', agentName: 'Customer Support Bot', channel: 'web', status: 'completed', startedAt: Date.now() - 120000, durationSeconds: 245,
    messages: []
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
  const sizes = { sm: "h-9 px-3", md: "h-10 px-4 py-2", lg: "h-11 px-8", icon: "h-10 w-10" };
  return <button className={`${baseClass} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>{children}</button>;
};

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className = '', ...props }) => (
  <input className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
);

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className = '', ...props }) => (
  <textarea className={`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props} />
);

const Label: React.FC<{ children: React.ReactNode; htmlFor?: string; className?: string }> = ({ children, htmlFor, className = '' }) => (
  <label htmlFor={htmlFor} className={`text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${className}`}>{children}</label>
);

const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = ({ className = '', children, ...props }) => (
  <div className="relative">
    <select className={`flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none ${className}`} {...props}>{children}</select>
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
  return <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${variants[variant]}`}>{children}</div>;
};

// --- Agent Builder (Drag-and-Drop Concept) ---

const AgentBuilder: React.FC<{ 
  onSave: (agent: Agent) => void;
  onCancel: () => void;
  initialAgent?: Partial<Agent>;
}> = ({ onSave, onCancel, initialAgent }) => {
  const { addToast } = useToast();
  const [step, setStep] = useState(1);
  const [config, setConfig] = useState<Partial<Agent>>(initialAgent || {
    id: crypto.randomUUID(),
    name: '',
    status: 'inactive',
    created_at: Date.now(),
    config: {
      voiceProvider: 'elevenlabs',
      voiceId: '',
      sttProvider: 'deepgram',
      llmProvider: 'inworld',
      systemPrompt: ''
    }
  });

  const steps = [
    { id: 1, title: 'Basics', icon: Users },
    { id: 2, title: 'Input (STT)', icon: Mic },
    { id: 3, title: 'Brain (LLM)', icon: Brain },
    { id: 4, title: 'Output (TTS)', icon: Volume2 },
  ];

  const handleSave = () => {
    if (!config.name) return addToast('Name is required', 'error');
    onSave(config as Agent);
    addToast('Agent saved successfully', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col animate-in fade-in zoom-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onCancel}><X size={18}/></Button>
          <h2 className="text-2xl font-bold">{config.id ? 'Edit Agent Pipeline' : 'Create Agent Pipeline'}</h2>
        </div>
        <div className="flex gap-2">
          {step > 1 && <Button variant="outline" onClick={() => setStep(s => s - 1)}>Previous</Button>}
          {step < 4 ? (
            <Button onClick={() => setStep(s => s + 1)}>Next</Button>
          ) : (
            <Button onClick={handleSave} className="gap-2"><Save size={16}/> Save Agent</Button>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        {steps.map((s) => (
          <div 
            key={s.id} 
            className={`flex-1 p-4 rounded-lg border-2 transition-all cursor-pointer flex items-center gap-3 ${
              step === s.id ? 'border-primary bg-primary/5' : 
              step > s.id ? 'border-green-500 bg-green-500/5' : 'border-muted'
            }`}
            onClick={() => setStep(s.id)}
          >
            <div className={`p-2 rounded-full ${step === s.id ? 'bg-primary text-primary-foreground' : step > s.id ? 'bg-green-500 text-white' : 'bg-muted'}`}>
              {step > s.id ? <CheckCircle size={16} /> : <s.icon size={16} />}
            </div>
            <span className="font-medium">{s.title}</span>
          </div>
        ))}
      </div>

      <Card className="flex-1 p-8">
        {step === 1 && (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Agent Identity</h3>
            <div className="space-y-2">
              <Label>Agent Name</Label>
              <Input 
                value={config.name} 
                onChange={e => setConfig(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Sales Assistant"
              />
            </div>
            <div className="space-y-2">
              <Label>Initial Status</Label>
              <Select 
                value={config.status} 
                onChange={e => setConfig(p => ({ ...p, status: e.target.value as AgentStatus }))}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="maintenance">Maintenance</option>
              </Select>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6 max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Speech Recognition (Input)</h3>
            <div className="p-4 border rounded-lg bg-card/50 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-lg text-blue-700"><Mic size={24}/></div>
              <div>
                <h4 className="font-medium">Deepgram Nova-2</h4>
                <p className="text-sm text-muted-foreground">High-performance real-time transcription.</p>
              </div>
              <CheckCircle size={20} className="ml-auto text-green-500" />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">Intelligence (LLM)</h3>
            <div className="space-y-2">
              <Label>Provider</Label>
              <Select disabled value="inworld"><option>Inworld AI</option></Select>
            </div>
            <div className="space-y-2">
              <Label>System Prompt</Label>
              <Textarea 
                className="h-48 font-mono"
                value={config.config?.systemPrompt}
                onChange={e => setConfig(p => ({ 
                  ...p, config: { ...p.config!, systemPrompt: e.target.value } 
                }))}
                placeholder="You are a helpful assistant..."
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4 max-w-lg">
            <h3 className="text-lg font-semibold mb-4">Voice Synthesis (Output)</h3>
            <div className="space-y-2">
              <Label>Voice Provider</Label>
              <Select 
                value={config.config?.voiceProvider} 
                onChange={e => setConfig(p => ({ 
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
                value={config.config?.voiceId} 
                onChange={e => setConfig(p => ({ 
                  ...p, config: { ...p.config!, voiceId: e.target.value } 
                }))}
                placeholder="Voice ID"
              />
            </div>
            <Button variant="outline" className="w-full gap-2 mt-4">
              <Play size={16}/> Test Voice Preview
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

// --- Analytics View ---

const AnalyticsView: React.FC = () => {
  // Chart Data
  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Calls',
        data: [12, 19, 3, 5, 2, 3, 15],
        fill: false,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        borderColor: 'rgb(59, 130, 246)',
      },
    ],
  };
  
  const pieData = {
    labels: ['Web', 'Phone', 'WhatsApp'],
    datasets: [
      {
        data: [12, 19, 3],
        backgroundColor: [
          'rgba(59, 130, 246, 0.8)',
          'rgba(16, 185, 129, 0.8)',
          'rgba(245, 158, 11, 0.8)',
        ],
      },
    ],
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground mt-2">Deep dive into conversation metrics.</p>
        </div>
        <div className="flex gap-2">
          <Select className="w-40"><option>Last 7 Days</option><option>Last 30 Days</option></Select>
          <Button variant="outline"><Download size={16} className="mr-2"/> Export</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Call Volume</h3>
          <div className="h-64 flex items-center justify-center">
             {/* Chart.js would render here, fallback for preview */}
             <Chart type='line' data={data} />
          </div>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-6">Channel Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <div className="w-1/2">
              <Chart type='doughnut' data={pieData} />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader><h3 className="text-lg font-semibold">Detailed Call Metrics</h3></CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="pb-3 font-medium text-muted-foreground">Metric</th>
                <th className="pb-3 font-medium text-muted-foreground">Value</th>
                <th className="pb-3 font-medium text-muted-foreground">Change</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              <tr><td className="py-3">Avg. Duration</td><td className="py-3">4m 12s</td><td className="py-3 text-green-500">+12%</td></tr>
              <tr><td className="py-3">Sentiment Score</td><td className="py-3">8.4/10</td><td className="py-3 text-green-500">+5%</td></tr>
              <tr><td className="py-3">User Interruptions</td><td className="py-3">2.1 avg</td><td className="py-3 text-red-500">+0.5</td></tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Updated Dashboard View ---

const DashboardView: React.FC<{ agents: Agent[]; conversations: Conversation[] }> = ({ agents, conversations }) => {
  const { t } = useI18n();
  const activeCalls = conversations.filter(c => c.status === 'active').length;

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('dashboard.title')}</h1>
        <p className="text-muted-foreground mt-2">{t('dashboard.subtitle')}</p>
      </div>
      
      {/* Metric Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('dashboard.activeCalls')}</p>
              <div className="text-2xl font-bold text-green-500 mt-2">{activeCalls}</div>
            </div>
            <div className="p-3 bg-green-100 text-green-600 rounded-full"><Phone size={24}/></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('dashboard.totalAgents')}</p>
              <div className="text-2xl font-bold mt-2">{agents.length}</div>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-full"><Users size={24}/></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Conversations (24h)</p>
              <div className="text-2xl font-bold mt-2">142</div>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-full"><MessageSquare size={24}/></div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">{t('dashboard.successRate')}</p>
              <div className="text-2xl font-bold mt-2">94.2%</div>
            </div>
            <div className="p-3 bg-orange-100 text-orange-600 rounded-full"><Activity size={24}/></div>
          </CardContent>
        </Card>
      </div>

      {/* Live Feed & Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="font-semibold text-lg flex items-center gap-2"><Layers size={18}/> Live Conversation Feed</h3>
          </CardHeader>
          <CardContent>
             <div className="space-y-4">
              {conversations.slice(0, 5).map((c) => (
                <div key={c.id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${c.status === 'active' ? 'bg-green-100 text-green-600 animate-pulse' : 'bg-muted text-muted-foreground'}`}>
                      {c.channel === 'web' ? <Mic size={18} /> : <Phone size={18} />}
                    </div>
                    <div>
                       <p className="font-medium text-sm">{c.agentName}</p>
                       <p className="text-xs text-muted-foreground flex items-center gap-1">
                         <Clock size={10} /> {new Date(c.startedAt).toLocaleTimeString()}
                       </p>
                    </div>
                  </div>
                  <Badge variant={c.status === 'active' ? 'success' : 'outline'}>{c.status}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader><h3 className="font-semibold text-lg">{t('dashboard.platformHealth')}</h3></CardHeader>
          <CardContent className="space-y-4">
             {['Deepgram STT', 'Inworld AI', 'ElevenLabs TTS', 'Telnyx Voice'].map(s => (
               <div key={s} className="flex justify-between items-center p-3 border rounded-lg bg-card/50">
                 <span className="text-sm font-medium">{s}</span>
                 <div className="flex items-center gap-1.5 text-xs text-green-600 font-medium">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Operational
                 </div>
               </div>
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// --- Agent List View (Updated) ---

const AgentsView: React.FC<{ 
  agents: Agent[]; 
  onSave: (agent: Agent) => void;
  onDelete: (id: string) => void;
}> = ({ agents, onSave, onDelete }) => {
  const { t } = useI18n();
  const [viewMode, setViewMode] = useState<'list' | 'builder'>('list');
  const [editingAgent, setEditingAgent] = useState<Agent | undefined>(undefined);
  const [filter, setFilter] = useState('');

  const handleEdit = (agent: Agent) => {
    setEditingAgent(agent);
    setViewMode('builder');
  };

  const handleCreate = () => {
    setEditingAgent(undefined);
    setViewMode('builder');
  };

  const filteredAgents = agents.filter(a => a.name.toLowerCase().includes(filter.toLowerCase()));

  if (viewMode === 'builder') {
    return <AgentBuilder initialAgent={editingAgent} onSave={(a) => { onSave(a); setViewMode('list'); }} onCancel={() => setViewMode('list')} />;
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('agents.title')}</h2>
          <p className="text-muted-foreground mt-2">{t('agents.subtitle')}</p>
        </div>
        <Button onClick={handleCreate} className="gap-2"><Plus size={16} /> {t('agents.createButton')}</Button>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <Input placeholder="Search agents..." className="max-w-sm" value={filter} onChange={e => setFilter(e.target.value)} />
        <Select className="w-40"><option value="all">All Status</option><option value="active">Active</option></Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgents.map(agent => (
          <Card key={agent.id} className="group hover:shadow-md transition-all">
            <CardHeader className="pb-3 flex-row items-start justify-between space-y-0">
               <div className="bg-primary/10 p-3 rounded-lg text-primary"><Users size={24} /></div>
               <Badge variant={agent.status === 'active' ? 'success' : 'outline'}>{agent.status}</Badge>
            </CardHeader>
            <CardContent>
              <h3 className="font-bold text-lg mb-1">{agent.name}</h3>
              <p className="text-xs text-muted-foreground mb-4">ID: {agent.id.substring(0,8)}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Brain size={14}/> {agent.config.llmProvider}
                <span className="text-border">|</span>
                <Volume2 size={14}/> {agent.config.voiceProvider}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1 gap-2" onClick={() => handleEdit(agent)}>
                  <Edit size={14}/> Edit
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10" onClick={() => onDelete(agent.id)}>
                  <Trash2 size={14}/>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

// --- App Layout ---

const AppContent: React.FC = () => {
  const { t } = useI18n();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  
  useEffect(() => {
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const navItems = [
    { id: 'dashboard', label: t('nav.dashboard'), icon: LayoutDashboard },
    { id: 'agents', label: t('nav.agents'), icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: t('nav.settings'), icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground font-sans">
      <aside className="w-64 border-r p-6 flex flex-col sticky top-0 h-screen">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-lg"><Mic size={20} /></div>
          <span className="font-bold text-xl tracking-tight">{t('nav.brand')}</span>
        </div>
        <nav className="space-y-1 flex-1">
          {navItems.map(item => (
            <Button key={item.id} variant={activeTab === item.id ? 'secondary' : 'ghost'} className="w-full justify-start gap-3" onClick={() => setActiveTab(item.id)}>
              <item.icon size={18} /> {item.label}
            </Button>
          ))}
        </nav>
        <Button variant="ghost" className="w-full justify-start gap-3 mt-auto" onClick={() => setIsDarkMode(!isDarkMode)}>
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} {isDarkMode ? 'Light Mode' : 'Dark Mode'}
        </Button>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto bg-muted/10 h-screen">
        {activeTab === 'dashboard' && <DashboardView agents={agents} conversations={INITIAL_CONVERSATIONS} />}
        {activeTab === 'agents' && <AgentsView agents={agents} onSave={(a) => setAgents(p => [...p.filter(x => x.id !== a.id), a])} onDelete={(id) => setAgents(p => p.filter(x => x.id !== id))} />}
        {activeTab === 'analytics' && <AnalyticsView />}
        {activeTab === 'settings' && <div className="p-8">Settings Placeholder</div>}
      </main>
    </div>
  );
};

const App = () => (
  <I18nProvider>
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  </I18nProvider>
);

const root = createRoot(document.getElementById('root')!);
root.render(<App />);
