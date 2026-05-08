import React, { useState, useEffect } from 'react';
import { 
  Upload, 
  FileText, 
  Shield, 
  Database, 
  CheckCircle2, 
  Loader2,
  HardDrive,
  Mail,
  Download,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Badge } from './ui/core';
import { knowledgeService, KnowledgeDoc } from '../services/knowledgeService';

export function DataIngestionPanel() {
  const [sources, setSources] = useState<KnowledgeDoc[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const unsubscribe = knowledgeService.subscribeToKnowledge((docs) => {
      setSources(docs);
    });
    return () => unsubscribe();
  }, []);

  const triggerGlobalSync = async () => {
    setIsSyncing(true);
    // Simulate active scan of connected external nodes
    await new Promise(r => setTimeout(r, 2000));
    setIsSyncing(false);
  };

  const handleManualUpload = async () => {
    // In a real app, this would be an input[type=file] change handler
    const mockFile: Omit<KnowledgeDoc, 'docId' | 'createdAt'> = {
      fileName: `Sovereign_Node_${Math.floor(Math.random() * 1000)}.json`,
      source: 'local',
      status: 'indexing',
      size: 1024 * Math.floor(Math.random() * 500)
    };
    await knowledgeService.registerDocument(mockFile);
  };

  return (
    <Card className="border-emerald-500/20 bg-black/40 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
        <div className="flex items-center gap-2">
          <Database className="w-5 h-5 text-emerald-400" />
          <h3 className="font-black text-white uppercase tracking-widest text-sm">Neural Cache Ingestion (TH_12)</h3>
        </div>
        <Badge variant={isSyncing ? 'warning' : 'success'}>
          {isSyncing ? 'TOTALITY_SYNC_ACTIVE' : 'READY_FOR_DATA'}
        </Badge>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Upload Dropzone */}
          <div 
            onClick={handleManualUpload}
            className="border-2 border-dashed border-white/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:border-emerald-500/40 hover:bg-emerald-500/5 transition-all cursor-pointer group"
          >
            <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8 text-slate-500 group-hover:text-emerald-400" />
            </div>
            <p className="text-sm font-black text-white uppercase tracking-widest mb-1">Upload Sovereign Data</p>
            <p className="text-[10px] text-slate-500 font-mono tracking-tighter">PDF, JSON, MD, TXT | ETH-ENCRYPTED</p>
          </div>

          {/* Quick Connectors */}
          <div className="space-y-3">
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                   <Mail className="w-4 h-4 text-blue-400" />
                   <span className="text-[10px] font-black uppercase text-white tracking-widest">Connect Gmail Nodes</span>
                </div>
                <Badge variant="default">OAuth Req</Badge>
             </div>
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                   <HardDrive className="w-4 h-4 text-emerald-400" />
                   <span className="text-[10px] font-black uppercase text-white tracking-widest">Connect G-Drive Mesh</span>
                </div>
                <Badge variant="default">OAuth Req</Badge>
             </div>
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                   <Download className="w-4 h-4 text-cyan-400" />
                   <span className="text-[10px] font-black uppercase text-white tracking-widest">Import Local Downloads</span>
                </div>
                <Badge variant="success">Active</Badge>
             </div>
          </div>
        </div>

        {/* Ingestion Queue */}
        <div className="space-y-2">
           <p className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] mb-3">Syncing Queue</p>
           <div className="max-h-48 overflow-y-auto pr-2 space-y-2 scrollbar-none">
             {sources.map((source) => {
               const Icon = source.source === 'email' ? Mail : source.source === 'drive' ? HardDrive : FileText;
               return (
                 <div key={source.docId} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-white/5 group">
                    <div className="flex items-center gap-3">
                       <Icon className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors" />
                       <div className="flex flex-col">
                         <span className="text-xs text-slate-300 font-mono italic truncate max-w-[200px]">{source.fileName}</span>
                         <span className="text-[8px] text-slate-600 font-bold uppercase tracking-widest">{source.source} • {(source.size || 0) / 1024} KB</span>
                       </div>
                    </div>
                    {source.status === 'cached' ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />
                    )}
                 </div>
               );
             })}
           </div>
        </div>

        <button 
          onClick={triggerGlobalSync}
          disabled={isSyncing}
          className="w-full bg-emerald-500 text-black py-4 rounded-xl font-black uppercase tracking-[0.2em] shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {isSyncing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
          Finalize Ingestion Handshake
        </button>
      </div>
    </Card>
  );
}
