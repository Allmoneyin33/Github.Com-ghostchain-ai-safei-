import React from 'react';
import { 
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/core';

interface VetoLog {
  id: string | number;
  agentName: string;
  message: string;
  timestamp: number | Date;
  type?: 'info' | 'success' | 'warning' | 'error';
}

interface VetoLogsPanelProps {
  logs: VetoLog[];
}

export function VetoLogsPanel({ logs }: VetoLogsPanelProps) {
  return (
    <Card className="flex flex-col border-rose-500/20 bg-black/40 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-rose-500" />
          <h3 className="font-black text-white uppercase tracking-widest text-sm">Sentinel Veto Logs</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse shadow-[0_0_10px_#f43f5e]" />
          <span className="text-[10px] text-rose-500 font-bold uppercase tracking-widest">Neural Drift Monitor</span>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto max-h-[400px] p-2 scrollbar-none">
        <AnimatePresence initial={false}>
          {logs.map((log) => (
            <motion.div
              key={log.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className={`p-3 mb-2 rounded-xl border transition-colors relative group ${
                log.type === 'error' ? 'border-red-500/20 bg-red-500/5' : 
                log.type === 'warning' ? 'border-amber-500/20 bg-amber-500/5' :
                log.type === 'success' ? 'border-emerald-500/20 bg-emerald-500/5' :
                'border-white/5 bg-white/[0.02]'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-full border ${
                  log.type === 'error' ? 'text-red-400 bg-red-500/10 border-red-500/20' :
                  log.type === 'warning' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                  log.type === 'success' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                  'text-rose-400 bg-rose-500/10 border-rose-500/20'
                }`}>
                  {log.agentName}
                </span>
                <span className="text-[9px] font-mono text-slate-500">
                  {typeof log.timestamp === 'number' ? new Date(log.timestamp).toLocaleTimeString() : log.timestamp.toLocaleTimeString()}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-300 leading-relaxed">
                <span className="text-rose-500 mr-1">&gt;</span>
                {log.message}
              </p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="p-4 border-t border-white/5 bg-white/5 text-center">
        <p className="text-[9px] text-slate-500 font-mono uppercase tracking-[0.3em]">
          Total Anomalies Resolved: {logs.length}
        </p>
      </div>
    </Card>
  );
}
