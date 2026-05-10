import { useEffect, useRef } from 'react';

const COLORS = {
  A: '#ef4444',
  T: '#3b82f6',
  G: '#22c55e',
  C: '#3b82f6',
};

export default function DNAHelix() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let angle = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const drawBasePair = (
      x1: number, y1: number,
      x2: number, y2: number,
      base1: string, base2: string,
      alpha: number
    ) => {
      ctx.save();
      ctx.globalAlpha = alpha;

      ctx.beginPath();
      ctx.arc(x1, y1, 8, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[base1 as keyof typeof COLORS] || '#fff';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x2, y2, 8, 0, Math.PI * 2);
      ctx.fillStyle = COLORS[base2 as keyof typeof COLORS] || '#fff';
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.5})`;
      ctx.lineWidth = 2;
      ctx.stroke();

      const midX = (x1 + x2) / 2;
      const midY = (y1 + y2) / 2;
      const bondCount = base1 === 'G' || base1 === 'C' ? 3 : 2;
      const spacing = 6;

      for (let i = 0; i < bondCount; i++) {
        const offset = (i - (bondCount - 1) / 2) * spacing;
        ctx.beginPath();
        ctx.arc(midX, midY + offset, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
        ctx.fill();
      }

      ctx.restore();
    };

    const drawHelix = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const basePairs = 20;
      const spacing = 40;
      const amplitude = 80;
      const startY = canvas.height / 2 - (basePairs * spacing) / 2;

      for (let i = 0; i < basePairs; i++) {
        const y = startY + i * spacing;
        const phase = angle + (i * Math.PI) / 3;

        const x1 = centerX + Math.sin(phase) * amplitude;
        const x2 = centerX + Math.sin(phase + Math.PI) * amplitude;

        const alpha = 1 - Math.abs((i - basePairs / 2) / basePairs) * 0.5;

        const bases = [
          ['A', 'T'], ['T', 'A'], ['G', 'C'], ['C', 'G'],
          ['A', 'T'], ['G', 'C'], ['T', 'A'], ['C', 'G']
        ];
        const [base1, base2] = bases[i % bases.length];

        drawBasePair(x1, y, x2, y, base1, base2, alpha);
      }

      ctx.beginPath();
      ctx.moveTo(centerX + Math.sin(angle) * amplitude, startY);
      for (let i = 1; i < basePairs; i++) {
        const y = startY + i * spacing;
        const phase = angle + (i * Math.PI) / 3;
        const x = centerX + Math.sin(phase) * amplitude;
        ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(0, 212, 170, 0.3)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerX + Math.sin(angle + Math.PI) * amplitude, startY);
      for (let i = 1; i < basePairs; i++) {
        const y = startY + i * spacing;
        const phase = angle + (i * Math.PI) / 3;
        const x = centerX + Math.sin(phase + Math.PI) * amplitude;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    };

    const animate = () => {
      angle += 0.01;
      drawHelix();
      animationId = requestAnimationFrame(animate);
    };

    resize();
    animate();

    window.addEventListener('resize', resize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-30"
    />
  );
}
