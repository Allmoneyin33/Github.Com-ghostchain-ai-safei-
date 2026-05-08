import React from 'react';
import { 
  Database,
  TrendingUp
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  ResponsiveContainer, 
  YAxis, 
  Tooltip 
} from 'recharts';
import { Card } from './ui/core';

export function NetworkAnalysisPanel() {
  const data = [
    { time: '00:00', value: 3400, baseline: 3350 },
    { time: '04:00', value: 3500, baseline: 3350 },
    { time: '08:00', value: 3300, baseline: 3400 },
    { time: '12:00', value: 3800, baseline: 3450 },
    { time: '16:00', value: 3950, baseline: 3500 },
    { time: '20:00', value: 4100, baseline: 3600 },
    { time: '24:00', value: 4800, baseline: 3800 },
  ];

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
        <Database className="w-5 h-5 text-indigo-400" />
        Neural Network Prediction Analysis
      </h3>
      <Card className="bg-black/40 border-indigo-500/20 p-6 h-[240px] shadow-[0_0_30px_rgba(99,102,241,0.1)] group">
        <div className="flex justify-between items-center mb-4">
           <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">Live Vector Stream</span>
           </div>
           <div className="flex items-center gap-4 text-[10px] font-mono">
              <div className="flex items-center gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                 <div className="w-2 h-0.5 bg-indigo-500" />
                 <span className="text-slate-400">Predicted</span>
              </div>
              <div className="flex items-center gap-1.5 grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all">
                 <div className="w-2 h-0.5 bg-slate-600 border-t border-dashed" />
                 <span className="text-slate-400">Baseline</span>
              </div>
           </div>
        </div>
        <ResponsiveContainer width="100%" height="70%">
          <LineChart data={data}>
            <Tooltip 
              contentStyle={{ backgroundColor: '#050505', borderColor: '#6366f1', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.2)' }}
              itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
              labelStyle={{ color: '#64748b', fontSize: '10px', textTransform: 'uppercase' }}
            />
            <Line 
              type="basis" 
              dataKey="value" 
              stroke="#6366f1" 
              strokeWidth={3} 
              dot={false}
              animationDuration={2000}
            />
            <Line 
              type="monotone" 
              dataKey="baseline" 
              stroke="#334155" 
              strokeWidth={1} 
              strokeDasharray="4 4" 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  );
}
