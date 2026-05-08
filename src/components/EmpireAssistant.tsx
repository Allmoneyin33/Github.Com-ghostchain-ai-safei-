import React, { useState } from 'react';
import { 
  Bot, 
  MessageSquare, 
  X, 
  Zap, 
  Sparkles,
  Command,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/core';

interface EmpireAssistantProps {
  onCommand: (command: string) => void;
}

export function EmpireAssistant({ onCommand }: EmpireAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'ai' | 'user', text: string}[]>([
    { role: 'ai', text: "Welcome, Sovereign. Empire-7731 is at your command. How shall we secure the Ghostchain today?" }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', text: input }]);
    // In a real app, we'd call empireService here
    // For now, let's simulate a response or trigger a command
    if (input.startsWith('/')) {
      onCommand(input);
      setMessages(prev => [...prev, { role: 'ai', text: `Executing sovereign directive: ${input}...` }]);
    } else {
      setMessages(prev => [...prev, { role: 'ai', text: "Processing neural request... Tactical analysis incoming." }]);
    }
    setInput('');
  };

  return (
    <>
      {/* Floating Trigger */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 bg-ghost-accent text-black p-4 rounded-full shadow-[0_0_30px_rgba(34,197,94,0.5)] border-4 border-black"
      >
        <Bot className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 rounded-full border-2 border-black animate-pulse" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-[400px]"
          >
            <Card className="flex flex-col h-[500px] border-ghost-accent/20 bg-black/90 backdrop-blur-xl shadow-2xl p-0 overflow-hidden">
              {/* Header */}
              <div className="p-4 border-b border-white/10 flex items-center justify-between bg-ghost-accent/5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-ghost-accent rounded-lg">
                    <Sparkles className="w-4 h-4 text-black" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Empire Assistant</h3>
                    <p className="text-[10px] text-ghost-accent font-mono">v138.0 Neural Link</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/10 rounded-lg text-slate-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                      m.role === 'user' 
                        ? 'bg-ghost-accent/10 border border-ghost-accent/20 text-white font-mono' 
                        : 'bg-white/5 border border-white/5 text-slate-300 font-sans'
                    }`}>
                      {m.role === 'ai' && (
                        <div className="flex items-center gap-1.5 mb-1 opacity-50">
                           <Zap className="w-3 h-3 text-ghost-accent" />
                           <span className="text-[9px] font-black uppercase tracking-widest">Empire_Mind</span>
                        </div>
                      )}
                      {m.text}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Commands */}
              <div className="p-2 border-t border-white/5 bg-white/[0.02] flex gap-2 overflow-x-auto scrollbar-none">
                {['/insight', '/spawn analyst', '/squad', '/agentic', '/market', '/profit', '/contest', '/deploy', '/lockdown'].map(cmd => (
                  <button
                    key={cmd}
                    onClick={() => setInput(cmd)}
                    className="whitespace-nowrap px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full text-[10px] font-mono text-slate-400 border border-white/5"
                  >
                    {cmd}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-white/10 bg-black/40">
                <div className="relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Issue sovereign directive..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:border-ghost-accent transition-all font-mono"
                  />
                  <button
                    onClick={handleSend}
                    className="absolute right-2 top-2 p-2 bg-ghost-accent rounded-lg text-black hover:scale-105 active:scale-95 transition-all"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
