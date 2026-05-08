import React, { useMemo } from 'react';
import { motion } from 'motion/react';

interface Node {
  id: number;
  x: number;
  y: number;
  size: number;
  pulseSpeed: number;
  color: string;
}

interface RealityMapProps {
  drift?: number;
}

export function RealityMap({ drift = 1.0 }: RealityMapProps) {
  const nodes = useMemo(() => {
    return Array.from({ length: 14 }).map((_, i) => ({
      id: i,
      x: 10 + Math.random() * 80, // %
      y: 10 + Math.random() * 80, // %
      size: 2 + Math.random() * 4,
      pulseSpeed: (2 + Math.random() * 3) / (drift || 1),
      color: i % 3 === 0 ? '#ef4444' : i % 3 === 1 ? '#10b981' : '#3b82f6'
    }));
  }, [drift]);

  const connections = useMemo(() => {
    const pairs: [Node, Node][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dist = Math.sqrt(
          Math.pow(nodes[i].x - nodes[j].x, 2) + 
          Math.pow(nodes[i].y - nodes[j].y, 2)
        );
        if (dist < 35) {
          pairs.push([nodes[i], nodes[j]]);
        }
      }
    }
    return pairs;
  }, [nodes]);

  return (
    <div className="w-full h-full relative group cursor-crosshair">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        {/* Grid lines */}
        <defs>
          <pattern id="realityGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.05" strokeOpacity="0.1" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#realityGrid)" />

        {/* Connections */}
        {connections.map(([a, b], i) => (
          <motion.line
            key={`line-${i}`}
            x1={a.x}
            y1={a.y}
            x2={b.x}
            y2={b.y}
            stroke="white"
            strokeWidth="0.1"
            strokeOpacity="0.1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.2 }}
            transition={{ duration: 2, delay: i * 0.1 }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node) => (
          <g key={node.id}>
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size / 2}
              fill={node.color}
              initial={{ scale: 0 }}
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ 
                duration: node.pulseSpeed,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.size * 2}
              fill="none"
              stroke={node.color}
              strokeWidth="0.1"
              animate={{ 
                r: [node.size, node.size * 4],
                opacity: [0.5, 0]
              }}
              transition={{ 
                duration: 4,
                repeat: Infinity,
                ease: "easeOut",
                delay: node.id * 0.5
              }}
            />
          </g>
        ))}
      </svg>
      
      {/* HUD Overlays */}
      <div className="absolute top-4 left-4 flex flex-col gap-1">
         <span className="text-[8px] font-black text-white/40 uppercase tracking-widest">Reality_Mesh_v1.0</span>
         <span className="text-[10px] font-mono text-emerald-500">SYNC: NOMINAL</span>
      </div>

      <div className="absolute bottom-4 right-4 text-right">
         <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-1">Shard Coordinates</p>
         <div className="flex gap-2">
            <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-mono text-white/60">X: 14.28</span>
            <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-mono text-white/60">Y: 98.42</span>
            <span className="px-2 py-0.5 bg-white/5 rounded text-[8px] font-mono text-white/60">Z: 0.05</span>
         </div>
      </div>

      {/* Decorative Corner Brackets */}
      <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-white/20" />
      <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-white/20" />
      <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-white/20" />
      <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-white/20" />
    </div>
  );
}
