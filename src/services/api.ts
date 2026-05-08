import { checkNeuralDrift } from '../lib/shadowTwin';

export const API_ROUTES = {
  UNIFIED_AI: '/api/ai/unified',
  CONTRACT_AUDIT: '/api/audit/contract',
  INTEGRATIONS: {
    STRIPE: '/api/integrations/stripe/checkout',
    PLAID: '/api/integrations/plaid/link-token',
    GETBLOCK: '/api/integrations/getblock/rpc',
    CIRCLE: '/api/integrations/circle/nanopayment',
    ARC: '/api/integrations/arc/sync',
    X402: '/api/integrations/x402/handshake',
    ERC8004: '/api/integrations/erc8004/verify'
  }
};

export const apiService = {
  async runAudit(contract: string) {
    const res = await fetch(API_ROUTES.CONTRACT_AUDIT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contract })
    });
    if (!res.ok) throw new Error("Failed to audit contract");
    return res.json();
  },

  async runUnifiedAi(prompt: string) {
    const res = await fetch(API_ROUTES.UNIFIED_AI, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error("Failed to execute AI directive");
    return res.json();
  },

  async getMasterStatus() {
    const res = await fetch('/api/master/status');
    return await res.json();
  },

  async syncVaults(userId: string) {
    const res = await fetch('/api/vaults/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId })
    });
    return await res.json();
  },

  async speak(text: string): Promise<Blob> {
    const res = await fetch('/api/ai/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text })
    });
    if (!res.ok) throw new Error("TTS Failure");
    return await res.blob();
  }
};
