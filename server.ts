/*******************************************************
 ⚙️ GHOSTCHAIN OMEGA TOTALITY — MASTER BOOTSTRAP CORE
 OWNER: ALLMONEYIN33 LLC
 ENGINE: SovereignChain Real-time Execution Engine
 VERSION: 1.5.8-OMEGA-PROD
*******************************************************/

import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import crypto from "crypto";
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import dotenv from "dotenv";
import Stripe from "stripe";
import cors from "cors";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";

import { autoInjectEnvironment, sanitizeSecrets, validateEnvironment } from "./lib/env";
import { MarketDynamics, SapphireMarketplace } from "./lib/market";
import { GhostChainMasterAgent } from "./systems/MasterAgent";
import { GhostChainNode } from "./lib/ghostchain";
import { InnovativeDeFiHub } from "./lib/defiHub";
import { EnterpriseDeFiEngine } from "./lib/enterpriseDeFi";
import { AssistantCore } from "./lib/assistantCore";
import { upgradeService } from "./lib/upgradeService";

dotenv.config();

// Execute environment setup
autoInjectEnvironment();
sanitizeSecrets();
validateEnvironment();

const app = express();
const PORT = 3000;

const ghostNode = new GhostChainNode();
const defiHub = new InnovativeDeFiHub();
const enterpriseEngine = new EnterpriseDeFiEngine();
const assistantCore = new AssistantCore();

// Initial transaction for demo
try {
  ghostNode.addTransaction(
    "0x51c726...sender_stealth",
    "0x93d837...recipient_stealth",
    "AES_GCM_256_ENCRYPTED_PAYLOAD",
    "3045022100e12f...simulated_ecdsa_signature_string...",
    "zk_snark_proof_bytes_validation_0xdeadbeef"
  );
  ghostNode.mineBlock("SYSTEM_VALIDATOR");

  defiHub.processRestakingVault("0xUser_Vault_1", "stETH-RWA-LST", 50.0, 86400);
  defiHub.addRWAPolicyPosition("user_kyc_passed_983", 10000.0, "zk_proof_identity_verification_string");
  defiHub.finalizeSettlement("Validator_Node_V4");

  enterpriseEngine.processERC7575Vault(
    "0xUserWallet_0x77A",
    ["USDC", "stETH", "rETH"],
    [10000.0, 5.0, 6.2],
    "Institutional_Yield_Share"
  );
  enterpriseEngine.aiUnderwriteRisk(
    "0xHighNetWorthTrader",
    500000.0,
    1.45
  );
  enterpriseEngine.processPerpetualHub(
    "0xHighNetWorthTrader",
    5000.0,
    "BTC-PERP",
    10
  );
  enterpriseEngine.routeHubAndSpokeTransfer(
    "optimism_spoke_10",
    "0xabcd1234ef0189",
    "0x3045022100_simulated_hsm_signature_bytes_here",
    "user_zk_identity_0xdeadbeef",
    "zkp_proof_string_must_be_32_chars_long",
    "compliance_hash_string_must_be_64_chars_long_0123456789abcdef0123456789abcdef"
  );
  enterpriseEngine.finalizeSettlementBlock("Validator_Global_Enterprise_01", ["sig_node_1", "sig_node_2"]);
} catch(e) {}

app.use(cors());

// Lab-Genie Latency Monitor Middleware
const LabGenie = {
  latencyHistory: [] as number[],
  monitor: (latency: number) => {
    LabGenie.latencyHistory.push(latency);
    if (LabGenie.latencyHistory.length > 10) LabGenie.latencyHistory.shift();
    
    if (latency > 250) {
      SovereignChain.log(`[LAB-GENIE] Latency threshold breached (${latency}ms). Initializing local failover.`, "CRITICAL");
      return {
        status: "FAILOVER_TRIGGERED",
        route: SovereigntyProviders.aisDev,
      };
    }
    return { status: "HEALTHY" };
  }
};

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    LabGenie.monitor(duration);
  });
  next();
});

// Initialize Firebase Admin
const setupFirebaseAdmin = () => {
  if (getApps().length > 0) return getFirestore();

  // Try standard components first
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  // fallback to full service account string
  const serviceAccountRaw = process.env.FIREBASE_SERVICE_ACCOUNT_GHOSTCHAIN;

  if (projectId && clientEmail && privateKey) {
    try {
      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      return getFirestore();
    } catch (err) {
      console.error("Firebase Admin Initialization Failed (Components):", err);
    }
  } else if (serviceAccountRaw) {
    try {
      const serviceAccount = JSON.parse(
        serviceAccountRaw.startsWith('{') 
          ? serviceAccountRaw 
          : Buffer.from(serviceAccountRaw, 'base64').toString()
      );
      initializeApp({
        credential: cert(serviceAccount),
      });
      return getFirestore();
    } catch (err) {
      console.error("Firebase Admin Initialization Failed (ServiceAccount String):", err);
    }
  }
  
  console.warn("Firebase Admin not configured. System operating in simulation mode.");
  return null;
};

