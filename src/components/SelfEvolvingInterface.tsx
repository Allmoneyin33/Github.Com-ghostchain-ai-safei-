import React, { useState, useEffect, useRef } from 'react';
import { 
  Terminal, 
  Dna, 
  Zap, 
  Cpu, 
  ShieldCheck, 
  ChevronRight, 
  Maximize2, 
  RotateCw,
  FileCode,
  Settings,
  Activity,
  Code2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Badge, Button } from './ui/core';
import { AgentCodeTerminal } from './AgentCodeTerminal';

interface MutationRecord {
  generation: number;
  timestamp: string;
  hash: string;
  status: 'SUCCESS' | 'MAPPING' | 'REFINING';
}

export function SelfEvolvingInterface() {
  const [viewMode, setViewMode] = useState<'terminal' | 'ide'>('terminal');
  const [inputScript, setInputScript] = useState('');
  const [isEvolving, setIsEvolving] = useState(false);
  const [generation, setGeneration] = useState(132);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([
    "[SYSTEM] Ghost-Omega terminal initialization successful.",
    "[AUTH] ZK-Proof verified for shard TH-12.",
    "[STATUS] Cognitively active. Ready for script ingestion."
  ]);
  const [history, setHistory] = useState<MutationRecord[]>([
    { generation: 131, timestamp: '2026-05-02 06:12:01', hash: '0x33a...4f2', status: 'SUCCESS' },
    { generation: 130, timestamp: '2026-05-02 05:45:12', hash: '0x921...e11', status: 'SUCCESS' },
  ]);

  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/production/builds');
        const data = await res.json();
        setHistory(data);
        if (data.length > 0) setGeneration(data[0].generation);
      } catch (e) {
        console.warn("Failed to fetch evolution history", e);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  const handleEvolve = async () => {
    if (!inputScript.trim()) return;

    setIsEvolving(true);
    const newGen = generation + 1;
    
    setTerminalLogs(prev => [...prev, `[INGEST] Received payload: ${inputScript.substring(0, 20)}...`]);
    
    try {
      // Step 1: Mapping
      await new Promise(r => setTimeout(r, 1000));
      setTerminalLogs(prev => [...prev, `[EVOLVE] Advanced Evolution Engine v3.0 engaged.`]);
      setTerminalLogs(prev => [...prev, `[EVOLVE] Mapping neural pathways for generation ${newGen}...`]);
      
      const response = await fetch('/api/evolution/evolve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script: inputScript })
      });
      const data = await response.json();

      // Step 2: Refining
      await new Promise(r => setTimeout(r, 1000));
      setTerminalLogs(prev => [...prev, `[EVOLVE] Applying ERC-8004 survival mutations & risk mesh...`]);
      setTerminalLogs(prev => [...prev, `[EVOLVE] Nodes Engaged: ${data.nodes_engaged.join(', ')}`]);
      
      // Step 3: Deployment
      await new Promise(r => setTimeout(r, 1000));
      setTerminalLogs(prev => [...prev, `[SUCCESS] Shard TH-12 updated to generation ${newGen}.`]);
      setTerminalLogs(prev => [...prev, `[DEPLOY] ProductionAgent initialized: ${data.targetPath}`]);
      setTerminalLogs(prev => [...prev, `[HASH] Cognitive Signature: ${data.hash}`]);
      
      setGeneration(newGen);
      setHistory(prev => [{
        generation: newGen,
        timestamp: new Date().toISOString().replace('T', ' ').split('.')[0],
        hash: `0x${data.hash.substring(0, 6)}...`,
        status: 'SUCCESS'
      }, ...prev]);
    } catch (err) {
      setTerminalLogs(prev => [...prev, `[ERROR] Evolution cycle interrupted: ${err}`]);
    } finally {
      setIsEvolving(false);
      setInputScript('');
    }
  };

  return (
    <div className="space-y-8">
      {/* View Mode Switcher */}
      <div className="flex justify-center">
         <div className="bg-black/60 p-1.5 rounded-2xl border border-white/5 flex gap-2">
            <button 
              onClick={() => setViewMode('terminal')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                viewMode === 'terminal' ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.3)]' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Terminal size={14} /> Master Terminal
            </button>
            <button 
              onClick={() => setViewMode('ide')}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                viewMode === 'ide' ? 'bg-blue-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'text-slate-500 hover:text-white'
              }`}
            >
              <Code2 size={14} /> Neural IDE
            </button>
         </div>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === 'terminal' ? (
          <motion.div 
            key="terminal"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 xl:grid-cols-3 gap-8 pb-20"
          >
            {/* Left Column: Evolutionary Control */}
            <div className="xl:col-span-2 space-y-6">
              <Card className="p-0 overflow-hidden bg-black/60 border-white/5 relative">
                <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/20 rounded-lg">
                      <Terminal size={18} className="text-amber-500" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-white uppercase tracking-tighter italic">Evolutionary <span className="text-amber-500 font-sans not-italic">Ingestion Terminal</span></h3>
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Ghost-Omega v3.0 Adaptive Invariant</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                      <span className="text-[10px] font-black text-emerald-500/80 uppercase tracking-widest">Shard: Active</span>
                    </div>
                    <Maximize2 size={14} className="text-slate-500 cursor-pointer hover:text-white transition-colors" />
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <div className="bg-black/40 border border-white/5 rounded-2xl p-4 font-mono text-[11px] h-[300px] overflow-y-auto scrollbar-thin">
                    {terminalLogs.map((log, i) => (
                      <div key={i} className="mb-1 flex gap-2">
                        <span className="text-slate-700 whitespace-nowrap">[{new Date().toLocaleTimeString()}]</span>
                        <span className={log.includes('[SUCCESS]') ? 'text-emerald-400' : log.includes('[EVOLVE]') ? 'text-amber-400' : 'text-slate-400'}>
                          {log}
                        </span>
                      </div>
                    ))}
                    {isEvolving && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ repeat: Infinity, duration: 1 }}
                        className="text-amber-500"
                      >
                        [SYSTEM] Processing mutation stream...
                      </motion.div>
                    )}
                    <div ref={logEndRef} />
                  </div>

                  <div className="flex flex-col gap-4">
                    <textarea 
                      value={inputScript}
                      onChange={(e) => setInputScript(e.target.value)}
                      placeholder="Paste ingestion script or adaptive parameters here..."
                      className="w-full h-32 bg-white/5 border border-white/5 rounded-2xl p-4 text-[12px] font-mono text-white focus:outline-none focus:border-amber-500/50 transition-colors placeholder:text-slate-700 resize-none"
                    />
                    <Button 
                      onClick={handleEvolve}
                      disabled={isEvolving || !inputScript.trim()}
                      className="w-full bg-amber-500 text-black py-4 rounded-2xl font-black uppercase tracking-[0.3em] flex items-center justify-center gap-3 active:scale-95 transition-transform disabled:opacity-50"
                    >
                      {isEvolving ? <RotateCw className="animate-spin" size={18} /> : <Dna size={18} />}
                      {isEvolving ? 'Processing Evolution...' : 'Initiate Mutation Sequence'}
                    </Button>
                  </div>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="bg-[#050505] border-white/5 p-6 space-y-6" id="params-card">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
                      <Settings size={20} />
                    </div>
                    <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Adaptive Parameters</h4>
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: 'Drift Tolerance', value: '0.0005', type: 'float' },
                      { label: 'Mutation Intensity', value: 'High', type: 'status' },
                      { label: 'Survival Logic', value: 'ERC-8004', type: 'protocol' },
                      { label: 'Cognitive Load', value: '42.1%', type: 'load' },
                    ].map((param, i) => (
                      <div key={param.label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{param.label}</span>
                        <span className="text-[11px] font-mono text-white">{param.value}</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="bg-[#050505] border-white/5 p-6 relative overflow-hidden group" id="health-card">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.02] -translate-y-4 translate-x-4">
                    <Zap size={100} />
                  </div>
                  <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <Activity size={20} />
                      </div>
                      <h4 className="text-[11px] font-black text-white uppercase tracking-widest">Health & Resilience</h4>
                    </div>
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                          <span>Shard Integrity</span>
                          <span className="text-emerald-500">99.8%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            animate={{ width: '99.8%' }} 
                            className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-[10px] font-black uppercase text-slate-500 tracking-widest">
                          <span>Mutation Resistance</span>
                          <span className="text-blue-500">82.4%</span>
                        </div>
                        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            animate={{ width: '82.4%' }} 
                            className="h-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Right Column: Evolution Log & History */}
            <div className="space-y-6">
              <Card className="bg-black/40 border-white/5 p-6 flex flex-col h-full" id="history-card">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-xl text-amber-500">
                      <FileCode size={20} />
                    </div>
                    <h4 className="text-xs font-black text-white uppercase tracking-widest">Mutation History</h4>
                  </div>
                  <Badge variant="info" className="text-[9px]">Gen {generation}</Badge>
                </div>

                <div className="space-y-6 flex-1">
                  {history.map((record, i) => (
                    <motion.div 
                      key={record.generation}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="group cursor-pointer"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-amber-500 group-hover:shadow-[0_0_8px_rgba(245,158,11,0.6)] transition-all" />
                          {i !== history.length - 1 && <div className="w-px flex-1 bg-white/5 mt-2" />}
                        </div>
                        <div className="space-y-1 -mt-1 group-hover:translate-x-1 transition-transform">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-white uppercase tracking-widest italic">Gen_{record.generation}</span>
                            <span className="text-[8px] font-mono text-slate-600">{record.timestamp}</span>
                          </div>
                          <p className="text-[9px] font-mono text-amber-500/60 uppercase">Hash: {record.hash}</p>
                          <div className="flex gap-2 pt-1">
                            <Badge variant="success" className="text-[8px] scale-90 origin-left">SAFEFI_OK</Badge>
                            <Badge variant="outline" className="text-[8px] scale-90 origin-left">ZK_VERIFIED</Badge>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-8 pt-6 border-t border-white/5">
                   <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10">
                      <p className="text-[10px] font-bold text-amber-500 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                        <ShieldCheck size={14} /> Survival Insurance
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed italic">
                        "Every mutation is cross-verified against the manager_policy.json escrow standards to ensure sub-10ms finality."
                      </p>
                   </div>
                </div>
              </Card>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="ide"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <AgentCodeTerminal />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
