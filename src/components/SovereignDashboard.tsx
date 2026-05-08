import React, { useEffect, useState } from 'react';
import { 
  Zap, 
  Bot, 
  TrendingUp, 
  Cpu, 
  Shield,
  ShieldCheck, 
  Globe, 
  Activity,
  ArrowUpRight,
  Fingerprint,
  AlertCircle,
  Thermometer,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Badge } from './ui/core';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { NeuralSwarmMatrix } from './NeuralSwarmMatrix';
import { VisualHeartbeat } from './VisualHeartbeat';
import { SafeFiAssets } from './SafeFiAssets';
import { MediaGallery } from './MediaGallery';
import { VaultsPanel } from './VaultsPanel';
import { SystemDiagnostics } from './SystemDiagnostics';
import { UpgradeAssistant } from './UpgradeAssistant';
import { DesktopShortcuts } from './DesktopShortcuts';
import { ProductRealism } from './ProductRealism';

import { MarketData, Alert, VaultSnapshot, Transaction } from '../types/frontend';

interface DashboardProps {
  totalProfit: number;
  activeNodes: number;
  botCredits: number;
  temperature: number;
  vaults: VaultSnapshot[];
  market: MarketData | null;
  alerts: Alert[];
  isThrottled?: boolean;
  masterStatus?: { status: string; cycleCount: number };
  transactions: Transaction[];
  handleTransfer: (amount: number, to: string) => Promise<boolean>;
}

import { auth, db } from '../firebase';
import { collection, query, where, getCountFromServer } from 'firebase/firestore';

import { SovereignRegistry } from './SovereignRegistry';

interface ActivityLog {
  time: string;
  event: string;
  msg: string;
  type: 'success' | 'info' | 'warning';
}

interface SystemDiag {
  success: boolean;
  systemData: {
    system: string;
    arch: string;
    uptime: number;
    freeMemory: number;
    totalMemory: number;
    cpus: number;
    nodeVersion: string;
    amdHardware: string;
  };
  pm2Status: string;
  timestamp: string;
}

