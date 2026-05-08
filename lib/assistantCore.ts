import os from 'os';
import { exec } from 'child_process';
import { GoogleGenAI } from "@google/genai";

export interface SystemStatus {
  system: string;
  arch: string;
  uptime: number;
  freeMemory: number;
  totalMemory: number;
  cpus: number;
  nodeVersion: string;
  amdHardware: string;
}

export interface DiagnosticResult {
  timestamp: string;
  success: boolean;
  systemData?: SystemStatus;
  pm2Status?: string;
  reason?: unknown;
}

export class AssistantCore {
  private name: string;
  private startTime: number;
  private ai: GoogleGenAI | null = null;

  constructor(name?: string) {
    this.name = name || "Singularity-DeploymentCore-150.4";
    this.startTime = Date.now();
    if (process.env.GEMINI_API_KEY) {
        this.ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    }
  }

  public async generateResponse(context: string, prompt: string): Promise<string> {
    if (!this.ai) return "Neural core offline. API Key missing.";
    
    try {
      const model = this.ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt
      });
      const result = await model;
      return result.text || "Connection to the shards lost.";
    } catch (err) {
      console.error("Oracle Error:", err);
      return "The Oracle is currently silent. Resonance mismatched.";
    }
  }

  public getSystemStatus(): SystemStatus {
    return {
      system: os.platform(),
      arch: os.arch(),
      uptime: os.uptime(),
      freeMemory: os.freemem(),
      totalMemory: os.totalmem(),
      cpus: os.cpus().length,
      nodeVersion: process.version,
      amdHardware: "INSTINCT_MI355X"
    };
  }

  public runDiagnostics(): Promise<string> {
    return new Promise((resolve, reject) => {
      // Note: pm2 might not be in the path depending on environment,
      // but we will try to execute it as requested.
      exec('pm2 status || echo "PM2 not found in current environment"', (err, stdout, stderr) => {
        if (err && !stdout.includes("PM2 not found")) {
          return reject({ error: err.message, stderr });
        }
        resolve(stdout || stderr);
      });
    });
  }

  public async runSelfDiagnosticLoop(): Promise<DiagnosticResult> {
    try {
      const systemData = this.getSystemStatus();
      const pm2Output = await this.runDiagnostics();
      return {
        timestamp: new Date().toISOString(),
        success: true,
        systemData,
        pm2Status: pm2Output
      };
    } catch (e) {
      return {
        timestamp: new Date().toISOString(),
        success: false,
        reason: e
      };
    }
  }
}

export default AssistantCore;
