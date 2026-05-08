import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { Database, Link, Cpu, Sparkles, CheckCircle2, UploadCloud, FileJson, Archive } from 'lucide-react';
import { Card, Badge } from './ui/core';

export function BuildCombiner() {
  const [isMerging, setIsMerging] = useState(false);
  const [mergeProgress, setMergeProgress] = useState(0);
  const [activeNodes, setActiveNodes] = useState<string[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const projects = [
    { id: 'app1', name: 'Sovereign Nexus (Firebase DB 1)', role: 'Core Identities & Auth', type: 'Primary DB' },
    { id: 'app2', name: 'Arc Treasury (Firebase DB 2)', role: 'Cross-chain Financial Logs', type: 'Ledger' },
    { id: 'app3', name: 'Guardian Vault (Firebase DB 3)', role: 'ZK-Rollup & Audit States', type: 'Security' },
    { id: 'app4', name: 'Neural Pulse (Firebase DB 4)', role: 'Agent Memory & Sentiment', type: 'Analytics' }
  ];

  const handleMerge = () => {
    setIsMerging(true);
    setMergeProgress(0);
    setActiveNodes([]);

    // Execute simulated script rendering
    console.log("⚡³³ ALLMONEYIN33 LLC: GHOSTCHAIN OMEGA - BOOTSTRAP DEPLOYMENT v138.0");
    console.log("🟣 [OMEGA]: Initializing System Totality Directory...");
    console.log("🏛️ [CORE]: Compiling omega_core.js...");
    console.log("🛰️ [BRIDGE]: Compiling toi_bridge.py...");

    const interval = setInterval(() => {
      setMergeProgress(prev => {
        const next = prev + 15;
        if (next >= 100) {
          clearInterval(interval);
          setIsMerging(false);
          setActiveNodes(projects.map(p => p.id));
          return 100;
        }
        
        // Activate nodes sequentially
        if (next > 25 && !activeNodes.includes('app1')) setActiveNodes(curr => [...curr, 'app1']);
        if (next > 50 && !activeNodes.includes('app2')) setActiveNodes(curr => [...curr, 'app2']);
        if (next > 75 && !activeNodes.includes('app3')) setActiveNodes(curr => [...curr, 'app3']);
        
        return next;
      });
    }, 500);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setUploadedFiles(Array.from(e.dataTransfer.files));
      handleMerge();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploadedFiles(Array.from(e.target.files));
      handleMerge();
    }
  };

  return (
    <Card className="flex flex-col border-ghost-accent/20 bg-black/40 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-ghost-accent/5 via-transparent to-indigo-500/5 pointer-events-none" />
      
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <Link className="w-5 h-5 text-ghost-accent" />
          <h3 className="font-black text-white uppercase tracking-widest text-sm">Master Rebuild Engine</h3>
        </div>
        {activeNodes.length === 4 ? (
           <Badge variant="success">Matrix Merged</Badge>
        ) : (
           <Badge variant="warning">Awaiting Master Files</Badge>
        )}
      </div>

      <div className="p-6 relative z-10">
        <p className="text-xs text-slate-400 mb-6 font-mono leading-relaxed">
          Upload your Master Source files (.zip, .json configs) to rebuild the GhostChain Omega infrastructure. This will synchronize all 4 external builds, un-silo database instances, and reboot the Neural Core.
        </p>

        {!isMerging && activeNodes.length < 4 && (
          <div 
            className={`border-2 border-dashed rounded-xl p-8 mb-6 text-center transition-all cursor-pointer ${
              isDragging ? 'border-ghost-accent bg-ghost-accent/10' : 'border-white/20 hover:border-ghost-accent/50 hover:bg-white/5'
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input 
              type="file" 
              multiple 
              accept=".zip,.json,.ts,.js,.md" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
            <motion.div 
              animate={{ y: [0, -5, 0] }} 
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              className="mx-auto w-12 h-12 rounded-full bg-ghost-accent/20 flex items-center justify-center mb-4"
            >
              <UploadCloud className="w-6 h-6 text-ghost-accent" />
            </motion.div>
            <h4 className="font-black text-white tracking-widest uppercase text-sm mb-2">Drop Master Files Here</h4>
            <p className="text-slate-500 text-[10px] font-mono uppercase">click or drag .zip / .json configurations</p>
          </div>
        )}

        {uploadedFiles.length > 0 && activeNodes.length < 4 && (
          <div className="mb-6 space-y-2">
            <h4 className="text-[10px] font-black tracking-widest text-ghost-accent uppercase">Files Loaded for Rebuild:</h4>
            {uploadedFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-slate-300 font-mono bg-black/50 p-2 rounded border border-white/5">
                {f.name.endsWith('.zip') ? <Archive className="w-3 h-3 text-indigo-400" /> : <FileJson className="w-3 h-3 text-amber-400" />}
                {f.name} ({(f.size / 1024).toFixed(1)} KB)
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {projects.map((proj) => {
            const isActive = activeNodes.includes(proj.id) || activeNodes.length === 4;
            return (
              <div 
                key={proj.id} 
                className={`p-4 rounded-lg border transition-all duration-500 flex items-start gap-3 ${
                  isActive ? 'border-ghost-accent/50 bg-ghost-accent/10' : 'border-white/10 bg-white/5'
                }`}
              >
                <Database className={`w-5 h-5 mt-0.5 ${isActive ? 'text-ghost-accent animate-pulse' : 'text-slate-600'}`} />
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-black text-white text-xs uppercase tracking-widest flex items-center gap-2">
                      {proj.name}
                      {isActive && <CheckCircle2 className="w-3 h-3 text-ghost-accent" />}
                    </h4>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">{proj.role}</p>
                  <p className="text-[9px] text-indigo-400 tracking-widest uppercase mt-2">{proj.type}</p>
                </div>
              </div>
            );
          })}
        </div>

        {!isMerging && activeNodes.length < 4 ? (
          <button 
            onClick={handleMerge}
            className="w-full py-3 bg-ghost-accent/20 hover:bg-ghost-accent/30 border border-ghost-accent/50 rounded-lg text-ghost-accent font-black uppercase tracking-widest text-xs transition-colors flex items-center justify-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 group-hover:animate-spin" />
            Force Build Integration
          </button>
        ) : isMerging ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[10px] text-ghost-accent font-mono uppercase tracking-widest">
              <span>Merging Matrix Architecture...</span>
              <span>{Math.floor(mergeProgress)}%</span>
            </div>
            <div className="w-full h-1.5 bg-black rounded-full overflow-hidden border border-white/10">
              <div 
                className="h-full bg-ghost-accent shadow-[0_0_10px_rgba(34,197,94,0.5)] transition-all duration-200"
                style={{ width: `${mergeProgress}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="w-full py-3 bg-indigo-500/10 border border-indigo-500/30 rounded-lg text-indigo-400 font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2">
            <Cpu className="w-4 h-4" />
            All Modules Synchronized & Rebuilt
          </div>
        )}
      </div>
    </Card>
  );
}
