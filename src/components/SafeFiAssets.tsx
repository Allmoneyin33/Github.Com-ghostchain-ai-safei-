import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, Bitcoin, Coins, Activity, RefreshCw, Wallet } from 'lucide-react';
import { Card, Badge } from './ui/core';

interface AssetItem {
  id: string;
  symbol: string;
  name: string;
  chain: string;
  balance: string;
  valueUsd: string;
  change24h: string;
  isPositive: boolean;
}

const mockFetchAssets = async (): Promise<AssetItem[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: '1', symbol: 'ETH', name: 'Ethereum', chain: 'Ethereum', balance: '14.241', valueUsd: '$44,195.40', change24h: '+2.4%', isPositive: true },
        { id: '2', symbol: 'USDC', name: 'USD Coin', chain: 'Arbitrum', balance: '24,500.00', valueUsd: '$24,500.00', change24h: '0.0%', isPositive: true },
        { id: '3', symbol: 'ARC', name: 'Arc Token', chain: 'Arc Network', balance: '1,450,000', valueUsd: '$12,325.00', change24h: '+14.5%', isPositive: true },
        { id: '4', symbol: 'SOL', name: 'Solana', chain: 'Solana', balance: '84.5', valueUsd: '$15,860.20', change24h: '-1.2%', isPositive: false },
      ]);
    }, 1200); // Simulated delay
  });
};

interface SafeFiAssetsProps {
  vaults?: any[];
}

export function SafeFiAssets({ vaults }: SafeFiAssetsProps) {
  const [assets, setAssets] = useState<AssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const load = async () => {
        setLoading(true);
        if (vaults && vaults.length > 0) {
          const convertedAssets: AssetItem[] = vaults.map(v => ({
            id: v.id,
            symbol: v.currency,
            name: v.platform === 'blockchain' ? 'On-Chain Liquidity' : `${v.platform.toUpperCase()} Vault`,
            chain: v.platform === 'blockchain' ? 'Mainnet' : 'Offshore Mesh',
            balance: v.balance.toLocaleString(),
            valueUsd: `$${(v.balance * (v.currency === 'ETH' ? 3100 : 1)).toLocaleString()}`,
            change24h: '+0.0%',
            isPositive: true
          }));
          if (isMounted) {
            setAssets(convertedAssets);
            setLoading(false);
          }
        } else {
          try {
            const data = await mockFetchAssets();
            if (isMounted) {
              setAssets(data);
              setLoading(false);
            }
          } catch (e) {
            if (isMounted) setLoading(false);
          }
        }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [refreshKey, vaults]);

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <Card className="flex flex-col border-ghost-accent/20 bg-black/40 overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-ghost-accent/5 pointer-events-none" />
      
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 relative z-10">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5 text-cyan-400" />
          <h3 className="font-black text-white uppercase tracking-widest text-sm">SafeFi Assets</h3>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="info">ERC-8004: VERIFIED</Badge>
          <div className="animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            <Badge variant="success">Multi-Chain Live</Badge>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="text-slate-400 hover:text-cyan-400 transition-colors disabled:opacity-50 flex items-center gap-1"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan-400' : ''}`} />
          </button>
        </div>
      </div>

      <div className="p-6 relative z-10">
        <div className="flex justify-between items-end mb-6">
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 flex items-center gap-1.5">
              <Wallet className="w-3 h-3 text-cyan-400" />
              Total Vault Value
            </p>
            {loading ? (
              <div className="h-8 w-32 bg-white/10 animate-pulse rounded" />
            ) : (
              <p className="text-3xl font-mono font-black text-white">$96,880.60</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">
              Network Status
            </p>
            <p className="text-sm font-black text-green-400">OPTIMAL</p>
          </div>
        </div>

        <div className="space-y-3">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-3"
              >
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse" />
                ))}
              </motion.div>
            ) : (
              <motion.div 
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-3"
              >
                {assets.map(asset => (
                  <div 
                    key={asset.id} 
                    className="bg-black/60 border border-white/10 p-4 rounded-xl flex items-center justify-between hover:border-cyan-500/30 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-cyan-500/50 transition-colors">
                        {asset.symbol === 'ETH' ? (
                          <Activity className="w-5 h-5 text-indigo-400" />
                        ) : asset.symbol === 'USDC' ? (
                          <Coins className="w-5 h-5 text-blue-400" />
                        ) : (
                          <Bitcoin className="w-5 h-5 text-amber-400" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-black text-white flex items-center gap-2">
                          {asset.name}
                          <span className="text-[10px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded-full">{asset.symbol}</span>
                        </h4>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{asset.chain}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-mono text-white text-lg">{asset.balance}</p>
                      <div className="flex items-center justify-end gap-2 mt-0.5">
                        <span className="text-xs text-slate-400 font-mono">{asset.valueUsd}</span>
                        <span className={`text-[10px] font-black uppercase ${asset.isPositive ? 'text-green-400' : 'text-rose-400'}`}>
                          {asset.change24h}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
