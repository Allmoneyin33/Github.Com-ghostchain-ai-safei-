import React from 'react';
import { motion } from 'motion/react';
import { 
  Shield, 
  Dna, 
  Database, 
  Zap, 
  Box, 
  Activity, 
  Workflow, 
  Cpu, 
  Lock,
  Globe,
  Coins,
  History,
  Eye,
  MousePointer2,
  CheckCircle,
  TrendingUp,
  Repeat,
  RefreshCcw,
  Unplug,
  Power
} from 'lucide-react';
import { Card } from './ui/core';
import { cn } from '../lib/utils';

const GHOST_20_TOOLS = [
  { id: "TH_01", tool: "Bio-Sync Escrow", function: "Bridges physical biometrics to Smart Account triggers.", icon: Dna },
  { id: "TH_02", tool: "Recursive Memory Anchor", function: "Forces agent logic to remain immutable via blockchain state.", icon: History },
  { id: "TH_03", tool: "Latency Telepathy", function: "Renders UI actions predictive of user intent (Telepathic UI).", icon: Activity },
  { id: "TH_04", tool: "Swarm Cognitive Stack", function: "Unified token-pool for 100+ concurrent agents.", icon: Workflow },
  { id: "TH_05", tool: "V-Sim Terrain Logic", function: "Spatial reasoning bridge for physical landscape data.", icon: Box },
  { id: "TH_06", tool: "ZK Profit Router", function: "Zero-Knowledge settlement layer for private LLC distribution.", icon: Shield },
  { id: "TH_07", tool: "Contextual Bidder", function: "Middleware for intent-aware automated auctions.", icon: Zap },
  { id: "TH_08", tool: "Identity Symmetry", function: "Secure link between Legal Name and ERC-8004 Identity.", icon: Cpu },
  { id: "TH_09", tool: "Ethics Governor", function: "Hard-coded safety guard for agentic autonomy.", icon: Lock },
  { id: "TH_10", tool: "Contest Optimizer", function: "Real-time code refactoring based on Hackathon criteria.", icon: CheckCircle },
  { id: "TH_11", tool: "Asset Digitizer", function: "Physical-to-Digital value conversion for card/coin collections.", icon: Coins },
  { id: "TH_12", tool: "Neural Cache", function: "Repository for high-fidelity human intuition replication.", icon: Database },
  { id: "TH_13", tool: "Sovereign Shield", function: "Zero-leak private data lens for secure AI analysis.", icon: Eye },
  { id: "TH_14", tool: "Gesture Relay", function: "Maps swipe/scroll physics to complex execution commands.", icon: MousePointer2 },
  { id: "TH_15", tool: "Compliance Auditor", function: "Automated benchmarking against Lablab.ai requirements.", icon: Globe },
  { id: "TH_16", tool: "PnL Visualizer", function: "Predictive forecasting using 2026 market models.", icon: TrendingUp },
  { id: "TH_17", tool: "GhostBridge v3", function: "Instant liquidity movement for Escrow-to-Agent tasks.", icon: Repeat },
  { id: "TH_18", tool: "Feedback Loop", function: "App-learning layer based on judge interaction patterns.", icon: RefreshCcw },
  { id: "TH_19", tool: "API Harmonizer", function: "Universal communication layer for fragmented software.", icon: Unplug },
  { id: "TH_20", tool: "Finality Trigger", function: "The ultimate 'Kill-Switch' for LLC digital infrastructure.", icon: Power }
];

export function Ghost20Middleware() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 rounded-xl border border-cyan-500/30">
              <Zap className="w-5 h-5 text-cyan-400" />
            </div>
            Ghost-20 Middleware Suite
          </h2>
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1 ml-12">Core Implementation of ERC-8004 Architecture</span>
        </div>
        <div className="flex items-center gap-6">
           <div className="flex flex-col items-end">
              <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest uppercase mb-1">Contract_Load</span>
              <div className="flex gap-1">
                 {[1,2,3,4,5,6,7,8].map(i => (
                   <motion.div 
                     key={i} 
                     animate={{ height: [4, 10, 4] }} 
                     transition={{ repeat: Infinity, duration: 2, delay: i * 0.2 }} 
                     className="w-1 bg-cyan-500/40 rounded-full" 
                   />
                 ))}
              </div>
           </div>
           <div className="flex items-center gap-2 px-3 py-1.5 bg-cyan-500/5 border border-cyan-500/20 rounded-xl">
              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-pulse" />
              <p className="text-[10px] text-cyan-500 font-black uppercase tracking-[0.2em]">Symmetry: SYNCED</p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {GHOST_20_TOOLS.map((tool, i) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className={cn(
              "h-full border-white/5 bg-[#080808] hover:border-cyan-500/40 hover:shadow-[0_0_20px_rgba(6,182,212,0.1)] transition-all group p-5",
              tool.id === 'TH_10' && "border-amber-500/30 shadow-[0_0_15px_rgba(245,158,11,0.1)]"
            )}>
              <div className="flex items-start justify-between mb-4">
                <div className={cn(
                  "p-3 bg-white/5 rounded-2xl group-hover:bg-cyan-500/10 transition-colors",
                  tool.id === 'TH_10' && "bg-amber-500/10 group-hover:bg-amber-500/20"
                )}>
                  <tool.icon className={cn(
                    "w-5 h-5 text-slate-500 group-hover:text-cyan-400 transition-colors",
                    tool.id === 'TH_10' && "text-amber-500 group-hover:text-amber-400"
                  )} />
                </div>
                <span className={cn(
                  "text-[9px] font-mono text-slate-700 font-bold tracking-widest",
                  tool.id === 'TH_10' && "text-amber-500/50"
                )}>{tool.id}</span>
              </div>
              <h3 className={cn(
                "text-sm font-black text-white uppercase mb-2 group-hover:text-cyan-300 transition-colors",
                tool.id === 'TH_10' && "text-amber-500 group-hover:text-amber-400"
              )}>{tool.tool}</h3>
              <p className={cn(
                "text-[11px] text-slate-500 font-medium leading-relaxed italic border-l-2 border-white/5 pl-3 group-hover:border-cyan-500/30 transition-colors",
                tool.id === 'TH_10' && "border-amber-500/30 text-amber-500/60"
              )}>
                {tool.function}
              </p>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
