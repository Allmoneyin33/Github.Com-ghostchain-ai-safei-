
import React, { useState, useEffect, useCallback } from 'react';
import { Rocket, Shield, Zap, Lock, CheckCircle2, ChevronRight, Info, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { Card, Button, Badge } from './ui/core';

interface Upgrade {
  id: string;
  name: string;
  description: string;
  category: 'SYSTEM' | 'AGENT' | 'DEFI';
  cost: number;
  status: 'AVAILABLE' | 'INSTALLED' | 'LOCKED';
  impact: string;
}

export const UpgradeAssistant: React.FC = () => {
  const [upgrades, setUpgrades] = useState<Upgrade[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const fetchUpgrades = useCallback(async () => {
    try {
      const res = await fetch('/api/system/upgrades');
      const data = await res.json();
      setUpgrades(data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch upgrades", err);
    }
  }, []);

  useEffect(() => {
    fetchUpgrades();
  }, [fetchUpgrades]);

  const applyUpgrade = async (id: string) => {
    setProcessingId(id);
    try {
      const res = await fetch('/api/system/upgrades/apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      });
      const result = await res.json();
      if (result.success) {
        setUpgrades(prev => prev.map(u => u.id === id ? { ...u, status: 'INSTALLED' } : u));
      }
    } catch (err) {
      console.error("Failed to apply upgrade", err);
    } finally {
      setProcessingId(null);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'SYSTEM': return <Shield className="w-3 h-3 text-emerald-400" />;
      case 'AGENT': return <Zap className="w-3 h-3 text-amber-400" />;
      case 'DEFI': return <Rocket className="w-3 h-3 text-blue-400" />;
      default: return null;
    }
  };

  return (
    <Card className="flex flex-col h-full bg-black/40 border-white/5 overflow-hidden group">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-rose-500/10 rounded-lg">
             <Rocket className="w-4 h-4 text-rose-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tighter">Singularity Upgrades</h3>
            <p className="text-[10px] text-slate-500 font-mono italic">Evolutionary Nexus v150.4</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[9px] border-rose-500/20 text-rose-400 font-mono">
            4 MODULES READY
        </Badge>
      </div>

      <div className="p-4 flex-1 space-y-4 custom-scrollbar overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full gap-2">
            <Rocket className="w-4 h-4 text-slate-500 animate-pulse" />
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scanning Core...</span>
          </div>
        ) : (
          <div className="space-y-3">
            {upgrades.map((upgrade) => (
              <motion.div
                key={upgrade.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-3 rounded-xl border transition-all ${
                  upgrade.status === 'INSTALLED' 
                    ? 'bg-emerald-500/5 border-emerald-500/20' 
                    : upgrade.status === 'LOCKED'
                      ? 'bg-black/20 border-white/5 opacity-60'
                      : 'bg-white/[0.03] border-white/5 hover:border-white/10'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(upgrade.category)}
                    <span className="text-[11px] font-black text-white uppercase tracking-tight">{upgrade.name}</span>
                  </div>
                  {upgrade.status === 'INSTALLED' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                  {upgrade.status === 'LOCKED' && (
                    <Lock className="w-3 h-3 text-slate-500" />
                  )}
                </div>
                
                <p className="text-[10px] text-slate-400 leading-relaxed mb-3">
                  {upgrade.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Info className="w-3 h-3 text-slate-500" />
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">{upgrade.impact}</span>
                  </div>
                  
                  {upgrade.status === 'AVAILABLE' && (
                    <Button 
                      variant="ghost"
                      className="h-6 px-3 py-0 text-[10px] font-black uppercase text-rose-400 hover:bg-rose-400/10 border-white/5 hover:border-rose-400/20"
                      onClick={() => applyUpgrade(upgrade.id)}
                      disabled={!!processingId}
                    >
                      {processingId === upgrade.id ? 'Injecting...' : (
                        <div className="flex items-center gap-1">
                          Integrate <ChevronRight className="w-3 h-3" />
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="pt-2">
            <div className="p-3 bg-amber-500/5 border border-amber-500/10 rounded-xl flex gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
                <p className="text-[9px] text-amber-500/80 leading-normal font-medium italic uppercase tracking-tighter">
                   Warning: System upgrades are irreversible and modify the core consensus logic of the Singularity engine. Proceed with tactical awareness.
                </p>
            </div>
        </div>
      </div>
    </Card>
  );
};
