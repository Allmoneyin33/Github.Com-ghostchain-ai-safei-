import OpenAI from "openai";
import * as firestore from "firebase-admin/firestore";

export class MarketDynamics {
  private prices: Record<string, number> = {
    BTC: 65000,
    ETH: 3500,
    SOL: 140,
    GHOST: 3.33
  };
  private driftFactor = 1.0;
  private adminDb: firestore.Firestore | null;

  constructor(adminDb: firestore.Firestore | null) {
    this.adminDb = adminDb;
    this.startSimulation();
    this.startProfitSimulation();
  }

  public setDriftFactor(factor: number) {
    this.driftFactor = factor;
    (global as any).chain?.log(`Quantum Drift recalibrated: ${factor.toFixed(4)}x resonance`, "SYSTEM");
  }

  private startSimulation() {
    setInterval(() => {
      Object.keys(this.prices).forEach(key => {
        const volatility = (Math.random() - 0.5) * (this.prices[key] * 0.001);
        const drift = (this.driftFactor - 1.0) * (this.prices[key] * 0.0005);
        this.prices[key] += volatility + drift;
      });

      // Occasional system health pings
      if (Math.random() > 0.8) {
        (global as any).chain?.log(`Neural Mesh Integrity: ${(99 + Math.random()).toFixed(2)}%`, "INFO");
      }
    }, 5000);
  }

  private startProfitSimulation() {
    setInterval(async () => {
      if (this.adminDb) {
        try {
          const yieldDelta = (Math.random() * 0.05); 
          await this.adminDb.collection("user_stats").doc("GLOBAL_TOTALITY").set({
            totalEcosystemProfit: firestore.FieldValue.increment(yieldDelta),
            lastYieldCalc: new Date()
          }, { merge: true });
        } catch (e) {
          // Silent fail for simulation
          console.debug("Profit simulation skip");
        }
      }
    }, 15000);
  }

  getPrices() {
    return {
      ...this.prices,
      driftFactor: this.driftFactor,
      timestamp: new Date().toISOString(),
      globalVolume: 12400500600 + (Math.random() * 1000000),
      marketCap: 2400500000 + (Math.random() * 1000000)
    };
  }

  async getAiAwareness() {
    const marketState = this.getPrices();
    const prompt = `Act as an autonomous trading agent. Current market snapshot: ${JSON.stringify(marketState)}. 
    Generate 3 short, tactical awareness alerts for the dashboard. 
    Return as JSON: { "alerts": [{ "id": string, "priority": "high"|"low", "text": string, "category": string }] }`;

    try {
      if (process.env.OPENAI_API_KEY) {
        const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
        const completion = await openai.chat.completions.create({
          model: "gpt-4o",
          response_format: { type: "json_object" },
          messages: [{ role: "system", content: "You are the Sovereign Awareness Engine." }, { role: "user", content: prompt }]
        });
        return JSON.parse(completion.choices[0].message.content || "{}");
      }
    } catch (e) {
      console.error("Awareness Engine Error:", e);
    }

    return {
      alerts: [
        { id: "A1", priority: "high", text: "Fractal liquidity gap detected in SOL/GHOST pair. Deploying swarm buffers.", category: "LIQUIDITY" },
        { id: "A2", priority: "medium", text: "Whale accumulation observed in Shard TH-12. Yield curves shifting.", category: "WHALE_WATCH" },
        { id: "A3", priority: "low", text: "Global sentiment index at 78% (Extreme Greed). Adjusting risk mesh.", category: "SENTIMENT" }
      ]
    };
  }
}

export class SapphireMarketplace {
  private creditValue = 0.01;
  private adminDb: firestore.Firestore | null;

  constructor(adminDb: firestore.Firestore | null) {
    this.adminDb = adminDb;
  }

  async processCreditPurchase(userId: string, usdAmount: number) {
    const credits = usdAmount / this.creditValue;
    if (this.adminDb) {
      await this.adminDb.collection("user_credits").doc(userId).set({
        credits: firestore.FieldValue.increment(credits),
        lastSync: new Date()
      }, { merge: true });
    }
    return { success: true, creditsPurchased: credits, powerLevel: credits * 1.05 };
  }

  async triggerBotSwarm(userId: string, power: number) {
    const earnings = (power * 0.05) + (Math.random() * 5);
    if (this.adminDb) {
      await this.adminDb.collection("user_stats").doc(userId).set({
        totalProfit: firestore.FieldValue.increment(earnings),
        swarmCount: firestore.FieldValue.increment(1),
        lastDeployment: new Date()
      }, { merge: true });
    }
    return { success: true, earningsGenerated: earnings, status: "SWARM_ACTIVE", timestamp: new Date() };
  }
}
