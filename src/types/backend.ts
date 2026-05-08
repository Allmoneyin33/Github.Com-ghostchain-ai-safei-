import { firestore } from 'firebase-admin';

export interface VaultSnapshot {
  balance: number;
  totalRevenue: number;
  lastSync: Date;
  status: string;
}

export interface ChainLog {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'SUCCESS';
  message: string;
}

export interface Bot {
  id: string;
  logic: string;
  strength: number;
  target?: string;
  active?: boolean;
}

export interface MarketState {
  BTC: number;
  ETH: number;
  SOL: number;
  GHOST: number;
  timestamp: string;
  globalVolume: number;
  marketCap: number;
}
