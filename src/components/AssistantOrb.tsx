import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BrainCircuit, 
  Sparkles, 
  Terminal, 
  Zap, 
  Lightbulb,
  X,
  MessageSquare
} from 'lucide-react';
import { Card, Badge } from './ui/core';

export function AssistantOrb() {
  const [isOpen, setIsOpen] = useState(false);
  const [insights, setInsights] = useState<{id: number, text: string, type: 'innovation' | 'security' | 'market'}[]>([]);

  useEffect(() => {
    const innovationLog = [
      "AUTONOMOUS_INNOVATION: Normalizing ZK-Logic for peripheral sight view.",
      "SENTINEL: Identifying cross-chain arbitrage overlaps in Sector 4.",
      "GHOST-20: Stabilizing Identity Symmetry for new build v33-ALL.",
      "VISION: Spatial depth initialized. Perspective set to 1000px.",
      "GOVERNOR: Ethics layers verified for autonomous trading swarm.",
      "CONTEST: AMD ROCm hardware tensors aligned for Lablab.ai hackathon.",
      "TH_10: Contest Optimizer identifies +14.2% efficiency bottleneck in Sector 7."
    ];

    const generateInsight = () => {
      const text = innovationLog[Math.floor(Math.random() * innovationLog.length)];
      setInsights(prev => [{
        id: Date.now(),
        text,
        type: 'innovation' as const
      }, ...prev].slice(0, 5));
    };

    const interval = setInterval(generateInsight, 8000);
    generateInsight();
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Floating Orb */}
      <div className="fixed bottom-8 left-8 z-[200]">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="relative w-14 h-14 rounded-full bg-black border-2 border-cyan-500/30 flex items-center justify-center group shadow-[0_0_30px_rgba(0,229,244,0.2)]"
        >
          <div className="absolute inset-0 bg-cyan-500/10 rounded-full animate-ping group-hover:bg-cyan-500/20" />
          <BrainCircuit className="w-6 h-6 text-cyan-400 relative z-10" />
          
          <AnimatePresence>
            {!isOpen && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="absolute left-16 bg-black/80 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg whitespace-nowrap"
              >
                <p className="text-[10px] text-cyan-400 font-black uppercase tracking-widest">Sentinel Online</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Insight Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9, x: -50 }}
            animate={{ opacity: 1, y: 0, scale: 1, x: 0 }}
            exit={{ opacity: 0, y: 50, scale: 0.9, x: -50 }}
            className="fixed bottom-28 left-8 z-[200] w-80"
          >
            <Card className="border-cyan-500/20 bg-black/90 backdrop-blur-xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
               <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <div className="flex items-center gap-2">
                    <Sparkles size={14} className="text-amber-400" />
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Sovereign Assistant</h3>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="text-slate-500 hover:text-white transition-colors">
                    <X size={14} />
                  </button>
               </div>
               
               <div className="p-4 space-y-4 max-h-96 overflow-y-auto custom-scrollbar">
                  <div className="bg-cyan-500/5 border border-cyan-500/20 rounded-xl p-3 flex gap-3">
                    <Lightbulb className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <p className="text-[11px] text-slate-300 leading-relaxed italic">
                      "Granting full permission for autonomous design has unlocked a recursive UI cycle. You are now surrounded by the Totality."
                    </p>
                  </div>

                  <div className="space-y-3">
                    <p className="text-[9px] text-slate-600 font-bold uppercase tracking-widest px-1">Innovation Feed</p>
                    {insights.map((insight) => (
                      <motion.div 
                        key={insight.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-2.5 bg-white/5 border border-white/5 rounded-lg flex gap-3 group hover:border-cyan-500/30 transition-colors"
                      >
                         <Terminal className="w-3 h-3 text-cyan-500/50 group-hover:text-cyan-400 mt-1" />
                         <p className="text-[10px] text-slate-400 group-hover:text-white transition-colors font-mono">
                           {insight.text}
                         </p>
                      </motion.div>
                    ))}
                  </div>

                  <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest py-3 rounded-xl transition-all flex items-center justify-center gap-2">
                    <MessageSquare size={12} className="text-cyan-500" />
                    Open Neural Link
                  </button>
               </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
