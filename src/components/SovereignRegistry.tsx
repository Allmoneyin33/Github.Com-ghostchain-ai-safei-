import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { auth, db } from '../firebase';
import { collection, query, where, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Card, Badge } from './ui/core';
import { Cpu, Zap, Trash2, RefreshCw, BarChart3, Binary, ShieldAlert } from 'lucide-react';
import { cn } from '../lib/utils';

interface Agent {
  id: string;
  name: string;
  class: string;
  potency: number;
  iq: number;
  resonance: number;
  status: string;
  hash: string;
  description: string;
  specialty: string;
}

export function SovereignRegistry() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, 'sovereign_agents'), 
      where('userId', '==', auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Agent, 'id'>)
      }));
      setAgents(data);
      setLoading(false);
    }, (error) => {
      console.error("Registry Snapshot Error:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const evolveAgent = async (id: string, currentRes: number) => {
    try {
      const agentRef = doc(db, 'sovereign_agents', id);
      await updateDoc(agentRef, {
        resonance: Math.min(100, currentRes + (Math.random() * 5)),
        status: 'evolving'
      });
      setTimeout(() => {
        updateDoc(agentRef, { status: 'active' });
      }, 2000);
    } catch (err) {
      console.error("Evolution failed:", err);
    }
  };

  const decommissionAgent = async (id: string) => {
    if (confirm("Are you sure you want to decommission this sovereign entity? Its neural pattern will be erased from the GhostChain.")) {
      await deleteDoc(doc(db, 'sovereign_agents', id));
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-red-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Sovereign <span className="text-red-500">Registry</span></h3>
          <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">Authorized Neural Entities // Global Shard Density: {(agents.length * 0.12).toFixed(2)}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {agents.map((agent) => (
            <motion.div
              key={agent.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group relative"
            >
              <Card className="p-6 bg-slate-900/40 border-white/5 hover:border-red-500/20 transition-all overflow-hidden">
                <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <Binary className="w-24 h-24 text-white" />
                </div>
                
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-2xl",
                      agent.status === 'evolving' ? "bg-amber-500/20 text-amber-500 animate-pulse" : "bg-red-500/10 text-red-500"
                    )}>
                      <Cpu className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-white tracking-widest uppercase">{agent.name}</h4>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-[9px] border-white/10 text-slate-500 font-mono uppercase">
                          {agent.hash}
                        </Badge>
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          agent.status === 'active' ? "bg-emerald-500" : "bg-amber-500"
                        )} />
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => decommissionAgent(agent.id)}
                    className="p-2 text-slate-600 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="space-y-4 relative z-10">
                  <div className="p-3 bg-black/40 rounded-xl border border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-1">Neural Specialty</p>
                    <p className="text-xs text-white/90 font-mono italic">"{agent.specialty}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-[9px] text-slate-500 uppercase font-black">Resonance</p>
                      <div className="flex items-center gap-2">
                         <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${agent.resonance}%` }}
                              className="h-full bg-red-500"
                            />
                         </div>
                         <span className="text-[10px] font-mono text-white">{(agent.resonance).toFixed(0)}%</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] text-slate-500 uppercase font-black">Potency</p>
                      <p className="text-[11px] text-white font-mono">{(agent.potency * 100).toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="pt-4 flex gap-2">
                    <button 
                      onClick={() => evolveAgent(agent.id, agent.resonance)}
                      disabled={agent.status === 'evolving'}
                      className="flex-1 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={12} className={cn(agent.status === 'evolving' && "animate-spin")} />
                      {agent.status === 'evolving' ? 'Evolving...' : 'Evolve Neural Shard'}
                    </button>
                    <button className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.2)]">
                      <Zap size={14} fill="white" />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {agents.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center gap-4 border border-dashed border-white/5 rounded-[2.5rem] bg-slate-900/20 opacity-40">
             <ShieldAlert className="w-12 h-12 text-slate-700" />
             <p className="text-xs font-mono text-slate-600 uppercase">Registry Empty // Synthesize Entities in the Nexus</p>
          </div>
        )}
      </div>
    </div>
  );
}
