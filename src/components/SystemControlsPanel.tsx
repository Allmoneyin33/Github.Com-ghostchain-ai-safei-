import React from 'react';
import { 
  Zap, 
  Thermometer
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, Badge } from './ui/core';
import { cn } from '../lib/utils';

interface SystemControlsPanelProps {
  isStrategicSilence: boolean;
  setIsStrategicSilence: (val: boolean) => void;
  temperature: number;
}

export function SystemControlsPanel({ 
  isStrategicSilence, 
  setIsStrategicSilence, 
  temperature 
}: SystemControlsPanelProps) {
  return (
    <Card className="border-ghost-accent/20 bg-black/40">
      <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
        <Zap className="w-5 h-5 text-ghost-accent" />
        Sovereign System Controls
      </h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-ghost-accent/30 transition-all">
          <div>
            <p className="text-xs font-black text-white uppercase tracking-tight">Strategic Silence</p>
            <p className="text-[10px] text-slate-500 font-mono italic">Skip non-critical innovation cycles</p>
          </div>
          <button 
            onClick={() => setIsStrategicSilence(!isStrategicSilence)}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black tracking-widest transition-all shadow-[0_0_15px_rgba(34,197,94,0)]",
              isStrategicSilence ? "bg-ghost-accent text-black shadow-[0_0_15px_rgba(34,197,94,0.3)]" : "bg-white/10 text-slate-400"
            )}
          >
            {isStrategicSilence ? "ACTIVE" : "DISABLED"}
          </button>
        </div>
        
        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
          <div className="flex justify-between items-center mb-3">
            <p className="text-xs font-black text-white uppercase flex items-center gap-2">
               <Thermometer className={cn("w-3 h-3", temperature > 60 ? "text-rose-500 animate-pulse" : "text-amber-500")} />
               Thermal Load
            </p>
            <Badge variant={temperature > 60 ? 'warning' : 'success'}>
              {temperature > 60 ? 'THROTTLED' : 'OPTIMAL'}
            </Badge>
          </div>
          <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden relative">
            <motion.div 
              className={cn(
                  "h-full transition-colors duration-500",
                  temperature > 60 ? "bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]" : "bg-ghost-accent shadow-[0_0_15px_rgba(34,197,94,0.5)]"
              )}
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(temperature, 100)}%` }}
            />
          </div>
          <p className="text-[9px] text-slate-600 font-mono mt-2 text-right uppercase tracking-widest">
             CORE_TEMP: {temperature}°C
          </p>
        </div>
      </div>
    </Card>
  );
}
