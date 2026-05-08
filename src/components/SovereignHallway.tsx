import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Users, 
  Cpu, 
  Wallet, 
  Shield, 
  Rocket, 
  Trophy,
  Bot,
  Database,
  BrainCircuit,
  Eye,
  Maximize2,
  ShoppingCart,
  TrendingUp,
  Dna
} from 'lucide-react';
import { cn } from '../lib/utils';
import { DeploymentEnginePanel } from './DeploymentEnginePanel';
import { Ghost20Middleware } from './Ghost20Middleware';
import { SquadPanel } from './SquadPanel';
import { VaultsPanel } from './VaultsPanel';
import { DataIngestionPanel } from './DataIngestionPanel';
import { HackathonContestPanel } from './HackathonContestPanel';
import { SovereignAgentConsole } from './SovereignAgentConsole';
import { SapphireMarketplace } from './SapphireMarketplace';
import { ProfitSwarmConsole } from './ProfitSwarmConsole';
import { SelfEvolvingInterface } from './SelfEvolvingInterface';

interface FeatureNode {
  id: string;
  title: string;
  description: string;
  icon: any;
  component: React.ReactNode;
  side: 'left' | 'right';
  depth: number;
}

interface HallwayProps {
  totalProfit: number;
  setTotalProfit: React.Dispatch<React.SetStateAction<number>>;
  botCredits: number;
  setBotCredits: React.Dispatch<React.SetStateAction<number>>;
  vaults: any[];
  transactions: any[];
  createVault: () => void;
  market: any;
  handleTransfer?: (amount: number, to: string) => Promise<boolean>;
}

