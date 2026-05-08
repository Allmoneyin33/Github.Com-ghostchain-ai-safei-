import React, { useEffect, useRef, useState } from 'react';
import { Network, Zap, Target, ShieldAlert } from 'lucide-react';
import { Card, Badge } from './ui/core';
import { motion } from 'motion/react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
}

export function NeuralSwarmMatrix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pulseCount, setPulseCount] = useState(0);
  const [isOverdrive, setIsOverdrive] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 60;
    const colors = ['#22c55e', '#818cf8', '#64748b', '#fbbf24']; // ghost-green, indigo, slate, amber

    const resize = () => {
      // Get actual rendered size
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * (isOverdrive ? 3 : 1),
          vy: (Math.random() - 0.5) * (isOverdrive ? 3 : 1),
          size: Math.random() * 2 + 1,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };

    window.addEventListener('resize', resize);
    resize();
    initParticles();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const connectionDistance = isOverdrive ? 150 : 100;

      // Update and Draw Particles
      particles.forEach((p, i) => {
        p.x += p.vx * (isOverdrive ? 2 : 1);
        p.y += p.vy * (isOverdrive ? 2 : 1);

        // Bounce off walls
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        // Draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(129, 140, 248, ${1 - dist / connectionDistance})`; // indigo base fade
            if (isOverdrive && Math.random() > 0.8) {
               ctx.strokeStyle = `rgba(34, 197, 94, ${1 - dist / connectionDistance})`; // ghost-green flashes
            }
            ctx.lineWidth = isOverdrive ? 1.5 : 0.5;
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }

        // Draw Node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * (isOverdrive ? 1.5 : 1), 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        
        ctx.shadowBlur = isOverdrive ? 15 : 5;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.closePath();
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isOverdrive]);

  const triggerPulse = () => {
    setIsOverdrive(true);
    setPulseCount(p => p + 1);
    setTimeout(() => {
      setIsOverdrive(false);
    }, 3000); // 3 seconds of overdrive
  };

  return (
    <Card className="flex flex-col border-ghost-accent/30 bg-black overflow-hidden relative min-h-[300px]">
      {/* Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
      />
      
      {/* Header Overlay */}
      <div className="relative z-10 p-4 border-b border-white/10 bg-black/60 backdrop-blur-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <motion.div 
            animate={{ rotate: isOverdrive ? 360 : 0 }} 
            transition={{ duration: 2, repeat: isOverdrive ? Infinity : 0, ease: "linear" }}
          >
            <Network className="w-5 h-5 text-indigo-400" />
          </motion.div>
          <div>
            <h3 className="font-black text-white uppercase tracking-widest text-sm">Neural Swarm Topology</h3>
            <p className="text-[9px] text-slate-400 font-mono tracking-widest">
              GHOSTCHAIN OMEGA: MULTI-AGENT STATE MATRIX
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isOverdrive ? (
             <Badge variant="warning">OVERDRIVE ACTIVE</Badge>
          ) : (
             <Badge variant="success">SWARM STABLE</Badge>
          )}
        </div>
      </div>

      {/* Main HUD */}
      <div className="relative z-10 p-6 flex-1 flex flex-col justify-end pointer-events-none">
        <div className="grid grid-cols-3 gap-4 pointer-events-auto">
          <div className="bg-black/60 border border-white/10 p-3 rounded backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-3 h-3 text-amber-400" />
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Network Pulses</p>
            </div>
            <p className="text-2xl font-mono text-white">{pulseCount}</p>
          </div>
          
          <div className="bg-black/60 border border-white/10 p-3 rounded backdrop-blur-md">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-3 h-3 text-ghost-accent" />
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Arbitrage Vectors</p>
            </div>
            <p className="text-2xl font-mono text-white">{isOverdrive ? '1,024' : '238'}</p>
          </div>

          <div className="bg-black/60 border border-white/10 p-3 rounded backdrop-blur-md flex flex-col justify-center">
            <button 
              onClick={triggerPulse}
              className={`w-full py-2 rounded font-black uppercase tracking-widest text-xs transition-all ${
                isOverdrive 
                  ? 'bg-amber-500 text-black shadow-[0_0_20px_rgba(245,158,11,0.6)]' 
                  : 'bg-ghost-accent/20 text-ghost-accent hover:bg-ghost-accent hover:text-black border border-ghost-accent/50'
              }`}
            >
              {isOverdrive ? 'Executing...' : 'Force MEV Injection'}
            </button>
          </div>
        </div>
      </div>
      
      {/* Dynamic scan line effect */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] pointer-events-none opacity-30" />
    </Card>
  );
}
