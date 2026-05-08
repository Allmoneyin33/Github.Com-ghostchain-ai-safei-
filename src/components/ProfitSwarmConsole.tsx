import React, { useState } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Activity, 
  ShieldCheck,
  RefreshCw,
  BarChart3,
  Radio
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, Badge } from './ui/core';
import { cn } from '../lib/utils';
import { sovereignService } from '../services/sovereignService';

import { ProfitMetric, MarketData } from '../types/frontend';

interface SwarmProps {
  totalProfit: number;
  setTotalProfit: React.Dispatch<React.SetStateAction<number>>;
  botCredits: number;
  setBotCredits: React.Dispatch<React.SetStateAction<number>>;
  market: MarketData | null;
}

export function ProfitSwarmConsole({ totalProfit, setTotalProfit, botCredits, setBotCredits, market }: SwarmProps) {
  const [isSwarming, setIsSwarming] = useState(false);
  const [activeNodes, setActiveNodes] = useState(62);
  const [logs, setLogs] = useState<string[]>(["[SYSTEM] Standing by for swarm deployment..."]);

  // Dynamic metrics using market data
  const metrics: ProfitMetric[] = [
    { id: '1', label: 'Daily Yield', value: `${(totalProfit / 31).toFixed(2)}`, trend: 4.2, icon: TrendingUp },
    { id: '2', label: 'Ecosystem APR', value: '28.4%', trend: 1.5, icon: BarChart3 },
    { id: '3', label: 'GHOST/USD', value: market?.GHOST ? `${market.GHOST.toFixed(3)}` : '...', trend: 0.8, icon: Zap },
    { id: '4', label: 'Settlement Speed', value: '8.4ms', trend: -14, icon: Radio },
  ];

  const deploySwarm = async () => {
    if (botCredits < 100) {
      setLogs(prev => [...prev, "[ERROR] Insufficient Bot credits. Protocol requires minimum 100 credits for deployment."]);
      return;
    }

    setIsSwarming(true);
    setBotCredits(prev => prev - 100);
    setLogs(prev => [...prev, "[SWARM] 100 Bot credits consumed for neural deployment."]);
    setLogs(prev => [...prev, "[SWARM] Initiating neural profit handshake..."]);
    
    try {
      const result = await sovereignService.deploySwarm(Math.floor(Math.random() * 500) + 100);
      setLogs(prev => [...prev, `[SWARM] Agentic revenue cluster deployed: ${result.status}`]);
      setLogs(prev => [...prev, `[SWARM] Predicted earnings delta: +$${result.earningsGenerated.toFixed(2)}`]);
      
      let progress = 0;
      const interval = setInterval(() => {
        progress += 1;
        if (progress <= 5) {
          setTotalProfit(prev => prev + (result.earningsGenerated / 5));
          setActiveNodes(prev => prev + 1);
        } else {
          clearInterval(interval);
          setIsSwarming(false);
          setLogs(prev => [...prev, "[SWARM] Totality stabilized. Agents operating at peak capacity."]);
        }
      }, 1000);

    } catch (err) {
      console.error(err);
      setLogs(prev => [...prev, "[ERROR] Swarm deployment failed: SafeFi collision detected."]);
      setIsSwarming(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.id} className="p-4 bg-black/60 border-white/5 hover:border-amber-500/30 transition-all group">
            <div className="flex items-center justify-between mb-2">
              <div className="p-2 bg-white/5 rounded-lg group-hover:bg-amber-500/10 transition-colors">
                <m.icon size={16} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
              </div>
              <Badge variant={m.trend > 0 ? 'success' : 'warning'} className="text-[9px] font-mono">
                {m.trend > 0 ? '+' : ''}{m.trend}%
              </Badge>
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{m.label}</p>
            <p className="text-xl font-black text-white italic">{m.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Swarm Control */}
        <Card className="lg:col-span-2 bg-[#080808] border-amber-500/20 p-8 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/circuit-board.png')]" />
          
          <div className="flex-1 space-y-8 relative z-10">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">Autonomous <span className="text-amber-500">Revenue Swarm</span></h3>
                <p className="text-xs text-slate-500 max-w-md font-medium leading-relaxed">
                  Deploy a coordinated swarm of agentic bots to scan the marketplace for high-yield arbitrage, 
                  liquidity provisioning, and predictive trading opportunities.
                </p>
              </div>
              <div className="text-right">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Total Earnings</p>
                <p className="text-3xl font-black text-white italic tracking-tighter">${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="p-2 bg-emerald-500/20 rounded-xl text-emerald-400">
                    <ShieldCheck size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-white uppercase">U.D.A.W.G. Protocol Active</h4>
                    <p className="text-[9px] text-slate-500">Zero-loss insurance layer synced with SafeFi.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 animate-pulse">
                    <Zap size={18} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-white uppercase">High-Density Execution</h4>
                    <p className="text-[9px] text-slate-500">Optimized for AMD EPYC & ROCm acceleration.</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <button 
                  onClick={deploySwarm}
                  disabled={isSwarming}
                  className="relative group w-full aspect-video bg-amber-500 text-black rounded-3xl overflow-hidden flex flex-col items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
                >
                  <div className={cn(
                    "p-4 bg-black/20 rounded-full transition-transform duration-1000",
                    isSwarming ? "animate-[spin_2s_linear_infinite]" : "group-hover:rotate-180"
                  )}>
                    <RefreshCw size={32} />
                  </div>
                  <span className="font-black uppercase tracking-[0.3em] text-xs">
                    {isSwarming ? 'DEPLOYING_SWARM...' : 'Deploy Global Swarm'}
                  </span>
                  <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Real-time Telemetry Logs */}
        <Card className="bg-black/80 border-white/5 flex flex-col overflow-hidden">
          <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity size={14} className="text-amber-500" />
              <span className="text-[10px] font-black text-white uppercase tracking-widest">Bot Telemetry</span>
            </div>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="flex-1 p-5 font-mono text-[9px] space-y-2 overflow-y-auto scrollbar-none">
            {logs.map((log, i) => (
              <motion.p 
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={cn(
                  "border-l-2 pl-3",
                  log.includes('ERROR') ? 'border-rose-500 text-rose-400' :
                  log.includes('Predicted') ? 'border-emerald-500 text-emerald-400 font-bold' :
                  'border-slate-800 text-slate-400'
                )}
              >
                {log}
              </motion.p>
            ))}
            {isSwarming && (
              <div className="flex gap-1 mt-2">
                {[1,2,3].map(i => (
                  <motion.div 
                    key={i}
                    animate={{ height: [4, 12, 4] }}
                    transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                    className="w-1 bg-amber-500 rounded-full"
                  />
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
