import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Cpu, 
  Target, 
  Zap, 
  Terminal, 
  ShieldCheck, 
  Code2, 
  BarChart3,
  Lightbulb,
  Workflow,
  Cpu as Microchip
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Badge } from './ui/core';

interface Criterion {
  id: string;
  name: string;
  score: number;
  status: 'optimal' | 'improving' | 'warning';
}

export function HackathonContestPanel() {
  const [optimizationLevel, setOptimizationLevel] = useState(82);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [activeLogs, setActiveLogs] = useState<string[]>([]);

  const criteria: Criterion[] = [
    { id: '1', name: 'Agentic Autonomy', score: 94, status: 'optimal' },
    { id: '2', name: 'AMD Hardware Utilization', score: 78, status: 'improving' },
    { id: '3', name: 'Lablab.ai Compliance', score: 91, status: 'optimal' },
    { id: '4', name: 'Cross-Chain Finality', score: 65, status: 'warning' },
  ];

  const runOptimizer = () => {
    setIsOptimizing(true);
    const logs = [
      "SCRAPING: Lablab.ai Contest Requirements...",
      "ANALYZING: GHOST-20 Middleware execution paths...",
      "TUNING: AMD ROCm alignment sequences...",
      "REFACTORING: TH_10 Contest Optimizer core...",
      "VALIDATING: Zero-Knowledge settlement finality..."
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < logs.length) {
        setActiveLogs(prev => [...prev, logs[i]]);
        setOptimizationLevel(prev => Math.min(99, prev + Math.floor(Math.random() * 4)));
        i++;
      } else {
        clearInterval(interval);
        setIsOptimizing(false);
        setActiveLogs(prev => [...prev, "OPTIMIZATION_COMPLETE: Totality Stabilized."]);
      }
    }, 1200);
  };

  return (
    <Card className="border-amber-500/30 bg-black/60 overflow-hidden relative">
      {/* Background Microchip Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/microchip.png')]" />
      
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-amber-500/5 relative z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/30">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <h3 className="font-black text-white uppercase tracking-widest text-sm">Lablab.ai // AMD Contest Optimizer</h3>
        </div>
        <Badge variant={isOptimizing ? 'warning' : 'info'} className="bg-amber-500/10 text-amber-500 border-amber-500/20">
          {isOptimizing ? 'REFACTORING_ACTIVE' : 'V33_PROD_STANDBY'}
        </Badge>
      </div>

      <div className="p-6 space-y-8 relative z-10">
        {/* Main Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-1">Hackathon Score (Est.)</p>
                <h4 className="text-4xl font-black text-white italic tracking-tighter">
                  {optimizationLevel}<span className="text-amber-500">.8</span>%
                </h4>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">+14.2% DELTA</p>
                <div className="flex gap-1 mt-1">
                  {[1,2,3,4,5].map(i => (
                    <div key={i} className={`w-3 h-1 rounded-full ${i <= 4 ? 'bg-amber-500' : 'bg-white/10'}`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              {criteria.map((c) => (
                <div key={c.id} className="p-3 bg-white/5 rounded-xl border border-white/5 flex items-center justify-between group hover:bg-white/[0.08] transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg ${
                      c.status === 'optimal' ? 'bg-emerald-500/20 text-emerald-400' : 
                      c.status === 'improving' ? 'bg-amber-500/20 text-amber-400' : 'bg-rose-500/20 text-rose-400'
                    }`}>
                      <Target size={14} />
                    </div>
                    <span className="text-[11px] font-black uppercase text-slate-300 tracking-wider font-mono">{c.name}</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">{c.score}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: AI Refactoring Console */}
          <div className="flex flex-col h-full">
            <div className="flex-1 bg-black/80 rounded-2xl border border-white/5 p-4 font-mono text-[10px] overflow-hidden flex flex-col">
              <div className="flex items-center gap-2 text-amber-500/50 mb-3 border-b border-white/5 pb-2">
                <Terminal size={14} />
                <span className="uppercase tracking-[0.2em] font-black italic">Sovereign Refactor Console</span>
              </div>
              <div className="flex-1 space-y-1 overflow-y-auto scrollbar-none">
                {activeLogs.map((log, i) => (
                  <motion.p 
                    key={i}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={log.startsWith('OPTIMIZATION') ? 'text-emerald-400 font-bold' : 'text-slate-400'}
                  >
                    <span className="text-slate-600 opacity-50 mr-2">[{i.toString().padStart(2, '0')}]</span>
                    {log}
                  </motion.p>
                ))}
                {!isOptimizing && activeLogs.length === 0 && (
                  <p className="text-slate-700 italic">Core logic awaiting TH_10 initialization...</p>
                )}
                {isOptimizing && (
                  <motion.div 
                    animate={{ opacity: [0, 1] }} 
                    transition={{ repeat: Infinity, duration: 0.5 }}
                    className="w-1.5 h-3 bg-amber-500 inline-block align-middle ml-1"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={runOptimizer}
            disabled={isOptimizing}
            className="md:col-span-2 relative group overflow-hidden bg-amber-500 text-black py-5 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out" />
            <Zap size={20} className={isOptimizing ? 'animate-pulse' : ''} />
            {isOptimizing ? 'SYNTHESIZING_CORE...' : 'Trigger Contest Optimizer (TH_10)'}
          </button>
          
          <button className="bg-white/5 border border-white/10 text-white rounded-2xl py-5 font-black uppercase tracking-[0.2em] text-[10px] flex items-center justify-center gap-2 hover:bg-white/10 transition-all">
            <Microchip size={18} className="text-amber-500" />
            AMD V-Sync API
          </button>
        </div>
      </div>
    </Card>
  );
}