export function SovereignHallway({ totalProfit, setTotalProfit, botCredits, setBotCredits, vaults, transactions, createVault, market, handleTransfer }: HallwayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 3D Hallway Transforms
  const zPosition = useTransform(smoothProgress, [0, 1], [0, -5000]);
  const perspective = useTransform(smoothProgress, [0, 1], [1000, 2000]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features: FeatureNode[] = [
    { 
      id: 'deploy', 
      title: 'Deployment Engine', 
      description: 'v33-ALL Totality Sync', 
      icon: Rocket, 
      component: <DeploymentEnginePanel />, 
      side: 'left', 
      depth: 1000 
    },
    { 
      id: 'middleware', 
      title: 'Ghost-20 Suite', 
      description: 'Synthetic Symmetry', 
      icon: Cpu, 
      component: <Ghost20Middleware />, 
      side: 'right', 
      depth: 2000 
    },
    { 
      id: 'vaults', 
      title: 'Sovereign Vaults', 
      description: 'SafeFi Asset Core', 
      icon: Wallet, 
      component: (
        <VaultsPanel 
          vaults={vaults} 
          transactions={transactions} 
          createVault={createVault} 
          handleTransfer={handleTransfer}
        />
      ), 
      side: 'left', 
      depth: 2500 
    },
    { 
      id: 'squad', 
      title: 'Squad Coordination', 
      description: 'Tactical Swarm Ops', 
      icon: Users, 
      component: <SquadPanel />, 
      side: 'left', 
      depth: 3500 
    },
    { 
      id: 'knowledge', 
      title: 'Neural Cache', 
      description: 'TH_12 Data Ingestion', 
      icon: Database, 
      component: <DataIngestionPanel />, 
      side: 'right', 
      depth: 4000 
    },
    { 
      id: 'contest', 
      title: 'Contest Optimizer', 
      description: 'Lablab.ai // AMD Focus', 
      icon: Trophy, 
      component: <HackathonContestPanel />, 
      side: 'left', 
      depth: 5000 
    },
    { 
      id: 'agentic', 
      title: 'Agentic Console', 
      description: 'LangGraph Reactive Engine', 
      icon: Bot, 
      component: <SovereignAgentConsole />, 
      side: 'right', 
      depth: 6000 
    },
    { 
      id: 'market', 
      title: 'Sapphire Market', 
      description: 'Resource Acquisition Node', 
      icon: ShoppingCart, 
      component: <SapphireMarketplace botCredits={botCredits} setBotCredits={setBotCredits} />, 
      side: 'left', 
      depth: 7000 
    },
    { 
      id: 'profit', 
      title: 'Revenue Swarm', 
      description: 'Autonomous Profit Cycles', 
      icon: TrendingUp, 
      component: (
        <ProfitSwarmConsole 
          totalProfit={totalProfit} 
          setTotalProfit={setTotalProfit} 
          botCredits={botCredits} 
          setBotCredits={setBotCredits} 
          market={market}
        />
      ), 
      side: 'right', 
      depth: 8000 
    },
    { 
      id: 'evolution', 
      title: 'Evolution Hub', 
      description: 'Self-Mutation Protocol', 
      icon: Dna, 
      component: <SelfEvolvingInterface />, 
      side: 'left', 
      depth: 9000 
    }
  ];

  return (
    <div ref={containerRef} className="relative h-[500vh] bg-black selection:bg-cyan-500 selection:text-black">
      {/* Immersive Background */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#00E5FF_1px,transparent_1px)] bg-[size:40px_40px]" />
         <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
      </div>

      <div className="fixed inset-0 flex items-center justify-center overflow-hidden perspective-[1000px]">
        <motion.div 
          style={{ 
            translateZ: zPosition,
            rotateX: mousePos.y * -0.05,
            rotateY: mousePos.x * 0.05,
            perspective
          }}
          className="relative w-full h-full preserve-3d"
        >
          {/* Hallway Walls (Infinite Grid) */}
          <div className="absolute inset-0 w-full h-full preserve-3d">
            {/* Left Wall */}
            <div className="absolute top-0 bottom-0 left-0 w-[2000px] bg-[linear-gradient(90deg,rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] origin-left rotate-y-90 translate-x-[-1000px]" />
            {/* Right Wall */}
            <div className="absolute top-0 bottom-0 right-0 w-[2000px] bg-[linear-gradient(90deg,rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] origin-right -rotate-y-90 translate-x-[1000px]" />
            {/* Floor */}
            <div className="absolute left-0 right-0 bottom-0 h-[2000px] bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] origin-bottom rotate-x-90 translate-y-[1000px]" />
            {/* Ceiling */}
            <div className="absolute left-0 right-0 top-0 h-[2000px] bg-[linear-gradient(rgba(0,229,255,0.05)_1px,transparent_1px)] bg-[size:100px_100px] origin-top -rotate-x-90 translate-y-[-1000px]" />
          </div>

          {/* Feature Nodes in 3D Space */}
          {features.map((feature) => (
            <motion.div
              key={feature.id}
              style={{
                translateZ: feature.depth,
                x: feature.side === 'left' ? -400 : 400,
                y: feature.side === 'left' ? -100 : 100,
              }}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 preserve-3d"
            >
              <div 
                onClick={() => setActiveNode(feature.id)}
                className="group cursor-pointer p-8 rounded-[3rem] bg-black/80 border-2 border-cyan-500/20 hover:border-cyan-500 transition-all shadow-[0_0_50px_rgba(0,229,255,0.1)] hover:shadow-[0_0_100px_rgba(0,229,255,0.2)] w-[300px]"
              >
                <div className="p-4 bg-cyan-500/10 rounded-full w-fit mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-8 h-8 text-cyan-400" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter mb-2">{feature.title}</h3>
                <p className="text-[10px] text-cyan-500/50 font-black uppercase tracking-widest">{feature.description}</p>
                
                <div className="mt-8 flex items-center gap-2 text-cyan-500 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={12} />
                  Expand Module
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Persistent Assistant HUD */}
      <div className="fixed top-12 left-12 z-50 flex items-center gap-6">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500 blur-2xl opacity-20 animate-pulse" />
          <div className="w-16 h-16 rounded-full border-2 border-cyan-500/50 bg-black flex items-center justify-center relative overflow-hidden group">
             <BrainCircuit className="w-8 h-8 text-cyan-400 group-hover:scale-110 transition-transform" />
             <div className="absolute inset-0 border-t-2 border-cyan-500 animate-spin" />
          </div>
        </div>
        <div>
          <h2 className="text-white font-black uppercase tracking-tighter text-lg leading-none mb-1">€hain Sentinel</h2>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-ping" />
            <p className="text-[10px] text-cyan-500 font-black uppercase tracking-widest">Sovereign Build Active</p>
          </div>
        </div>
      </div>

      {/* Expanded Module Overlay */}
      <AnimatePresence>
        {activeNode && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-2xl p-12 flex items-center justify-center"
          >
            <div className="w-full max-w-6xl relative">
              <button 
                onClick={() => setActiveNode(null)}
                className="absolute -top-12 right-0 text-slate-500 hover:text-white transition-colors flex items-center gap-2 uppercase font-black text-xs tracking-widest"
              >
                Return to Hallway [ESC]
              </button>
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="max-h-[85vh] overflow-y-auto custom-scrollbar p-1"
              >
                {features.find(f => f.id === activeNode)?.component}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Instruction */}
      <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 text-center">
        <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.4em] mb-4">Scroll to traverse the Totality</p>
        <div className="w-px h-12 bg-gradient-to-b from-cyan-500 to-transparent mx-auto" />
      </div>
    </div>
  );
}
