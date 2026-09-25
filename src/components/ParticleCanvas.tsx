import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
  gravity: number;
}

export interface ParticleCanvasHandle {
  burst: (x: number, y: number, color?: string, count?: number) => void;
  celebrate: () => void;
}

export const ParticleCanvas = React.forwardRef<ParticleCanvasHandle, { reducedMotion?: boolean }>((props, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      if (particles.length > 0) {
        animFrameRef.current = requestAnimationFrame(loop);
      } else {
        animFrameRef.current = null;
      }
    };

    const triggerLoop = () => {
      if (animFrameRef.current === null && particlesRef.current.length > 0) {
        animFrameRef.current = requestAnimationFrame(loop);
      }
    };

    // Expose burst methods
    if (ref && 'current' in ref) {
      ref.current = {
        burst: (x: number, y: number, color = '#10B981', count = 12) => {
          if (props.reducedMotion) return;
          for (let i = 0; i < count; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 1.5 + Math.random() * 3.5;
            particlesRef.current.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed - 1.2,
              color,
              size: 2 + Math.random() * 2.5,
              alpha: 0.9,
              decay: 0.025 + Math.random() * 0.03,
              gravity: 0.08,
            });
          }
          triggerLoop();
        },
        celebrate: () => {
          if (props.reducedMotion) return;
          const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#06B6D4'];
          const width = window.innerWidth;
          const height = window.innerHeight;

          for (let i = 0; i < 90; i++) {
            const angle = -Math.PI / 2 + (Math.random() * 1.4 - 0.7);
            const speed = 6 + Math.random() * 10;
            particlesRef.current.push({
              x: width * 0.5 + (Math.random() * 200 - 100),
              y: height * 0.65,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              color: colors[Math.floor(Math.random() * colors.length)],
              size: 3 + Math.random() * 4,
              alpha: 1,
              decay: 0.01 + Math.random() * 0.015,
              gravity: 0.16,
            });
          }
          triggerLoop();
        },
      };
    }

    return () => {
      window.removeEventListener('resize', resize);
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [props.reducedMotion, ref]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden"
      aria-hidden="true"
    />
  );
});

ParticleCanvas.displayName = 'ParticleCanvas';
