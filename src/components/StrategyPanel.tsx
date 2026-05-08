import React, { useState } from 'react';
import { Settings, Zap, Shield, TrendingUp, Cpu, Sliders } from 'lucide-react';
import { motion } from 'motion/react';

export const StrategyPanel: React.FC = () => {
  const [risk, setRisk] = useState(65);
  const [allocation, setAllocation] = useState(40);

  return (
    <div className="bg-[#080808] border border-white/5 rounded-3xl p-6 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600/10 rounded-xl text-red-500">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Strategy Config</h3>
            <p className="text-[9px] text-slate-500 font-mono">ADAPTIVE_ENGINE_v44</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[8px] font-black text-emerald-500 uppercase tracking-widest">Optimized</div>
        </div>
      </div>

      <div className="space-y-6">
        {/* Risk Multiplier */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <Shield className="w-3 h-3 text-red-600" /> Risk Multiplier
            </span>
            <span className="text-xs font-mono font-black text-red-500">{risk}%</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="100" 
            value={risk}
            onChange={(e) => setRisk(parseInt(e.target.value))}
            className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
          />
          <div className="flex justify-between text-[8px] font-mono text-slate-700 uppercase">
            <span>Conservative</span>
            <span>Aggressive</span>
          </div>
        </div>

        {/* Global Allocation */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <TrendingUp className="w-3 h-3 text-red-600" /> Capital Allocation
            </span>
            <span className="text-xs font-mono font-black text-red-500">{allocation}%</span>
          </div>
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={allocation}
            onChange={(e) => setAllocation(parseInt(e.target.value))}
            className="w-full h-1 bg-white/5 rounded-lg appearance-none cursor-pointer accent-red-600 focus:outline-none"
          />
        </div>

        {/* Strategy Presets */}
        <div className="grid grid-cols-2 gap-3">
          <button className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-red-600/30 transition-all text-left group">
            <Cpu className="w-4 h-4 text-slate-500 group-hover:text-red-500 mb-2 transition-colors" />
            <p className="text-[10px] font-black text-white uppercase tracking-tighter">High-Freq</p>
            <p className="text-[8px] text-slate-500 uppercase">Arbitrage Focus</p>
          </button>
          <button className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-red-600/30 transition-all text-left group border-red-600/20">
            <Zap className="w-4 h-4 text-red-500 mb-2 transition-colors" />
            <p className="text-[10px] font-black text-white uppercase tracking-tighter">Neural Shard</p>
            <p className="text-[8px] text-slate-500 uppercase">AI Predictive</p>
          </button>
        </div>
      </div>

      <div className="pt-4">
        <button className="w-full py-3 bg-red-600 text-white rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-[0_0_20px_rgba(230,0,0,0.3)] hover:scale-[1.02] active:scale-95 transition-all">
          Push to Mainnet
        </button>
      </div>
    </div>
  );
};
