import React, { useState } from 'react';
import { 
  CreditCard, 
  Zap, 
  Crown, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Diamond
} from 'lucide-react';
import { motion } from 'motion/react';
import { Card, Badge, Button } from './ui/core';
import { sovereignService } from '../services/sovereignService';

interface MarketplaceProps {
  botCredits: number;
  setBotCredits: React.Dispatch<React.SetStateAction<number>>;
}

export function SapphireMarketplace({ botCredits, setBotCredits }: MarketplaceProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const plans = [
    {
      id: 'starter',
      name: 'Agentic Starter',
      price: 10,
      credits: 1000,
      power: '1.0x',
      features: ['Basic Arbitrage', '2 Autonomous Nodes', 'Standard Support'],
      highlight: false
    },
    {
      id: 'pro',
      name: 'Sovereign Pro',
      price: 50,
      credits: 5500,
      power: '1.2x',
      features: ['Flash Loan Access', '10 Autonomous Nodes', 'AMD ROCm Tuning', 'Priority Swarms'],
      highlight: true
    },
    {
      id: 'empire',
      name: 'Empire Totality',
      price: 250,
      credits: 30000,
      power: '1.5x',
      features: ['Global Node Matrix', 'Unbounded Swarms', 'Cross-Chain Finality', '24/7 Agent Oversight'],
      highlight: false
    }
  ];

  const handlePurchase = async (planId: string, amount: number) => {
    setLoading(planId);
    try {
      const result = await sovereignService.purchaseCredits(amount);
      console.log('Purchase Result:', result);
      // Update global balance state
      setBotCredits(prev => prev + result.creditsPurchased);
      // alert(`Success! Purchased ${result.creditsPurchased} bot-credits. Settlement: ${result.settlement.status}`);
    } catch (err) {
      console.error(err);
      alert('Transaction failed. SafeFi override required.');
    } finally {
      setLoading(null);
    }
  };

  const subscriptions = [
    {
      id: 'sub-sentinel',
      name: 'Sentinel Tier',
      price: 29,
      period: 'mo',
      features: ['24/7 Shard Monitoring', 'Priority Revenue Swarms', 'Advanced SafeFi Audits', 'Ghost-20 Native Access'],
      icon: ShieldCheck,
      color: 'text-blue-400'
    },
    {
      id: 'sub-sovereign',
      name: 'Sovereign Tier',
      price: 99,
      period: 'mo',
      features: ['Full GPU Totality (AMD ROCm)', 'Flash-Loan Zero Fees', 'Unlimited Agent Spawning', 'Custom Neural Handshakes'],
      icon: Crown,
      color: 'text-amber-500',
      highlight: true
    }
  ];

  return (
    <div className="space-y-12 py-4">
      {/* Header section... */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto space-y-4">
        <Badge variant="warning" className="bg-amber-500/10 text-amber-500 border-amber-500/20 px-4 py-1 text-[10px] font-black tracking-[0.3em]">
          SAPPHIRE_AUTONOMOUS_MARKETPLACE
        </Badge>
        <h2 className="text-4xl font-black text-white uppercase tracking-tighter italic">
          Fuel Your <span className="text-amber-500 font-sans not-italic">Sovereign Swarm</span>
        </h2>
        <p className="text-slate-400 text-sm font-medium leading-relaxed">
          Acquire high-density bot-credits or establish permanent shard dominance through high-yield subscriptions.
        </p>
      </div>

      {/* Subscription Tier Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {subscriptions.map((sub) => (
          <motion.div
            key={sub.id}
            whileHover={{ scale: 1.02 }}
            className="group"
          >
            <Card className={`relative p-8 h-full flex flex-col border-white/5 bg-black/60 overflow-hidden transition-all duration-500 ${
              sub.highlight ? 'border-amber-500/30 bg-amber-500/[0.02]' : 'hover:border-white/20'
            }`}>
              <div className={`p-4 w-fit rounded-2xl bg-white/5 mb-6 ${sub.color}`}>
                <sub.icon size={28} />
              </div>
              <div className="mb-8">
                <h3 className="text-2xl font-black text-white tracking-tight uppercase italic">{sub.name}</h3>
                <div className="flex items-baseline gap-2 mt-2">
                  <span className="text-4xl font-black text-white">${sub.price}</span>
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">/ {sub.period}</span>
                </div>
              </div>

              <ul className="space-y-4 mb-10 flex-1">
                {sub.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3 text-xs text-slate-400 font-medium leading-relaxed">
                    <CheckCircle2 size={14} className="text-emerald-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[11px] transition-all ${
                sub.highlight 
                  ? 'bg-amber-500 text-black shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:scale-[1.03] active:scale-95' 
                  : 'bg-white/5 text-white hover:bg-white/10'
              }`}>
                Activate Command Tier
              </button>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="relative py-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/5" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-[#020202] px-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.5em]">One-Time Node Credits</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Plans mapping... */}
        {plans.map((plan) => (
          <motion.div
            key={plan.id}
            whileHover={{ y: -10 }}
            className="flex h-full"
          >
            <Card className={`relative flex flex-col w-full overflow-hidden transition-all duration-500 ${
              plan.highlight 
                ? 'border-amber-500/50 bg-amber-500/[0.03] shadow-[0_0_40px_rgba(245,158,11,0.1)]' 
                : 'border-white/5 bg-black/60 hover:border-white/20'
            }`}>
              {plan.highlight && (
                <div className="absolute top-0 right-0">
                  <div className="bg-amber-500 text-black px-4 py-1 text-[9px] font-black uppercase tracking-widest translate-x-8 translate-y-4 rotate-45 shadow-lg">
                    Highest Yield
                  </div>
                </div>
              )}

              <div className="p-8 space-y-6 flex-1">
                <div className="space-y-1">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-white">${plan.price}</span>
                    <span className="text-xs text-slate-500 font-bold uppercase">/ one-time</span>
                  </div>
                </div>

                <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Bot Credits</p>
                    <p className="text-lg font-black text-amber-500">{plan.credits.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Power Multi</p>
                    <p className="text-sm font-black text-white">{plan.power}</p>
                  </div>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                      <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 border-t border-white/5">
                <button
                  onClick={() => handlePurchase(plan.id, plan.price)}
                  disabled={loading !== null}
                  className={`w-full py-4 rounded-xl font-black uppercase tracking-widest text-[10px] transition-all flex items-center justify-center gap-2 ${
                    plan.highlight
                      ? 'bg-amber-500 text-black hover:scale-105 active:scale-95'
                      : 'bg-white/5 text-white hover:bg-white/10'
                  }`}
                >
                  {loading === plan.id ? (
                    <Zap className="animate-spin" size={14} />
                  ) : (
                    <>
                      Acquire Credits
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-emerald-500/5 border border-emerald-500/20 p-8 rounded-3xl space-y-6">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-emerald-500/20 rounded-2xl text-emerald-500">
              <TrendingUp size={24} />
            </div>
            <div>
              <h4 className="text-white font-black uppercase text-sm tracking-tight italic">Viral Revenue Injection</h4>
              <p className="text-[11px] text-slate-500">Earn 15% in Bot credits for every node fueled via your network. Scaling your swarm has never been more efficient.</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-4 bg-black/40 rounded-2xl border border-white/5 group">
            <span className="text-[10px] font-mono text-slate-500 uppercase flex-1">https://sovereign.xyz/ref/GhostOmega_33</span>
            <button className="px-4 py-2 bg-emerald-500 text-black text-[9px] font-black uppercase rounded-lg hover:scale-105 transition-transform active:scale-95">
              Copy Link
            </button>
          </div>
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 px-2 uppercase">
            <span>Network Size: 14 Nodes</span>
            <span>Total Earned: 4,200 Credits</span>
          </div>
        </div>

        <div className="bg-amber-500/5 border border-amber-500/20 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 justify-between self-start">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 rounded-2xl">
              <ShieldCheck className="text-amber-500" size={24} />
            </div>
            <div>
              <h4 className="text-white font-black uppercase text-sm">SafeFi Settlement Protocol</h4>
              <p className="text-[11px] text-slate-500 max-w-sm">All transactions are settled via Wealth-Link v2 protocols with sub-10ms finality and multi-cloud shard redundancy.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Badge variant="outline" className="border-white/10 text-slate-400 font-mono text-[9px] px-3">ERC-8004 COMPLIANT</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}
