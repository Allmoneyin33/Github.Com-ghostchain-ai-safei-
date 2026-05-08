import React from 'react';
import { motion } from 'motion/react';
import { Fingerprint, ShieldCheck, Zap, Activity, Cpu } from 'lucide-react';

import { Agent } from '../types/frontend';

interface AgentCardProps {
  agent: Agent;
}

export const AgentCard: React.FC<AgentCardProps> = ({ agent }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-sm bg-[#0a0a0a] border border-red-600/30 rounded-3xl p-6 relative overflow-hidden group shadow-[0_0_40px_rgba(230,0,0,0.1)]"
    >
      {/* Background Glow */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-red-600/10 rounded-full blur-[80px]" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-red-600/10 rounded-full blur-[80px]" />
      
      {/* ERC-8004 Header */}
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Fingerprint className="w-4 h-4 text-red-600" />
            <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">ERC-8004 Verified</span>
          </div>
          <h3 className="text-xl font-black text-white italic tracking-tighter">{agent.name}</h3>
          <p className="text-[9px] font-mono text-slate-500 uppercase">{agent.agentId}</p>
        </div>
        <div className="p-3 bg-red-600/10 rounded-2xl border border-red-600/20 text-red-500">
          <Cpu className="w-5 h-5" />
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
          <div className="flex justify-between mb-1">
            <span className="text-[8px] font-black text-slate-500 uppercase">Reputation</span>
            <span className="text-[8px] font-bold text-red-500">{agent.reputation}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${agent.reputation}%` }}
              className="h-full bg-red-600"
            />
          </div>
        </div>
        <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
          <div className="flex justify-between mb-1">
            <span className="text-[8px] font-black text-slate-500 uppercase">Neural Health</span>
            <span className="text-[8px] font-bold text-red-500">{agent.healthScore}%</span>
          </div>
          <div className="h-1 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${agent.healthScore}%` }}
              className="h-full bg-red-600"
            />
          </div>
        </div>
      </div>

      {/* Capabilities */}
      <div className="space-y-3 mb-6 relative z-10">
        <span className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em]">Neural Handshakes</span>
        <div className="flex flex-wrap gap-2">
          {agent.capabilities.map((cap, i) => (
            <div key={i} className="px-2 py-1 bg-red-600/5 border border-red-600/20 rounded-lg text-[8px] font-bold text-red-400 uppercase tracking-widest flex items-center gap-1">
              <Zap className="w-2 h-2" /> {cap}
            </div>
          ))}
        </div>
      </div>

      {/* Connection Info */}
      <div className="pt-4 border-t border-white/5 flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span className="text-[9px] font-bold text-emerald-500 uppercase">Live Connection</span>
        </div>
        <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
                <span className="text-[7px] text-slate-500 font-bold uppercase">Node Link</span>
                <span className="text-[8px] font-mono text-white">SENTINEL-ROCm-6</span>
            </div>
            <Activity className="w-3 h-3 text-slate-500" />
        </div>
      </div>

      {/* Action Overlay */}
      <div className="absolute inset-0 bg-red-600 opacity-0 group-hover:opacity-[0.02] transition-opacity pointer-events-none" />
    </motion.div>
  );
};
