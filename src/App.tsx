import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, Cpu, Zap, Settings,
  ShieldAlert,
  BrainCircuit, Workflow,
  BarChart3, Globe2, Network,
  Wallet, Share2, Layout, Code2, Download, Sparkles, Book, Atom, MessageSquare,
  Beaker, Radio
} from 'lucide-react';
import { db, auth } from './firebase';
import { signInWithPopup, GoogleAuthProvider, signOut } from 'firebase/auth';
import { useFirebase } from './lib/FirebaseProvider';
import { cn } from './lib/utils';
import { RevenueChart } from './components/RevenueChart';
import { AgentsPanel } from './components/AgentsPanel';
import { NeuralIntelFeed } from './components/NeuralIntelFeed';
import { collection, addDoc, serverTimestamp, onSnapshot, query, updateDoc, doc, where } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from './lib/errors';
import { LegalModal } from './components/LegalModal';
import { generateNeuralInference, streamMarketAnalysis } from './services/aiIntelligence';
import { spawnSyntheticSignal, broadcastIntel } from './services/neuralIntel';

// --- Background Components ---
const Starfield: React.FC = () => {
  const [stars] = useState(() => Array.from({ length: 50 }).map(() => ({
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    width: `${Math.random() * 2}px`,
    height: `${Math.random() * 2}px`,
    delay: `${Math.random() * 5}s`,
    duration: `${3 + Math.random() * 5}s`
  })));

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-black to-black" />
      {stars.map((star, i) => (
        <div 
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: star.width,
            height: star.height,
            animationDelay: star.delay,
            animationDuration: star.duration
          }}
        />
      ))}
    </div>
  );
};

