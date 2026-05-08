import React, { useState, useEffect } from 'react';
import { 
  ClipboardList, Plus, Play, CheckCircle2, 
  XCircle, Clock, ChevronRight,
  TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { handleFirestoreError, OperationType } from '../lib/errors';

interface AgentTask {
  id: string;
  agentId: string;
  userId: string;
  type: string;
  priority: number;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  payload: Record<string, unknown>;
  result?: Record<string, unknown>;
  error?: string;
  createdAt: { toDate: () => Date };
  updatedAt: { toDate: () => Date };
}

import { Agent } from '../types/frontend';

interface AgentTaskPanelProps {
  userId: string;
  agents: Agent[];
}

export function AgentTaskPanel({ userId, agents }: AgentTaskPanelProps) {
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [newTask, setNewTask] = useState({
    agentId: agents[0]?.agentId || '',
    type: 'market-analysis',
    priority: 5,
    payload: '{}'
  });

  useEffect(() => {
    if (!userId) return;
    const q = query(
      collection(db, 'agent_tasks'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskData = snapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      } as unknown as AgentTask));
      setTasks(taskData);
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'agent_tasks'));

    return () => unsubscribe();
  }, [userId]);

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let payloadObj = {};
      try { payloadObj = JSON.parse(newTask.payload); } catch { payloadObj = { raw: newTask.payload }; }

      const taskData = {
        agentId: newTask.agentId || agents[0]?.agentId || 'system',
        userId,
        type: newTask.type,
        priority: Number(newTask.priority),
        status: 'pending',
        payload: payloadObj,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      await addDoc(collection(db, 'agent_tasks'), taskData);
      setIsAdding(false);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'agent_tasks');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-rose-500" />;
      case 'in-progress': return <Play className="w-4 h-4 text-blue-500 animate-pulse" />;
      default: return <Clock className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-600/10 rounded-lg">
            <ClipboardList className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest">Neural Task Queue</h3>
            <p className="text-[10px] text-slate-500 uppercase tracking-tighter">Autonomous agent instruction stream</p>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="p-2 bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition-all group"
        >
          <Plus className={`w-5 h-5 text-slate-400 group-hover:text-white transition-transform ${isAdding ? 'rotate-45' : ''}`} />
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.form 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onSubmit={addTask}
            className="p-4 bg-slate-900/50 border border-white/5 rounded-xl space-y-4 overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="label-micro opacity-40">Target Agent</label>
                <select 
                  value={newTask.agentId}
                  onChange={(e) => setNewTask({...newTask, agentId: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg p-2 text-[11px] text-white font-black uppercase outline-none focus:border-red-500/50"
                >
                  {agents.map(a => (
                    <option key={a.id} value={a.agentId}>{a.name}</option>
                  ))}
                  <option value="system">GLOBAL_CORE</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="label-micro opacity-40">Task Type</label>
                <input 
                  type="text"
                  value={newTask.type}
                  onChange={(e) => setNewTask({...newTask, type: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg p-2 text-[11px] text-white font-mono outline-none focus:border-red-500/50"
                  placeholder="e.g. market-recon"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1.5">
                <label className="label-micro opacity-40">Priority (1-10)</label>
                <input 
                  type="number"
                  min="1" max="10"
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: Number(e.target.value)})}
                  className="w-full bg-black border border-white/10 rounded-lg p-2 text-[11px] text-white font-mono outline-none focus:border-red-500/50"
                />
              </div>
              <div className="space-y-1.5">
                <label className="label-micro opacity-40">Payload (JSON)</label>
                <input 
                  type="text"
                  value={newTask.payload}
                  onChange={(e) => setNewTask({...newTask, payload: e.target.value})}
                  className="w-full bg-black border border-white/10 rounded-lg p-2 text-[11px] text-white font-mono outline-none focus:border-red-500/50"
                  placeholder='{"key": "value"}'
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-black uppercase tracking-widest shadow-[0_0_10px_rgba(230,0,0,0.3)] transition-all"
            >
              Broadcast Instruction
            </button>
          </motion.form>
        )}
      </AnimatePresence>

      <div className="space-y-2 max-h-[400px] overflow-y-auto no-scrollbar">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="group p-3 bg-white/[0.02] border border-white/5 rounded-xl hover:border-red-500/30 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="flex flex-col items-center">
                 <span className={`text-[8px] font-black w-5 h-5 flex items-center justify-center rounded border ${
                   task.priority <= 3 ? 'border-red-500/40 text-red-500 bg-red-500/5' : 
                   task.priority <= 7 ? 'border-amber-500/40 text-amber-500 bg-amber-500/5' : 
                   'border-slate-500/40 text-slate-500 bg-slate-500/5'
                 }`}>
                   {task.priority}
                 </span>
                 <div className="w-px h-2 bg-white/5 my-0.5" />
                 {getStatusIcon(task.status)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold text-white uppercase tracking-tight">{task.type}</span>
                  <span className="text-[9px] text-slate-600 font-mono">@{task.agentId}</span>
                </div>
                <p className="text-[9px] text-slate-500 uppercase tracking-tighter">
                  {task.status === 'completed' ? 'EXECUTION_SUCCESSFUL' : 
                   task.status === 'failed' ? `ERROR: ${task.error || 'ABORTED'}` : 
                   `SINCE: ${task.createdAt?.toDate().toLocaleTimeString() || 'INF'}`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[10px] font-mono text-slate-400">
                  {task.status === 'completed' ? <TrendingUp className="w-3 h-3 text-emerald-500 inline mr-1" /> : <ChevronRight className="w-3 h-3 inline mr-1 opacity-20" />}
                  SHARD_{task.id.slice(0, 4)}
                </div>
                <div className="label-micro opacity-30 text-[8px]">PROCESSED_IN_NODE</div>
              </div>
            </div>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="py-12 text-center opacity-20 flex flex-col items-center gap-3">
            <ClipboardList className="w-8 h-8" />
            <span className="label-micro">No tasks in active queue...</span>
          </div>
        )}
      </div>
    </div>
  );
}
