import React, { useState, useEffect, useRef } from 'react';
import { 
  Trophy, 
  Terminal, 
  Send, 
  Sparkles, 
  Cpu, 
  Zap,
  Activity,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Badge } from './ui/core';
import { cn } from '../lib/utils';
import { createAgentGraph, AgentState } from '../services/agentGraph';
import { HumanMessage, AIMessage, BaseMessage } from '@langchain/core/messages';

export function SovereignAgentConsole() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<BaseMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [optimizationLevel, setOptimizationLevel] = useState(82);
  const [logs, setLogs] = useState<string[]>(["SYSTEM_INITIALIZED: V33_CORE_STANDBY"]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const graph = useRef(createAgentGraph());

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, logs]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-15), `${new Date().toLocaleTimeString()} :: ${msg}`]);
  };

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMsg = new HumanMessage({ content: input });
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsProcessing(true);
    addLog(`USER_INPUT: "${input.substring(0, 20)}..."`);
    addLog(`TH_10_INVOKED: Graph processing...`);

    try {
      const inputs: Partial<AgentState> = { messages: [userMsg] };
      const config = { configurable: { thread_id: "demo_thread" } };
      
      const result = await graph.current.invoke(inputs, config);
      
      if (result.messages && (result.messages as any).length > 0) {
        const lastMsg = (result.messages as any)[(result.messages as any).length - 1];
        setMessages(prev => [...prev, lastMsg]);
        addLog(`TH_10_RESPONSE: Success.`);
        setOptimizationLevel(prev => Math.min(99.9, prev + 0.5));
      }
    } catch (err) {
      console.error(err);
      addLog(`ERROR: Graph execution failed.`);
      setMessages(prev => [...prev, new AIMessage({ content: "⚠️ ERROR: Sovereign override failed. Check telemetry." })]);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[700px]">
      {/* Left Column: Chat Console */}
      <Card className="lg:col-span-2 flex flex-col bg-black/80 border-amber-500/20 shadow-[0_0_50px_rgba(245,158,11,0.05)] overflow-hidden relative">
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-amber-500/5 backdrop-blur-md relative z-10">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/20 rounded-lg border border-amber-500/40 animate-pulse">
              <Sparkles className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="font-black text-white uppercase tracking-widest text-xs">Reactive Agentic Workspace</h3>
              <p className="text-[9px] text-amber-500/60 font-mono italic">TH_10 // AMD ROCm Optimized</p>
            </div>
          </div>
          <Badge variant="info" className="border-amber-500/30 text-amber-500 bg-amber-500/5 text-[9px]">
            {isProcessing ? 'STREAMING_INTEL' : 'CONNECTED'}
          </Badge>
        </div>

        <div 
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-none relative z-10"
        >
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
              <Trophy size={40} className="text-amber-500 mb-4 animate-bounce" />
              <h2 className="text-xl font-black text-white uppercase tracking-tighter">Sovereign Contest Node</h2>
              <p className="text-xs text-slate-400 max-w-xs mt-2">Initialize the TH_10 optimizer by engaging the reactive agent.</p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {messages.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={cn(
                  "flex flex-col gap-2 max-w-[85%]",
                  m instanceof HumanMessage ? "ml-auto items-end" : "mr-auto items-start"
                )}
              >
                <div className={cn(
                  "px-4 py-3 rounded-2xl text-sm font-medium leading-relaxed shadow-lg",
                  m instanceof HumanMessage 
                    ? "bg-amber-500 text-black font-bold rounded-tr-none" 
                    : "bg-white/5 border border-white/10 text-white rounded-tl-none backdrop-blur-sm"
                )}>
                  {m.content as string}
                </div>
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                  {m instanceof HumanMessage ? 'PROMPT_IDENTIFIED' : 'TH_10_ANALYSIS'}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>

          {isProcessing && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-2 text-amber-500/50 italic text-xs font-mono"
            >
              <Activity size={14} className="animate-spin" />
              Agent is thinking...
            </motion.div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-black/40 backdrop-blur-xl relative z-10">
          <div className="relative group">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Inject optimization parameters..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-5 pr-14 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-all placeholder:text-slate-600 font-medium"
            />
            <button 
              onClick={handleSend}
              disabled={isProcessing}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 bg-amber-500 text-black rounded-xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100 shadow-[0_0_15px_rgba(245,158,11,0.3)]"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </Card>

      {/* Right Column: Telemetry & Tools */}
      <div className="space-y-6">
        {/* Status Card */}
        <Card className="bg-[#0a0a0a] border-white/5 p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-amber-500/20 transition-all duration-700" />
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Build Efficiency</h4>
            <Badge variant="success" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/5">ROCm_ACTIVE</Badge>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-black text-white italic tracking-tighter">{optimizationLevel.toFixed(1)}</span>
            <span className="text-sm font-black text-amber-500 pb-2">%</span>
          </div>
          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${optimizationLevel}%` }}
              className="h-full bg-gradient-to-r from-amber-600 to-amber-400"
            />
          </div>
        </Card>

        {/* Live Logs */}
        <Card className="bg-black/90 border-white/5 flex flex-col h-[400px] overflow-hidden">
          <div className="p-3 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
            <Terminal size={14} className="text-slate-500" />
            <span className="text-[10px] font-mono font-black text-slate-500 uppercase tracking-widest">Graph Telemetry</span>
          </div>
          <div className="flex-1 p-4 font-mono text-[9px] space-y-1.5 overflow-y-auto scrollbar-none">
            {logs.map((log, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-slate-700">[{i}]</span>
                <span className={cn(
                  log.includes('ERROR') ? 'text-rose-500' : 
                  log.includes('RESPONSE') ? 'text-emerald-400' : 'text-slate-400'
                )}>{log}</span>
              </div>
            ))}
            {isProcessing && (
              <motion.div 
                animate={{ opacity: [0, 1] }} 
                transition={{ repeat: Infinity, duration: 0.5 }}
                className="w-1 h-3 bg-amber-500 inline-block align-middle ml-1"
              />
            )}
          </div>
        </Card>

        {/* Tool Cards */}
        <div className="grid grid-cols-2 gap-3">
          <button className="bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-2 group transition-all">
            <Cpu size={20} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
            <span className="text-[8px] font-black uppercase text-slate-400">AMD_SYNC</span>
          </button>
          <button className="bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl flex flex-col items-center gap-2 group transition-all">
            <Zap size={20} className="text-slate-500 group-hover:text-amber-500 transition-colors" />
            <span className="text-[8px] font-black uppercase text-slate-400">SURGE_API</span>
          </button>
        </div>
      </div>
    </div>
  );
}
