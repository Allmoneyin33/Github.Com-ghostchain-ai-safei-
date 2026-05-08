import React, { useEffect, useRef } from 'react';

interface DigitalSoulProps {
  drift?: number;
  size?: number;
  className?: string;
}

export function DigitalSoul({ drift = 1.0, size = 120, className }: DigitalSoulProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; vx: number; vy: number; life: number }[] = [];

    const init = () => {
      particles = Array.from({ length: 50 }).map(() => ({
        x: Math.random() * size,
        y: Math.random() * size,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: Math.random()
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, size, size);
      
      const centerX = size / 2;
      const centerY = size / 2;
      
      // Draw core
      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, size / 2);
      gradient.addColorStop(0, `rgba(239, 68, 68, ${0.4 * drift})`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(centerX, centerY, (size / 4) * drift, 0, Math.PI * 2);
      ctx.fill();

      // Particles
      particles.forEach(p => {
        p.x += p.vx * drift;
        p.y += p.vy * drift;
        p.life -= 0.01;

        if (p.life <= 0 || p.x < 0 || p.x > size || p.y < 0 || p.y > size) {
          p.x = centerX + (Math.random() - 0.5) * 10;
          p.y = centerY + (Math.random() - 0.5) * 10;
          p.life = 1;
        }

        ctx.fillStyle = drift > 1.2 ? `rgba(239, 68, 68, ${p.life})` : `rgba(34, 211, 238, ${p.life})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
        ctx.fill();
        
        // Connect to center if close
        const dx = p.x - centerX;
        const dy = p.y - centerY;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < size / 3) {
            ctx.strokeStyle = drift > 1.2 ? `rgba(239, 68, 68, ${0.1 * p.life})` : `rgba(34, 211, 238, ${0.1 * p.life})`;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(centerX, centerY);
            ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    init();
    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [drift, size]);

  return (
    <canvas 
      ref={canvasRef} 
      width={size} 
      height={size} 
      className={className}
      style={{ filter: 'drop-shadow(0 0 10px rgba(220,38,38,0.3))' }}
    />
  );
}
