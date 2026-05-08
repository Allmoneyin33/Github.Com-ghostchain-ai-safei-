import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Loader2, Zap } from 'lucide-react';
import { cn, triggerHaptic } from '../lib/utils';
import { Card } from './ui/core';
import { apiService } from '../services/api';

interface AuditResult {
  id?: number;
  riskScore: number;
  summary: string;
  vulnerabilities: string[];
  timestamp?: Date;
  input?: string;
}

interface ContractAuditorProps {
  onAuditConfirmed: (auditResult: AuditResult) => void;
}

export function ContractAuditor({ onAuditConfirmed }: ContractAuditorProps) {
  const [auditInput, setAuditInput] = useState("");
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const [savedAudits, setSavedAudits] = useState<AuditResult[]>([]);

  const runAudit = async () => {
    if (!auditInput) return;
    triggerHaptic('warning');
    setIsAuditing(true);
    try {
      const data = await apiService.runAudit(auditInput);
      setAuditResult(data);
      triggerHaptic('success');
    } catch (err) {
      triggerHaptic('error');
      console.error("Audit failed", err);
    } finally {
      setIsAuditing(false);
    }
  };

  const confirmAudit = () => {
    if (!auditResult) return;
    triggerHaptic('success');
    const finalizedAudit: AuditResult = { 
      ...auditResult, 
      id: Date.now(), 
      timestamp: new Date(), 
      input: auditInput 
    };
    setSavedAudits(prev => [finalizedAudit, ...prev]);
    onAuditConfirmed(finalizedAudit);
    setAuditResult(null);
    setAuditInput("");
  };

  const discardAudit = () => {
    triggerHaptic('warning');
    setAuditResult(null);
  };

  return (
    <Card className="border-amber-500/30">
      <h2 className="text-lg font-black text-white uppercase tracking-tight mb-4 flex items-center gap-2">
        <ShieldCheck className="w-5 h-5 text-amber-500" />
        Contract Audit Protocol
      </h2>
      <div className="space-y-4">
        <textarea
          value={auditInput}
          onChange={(e) => setAuditInput(e.target.value)}
          placeholder="Paste Smart Contract source code or target ABI Hash here..."
          className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:ring-1 focus:ring-amber-500 focus:border-transparent transition-all min-h-[100px] font-mono custom-scrollbar"
        />
        
        <AnimatePresence mode="wait">
          {!auditResult ? (
            <motion.button
              key="scan-btn"
              onClick={runAudit}
              disabled={isAuditing || !auditInput}
              className="w-full flex items-center justify-center gap-2 bg-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black font-black uppercase text-xs p-3 rounded-xl border border-amber-500/50 transition-all disabled:opacity-50"
            >
              {isAuditing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Execute Deep-Scan Iteration
            </motion.button>
          ) : (
            <motion.div 
              key="result-panel"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-amber-500 font-black tracking-widest uppercase">Verification Required</span>
                <div className="text-xs font-black">
                  Risk Score: <span className={cn(auditResult.riskScore > 75 ? "text-rose-500" : "text-emerald-500")}>{auditResult.riskScore}/100</span>
                </div>
              </div>
              
              <div className="bg-black/50 p-2 rounded border border-white/5">
                <p className="text-[10px] font-mono text-slate-300 mb-2">{auditResult.summary}</p>
                <ul className="list-disc pl-4 space-y-1">
                  {auditResult.vulnerabilities?.map((vuln: string, i: number) => (
                    <li key={i} className="text-[9px] text-rose-400 font-mono">{vuln}</li>
                  ))}
                </ul>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={confirmAudit}
                  className="flex-1 bg-amber-500 text-black font-black uppercase text-[10px] py-2 rounded-lg hover:brightness-110 transition-all shadow-[0_0_10px_rgba(245,158,11,0.3)]"
                >
                  Confirm & Finalize
                </button>
                <button
                  onClick={discardAudit}
                  className="flex-1 bg-white/5 text-slate-400 hover:text-white font-black uppercase text-[10px] py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-all"
                >
                  Discard Matrix
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {savedAudits.length > 0 && (
          <div className="mt-4 border-t border-white/5 pt-4">
            <p className="text-[9px] uppercase font-black text-slate-500 tracking-widest mb-2">Verified Scans</p>
            <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
              {savedAudits.map(audit => (
                <div key={audit.id} className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                  <span className="text-[10px] text-slate-300 font-mono truncate max-w-[150px]">{audit.input?.slice(0,10) || 'Unknown'}...</span>
                  <span className={cn("text-[9px] font-black px-1.5 py-0.5 rounded", audit.riskScore > 75 ? "bg-rose-500/20 text-rose-500" : "bg-emerald-500/20 text-emerald-500")}>
                    {audit.riskScore}/100
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