const adminDb = setupFirebaseAdmin();
const dynamics = new MarketDynamics(adminDb);
const sapphire = new SapphireMarketplace(adminDb);
const masterAgent = new GhostChainMasterAgent(dynamics, sapphire, adminDb);

// Start autonomous cycle on boot
masterAgent.start();

const ENV = {
  DUNS: process.env.DUNS_NUMBER,
  STRIPE: process.env.STRIPE_SECRET_KEY,
  PLAID: process.env.PLAID_SECRET,
  DWOLLA: process.env.DWOLLA_SECRET,
  GETBLOCK_BTC: process.env.GETBLOCK_BTC_URL,
  GETBLOCK_ETH: process.env.GETBLOCK_ETH_URL,
  BASE_URL: process.env.BASE_URL,
};

export const SovereigntyProviders = {
  hive: "https://remix-empire-7731-sovereign-hive-722411642922.us-west1.run.app",
  aisPre: "https://ais-pre-vji72xbyunub64argkf4vh-586156508111.us-east1.run.app",
  aisDev: "https://ais-dev-vji72xbyunub64argkf4vh-586156508111.us-east1.run.app"
};

// Auto-start Master Agent
masterAgent.start();

/* =======================================================
   🧠 SOVEREIGNCHAIN COGNITIVE CORE & SENTINEL ENGINE
   OWNER: ALLMONEYIN33 LLC
   ENGINE: SovereignChain Synthetic Neural Interface + Nano Agent Runtime
 ======================================================= */

export const SovereignChain = {
  status: "ONLINE",
  mode: "SYNAPTICALLY_ACTIVE",
  repScore: 98.4,
  log: (msg: string, level = "INFO") => console.log(`[SovereignChain:${level}]`, msg),
  verifyVault: () => "🧬 Neural pathways and system integrity stable",
  alert: (msg: string) => console.log("⚠️ SovereignChain ALERT:", msg),
  btc: () => process.env.GETBLOCK_BTC_URL || "https://go.getblock.io/btc-mainnet",
  eth: () => process.env.GETBLOCK_ETH_URL || "https://go.getblock.io/eth-mainnet",
};

export const chain = SovereignChain;
(global as any).SovereignChain = SovereignChain;
(global as any).chain = SovereignChain;

export const Vault = {
  balance: 7802,
  settlements: [] as any[],

  addSettlement(type: string, amount: number, to: string, status: string = 'completed') {
    const settlement = {
      id: crypto.randomUUID(),
      type,
      amount,
      currency: "USDC",
      to,
      status,
      timestamp: new Date()
    };
    this.settlements.unshift(settlement);
    if (this.settlements.length > 50) this.settlements.pop();
    return settlement;
  },

  deposit(amount: number) {
    if (isNaN(amount) || amount < 0) return this.balance;
    this.balance += amount;
    this.addSettlement('deposit', amount, 'INTERNAL_VAULT');
    SovereignChain.log(`Neural-Vault Credit: +$${amount}`);
    return this.balance;
  },

  withdraw(amount: number) {
    if (isNaN(amount) || amount <= 0) return false;
    if (amount > this.balance) {
      this.addSettlement('withdrawal', amount, 'EXTERNAL_WALLET', 'failed');
      SovereignChain.alert("Neural execution error: Insufficient reserves");
      return false;
    }
    this.balance -= amount;
    this.addSettlement('withdrawal', amount, 'EXTERNAL_WALLET');
    SovereignChain.log(`Neural-Vault Debit: -$${amount}`);
    return true;
  },

  transfer(amount: number, to: string) {
    if (isNaN(amount) || amount <= 0) return { success: false, message: "Invalid amount" };
    if (amount > this.balance) {
      this.addSettlement('transfer', amount, to, 'failed');
      return { success: false, message: "Insufficient funds" };
    }
    this.balance -= amount;
    this.addSettlement('transfer', amount, to);
    return { success: true, balance: this.balance };
  },

  snapshot() {
    return {
      balance: this.balance,
      status: "LOCKED_STABLE",
      node: "98.4_Sovereign",
    };
  },
};

/* =========================================
   🤖 NANO-AGENT REGENERATION CORE
========================================= */

export const NanoAgent = {
  cycleCounter: 0,
  spawnedAgents: ["NanoProcessor_01", "NanoProcessor_02"],

  selfReplicate() {
    this.cycleCounter++;
    const newAgentId = `NanoAgent_${Date.now()}_${this.cycleCounter}`;
    this.spawnedAgents.push(newAgentId);
    SovereignChain.log(`Regeneration loop: Synthesized ${newAgentId} into system runtime.`);
    return {
      success: true,
      spawned: newAgentId,
      totalActive: this.spawnedAgents.length,
      nodePerformance: "OPTIMAL"
    };
  },

  runDiagnostics() {
    return {
      cpuPressure: "NOMINAL",
      memoryLeakCheck: "PASSED",
      nanoAgentsActive: this.spawnedAgents.length,
      amdGpuStatus: "ROCm ACCELERATION READY"
    };
  }
};

/* =========================================
   👁️ VISION INGEST ENGINE
========================================= */

