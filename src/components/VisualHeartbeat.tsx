import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Activity, Thermometer, Database, Wallet, AlertTriangle } from 'lucide-react';
import { Card, Badge } from './ui/core';

export function VisualHeartbeat() {
  const [pulseCount, setPulseCount] = useState(0);
  const [rackTemp, setRackTemp] = useState(54.2);
  const [hashRate, setHashRate] = useState(294);
  const [balance, setBalance] = useState(14892.40);
  const [vetoActive, setVetoActive] = useState(false);

  useEffect(() => {
    const pulseInterval = setInterval(() => {
      setPulseCount(p => p + 1);
      
      // Simulate slight fluctuations
      const tempDelta = (Math.random() - 0.5) * 0.8;
      const newTemp = Math.max(50, Math.min(60, rackTemp + tempDelta));
      setRackTemp(newTemp);
      
      if (newTemp > 58.7) {
        setVetoActive(true);
      } else {
        setVetoActive(false);
      }
      
      setHashRate(prev => Math.floor(prev + (Math.random() - 0.5) * 5));
      setBalance(prev => prev + (Math.random() * 0.5));
    }, 4500); // 4.5s pulse for visual demo
    
    return () => clearInterval(pulseInterval);
  }, [rackTemp]);

  return (
    <Card className="flex flex-col border-ghost-accent/20 bg-black/40 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-ghost-accent/5 pointer-events-none" />
      
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <Activity className={`w-4 h-4 ${vetoActive ? 'text-rose-500' : 'text-ghost-accent'}`} />
          <h3 className="font-black text-white uppercase tracking-widest text-sm">System Heartbeat v138.1</h3>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="info">Consensus: 99.8%</Badge>
          {vetoActive ? (
            <div className="animate-pulse">
              <Badge variant="warning">
                THERMAL CRITICAL - VETO
              </Badge>
            </div>
          ) : (
            <Badge variant="success">TOTALITY_NORMAL</Badge>
          )}
        </div>
      </div>

      <div className="p-6 relative z-10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-black/60 border border-white/10 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Database className="w-3 h-3 text-indigo-400" />
                ECOS Hashrate
              </p>
              <p className="text-2xl font-mono text-white">{hashRate} <span className="text-sm text-slate-500">TH/s</span></p>
            </div>
          </div>

          <div className="bg-black/60 border border-white/10 p-4 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Wallet className="w-3 h-3 text-ghost-accent" />
                Stride Bank
              </p>
              <p className="text-2xl font-mono text-white">${balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
            </div>
          </div>

          <div className={`bg-black/60 border p-4 rounded-xl flex items-center justify-between transition-colors ${vetoActive ? 'border-rose-500/50' : 'border-white/10'}`}>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
                <Thermometer className={`w-3 h-3 ${vetoActive ? 'text-rose-500' : 'text-amber-400'}`} />
                Rack #3 Temp
              </p>
              <p className={`text-2xl font-mono ${vetoActive ? 'text-rose-500 font-black' : 'text-white'}`}>
                {rackTemp.toFixed(1)} <span className="text-sm opacity-50">°C</span>
              </p>
            </div>
            {vetoActive && <AlertTriangle className="w-6 h-6 text-rose-500 animate-pulse" />}
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden relative">
            <motion.div 
              key={pulseCount}
              initial={{ x: '-100%', opacity: 1 }}
              animate={{ x: '100%', opacity: 0 }}
              transition={{ duration: 1.5, ease: 'linear' }}
              className="absolute inset-y-0 left-0 w-1/3 bg-ghost-accent"
            />
          </div>
          <p className="text-slate-500 uppercase tracking-widest w-20 text-center">
            PULSE_{pulseCount % 1000}
          </p>
        </div>
      </div>
    </Card>
  );
}
