import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Beaker, FlaskConical, Dna, Zap, Shield, Target, Cpu, ChevronRight, Binary, AlertTriangle } from 'lucide-react';
import { cn } from '../lib/utils';

interface Trait {
  id: string;
  name: string;
  description: string;
  complexity: number;
  impact: {
    risk: number;
    yield: number;
    logic: number;
  };
  icon: React.ReactNode;
}

const TRAITS: Trait[] = [
  { 
    id: 'neural_drift', 
    name: 'Neural Drift', 
    description: 'Enables high-frequency speculative execution.', 
    complexity: 12,
    impact: { risk: 15, yield: 25, logic: -5 },
    icon: <Zap className="w-4 h-4 text-cyan-400" />
  },
  { 
    id: 'quantum_gate', 
    name: 'Quantum Gate', 
    description: 'Zero-latency cross-chain settlement logic.', 
    complexity: 25,
    impact: { risk: -10, yield: 15, logic: 20 },
    icon: <Shield className="w-4 h-4 text-emerald-400" />
  },
  { 
    id: 'shadow_ledger', 
    name: 'Shadow Ledger', 
    description: 'Anonymized transaction masking for stealth yield.', 
    complexity: 18,
    impact: { risk: 5, yield: 10, logic: 10 },
    icon: <Binary className="w-4 h-4 text-purple-400" />
  },
  { 
    id: 'adversarial_logic', 
    name: 'Adversarial Logic', 
    description: 'Front-runs predatory MEV bots on L2 nodes.', 
    complexity: 30,
    impact: { risk: 20, yield: 40, logic: 15 },
    icon: <Target className="w-4 h-4 text-red-500" />
  },
  { 
    id: 'sentinel_core', 
    name: 'Sentinel Core', 
    description: 'Immutable defense protocols against exploit vectors.', 
    complexity: 20,
    impact: { risk: -25, yield: -5, logic: 30 },
    icon: <Shield className="w-4 h-4 text-blue-400" />
  }
];

