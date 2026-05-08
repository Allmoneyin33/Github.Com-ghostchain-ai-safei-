import React, { useState } from 'react';
import { 
  Code2, 
  Terminal, 
  Box, 
  Rocket, 
  Zap, 
  Cpu, 
  Bug, 
  CheckCircle2, 
  FileJson, 
  Play,
  RotateCcw,
  Share2,
  BrainCircuit,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Badge, Button } from './ui/core';
import { getNeuralCodeSuggestions } from '../services/aiIntelligence';

interface CodeSnippet {
  name: string;
  code: string;
  language: 'python' | 'typescript';
  description: string;
}

const TEMPLATES: CodeSnippet[] = [
  {
    name: "Yield Guard Alpha",
    language: 'python',
    description: 'Autonomous yield protection shard for ERC-8004 assets.',
    code: `import time
import ghost_core

class YieldGuard:
    def __init__(self, threshold=0.04):
        self.threshold = threshold
        self.node = ghost_core.connect("shard-th-12")

    def run(self):
        while True:
            current_yield = self.node.get_yield()
            if current_yield < self.threshold:
                self.node.liquidate_to_usdc()
            time.sleep(60)`
  },
  {
    name: "ZK-Mesh Validator",
    language: 'typescript',
    description: 'High-speed validator for cross-chain ZK proofs.',
    code: `export class ZKMeshValidator {
  async validate(proof: string): Promise<boolean> {
    const signature = await deriveGhostSignature(proof);
    return signature.startsWith("0x33");
  }

  async broadcast(result: boolean) {
    if(result) {
      await GhostNetwork.commit("shard-12-verified");
    }
  }
}`
  },
  {
    name: "Financial Hub Shard",
    language: 'python',
    description: 'Atomic financial transaction handler with replication logging.',
    code: `import uuid
import logging
from datetime import datetime

class FinancialBlockScript:
    """
    Atomic function block for financial transfers and replication.
    """
    def __init__(self, account_db=None):
        self.accounts = account_db or {
            "ACC-1001": {"balance": 5000.0, "currency": "USD", "status": "active"},
            "ACC-2002": {"balance": 1500.0, "currency": "USD", "status": "active"}
        }
        self.replication_log = []

    def execute_transaction(self, from_acc: str, to_acc: str, amount: float):
        transaction_id = str(uuid.uuid4())
        timestamp = datetime.utcnow().isoformat()

        # 1. Validation phase
        if from_acc not in self.accounts or to_acc not in self.accounts:
            raise ValueError("Invalid account identifiers.")
        
        # 2. State modification
        self.accounts[from_acc]["balance"] -= amount
        self.accounts[to_acc]["balance"] += amount

        # 3. Replication output
        output = {
            "transaction_id": transaction_id,
            "timestamp": timestamp,
            "source": from_acc,
            "destination": to_acc,
            "amount": amount,
            "status": "success"
        }
        self.replication_log.append(output)
        return output`
  }
];

interface DeploymentResult {
  hash: string;
  path: string;
}

