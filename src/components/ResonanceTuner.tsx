import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radio, Activity, Waves, Zap, ShieldCheck, HeartPulse, Settings2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function ResonanceTuner() {
  const [userFreq, setUserFreq] = useState(50);
  const [targetFreq, setTargetFreq] = useState(72);
  const [alignment, setAlignment] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [history, setHistory] = useState<number[]>([]);

  useEffect(() => {
    const diff = Math.abs(userFreq - targetFreq);
    const newAlignment = Math.max(0, 100 - diff * 2);
    setAlignment(newAlignment);

    if (newAlignment > 98) {
      if (!isLocked) {
        setIsLocked(true);
        // Trigger specific system event
      }
    } else {
      setIsLocked(false);
    }
  }, [userFreq, targetFreq]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTargetFreq(prev => {
        const jitter = (Math.random() - 0.5) * 5;
        const newTarget = Math.max(20, Math.min(80, prev + jitter));
        return newTarget;
      });
      
      setHistory(prev => {
        const next = [...prev, alignment];
        return next.length > 20 ? next.slice(1) : next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [alignment]);

  return (
    <div className="h-full bg-slate-950 p-8 flex flex-col gap-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-500/5 blur-[120px] rounded-full translate-x-1/2 -translate-y-1/2" />
      
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col gap-12 z-10 pt-12">
        <div className="text-center space-y-4">
           <div className="inline-flex items-center gap-3 px-6 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-4">
              <Radio className="w-4 h-4 text-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] italic">Neural Handshake Active</span>
           </div>
           <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter">Resonance <span className="text-emerald-500">Tuner</span></h2>
           <p className="text-slate-500 font-mono text-xs uppercase tracking-widest max-w-md mx-auto leading-relaxed"> Align your synaptic frequency with the GhostChain core to unlock sovereign yield optimizations.</p>
        </div>

        <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
           {/* Visualizer Area */}
           <div className="relative aspect-square flex items-center justify-center">
              <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-full h-full border border-white/5 rounded-full flex items-center justify-center">
                    <div className="w-[80%] h-[80%] border border-white/5 rounded-full flex items-center justify-center">
                       <div className="w-[60%] h-[60%] border border-white/5 rounded-full flex items-center justify-center" />
                    </div>
                 </div>
              </div>

              {/* Target Frequency Ring */}
              <motion.div 
                animate={{ scale: [0.95, 1.05, 0.95], rotate: 360 }}
                transition={{ scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }, rotate: { duration: 20, repeat: Infinity, ease: "linear"} }}
                style={{ width: `${targetFreq}%`, height: `${targetFreq}%` }}
                className="absolute border-2 border-emerald-500/20 rounded-full pointer-events-none"
              />

              {/* User Frequency Ring */}
              <motion.div 
                animate={{ 
                  scale: userFreq / 50,
                  borderColor: alignment > 90 ? 'rgba(16, 185, 129, 0.8)' : 'rgba(16, 185, 129, 0.2)',
                  boxShadow: alignment > 95 ? '0 0 40px rgba(16, 185, 129, 0.4)' : 'none'
                }}
                className="absolute rounded-full border-4 border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm z-10 transition-all duration-300"
                style={{ width: `70%`, height: `70%` }}
              />

              <div className="z-20 text-center">
                 <AnimatePresence mode="wait">
                    {isLocked ? (
                       <motion.div 
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 1.5 }}
                          className="flex flex-col items-center gap-2"
                       >
                          <ShieldCheck className="w-20 h-20 text-emerald-500 drop-shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                          <span className="text-2xl font-black text-emerald-500 uppercase tracking-widest italic animate-pulse">Sync_Locked</span>
                       </motion.div>
                    ) : (
                       <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="space-y-1"
                       >
                          <p className="text-4xl font-black text-white font-mono">{alignment.toFixed(1)}%</p>
                          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Alignment</p>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
           </div>

           {/* Controls Area */}
           <div className="space-y-12 bg-white/[0.01] border border-white/5 p-10 rounded-[3rem] backdrop-blur-xl">
              <div className="space-y-8">
                 <div className="flex justify-between items-center px-2">
                    <div className="flex items-center gap-3">
                       <Settings2 className="w-4 h-4 text-slate-500" />
                       <span className="text-xs font-black text-white uppercase tracking-widest italic">Signal Control</span>
                    </div>
                    <span className="text-xs font-mono text-emerald-500">{userFreq.toFixed(2)} Hz</span>
                 </div>
                 
                 <div className="space-y-4">
                    <input 
                       type="range"
                       min="20"
                       max="80"
                       step="0.01"
                       value={userFreq}
                       onChange={(e) => setUserFreq(parseFloat(e.target.value))}
                       className="w-full h-2 bg-white/10 rounded-full appearance-none cursor-pointer accent-emerald-500"
                    />
                    <div className="flex justify-between text-[8px] font-mono text-slate-700 uppercase tracking-widest">
                       <span>Low Pass</span>
                       <span>Mid Range</span>
                       <span>High Phase</span>
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                 <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                       <HeartPulse className="w-3 h-3 text-rose-500" />
                       <span className="text-[9px] font-black text-slate-500 uppercase">Core Stability</span>
                    </div>
                    <p className="text-lg font-mono font-black text-white">{(85 + (alignment / 10)).toFixed(2)}%</p>
                 </div>
                 <div className="p-6 bg-black/40 border border-white/5 rounded-3xl space-y-2">
                    <div className="flex items-center gap-2 mb-2">
                       <Zap className="w-3 h-3 text-cyan-400" />
                       <span className="text-[9px] font-black text-slate-500 uppercase">Yield Boost</span>
                    </div>
                    <p className="text-lg font-mono font-black text-white">{isLocked ? "+24.5%" : "+0.00%"}</p>
                 </div>
              </div>

              <div className="h-16 flex items-end gap-1">
                 {history.map((val, i) => (
                    <div 
                       key={i} 
                       className="flex-1 bg-emerald-500/20 rounded-t-sm"
                       style={{ height: `${val}%` }}
                    />
                 ))}
                 {history.length === 0 && <div className="w-full text-center text-[10px] text-slate-800 font-mono mb-6 uppercase italic">Awaiting Signal Analysis...</div>}
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <div className="p-8 bg-white/[0.01] border border-white/5 rounded-3xl space-y-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                 <Waves className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Harmonic Capture</h4>
              <p className="text-xs text-slate-600 leading-relaxed italic">Aligning your frequency stabilizes the local node, allowing for deep liquidity harvesting.</p>
           </div>
           <div className="p-8 bg-white/[0.01] border border-white/5 rounded-3xl space-y-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                 <Activity className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Quantum Handshake</h4>
              <p className="text-xs text-slate-600 leading-relaxed italic">When sync exceeds 98%, a neural handshake is established with the Totality Heart.</p>
           </div>
           <div className="p-8 bg-white/[0.01] border border-white/5 rounded-3xl space-y-4">
              <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center">
                 <Radio className="w-5 h-5 text-emerald-500" />
              </div>
              <h4 className="text-sm font-black text-white uppercase tracking-widest">Sovereign Pulse</h4>
              <p className="text-xs text-slate-600 leading-relaxed italic">The system records successful tunings onto the immutable Ghost Ledger for reputation scaling.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
