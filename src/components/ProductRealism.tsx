
import React from 'react';
import { Cpu, Shield, Globe, Server, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Card } from './ui/core';

export const ProductRealism: React.FC = () => {
  const specs = [
    { label: 'Compute Engine', value: 'AMD Instinct™ MI355X', status: 'Optimal', icon: <Cpu className="w-3 h-3" /> },
    { label: 'Network Fabric', value: 'Sovereign-Relay v2', status: 'Stable', icon: <Globe className="w-3 h-3" /> },
    { label: 'Node Cluster', value: 'Genesis-Totality-01', status: 'Active', icon: <Server className="w-3 h-3" /> },
    { label: 'Encryption', value: 'Recursive ZK-Proofs', status: 'Verified', icon: <Shield className="w-3 h-3" /> },
  ];

  return (
    <Card className="p-6 bg-black/40 border-white/5">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] italic">Hardware & Protocol Specs</h3>
        <span className="text-[10px] font-mono text-emerald-400 animate-pulse">SYSTEM_STABLE</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {specs.map((spec, i) => (
          <motion.div
            key={spec.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-3 rounded-xl bg-white/[0.02] border border-white/5 flex items-start gap-3"
          >
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400">
              {spec.icon}
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{spec.label}</p>
              <div className="flex items-center gap-2">
                <p className="text-xs font-bold text-white tracking-tight">{spec.value}</p>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500" />
                  <span className="text-[8px] font-mono text-emerald-500/70">{spec.status}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <div className="flex items-center justify-between">
            <div className="flex -space-x-2">
                {[1,2,3,4].map(j => (
                    <div key={j} className="w-6 h-6 rounded-full border border-black bg-slate-800 flex items-center justify-center text-[8px] font-black text-white">
                        {String.fromCharCode(64 + j)}
                    </div>
                ))}
                <div className="w-6 h-6 rounded-full border border-black bg-white/5 flex items-center justify-center text-[8px] font-black text-slate-500">
                    +12
                </div>
            </div>
            <p className="text-[10px] font-mono text-slate-500 italic">Connected to 16 Institutional Mesh Relays</p>
        </div>
      </div>
    </Card>
  );
};
