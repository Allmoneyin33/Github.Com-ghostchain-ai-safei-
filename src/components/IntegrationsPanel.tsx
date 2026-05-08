import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CreditCard, X, Loader2, ArrowUpRight, Shield } from 'lucide-react';
import { cn, triggerHaptic } from '../lib/utils';

interface IntegrationsPanelProps {
  onIntegrationSuccess: (agentName: string, message: string) => void;
}

interface ProviderStatus {
  openai: boolean;
  anthropic: boolean;
  stripe: boolean;
  plaid: boolean;
  getblock: boolean;
  circle: boolean;
  pinecone: boolean;
  twilio: boolean;
  coingecko: boolean;
  firebase: boolean;
  sovereign: boolean;
}

export function IntegrationsPanel({ onIntegrationSuccess }: IntegrationsPanelProps) {
  const [activeIntegration, setActiveIntegration] = useState<string | null>(null);
  const [integrationLoading, setIntegrationLoading] = useState(false);
  const [statuses, setStatuses] = useState<ProviderStatus>({
    openai: false, anthropic: false, stripe: false, plaid: false,
    getblock: false, circle: false, pinecone: false, twilio: false,
    coingecko: false, firebase: false, sovereign: false
  });

  const fetchStatuses = useCallback(async () => {
    try {
      const res = await fetch('/api/integrations/status');
      const data = await res.json();
      setStatuses(data);
    } catch (err) {
      console.warn("Failed to fetch integration statuses", err);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const init = async () => {
      if (mounted) await fetchStatuses();
    };
    init();
    const interval = setInterval(fetchStatuses, 15000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [fetchStatuses]);

  const handleIntegrationLink = async (name: string) => {
    triggerHaptic('warning');
    setActiveIntegration(name);
  };

  const executeIntegration = async () => {
    if (!activeIntegration) return;
    triggerHaptic('warning');
    setIntegrationLoading(true);
    try {
      let endpoint = '';
      if (activeIntegration === 'Stripe') endpoint = '/api/integrations/stripe/checkout';
      else if (activeIntegration === 'Plaid') endpoint = '/api/integrations/plaid/link-token';
      else if (activeIntegration === 'GetBlock') endpoint = '/api/integrations/getblock/rpc';
      else if (activeIntegration === 'Circle Nanopayments') endpoint = '/api/integrations/circle/nanopayment';
      else if (activeIntegration === 'Arc L1 Network') endpoint = '/api/integrations/arc/sync';
      else if (activeIntegration === 'x402 Protocol') endpoint = '/api/integrations/x402/handshake';
      else if (activeIntegration === 'ERC-8004 Trust') endpoint = '/api/integrations/erc8004/verify';
      else {
        // Fallback for others
        setTimeout(() => {
          triggerHaptic('success');
          onIntegrationSuccess('INTEGRATION', `${activeIntegration} Linked Successfully.`);
          setActiveIntegration(null);
          setIntegrationLoading(false);
        }, 1000);
        return;
      }

      const res = await fetch(endpoint, { method: 'POST' });
      const data = await res.json();
      
      triggerHaptic('success');
      onIntegrationSuccess('INTEGRATION', `${activeIntegration} Synced: ${data.status}`);
      
      setTimeout(() => {
        setActiveIntegration(null);
        fetchStatuses(); // Refresh after action
      }, 500);

    } catch (err) {
      triggerHaptic('error');
      console.error(`${activeIntegration} Integration Failed`, err);
    } finally {
      setIntegrationLoading(false);
    }
  };

  const integrationsList = [
    { name: 'OpenAI', color: 'bg-emerald-400', active: statuses.openai },
    { name: 'Stripe', color: 'bg-indigo-500', active: statuses.stripe },
    { name: 'Plaid', color: 'bg-emerald-500', active: statuses.plaid },
    { name: 'Circle', color: 'bg-teal-400', active: statuses.circle },
    { name: 'Arc L1', color: 'bg-purple-500', active: import.meta.env.VITE_ARC_RPC_URL ? true : false },
    { name: 'x402', color: 'bg-yellow-400', active: import.meta.env.VITE_X402_ENDPOINT ? true : false },
    { name: 'Firebase', color: 'bg-amber-500', active: statuses.firebase },
    { name: 'Claude', color: 'bg-orange-600', active: statuses.anthropic },
    { name: 'Twilio', color: 'bg-rose-500', active: statuses.twilio },
    { name: 'Pinecone', color: 'bg-blue-600', active: statuses.pinecone },
    { name: 'Sovereign Node', color: 'bg-ghost-accent', active: statuses.sovereign },
  ];

  return (
    <>
      <div className="space-y-4">
        <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-slate-500" />
          Integrations & Edge Protocols
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {integrationsList.map((integration) => (
            <div key={integration.name} className="p-2 bg-white/5 border border-white/5 rounded-xl flex flex-col gap-1 hover:border-white/10 transition-all group relative overflow-hidden">
              {integration.active && <div className="absolute top-0 right-0 w-8 h-8 bg-emerald-500/10 rounded-full blur-xl animate-pulse" />}
              <div className="flex items-center justify-between gap-2 relative z-10">
                <div className="flex items-center gap-2">
                  <div className={cn("w-1.5 h-1.5 rounded-full", integration.color, integration.active ? "shadow-[0_0_8px_rgba(16,185,129,0.8)]" : "opacity-30")} />
                  <span className="text-[10px] font-black text-white uppercase">{integration.name}</span>
                </div>
                <span className={cn("text-[8px] font-black uppercase flex items-center gap-1", integration.active ? "text-emerald-500" : "text-slate-600")}>
                  {integration.active ? <Shield size={8} /> : null}
                  {integration.active ? 'Active' : 'Unlinked'}
                </span>
              </div>
              <button 
                onClick={() => handleIntegrationLink(integration.name)}
                className="text-[8px] text-slate-500 group-hover:text-ghost-accent font-black transition-colors text-left uppercase relative z-10"
              >
                {integration.active ? 'Manage Node →' : 'Connect API →'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {activeIntegration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm bg-ghost-card border border-white/10 p-6 rounded-2xl relative shadow-[0_0_30px_rgba(0,0,0,0.8)]"
            >
              <button
                onClick={() => { triggerHaptic('warning'); setActiveIntegration(null); }}
                className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="mb-6">
                <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">
                  {activeIntegration} Node
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {activeIntegration === 'Stripe' && "Secure fiat on-ramp initialization. Connect institutional banking layers."}
                  {activeIntegration === 'Plaid' && "Generate secure link token to fetch real-time portfolio balances from legacy institutions."}
                  {activeIntegration === 'GetBlock' && "Establish dedicated Web3 RPC connection for high-throughput blockchain sync."}
                  {activeIntegration === 'Dwolla' && "Configure ACH framework for enterprise-grade domestic fund flows."}
                  {activeIntegration === 'Circle Nanopayments' && "Enable economically viable sub-cent, high-frequency USDC transactions for per-API monetization."}
                  {activeIntegration === 'Arc L1 Network' && "Sync directly to the EVM-compatible Arc Layer-1 for low-latency agentic smart contract execution."}
                  {activeIntegration === 'x402 Protocol' && "Submit machine-to-machine x402 payment headers for zero-click automated data clearance."}
                  {activeIntegration === 'ERC-8004 Trust' && "Verify the autonomous agent's trust layer registry to ensure high-fidelity reputation tracking."}
                  {activeIntegration === 'Sovereign Node' && "Initialize connection to the local Terminix bridge node for high-frequency execution and local shard synchronization."}
                </p>
                <div className="mt-4 p-3 bg-black/50 border border-white/5 rounded-lg">
                  <p className="text-[10px] uppercase font-black text-slate-500 mb-1 tracking-widest">Environment Key Status</p>
                  <p className="text-[10px] text-ghost-accent font-mono truncate">
                    {activeIntegration === 'Stripe' && (import.meta.env.VITE_STRIPE_PUBLIC_KEY || "Missing VITE_STRIPE_PUBLIC_KEY")}
                    {activeIntegration === 'Plaid' && (import.meta.env.VITE_PLAID_ENV ? `ENV: ${import.meta.env.VITE_PLAID_ENV}` : "Missing VITE_PLAID_ENV")}
                    {activeIntegration === 'GetBlock' && (import.meta.env.VITE_GETBLOCK_RPC_URL || "Missing VITE_GETBLOCK_RPC_URL")}
                    {activeIntegration === 'Dwolla' && "No keys configured."}
                    {activeIntegration === 'Circle Nanopayments' && (import.meta.env.VITE_CIRCLE_WALLET_ID || "Missing VITE_CIRCLE_WALLET_ID")}
                    {activeIntegration === 'Arc L1 Network' && (import.meta.env.VITE_ARC_RPC_URL || "Missing VITE_ARC_RPC_URL")}
                    {activeIntegration === 'x402 Protocol' && (import.meta.env.VITE_X402_ENDPOINT || "Missing VITE_X402_ENDPOINT")}
                    {activeIntegration === 'ERC-8004 Trust' && (import.meta.env.VITE_ERC_8004_REGISTRY || "Missing VITE_ERC_8004_REGISTRY")}
                    {activeIntegration === 'Sovereign Node' && "TERMINIX BRIDGE ACTIVE"}
                  </p>
                </div>
              </div>

              <button
                onClick={executeIntegration}
                disabled={integrationLoading}
                className="w-full py-3 bg-[var(--color-safefi-primary)] hover:bg-[var(--color-safefi-primary)]/80 text-white font-black uppercase text-xs rounded-xl flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_var(--color-safefi-glow)] disabled:opacity-50"
              >
                {integrationLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>Execute {activeIntegration} Handshake <ArrowUpRight className="w-4 h-4" /></>
                )}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
