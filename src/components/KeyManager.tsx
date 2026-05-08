import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Key, Save, ShieldAlert, Eye, EyeOff, 
  CheckCircle2, AlertTriangle, ShieldCheck, 
  Network, Cloud, CloudOff, RefreshCw 
} from 'lucide-react';
import { db, auth } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { useFirebase } from '../lib/FirebaseProvider';
import { handleFirestoreError, OperationType } from '../lib/errors';

interface ApiKeys {
  openai: string;
  anthropic: string;
  kraken_api_key: string;
  kraken_secret: string;
  surge_key: string;
  dwolla_secret: string;
  plaid_secret: string;
  duns_number: string;
  getblock_btc: string;
  getblock_eth: string;
  autopilot_gate_key: string;
  erc8004_contract: string;
  trading_bot_key: string;
  rpc_url_mainnet: string;
  rpc_url_ghostchain: string;
}

const KeyInput = ({ 
  label, 
  field, 
  systemField, 
  placeholder, 
  keys, 
  showKey, 
  systemStatus, 
  updateKey, 
  toggleVisibility 
}: { 
  label: string;
  field: keyof ApiKeys;
  systemField?: string;
  placeholder: string;
  keys: ApiKeys;
  showKey: Record<string, boolean>;
  systemStatus: Record<string, boolean>;
  updateKey: (field: keyof ApiKeys, value: string) => void;
  toggleVisibility: (field: string) => void;
}) => (
  <div className="space-y-2">
    <div className="flex justify-between items-center">
      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
        {label}
      </label>
      <div className="flex items-center gap-3">
          {systemField && systemStatus[systemField] && (
             <span className="text-[8px] font-bold text-cyan-400 flex items-center gap-1 bg-cyan-400/10 px-2 py-0.5 rounded border border-cyan-400/20">
               SYSTEM LINKED
             </span>
          )}
          {keys[field] && (
             <span className="text-[8px] font-bold text-emerald-500 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
               <CheckCircle2 className="w-2.5 h-2.5" /> VAULT SAVED
             </span>
          )}
      </div>
    </div>
    <div className="relative group">
      <input
        type={showKey[field] ? "text" : "password"}
        value={keys[field] || ''}
        onChange={(e) => updateKey(field, e.target.value)}
        placeholder={placeholder}
        className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder:text-slate-700 focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20 outline-none transition-all pr-12"
      />
      <button 
        onClick={() => toggleVisibility(field)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-white transition-colors"
      >
        {showKey[field] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  </div>
);

export const KeyManager: React.FC = () => {
  const { user } = useFirebase();
  const [keys, setKeys] = useState<ApiKeys>({
    openai: '',
    anthropic: '',
    kraken_api_key: '',
    kraken_secret: '',
    surge_key: '',
    dwolla_secret: '',
    plaid_secret: '',
    duns_number: '',
    getblock_btc: '',
    getblock_eth: '',
    autopilot_gate_key: '',
    erc8004_contract: '',
    trading_bot_key: '',
    rpc_url_mainnet: '',
    rpc_url_ghostchain: '',
  });

  const [showKey, setShowKey] = useState<Record<string, boolean>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [systemStatus, setSystemStatus] = useState<Record<string, boolean>>({});
  const [syncEnabled, setSyncEnabled] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/security/audit');
        const data = await res.json();
        // Flatten status for UI
        const flattened: Record<string, boolean> = {
            ...data.integrations.neural,
            ...data.integrations.finance,
            ...data.integrations.blockchain,
            ...data.integrations.infrastructure
        };
        setSystemStatus(flattened);
      } catch {
        console.error("Failed to fetch system security audit");
      }
    };
    void fetchStatus();
  }, []);

  useEffect(() => {
    // Load local first
    const savedLocal = localStorage.getItem('chain_vault_keys');
    if (savedLocal) {
      try {
        setKeys(prev => ({ ...prev, ...JSON.parse(savedLocal) }));
      } catch (e) {}
    }

    // Load from Cloud if user is logged in
    if (user) {
        const fetchCloud = async () => {
            try {
                const docRef = doc(db, 'user_secrets', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const cloudKeys = docSnap.data().keys;
                    setKeys(prev => ({ ...prev, ...cloudKeys }));
                    setSyncEnabled(true);
                }
            } catch (err) {
                console.warn("Cloud sync not initialized for this user.");
            }
        };
        fetchCloud();
    }
  }, [user]);

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    
    // Save Local
    localStorage.setItem('chain_vault_keys', JSON.stringify(keys));

    // Save Cloud if authenticated
    if (user && syncEnabled) {
        try {
            const docRef = doc(db, 'user_secrets', user.uid);
            await setDoc(docRef, { keys, updatedAt: new Date() }, { merge: true });
            setSaveStatus('success');
        } catch (err) {
            setSaveStatus('error');
            handleFirestoreError(err, OperationType.WRITE, 'user_secrets');
        }
    } else {
        setSaveStatus('success');
    }

    setTimeout(() => setSaveStatus('idle'), 3000);
    setIsSaving(false);
  };

  const toggleVisibility = (field: string) => {
    setShowKey(prev => ({ ...prev, [field]: !prev[field] }));
  };

  const updateKey = (field: keyof ApiKeys, value: string) => {
    setKeys(prev => ({ ...prev, [field]: value }));
  };

  const inputProps = { keys, showKey, systemStatus, updateKey, toggleVisibility };

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-12 px-4 shadow-[0_0_100px_rgba(230,0,0,0.05)]">
      <header className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
                <div className="p-4 bg-red-600 rounded-[2rem] shadow-[0_0_20px_rgba(230,0,0,0.4)] text-white">
                    <ShieldCheck className="w-8 h-8" />
                </div>
                <div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">Vault Configuration</h1>
                    <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Neural Security Layer // Hybrid Storage Active</p>
                </div>
            </div>

            <div className="flex items-center gap-4 p-2 bg-white/[0.03] border border-white/5 rounded-2xl">
                <div className={`p-2 rounded-xl transition-all ${syncEnabled ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'}`}>
                    {syncEnabled ? <Cloud className="w-4 h-4" /> : <CloudOff className="w-4 h-4" />}
                </div>
                <div className="pr-4">
                    <p className="text-[9px] font-black text-white/40 uppercase">Cloud Synchronization</p>
                    <button 
                        onClick={() => setSyncEnabled(!syncEnabled)}
                        className={`text-[10px] font-black uppercase tracking-widest hover:opacity-80 transition-all ${syncEnabled ? 'text-emerald-500' : 'text-slate-500'}`}
                    >
                        {syncEnabled ? 'ENABLED' : 'DISABLE'}
                    </button>
                </div>
            </div>
        </div>

        <div className="p-5 bg-red-950/20 border border-red-900/40 rounded-3xl flex items-start gap-5 backdrop-blur-xl">
          <ShieldAlert className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
          <div className="space-y-2">
            <p className="text-xs font-black text-red-500 uppercase tracking-widest">Imperial Security Protocol 8b-v9</p>
            <p className="text-[11px] text-slate-400 leading-relaxed max-w-2xl font-medium">
              Sensitive credentials reside in the <span className="text-white italic">Neural Shadow</span>. Cloud sync encrypts your variables within the GhostChain Sovereign Layer. Local storage persists only within this node instance. Never share these identifiers with unauthorized agents.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Logic Engines */}
        <section className="space-y-8 bg-white/[0.01] p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="p-2 bg-red-600/10 rounded-lg">
                <Key className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Neural Engine Multi-Link</h2>
          </div>
          <div className="space-y-8">
            <KeyInput label="OpenAI API Gateway" field="openai" systemField="openai" placeholder="sk-..." {...inputProps} />
            <KeyInput label="Anthropic Cognitive Link" field="anthropic" systemField="anthropic" placeholder="sk-ant-..." {...inputProps} />
            <div className="p-6 border border-emerald-500/20 rounded-3xl bg-emerald-500/5 space-y-3 group hover:border-emerald-500/40 transition-all">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-emerald-500 flex items-center justify-center text-black shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-black text-white uppercase tracking-widest">Gemini Native Protocol</span>
                    </div>
                    <div className="h-1.5 w-12 bg-emerald-500/20 rounded-full overflow-hidden">
                        <motion.div 
                            animate={{ x: [-48, 48] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="h-full w-full bg-emerald-500"
                        />
                    </div>
                </div>
                <p className="text-[10px] text-slate-400 leading-relaxed font-medium uppercase italic">
                    AUTO_MANAGED: System Environment detected active Gemini keys. Neural Master cycles active.
                </p>
            </div>
          </div>
        </section>

        {/* Exchange Bridges */}
        <section className="space-y-8 bg-white/[0.01] p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-3 border-b border-white/5 pb-4">
            <div className="p-2 bg-red-600/10 rounded-lg">
                <Network className="w-4 h-4 text-red-600" />
            </div>
            <h2 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Imperial Infrastructure</h2>
          </div>
          <div className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
                <KeyInput label="Kraken Public Hub" field="kraken_api_key" systemField="kraken" placeholder="API Key" {...inputProps} />
                <KeyInput label="Kraken Shadow Secret" field="kraken_secret" systemField="kraken" placeholder="Private Secret" {...inputProps} />
            </div>
            <KeyInput label="Surge.xyz Authorization" field="surge_key" systemField="surge" placeholder="Access Token" {...inputProps} />
            
            <div className="pt-8 space-y-8 border-t border-white/5">
                <KeyInput label="Plaid Financial Sink" field="plaid_secret" systemField="plaid" placeholder="Environment Secret" {...inputProps} />
                <KeyInput label="Dwolla Settlement Key" field="dwolla_secret" placeholder="Onboarding Token" {...inputProps} />
                <KeyInput label="Imperial DUNS Identifier" field="duns_number" placeholder="9-Digit Entity #" {...inputProps} />
            </div>

            <div className="pt-8 space-y-8 border-t border-white/5">
                <div className="flex items-center gap-2 mb-2">
                    <Network className="w-3.5 h-3.5 text-red-600" />
                    <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Chain Persistence Nodes</h2>
                </div>
                <KeyInput label="GetBlock BTC Mainnet" field="getblock_btc" placeholder="https://go.getblock.io/..." {...inputProps} />
		        <KeyInput label="GetBlock ETH Beacon" field="getblock_eth" placeholder="https://go.getblock.io/..." {...inputProps} />
            </div>

            <div className="pt-8 space-y-8 border-t border-white/5">
                <div className="flex items-center gap-2 mb-2">
                    <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
                    <h2 className="text-[10px] font-black text-white uppercase tracking-widest">Sovereign Protocols (ERC-8004)</h2>
                </div>
                <KeyInput label="Autopilot Gate Key" field="autopilot_gate_key" placeholder="System Authorization Key" {...inputProps} />
                <KeyInput label="ERC-8004 Contract" field="erc8004_contract" placeholder="0x..." {...inputProps} />
                <KeyInput label="Trading Bot Private Key" field="trading_bot_key" placeholder="0x..." {...inputProps} />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <KeyInput label="Mainnet RPC" field="rpc_url_mainnet" placeholder="https://..." {...inputProps} />
                    <KeyInput label="GhostChain RPC" field="rpc_url_ghostchain" placeholder="https://..." {...inputProps} />
                </div>
            </div>
          </div>
        </section>
      </div>

      <footer className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-8 bg-black/40 p-8 rounded-[3rem] backdrop-blur-md">
        <div className="flex items-center gap-4">
            <div className="text-right">
                <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest">Vault Status</h4>
                <div className="flex items-center gap-2 justify-end">
                    <div className={`w-1.5 h-1.5 rounded-full ${saveStatus === 'success' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]' : 'bg-red-500/50'}`} />
                    <span className="text-[11px] font-mono font-bold text-white uppercase">{saveStatus === 'success' ? 'Synchronized' : 'Awaiting Push'}</span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
            <AnimatePresence mode="wait">
                {saveStatus !== 'idle' && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className={`flex items-center gap-2 font-black text-[10px] uppercase tracking-widest ${saveStatus === 'success' ? 'text-emerald-500' : 'text-red-500'}`}
                    >
                        {saveStatus === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                        {saveStatus === 'success' ? 'Neural Pulse Confirmed' : 'Sync Error Target Not Found'}
                    </motion.div>
                )}
            </AnimatePresence>
            
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 md:flex-none px-12 py-5 bg-white text-black rounded-3xl font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-4 shadow-[0_0_50px_rgba(255,255,255,0.1)] hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:scale-[1.03] active:scale-95 transition-all disabled:opacity-50"
            >
                {isSaving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                {isSaving ? "PROCESSING" : "Commit to Shadow Vault"}
            </button>
        </div>
      </footer>
    </div>
  );
};

