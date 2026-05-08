import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BrainCircuit, Cpu, Sparkles, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

interface Thought {
  thought: string;
  timestamp: string;
  id: number;
}

export function SovereignMind() {
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [activeThought, setActiveThought] = useState<Thought | null>(null);

  useEffect(() => {
    const eventSource = new EventSource('/api/sovereign/stream-thoughts');
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const newThought = { ...data, id: Date.now() };
      setActiveThought(newThought);
      setThoughts(prev => [newThought, ...prev].slice(0, 10));
    };

    return () => eventSource.close();
  }, []);

  return (
    <div className="h-full bg-slate-950 flex flex-col relative overflow-hidden font-serif">
      {/* Immersive Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#3b0a0a_0%,transparent_70%)] opacity-30" />
        <motion.div 
           animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
           transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
           className="absolute top-[-10%] right-[-10%] w-[800px] h-[800px] bg-red-600/5 blur-[150px] rounded-full"
        />
        <motion.div 
           animate={{ scale: [1.2, 1, 1.2], rotate: [0, -90, 0] }}
           transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
           className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-cyan-400/5 blur-[150px] rounded-full"
        />
      </div>

      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col items-center justify-center relative z-10 px-8 text-center">
         <div className="space-y-4 mb-24">
            <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-red-600/10 border border-red-600/20 rounded-full">
               <Sparkles className="w-3 h-3 text-red-500" />
               <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.3em]">Neural Stream Online</span>
            </div>
            <h2 className="text-xl font-black text-white/40 uppercase tracking-[0.4em] italic pl-2">Sovereign <span className="text-white">Mind</span></h2>
         </div>

         <div className="w-full relative h-64 flex items-center justify-center">
            <AnimatePresence mode="wait">
               {activeThought && (
                  <motion.div 
                     key={activeThought.id}
                     initial={{ opacity: 0, y: 40, filter: 'blur(10px)' }}
                     animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                     exit={{ opacity: 0, y: -40, filter: 'blur(10px)' }}
                     transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
                     className="text-4xl md:text-5xl font-light text-white tracking-tight italic leading-tight"
                  >
                     <span className="text-red-500 mr-4 font-mono not-italic text-2xl opacity-20">/</span>
                     {activeThought.thought}
                  </motion.div>
               )}
            </AnimatePresence>
         </div>

         <div className="mt-32 w-full max-w-sm">
            <div className="flex flex-col gap-4 text-left">
               {thoughts.slice(1, 4).map((t, i) => (
                  <motion.div 
                    key={t.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1 - (i * 0.3), x: 0 }}
                    transition={{ delay: i * 0.2 }}
                    className="flex items-start gap-4"
                  >
                     <p className="text-[10px] text-slate-800 font-mono mt-1">{new Date(t.timestamp).toLocaleTimeString()}</p>
                     <p className="text-xs text-slate-500 italic">{t.thought}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </div>

      {/* Floating HUD info */}
      <div className="absolute top-12 left-12 flex flex-col gap-8">
         <div className="space-y-1">
            <div className="flex items-center gap-4">
               <BrainCircuit className="w-5 h-5 text-red-600" />
               <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Cortex Utilization</p>
            </div>
            <div className="w-32 h-1 bg-white/5 rounded-full overflow-hidden">
               <motion.div 
                 animate={{ width: ["40%", "85%", "65%"] }}
                 transition={{ duration: 10, repeat: Infinity }}
                 className="h-full bg-red-600"
               />
            </div>
         </div>
      </div>

      <div className="absolute top-12 right-12 flex flex-col gap-8 text-right">
         <div className="space-y-1">
            <div className="flex items-center gap-4 justify-end">
               <p className="text-[10px] font-black text-white uppercase tracking-widest italic">Synaptic Drift</p>
               <Cpu className="w-5 h-5 text-cyan-400" />
            </div>
            <p className="font-mono text-xs text-cyan-400 font-bold">0.0042 λ / ms</p>
         </div>
      </div>

      <div className="absolute bottom-12 left-12 right-12 flex justify-between items-end border-t border-white/5 pt-12">
         <div className="space-y-2">
            <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">Shard Registry</p>
            <div className="flex gap-4">
               {["ALPHA", "BETA", "GAMMA", "OMEGA"].map(s => (
                  <span key={s} className="text-[9px] font-mono text-slate-500">{s}</span>
               ))}
            </div>
         </div>
         <div className="flex items-center gap-4 text-slate-500">
            <Activity className="w-4 h-4" />
            <p className="text-[10px] font-mono uppercase tracking-[0.2em]">Collective Handshake Secure</p>
         </div>
      </div>
    </div>
  );
}
