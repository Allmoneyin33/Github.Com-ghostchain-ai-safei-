import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Fingerprint, Cpu, Lock, Loader2 } from 'lucide-react';

interface GhostChainPortalProps {
  onAuthenticated: (identity: string) => void;
}

export default function GhostChainPortal({ onAuthenticated }: GhostChainPortalProps) {
  const [isAuthenticating, setAuth] = useState(false);
  const [identity] = useState('287F-930E');

  const handleSovereignLogin = async () => {
    setAuth(true);
    // Logic to verify Identity against Firestore 'ghostchain-ai-safefi'
    console.log("🔗 Verifying 287F-930E via ERC-8004...");
    
    // Simulate biometric/on-chain sync
    setTimeout(() => {
      onAuthenticated(identity);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 font-mono selection:bg-emerald-500 selection:text-black">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-[#050505] border-2 border-emerald-500/20 rounded-[3rem] p-10 shadow-[0_0_80px_rgba(16,185,129,0.05)] relative overflow-hidden"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[100px] rounded-full" />

        <div className="flex flex-col items-center mb-10 relative z-10">
          <motion.div 
            animate={{ 
              boxShadow: ["0 0 0px rgba(16,185,129,0)", "0 0 20px rgba(16,185,129,0.3)", "0 0 0px rgba(16,185,129,0)"] 
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="p-5 bg-emerald-500/5 rounded-3xl mb-6 border border-emerald-500/20"
          >
            <ShieldCheck className="text-emerald-400 w-12 h-12" />
          </motion.div>
          <h1 className="text-white text-2xl font-black tracking-tighter uppercase">GHOSTCHAIN OMEGA</h1>
          <div className="flex items-center gap-2 mt-2">
            <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping" />
            <p className="text-emerald-500/60 text-[9px] font-black uppercase tracking-[0.3em]">Sovereign Identity Portal</p>
          </div>
        </div>

        <div className="space-y-6 relative z-10">
          <div className="space-y-2">
            <label className="text-[9px] text-slate-600 uppercase font-black tracking-widest ml-1">Personnel ID (ERC-8004)</label>
            <div className="relative group">
               <span className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors">
                 <Fingerprint size={18}/>
               </span>
               <input 
                 readOnly 
                 value={identity}
                 className="w-full bg-black/40 border border-slate-800 group-hover:border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-emerald-400 text-sm transition-all outline-none font-mono"
               />
            </div>
          </div>

          <button 
            onClick={handleSovereignLogin}
            disabled={isAuthenticating}
            className="w-full h-16 bg-emerald-500 hover:bg-emerald-400 text-black font-black rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 shadow-[0_0_30px_rgba(16,185,129,0.2)]"
          >
            {isAuthenticating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span className="tracking-widest text-xs uppercase">SYNCING DNA...</span>
              </>
            ) : (
              <>
                <span className="tracking-widest text-xs uppercase">INITIALIZE TOTALITY</span>
                <Cpu size={18} />
              </>
            )}
          </button>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex justify-between items-center text-[8px] text-slate-600 font-black uppercase tracking-widest relative z-10">
          <div className="flex items-center gap-1.5">
            <Lock size={10} className="text-emerald-500/50" /> 
            U.D.A.W.G. Shield v75
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-emerald-500/20 rounded-full" />
            Stride-Verified
          </div>
        </div>
      </motion.div>
    </div>
  );
}
