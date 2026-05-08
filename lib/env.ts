import path from "path";
import fs from "fs";

export const autoInjectEnvironment = () => {
  try {
    const envExamplePath = path.join(process.cwd(), '.env.example');
    if (fs.existsSync(envExamplePath)) {
      const exampleEnv = fs.readFileSync(envExamplePath, 'utf-8');
      
      console.log("\n[SYSTEM BOOT] Initiating Environmental Variable Auto-Insertion...");
      
      exampleEnv.split('\n').forEach(line => {
        const match = line.match(/^\s*([^#=]+)\s*=\s*(.*)$/);
        if (match) {
          const key = match[1].trim();
          const val = match[2].trim().replace(/^['"]|['"]$/g, '');
          
          if (val && !process.env[key]) {
            process.env[key] = val;
            const isSensitive = /KEY|SECRET|TOKEN|PWD|API|PRIVATE/i.test(key);
            const displayVal = isSensitive ? '••••••••' : (val.length > 25 ? val.slice(0, 10) + '...' : val);
            console.log(` ↳ Injected Configuration: ${key} = ${displayVal}`);
          }
        }
      });
      console.log("[SYSTEM BOOT] Auto-Insertion Complete.\n");
    }
  } catch (err) {
    console.warn("[SYSTEM BOOT] Environmental Auto-Insertion Bypassed:", err);
  }
};

export const validateEnvironment = () => {
  const required = [
    'GEMINI_API_KEY',
    'FIREBASE_PROJECT_ID',
    'AUTOPILOT_GATE_KEY'
  ];

  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.warn(`[SECURITY] Potential Breach: Missing required environment variables: ${missing.join(', ')}`);
    console.warn(` ↳ Systems may operate in simulation/degraded mode.`);
  }

  if (process.env.AUTOPILOT_GATE_KEY === 'SAFEFI_2026') {
    console.warn("[SECURITY] CRITICAL: System using default Autopilot Gate Key. HIGH RISK of unauthorized execution.");
  }
};

export const sanitizeSecrets = () => {
  if (process.env.FIREBASE_PRIVATE_KEY) {
    let key = process.env.FIREBASE_PRIVATE_KEY;
    key = key.replace(/^["']|["']$/g, ''); 
    key = key.replace(/\\n/g, '\n');       
    process.env.FIREBASE_PRIVATE_KEY = key;
  }

  const keysToClean = [
    'OPENAI_API_KEY', 
    'STRIPE_SECRET_KEY', 
    'PLAID_SECRET', 
    'GETBLOCK_RPC_KEY',
    'CIRCLE_API_KEY',
    'ANTHROPIC_API_KEY',
    'PINECONE_API_KEY',
    'TWILIO_AUTH_TOKEN',
    'COINGECKO_API_KEY',
    'KRAKEN_API_KEY',
    'KRAKEN_API_SECRET',
    'SURGE_TOKEN',
    'AUTOPILOT_GATE_KEY',
    'TRADING_BOT_PRIVATE_KEY'
  ];

  keysToClean.forEach(key => {
    if (process.env[key]) {
      process.env[key] = process.env[key]!.trim().replace(/^["']|["']$/g, '');
    }
  });
};