export function AgentLab() {
  const [selectedTraits, setSelectedTraits] = useState<string[]>([]);
  const [isForging, setIsForging] = useState(false);
  const [lastAgent, setLastAgent] = useState<any>(null);

  const totalImpact = selectedTraits.reduce((acc, id) => {
    const trait = TRAITS.find(t => t.id === id);
    if (!trait) return acc;
    return {
      risk: acc.risk + trait.impact.risk,
      yield: acc.yield + trait.impact.yield,
      logic: acc.logic + trait.impact.logic,
      complexity: acc.complexity + trait.complexity
    };
  }, { risk: 10, yield: 10, logic: 10, complexity: 0 });

  const toggleTrait = (id: string) => {
    if (selectedTraits.includes(id)) {
      setSelectedTraits(prev => prev.filter(t => t !== id));
    } else if (selectedTraits.length < 3) {
      setSelectedTraits(prev => [...prev, id]);
    }
  };

  const handleForge = async () => {
    if (selectedTraits.length === 0) return;
    setIsForging(true);
    
    // Simulate complex forging
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const newAgent = {
      id: `GHOST-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
      traits: selectedTraits.map(id => TRAITS.find(t => t.id === id)?.name),
      stats: totalImpact,
      timestamp: new Date().toLocaleTimeString()
    };
    
    setLastAgent(newAgent);
    setIsForging(false);
    setSelectedTraits([]);
  };

  return (
    <div className="h-full bg-slate-950 p-8 flex flex-col gap-8 relative overflow-hidden">
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-red-600/5 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-400/5 blur-[120px] rounded-full" />

      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        {/* Traits selection column */}
        <div className="lg:col-span-5 space-y-6">
           <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-red-600/20 rounded-xl">
                    <Beaker className="w-5 h-5 text-red-500" />
                 </div>
                 <h2 className="text-xl font-black text-white px-2 tracking-[0.2em] uppercase italic bg-gradient-to-r from-white to-white/50 bg-clip-text text-transparent">Agent <span className="text-red-600">Synthesis Lab</span></h2>
              </div>
              <p className="text-slate-500 font-mono text-[9px] uppercase tracking-[0.3em] pl-12 italic">CCTP V2 Genetic Modification Protocol</p>
           </div>

           <div className="grid grid-cols-1 gap-3">
              {TRAITS.map((trait) => {
                 const isSelected = selectedTraits.includes(trait.id);
                 return (
                    <motion.button
                       key={trait.id}
                       onClick={() => toggleTrait(trait.id)}
                       whileHover={{ x: 4 }}
                       whileTap={{ scale: 0.98 }}
                       className={cn(
                          "p-4 rounded-2xl border text-left transition-all relative group",
                          isSelected 
                            ? "bg-red-600/10 border-red-600/50 shadow-[0_0_20px_rgba(220,10,10,0.1)]" 
                            : "bg-white/[0.02] border-white/5 hover:border-white/10"
                       )}
                    >
                       <div className="flex items-center gap-4">
                          <div className={cn(
                             "w-10 h-10 rounded-xl flex items-center justify-center transition-colors",
                             isSelected ? "bg-red-600 text-white" : "bg-white/5 text-slate-500"
                          )}>
                             {trait.icon}
                          </div>
                          <div className="flex-1">
                             <div className="flex justify-between items-center mb-1">
                                <span className={cn("text-xs font-black uppercase tracking-widest", isSelected ? "text-white" : "text-slate-400")}>{trait.name}</span>
                                <span className="text-[10px] font-mono text-slate-600">REQ: {trait.complexity}λ</span>
                             </div>
                             <p className="text-[10px] text-slate-500 leading-tight pr-4">{trait.description}</p>
                          </div>
                          {isSelected && <Zap className="w-3 h-3 text-red-600 absolute bottom-4 right-4" />}
                       </div>
                    </motion.button>
                 );
              })}
           </div>

           <div className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-slate-500">
                 <span>Synthesis Matrix</span>
                 <span className={cn(selectedTraits.length === 3 ? "text-red-500" : "text-white")}>{selectedTraits.length} / 3</span>
              </div>
              <div className="flex gap-2">
                 {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={cn(
                       "flex-1 h-1.5 rounded-full",
                       i < selectedTraits.length ? "bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.5)]" : "bg-white/5"
                    )} />
                 ))}
              </div>
           </div>
        </div>

        {/* Synthesis display column */}
        <div className="lg:col-span-7 flex flex-col gap-8">
           <div className="bg-black/40 border border-white/5 rounded-[2.5rem] p-10 flex-1 flex flex-col relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                 <Dna className="w-64 h-64 text-white" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex justify-between items-start mb-12">
                    <div>
                       <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Neuro-Genetic <span className="text-red-600">Synthesis</span></h3>
                       <p className="text-xs text-slate-400 font-mono italic">Hyper-Threaded Simulation Output</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="text-right">
                          <p className="text-[9px] font-black text-slate-500 uppercase">Resilience</p>
                          <p className={cn("text-xl font-mono font-black", totalImpact.risk < 0 ? "text-emerald-500" : "text-red-500")}>
                             {totalImpact.risk > 0 ? `+${totalImpact.risk}` : totalImpact.risk}%
                          </p>
                       </div>
                       <div className="text-right">
                          <p className="text-[9px] font-black text-slate-500 uppercase">Yield Potentiation</p>
                          <p className="text-xl font-mono text-cyan-400 font-black">+{totalImpact.yield}%</p>
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                       <motion.div 
                          animate={{ 
                             rotate: [0, 360],
                             scale: isForging ? [1, 1.2, 1] : 1
                          }}
                          transition={{ 
                             rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                             scale: { duration: 1, repeat: Infinity }
                          }}
                          className="w-64 h-64 border-2 border-dashed border-white/10 rounded-full"
                       />
                       <motion.div 
                          animate={{ rotate: [-0, -360] }}
                          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                          className="w-48 h-48 border border-red-600/20 rounded-full"
                       />
                    </div>

                    <AnimatePresence mode="wait">
                       {isForging ? (
                          <motion.div 
                             initial={{ opacity: 0, scale: 0.8 }}
                             animate={{ opacity: 1, scale: 1 }}
                             exit={{ opacity: 0, scale: 1.2 }}
                             className="text-center space-y-6 z-10"
                          >
                             <div className="relative">
                                <FlaskConical className="w-20 h-20 text-red-600 mx-auto animate-bounce" />
                                <motion.div 
                                   animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.6, 0.3] }}
                                   transition={{ duration: 0.5, repeat: Infinity }}
                                   className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-red-600/20 blur-2xl rounded-full"
                                />
                             </div>
                             <div className="space-y-1">
                                <p className="text-xl font-black text-white tracking-[0.3em] italic uppercase">Synthesizing...</p>
                                <p className="text-[10px] font-mono text-red-500 animate-pulse">ALIGNED WITH GHOSTCHAIN PROTOCOL_8004</p>
                             </div>
                          </motion.div>
                       ) : lastAgent ? (
                          <motion.div 
                             initial={{ opacity: 0, scale: 0.9 }}
                             animate={{ opacity: 1, scale: 1 }}
                             className="z-10 bg-white/[0.03] border border-white/10 p-8 rounded-[2rem] w-full max-w-sm backdrop-blur-md shadow-2xl"
                          >
                             <div className="flex items-center gap-4 mb-6">
                                <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]">
                                   <Cpu className="w-6 h-6" />
                                </div>
                                <div>
                                   <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Prototype Hash</p>
                                   <p className="text-lg font-black text-white italic">{lastAgent.id}</p>
                                </div>
                             </div>

                             <div className="space-y-3 mb-8">
                                {lastAgent.traits.map((t: string, i: number) => (
                                   <div key={i} className="flex items-center gap-3 text-[10px] font-bold text-slate-300 uppercase tracking-widest">
                                      <ChevronRight className="w-3 h-3 text-red-600" /> {t}
                                   </div>
                                ))}
                             </div>

                             <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/10">
                                <div>
                                   <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Logic Efficiency</p>
                                   <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                      <div className="h-full bg-cyan-400" style={{ width: `${Math.min(100, lastAgent.stats.logic * 2)}%` }} />
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Node Resonance</p>
                                   <p className="text-xs font-mono text-white">94.82%</p>
                                </div>
                             </div>
                          </motion.div>
                       ) : (
                          <div className="text-center space-y-4 opacity-40">
                             <Dna className="w-20 h-20 text-white mx-auto" />
                             <p className="text-xs font-black text-white uppercase tracking-[0.2em] italic">Awaiting Genetic Sequence</p>
                          </div>
                       )}
                    </AnimatePresence>
                 </div>

                 <div className="flex justify-center gap-8 mt-12">
                    <button 
                       onClick={handleForge}
                       disabled={selectedTraits.length === 0 || isForging}
                       className={cn(
                          "px-12 py-5 rounded-3xl font-black uppercase tracking-[0.4em] italic text-sm transition-all relative overflow-hidden group",
                          selectedTraits.length > 0 
                            ? "bg-red-600 text-white shadow-[0_0_40px_rgba(220,38,38,0.3)] hover:scale-105 active:scale-95" 
                            : "bg-white/5 text-slate-700 cursor-not-allowed"
                       )}
                    >
                       <span className="relative z-10 flex items-center gap-3">
                          {isForging ? "Calibrating..." : "Execute Forge"} <Zap size={16} />
                       </span>
                       {selectedTraits.length > 0 && (
                          <motion.div 
                             initial={{ x: '-100%' }}
                             animate={{ x: '100%' }}
                             transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                             className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                          />
                       )}
                    </button>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-2xl flex gap-4 items-start">
                 <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />
                 <div>
                    <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-1">Drift Conflict Warning</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed italic">Combining Adversarial Logic with Neural Drift may increase entropy cascade risk by 14%.</p>
                 </div>
              </div>
              <div className="p-6 bg-cyan-500/5 border border-cyan-500/10 rounded-2xl flex gap-4 items-start">
                 <FlaskConical className="w-5 h-5 text-cyan-400 shrink-0" />
                 <div>
                    <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-1">Optimized Pairing</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed italic">Quantum Gate resonance improves with Sentinel Core activation for maximum vault safety.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
