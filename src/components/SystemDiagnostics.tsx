import React from 'react';
import { Cpu, Activity, HardDrive, Terminal, RefreshCw, Server } from 'lucide-react';
import { Card, Badge } from './ui/core';

interface SystemDiagnosticsProps {
  data: {
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
  } | null;
}

export const SystemDiagnostics: React.FC<SystemDiagnosticsProps> = ({ data }) => {
  if (!data || !data.success) {
    return (
      <Card className="p-6 bg-black/40 border-white/5 h-full flex flex-col items-center justify-center space-y-4">
        <Activity className="w-8 h-8 text-slate-500 animate-pulse" />
        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Awaiting System Telemetry...</p>
      </Card>
    );
  }

  const { systemData, pm2Status, timestamp } = data;

  const formatBytes = (bytes: number) => {
    const gb = bytes / (1024 * 1024 * 1024);
    return `${gb.toFixed(2)} GB`;
  };

  return (
    <Card className="flex flex-col h-full bg-black/40 border-white/5 overflow-hidden group">
      <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
             <Server className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-tighter">Singularity Deployment Core v150.4</h3>
            <p className="text-[10px] text-slate-500 font-mono italic">Autonomous Diagnostics Engine</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[9px] border-emerald-500/20 text-emerald-400 font-mono">
                {systemData.amdHardware}
            </Badge>
            <RefreshCw className="w-3 h-3 text-slate-500 animate-spin-slow" />
        </div>
      </div>

      <div className="p-4 flex-1 space-y-4 custom-scrollbar overflow-y-auto">
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processors</span>
            </div>
            <p className="text-lg font-black text-white">{systemData.cpus} Cores</p>
            <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">{systemData.arch} / {systemData.system}</p>
          </div>

          <div className="p-3 bg-white/[0.03] rounded-xl border border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <HardDrive className="w-3.5 h-3.5 text-purple-400" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">RAM Allocation</span>
            </div>
            <p className="text-lg font-black text-white">{formatBytes(systemData.totalMemory - systemData.freeMemory)}</p>
            <p className="text-[9px] text-slate-500 font-mono mt-1 uppercase">OF {formatBytes(systemData.totalMemory)} TOTAL</p>
          </div>
        </div>

        <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                    <Terminal className="w-3.5 h-3.5 text-amber-500" />
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">Process Monitor</span>
                </div>
                <span className="text-[9px] text-slate-500 font-mono">Uptime: {Math.floor(systemData.uptime / 3600)}h {Math.floor((systemData.uptime % 3600) / 60)}m</span>
            </div>
            <div className="bg-black/60 p-3 rounded-xl border border-white/5 font-mono text-[10px] text-emerald-400 leading-relaxed max-h-[200px] overflow-y-auto custom-scrollbar">
                <pre className="whitespace-pre-wrap">{pm2Status}</pre>
            </div>
        </div>

        <div className="pt-2 flex items-center justify-between text-[9px] text-slate-600 font-mono uppercase tracking-widest">
            <span>Last Sync: {new Date(timestamp).toLocaleTimeString()}</span>
            <span>Status: Operational</span>
        </div>
      </div>
    </Card>
  );
};