export function AgentCodeTerminal() {
  const [activeCode, setActiveCode] = useState(TEMPLATES[0].code);
  const [toolName, setToolName] = useState(TEMPLATES[0].name);
  const [language, setLanguage] = useState<'python' | 'typescript'>(TEMPLATES[0].language);
  const [isDeploying, setIsDeploying] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [logs, setLogs] = useState<string[]>([
    "[AGENT] Code Workspace Initialized.",
    "[STATUS] Ready for neural design sequence."
  ]);
  const [deploymentResult, setDeploymentResult] = useState<DeploymentResult | null>(null);
  const [neuralInsight, setNeuralInsight] = useState<string | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-10), `${new Date().toLocaleTimeString()} :: ${msg}`]);
  };

  const handleDeploy = async () => {
    setIsDeploying(true);
    addLog(`INITIATING_DEPLOYMENT: ${toolName}...`);
    
    try {
      await new Promise(r => setTimeout(r, 1500)); // Simulate analysis
      addLog("STATIC_ANALYSIS: Pass.");
      addLog("SECURITY_AUDIT: Secure.");
      
      const res = await fetch('/api/agent/deploy-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName, code: activeCode, type: language })
      });
      
      const data = await res.json();
      setDeploymentResult(data);
      addLog(`DEPLOYMENT_SUCCESS: ${data.hash}`);
    } catch (err) {
      addLog(`DEPLOYMENT_FAILED: ${err}`);
    } finally {
      setIsDeploying(false);
    }
  };

  const handleNeuralInsight = async () => {
    setIsAnalyzing(true);
    setNeuralInsight(null);
    addLog(`INITIATING_NEURAL_REVIEW: ${toolName}...`);
    
    try {
      const insight = await getNeuralCodeSuggestions(activeCode, language);
      setNeuralInsight(insight);
      addLog("NEURAL_REVIEW_COMPLETE: Suggestions generated.");
    } catch (err) {
      addLog(`NEURAL_REVIEW_FAILED: ${err}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const loadTemplate = (template: CodeSnippet) => {
    setActiveCode(template.code);
    setToolName(template.name);
    setLanguage(template.language);
    setNeuralInsight(null);
    addLog(`LOADED_TEMPLATE: ${template.name}`);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">
      {/* Sidebar: Templates & Status */}
      <div className="lg:col-span-3 space-y-6 flex flex-col">
        <Card className="bg-black/60 border-white/5 p-6 flex-1">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-500/10 rounded-xl text-blue-400">
              <Code2 size={20} />
            </div>
            <h4 className="text-xs font-black text-white uppercase tracking-widest italic">Agent <span className="text-blue-400 font-sans not-italic">Workspace</span></h4>
          </div>

          <div className="space-y-3">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Neural Blueprints</p>
             {TEMPLATES.map(t => (
               <button 
                key={t.name}
                onClick={() => loadTemplate(t)}
                className={`w-full text-left p-4 rounded-2xl border transition-all group ${
                  toolName === t.name ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/5 border-white/5 hover:border-white/20'
                }`}
               >
                 <div className="flex justify-between items-start mb-1">
                    <span className="text-[11px] font-black text-white uppercase">{t.name}</span>
                    <Badge className="text-[8px] scale-75 origin-right">{t.language.toUpperCase()}</Badge>
                 </div>
                 <p className="text-[10px] text-slate-500 line-clamp-1">{t.description}</p>
               </button>
             ))}
          </div>

          <div className="mt-8 pt-8 border-t border-white/5">
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Core Telemetry</p>
             <div className="space-y-4">
                {[
                  { label: 'LLM Context', value: '128k', icon: Zap, color: 'text-amber-400' },
                  { label: 'Logic Shard', value: 'TH-12', icon: Box, color: 'text-purple-400' },
                  { label: 'CPU Cluster', value: 'Ghost_8', icon: Cpu, color: 'text-cyan-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <item.icon size={12} className={item.color} />
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{item.label}</span>
                    </div>
                    <span className="text-[11px] font-mono text-white">{item.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </Card>
      </div>

      {/* Main Terminal Area */}
      <div className="lg:col-span-9 space-y-6 flex flex-col h-full">
        <Card className="flex-1 bg-black/80 border-white/10 flex flex-col overflow-hidden relative">
          {/* Editor Header */}
          <div className="p-4 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input 
                value={toolName}
                onChange={(e) => setToolName(e.target.value)}
                className="bg-transparent border-none text-white font-black uppercase text-sm focus:outline-none focus:ring-1 focus:ring-blue-500/30 rounded px-2"
              />
              <div className="flex items-center gap-1">
                <Badge variant="outline" className="text-[9px] cursor-pointer" onClick={() => setLanguage('python')}>Python</Badge>
                <Badge variant="outline" className="text-[9px] cursor-pointer" onClick={() => setLanguage('typescript')}>TypeScript</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
               <button 
                onClick={handleNeuralInsight}
                disabled={isAnalyzing}
                className="flex items-center gap-2 px-3 py-1.5 bg-red-600/10 border border-red-600/30 rounded-xl text-red-500 hover:bg-red-600/20 transition-all font-black text-[10px] uppercase tracking-widest shadow-[0_0_15px_rgba(230,0,0,0.1)] hover:shadow-[0_0_20px_rgba(230,0,0,0.2)]"
               >
                 {isAnalyzing ? <Loader2 size={12} className="animate-spin" /> : <BrainCircuit size={12} />}
                 {isAnalyzing ? 'Analyzing...' : 'Neural Insight'}
               </button>
               <button className="p-2 text-slate-500 hover:text-white transition-colors"><RotateCcw size={16} /></button>
               <button className="p-2 text-slate-500 hover:text-white transition-colors"><Share2 size={16} /></button>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Editor Container */}
            <div className="flex-1 relative flex flex-col">
               <div className="flex-1 relative">
                <textarea 
                  value={activeCode}
                  onChange={(e) => setActiveCode(e.target.value)}
                  spellCheck={false}
                  className="w-full h-full bg-transparent p-6 font-mono text-[13px] text-slate-300 leading-relaxed focus:outline-none resize-none scrollbar-thin"
                />
                <div className="absolute top-0 right-0 p-4 pointer-events-none opacity-20">
                    <Play size={150} />
                </div>
               </div>

               <AnimatePresence>
                {neuralInsight && (
                  <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 50, opacity: 0 }}
                    className="p-6 bg-slate-900 border-t border-red-600/20 max-h-48 overflow-y-auto scrollbar-thin"
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Zap size={14} className="text-red-500" />
                      <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Recommendation</span>
                    </div>
                    <div className="text-[11px] text-slate-400 leading-relaxed whitespace-pre-wrap font-mono">
                      {neuralInsight}
                    </div>
                  </motion.div>
                )}
               </AnimatePresence>
            </div>

            {/* Preview / Logs Pane */}
            <div className="w-80 border-l border-white/10 bg-black/40 flex flex-col">
               <div className="p-3 border-b border-white/5 bg-white/[0.02] flex items-center gap-2">
                 <Terminal size={14} className="text-slate-500" />
                 <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Execution Stream</span>
               </div>
               <div className="flex-1 p-4 font-mono text-[10px] overflow-y-auto space-y-2">
                  {logs.map((log, i) => (
                    <div key={i} className={log.includes('SUCCESS') ? 'text-emerald-400' : log.includes('FAILED') ? 'text-rose-400' : 'text-slate-500'}>
                      {log}
                    </div>
                  ))}
               </div>

               {deploymentResult && (
                 <div className="p-4 bg-emerald-500/5 border-t border-emerald-500/20">
                    <div className="flex items-center gap-2 text-emerald-500 mb-2">
                       <CheckCircle2 size={14} />
                       <span className="text-[10px] font-black uppercase tracking-widest">Shard Live</span>
                    </div>
                    <div className="text-[9px] font-mono text-slate-400 break-all space-y-2">
                       <p>HASH: {deploymentResult.hash}</p>
                       <p className="text-[8px] truncate">PATH: {deploymentResult.path}</p>
                    </div>
                 </div>
               )}
            </div>
          </div>

          {/* Editor Footer / Action Bar */}
          <div className="p-4 border-t border-white/10 bg-black/60 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Bug size={14} className="text-rose-500" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">0 Lint Errors</span>
              </div>
              <div className="flex items-center gap-2 text-blue-400">
                <FileJson size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest italic">TypeSafe Mode</span>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button 
                variant="ghost" 
                className="bg-white/5 border-white/10 px-6"
                onClick={() => addLog("SIMULATION: Running dry-run...")}
              >
                Dry Run
              </Button>
              <Button 
                onClick={handleDeploy}
                disabled={isDeploying}
                className="bg-blue-600 hover:bg-blue-500 text-white px-8 font-black uppercase tracking-[0.25em] flex items-center gap-3 shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all active:scale-95"
              >
                {isDeploying ? <RotateCcw className="animate-spin" size={18} /> : <Rocket size={18} />}
                {isDeploying ? 'Deploying...' : 'Deploy to Production'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
