import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Sparkles, Send, BrainCircuit, Bot, Info, Globe } from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'oracle';
  text: string;
  timestamp: Date;
}

export function SovereignOracle() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'init',
      role: 'oracle',
      text: "The shards are aligned. What does your neural pattern seek to understand about the GhostChain?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/sovereign/oracle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: input })
      });

      const data = await res.json();
      
      const oracleMsg: Message = {
        id: Math.random().toString(),
        role: 'oracle',
        text: data.response || "The neural connection has momentarily drifted. Attempt synchronization again.",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, oracleMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full bg-slate-950 p-8 flex flex-col gap-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent shadow-[0_0_15px_rgba(230,0,0,0.5)]" />
        
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col gap-8 z-10 overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-600/10 border border-red-600/20 rounded-2xl shadow-[0_0_20px_rgba(220,38,38,0.1)]">
                        <Globe className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-[0.2em]">Sovereign <span className="text-red-500">Oracle</span></h2>
                        <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Collective Intelligence Interface v2.0</p>
                    </div>
                </div>
                <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Synaptic Link Stable</span>
                </div>
            </div>

            <div className="flex-1 bg-black/40 border border-white/5 rounded-[2.5rem] p-6 backdrop-blur-xl flex flex-col overflow-hidden shadow-inner">
                <div className="flex-1 overflow-y-auto space-y-8 pr-4 no-scrollbar" ref={scrollRef}>
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg) => (
                            <motion.div 
                                key={msg.id}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                className={cn(
                                    "flex items-start gap-4 max-w-[85%]",
                                    msg.role === 'user' ? "ml-auto flex-row-reverse" : "mr-auto"
                                )}
                            >
                                <div className={cn(
                                    "p-2 rounded-xl flex-none",
                                    msg.role === 'user' ? "bg-red-600 text-white" : "bg-white/10 text-slate-400"
                                )}>
                                    {msg.role === 'user' ? <BrainCircuit size={16} /> : <Bot size={16} />}
                                </div>
                                <div className={cn(
                                    "p-6 rounded-[1.8rem] text-sm leading-relaxed",
                                    msg.role === 'user' 
                                        ? "bg-red-600 text-white font-bold rounded-tr-none" 
                                        : "bg-white/[0.05] border border-white/5 text-slate-300 italic font-medium rounded-tl-none shadow-xl"
                                )}>
                                    {msg.text}
                                    <p className={cn(
                                        "text-[8px] mt-2 font-mono uppercase tracking-widest opacity-40",
                                        msg.role === 'user' ? "text-right" : "text-left"
                                    )}>
                                        {msg.timestamp.toLocaleTimeString()}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isLoading && (
                        <div className="flex items-center gap-3 text-slate-500 italic ml-2">
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                            >
                                <RefreshCw size={14} />
                            </motion.div>
                            <span className="text-xs font-mono tracking-widest uppercase">Consulting the shards...</span>
                        </div>
                    )}
                </div>

                <div className="mt-8 pt-8 border-t border-white/5">
                    <div className="relative group">
                        <input 
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Interrogate the Oracle..."
                            className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 px-6 pr-14 text-sm text-white placeholder:text-slate-700 outline-none focus:border-red-500/50 focus:bg-white/[0.05] transition-all"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2 top-2 p-3 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-all shadow-lg active:scale-90 disabled:opacity-50"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                    <div className="mt-4 flex items-center justify-center gap-8">
                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                            <Info size={10} /> Neural Privacy Active
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-600 uppercase tracking-widest">
                            <Sparkles size={10} className="text-red-500" /> Powered by GhostAI v4
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                    <p className="text-[10px] text-red-500 uppercase font-black tracking-widest">Vault Insights</p>
                    <p className="text-xs text-slate-500 leading-relaxed">Oracle analyzes liquidity flows across decentralized vaults to predict volatility.</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                    <p className="text-[10px] text-cyan-400 uppercase font-black tracking-widest">Shard Telemetry</p>
                    <p className="text-xs text-slate-500 leading-relaxed">Real-time mapping of network nodes to identify neural resonance patterns.</p>
                </div>
                <div className="p-4 bg-white/[0.02] border border-white/5 rounded-2xl space-y-2">
                    <p className="text-[10px] text-amber-500 uppercase font-black tracking-widest">Market Forecasting</p>
                    <p className="text-xs text-slate-500 leading-relaxed">Generative predictions based on high-frequency syntactic signal processing.</p>
                </div>
            </div>
        </div>
    </div>
  );
}

const RefreshCw = ({ size, className }: { size?: number, className?: string }) => (
    <svg 
        width={size || 24} 
        height={size || 24} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={cn("lucide lucide-refresh-cw", className)}
    >
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
        <path d="M21 3v5h-5"/>
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
        <path d="M3 21v-5h5"/>
    </svg>
);
