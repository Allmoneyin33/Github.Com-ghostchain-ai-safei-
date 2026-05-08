import React from 'react';
import { motion } from 'motion/react';
import { 
  Activity, Shield, Zap, Brain, Crosshair, 
  Network, Cpu, Lock, Eye, Workflow, Sparkles 
} from 'lucide-react';
import { Card, Badge } from './ui/core';

interface OmegaToolsPanelProps {
  onToolActivate: (toolName: string, category: string) => void;
}

const OMEGA_TOOLS = [
  // Intelligence
  { id: 't1', name: 'Neural Sentiment API', category: 'Intelligence', icon: Brain, status: 'online' },
  { id: 't2', name: 'Flash-Crash Oracle', category: 'Intelligence', icon: Eye, status: 'online' },
  { id: 't3', name: 'Dark Pool Radar', category: 'Intelligence', icon: Activity, status: 'beta' },
  { id: 't4', name: 'Whale Tracker API', category: 'Intelligence', icon: Network, status: 'online' },
  { id: 't5', name: 'Predictive Routing', category: 'Intelligence', icon: Workflow, status: 'online' },
  
  // Defensive
  { id: 't6', name: 'MEV Shielding', category: 'Defensive', icon: Shield, status: 'active' },
  { id: 't7', name: 'ZK-Snark Obfuscator', category: 'Defensive', icon: Lock, status: 'active' },
  { id: 't8', name: 'Honeypot Detector', category: 'Defensive', icon: Crosshair, status: 'online' },
  { id: 't9', name: 'Rug-pull Scanner', category: 'Defensive', icon: Eye, status: 'online' },
  { id: 't10', name: 'Impermanent Loss Guard', category: 'Defensive', icon: Shield, status: 'active' },
  
  // Execution
  { id: 't11', name: 'Flash Loan Orchestrator', category: 'Execution', icon: Zap, status: 'beta' },
  { id: 't12', name: 'Slippage Zeroizer', category: 'Execution', icon: Cpu, status: 'online' },
  { id: 't13', name: 'Arbitrage Matrix', category: 'Execution', icon: Crosshair, status: 'online' },
  { id: 't14', name: 'Liquidity Sniper', category: 'Execution', icon: Activity, status: 'online' },
  { id: 't15', name: 'Atomic Swapper', category: 'Execution', icon: Network, status: 'online' },
  { id: 't15b', name: 'Circle CCTP V2', category: 'Execution', icon: Zap, status: 'active' },
  { id: 't15c', name: 'x402 protocol', category: 'Execution', icon: Shield, status: 'active' },
  
  // Synthesis (Gemini Driven)
  { id: 't16', name: 'Smart Contract Generator', category: 'Synthesis', icon: Brain, status: 'active' },
  { id: 't17', name: 'Protocol Forker', category: 'Synthesis', icon: Workflow, status: 'beta' },
  { id: 't18', name: 'DAO Proposal Writer', category: 'Synthesis', icon: Brain, status: 'online' },
  { id: 't19', name: 'Tokenomics Simulator', category: 'Synthesis', icon: Cpu, status: 'online' },
  { id: 't20', name: 'Yield Farm Optimizer', category: 'Synthesis', icon: Activity, status: 'online' },
];

export function OmegaToolsPanel({ onToolActivate }: OmegaToolsPanelProps) {
  const categories = Array.from(new Set(OMEGA_TOOLS.map(t => t.category)));

  return (
    <Card className="flex flex-col border-ghost-accent/20 bg-black/40 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-ghost-accent/5 pointer-events-none" />
      
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          <h3 className="font-black text-white uppercase tracking-widest text-sm">Omega Matrix: Gemini Capabilities</h3>
        </div>
        <Badge variant="info">20 Modules Active</Badge>
      </div>

      <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 relative z-10">
        {categories.map(category => (
          <div key={category} className="space-y-3">
            <h4 className="text-[10px] text-slate-500 font-black uppercase tracking-widest border-b border-white/10 pb-2">
              {category} Cortex
            </h4>
            <div className="space-y-2">
              {OMEGA_TOOLS.filter(t => t.category === category).map((tool, idx) => {
                const Icon = tool.icon;
                return (
                  <motion.button
                    key={tool.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    onClick={() => onToolActivate(tool.name, tool.category)}
                    className="w-full flex items-center justify-between p-2 rounded-lg bg-black/20 hover:bg-white/10 border border-white/5 hover:border-ghost-accent/30 hover:shadow-[0_0_15px_rgba(34,197,94,0.15)] transition-all group text-left"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                      <span className="text-[10px] text-slate-300 font-bold tracking-tight group-hover:text-white transition-colors">{tool.name}</span>
                    </div>
                    <span className={`text-[8px] uppercase font-black px-1.5 py-0.5 rounded ${
                      tool.status === 'active' ? 'bg-indigo-500/20 text-indigo-400' :
                      tool.status === 'beta' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-ghost-accent/20 text-ghost-accent'
                    }`}>
                      {tool.status}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
