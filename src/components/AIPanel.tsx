import React from 'react';
import { 
  Zap, 
  Activity,
  Terminal as TermIcon,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/core';

interface AiBinding {
  id: string;
  prompt: string;
  response: string;
  timestamp: { toDate: () => Date } | null;
}

interface AIPanelProps {
  aiPrompt: string;
  setAiPrompt: (prompt: string) => void;
  runUnifiedAi: () => void;
  isAiLoading: boolean;
  aiBindings: AiBinding[];
}

export function AIPanel({ 
  aiPrompt, 
  setAiPrompt, 
  runUnifiedAi, 
  isAiLoading, 
  aiBindings 
}: AIPanelProps) {
  return (
    <Card className="border-indigo-500/20 bg-black/40">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-400" />
          <h3 className="font-black text-white uppercase tracking-widest text-sm">Unified AI Interface</h3>
        </div>
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-indigo-500" />
          <span className="text-[10px] text-indigo-500 font-mono">NEURAL_SYNC: ACTIVE</span>
        </div>
      </div>
      
      <div className="p-6 space-y-6">
        <div className="relative">
          <textarea
            value={aiPrompt}
            onChange={(e) => setAiPrompt(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && e.ctrlKey && runUnifiedAi()}
            placeholder="Command global swarm... (Ctrl+Enter to exec)"
            className="w-full h-24 bg-black/60 border border-white/10 rounded-xl p-4 text-sm font-mono text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500/50 transition-all resize-none"
          />
          <button
            onClick={runUnifiedAi}
            disabled={isAiLoading || !aiPrompt}
            className="absolute bottom-4 right-4 bg-indigo-500 text-white px-6 py-2 rounded-lg font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 flex items-center gap-2"
          >
            {isAiLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            Exec
          </button>
        </div>

        <div className="space-y-4">
          <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
            <TermIcon size={12} /> Recent AI Bindings
          </h4>
          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 scrollbar-none">
            <AnimatePresence mode="popLayout">
              {aiBindings.map((binding) => (
                <motion.div
                  key={binding.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white/5 border border-white/5 rounded-xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-white/5 pb-2">
                    <p className="text-[10px] font-mono text-slate-500">
                      /{binding.prompt.substring(0, 30)}...
                    </p>
                    <span className="text-[9px] font-mono text-slate-700">
                      {binding.timestamp?.toDate() ? binding.timestamp.toDate().toLocaleTimeString() : 'now'}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-indigo-200/80 leading-relaxed whitespace-pre-wrap italic">
                    {binding.response}
                  </p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </Card>
  );
}
