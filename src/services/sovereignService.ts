export const sovereignService = {
  async purchaseCredits(amount: number, userId?: string) {
    const response = await fetch('/api/sovereign/purchase-credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, amount })
    });
    return await response.json();
  },

  async deploySwarm(power: number, userId?: string) {
    const response = await fetch('/api/sovereign/deploy-swarm', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, power })
    });
    return await response.json();
  },

  async applyReferral(referralCode: string, userId?: string) {
    const response = await fetch('/api/sovereign/referral', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, referralCode })
    });
    return await response.json();
  },

  async getMarketData() {
    const response = await fetch('/api/sovereign/market-data');
    return await response.json();
  },

  async getAwareness() {
    const response = await fetch('/api/sovereign/awareness');
    return await response.json();
  },
  
  async getStats(userId: string) {
    const response = await fetch(`/api/sovereign/stats/${userId}`);
    return await response.json();
  }
};
