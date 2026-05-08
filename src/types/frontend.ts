import { ElementType } from 'react';

export interface Agent {
  id: string;
  agentId: string;
  name: string;
  status: 'active' | 'inactive' | 'repairing' | 'evolving' | 'synthesizing' | string;
  health?: number;
  lastUpdate: string | number | Date;
  type: string;
  revenue?: number;
  role: string;
  reputation: number;
  healthScore: number;
  capabilities: string[];
  resonance?: number;
  ascensionLevel?: number;
  lore?: string;
  reputationHistory?: number[];
  cognitiveGrowth?: number;
  innovationLevel?: number;
  nextStepRecommendations?: string[];
  autoRepairLogs?: string[];
  selfInstallationStatus?: string;
}

export interface HealthData {
  telemetry: {
    temp: number;
    latency: number;
  };
}

export interface RepairLog {
  id: string;
  agentId: string;
  agentName: string;
  timestamp: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface MarketData {
  BTC: number;
  ETH: number;
  SOL: number;
  GHOST: number;
  timestamp: string;
  globalVolume: number;
  marketCap: number;
}

export interface Alert {
  id: string;
  type: string;
  message: string;
  timestamp: number;
  severity: 'low' | 'medium' | 'high' | 'critical';
  priority: 'low' | 'medium' | 'high' | 'critical';
  text: string;
  category: string;
  resonanceImpact?: number;
}

export interface VaultSnapshot {
  id?: string;
  vaultId?: string;
  balance: number;
  totalRevenue?: number;
  currency?: string;
}

export interface Transaction {
  id: string;
  type: string;
  amount: number;
  timestamp: string | number;
  status: string;
  currency?: string;
  to?: string;
}

export interface ProfitMetric {
  id: string;
  label: string;
  value: string;
  trend: number;
  icon: ElementType;
}
