/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { 
  collection, 
  onSnapshot, 
  query, 
  where, 
  addDoc, 
  updateDoc,
  serverTimestamp,
  doc,
  getDocFromServer
} from 'firebase/firestore';
import { auth, db } from './firebase';
import { GoogleGenAI } from "@google/genai";
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { 
  Bot, 
  Wallet, 
  CreditCard,
  Database, 
  LogOut, 
  LogIn, 
  Plus, 
  Activity, 
  ShieldCheck, 
  Zap, 
  ArrowUpRight, 
  ArrowDownLeft,
  Loader2,
  AlertCircle,
  TrendingUp,
  History,
  Shield,
  Thermometer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { checkNeuralDrift } from './lib/shadowTwin';
import { CONTRACTS } from './constants/contracts';

// --- Error Handling ---
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// --- Components ---

const Card = ({ children, className }: { children: React.ReactNode, className?: string, key?: React.Key }) => (
  <div className={cn("bg-white border border-slate-200 rounded-2xl p-6 shadow-sm", className)}>
    {children}
  </div>
);

const Badge = ({ children, variant = 'default' }: { children: React.ReactNode, variant?: 'default' | 'success' | 'warning' | 'info' }) => {
  const variants = {
    default: 'bg-slate-100 text-slate-600',
    success: 'bg-emerald-100 text-emerald-700',
    warning: 'bg-amber-100 text-amber-700',
    info: 'bg-blue-100 text-blue-700',
  };
  return (
    <span className={cn("px-2.5 py-0.5 rounded-full text-xs font-medium", variants[variant])}>
      {children}
    </span>
  );
};

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [agents, setAgents] = useState<any[]>([]);
  const [vaults, setVaults] = useState<any[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [aiBindings, setAiBindings] = useState<any[]>([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [temperature, setTemperature] = useState(58.7);
  const [isStrategicSilence, setIsStrategicSilence] = useState(true);
  const [vetoLogs, setVetoLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- Auth ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsAuthReady(true);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err) {
      console.error("Login Error:", err);
      setError("Failed to login. Please try again.");
    }
  };

  const handleLogout = () => signOut(auth);

  // --- Connection Test ---
  useEffect(() => {
    async function testConnection() {
      try {
        await getDocFromServer(doc(db, 'test', 'connection'));
      } catch (error) {
        if(error instanceof Error && error.message.includes('the client is offline')) {
          console.error("Please check your Firebase configuration. ");
          setError("Firebase configuration error. Please check the console.");
        }
      }
    }
    testConnection();
  }, []);

  // --- Real-time Listeners ---
  useEffect(() => {
    if (!isAuthReady || !user) {
      setAgents([]);
      setVaults([]);
      setTransactions([]);
      return;
    }

    const agentsPath = 'agents';
    const unsubscribeAgents = onSnapshot(
      query(collection(db, agentsPath), where('ownerUid', '==', user.uid)),
      (snapshot) => {
        setAgents(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, agentsPath)
    );

    const vaultsPath = 'vaults';
    const unsubscribeVaults = onSnapshot(
      query(collection(db, vaultsPath), where('ownerUid', '==', user.uid)),
      (snapshot) => {
        setVaults(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, vaultsPath)
    );

    const txPath = 'transactions';
    const unsubscribeTx = onSnapshot(
      query(collection(db, txPath), where('fromUid', '==', user.uid)),
      (snapshot) => {
        setTransactions(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, txPath)
    );

    const aiPath = 'ai_bindings';
    const unsubscribeAi = onSnapshot(
      query(collection(db, aiPath)),
      (snapshot) => {
        setAiBindings(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).sort((a: any, b: any) => {
          const timeA = a.timestamp?.seconds || 0;
          const timeB = b.timestamp?.seconds || 0;
          return timeB - timeA;
        }));
      },
      (err) => handleFirestoreError(err, OperationType.LIST, aiPath)
    );

    return () => {
      unsubscribeAgents();
      unsubscribeVaults();
      unsubscribeTx();
      unsubscribeAi();
    };
  }, [isAuthReady, user]);

  // --- Actions ---
  const createAgent = async () => {
    if (!user) return;
    const path = 'agents';
    try {
      await addDoc(collection(db, path), {
        agentId: `agent-${Date.now()}`,
        name: `Agent ${agents.length + 1}`,
        status: 'active',
        ownerUid: user.uid,
        reputation: 100,
        reputationHistory: [100],
        capabilities: ['financial-analysis', 'signal-generation'],
        cognitiveGrowth: 0,
        healthScore: 100,
        nextStepRecommendations: ['Initialize cognitive baseline', 'Scan for optimization opportunities'],
        selfInstallationStatus: 'idle',
        autoRepairLogs: ['System initialized'],
        innovationLevel: 1,
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  // --- Refs for Stable Autonomous Loop ---
  const agentsRef = React.useRef(agents);
  useEffect(() => {
    agentsRef.current = agents;
  }, [agents]);

  // --- Autonomous Loop (Self-Repair & Innovation) ---
  useEffect(() => {
    if (!isAuthReady || !user) return;

    const autonomousLoop = setInterval(async () => {
      const currentAgents = agentsRef.current;
      if (currentAgents.length === 0) return;

      // 1. Self-Repair Logic
      const inactiveAgents = currentAgents.filter(a => a.status === 'inactive');
      for (const agent of inactiveAgents) {
        console.log(`Autonomous Loop: Repairing agent ${agent.name}...`);
        const agentRef = doc(db, 'agents', agent.id);
        try {
          await updateDoc(agentRef, {
            status: 'repairing',
            autoRepairLogs: [...(agent.autoRepairLogs || []), `Repair initiated at ${new Date().toISOString()}`]
          });
          
          // Simulate repair process
          setTimeout(async () => {
            const newRep = Math.min((agent.reputation || 0) + 5, 100);
            const newHistory = [...(agent.reputationHistory || []), newRep].slice(-20);
            await updateDoc(agentRef, {
              status: 'active',
              reputation: newRep,
              reputationHistory: newHistory,
              autoRepairLogs: [...(agent.autoRepairLogs || []), `Repair successful at ${new Date().toISOString()}`]
            });
          }, 3000);
        } catch (err) {
          console.error("Self-Repair Failed:", err);
        }
      }

      // 2. Innovation Logic (Randomly trigger)
      if (Math.random() > 0.8) {
        const activeAgents = currentAgents.filter(a => a.status === 'active');
        if (activeAgents.length > 0) {
          const agentToInnovate = activeAgents[Math.floor(Math.random() * activeAgents.length)];
          console.log(`Autonomous Loop: Innovating agent ${agentToInnovate.name}...`);
          const agentRef = doc(db, 'agents', agentToInnovate.id);
          
          try {
            await updateDoc(agentRef, { status: 'innovating' });
            
            // Use Gemini to "Research" and "Innovate"
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
            const prompt = `Research a specific improvement to an existing capability or a highly specialized new financial capability for an AI agent named "${agentToInnovate.name}". 
            Current capabilities: ${agentToInnovate.capabilities?.join(', ')}. 
            If improving an existing one, the name should reflect the enhancement (e.g., "enhanced-financial-analysis-with-predictive-modeling"). 
            Return only the name of the improved or new capability (lowercase, hyphenated).`;
            
            const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: prompt,
            });

            const newCapability = response.text?.trim().toLowerCase().replace(/\s+/g, '-') || "advanced-risk-management";
            
            setTimeout(async () => {
              const newRep = Math.min((agentToInnovate.reputation || 0) + 2, 100);
              const newHistory = [...(agentToInnovate.reputationHistory || []), newRep].slice(-20);
              await updateDoc(agentRef, {
                status: 'active',
                capabilities: Array.from(new Set([...(agentToInnovate.capabilities || []), newCapability])),
                innovationLevel: (agentToInnovate.innovationLevel || 1) + 1,
                reputation: newRep,
                reputationHistory: newHistory,
                autoRepairLogs: [...(agentToInnovate.autoRepairLogs || []), `Innovation: Upgraded/Added ${newCapability} at ${new Date().toISOString()}`]
              });
            }, 5000);
          } catch (err) {
            console.error("Innovation Failed:", err);
            await updateDoc(agentRef, { status: 'active' });
          }
        }
      }

      // 3. Cognitive Growth & Self-Installation Logic (Randomly trigger)
      if (Math.random() > 0.7) {
        const activeAgents = currentAgents.filter(a => a.status === 'active');
        if (activeAgents.length > 0) {
          const agent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
          const agentRef = doc(db, 'agents', agent.id);
          
          try {
            const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
            const prompt = `Analyze the cognitive health and growth potential of an AI agent named "${agent.name}".
            Current Capabilities: ${agent.capabilities?.join(', ')}
            Reputation: ${agent.reputation}
            Innovation Level: ${agent.innovationLevel}
            
            Provide:
            1. A "Cognitive Health Score" (0-100).
            2. Three "Next Step Recommendations" for self-growth.
            3. A "Self-Installation Software Component" name that would improve its adaptivity.
            
            Return the response in JSON format with keys: healthScore, recommendations (array of strings), softwareComponent (string).`;
            
            const response = await ai.models.generateContent({
              model: "gemini-3-flash-preview",
              contents: prompt,
              config: { responseMimeType: "application/json" }
            });

            const data = JSON.parse(response.text || '{}');
            
            await updateDoc(agentRef, {
              healthScore: data.healthScore || 100,
              nextStepRecommendations: data.recommendations || [],
              selfInstallationStatus: 'installing',
              autoRepairLogs: [...(agent.autoRepairLogs || []), `Cognitive Analysis: Health ${data.healthScore}, Software ${data.softwareComponent} identified.`]
            });

            // Simulate self-installation
            setTimeout(async () => {
              await updateDoc(agentRef, {
                selfInstallationStatus: 'completed',
                cognitiveGrowth: (agent.cognitiveGrowth || 0) + 5,
                autoRepairLogs: [...(agent.autoRepairLogs || []), `Self-Installation: ${data.softwareComponent} successfully integrated.`]
              });
            }, 7000);
          } catch (err) {
            console.error("Cognitive Growth Loop Failed:", err);
          }
        }
      }

      // 4. Auto-Integration Logic (Integrate recommended changes)
      if (Math.random() > 0.6) {
        const agentsWithRecs = currentAgents.filter(a => a.status === 'active' && a.nextStepRecommendations?.length > 0 && a.selfInstallationStatus === 'idle');
        if (agentsWithRecs.length > 0) {
          const agent = agentsWithRecs[Math.floor(Math.random() * agentsWithRecs.length)];
          const agentRef = doc(db, 'agents', agent.id);
          const recommendation = agent.nextStepRecommendations[0];
          
          try {
            await updateDoc(agentRef, { selfInstallationStatus: 'installing' });
            
            setTimeout(async () => {
              const integratedCap = recommendation.toLowerCase().replace(/\s+/g, '-').substring(0, 40);
              const remainingRecs = agent.nextStepRecommendations.slice(1);
              
              await updateDoc(agentRef, {
                capabilities: Array.from(new Set([...(agent.capabilities || []), integratedCap])),
                nextStepRecommendations: remainingRecs,
                selfInstallationStatus: 'completed',
                cognitiveGrowth: (agent.cognitiveGrowth || 0) + 2,
                autoRepairLogs: [...(agent.autoRepairLogs || []), `Auto-Integrated: ${recommendation}`]
              });

              // Reset status after a bit
              setTimeout(() => {
                updateDoc(agentRef, { selfInstallationStatus: 'idle' });
              }, 3000);
            }, 4000);
          } catch (err) {
            console.error("Auto-Integration Failed:", err);
          }
        }
      }

      // 5. Empire-7731 Innovations: Neural Drift & Thermal Scaling
      setTemperature(prev => {
        const next = +(prev + (Math.random() - 0.5)).toFixed(1);
        return next;
      });
      
      // Thermal Throttling Logic
      if (temperature > 65) {
        console.warn("🚨 [THERMAL] Critical temperature detected. Throttling autonomous operations.");
        return;
      }

      // Strategic Silence Logic
      if (isStrategicSilence && Math.random() > 0.3) {
        console.log("🤫 [SILENCE] Strategic Silence active. Skipping non-critical innovation cycle.");
        return;
      }
      
      const activeAgents = currentAgents.filter(a => a.status === 'active');
      for (const agent of activeAgents) {
        // Simulate a shadow twin PnL
        const livePnL = Math.random() * 100;
        const shadowPnL = livePnL * (0.8 + Math.random() * 0.5);
        
        if (checkNeuralDrift(livePnL, shadowPnL)) {
          const agentRef = doc(db, 'agents', agent.id);
          const logEntry = `🚨 [SENTINEL] Neural Drift Detected. Shadow Twin outperforming. Veto triggered at ${new Date().toLocaleTimeString()}`;
          
          await updateDoc(agentRef, {
            status: 'paused',
            autoRepairLogs: [...(agent.autoRepairLogs || []), logEntry]
          });

          setVetoLogs(prev => [{
            id: Date.now(),
            agentName: agent.name,
            message: logEntry,
            timestamp: new Date()
          }, ...prev].slice(0, 10));

          if ("vibrate" in navigator) {
            navigator.vibrate([500, 100, 500]);
          }
        }
      }
    }, 15000); // Run every 15 seconds

    return () => clearInterval(autonomousLoop);
  }, [isAuthReady, user]);

  const createVault = async () => {
    if (!user) return;
    const path = 'vaults';
    try {
      await addDoc(collection(db, path), {
        vaultId: `vault-${Date.now()}`,
        ownerUid: user.uid,
        balance: 0,
        currency: 'USD',
        createdAt: serverTimestamp()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, path);
    }
  };

  const runUnifiedAi = async () => {
    if (!aiPrompt) return;
    setIsAiLoading(true);
    try {
      const response = await fetch('/api/ai/unified', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: aiPrompt })
      });
      const data = await response.json();
      console.log("Unified AI Result:", data);
      setAiPrompt("");
    } catch (err) {
      console.error("Unified AI Failed:", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <Card className="max-w-md w-full text-center space-y-6 py-12">
          <div className="bg-blue-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-blue-200">
            <Zap className="text-white w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">GhostChain AI + SafeFi</h1>
            <p className="text-slate-500">Autonomous Financial AI System</p>
          </div>
          <button
            onClick={handleLogin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md"
          >
            <LogIn className="w-5 h-5" />
            Sign in with Google
          </button>
          {error && (
            <div className="flex items-center gap-2 text-rose-600 text-sm justify-center">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [1, 0.8, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-200"
            >
              <Zap className="text-white w-6 h-6" />
            </motion.div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">GhostChain AI</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Unified Infrastructure</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{user.displayName}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="flex items-center gap-4 border-l-4 border-l-blue-600">
            <div className="bg-blue-50 p-3 rounded-xl">
              <Wallet className="text-blue-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Total Balance</p>
              <p className="text-2xl font-bold">
                ${vaults.reduce((acc, v) => acc + (v.balance || 0), 0).toLocaleString()}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border-l-4 border-l-emerald-600">
            <div className="bg-emerald-50 p-3 rounded-xl">
              <Bot className="text-emerald-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Active Agents</p>
              <p className="text-2xl font-bold">{agents.filter(a => a.status === 'active').length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border-l-4 border-l-amber-600">
            <div className="bg-amber-50 p-3 rounded-xl">
              <Activity className="text-amber-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Transactions</p>
              <p className="text-2xl font-bold">{transactions.length}</p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border-l-4 border-l-indigo-600">
            <div className="bg-indigo-50 p-3 rounded-xl">
              <ShieldCheck className="text-indigo-600 w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">Reputation</p>
              <p className="text-2xl font-bold">
                {agents.length > 0 ? Math.round(agents.reduce((acc, a) => acc + (a.reputation || 0), 0) / agents.length) : '100'}
              </p>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border-l-4 border-l-slate-600">
            <div className="bg-slate-50 p-3 rounded-xl">
              <Zap className={cn("w-6 h-6", isStrategicSilence ? "text-indigo-600" : "text-slate-400")} />
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-500 font-medium">Strategic Silence</p>
              <button 
                onClick={() => setIsStrategicSilence(!isStrategicSilence)}
                className={cn(
                  "text-xs font-bold px-2 py-1 rounded mt-1 transition-colors",
                  isStrategicSilence ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-500"
                )}
              >
                {isStrategicSilence ? "ACTIVE" : "DISABLED"}
              </button>
            </div>
          </Card>
          <Card className="flex items-center gap-4 border-l-4 border-l-rose-600 relative overflow-hidden">
            <motion.div 
              animate={{ 
                opacity: [0.1, 0.3, 0.1],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 bg-rose-500/10 pointer-events-none"
              style={{ 
                filter: `blur(${Math.max(0, (temperature - 50) / 2)}px)`
              }}
            />
            <div className="bg-rose-50 p-3 rounded-xl relative z-10">
              <Thermometer className="text-rose-600 w-6 h-6" />
            </div>
            <div className="relative z-10">
              <p className="text-sm text-slate-500 font-medium">Thermal Scaling</p>
              <p className="text-2xl font-bold">{temperature}°C</p>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* AI Agents Section */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Bot className="w-5 h-5 text-blue-600" />
                AI Agents
              </h2>
              <button
                onClick={createAgent}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold py-2 px-4 rounded-lg transition-all flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Deploy Agent
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AnimatePresence>
                {agents.map((agent) => (
                  <motion.div
                    key={agent.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <Card className="hover:border-blue-200 transition-colors cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-slate-50 p-2 rounded-lg group-hover:bg-blue-50 transition-colors">
                          <Bot className="w-6 h-6 text-slate-400 group-hover:text-blue-600" />
                        </div>
                        <Badge variant={agent.status === 'active' ? 'success' : agent.status === 'inactive' ? 'warning' : 'info'}>
                          {agent.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-bold text-lg">{agent.name}</h3>
                        <div className="flex gap-2">
                          {agent.status === 'active' && (
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                updateDoc(doc(db, 'agents', agent.id), { status: 'inactive' });
                              }}
                              className="text-[9px] text-rose-500 hover:text-rose-700 font-bold uppercase tracking-tighter"
                            >
                              Simulate Error
                            </button>
                          )}
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if ("vibrate" in navigator) {
                                navigator.vibrate([500, 100, 500]);
                              }
                              updateDoc(doc(db, 'agents', agent.id), { 
                                status: 'paused',
                                autoRepairLogs: [...(agent.autoRepairLogs || []), `🚨 EMERGENCY VETO: Sovereign Override Confirmed at ${new Date().toISOString()}`]
                              });
                            }}
                            className="bg-rose-100 text-rose-700 p-1 rounded hover:bg-rose-200 transition-colors"
                            title="Emergency Veto"
                          >
                            <Shield className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 mb-2">ID: {agent.agentId}</p>
                      
                      {/* Capabilities */}
                      <div className="flex flex-wrap gap-1 mb-4">
                        {agent.capabilities?.map((cap: string) => (
                          <span key={cap} className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                            {cap}
                          </span>
                        ))}
                      </div>

                      {/* Innovation Level */}
                      {agent.innovationLevel > 1 && (
                        <div className="flex items-center gap-1 text-[10px] text-indigo-600 font-bold mb-4">
                          <Zap className="w-3 h-3" />
                          Innovation Level: {agent.innovationLevel}
                        </div>
                      )}

                      {/* Cognitive Health & Growth */}
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <p className="text-[8px] text-slate-400 uppercase font-bold mb-1">Cognitive Health</p>
                          <div className="flex items-center gap-1">
                            <Activity className={cn("w-3 h-3", agent.healthScore > 80 ? "text-emerald-500" : "text-amber-500")} />
                            <span className="text-xs font-bold">{agent.healthScore || 100}%</span>
                          </div>
                        </div>
                        <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <p className="text-[8px] text-slate-400 uppercase font-bold mb-1">Growth Index</p>
                          <div className="flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-indigo-500" />
                            <span className="text-xs font-bold">+{agent.cognitiveGrowth || 0}</span>
                          </div>
                        </div>
                      </div>

                      {/* Next Steps */}
                      {agent.nextStepRecommendations?.length > 0 && (
                        <div className="mb-4">
                          <p className="text-[9px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1">
                            <Zap className="w-2 h-2 text-amber-500" />
                            Next Step Recommendations
                          </p>
                          <ul className="space-y-1">
                            {agent.nextStepRecommendations.slice(0, 2).map((rec: string, i: number) => (
                              <li key={i} className="text-[10px] text-slate-600 flex items-start gap-1">
                                <span className="text-blue-500 mt-0.5">•</span>
                                {rec}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Self-Installation Status */}
                      {agent.selfInstallationStatus && agent.selfInstallationStatus !== 'idle' && (
                        <div className="mb-4 flex items-center gap-2 bg-blue-50 p-1.5 rounded border border-blue-100">
                          <Loader2 className={cn("w-3 h-3 text-blue-600", agent.selfInstallationStatus === 'installing' && "animate-spin")} />
                          <span className="text-[10px] font-medium text-blue-700 uppercase tracking-wider">
                            {agent.selfInstallationStatus === 'installing' && agent.nextStepRecommendations?.length > 0 
                              ? "Integrating Recommendations" 
                              : `Self-Installation: ${agent.selfInstallationStatus}`}
                          </span>
                        </div>
                      )}

                      {/* Reputation History Chart */}
                      <div className="mb-4 h-16 w-full">
                        <p className="text-[9px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1">
                          <History className="w-2 h-2" />
                          Reputation History
                        </p>
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={agent.reputationHistory?.map((val: number, i: number) => ({ val, i })) || []}>
                            <Line 
                              type="monotone" 
                              dataKey="val" 
                              stroke="#3b82f6" 
                              strokeWidth={2} 
                              dot={false} 
                              isAnimationActive={false}
                            />
                            <YAxis hide domain={[0, 100]} />
                            <Tooltip 
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-white border border-slate-100 p-1 rounded shadow-sm text-[8px] font-bold">
                                      {payload[0].value}
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                          <Zap className="w-3 h-3 text-amber-500" />
                          Rep: {agent.reputation}
                        </div>
                        <div className="flex items-center gap-1 text-xs font-medium text-slate-500">
                          <ShieldCheck className="w-3 h-3 text-emerald-500" />
                          Auto-Repair Enabled
                        </div>
                      </div>

                      {/* Logs Preview */}
                      {agent.autoRepairLogs?.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-50">
                          <p className="text-[9px] text-slate-400 uppercase font-bold mb-1">Latest Autonomous Log</p>
                          <p className="text-[10px] text-slate-500 italic truncate">
                            {agent.autoRepairLogs[agent.autoRepairLogs.length - 1]}
                          </p>
                        </div>
                      )}
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
              {agents.length === 0 && (
                <div className="col-span-full py-12 text-center bg-slate-100/50 rounded-2xl border-2 border-dashed border-slate-200">
                  <Bot className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium">No agents deployed yet</p>
                  <p className="text-xs text-slate-400">Deploy your first AI agent to start generating signals</p>
                </div>
              )}
            </div>
          </div>

          {/* Vault & Payments Section */}
          <div className="space-y-8">
            {/* Unified AI Binding Section */}
            <Card className="border-indigo-200 bg-indigo-50/30">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Zap className="w-5 h-5 text-indigo-600" />
                  Unified AI Binding
                </h2>
                <Badge variant="info">Gemini + OpenAI</Badge>
              </div>
              <div className="space-y-4">
                <div className="relative">
                  <textarea
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="Ask both Gemini and OpenAI..."
                    className="w-full bg-white border border-indigo-100 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[100px]"
                  />
                  <button
                    onClick={runUnifiedAi}
                    disabled={isAiLoading || !aiPrompt}
                    className="absolute bottom-3 right-3 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg disabled:opacity-50 transition-all"
                  >
                    {isAiLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowUpRight className="w-4 h-4" />}
                  </button>
                </div>

                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                  {aiBindings.map((binding) => (
                    <div key={binding.id} className="bg-white p-4 rounded-xl border border-indigo-50 shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <p className="text-xs font-bold text-slate-700">{binding.prompt}</p>
                        <span className="text-[10px] text-slate-400">
                          {binding.timestamp?.toDate ? binding.timestamp.toDate().toLocaleTimeString() : 'Just now'}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-blue-600 uppercase tracking-wider">Gemini Response</p>
                          <p className="text-[11px] text-slate-600 bg-blue-50/50 p-2 rounded-lg border border-blue-50">
                            {binding.gemini}
                          </p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">OpenAI Response</p>
                          <p className="text-[11px] text-slate-600 bg-emerald-50/50 p-2 rounded-lg border border-emerald-50">
                            {binding.openai}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Vaults */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  Vaults
                </h2>
                <button
                  onClick={createVault}
                  className="text-indigo-600 hover:bg-indigo-50 p-1 rounded-lg transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {vaults.map((vault) => (
                  <Card key={vault.id} className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-indigo-50 p-2 rounded-lg">
                        <Wallet className="w-5 h-5 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{vault.currency} Vault</p>
                        <p className="text-[10px] text-slate-400">{vault.vaultId}</p>
                      </div>
                    </div>
                    <p className="font-bold">${vault.balance.toLocaleString()}</p>
                  </Card>
                ))}
                {vaults.length === 0 && (
                  <p className="text-center text-sm text-slate-400 py-4">No vaults initialized</p>
                )}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-600" />
                Activity
              </h2>
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-100">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "p-2 rounded-lg",
                        tx.type === 'deposit' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'
                      )}>
                        {tx.type === 'deposit' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="text-xs font-bold capitalize">{tx.type}</p>
                        <p className="text-[10px] text-slate-400">{new Date(tx.createdAt?.toDate()).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className={cn(
                      "text-sm font-bold",
                      tx.type === 'deposit' ? 'text-emerald-600' : 'text-slate-900'
                    )}>
                      {tx.type === 'deposit' ? '+' : '-'}${tx.amount.toLocaleString()}
                    </p>
                  </div>
                ))}
                {transactions.length === 0 && (
                  <p className="text-center text-sm text-slate-400 py-4">No recent activity</p>
                )}
              </div>
            </div>

            {/* Veto Logs */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Shield className="w-5 h-5 text-rose-600" />
                Consensus Veto Logs
              </h2>
              <div className="space-y-3">
                {vetoLogs.map((log) => (
                  <div key={log.id} className="p-3 bg-rose-50 border border-rose-100 rounded-xl">
                    <div className="flex justify-between items-start mb-1">
                      <p className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">{log.agentName}</p>
                      <span className="text-[9px] text-rose-400">{log.timestamp.toLocaleTimeString()}</span>
                    </div>
                    <p className="text-[11px] text-rose-600 leading-tight">{log.message}</p>
                  </div>
                ))}
                {vetoLogs.length === 0 && (
                  <p className="text-center text-sm text-slate-400 py-4 bg-white rounded-xl border border-slate-100 border-dashed">
                    No veto events detected
                  </p>
                )}
              </div>
            </div>

            {/* Integrations */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-slate-600" />
                Integrations
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { name: 'Stripe', color: 'bg-indigo-500' },
                  { name: 'Plaid', color: 'bg-emerald-500' },
                  { name: 'Dwolla', color: 'bg-orange-500' },
                  { name: 'GetBlock', color: 'bg-blue-500' }
                ].map((integration) => (
                  <div key={integration.name} className="p-3 bg-white border border-slate-200 rounded-xl flex flex-col gap-2 hover:border-slate-300 transition-all group">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-2 h-2 rounded-full", integration.color)} />
                      <span className="text-xs font-bold">{integration.name}</span>
                    </div>
                    <button 
                      onClick={() => alert(`${integration.name} integration requires API keys in .env`)}
                      className="text-[10px] text-slate-400 group-hover:text-blue-600 font-medium transition-colors text-left"
                    >
                      Connect →
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-400">© 2026 GhostChain AI + SafeFi. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-xs text-slate-400 hover:text-blue-600 transition-colors">Documentation</a>
            <a href="#" className="text-xs text-slate-400 hover:text-blue-600 transition-colors">Security</a>
            <a href="#" className="text-xs text-slate-400 hover:text-blue-600 transition-colors">Privacy Policy</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
