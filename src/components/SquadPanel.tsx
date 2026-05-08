import React, { useState } from 'react';
import { 
  Users, 
  Target, 
  Shield, 
  Zap, 
  ChevronRight, 
  Plus, 
  Radio, 
  Crosshair,
  Grid
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Badge } from './ui/core';
import { cn } from '../lib/utils';

interface SquadMember {
  id: string;
  name: string;
  role: string;
  status: 'active' | 'standby' | 'deploying';
}

export function SquadPanel() {
  const [squads, setSquads] = useState([
    { 
      id: 'S-01', 
      name: 'Alpha Sentinel', 
      objective: 'Secure Eth-Mainnet Perimeter',
      formation: 'Phalanx',
      members: [
        { id: '1', name: '€hain_01', role: 'Guardian', status: 'active' },
        { id: '2', name: '€hain_02', role: 'Interceptor', status: 'active' },
      ]
    },
    { 
      id: 'S-02', 
      name: 'Shadow Swarm', 
      objective: 'Flash-Loan Arbitrage Ops',
      formation: 'Swarm',
      members: [
        { id: '3', name: 'Wraith_A', role: 'Trader', status: 'standby' },
        { id: '4', name: 'Wraith_B', role: 'Trader', status: 'standby' },
        { id: '5', name: 'Wraith_C', role: 'Trader', status: 'standby' },
      ]
    }
  ]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
          <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/30">
            <Users className="w-5 h-5 text-emerald-400" />
          </div>
          Sovereign SQUAD Coordination
        </h2>
        <button className="flex items-center gap-2 bg-emerald-500 text-black px-4 py-2 rounded-xl font-black uppercase text-[10px] tracking-widest hover:scale-105 transition-all">
          <Plus size={14} />
          Initialize Squad
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {squads.map((squad) => (
            <motion.div
              key={squad.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              layout
            >
              <Card className="border-emerald-500/10 bg-black/40 p-6 overflow-hidden relative group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl -z-10 group-hover:bg-emerald-500/10 transition-all" />
                
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="success" className="text-[8px] tracking-widest uppercase">Squad {squad.id}</Badge>
                      <span className="text-[10px] font-mono text-slate-500">FORMATION: {squad.formation}</span>
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-tight">{squad.name}</h3>
                  </div>
                  <div className="flex -space-x-2">
                    {squad.members.map((m) => (
                      <div key={m.id} className="w-8 h-8 rounded-full bg-[#111] border-2 border-slate-900 flex items-center justify-center" title={m.name}>
                        <div className={cn("w-1.5 h-1.5 rounded-full", m.status === 'active' ? "bg-emerald-500 animate-pulse" : "bg-slate-700")} />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/5">
                    <Target className="w-4 h-4 text-emerald-500/50 mt-0.5" />
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">Active Objective</p>
                      <p className="text-xs text-slate-300 font-mono italic">{squad.objective}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Tactical Sync</p>
                      <div className="flex items-center gap-2">
                        <Radio className="w-3 h-3 text-emerald-400 animate-ping" />
                        <span className="text-sm font-black text-white">94.2%</span>
                      </div>
                    </div>
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                      <p className="text-[9px] text-slate-500 uppercase font-bold mb-1">Efficiency</p>
                      <div className="flex items-center gap-2">
                        <Zap className="w-3 h-3 text-cyan-400" />
                        <span className="text-sm font-black text-white">LOW_LAT</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest py-2.5 rounded-lg transition-all flex items-center justify-center gap-2">
                    <Grid size={12} />
                    Adjust Formation
                  </button>
                  <button className="flex-1 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase tracking-widest py-2.5 rounded-lg transition-all flex items-center justify-center gap-2">
                    <Crosshair size={12} />
                    Tactical Override
                  </button>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Tactical Map Mock */}
        <Card className="border-white/5 bg-black/60 relative overflow-hidden flex flex-col p-0">
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                <Shield size={14} className="text-emerald-500" />
                Live Tactical Mapping
            </h3>
            <div className="text-[9px] font-mono text-slate-500">LATENCY: 12ms</div>
          </div>
          <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] flex items-center justify-center min-h-[300px]">
             {/* Simple grid effect */}
             <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:40px_40px]" />
             
             {/* Mock agent icons */}
             <motion.div 
              animate={{ 
                x: [0, 20, -10, 0],
                y: [0, -10, 15, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)] border-2 border-black z-10" 
             />
             <motion.div 
              animate={{ 
                x: [40, 20, 60, 40],
                y: [50, 70, 40, 50],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="w-3 h-3 bg-cyan-500 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.5)] border-2 border-black z-10" 
             />
             <div className="absolute bottom-4 left-4 p-3 bg-black/80 border border-white/10 rounded-xl">
                <p className="text-[8px] text-slate-500 font-black uppercase mb-1">Sector 7-G</p>
                <p className="text-[10px] text-emerald-400 font-mono tracking-tighter">ALL_STATIONS_ACTIVE</p>
             </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
