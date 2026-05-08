
import React from 'react';
import { Terminal, Shield, Zap, Rocket, Activity, Database, LayoutGrid } from 'lucide-react';
import { motion } from 'motion/react';

interface ShortcutProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  color: string;
}

const Shortcut: React.FC<ShortcutProps> = ({ icon, label, onClick, color }) => (
  <motion.button
    whileHover={{ y: -5, scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="flex flex-col items-center gap-2 group p-2 rounded-xl transition-colors hover:bg-white/[0.03]"
  >
    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-black/40 border border-white/10 shadow-lg group-hover:border-${color}-500/50 group-hover:shadow-${color}-500/10 transition-all`}>
        <div className={`text-slate-400 group-hover:text-${color}-400 transition-colors`}>
            {icon}
        </div>
    </div>
    <span className="text-[10px] font-black text-slate-500 group-hover:text-white uppercase tracking-tighter transition-colors">
      {label}
    </span>
  </motion.button>
);

export const DesktopShortcuts: React.FC = () => {
  return (
    <div className="grid grid-cols-4 sm:flex sm:flex-wrap items-center justify-center gap-4 py-8">
      <Shortcut 
        icon={<Terminal className="w-5 h-5" />} 
        label="Terminal" 
        color="rose"
        onClick={() => alert("Initializing Singularity Terminal v150.4...")}
      />
      <Shortcut 
        icon={<Shield className="w-5 h-5" />} 
        label="Security" 
        color="emerald"
        onClick={() => alert("Running Recursive ZK-Audit...")}
      />
      <Shortcut 
        icon={<Zap className="w-5 h-5" />} 
        label="Quick Trade" 
        color="amber"
        onClick={() => alert("Routing orders to Optimism Hub...")}
      />
      <Shortcut 
        icon={<Rocket className="w-5 h-5" />} 
        label="Deploy" 
        color="blue"
        onClick={() => alert("Synthesizing New Agent Shard...")}
      />
       <Shortcut 
        icon={<Activity className="w-5 h-5" />} 
        label="Telemetry" 
        color="indigo"
        onClick={() => alert("Syncing System Pulse...")}
      />
      <Shortcut 
        icon={<Database className="w-5 h-5" />} 
        label="Ledger" 
        color="purple"
        onClick={() => alert("Accessing GhostChain History...")}
      />
      <Shortcut 
        icon={<LayoutGrid className="w-5 h-5" />} 
        label="Apps" 
        color="slate"
        onClick={() => alert("Opening Sovereign Registry...")}
      />
    </div>
  );
};