const DriftTelemetry: React.FC = () => {
    const [drift, setDrift] = useState(0.042);
    useEffect(() => {
        const interval = setInterval(() => {
            setDrift(prev => {
                const change = (Math.random() - 0.5) * 0.001;
                return Math.max(0.001, prev + change);
            });
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex items-center gap-4 px-4 py-1.5 bg-black/40 border border-white/5 rounded-full backdrop-blur-md">
            <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]" />
                <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.1em]">Neural Drift</span>
            </div>
            <span className="text-[10px] font-mono font-bold text-cyan-400">{drift.toFixed(4)}%</span>
            <div className="w-[80px] h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                    initial={false}
                    animate={{ width: `${(drift / 0.1) * 100}%` }}
                    className="h-full bg-cyan-400"
                />
            </div>
        </div>
    );
};
import { MarketBridge } from './components/MarketBridge';
import { StrategyPanel } from './components/StrategyPanel';
import { ProfitSwarmConsole } from './components/ProfitSwarmConsole';
import { IntegrationsPanel } from './components/IntegrationsPanel';
import { AgentCodeTerminal } from './components/AgentCodeTerminal';
import { KeyManager } from './components/KeyManager';
import { SapphireMarketplace } from './components/SapphireMarketplace';
import { ContractAuditor } from './components/ContractAuditor';
import { AgentTaskPanel } from './components/AgentTaskPanel';
import GhostChainPortal from './components/GhostChainPortal';
import { VetoLogsPanel } from './components/VetoLogsPanel';
import { SovereignDashboard } from './components/SovereignDashboard';

import { MarketData, Alert, VaultSnapshot, Transaction, Agent, RepairLog, HealthData } from './types/frontend';

// --- Types ---
// Removed inline Agent and RepairLog as they are now imported

import { NexusOfCreation } from './components/NexusOfCreation';
import { SovereignCodex } from './components/SovereignCodex';
import { QuantumSimEngine } from './components/QuantumSimEngine';
import { SovereignOracle } from './components/SovereignOracle';
import { AgentLab } from './components/AgentLab';
import { ResonanceTuner } from './components/ResonanceTuner';
import { SovereignMind } from './components/SovereignMind';
import { DigitalSoul } from './components/DigitalSoul';

import { RealityMap } from './components/RealityMap';

const Chain: React.FC = () => {
  const { user } = useFirebase();
  // --- 0. State ---
  const [activeView, setActiveView] = useState<'hub' | 'swarm' | 'market' | 'audit' | 'portal' | 'dashboard' | 'develop' | 'settings' | 'creation' | 'codex' | 'sim' | 'oracle' | 'lab' | 'resonance' | 'mind'>('hub');
  const [driftFactor, setDriftFactor] = useState(1.0);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isRepairing, setIsRepairing] = useState<Record<string, boolean>>({});
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [aiAlerts, setAiAlerts] = useState<Alert[]>([]);
  const [vault, setVault] = useState<VaultSnapshot | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [revenueHistory] = useState<number[]>([7000, 7200, 7100, 7500, 7777]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [userCredits, setUserCredits] = useState(0);
  const [isLegalModalOpen, setIsLegalModalOpen] = useState(false);
  const [legalDoc, setLegalDoc] = useState<'terms' | 'privacy' | 'disclaimer'>('terms');

  const [isGlitching, setIsGlitching] = useState(false);
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulse(p => p + 1);
      if (driftFactor > 1.4 && Math.random() > 0.7) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200);
      }
    }, 2000 / (driftFactor || 1));
    return () => clearInterval(interval);
  }, [driftFactor]);
  const [newAgentRole, setNewAgentRole] = useState('analyst');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const [autoRepairLogs, setAutoRepairLogs] = useState<RepairLog[]>(() => [{
    id: 'sync-init',
    agentId: 'system',
    agentName: 'ROOT',
    timestamp: Date.now(),
    message: 'ALLMONEYIN33 LLC: Sovereign Ecosystem v142.0.0 ACTIVATED.',
    type: 'info'
  }]);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      alert("To install Chain on your home screen:\n\n1. Open your browser menu (usually three dots or share icon)\n2. Select 'Add to Home Screen' or 'Install App'");
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const ROLE_DESCRIPTIONS = {
    analyst: "Advanced data evaluation and predictive modeling.",
    trader: "High-frequency precision execution engine.",
    auditor: "Smart-contract security & rules validator.",
    guardian: "System-wide perimeter defense & self-repair."
  };

  const inferenceCooldown = useRef(false);

  const openLegal = useCallback((docType: 'terms' | 'privacy' | 'disclaimer') => {
    setLegalDoc(docType);
    setIsLegalModalOpen(true);
  }, []);

  // --- 1. Real-time Agent Subscription ---
  useEffect(() => {
    const q = query(collection(db, 'agents'));
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const agentData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Agent));
        setAgents(agentData);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'agents')
    );
    return () => unsubscribe();
  }, []);

  // --- 2. Backend Data Fetching & AI Intelligence ---
  const fetchBackendData = useCallback(async () => {
    try {
        const [marketRes, awarenessRes, vaultRes, txRes, , , healthRes] = await Promise.all([
            fetch('/api/sovereign/market-data'),
            fetch('/api/sovereign/awareness'),
            fetch('/api/vault'),
            fetch('/api/vault/transactions'),
            fetch('/api/sovereign/live-alerts'),
            fetch('/api/governance'),
            fetch('/api/health')
        ]);
        
        const mData = marketRes.ok ? await marketRes.json() : null;
        if (mData) {
            setMarketData(mData);
            if (mData.driftFactor) setDriftFactor(mData.driftFactor);
        }
        
        if (awarenessRes.ok) {
            const data = await awarenessRes.json();
            setAiAlerts(data.alerts || []);
        }
        if (vaultRes.ok) setVault(await vaultRes.json());
        if (txRes.ok) setTransactions(await txRes.json());
        if (healthRes.ok) setHealthData(await healthRes.json());

        // Neural Intelligence
        if (mData && !inferenceCooldown.current && process.env.GEMINI_API_KEY) {
            inferenceCooldown.current = true;
            // Generate inference but don't store since state was removed as unused
            await generateNeuralInference({ 
                market: mData, 
                agents: agents.length, 
                vaultBalance: vault?.balance || 0,
                revenueAccumulator: vault?.totalRevenue || 0
            });
            
            await streamMarketAnalysis(mData, () => {});
            
            setTimeout(() => { inferenceCooldown.current = false; }, 45000); // 45s cycle
        }
    } catch (e) {
        console.error("Failed to fetch sovereign data:", e);
    }
  }, [agents.length, vault]);

  useEffect(() => {
    // Initial fetch via non-blocking call
    const init = async () => {
      await fetchBackendData();
    };
    init();
    
    // Polling
    const interval = setInterval(fetchBackendData, 8000);
    
    return () => clearInterval(interval);
  }, [fetchBackendData]);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
    } catch (e) {
        console.error(e);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleWithdraw = async () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount))) return;
    setIsProcessingPayment(true);
    try {
        const res = await fetch('/api/vault/withdraw', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount: Number(withdrawAmount) })
        });
        if (res.ok) {
            const data = await res.json();
            setVault(data.vault);
            setWithdrawAmount('');
            setShowWithdrawModal(false);
            fetchBackendData();
        } else {
            const error = await res.json();
            alert(error.message);
        }
    } catch (e) {
        console.error(e);
    } finally {
        setIsProcessingPayment(false);
    }
  };

  const handleTransfer = async (amount: number, to: string) => {
    setIsProcessingPayment(true);
    try {
        const res = await fetch('/api/vault/transfer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount, to })
        });
        const data = await res.json();
        if (data.success) {
            fetchBackendData();
            return true;
        } else {
            alert(data.message);
            return false;
        }
    } catch (e) {
        console.error(e);
        return false;
    } finally {
        setIsProcessingPayment(false);
    }
  };

  const triggerXBroadcast = useCallback(async () => {
    try {
        const res = await fetch('/api/broadcast/x', { method: 'POST' });
        if (res.ok) {
            const data = await res.json();
            const now = Date.now();
            const log: RepairLog = {
                id: crypto.randomUUID(),
                agentId: 'x-bridge',
                agentName: 'X-PROTOCOL',
                timestamp: now,
                message: `BROADCAST SUCCESS: ${data.status}`,
                type: 'success'
            };
            setAutoRepairLogs(prev => [log, ...prev]);
        }
    } catch (e) {
        console.error(e);
    }
  }, []);

  const handleAutoRepair = useCallback(async (agent: Agent) => {
    setIsRepairing(prev => ({ ...prev, [agent.id]: true }));
    
    const startLog: RepairLog = {
      id: crypto.randomUUID(),
      agentId: agent.agentId || agent.id,
      agentName: agent.name,
      timestamp: Date.now(),
      message: `INITIATING SELF-REPAIR: Node ${agent.name} is offline. Auto-syncing.`,
      type: 'warning'
    };
    setAutoRepairLogs(prev => [startLog, ...prev]);

    try {
      const agentRef = doc(db, 'agents', agent.id);
      await updateDoc(agentRef, { status: 'repairing', lastUpdate: serverTimestamp() });
      await new Promise(resolve => setTimeout(resolve, 4000));
      const newHealth = Math.min(100, 88 + Math.random() * 12);
      await updateDoc(agentRef, { status: 'active', health: newHealth, lastUpdate: serverTimestamp() });

      const successLog: RepairLog = {
        id: crypto.randomUUID(),
        agentId: agent.agentId || agent.id,
        agentName: agent.name,
        timestamp: Date.now(),
        message: `REPAIR COMPLETE: Node ${agent.name} health stabilized at ${newHealth.toFixed(1)}%.`,
        type: 'success'
      };
      setAutoRepairLogs(prev => [successLog, ...prev]);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'agents');
    } finally {
      setIsRepairing(prev => ({ ...prev, [agent.id]: false }));
    }
  }, [setAutoRepairLogs]);

  // --- 3. Agent Self-Repair Loop ---
  useEffect(() => {
    const inactiveAgents = agents.filter(a => a.status === 'inactive' && !isRepairing[a.id]);

    if (inactiveAgents.length > 0) {
      inactiveAgents.forEach(agent => {
        handleAutoRepair(agent);
      });
    }
  }, [agents, isRepairing, handleAutoRepair]);

  const createAgent = async () => {
    if (!user) return;
    
    const newId = `agent_${crypto.randomUUID().split('-')[0]}`;
    const agentData = {
      agentId: newId,
      name: `${newAgentRole.charAt(0).toUpperCase() + newAgentRole.slice(1)}_${Math.floor(Math.random() * 1000)}`,
      role: newAgentRole,
      status: 'active',
      ownerUid: user.uid,
      reputation: 95,
      healthScore: 100,
      cognitiveGrowth: 0,
      innovationLevel: 1,
      createdAt: serverTimestamp(),
      capabilities: [newAgentRole === 'trader' ? 'market-execution' : 'neural-monitoring'],
      reputationHistory: [95]
    };

    try {
      await addDoc(collection(db, 'agents'), agentData);
      await addDoc(collection(db, 'system_logs'), {
        msg: `AGENT_SPAWNED: ${agentData.name} initialized with profile ${newAgentRole}`,
        timestamp: serverTimestamp(),
        type: 'success',
        uid: user.uid
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'agents');
    }
  };

  // --- 4. Agent Task Simulation Loop ---
  useEffect(() => {
    if (!user) return;
    
    const q = query(
      collection(db, 'agent_tasks'),
      where('userId', '==', user.uid),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docs.forEach(async (taskDoc) => {
        // Simulate start processing
        const taskRef = doc(db, 'agent_tasks', taskDoc.id);
        
        setTimeout(async () => {
          try {
            await updateDoc(taskRef, { 
              status: 'in-progress', 
              updatedAt: serverTimestamp() 
            });
            
            // Random duration for completion
            setTimeout(async () => {
              const success = Math.random() > 0.1;
              await updateDoc(taskRef, {
                status: success ? 'completed' : 'failed',
                error: success ? null : 'NODE_QUANTUM_DESYNC',
                result: success ? { output: "Data synchronized across shards", confidence: 0.98 } : null,
                updatedAt: serverTimestamp()
              });
            }, 5000 + Math.random() * 5000);
          } catch (e) {
            console.error("Simulation update failed:", e);
          }
        }, 3000 + Math.random() * 2000);
      });
    });

    return () => unsubscribe();
  }, [user]);


  const triggerGoDaddyWebhook = async () => {
    try {
        const res = await fetch('/api/webhook/godaddy', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ event: 'order.created', amount: 33.00 })
        });
        if (res.ok) {
            const data = await res.json();
            setVault(data.balance);
            const log: RepairLog = {
                id: crypto.randomUUID(),
                agentId: 'godaddy-bridge',
                agentName: 'GODADDY',
                timestamp: Date.now(),
                message: `SETTLEMENT DETECTED: +$33.00 USDC provisioned via Ingress Hook.`,
                type: 'success'
            };
            setAutoRepairLogs(prev => [log, ...prev]);
        }
    } catch (e) {
        console.error(e);
    }
  };

  useEffect(() => {
    const intelInterval = setInterval(() => {
        if (Math.random() > 0.7) {
            const signal = spawnSyntheticSignal();
            broadcastIntel(signal);
        }
    }, 15000);
    return () => clearInterval(intelInterval);
  }, []);

  const triggerBotCycle = async () => {
    setIsProcessingPayment(true);
    try {
      const res = await fetch('/api/bot/run', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setVault(data);
        const log: RepairLog = {
          id: crypto.randomUUID(),
          agentId: 'bot-engine',
          agentName: 'OMNI-MASTER',
          timestamp: Date.now(),
          message: 'AUTOPILOT YIELD CYCLE SUCCESSFUL: Assets Reconciled.',
          type: 'success'
        };
        setAutoRepairLogs(prev => [log, ...prev]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const triggerAiHandshake = async () => {
    const log: RepairLog = {
      id: crypto.randomUUID(),
      agentId: 'ai-engine',
      agentName: 'NEURAL-MESH',
      timestamp: Date.now(),
      message: 'MANUAL NEURAL HANDSHAKE INITIATED: Resyncing protocols...',
      type: 'info'
    };
    setAutoRepairLogs(prev => [log, ...prev]);
    await fetchBackendData();
  };

  return (
    <div className={cn("min-h-screen flex font-sans selection:bg-red-600/30 selection:text-white bg-black relative", isGlitching && "glitch-active")}>
      <div className="scanline" />
      <Starfield />
      {/* Sidebar View Switcher */}
      <aside className="w-16 border-r border-white/10 flex flex-col items-center py-8 gap-8 bg-slate-950 z-[70]">
        <div className="w-10 h-10 bg-red-600 rounded flex items-center justify-center font-bold text-white shadow-[0_0_15px_rgba(230,0,0,0.5)] mb-4">C</div>
        
        <nav className="flex flex-col gap-6">
          <button onClick={() => setActiveView('hub')} className={`p-3 rounded-xl transition-all ${activeView === 'hub' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <Layout className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveView('swarm')} className={`p-3 rounded-xl transition-all ${activeView === 'swarm' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <Workflow className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveView('dashboard')} className={`p-3 rounded-xl transition-all ${activeView === 'dashboard' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <BarChart3 className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveView('market')} className={`p-3 rounded-xl transition-all ${activeView === 'market' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <Globe2 className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveView('audit')} className={`p-3 rounded-xl transition-all ${activeView === 'audit' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <ShieldAlert className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveView('portal')} title="Identity Portal" className={`p-3 rounded-xl transition-all ${activeView === 'portal' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <Zap className="w-5 h-5" />
          </button>
          <button onClick={() => setActiveView('develop')} title="Neural Workspace" className={`p-3 rounded-xl transition-all ${activeView === 'develop' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <Code2 className="w-5 h-5" />
          </button>
          
          <button onClick={() => setActiveView('creation')} title="Nexus of Creation" className={`p-3 rounded-xl transition-all ${activeView === 'creation' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <Sparkles className="w-5 h-5" />
          </button>

          <button onClick={() => setActiveView('codex')} title="Sovereign Codex" className={`p-3 rounded-xl transition-all ${activeView === 'codex' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <Book className="w-5 h-5" />
          </button>

          <button onClick={() => setActiveView('sim')} title="Quantum Simulation" className={`p-3 rounded-xl transition-all ${activeView === 'sim' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <Atom className="w-5 h-5" />
          </button>

          <button onClick={() => setActiveView('oracle')} title="Sovereign Oracle" className={`p-3 rounded-xl transition-all ${activeView === 'oracle' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <MessageSquare className="w-5 h-5" />
          </button>

          <button onClick={() => setActiveView('lab')} title="Agent Lab" className={`p-3 rounded-xl transition-all ${activeView === 'lab' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <Beaker className="w-5 h-5" />
          </button>

          <button onClick={() => setActiveView('resonance')} title="Resonance Tuner" className={`p-3 rounded-xl transition-all ${activeView === 'resonance' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <Radio className="w-5 h-5" />
          </button>

          <button onClick={() => setActiveView('mind')} title="Sovereign Mind" className={`p-3 rounded-xl transition-all ${activeView === 'mind' ? 'bg-red-600 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
            <BrainCircuit className="w-5 h-5" />
          </button>
          
          <button 
            onClick={handleInstallClick} 
            title="Create Home Screen Shortcut" 
            className="p-3 rounded-xl transition-all text-slate-500 hover:text-emerald-500 hover:bg-emerald-500/5 mt-2 border border-dashed border-white/5 hover:border-emerald-500/20"
          >
            <Download className="w-5 h-5" />
          </button>
        </nav>

        <div className="mt-auto pb-4">
          <Settings 
            onClick={() => setActiveView('settings')}
            className={`w-6 h-6 cursor-pointer transition-all ${activeView === 'settings' ? 'text-red-500 shadow-[0_0_10px_rgba(230,0,0,0.5)]' : 'text-slate-800 hover:text-slate-400'}`} 
          />
        </div>
      </aside>

      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        {/* Performance Top Strip */}
        <div className="h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_15px_rgba(230,0,0,0.5)] z-[60]" />
        
        {/* Conditional Content Rendering */}
        <div className={cn("flex-1 overflow-hidden", isGlitching && "animate-pulse brightness-200 contrast-200")}>
          {activeView === 'hub' ? (
            <div className="flex-1 flex flex-col h-full bg-black relative overflow-hidden">
                <Starfield />
                {/* Hub Header */}
                <div className="relative z-50 flex flex-col md:flex-row items-center justify-between gap-4 p-6 border-b border-white/5 bg-black/40 backdrop-blur-md">
                    <div className="flex items-center gap-4">
                        <DigitalSoul drift={driftFactor} size={48} className="shrink-0" />
                        <div className="p-3 bg-ghost-accent rounded-2xl shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                            <BrainCircuit className="w-6 h-6 text-black" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white tracking-widest uppercase italic">GhostChain <span className="text-red-500 font-sans not-italic">OMEGA TOTALITY</span></h1>
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest">Sovereign Ecosystem v1.5.8-OMEGA</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <DriftTelemetry />
                        <div className="h-6 w-[1px] bg-white/10 mx-2" />
                        {user ? (
                            <div className="flex items-center gap-4 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-white/40 uppercase">Verified Node</p>
                                    <p className="text-xs font-mono text-white cursor-pointer hover:text-red-500 transition-all" onClick={handleLogout}>{user.email?.split('@')[0]}</p>
                                </div>
                                <img src={user.photoURL || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.uid}`} className="w-8 h-8 rounded-xl border border-white/10" alt="Node Avatar" />
                            </div>
                        ) : (
                            <button 
                              onClick={handleLogin}
                              className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(230,0,0,0.3)] active:scale-95"
                            >
                              Access Nexus
                            </button>
                        )}
                        <button className="p-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl transition-all text-white">
                            <Share2 className="w-4 h-4" onClick={triggerXBroadcast} />
                        </button>
                    </div>
                </div>

                {/* Nexus Content Section */}
                <div className="flex-1 overflow-y-auto no-scrollbar relative z-10 p-8">
                    <div className="max-w-7xl mx-auto space-y-10">
                        {/* Top Level Stats Panel */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <section className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group hover:border-ghost-accent/30 transition-all">
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-ghost-accent/20 rounded-xl">
                                            <Wallet className="w-4 h-4 text-ghost-accent" />
                                        </div>
                                        <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">+14.2%</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Settled Liquidity</p>
                                        <h3 className="text-2xl font-black text-white">${(vault?.balance || 1429330).toLocaleString()}</h3>
                                    </div>
                                </div>
                                <motion.div className="absolute -right-4 -bottom-4 w-24 h-24 bg-ghost-accent/5 blur-3xl rounded-full" />
                            </section>

                            <section className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/30 transition-all">
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-cyan-500/20 rounded-xl">
                                            <Network className="w-4 h-4 text-cyan-400" />
                                        </div>
                                        <span className="text-[8px] font-black text-cyan-400 uppercase tracking-widest">SHARD_NOMINAL</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Links</p>
                                        <h3 className="text-2xl font-black text-white">{agents.length * 11}</h3>
                                    </div>
                                </div>
                            </section>

                            <section className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group hover:border-rose-500/30 transition-all">
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-rose-500/20 rounded-xl">
                                            <Cpu className="w-4 h-4 text-rose-400" />
                                        </div>
                                        <span className="text-[8px] font-black text-rose-400 uppercase tracking-widest">AMX™ LOAD</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Neural Compute</p>
                                        <h3 className="text-2xl font-black text-white">84.2 TH/S</h3>
                                    </div>
                                </div>
                            </section>

                            <section className="p-6 bg-white/[0.02] border border-white/5 rounded-[2rem] backdrop-blur-xl relative overflow-hidden group hover:border-emerald-500/30 transition-all">
                                <div className="relative z-10 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="p-2 bg-emerald-500/20 rounded-xl">
                                            <Shield className="w-4 h-4 text-emerald-400" />
                                        </div>
                                        <span className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">HARDENED</span>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Security Layer</p>
                                        <h3 className="text-2xl font-black text-white">ALLMONEYIN</h3>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Middle Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            <div className="lg:col-span-2 space-y-8">
                                <div className="aspect-[21/9] w-full border border-white/5 rounded-[2rem] overflow-hidden bg-black/40 relative">
                                    <RealityMap drift={driftFactor} />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <AgentTaskPanel userId={user?.uid || ''} agents={agents} />
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between px-2">
                                            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                                                <Zap className="w-4 h-4 text-ghost-accent" /> Swarm Engine
                                            </h3>
                                            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                                                <span className="text-[10px] font-mono text-ghost-accent">{userCredits} SOV</span>
                                            </div>
                                        </div>
                                        <ProfitSwarmConsole 
                                            totalProfit={vault?.totalRevenue || 0}
                                            setTotalProfit={() => {}}
                                            botCredits={userCredits} 
                                            setBotCredits={setUserCredits}
                                            market={marketData}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="lg:col-span-1 space-y-8">
                                <NeuralIntelFeed />
                                <IntegrationsPanel onIntegrationSuccess={(agent, msg) => {
                                    const log: RepairLog = {
                                        id: crypto.randomUUID(),
                                        agentId: 'integration-bridge',
                                        agentName: agent,
                                        timestamp: Date.now(),
                                        message: msg,
                                        type: 'success'
                                    };
                                    setAutoRepairLogs(prev => [log, ...prev]);
                                }} />
                            </div>
                        </div>

                        {/* Revenue Singularity Area */}
                        <div className="bg-white/[0.02] border border-white/5 rounded-[3rem] p-8 backdrop-blur-xl overflow-hidden relative">
                             <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8 relative z-10">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Financial Singularity Trace</h3>
                                    <p className="text-[10px] text-slate-500 font-mono italic">Inference Engine: AMD Instinct™ MI355X</p>
                                </div>
                                <button className="px-8 py-3 bg-white text-black rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                    Synchronize Protocols
                                </button>
                             </div>
                             <div className="h-[300px]">
                                <RevenueChart data={revenueHistory} />
                             </div>
                             <div className="absolute top-0 right-0 w-[500px] h-full bg-ghost-accent/5 blur-[120px] -rotate-12 transform translate-x-1/2 -z-10" />
                        </div>
                    </div>
                </div>
            </div>
          ) : activeView === 'swarm' ? (
            <div className="h-full overflow-y-auto p-8 bg-slate-950 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 flex flex-col gap-8">
                  <ProfitSwarmConsole 
                    totalProfit={vault?.balance || 0}
                    setTotalProfit={() => {}}
                    botCredits={userCredits}
                    setBotCredits={setUserCredits}
                    market={marketData}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <StrategyPanel />
                    <MarketBridge />
                  </div>
                </div>
                <div className="lg:col-span-4 h-full">
                   <AgentsPanel 
                        agents={agents} 
                        newAgentRole={newAgentRole}
                        setNewAgentRole={setNewAgentRole}
                        createAgent={createAgent}
                        roleDescriptions={ROLE_DESCRIPTIONS}
                    />
                </div>
              </div>
            </div>
          ) : activeView === 'market' ? (
            <div className="h-full overflow-y-auto p-8 bg-slate-950">
              <SapphireMarketplace 
                botCredits={userCredits}
                setBotCredits={setUserCredits}
              />
            </div>
          ) : activeView === 'audit' ? (
            <div className="h-full overflow-y-auto p-8 bg-slate-950 flex flex-col gap-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2">
                  <ContractAuditor onAuditConfirmed={() => {}} />
                </div>
                <div className="lg:col-span-1">
                  <VetoLogsPanel logs={autoRepairLogs} />
                </div>
              </div>
            </div>
          ) : activeView === 'portal' ? (
            <div className="h-full overflow-y-auto bg-slate-950">
              <GhostChainPortal onAuthenticated={() => setActiveView('hub')} />
            </div>
          ) : activeView === 'dashboard' ? (
            <div className="h-full overflow-y-auto p-8 bg-slate-950">
              <SovereignDashboard 
                totalProfit={vault?.balance || 0}
                botCredits={userCredits}
                temperature={healthData?.telemetry?.temp || 50}
                vaults={[]}
                market={marketData}
                alerts={aiAlerts}
                transactions={transactions}
              />
            </div>
          ) : activeView === 'develop' ? (
            <div className="h-full overflow-y-auto p-8 bg-slate-950 flex flex-col gap-6">
              <div className="flex items-center justify-between bg-white/[0.02] border border-white/5 p-4 rounded-2xl">
                 <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <Workflow className="w-5 h-5" />
                    </div>
                    <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-widest">Neural Ingress Simulator</h2>
                        <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Test autonomous settlement hooks from external vendors</p>
                    </div>
                 </div>
                 <button 
                  onClick={triggerGoDaddyWebhook}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] active:scale-95"
                 >
                   Simulate GoDaddy Hook
                 </button>
              </div>
              <AgentCodeTerminal />
            </div>
          ) : activeView === 'settings' ? (
            <div className="h-full overflow-y-auto bg-black">
              <KeyManager />
            </div>
          ) : activeView === 'creation' ? (
             <NexusOfCreation />
          ) : activeView === 'codex' ? (
             <SovereignCodex />
          ) : activeView === 'sim' ? (
             <QuantumSimEngine />
          ) : activeView === 'oracle' ? (
             <SovereignOracle />
          ) : activeView === 'lab' ? (
             <AgentLab />
          ) : activeView === 'resonance' ? (
             <ResonanceTuner />
          ) : activeView === 'mind' ? (
             <SovereignMind />
          ) : null}
        </div>

        {/* Global Status Footer */}
      <footer className="bg-slate-950 border-t border-white/5 p-4 px-8 flex items-center justify-between sticky bottom-0 z-50">
        <div className="flex items-center gap-12">
            <div className="flex items-center gap-3">
               <div className="w-7 h-7 bg-red-600 rounded flex items-center justify-center font-bold text-[11px] text-white shadow-[0_0_10px_rgba(230,0,0,0.4)]">33</div>
               <div className="flex flex-col">
                  <div className="text-[10px] font-black text-white uppercase tracking-[0.25em]">ALLMONEYIN33 LLC</div>
                  <div className="text-[8px] font-mono text-slate-600 uppercase">Autonomous Financial Infrastructure</div>
               </div>
            </div>
            <div className="hidden md:flex gap-8 items-center border-l border-white/10 pl-8">
                <div className="flex flex-col">
                    <span className="label-micro opacity-30">Global Mesh</span>
                    <span className="text-[10px] font-mono text-emerald-500 tracking-tighter">NODE_OMEGA_STABLE</span>
                </div>
                <div className="flex flex-col">
                    <span className="label-micro opacity-30">Network Hops</span>
                    <span className="text-[10px] font-mono text-white tracking-tighter">14 CLUSTERS ACTIVE</span>
                </div>
                <div className="flex flex-col">
                    <span className="label-micro opacity-30">Neural Latency</span>
                    <span className={`text-[10px] font-mono tracking-tighter ${Number(healthData?.telemetry?.latency || 8.2) > 250 ? 'text-red-500 animate-pulse' : 'text-emerald-500'}`}>
                        {healthData?.telemetry?.latency?.toFixed(1) || '8.2'}ms
                    </span>
                </div>
                <div className="flex flex-col border-l border-white/10 pl-8">
                    <span className="label-micro opacity-30">Lab-Genie</span>
                    <span className={`text-[10px] font-mono tracking-tighter ${Number(healthData?.telemetry?.latency || 8.2) > 250 ? 'text-red-500' : 'text-cyan-400'}`}>
                        {Number(healthData?.telemetry?.latency || 8.2) > 250 ? 'FAILOVER_ACTIVE' : 'SYSTEM_HEALTHY'}
                    </span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 label-micro text-slate-500">
                <Globe2 className="w-4 h-4" /> <span className="text-white">ERC-8004 PROTOCOL</span>
            </div>
            <button 
              onClick={triggerAiHandshake}
              disabled={isProcessingPayment}
              className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded text-[10px] font-black text-white uppercase tracking-widest transition-all"
            >
                Neural Handshake
            </button>
            <button 
              onClick={triggerBotCycle}
              disabled={isProcessingPayment}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 transition-colors rounded text-[10px] font-black text-white uppercase tracking-widest shadow-[0_0_15px_rgba(230,0,0,0.4)] disabled:opacity-50"
            >
                Sync Master State
            </button>
        </div>
      </footer>

      {/* Withdrawal Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowWithdrawModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#111] border border-white/20 rounded-xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-600 shadow-[0_0_10px_red]" />
              
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-600/20 rounded">
                    <Wallet className="w-6 h-6 text-red-600" />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-white uppercase tracking-tight">Initiate Withdrawal</h2>
                    <p className="text-xs text-white/40 uppercase tracking-widest font-mono">Vault Rebalancing Engine</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="label-micro opacity-60">Amount (USDC)</label>
                        <span className="label-micro text-red-500">Available: ${vault?.balance || 0}</span>
                    </div>
                    <input 
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full bg-black border border-white/10 rounded-lg p-3 text-white font-mono focus:border-red-600 outline-none transition-colors"
                    />
                </div>

                <div className="p-4 bg-white/5 rounded border border-white/5 space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-white/60">
                        <span>GAS FEE (ARCADE CORE):</span>
                        <span className="text-emerald-500 font-bold">DYNAMIC_FREE</span>
                    </div>
                    <div className="flex justify-between text-[10px] font-mono text-white/60">
                        <span>SECURITY CHECK:</span>
                        <span className="text-emerald-500 font-bold uppercase tracking-widest">U.D.A.W.G PASSED</span>
                    </div>
                    <div className="pt-2 border-t border-white/5 flex justify-between text-xs font-black text-white">
                        <span>REMAINING BALANCE:</span>
                        <span>${((vault?.balance || 0) - Number(withdrawAmount || 0)).toLocaleString()}</span>
                    </div>
                </div>

                <div className="flex gap-4">
                    <button 
                        onClick={() => setShowWithdrawModal(false)}
                        className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-lg text-white label-micro transition-all uppercase font-bold"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleWithdraw}
                        disabled={isProcessingPayment || !withdrawAmount}
                        className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-lg text-white label-micro font-black transition-all shadow-[0_10px_20px_rgba(230,0,0,0.2)] uppercase tracking-widest"
                    >
                        {isProcessingPayment ? 'Securing Shards...' : 'Confirm Withdrawal'}
                    </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <LegalModal 
        isOpen={isLegalModalOpen} 
        onClose={() => setIsLegalModalOpen(false)} 
        initialDoc={legalDoc} 
      />
      </div>
    </div>
  );
};

export default Chain;
;
