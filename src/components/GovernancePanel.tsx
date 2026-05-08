import React from 'react';
import { motion } from 'motion/react';
import { Gavel, CheckCircle2, Clock, Zap } from 'lucide-react';

interface Proposal {
  id: string;
  title: string;
  status: string;
  votes: number;
  quorum: number;
  category: string;
}

interface GovernancePanelProps {
  proposals: Proposal[];
}

export const GovernancePanel: React.FC<GovernancePanelProps> = ({ proposals }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest flex items-center gap-2">
          <Gavel className="w-3 h-3" /> Sovereign Governance
        </h3>
        <span className="label-micro opacity-40">Quorum: 2,000 SOV</span>
      </div>

      <div className="space-y-2">
        {proposals.map((prop) => (
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            key={prop.id}
            className="p-3 bg-white/5 border border-white/10 rounded group hover:border-red-600/40 transition-colors"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <span className="text-[9px] font-mono p-0.5 bg-red-600 text-white rounded">{prop.id}</span>
                    <span className="text-[9px] font-black text-white/40 uppercase font-mono">{prop.category}</span>
                </div>
                <h4 className="text-[11px] font-bold text-white group-hover:text-red-500 transition-colors">{prop.title}</h4>
              </div>
              <div className={`px-2 py-0.5 rounded-full text-[8px] font-black flex items-center gap-1 ${
                prop.status === 'VOTING' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30'
              }`}>
                {prop.status === 'VOTING' ? <Clock className="w-2 h-2" /> : <CheckCircle2 className="w-2 h-2" />}
                {prop.status}
              </div>
            </div>

            <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] font-mono text-white/60">
                    <span>PROGRESS: {Math.round((prop.votes / prop.quorum) * 100)}%</span>
                    <span>{prop.votes} / {prop.quorum} SOV</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (prop.votes / prop.quorum) * 100)}%` }}
                        className={`h-full ${prop.status === 'VOTING' ? 'bg-red-600' : 'bg-emerald-500'} shadow-[0_0_5px_currentColor]`}
                    />
                </div>
            </div>

            {prop.status === 'VOTING' && (
                <button className="w-full mt-3 py-1.5 bg-white/5 hover:bg-white/10 rounded text-[9px] font-black text-white uppercase tracking-widest transition-all active:scale-95 border border-white/5">
                    Cast Sovereign Vote
                </button>
            )}
          </motion.div>
        ))}
      </div>

      <button className="w-full py-2 bg-red-600 hover:bg-red-700 rounded text-[10px] font-black text-white uppercase tracking-widest flex items-center justify-center gap-2 shadow-[0_5px_15px_rgba(230,0,0,0.2)]">
        <Zap className="w-3 h-3" /> New Proposal
      </button>
    </div>
  );
};