export function SovereignDashboard({ 
  totalProfit, 
  botCredits, 
  temperature, 
  vaults, 
  market, 
  alerts, 
  isThrottled, 
  masterStatus,
  transactions
}: Omit<DashboardProps, 'activeNodes' | 'handleTransfer'>) {
  const [globalYield, setGlobalYield] = useState<number>(0);
  const [agentCount, setAgentCount] = useState<number>(0);
  const [liveActivity, setLiveActivity] = useState<ActivityLog[]>([]);
  const [ghostStats, setGhostStats] = useState<{ height: number; pending: number; lastHash: string; merkleRoot: string } | null>(null);
  const [defiStats, setDefiStats] = useState<{ activeVaults: number; activePositions: number; pendingOrders: number; ledgerHeight: number } | null>(null);
  const [enterpriseStats, setEnterpriseStats] = useState<{ ledgerHeight: number; pendingTransfers: number; lastHash: string } | null>(null);
  const [systemDiag, setSystemDiag] = useState<SystemDiag | null>(null);

  useEffect(() => {
    const fetchGlobalYield = async () => {
      try {
        const response = await fetch('/api/sovereign/stats/GLOBAL_TOTALITY');
        const data = await response.json();
        if (data.totalProfit) setGlobalYield(data.totalProfit);
      } catch {
        // Silently fail telemetry sync
      }
    };

    const fetchAgentCount = async () => {
      if (auth.currentUser) {
        const q = query(collection(db, 'sovereign_agents'), where('userId', '==', auth.currentUser.uid));
        const snapshot = await getCountFromServer(q);
        setAgentCount(snapshot.data().count);
      }
    };

    const fetchActivity = async () => {
      try {
        const res = await fetch('/api/sovereign/activity');
        const data = await res.json();
        setLiveActivity(data);
      } catch {
        // Silently fail activity stream
      }
    };

    const fetchGhostStats = async () => {
      try {
        const res = await fetch('/api/ghostchain/stats');
        const data = await res.json();
        setGhostStats(data);
      } catch {}
    };

    const fetchDefiStats = async () => {
      try {
        const res = await fetch('/api/defi/stats');
        const data = await res.json();
        setDefiStats(data);
      } catch {}
    };

    const fetchEnterpriseStats = async () => {
      try {
        const res = await fetch('/api/enterprise/stats');
        const data = await res.json();
        setEnterpriseStats(data);
      } catch {}
    };

    const fetchSystemDiag = async () => {
      try {
        const res = await fetch('/api/system/diagnostics');
        const data = await res.json();
        setSystemDiag(data);
      } catch {}
    };

    fetchGlobalYield();
    fetchAgentCount();
    fetchActivity();
    fetchGhostStats();
    fetchDefiStats();
    fetchEnterpriseStats();
    fetchSystemDiag();
    const interval = setInterval(() => {
      fetchGlobalYield();
      fetchAgentCount();
      fetchActivity();
      fetchGhostStats();
      fetchDefiStats();
      fetchEnterpriseStats();
      fetchSystemDiag();
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const chartData = [
    { name: '00:00', value: 400 },
    { name: '04:00', value: 300 },
    { name: '08:00', value: 600 },
    { name: '12:00', value: 800 },
    { name: '16:00', value: 1200 },
    { name: '20:00', value: 1800 },
    { name: '23:59', value: totalProfit },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Awareness Feed */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
        <AnimatePresence mode="popLayout">
          {alerts.map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`flex-none min-w-[300px] p-4 rounded-2xl border ${
                alert.priority === 'high' ? 'bg-rose-500/10 border-rose-500/20' : 'bg-blue-500/10 border-blue-500/20'
              } flex items-start gap-3`}
            >
              <div className={`p-2 rounded-xl ${alert.priority === 'high' ? 'bg-rose-500/20 text-rose-500' : 'bg-blue-500/20 text-blue-400'}`}>
                <AlertCircle size={16} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{alert.category}</p>
                <p className="text-[11px] font-bold text-white leading-relaxed">{alert.text}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <DesktopShortcuts />

      {/* Top Banner: Neural Pulse */}
      <div className="relative h-[200px] rounded-3xl overflow-hidden border border-amber-500/10 bg-black/60 shadow-[0_0_50px_rgba(245,158,11,0.05)]">
         <NeuralSwarmMatrix />
         <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
         <div className="absolute bottom-6 left-8">
            <div className="flex items-center gap-2 mb-2">
               <Badge variant="warning" className="bg-red-600 text-white border-none px-3 font-black shadow-[0_0_15px_rgba(220,38,38,0.5)]">OMEGA_TOTALITY_ACTIVE</Badge>
               <Badge variant="outline" className="border-white/20 text-white/50 text-[9px] font-mono">PWA_READY</Badge>
            </div>
            <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Omega <span className="text-red-500 not-italic">Totality</span></h2>
            <p className="text-xs text-slate-500 font-medium tracking-widest uppercase">Master Bootstrap Core // Crown Empire Real-time Execution</p>
         </div>
         <div className="absolute top-6 right-8 flex gap-4">
            <div className="flex flex-col items-end">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Network_Latency</span>
               <span className="text-sm font-mono text-emerald-400 font-bold">14ms</span>
            </div>
            <div className="flex flex-col items-end border-l border-white/10 pl-4">
               <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Shard_Uptime</span>
               <span className="text-sm font-mono text-white font-bold">99.998%</span>
            </div>
         </div>
      </div>

      {/* Primary Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Global Crypto Volume', value: market ? `${(market.globalVolume / 1e9).toFixed(1)}B` : '...', icon: Globe, color: 'text-blue-400', bg: 'bg-blue-400/10' },
          { label: 'Ecosystem Global Yield', value: `$${globalYield.toLocaleString(undefined, { minimumFractionDigits: 2 })}`, icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Neural Bot Credits', value: botCredits.toLocaleString(), icon: Cpu, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'GHOST_TOKEN Price', value: market ? `${market.GHOST.toFixed(3)}` : '...', icon: Zap, color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
          { label: 'Thermal Status', value: `${temperature}°C`, icon: Thermometer, color: isThrottled ? 'text-rose-500' : 'text-emerald-500', bg: isThrottled ? 'bg-rose-500/10' : 'bg-emerald-500/10' },
          { label: 'ROCm Core Count', value: '12,288', icon: Cpu, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
          { label: 'Synthesized Agents', value: `${agentCount} Entities`, icon: Sparkles, color: 'text-purple-400', bg: 'bg-purple-400/10' },
          { label: 'Edge Settlement Sync', value: '99.9%', icon: ShieldCheck, color: 'text-rose-400', bg: 'bg-rose-400/10' },
          { label: 'AMD Hardware', value: 'MI355X', icon: Cpu, color: 'text-orange-500', bg: 'bg-orange-500/10' },
          { label: 'Lab-Genie Link', value: temperature > 80 ? 'FAILOVER' : 'STABLE', icon: Activity, color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
          { 
            label: 'Master Agent Status', 
            value: masterStatus?.status || 'INITIALIZING', 
            icon: Bot, 
            color: masterStatus?.status === 'ACTIVE' ? 'text-ghost-accent' : 'text-slate-500', 
            bg: masterStatus?.status === 'ACTIVE' ? 'bg-ghost-accent/10' : 'bg-slate-500/10' 
          },
          { 
            label: 'Agent Cycle Hash', 
            value: masterStatus?.cycleCount ? `CYCLE_${masterStatus.cycleCount}` : 'SYNCING...', 
            icon: Fingerprint, 
            color: 'text-emerald-400', 
            bg: 'bg-emerald-400/10' 
          },
          { 
            label: 'GhostChain Height', 
            value: ghostStats ? `BLOCK_${ghostStats.height}` : '...', 
            icon: Activity, 
            color: 'text-amber-400', 
            bg: 'bg-amber-400/10' 
          },
          { 
            label: 'Network Merkle Root', 
            value: ghostStats ? `${ghostStats.merkleRoot.slice(0, 8)}...` : '...', 
            icon: Fingerprint, 
            color: 'text-blue-400', 
            bg: 'bg-blue-400/10' 
          },
          { 
            label: 'DeFi Vaults', 
            value: defiStats ? `${defiStats.activeVaults} ACTIVE` : '...', 
            icon: Shield, 
            color: 'text-emerald-400', 
            bg: 'bg-emerald-400/10' 
          },
          { 
            label: 'Perp Positions', 
            value: defiStats ? `${defiStats.activePositions}` : '...', 
            icon: TrendingUp, 
            color: 'text-rose-400', 
            bg: 'bg-rose-400/10' 
          },
          { 
            label: 'ERC-7575 Blocks', 
            value: enterpriseStats ? enterpriseStats.ledgerHeight.toString() : '...', 
            icon: ShieldCheck, 
            color: 'text-cyan-400', 
            bg: 'bg-cyan-400/10' 
          },
          { 
            label: 'Institutional Sync', 
            value: enterpriseStats ? `${enterpriseStats.pendingTransfers} PENDING` : '...', 
            icon: Globe, 
            color: 'text-amber-400', 
            bg: 'bg-amber-400/10' 
          },
          { 
            label: 'Pending Ledger Txs', 
            value: ghostStats ? `${ghostStats.pending} TXs` : '...', 
            icon: Zap, 
            color: 'text-white', 
            bg: 'bg-white/10' 
          },
        ].map((stat, i) => (
          <Card key={i} className="p-6 bg-black/40 border-white/5 hover:border-white/20 transition-all group overflow-hidden">
             <div className={`absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity -translate-y-4 translate-x-4`}>
                <stat.icon size={80} />
             </div>
             <div className="relative z-10 space-y-4">
                <div className={`p-3 w-fit rounded-2xl ${stat.bg} ${stat.color}`}>
                   <stat.icon size={20} />
                </div>
                <div>
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{stat.label}</p>
                   <p className="text-2xl font-black text-white italic tracking-tighter">{stat.value}</p>
                </div>
             </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Yield Curve Section */}
        <Card className="lg:col-span-2 p-8 bg-black/40 border-white/5">
           <div className="flex items-center justify-between mb-8">
              <div>
                 <h3 className="text-lg font-black text-white uppercase tracking-tight italic">Global <span className="text-emerald-500">Yield Curve</span></h3>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Real-time revenue settlement telemetry</p>
              </div>
              <div className="text-right">
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Aggregated Profit</p>
                 <p className="text-2xl font-black text-white italic tracking-tighter">${totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
              </div>
           </div>
           
           <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={chartData}>
                    <defs>
                       <linearGradient id="yieldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                       </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" />
                    <XAxis dataKey="name" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
                    <Tooltip 
                       contentStyle={{ backgroundColor: '#000', border: '1px solid #ffffff10', borderRadius: '12px', fontSize: '10px' }}
                       itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#yieldGradient)" />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </Card>

        {/* Live System Activity Ticker */}
        <Card className="flex flex-col bg-black/60 border-white/5 overflow-hidden">
           <div className="p-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2">
                 <Activity size={14} className="text-amber-500" />
                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Shard Activity</span>
              </div>
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
           </div>
           <div className="flex-1 p-6 space-y-6">
              {liveActivity.length > 0 ? liveActivity.map((log, i) => (
                 <div key={i} className="flex gap-4 relative">
                    <div className="flex flex-col items-center">
                       <div className={`w-2 h-2 rounded-full ${
                        log.type === 'success' ? 'bg-emerald-500' : 
                        log.type === 'info' ? 'bg-blue-400' : 
                        'bg-amber-500'
                       }`} />
                       {i !== (liveActivity.length - 1) && <div className="w-px flex-1 bg-white/5 mt-2" />}
                    </div>
                    <div className="space-y-1">
                       <div className="flex items-center gap-2">
                          <span className="text-[9px] font-mono text-slate-600">{log.time}</span>
                          <span className="text-[10px] font-black text-white uppercase tracking-widest italic">{log.event}</span>
                       </div>
                       <p className="text-[11px] text-slate-500 leading-relaxed">{log.msg}</p>
                    </div>
                 </div>
              )) : (
                <div className="h-full flex items-center justify-center italic text-slate-600 text-[10px] uppercase tracking-widest">
                  Synchronizing Neural Activity...
                </div>
              )}
           </div>
           <div className="p-4 bg-amber-500/5 mt-auto">
              <button className="w-full py-2 flex items-center justify-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest hover:text-white transition-colors">
                 Open Command Console <ArrowUpRight size={12} />
              </button>
           </div>
        </Card>
      </div>

      {/* SafeFi Assets Integration */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         <SystemDiagnostics data={systemDiag} />
         <VaultsPanel 
            vaults={[
                { id: '1', vaultId: 'VAULT_MAIN_01', balance: totalProfit, currency: 'USDC' }
            ]} 
            transactions={transactions}
            createVault={() => {}}
         />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
         <SafeFiAssets vaults={vaults} />
         <UpgradeAssistant />
      </div>

      <div className="mt-8">
        <ProductRealism />
      </div>

      <div className="mt-12 pt-12 border-t border-white/5">
        <SovereignRegistry />
      </div>

      <div className="mt-12 pt-12 border-t border-white/5">
        <MediaGallery />
      </div>

      <VisualHeartbeat />
    </div>
  );
}