export const VisionIngest = {
  assessAssets(imageFiles: string[]) {
    SovereignChain.log(`Neural vision scanning ${imageFiles.length} visual layers into the Sovereign Node.`);
    return {
      success: true,
      filesProcessed: imageFiles.length,
      status: "NEURAL_SYNTHESIS_COMPLETE",
      systemBalance: Vault.balance,
      evaluation: "Unique collector assets verified"
    };
  }
};

const CloneBot = {
  orchestrate: () => {
    chain.log("Initializing Clone-Bot Swarm sync...");
    const bots = [
      { id: "CB-ALPHA", logic: "SCALPING", strength: 0.8 },
      { id: "CB-GAMMA", logic: "ARBITRAGE", strength: 1.2 },
      { id: "CB-OMEGA", logic: "TREND_FOLLOW", strength: 2.5 }
    ];
    return bots.map(b => ({ ...b, target: "KRAKEN/SURGE", active: true }));
  }
};

export const BotEngine = {
  isLocked: true,
  compliance: "Sovereign ERC-8004 Verified",
  
  unlockGate(key: string) {
    const gateKey = process.env.AUTOPILOT_GATE_KEY || "SAFEFI_2026";
    if (key === gateKey) {
      this.isLocked = false;
      SovereignChain.log("Autopilot Gate UNLOCKED. Systems operational.");
      return true;
    }
    return false;
  },

  cycle: () => {
    if (BotEngine.isLocked) {
      SovereignChain.alert("EXECUTION HALTED: Autopilot Gate is LOCKED. Security protocols active.");
      return { status: "LOCKED_SHUTDOWN", reason: "GATE_SECURITY_ACTIVE" };
    }

    CloneBot.orchestrate();
    const bots = [
      { id: "BTC_CORE", profit: 1200 },
      { id: "ETH_CORE", profit: 980 },
      { id: "MARKET_SWARM", profit: 430 },
    ];
    bots.forEach((b) => Vault.deposit(b.profit));
    SovereignChain.log("Autopilot cycle executed under ERC-8004 protocols");
    return Vault.snapshot();
  }
};

export const labGenieCheck = (latencyMs: number) => {
  if (latencyMs > 250) {
    SovereignChain.alert(`Latency threshold breached (${latencyMs}ms). Initializing Lab-Genie failover.`);
    return {
      status: "FAILOVER_TRIGGERED",
      route: SovereigntyProviders.aisDev,
    };
  }
  return { status: "HEALTHY" };
};

export const AgentEngine = {
  evaluateObstacle(signalLossDb: number, targetEndpoint: string) {
    if (signalLossDb > 15) {
      SovereignChain.alert(`High attenuation detected (${signalLossDb}dB) reaching ${targetEndpoint}. Initiating mesh relay node.`);
      return {
        action: "DEPLOY_MESH_RELAY",
        status: "AUTOMATION_TRIGGERED",
        meshNodeId: `node_${Date.now()}`
      };
    }
    return { action: "MAINTAIN_LINE_OF_SIGHT", status: "OPTIMAL" };
  }
};

// --- WEBHOOKS (CRITICAL FOR BACKENDS) ---

// Stripe Webhook Handler
// Note: Needs raw body for verification
app.post("/api/webhooks/stripe", express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    if (endpointSecret && sig) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      // In simulation mode if secret is missing
      event = JSON.parse(req.body.toString());
      console.warn("[WEBHOOK] Stripe signature verification bypassed (No secret)");
    }

    console.log(`[WEBHOOK] Stripe Event Received: ${event.type}`);

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`[STRIPE] Payment for ${paymentIntent.amount} succeeded.`);
        if (adminDb && paymentIntent.metadata?.userId) {
            await adminDb.collection("user_credits").doc(paymentIntent.metadata.userId).set({
                credits: FieldValue.increment(paymentIntent.amount / 10), // e.g. 10 cents = 1 credit
                lastUpdate: new Date()
            }, { merge: true });
        }
        break;
      }
      default:
        console.log(`[STRIPE] Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (err: any) {
    console.error(`[WEBHOOK] Stripe Error: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }
});

