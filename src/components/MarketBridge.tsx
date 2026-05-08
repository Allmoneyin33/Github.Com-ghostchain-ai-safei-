import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ArrowDownRight, Globe, Zap, Repeat } from 'lucide-react';

interface Trade {
  id: string;
  price: number;
  amount: number;
  type: 'buy' | 'sell';
  exchange: 'KRAKEN' | 'SURGE';
  timestamp: string;
}

export const MarketBridge: React.FC = () => {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [price, setPrice] = useState(742.10);

  useEffect(() => {
    const interval = setInterval(() => {
      const isBuy = Math.random() > 0.5;
      const amount = Math.random() * 2;
      const delta = (Math.random() - 0.5) * 0.1;
      setPrice(prev => prev + delta);

      const newTrade: Trade = {
        id: Math.random().toString(36).substr(2, 9),
        price: price + delta,
        amount: amount,
        type: isBuy ? 'buy' : 'sell',
        exchange: Math.random() > 0.3 ? 'KRAKEN' : 'SURGE',
        timestamp: new Date().toLocaleTimeString(),
      };

      setTrades(prev => [newTrade, ...prev].slice(0, 8));
    }, 2000);

    return () => clearInterval(interval);
  }, [price]);

  return (
    <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 space-y-6 flex flex-col h-full overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="w-4 h-4 text-red-600" />
          <h3 className="text-xs font-black text-white uppercase tracking-widest">Kraken/Surge Bridge</h3>
        </div>
        <div className="flex items-center gap-2">
           <Zap className="w-3 h-3 text-red-500 animate-pulse" />
           <span className="text-[9px] font-mono text-red-500">Live API Link</span>
        </div>
      </div>

      <div className="flex items-end justify-between border-b border-white/5 pb-4">
        <div>
          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Current Mid-Market</p>
          <p className="text-2xl font-black text-white italic tracking-tighter">${price.toFixed(2)}</p>
        </div>
        <div className="flex items-center gap-1 text-emerald-500 text-[10px] font-bold">
          <ArrowUpRight className="w-3 h-3" />
          <span>+1.42%</span>
        </div>
      </div>

      <div className="flex-1 space-y-2 overflow-hidden">
        <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest px-2">
          <span>Amount</span>
          <span>Price</span>
          <span>Exchange</span>
        </div>
        <div className="space-y-1 overflow-y-auto no-scrollbar">
          <AnimatePresence mode="popLayout">
            {trades.map((trade) => (
              <motion.div
                key={trade.id}
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex justify-between items-center p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
              >
                <div className="flex items-center gap-2">
                  <div className={`p-1 rounded-md ${trade.type === 'buy' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-red-500/20 text-red-500'}`}>
                    {trade.type === 'buy' ? <ArrowUpRight className="w-2.5 h-2.5" /> : <ArrowDownRight className="w-2.5 h-2.5" />}
                  </div>
                  <span className="text-[10px] font-mono text-white/80">{trade.amount.toFixed(4)}</span>
                </div>
                <span className={`text-[10px] font-mono font-bold ${trade.type === 'buy' ? 'text-emerald-400' : 'text-red-400'}`}>
                  ${trade.price.toFixed(2)}
                </span>
                <span className="text-[8px] font-black text-slate-500 group-hover:text-white transition-colors">{trade.exchange}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <div className="pt-4 border-t border-white/5">
        <button className="w-full py-2 bg-red-600/10 hover:bg-red-600/20 border border-red-600/20 rounded-xl flex items-center justify-center gap-2 transition-all">
          <Repeat className="w-3 h-3 text-red-500" />
          <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Resync OMNI Link</span>
        </button>
      </div>
    </div>
  );
};
