import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Atom, Zap, RefreshCw, Activity, Shield, TrendingUp, Sliders } from 'lucide-react';
import { cn } from '../lib/utils';
import { AreaChart, Area, ResponsiveContainer, YAxis } from 'recharts';

export function QuantumSimEngine() {
  const [drift, setDrift] = useState(1.0);
  const [isUpdating, setIsUpdating] = useState(false);
  const [simData, setSimData] = useState<{ time: number; value: number }[]>([]);
  const [metrics, setMetrics] = useState({
    resonance: 98.4,
    entropy: 0.12,
    syncRate: 100
  });

  useEffect(() => {
    // Generate initial noise
    const initial = Array.from({ length: 40 }).map((_, i) => ({
      time: i,
      value: 100 + (Math.random() - 0.5) * 5
    }));
    setSimData(initial);

    const interval = setInterval(() => {
      setSimData(prev => {
        const last = prev[prev.length - 1];
        const noise = (Math.random() - 0.5) * 4;
        const driftEffect = (drift - 1.0) * 15;
        const newValue = Math.max(0, last.value + noise + driftEffect);
        const next = [...prev.slice(1), { time: last.time + 1, value: newValue }];
        
        // Update metrics based on drift
        setMetrics({
            resonance: Math.max(0, 98.4 - (Math.abs(drift - 1) * 20)),
            entropy: 0.12 + (Math.abs(drift - 1) * 0.88),
            syncRate: Math.max(0, 100 - (Math.abs(drift - 1) * 30))
        });
        
        return next;
      });
    }, 200);

    return () => clearInterval(interval);
  }, [drift]);

  const updateDrift = async (val: number) => {
    setDrift(val);
    setIsUpdating(true);
    try {
      await fetch('/api/sovereign/quantum-shift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ factor: val })
      });
    } catch (err) {
      console.error("Failed to update quantum drift");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="h-full bg-slate-950 p-8 flex flex-col gap-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-cyan-500/5 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2" />
      
      <div className="max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        {/* Left Column: Controls */}
        <div className="lg:col-span-4 space-y-8">
           <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <Atom className="w-5 h-5 text-cyan-400" />
                 </div>
                 <h2 className="text-xl font-black text-white uppercase tracking-widest italic">Quantum <span className="text-cyan-400">Sim Engine</span></h2>
              </div>
              <p className="text-slate-500 font-mono text-[10px] uppercase tracking-widest">Temporal Reality Simulation & Market Warping</p>
           </div>

           <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl space-y-10">
              <div className="space-y-6">
                 <div className="flex justify-between items-center">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                       <Sliders className="w-4 h-4 text-cyan-400" /> Drift Calibration
                    </h3>
                    {isUpdating && <RefreshCw className="w-3 h-3 text-cyan-400 animate-spin" />}
                 </div>

                 <div className="space-y-8">
                    <div className="space-y-4">
                       <div className="flex justify-between text-[10px] font-mono">
                          <span className="text-slate-500">RESISTANCE (BULL)</span>
                          <span className={cn("text-white font-black", drift > 1.5 ? "text-red-500" : drift > 1.2 ? "text-amber-500" : "text-emerald-500")}>
                             {drift.toFixed(3)}x
                          </span>
                       </div>
                       <input 
                         type="range"
                         min="0.5"
                         max="2.0"
                         step="0.001"
                         value={drift}
                         onChange={(e) => updateDrift(parseFloat(e.target.value))}
                         className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-cyan-400"
                       />
                       <div className="flex justify-between text-[8px] font-mono text-slate-700">
                          <span>0.500 (ENTROPY)</span>
                          <span>1.000 (EQUILIBRIUM)</span>
                          <span>2.000 (SINGULARITY)</span>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="pt-8 border-t border-white/5 grid grid-cols-1 gap-4">
                 <div className="p-6 bg-black/40 border border-white/5 rounded-2xl space-y-2">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Simulation Impact</p>
                    <p className="text-sm text-white font-mono">
                       {drift > 1.05 ? "Projecting Hyper-Yield expansion across all shards." : 
                        drift < 0.95 ? "Cascading liquidity contraction detected. Vaults in safe-mode." : 
                        "Steady state resonance achieved."}
                    </p>
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sync Health</span>
                 </div>
                 <span className="text-xs font-mono font-bold text-white">{metrics.syncRate}%</span>
              </div>
              <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cognitive Pulse</span>
                 </div>
                 <span className="text-xs font-mono font-bold text-white">{metrics.resonance.toFixed(1)}%</span>
              </div>
           </div>
        </div>

        {/* Right Column: Visualization */}
        <div className="lg:col-span-8 space-y-8">
           <div className="bg-black/60 border border-white/5 rounded-[2.5rem] p-8 h-[500px] relative overflow-hidden backdrop-blur-xl">
              <div className="absolute top-0 right-0 p-8 opacity-20 pointer-events-none">
                 <Activity className="w-48 h-48 text-cyan-400/20" />
              </div>
              
              <div className="relative z-10 flex flex-col h-full">
                 <div className="flex items-start justify-between mb-12">
                    <div>
                       <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Live Waveform <span className="text-cyan-400">Analysis</span></h3>
                       <p className="text-xs text-slate-500 font-mono">Neural Shard Output // High-Frequency Drift Sampling</p>
                    </div>
                    <div className="flex items-center gap-4">
                       <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black text-slate-500 uppercase">Entropy</span>
                          <span className="text-lg font-mono text-rose-500 font-black">{metrics.entropy.toFixed(3)}</span>
                       </div>
                       <div className="w-px h-8 bg-white/10" />
                       <div className="flex flex-col items-end">
                          <span className="text-[9px] font-black text-slate-500 uppercase">Yield Velocity</span>
                          <span className="text-lg font-mono text-emerald-500 font-black">+{((drift - 1) * 100).toFixed(1)}%</span>
                       </div>
                    </div>
                 </div>

                 <div className="flex-1 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={simData}>
                          <defs>
                             <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <YAxis domain={['auto', 'auto']} hide />
                          <Area 
                            type="monotone" 
                            dataKey="value" 
                            stroke="#22d3ee" 
                            strokeWidth={3} 
                            fill="url(#simGrad)" 
                            animationDuration={0}
                            isAnimationActive={false}
                          />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>

                 <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, i) => (
                       <div key={i} className="space-y-1">
                          <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                             <motion.div 
                                animate={{ x: ["-100%", "100%"] }}
                                transition={{ duration: 2 + i, repeat: Infinity, ease: "linear" }}
                                className="w-full h-full bg-cyan-400/30"
                             />
                          </div>
                          <p className="text-[8px] font-mono text-slate-600 uppercase">Shard Node 0{i+1}</p>
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/[0.01] border border-white/5 rounded-3xl text-center space-y-4">
                 <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mx-auto">
                    <Zap className="w-6 h-6 text-emerald-400" />
                 </div>
                 <h4 className="text-sm font-black text-white uppercase tracking-widest">Resonance Peak</h4>
                 <p className="text-xs text-slate-500 leading-relaxed italic">"When nodes align with the quantum frequency, the GhostChain achieves total financial sovereignty."</p>
              </div>
              <div className="p-8 bg-white/[0.01] border border-white/5 rounded-3xl text-center space-y-4">
                 <div className="w-12 h-12 bg-red-500/20 rounded-2xl flex items-center justify-center mx-auto">
                    <Shield className="w-6 h-6 text-red-500" />
                 </div>
                 <h4 className="text-sm font-black text-white uppercase tracking-widest">Entropy Shield</h4>
                 <p className="text-xs text-slate-500 leading-relaxed italic">"System-wide failsafes are dynamically hardening as drift factor modulates beyond 1.25x parameters."</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