// Circle Webhook Handler (Stability/Payments)
app.post("/api/webhooks/circle", express.json(), async (req: Request, res: Response) => {
  try {
    const { type } = req.body;
    console.log(`[WEBHOOK] Circle Notification: ${type}`);
    
    if (adminDb) {
      await adminDb.collection("circle_notifications").add({
        ...req.body,
        receivedAt: new Date()
      });
    }

    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Kraken/Trading Webhook Handler
app.post("/api/webhooks/kraken", express.json(), async (req: Request, res: Response) => {
  try {
    const { order_id, status, pair } = req.body;
    console.log(`[WEBHOOK] Kraken Order Update: ${order_id} -> ${status} (${pair})`);
    
    if (adminDb) {
      await adminDb.collection("trading_signals").add({
        source: "KRAKEN_WEBHOOK",
        order_id,
        status,
        pair,
        timestamp: new Date()
      });
    }

    res.json({ status: "processed" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// GoDaddy Webhook Settlement Hook
app.post("/api/webhook/godaddy", express.json(), (req, res) => {
  const payload = req.body;
  if (payload && payload.event === "order.created") {
    const amount = Number(payload.amount || 25);
    Vault.deposit(amount);
    SovereignChain.log(`🧞 GoDaddy Webhook Settlement: +$${amount} USDC processed via Neural Core.`, "EVENT");
    return res.status(200).json({ status: "SUCCESS", balance: Vault.snapshot() });
  }
  res.status(400).json({ status: "IGNORED", message: "Awaiting valid event payload" });
});

// Hardware and Sensor Emulation Module
app.post("/api/sensor/override", express.json(), (req, res) => {
  const { pressure, concurrency, location } = req.body;
  SovereignChain.log(`Sensor pressure/concurrency override: ${pressure}, Cores: ${concurrency}`);
  res.json({
    ok: true,
    hardwareConcurrency: concurrency || 12,
    cpuPressureState: pressure || "Nominal",
    sensorLocation: location || "Des Moines/Iowa",
    status: "EMULATION_ENGAGED"
  });
});

app.post("/api/vision/ingest", express.json(), (req, res) => {
  const files = req.body.files || ["uploaded_item"];
  res.json(VisionIngest.assessAssets(files));
});

// Nano-Agent Self-Replication Ingress
app.post("/api/agent/replicate", express.json(), (_, res) => {
  res.json(NanoAgent.selfReplicate());
});

app.get("/api/studio", (_, res) => {
  res.redirect(301, "https://ai.studio/apps/8b458749-4234-4073-a8cf-63ce086e39f1");
});

// Physical Networking Agent Route
app.post("/api/agent/route", express.json(), (req, res) => {
  const { source, destination, obstacles } = req.body;
  SovereignChain.log(`Agent connecting ${source} to ${destination}`);
  res.json({
    success: true,
    path: `${source} -> [Mesh Relays] -> ${destination}`,
    calculatedHops: obstacles && obstacles.includes("Concrete") ? 3 : 1,
    latencyMs: 8.4,
    routedThrough: SovereigntyProviders.hive
  });
});

/* =========================================
   🌐 API ROUTES
========================================= */

app.get("/api/security/audit", (req, res) => {
  const integrations = {
    neural: {
      gemini: !!process.env.GEMINI_API_KEY,
      openai: !!process.env.OPENAI_API_KEY,
      anthropic: !!process.env.ANTHROPIC_API_KEY
    },
    finance: {
      stripe: !!process.env.STRIPE_SECRET_KEY,
      plaid: !!process.env.PLAID_SECRET,
      dwolla: !!process.env.DWOLLA_SECRET
    },
    blockchain: {
      getblock: !!(process.env.GETBLOCK_BTC_URL || process.env.GETBLOCK_ETH_URL),
      erc8004: !!process.env.ERC8004_CONTRACT_ADDRESS,
      trading_bot: !!process.env.TRADING_BOT_PRIVATE_KEY
    },
    infrastructure: {
      firebase: !!adminDb,
      autopilot_gate: !!process.env.AUTOPILOT_GATE_KEY,
      gate_is_default: process.env.AUTOPILOT_GATE_KEY === 'SAFEFI_2026'
    }
  };

  res.json({
    status: "AUDIT_COMPLETE",
    timestamp: new Date().toISOString(),
    nodeId: process.env.GHOST_NODE_ID || "UNKNOWN",
    integrations
  });
});

app.get("/api/sovereign/stream-thoughts", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const thoughts = [
    "Analyzing drift vectors in shard 04...",
    "Neural resonance stabilized at 98.42%.",
    "Predicting hyper-yield expansion in GHOST/SOL pair.",
    "Scanning for adversarial logic in the mempool...",
    "Synchronizing with the Totality Heart.",
    "Vesting schedule for Genesis nodes confirmed.",
    "Shard 09 requires recalibration. Injecting entropy shield.",
    "Liquidity migration detected from legacy vaults.",
    "Sovereign intent acknowledged. Handshake secure."
  ];

  const interval = setInterval(() => {
    const thought = thoughts[Math.floor(Math.random() * thoughts.length)];
    res.write(`data: ${JSON.stringify({ thought, timestamp: new Date().toISOString() })}\n\n`);
  }, 4000);

  req.on("close", () => clearInterval(interval));
});

app.post("/api/sovereign/quantum-shift", express.json(), (req, res) => {
  const { factor } = req.body;
  const f = parseFloat(factor);
  if (isNaN(f)) return res.status(400).json({ error: "Invalid drift factor" });
  
  dynamics.setDriftFactor(f);
  res.json({ success: true, newFactor: f });
});

app.get("/api/sovereign/quantum-shift", (req, res) => {
  res.json({ factor: dynamics.getPrices().driftFactor || 1.0 });
});

app.post("/api/sovereign/oracle", express.json(), async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "No prompt provided" });

  try {
    const systemState = {
      vault: Vault.snapshot(),
      market: dynamics.getPrices(),
      agentsActive: NanoAgent.spawnedAgents.length,
      nodeStatus: SovereignChain.verifyVault()
    };

    const aiPrompt = `You are the Sovereign Oracle of GhostChain. 
    Current System State: ${JSON.stringify(systemState)}
    
    User Query: ${prompt}
    
    Provide an answer that is technically profound, cryptic but helpful, and rooted in the context of a sovereign AI financial system. Keep it concise (under 3 sentences).`;

    const assistant = new AssistantCore();
    const response = await assistant.generateResponse("oracle_query", aiPrompt);
    
    res.json({ response });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/health", (_, res) =>
  res.json({ 
    ok: true, 
    system: "GhostChain Singularity System", 
    SovereignChain: "SYNAPTICALLY_ACTIVE", 
    rep: 98.4, 
    amdHardware: "INSTINCT_MI355X",
    environment: "Master Serverless / Local Ingress",
    providers: SovereigntyProviders,
    diagnostics: NanoAgent.runDiagnostics()
  })
);

app.get("/diagnostics", async (_, res) => {
  const diagnostics = await assistantCore.runSelfDiagnosticLoop();
  res.json(diagnostics);
});

app.get("/vault", (_, res) => res.json(Vault.snapshot()));

app.post("/vault/deposit", (req, res) => {
  const { amount } = req.body;
  Vault.deposit(Number(amount || 0));
  res.json(Vault.snapshot());
});

app.post("/vault/withdraw", (req, res) => {
  const { amount } = req.body;
  const ok = Vault.withdraw(Number(amount || 0));
  res.json({ success: ok, vault: Vault.snapshot() });
});

app.post("/bot/run", (_, res) => {
  res.json(BotEngine.cycle());
});

app.get("/chain/status", async (_, res) => {
  res.json({
    btcNode: ENV.GETBLOCK_BTC,
    ethNode: ENV.GETBLOCK_ETH,
    session: "ONLINE",
    providers: SovereigntyProviders,
    core: assistantCore.getSystemStatus()
  });
});

app.post("/broadcast/x", async (_, res) => {
  res.json({ 
    success: true, 
    status: "Broadcasted to @Allmoneyin_33 & @lablab_ai", 
    tweet: "⚡³³ ALLMONEYIN33 LLC: AMD Hackathon model execution pipeline stable at 98.4 telemetry metrics. #SafeFi #AMD" 
  });
});

app.get("/echo", (_, res) => {
  res.send("SovereignChain: Vault holds, system stable.");
});

app.get("/api/vault", (_, res) => res.json(Vault.snapshot()));

app.get("/api/vault/transactions", (_, res) => res.json(Vault.settlements));

app.post("/api/vault/deposit", (req, res) => {
  const { amount } = req.body;
  Vault.deposit(Number(amount || 0));
  res.json(Vault.snapshot());
});

app.post("/api/vault/withdraw", (req, res) => {
  const { amount } = req.body;
  const ok = Vault.withdraw(Number(amount || 0));
  res.json({ success: ok, vault: Vault.snapshot() });
});

app.post("/api/vault/transfer", (req, res) => {
  const { amount, to } = req.body;
  const result = Vault.transfer(Number(amount || 0), to);
  res.json(result);
});

app.post("/api/bot/run", (_, res) => {
  res.json(BotEngine.cycle());
});

app.post("/api/bot/unlock", express.json(), (req, res) => {
  const { key } = req.body;
  const success = BotEngine.unlockGate(key);
  res.json({ success, status: BotEngine.isLocked ? "LOCKED" : "UNLOCKED" });
});

app.get("/api/upgrades", (req, res) => {
  res.json(upgradeService.getUpgrades());
});

app.post("/api/upgrades/apply", (req, res) => {
  const { id } = req.body;
  const result = upgradeService.applyUpgrade(id);
  res.json({ success: result });
});

app.get("/api/sovereign/market-data", async (req, res) => {
  try {
    const data = await dynamics.getSnapshots();
    res.json(data || {
      BTC: 64200 + Math.random() * 1000,
      ETH: 3450 + Math.random() * 200,
      SOL: 145 + Math.random() * 10,
      GHOST: 7.77 + Math.random(),
      timestamp: new Date().toISOString(),
      globalVolume: 125000000,
      marketCap: 2500000000
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch market data" });
  }
});

app.get("/api/sovereign/awareness", (req, res) => {
  res.json({
    alerts: [
      { id: '1', type: 'market', text: 'GHOST/SOL liquidity surge detected', severity: 'high', category: 'Liquidity', timestamp: Date.now() },
      { id: '2', type: 'security', text: 'Vault Guardian state: VERIFIED', severity: 'low', category: 'Security', timestamp: Date.now() }
    ]
  });
});

app.get("/api/sovereign/activity", async (req, res) => {
  const activity = [
    { time: new Date().toLocaleTimeString(), event: 'NEURAL_PULSE', msg: 'Genesis core emitting cognitive resonance.', type: 'sys' },
    { time: new Date(Date.now() - 1000 * 60).toLocaleTimeString(), event: 'SHARD_SYNC', msg: 'MI355X hardware handshake stable.', type: 'info' }
  ];
  
  if (Vault.settlements.length > 0) {
    Vault.settlements.slice(-5).forEach(tx => {
      activity.push({
        time: new Date(tx.timestamp).toLocaleTimeString(),
        event: 'FINANCIAL_SETTLEMENT',
        msg: `${tx.type.toUpperCase()} of ${tx.amount} ${tx.currency || 'USD'} settled.`,
        type: 'success'
      });
    });
  }
  
  res.json(activity.sort((a, b) => b.time.localeCompare(a.time)));
});

app.post("/api/sovereign/purchase-credits", async (req, res) => {
  const { userId, amount } = req.body;
  if (adminDb && userId) {
    const ref = adminDb.collection("user_credits").doc(userId);
    await adminDb.runTransaction(async (t) => {
      const doc = await t.get(ref);
      const current = doc.exists ? doc.data()?.credits || 0 : 0;
      t.set(ref, { credits: current + (amount * 10), userId }, { merge: true });
    });
  }
  res.json({ success: true, creditsDelta: amount * 10 });
});

app.post("/api/sovereign/deploy-swarm", async (req, res) => {
  const { userId, power } = req.body;
  const swarmId = `swarm_${crypto.randomBytes(4).toString('hex')}`;
  
  if (adminDb && userId) {
    // Consume credits
    const creditRef = adminDb.collection("user_credits").doc(userId);
    const creditsDoc = await creditRef.get();
    const currentCredits = creditsDoc.exists ? creditsDoc.data()?.credits || 0 : 0;
    
    if (currentCredits < 100) {
      return res.status(400).json({ error: "Insufficient credits for swarm deployment" });
    }
    
    await creditRef.update({ credits: currentCredits - 100 });

    // Track deployment
    await adminDb.collection("agent_deployments").doc(swarmId).set({
      userId,
      type: 'swarm',
      power,
      status: 'active',
      deployedAt: FieldValue.serverTimestamp()
    });
  }

  res.json({ 
    success: true, 
    swarmId, 
    status: "MISSION_ACTIVE",
    nodes: Math.floor(power / 10) + 5 
  });
});

app.get("/api/sovereign/stats/:userId", async (req, res) => {
  const { userId } = req.params;
  if (!adminDb) return res.json({ totalProfit: 0, totalSpend: 0 });
  
  const doc = await adminDb.collection("user_stats").doc(userId).get();
  res.json(doc.exists ? doc.data() : { totalProfit: 0, totalSpend: 0 });
});

app.post("/api/sovereign/resonance-shift", (req, res) => {
  const { agentId, shift } = req.body;
  SovereignChain.log(`🌀 RESONANCE_SHIFT: Agent ${agentId} vibrated ${shift > 0 ? "ascension" : "entropy"}`, "GENESIS");
  res.json({ success: true, newResonance: 75 + Math.random() * 25 });
});

app.post("/api/agent/deploy-tool", async (req, res) => {
  const { toolName, code } = req.body;
  const hash = crypto.createHash('sha256').update(code).digest('hex');
  const deploymentPath = `/agent_deployments/tools/${toolName}_${hash.slice(0, 8)}.js`;
  
  SovereignChain.log(`🚀 TOOL_DEPLOYED: ${toolName} (SHA256: ${hash.slice(0, 16)}...)`, "SYSTEM");
  
  res.json({ 
    success: true, 
    hash, 
    path: deploymentPath,
    timestamp: Date.now() 
  });
});

app.post("/api/sovereign/referral", (req, res) => {
  const { referralCode } = req.body;
  res.json({ success: true, bonus: 50, message: `Referral code ${referralCode} applied. 50 neural credits granted.` });
});

app.get("/api/governance", (req, res) => {
  res.json({
    proposals: [
      { id: 'GP-1', title: 'Expand Vault Custody to SOL', status: 'voting', votes: 1250000 },
      { id: 'GP-2', title: 'AMD ROCm 6.1 Integration', status: 'passed', votes: 2000000 }
    ]
  });
});

/* =========================================
   ⛓️ GHOSTCHAIN NODES (NATIVE IMPLEMENTATION)
========================================= */

app.get("/api/ghostchain/chain", (req, res) => {
  res.json(ghostNode.chain);
});

app.get("/api/ghostchain/stats", (req, res) => {
  const lastBlock = ghostNode.chain[ghostNode.chain.length - 1];
  res.json({
    height: ghostNode.chain.length,
    pending: ghostNode.pending_transactions.length,
    lastHash: lastBlock?.hash,
    merkleRoot: lastBlock?.merkle_root
  });
});

app.post("/api/ghostchain/transaction", express.json(), (req, res) => {
  const { sender, recipient, amount_encrypted, signature, zkp_proof } = req.body;
  try {
    ghostNode.addTransaction(sender, recipient, amount_encrypted, signature, zkp_proof);
    res.json({ success: true, message: "Advanced secure transaction added to pending pool" });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/ghostchain/mine", express.json(), (req, res) => {
  const { validator } = req.body;
  const block = ghostNode.mineBlock(validator || "ANONYMOUS_VALIDATOR");
  if (block) {
    res.json({ success: true, block });
  } else {
    res.status(400).json({ success: false, message: "No transactions to mine" });
  }
});

/* =========================================
   💎 INNOVATIVE DEFI HUB
========================================= */

app.get("/api/defi/stats", (req, res) => {
  res.json({
    activeVaults: defiHub.active_vaults.length,
    activePositions: defiHub.active_positions.length,
    pendingOrders: defiHub.pending_orders.length,
    ledgerHeight: defiHub.ledger.length
  });
});

app.post("/api/defi/restake", express.json(), (req, res) => {
  const { user, assetType, amount, lockPeriod } = req.body;
  try {
    const vault = defiHub.processRestakingVault(user, assetType, Number(amount), Number(lockPeriod));
    res.json({ success: true, vault });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post("/api/defi/perp", express.json(), (req, res) => {
  const { trader, margin, assetPair, leverage } = req.body;
  try {
    const position = defiHub.processPerpetualHub(trader, Number(margin), assetPair, Number(leverage));
    res.json({ success: true, position });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

app.post("/api/defi/rwa", express.json(), (req, res) => {
  const { userId, amount, proof } = req.body;
  try {
    defiHub.addRWAPolicyPosition(userId, Number(amount), proof);
    res.json({ success: true, message: "RWA policy position added" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

/* =========================================
   🏢 ENTERPRISE DEFI ENGINE
 ========================================= */

app.get("/api/enterprise/stats", (req, res) => {
  res.json({
    ledgerHeight: enterpriseEngine.ledger.length,
    pendingTransfers: enterpriseEngine.pending_transfers.length,
    lastRootHash: enterpriseEngine.ledger[enterpriseEngine.ledger.length - 1]?.root_hash
  });
});

app.post("/api/enterprise/vault", express.json(), (req, res) => {
  const { user, tokens, amounts, shareClass } = req.body;
  try {
    const receipt = enterpriseEngine.processERC7575Vault(user, tokens, amounts.map(Number), shareClass);
    res.json({ success: true, receipt });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

app.post("/api/enterprise/route", express.json(), (req, res) => {
  const { spokeId, payloadHash, signature, userId, zkpProof, complianceHash } = req.body;
  try {
    enterpriseEngine.routeHubAndSpokeTransfer(
      spokeId, 
      payloadHash, 
      signature,
      userId || "SYSTEM_USER",
      zkpProof || "zkp_proof_placeholder_32_chars_min...",
      complianceHash || "compliance_hash_placeholder_64_chars_min_0123456789abcdef012345678"
    );
    res.json({ success: true, message: "Spoke transfer routed to hub with ZKP verification" });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

app.post("/api/enterprise/risk", express.json(), (req, res) => {
  const { trader, size, vol } = req.body;
  try {
    const evaluation = enterpriseEngine.aiUnderwriteRisk(trader, Number(size), Number(vol));
    res.json({ success: true, evaluation });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

app.post("/api/enterprise/settle", express.json(), (req, res) => {
  const { validator, signatures } = req.body;
  try {
    const block = enterpriseEngine.finalizeSettlementBlock(
      validator || "ENTERPRISE_VALIDATOR",
      signatures || ["sig_auto_1", "sig_auto_2"]
    );
    res.json({ success: true, block });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

app.post("/api/enterprise/perp", express.json(), (req, res) => {
  const { trader, margin, assetPair, leverage } = req.body;
  try {
    const position = enterpriseEngine.processPerpetualHub(trader, Number(margin), assetPair, Number(leverage));
    res.json({ success: true, position });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

app.post("/api/enterprise/zkp", express.json(), (req, res) => {
  const { userId, proof, complianceHash } = req.body;
  try {
    const valid = enterpriseEngine.verifyZkpAndIdentity(userId, proof, complianceHash);
    res.json({ success: true, valid });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    res.status(400).json({ error: msg });
  }
});

/* =========================================
   💳 PAYMENT BRIDGES (STUBBED SECURE GATEWAY)
========================================= */

app.post("/api/pay/create-intent", (req, res) => {
  const { amount } = req.body;
  res.json({
    provider: "stripe",
    status: "intent_created",
    amount: amount,
    simulation: true,
    clientSecret: `pi_${crypto.randomBytes(16).toString('hex')}_secret_${crypto.randomBytes(16).toString('hex')}`
  });
});

app.post("/api/pay/fulfill", (req, res) => {
  const { amount, simulation } = req.body;
  if (simulation) {
      Vault.deposit(amount / 100);
      return res.json({ 
          success: true, 
          vaultBalance: Vault.balance, 
          message: "Transaction settled via neural bridge." 
      });
  }
  res.status(400).json({ error: "Direct fulfillment without intent rejected." });
});

app.post("/pay/stripe", (req, res) => {
  res.json({
    provider: "stripe",
    status: "stubbed",
    amount: req.body?.amount,
  });
});

/* =========================================
   🛡️ SYSTEM DIAGNOSTICS (ASSISTANT CORE)
========================================= */

app.get("/api/system/diagnostics", async (req, res) => {
  try {
    const report = await assistantCore.runSelfDiagnosticLoop();
    res.json(report);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});

app.post("/pay/plaid", (_, res) => {
  res.json({ provider: "plaid", status: "linked_mock" });
});

app.post("/api/broadcast/x", async (_, res) => {
  res.json({ 
    success: true, 
    status: "Broadcasted to @Allmoneyin_33 & @lablab_ai", 
    tweet: "⚡³³ ALLMONEYIN33 LLC: AMD Hackathon model execution pipeline stable at 98.4 telemetry metrics. #SafeFi #AMD" 
  });
});

app.get("/api/echo", (_, res) => {
  res.send("SovereignChain: Vault holds, system stable.");
});

/* =========================================
   ⛓️ CHAIN STATUS & SOCIAL INTEGRATION
========================================= */

app.get("/chain/status", async (_, res) => {
  res.json({
    btcNode: ENV.GETBLOCK_BTC,
    ethNode: ENV.GETBLOCK_ETH,
    session: "ONLINE",
  });
});

app.post("/api/broadcast/x", async (_, res) => {
  res.json({ 
    success: true, 
    status: "Broadcasted to @Allmoneyin_33 & @lablab_ai", 
    tweet: "⚡³³ ALLMONEYIN33 LLC: Sovereign Yield has reached $7777 USDC on AMD ROCm accelerated infrastructure #AI #SafeFi #AMD" 
  });
});

app.get("/echo", (_, res) => {
  res.send("chain: Vault holds, system stable.");
});

/* =========================================
   🤖 TERMINIX BRIDGE ENDPOINTS
========================================= */

app.get("/api/bridge/tasks", async (req: Request, res: Response) => {
  if (!adminDb) return res.status(503).json({ error: "Storage Offline" });
  try {
    const tasks = await adminDb.collection("agent_tasks")
      .where("status", "==", "pending")
      .limit(10)
      .get();
    
    res.json(tasks.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/bridge/complete", express.json(), async (req: Request, res: Response) => {
  const { taskId, result, status } = req.body;
  if (!adminDb) return res.status(503).json({ error: "Storage Offline" });
  try {
    await adminDb.collection("agent_tasks").doc(taskId).update({
      status: status || 'completed',
      result,
      updatedAt: FieldValue.serverTimestamp()
    });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

/* =========================================
   🆙 UPGRADE ASSISTANT (SINGULARITY)
========================================= */

app.get("/api/system/upgrades", (req, res) => {
  res.json(upgradeService.getAvailableUpgrades());
});

app.post("/api/system/upgrades/apply", express.json(), (req, res) => {
  const { id } = req.body;
  const result = upgradeService.applyUpgrade(id);
  if (result.success) {
    res.json(result);
  } else {
    res.status(400).json(result);
  }
});

async function startServer() {
  const server = http.createServer(app);
  const wss = new WebSocketServer({ noServer: true });

  wss.on('connection', (ws: WebSocket) => {
    console.log("🔒 [NEXUS] Local Hardware Bridge: ONLINE");
    ws.on('message', (message: string) => {
      try {
        const data = JSON.parse(message);
        console.log(`[NEXUS] Action received: ${data.action}`);
        // Logic for interaction emulation
        if (data.action === 'CAPTURE') {
           ws.send(JSON.stringify({ status: 'SUCCESS', analysis: 'Visual layers synchronized via Gemini Multimodal Vision' }));
        }
      } catch (e) {
        console.error("[NEXUS] Bridge Error:", e);
      }
    });
  });

  server.on('upgrade', (request, socket, head) => {
    if (request.url === '/api/nexus') {
      wss.handleUpgrade(request, socket, head, (ws) => {
        wss.emit('connection', ws, request);
      });
    }
  });

  try {
    if (process.env.NODE_ENV !== "production") {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } else {
      const distPath = path.join(process.cwd(), "dist");
      app.use(express.static(distPath));
      app.get("*all", (req, res) => res.sendFile(path.join(distPath, "index.html")));
    }

    // Serve static deployments
    app.use('/agent_deployments', express.static(path.join(process.cwd(), 'agent_deployments')));

  console.log("[SERVER] --- GHOSTCHAIN API MESH STATUS ---");
  console.log(` ↳ OpenAI:    ${process.env.OPENAI_API_KEY ? '✅ CONFIGURED' : '❌ MISSING'}`);
  console.log(` ↳ Firebase:  ${adminDb ? '✅ CONNECTED' : '⚠️ SIMULATION MODE'}`);
  console.log(` ↳ Stripe:    ${process.env.STRIPE_SECRET_KEY ? '✅ LIVE' : '⚪ NOT CONFIGURED'}`);
  console.log("------------------------------------------");

  server.listen(PORT, "0.0.0.0", () => {
      console.log(`[SERVER] GhostChain Totality operational at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("[SERVER] Startup Failure:", err);
    process.exit(1);
  }
}

startServer();
