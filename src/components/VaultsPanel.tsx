import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  History,
  CreditCard,
  RefreshCw,
  Search,
  Send,
  X,
  AlertCircle,
  Fingerprint
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Card, Badge } from './ui/core';

import { VaultSnapshot, Transaction } from '../types/frontend';

interface VaultsPanelProps {
  vaults: VaultSnapshot[];
  transactions: Transaction[];
  createVault: () => void;
  syncVaults?: () => void;
  isSyncing?: boolean;
  handleTransfer?: (amount: number, to: string) => Promise<boolean>;
}

export function VaultsPanel({ vaults, transactions, createVault, syncVaults, isSyncing, handleTransfer }: VaultsPanelProps) {
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [transferAmount, setTransferAmount] = useState('');
  const [transferDestination, setTransferDestination] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(tx => {
      const matchesType = filterType === 'all' || tx.type === filterType;
      const matchesStatus = filterStatus === 'all' || tx.status === filterStatus;
      const matchesSearch = tx.to?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          tx.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tx.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesStatus && matchesSearch;
    });
  }, [transactions, filterType, filterStatus, searchQuery]);

  const onTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!handleTransfer || !transferAmount || !transferDestination) return;
    
    setIsTransferring(true);
    const success = await handleTransfer(Number(transferAmount), transferDestination);
    setIsTransferring(false);
    
    if (success) {
      setShowTransferModal(false);
      setTransferAmount('');
      setTransferDestination('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
          <Wallet className="w-6 h-6 text-blue-400" />
          Offshore Vaults
        </h2>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={syncVaults}
            disabled={isSyncing}
            className="bg-transparent border border-blue-500/50 text-blue-400 px-4 py-2 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-blue-500/10 transition-all flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            Sync Manifest
          </button>
          <button
            onClick={() => setShowTransferModal(true)}
            className="bg-white/5 border border-white/10 text-white px-4 py-2 rounded-xl font-black uppercase text-xs tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4 text-emerald-500" />
            Transfer
          </button>
          <button
            onClick={createVault}
            className="bg-blue-500 text-white px-4 py-2 rounded-xl font-black uppercase text-xs tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
          >
            <Plus className="w-4 h-4" />
            Open Vault
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {vaults.map((vault) => (
          <Card key={vault.id} className="relative overflow-hidden group border-blue-500/10">
            {/* Shard overlay... */}
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500/20 group-hover:bg-blue-500 transition-colors" />
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 opacity-5 blur-3xl rounded-full translate-x-16 -translate-y-16" />
            <div className="flex justify-between items-start mb-6 pl-2">
              <div>
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1">Vault ID // SHARD_DELTA</p>
                <p className="text-sm font-mono text-white opacity-60 tracking-tighter">{vault.vaultId}</p>
              </div>
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <CreditCard className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <p className="text-3xl font-black text-white tracking-tighter mb-4 pl-2">
              {vault.balance?.toLocaleString()} <span className="text-blue-400 text-sm">{vault.currency}</span>
            </p>
            <div className="flex flex-wrap gap-2 pl-2">
              <Badge variant="success">Secured</Badge>
              <Badge variant="info">Multi-Sig</Badge>
              <Badge variant="outline" className="text-[8px]">SHARD_TH12</Badge>
            </div>
            
            {/* Shard Health Pulse */}
            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between pl-2">
               <div className="flex items-center gap-1.5">
                  {[1,2,3,4].map(i => (
                    <motion.div 
                      key={i}
                      animate={{ opacity: [0.2, 1, 0.2] }}
                      transition={{ duration: 2, delay: i * 0.5, repeat: Infinity }}
                      className="w-1.5 h-1.5 rounded-full bg-blue-500" 
                    />
                  ))}
                  <span className="text-[8px] font-black text-slate-600 uppercase ml-2 tracking-widest">Consensus Active</span>
               </div>
               <span className="text-[10px] font-mono text-slate-500">2048-bit AES</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h3 className="text-sm font-black text-white uppercase tracking-widest flex items-center gap-2">
            <History className="w-4 h-4 text-slate-500" />
            Dark Pool Settlement History
          </h3>
          <div className="flex flex-wrap gap-2">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input 
                  type="text" 
                  placeholder="SEARCH_ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-1.5 text-[10px] font-mono text-white outline-none focus:border-blue-500/50 transition-all w-40"
                />
             </div>
             <select 
               value={filterType}
               onChange={(e) => setFilterType(e.target.value)}
               className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-mono text-white outline-none focus:border-blue-500/50 transition-all font-black uppercase"
             >
               <option value="all">ALL_TYPES</option>
               <option value="transfer">TRANSFERS</option>
               <option value="deposit">DEPOSITS</option>
               <option value="withdrawal">WITHDRAWALS</option>
             </select>
             <select 
               value={filterStatus}
               onChange={(e) => setFilterStatus(e.target.value)}
               className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-[10px] font-mono text-white outline-none focus:border-blue-500/50 transition-all font-black uppercase"
             >
               <option value="all">ALL_STATUS</option>
               <option value="completed">SUCCESS</option>
               <option value="failed">FAILED</option>
               <option value="pending">PENDING</option>
             </select>
          </div>
        </div>

        <Card className="p-0 overflow-hidden border-white/5 bg-black/40">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="px-6 py-3 text-slate-500 uppercase tracking-widest font-black">Type</th>
                  <th className="px-6 py-3 text-slate-500 uppercase tracking-widest font-black text-center">Status</th>
                  <th className="px-6 py-3 text-slate-500 uppercase tracking-widest font-black">Destination</th>
                  <th className="px-6 py-3 text-slate-500 uppercase tracking-widest font-black">Amount</th>
                  <th className="px-6 py-3 text-slate-500 uppercase tracking-widest font-black">Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4 flex items-center gap-2">
                      {tx.type === 'transfer' ? (
                        <ArrowUpRight className="w-3 h-3 text-rose-500" />
                      ) : tx.type === 'deposit' ? (
                        <ArrowDownLeft className="w-3 h-3 text-green-500" />
                      ) : (
                        <ArrowUpRight className="w-3 h-3 text-amber-500" />
                      )}
                      <span className="uppercase">{tx.type}</span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex justify-center">
                          <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase border tracking-tighter ${
                            tx.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
                            tx.status === 'failed' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                            'bg-slate-800 border-white/10 text-slate-600'
                          }`}>
                            {tx.status}
                          </span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400">{tx.to?.substring(0, 12)}...</td>
                    <td className="px-6 py-4 font-black">
                      {tx.type === 'deposit' ? '+' : '-'}{tx.amount} {tx.currency}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {tx.timestamp ? (new Date(tx.timestamp).toLocaleDateString()) : 'Pending'}
                    </td>
                  </tr>
                ))}
                {filteredTransactions.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-600 italic uppercase tracking-widest text-[10px]">
                      No matching settlements found in this shard...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Transfer Modal */}
      <AnimatePresence>
        {showTransferModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowTransferModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-8 shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-emerald-500 to-blue-500" />
              
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500/20 rounded-2xl">
                    <Send className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white uppercase tracking-tight italic">Initiate <span className="text-emerald-500">Settlement</span></h2>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Global Asset Bridge</p>
                  </div>
                </div>
                <button onClick={() => setShowTransferModal(false)} className="text-slate-500 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={onTransfer} className="space-y-6">
                <div className="space-y-2">
                  <label className="label-micro opacity-40">Destination Shard / Address</label>
                  <div className="relative">
                     <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                     <input 
                       type="text"
                       required
                       value={transferDestination}
                       onChange={(e) => setTransferDestination(e.target.value)}
                       placeholder="0x... or GHOST_NODE_ID"
                       className="w-full bg-black border border-white/10 rounded-2xl p-4 pl-12 text-white font-mono text-sm outline-none focus:border-emerald-500/50 transition-all font-black uppercase tracking-widest"
                     />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="label-micro opacity-40">Settlement Amount (USDC)</label>
                  <div className="relative">
                     <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-mono text-sm">$</span>
                     <input 
                       type="number"
                       required
                       value={transferAmount}
                       onChange={(e) => setTransferAmount(e.target.value)}
                       placeholder="0.00"
                       className="w-full bg-black border border-white/10 rounded-2xl p-4 pl-8 text-white font-mono text-sm outline-none focus:border-emerald-500/50 transition-all font-black uppercase tracking-widest"
                     />
                  </div>
                </div>

                <div className="p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10 flex items-start gap-3">
                  <AlertCircle size={16} className="text-emerald-500 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-400 leading-relaxed uppercase font-bold tracking-tight">
                    Transactions are irreversible once broadcast to the <span className="text-emerald-500">GhostChain Ledger</span>. Ensure destination accuracy.
                  </p>
                </div>

                <button 
                  type="submit"
                  disabled={isTransferring || !transferAmount || !transferDestination}
                  className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-[0_0_30px_rgba(16,185,129,0.2)] active:scale-95"
                >
                  {isTransferring ? 'Broadcasting Shard...' : 'Execute Settlement'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
