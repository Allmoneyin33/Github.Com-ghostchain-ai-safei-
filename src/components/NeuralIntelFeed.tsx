import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Radar, Shield, Activity, Zap, Info, Filter } from 'lucide-react';
import { IntelSignal, streamIntelSignals } from '../services/neuralIntel';

export function NeuralIntelFeed() {
  const [signals, setSignals] = useState<IntelSignal[]>([]);
  const [filter, setFilter] = useState<IntelSignal['type'] | 'all'>('all');

  useEffect(() => {
    const unsubscribe = streamIntelSignals(setSignals);
    return () => unsubscribe();
  }, []);

  const filteredSignals = signals.filter(s => filter === 'all' || s.type === filter);

  return (
    <div id="neural_intel_container" className="h-full flex flex-col bg-black/40 border border-white/5 rounded-2xl overflow-hidden backdrop-blur-xl">
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-ghost-accent/20 rounded-lg">
            <Radar className="w-4 h-4 text-ghost-accent animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Neural Intelligence</h3>
            <p className="text-[9px] text-slate-500 font-mono">Live Shard Reconnaissance</p>
          </div>
        </div>
        
        <div className="flex items-center gap-1">
          {(['all', 'market', 'security', 'neural', 'shard'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-2 py-1 text-[9px] font-black uppercase rounded transition-all ${
                filter === f ? 'bg-ghost-accent text-black' : 'text-slate-500 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <div className="space-y-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {filteredSignals.map((signal) => (
              <motion.div
                key={signal.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group relative"
              >
                <div className={`p-3 rounded-xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden`}>
                  {/* Progress side-bar indicator */}
                  <div className={`absolute top-0 left-0 w-1 h-full ${
                    signal.impact === 'high' ? 'bg-red-500' : 
                    signal.impact === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`} />
                  
                  <div className="flex items-start gap-3">
                    <div className="mt-1">
                      {signal.type === 'market' && <Zap className="w-3 h-3 text-amber-400" />}
                      {signal.type === 'security' && <Shield className="w-3 h-3 text-red-400" />}
                      {signal.type === 'neural' && <Activity className="w-3 h-3 text-cyan-400" />}
                      {signal.type === 'shard' && <Info className="w-3 h-3 text-emerald-400" />}
                    </div>
                    
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-white/50 uppercase tracking-widest">{signal.source}</span>
                        <span className="text-[8px] font-mono text-slate-500">
                          {signal.timestamp?.toDate ? signal.timestamp.toDate().toLocaleTimeString() : 'syncing...'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{signal.content}"
                      </p>
                    </div>
                  </div>

                  {/* Impact Glow */}
                  {signal.impact === 'high' && (
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 blur-[40px] -z-10 animate-pulse" />
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-3 border-t border-white/5 bg-black/20 flex items-center justify-between text-[8px] font-mono text-slate-600 uppercase tracking-widest">
        <span>Nodes Connected: 142</span>
        <div className="flex items-center gap-2 text-emerald-500">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          Synchronized
        </div>
      </div>
    </div>
  );
}
