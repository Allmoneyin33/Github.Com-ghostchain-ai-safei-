import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rss, AlertTriangle, TrendingUp, Cpu, Activity, Clock } from 'lucide-react';
import { Card, Badge } from './ui/core';

interface NewsItem {
  id: string;
  source: string;
  title: string;
  impact: 'high' | 'medium' | 'low';
  category: 'defi' | 'security' | 'market' | 'on-chain';
  timestamp: Date;
}

const MOCK_TITLES = [
  { text: "Flash Loan Arbitrage Spied on Mainnet (+$4.2M)", impact: "high", category: "on-chain" },
  { text: "Vitalik Proposes New ZK-Rollup Compression Metric", impact: "medium", category: "defi" },
  { text: "Dark Pool Liquidity Surge in WBTC/USDC Pairs", impact: "high", category: "market" },
  { text: "Potential Re-Entrancy Vector Detected in Forked DEX", impact: "high", category: "security" },
  { text: "Kraken API Reports Elevated Latency in Matching Engine", impact: "medium", category: "market" },
  { text: "Large Tether Treasury Minting: $1B USDT Issued", impact: "high", category: "market" },
  { text: "New MEV Bot Extracted 420 ETH From Sandwich Attack", impact: "high", category: "on-chain" },
  { text: "GhostChain Alpha Nodes Report Stable Consensus", impact: "low", category: "security" },
  { text: "Stablecoin Depeg Rumors Trigger Capital Flight to ETH", impact: "high", category: "market" },
  { text: "Protocol Upgrade 127.1 Successfully Bootstrapped", impact: "low", category: "defi" }
];

const SOURCES = ["ETH_MEMPOOL", "X_WHALE_ALERT", "DARK_FOREST", "KRAKEN_WSS", "NEURAL_SENTIMENT"];

const createRandomNewsItem = (offsetMs: number): NewsItem => {
  const template = MOCK_TITLES[Math.floor(Math.random() * MOCK_TITLES.length)];
  return {
    id: Math.random().toString(36).substring(7),
    source: SOURCES[Math.floor(Math.random() * SOURCES.length)],
    title: template.text,
    impact: template.impact as 'high' | 'medium' | 'low',
    category: template.category as any,
    timestamp: new Date(Date.now() - offsetMs)
  };
};

export function AlphaNewsFeed() {
  const [news, setNews] = useState<NewsItem[]>(() => 
    Array.from({ length: 4 }).map((_, i) => createRandomNewsItem(i * 10000))
  );

  useEffect(() => {
    // Live sentiment hook simulator
    const interval = setInterval(() => {
      if (Math.random() > 0.6) {
        setNews(prev => [createRandomNewsItem(0), ...prev].slice(0, 15));
      }
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'low': return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
      default: return 'text-ghost-accent bg-ghost-accent/10 border-ghost-accent/20';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'on-chain': return <Activity className="w-3 h-3" />;
      case 'market': return <TrendingUp className="w-3 h-3" />;
      case 'security': return <AlertTriangle className="w-3 h-3" />;
      case 'defi': return <Cpu className="w-3 h-3" />;
      default: return <Clock className="w-3 h-3" />;
    }
  };

  return (
    <Card className="flex flex-col border-ghost-accent/20 bg-black/40 overflow-hidden relative min-h-[400px]">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-ghost-accent/5 pointer-events-none" />
      
      <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5 relative z-10 lg:sticky lg:top-0">
        <div className="flex items-center gap-2">
          <Rss className="w-4 h-4 text-ghost-accent animate-pulse" />
          <h3 className="font-black text-white uppercase tracking-widest text-sm">Alpha Sentiment Stream</h3>
        </div>
        <div className="flex gap-2">
          <Badge variant="success">Live Link</Badge>
        </div>
      </div>

      <div className="p-0 flex-1 overflow-y-auto custom-scrollbar relative z-10">
        <div className="divide-y divide-white/5">
          <AnimatePresence initial={false}>
            {news.map((item) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0, backgroundColor: 'rgba(34, 197, 94, 0.2)' }}
                animate={{ opacity: 1, height: 'auto', backgroundColor: 'transparent' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.4 }}
                className="p-4 hover:bg-white/5 transition-colors group cursor-pointer"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest border flex items-center gap-1 ${getImpactColor(item.impact)}`}>
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </span>
                    <span className="text-[9px] text-slate-500 font-mono tracking-wider flex items-center gap-1">
                      <Clock className="w-3 h-3 opacity-50" />
                      {item.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <span className="text-[9px] text-indigo-400/70 font-mono uppercase tracking-widest">
                    [{item.source}]
                  </span>
                </div>
                
                <p className="text-white text-xs font-medium tracking-wide group-hover:text-ghost-accent transition-colors leading-relaxed">
                  {item.title}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
