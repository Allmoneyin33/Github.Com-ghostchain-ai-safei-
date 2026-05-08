import { collection, addDoc, serverTimestamp, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

export interface IntelSignal {
  id: string;
  source: string;
  type: 'market' | 'security' | 'neural' | 'shard';
  impact: 'high' | 'medium' | 'low';
  content: string;
  timestamp: any;
  metadata?: Record<string, any>;
}

export const streamIntelSignals = (callback: (signals: IntelSignal[]) => void) => {
  const q = query(
    collection(db, 'intel_signals'),
    orderBy('timestamp', 'desc'),
    limit(20)
  );

  return onSnapshot(q, (snapshot) => {
    callback(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as IntelSignal)));
  });
};

export const broadcastIntel = async (signal: Omit<IntelSignal, 'id' | 'timestamp'>) => {
  try {
    await addDoc(collection(db, 'intel_signals'), {
      ...signal,
      timestamp: serverTimestamp()
    });
  } catch (error) {
    console.error('Failed to broadcast intel:', error);
  }
};

/**
 * Simulates emergence of new intelligence signals based on global "GhostChain" activity.
 */
export const spawnSyntheticSignal = () => {
  const sources = ['RECON-ALPHA', 'SHARD-NEXUS', 'GHOST-SENTINEL', 'NEURAL-BRIDGE'];
  const types: IntelSignal['type'][] = ['market', 'security', 'neural', 'shard'];
  const impacts: IntelSignal['impact'][] = ['high', 'medium', 'low'];
  
  const contentMap = {
    market: [
      'Liquidity depth detected in ERC-8004 pool. Volatility incoming.',
      'Arbitrage opportunity identified between Local Shard and Mainnet.',
      'Whale movement tracked on GhostChain L2. Signal: BULLISH.'
    ],
    security: [
      'Failed breach attempt on Shard #7. Firewall normalized.',
      'Neural encryption rotation complete. Keys secured.',
      'Unauthorized RPC handshake rejected by Terminix Bridge.'
    ],
    neural: [
      'Model drift stabilized at 0.042%. Self-correction engaged.',
      'New neural weights propagated to local nodes.',
      'Intelligence spike detected in Swarm-7731.'
    ],
    shard: [
      'Local Terminix latency dropped to 4ms. Peak performance.',
      'Shard synchronization complete. Data integrity: 100%.',
      'Bridge heartbeat synchronized with Sovereign Hub.'
    ]
  };

  const type = types[Math.floor(Math.random() * types.length)];
  const content = contentMap[type][Math.floor(Math.random() * contentMap[type].length)];

  return {
    source: sources[Math.floor(Math.random() * sources.length)],
    type,
    impact: impacts[Math.floor(Math.random() * impacts.length)],
    content
  };
};
