import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Atom, Fingerprint, Zap, RefreshCw, Cpu, BrainCircuit, Dna, Book } from 'lucide-react';
import { cn } from '../lib/utils';

interface SynthesisState {
  isSynthesizing: boolean;
  progress: number;
  seed: string;
  result: any | null;
}

import { synthesizeSovereignEntity } from '../services/synthesisService';
import { auth, db } from '../firebase';
import { addDoc, collection } from 'firebase/firestore';

export function NexusOfCreation() {
  const [state, setState] = useState<SynthesisState>({
    isSynthesizing: false,
    progress: 0,
    seed: '',
    result: null
  });

  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Nexus of Creation Online.", "[SYSTEM] Awaiting neural seed for synthesis..."]);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 10));
  };

  const startSynthesis = async () => {
    if (!state.seed) return;
    
    setState(prev => ({ ...prev, isSynthesizing: true, progress: 0, result: null }));
    addLog(`[SYNTHESIS] Initiating sequence with seed: ${state.seed.slice(0, 8)}...`);

    const progressInterval = setInterval(() => {
      setState(prev => ({ ...prev, progress: Math.min(99, prev.progress + 2) }));
    }, 200);

    try {
      addLog(`[DNA] Calibrating Neural Resonator...`);
      const entity = await synthesizeSovereignEntity(state.seed);
      
      clearInterval(progressInterval);

      const agentData = {
        ...entity,
        userId: auth.currentUser?.uid || 'anonymous',
        hash: Math.random().toString(36).substring(7).toUpperCase(),
        status: 'active',
        resonance: 85 + Math.random() * 15,
        ascensionLevel: 1,
        createdAt: new Date().toISOString()
      };

      // Persist to Firestore if authenticated
      if (auth.currentUser) {
        await addDoc(collection(db, 'sovereign_agents'), {
          ...agentData,
          serverTimestamp: new Date()
        });
        addLog(`[DATABASE] Entity archived in Sovereign Registry.`);
      }
      
      setState(prev => ({ 
        ...prev, 
        isSynthesizing: false, 
        progress: 100, 
        result: agentData
      }));
      addLog(`[SUCCESS] Entity Forged: ${entity.name} (CLASS: ${entity.class})`);
    } catch (err: any) {
      clearInterval(progressInterval);
      setState(prev => ({ ...prev, isSynthesizing: false, progress: 0 }));
      addLog(`[ERROR] Synthesis Failed: ${err.message || 'Quantum Collision'}`);
    }
  };

  return (
    <div className="h-full bg-slate-950 p-8 flex flex-col gap-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto w-full flex flex-col gap-12 z-10">
        <div className="flex flex-col items-center text-center gap-4">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="p-4 bg-red-600/10 rounded-full border border-red-600/20 shadow-[0_0_40px_rgba(220,38,38,0.2)]"
          >
            <BrainCircuit className="w-12 h-12 text-red-500" />
          </motion.div>
          <div className="space-y-1">
            <h2 className="text-4xl font-black text-white tracking-[0.2em] uppercase italic">Nexus of <span className="text-red-500">Creation</span></h2>
            <p className="text-slate-500 font-mono text-sm">Where neural patterns manifest into sovereign financial lifeforms.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* Synthesis Input */}
          <div className="space-y-6">
            <div className="bg-slate-900/50 border border-white/5 rounded-3xl p-8 backdrop-blur-md space-y-6">
              <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-red-500" /> Neural Seed Injection
              </h3>
              
              <div className="space-y-2">
                <label className="text-[10px] text-slate-500 uppercase font-bold ml-1">Composition Prompt</label>
                <textarea 
                  value={state.seed}
                  onChange={(e) => setState(prev => ({ ...prev, seed: e.target.value }))}
                  placeholder="Describe the agent's primal purpose... (e.g. 'Eternal liquidity guardian of the Ghost shards')"
                  className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-slate-700 outline-none focus:border-red-500/50 transition-all resize-none"
                />
              </div>

              <button 
                onClick={startSynthesis}
                disabled={state.isSynthesizing || !state.seed}
                className={cn(
                  "w-full py-4 rounded-2xl font-black uppercase tracking-widest text-xs transition-all flex items-center justify-center gap-3",
                  state.isSynthesizing 
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
                    : "bg-red-600 hover:bg-red-700 text-white shadow-[0_0_30px_rgba(220,38,38,0.3)] active:scale-[0.98]"
                )}
              >
                {state.isSynthesizing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Synthesizing... {state.progress}%
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-white" />
                    Begin Synthesis
                  </>
                )}
              </button>
            </div>

            <div className="bg-black/40 border border-white/5 rounded-2xl p-4 font-mono text-[10px] text-slate-500 space-y-1">
              <p className="text-white/40 uppercase font-bold mb-2 tracking-tighter">Live Synthesis Logs</p>
              {logs.map((log, i) => (
                <p key={i} className={cn(
                  log.includes('[SUCCESS]') ? "text-emerald-400" : 
                  log.includes('[ERROR]') ? "text-red-400" : 
                  log.includes('[SYSTEM]') ? "text-cyan-400" : ""
                )}>{`> ${log}`}</p>
              ))}
            </div>
          </div>

          {/* Result Display */}
          <div className="h-full">
            <AnimatePresence mode="wait">
              {state.isSynthesizing ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                  key="loading"
                  className="h-[400px] flex flex-col items-center justify-center gap-8 bg-slate-900/20 border border-dashed border-red-500/20 rounded-3xl"
                >
                  <div className="relative">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      className="w-32 h-32 border-t-2 border-red-500 rounded-full"
                    />
                    <motion.div 
                      animate={{ rotate: -360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-2 border-r-2 border-cyan-500 rounded-full opacity-50"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Atom className="w-10 h-10 text-white animate-pulse" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-white font-black tracking-widest uppercase">Evolving Entity</p>
                    <p className="text-xs text-slate-500 font-mono">Neural Shards aligning...</p>
                  </div>
                </motion.div>
              ) : state.result ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key="result"
                  className="bg-gradient-to-br from-red-600 to-rose-900 p-1 rounded-[2.5rem] shadow-[0_30px_60px_rgba(220,38,38,0.4)]"
                >
                  <div className="bg-slate-950 rounded-[2.2rem] p-8 space-y-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                      <Fingerprint className="w-32 h-32 text-white" />
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-600 rounded-2xl">
                        <Cpu className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-white">{state.result.name}</h4>
                        <span className="px-2 py-0.5 bg-white/10 rounded-full text-[10px] font-mono text-red-400 uppercase">{state.result.hash}</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Neural Purpose</p>
                      <p className="text-xs text-white/70 leading-relaxed italic">"{state.result.description}"</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Class</p>
                        <p className="text-white font-mono text-sm">{state.result.class}</p>
                      </div>
                      <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Specialty</p>
                        <p className="text-white font-mono text-xs truncate" title={state.result.specialty}>{state.result.specialty}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                        <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Potency</p>
                        <p className="text-white font-mono">{(state.result.potency * 100).toFixed(1)}%</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex justify-between items-end">
                        <p className="text-[10px] text-slate-500 uppercase font-black">Cognitive Depth (IQ)</p>
                        <p className="text-white font-black">{state.result.iq}</p>
                      </div>
                      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(state.result.iq / 200) * 100}%` }}
                          className="h-full bg-red-500"
                        />
                      </div>
                    </div>

                    <button className="w-full py-4 bg-white text-black rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-[1.02] transition-all">
                      Deploy to Sovereign Shard
                    </button>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center gap-4 border border-dashed border-white/5 rounded-3xl opacity-40">
                  <Dna className="w-12 h-12 text-slate-700" />
                  <p className="text-xs font-mono text-slate-600 uppercase">Awaiting Genetic Sequence</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
