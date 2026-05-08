import React from 'react';
import { 
  Bot, 
  Activity, 
  ShieldCheck, 
  Zap, 
  TrendingUp,
  History,
  Shield,
  Thermometer,
  Cpu,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Badge } from './ui/core';
import { LineChart, Line, ResponsiveContainer, YAxis, Tooltip } from 'recharts';
import { cn } from '../lib/utils';
import { Agent } from '../types/frontend';

interface AgentsPanelProps {
  agents: Agent[];
  newAgentRole: string;
  setNewAgentRole: (role: string) => void;
  createAgent: () => void;
  roleDescriptions: Record<string, string>;
}

export function AgentsPanel({ 
  agents, 
  newAgentRole, 
  setNewAgentRole, 
  createAgent,
  roleDescriptions
}: AgentsPanelProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Bot className="w-6 h-6 text-ghost-accent" />
          Autonomous Agents
        </h2>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <select
              value={newAgentRole}
              onChange={(e) => setNewAgentRole(e.target.value)}
              title={roleDescriptions[newAgentRole]}
              className="bg-black/50 border border-white/10 text-white text-xs font-mono p-2 rounded-lg focus:outline-none focus:border-ghost-accent cursor-pointer"
            >
              <option value="analyst">Analyst</option>
              <option value="trader">Trader</option>
              <option value="auditor">Auditor</option>
              <option value="guardian">Guardian</option>
            </select>
            <button
              onClick={createAgent}
              className="bg-ghost-accent text-black px-4 py-2 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              <Plus className="w-4 h-4" />
              Spawn Agent
            </button>
          </div>
          <p className="text-[10px] text-slate-500 font-mono uppercase italic tracking-tighter">
            {roleDescriptions[newAgentRole]}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {agents.map((agent) => (
            <motion.div
              key={agent.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <Card className="relative overflow-hidden group">
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 blur-3xl rounded-full translate-x-16 -translate-y-16 ${
                  agent.status === 'active' ? 'bg-ghost-accent' : 
                  agent.status === 'repairing' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
                
                <div className="flex items-start justify-between mb-4 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className={agent.status === 'active' ? 'text-ghost-accent' : 'text-slate-500'}>
                      <Bot className="w-8 h-8" />
                    </div>
                    <div>
                      <h3 className="font-black text-white text-lg tracking-tight uppercase">{agent.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant={agent.status === 'active' ? 'success' : 'warning'}>
                          {agent.status.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded-full">
                          {agent.role}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Reputation</p>
                    <p className="text-xl font-mono font-black text-ghost-accent">{agent.reputation}%</p>
                  </div>
                </div>

                {/* Cognitive Growth Meter */}
                <div className="mb-6 relative z-10">
                  <div className="flex justify-between items-center mb-1.5">
                     <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                        <Cpu className="w-3 h-3" /> Cognitive Growth Matrix
                     </p>
                     <span className="text-[10px] font-mono text-ghost-accent">{agent.cognitiveGrowth}%</span>
                  </div>
                  <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${agent.cognitiveGrowth}%` }}
                      className="h-full bg-ghost-accent shadow-[0_0_10px_rgba(34,197,94,0.5)]" 
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6 relative z-10">
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-1.5">
                        <Thermometer className="w-3 h-3" /> Health Score
                      </p>
                      <span className={`text-[10px] font-mono font-black ${
                        agent.healthScore > 80 ? 'text-emerald-400' : 
                        agent.healthScore >= 50 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {agent.healthScore}%
                      </span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.healthScore}%` }}
                        className={`h-full transition-colors duration-500 ${
                          agent.healthScore > 80 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]' : 
                          agent.healthScore >= 50 ? 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.4)]' : 
                          'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]'
                        }`} 
                      />
                    </div>
                  </div>
                  <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                      <Zap className="w-3 h-3" /> Innovation lvl
                    </p>
                    <p className="text-lg font-mono font-black text-indigo-400">
                      v.{agent.innovationLevel}
                    </p>
                  </div>
                </div>

                <div className="h-24 mb-4 relative z-10">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={(agent.reputationHistory || []).map((v, i) => ({ v, i }))}>
                      <Line 
                        type="monotone" 
                        dataKey="v" 
                        stroke="#22c55e" 
                        strokeWidth={2} 
                        dot={false}
                        isAnimationActive={false}
                      />
                      <YAxis domain={[0, 100]} hide />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-4 relative z-10">
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                      <Zap className="w-3 h-3" /> Capabilities
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {agent.capabilities?.map((cap, i) => (
                        <span 
                          key={i} 
                          className={cn(
                            "text-[9px] font-mono border px-2 py-0.5 rounded-full uppercase tracking-tighter",
                            cap === 'neural-shard-integration' 
                              ? "text-amber-400 bg-amber-400/10 border-amber-400/30 shadow-[0_0_8px_rgba(245,158,11,0.2)]" 
                              : "text-ghost-accent bg-ghost-accent/10 border-ghost-accent/20"
                          )}
                        >
                          {cap.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>

                  {agent.nextStepRecommendations && agent.nextStepRecommendations.length > 0 && (
                    <div className="p-3 bg-indigo-500/5 border border-indigo-500/20 rounded-xl group-hover:border-indigo-500/40 transition-colors">
                      <p className="text-[10px] text-indigo-400 font-black uppercase tracking-widest mb-1.5 flex items-center gap-1.5">
                        <TrendingUp className="w-3 h-3" /> Self-Growth Queue
                      </p>
                      <ul className="space-y-1">
                        {agent.nextStepRecommendations.slice(0, 2).map((rec, i) => (
                          <li key={i} className="text-[10px] text-slate-300 flex items-center gap-2">
                             <div className="w-1 h-1 bg-indigo-500 rounded-full" />
                             {rec}
                          </li>
                        ))}
                      </ul>
                      {agent.selfInstallationStatus === 'installing' && (
                        <div className="mt-3 flex items-center gap-2 text-[10px] text-indigo-400 font-mono italic animate-pulse">
                          <Activity className="w-3 h-3" /> Installing software component...
                        </div>
                      )}
                    </div>
                  )}

                  <div className="border-t border-white/5 pt-4">
                     <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-2 flex items-center gap-1.5">
                        <History className="w-3 h-3" /> Auto-Repair Logs
                     </p>
                     <div className="space-y-1 max-h-20 overflow-y-auto pr-2 scrollbar-hide">
                        {(agent.autoRepairLogs || []).slice(-3).reverse().map((log, i) => (
                          <p key={i} className="text-[9px] font-mono text-slate-400 italic">
                             &gt; {log}
                          </p>
                        ))}
                     </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
