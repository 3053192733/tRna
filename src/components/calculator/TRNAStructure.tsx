import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function TRNAStructure({ animating }: { animating: boolean }) {
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!animating) { setProgress(1); return; }
    setProgress(0);
    const startTime = Date.now();
    const duration = 3000;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);
      if (newProgress < 1) animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [animating]);

  return (
    <div className="card">
      <h3 className="font-display text-lg font-semibold text-white mb-4 text-center">tRNA 三叶草结构</h3>
      <svg viewBox="-200 -150 400 300" className="w-full max-w-lg mx-auto" style={{ minHeight: '400px' }}>
        <defs>
          <filter id="glow"><feGaussianBlur stdDeviation="3" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          <linearGradient id="stemGradient" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#00d4aa" /><stop offset="100%" stopColor="#7c3aed" /></linearGradient>
        </defs>
        <g filter="url(#glow)">
          <motion.line x1="0" y1="100" x2="0" y2="40" stroke="url(#stemGradient)" strokeWidth="4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={{ duration: 0.5 }} />
          <motion.path d="M 0 40 L 15 35 M 0 40 L 20 40 M 0 40 L 15 45" stroke="#00d4aa" strokeWidth="2" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={{ delay: 0.4, duration: 0.3 }} />
          <motion.line x1="0" y1="40" x2="-30" y2="-40" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={{ delay: 0.5, duration: 0.4 }} />
          <motion.circle cx="-30" cy="-60" r={30} fill="none" stroke="#7c3aed" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={{ delay: 0.8, duration: 0.3 }} />
          <motion.text x="-30" y="-58" textAnchor="middle" fill="#7c3aed" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.9 ? 1 : 0 }}>D环</motion.text>
          <motion.line x1="-30" y1="-60" x2="-120" y2="-10" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={{ delay: 1.0, duration: 0.4 }} />
          <motion.circle cx="-120" cy="-10" r={40} fill="none" stroke="#ef4444" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={{ delay: 1.3, duration: 0.3 }} />
          <motion.text x="-120" y="-8" textAnchor="middle" fill="#ef4444" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 1.2 ? 1 : 0 }}>反密码子</motion.text>
          <motion.line x1="0" y1="40" x2="70" y2="-50" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={{ delay: 1.6, duration: 0.4 }} />
          <motion.circle cx="70" cy="-50" r={40} fill="none" stroke="#22c55e" strokeWidth="3" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={{ delay: 1.9, duration: 0.3 }} />
          <motion.text x="70" y="-48" textAnchor="middle" fill="#22c55e" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 2.0 ? 1 : 0 }}>TΨC环</motion.text>
          <motion.line x1="0" y1="100" x2="0" y2="130" stroke="#00d4aa" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={{ delay: 2.1, duration: 0.3 }} />
          <motion.text x="0" y="145" textAnchor="middle" fill="#00d4aa" fontSize="10" fontWeight="bold" initial={{ opacity: 0 }} animate={{ opacity: progress > 2.3 ? 1 : 0 }}>CCA 3'</motion.text>
          <motion.text x="0" y="-90" textAnchor="middle" fill="#fff" fontSize="14" fontFamily="Orbitron" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.5 ? 1 : 0 }}>氨基酸结合位点</motion.text>
        </g>
      </svg>
      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#00d4aa]" /><span className="text-gray-400">受体茎</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#7c3aed]" /><span className="text-gray-400">D环</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ef4444]" /><span className="text-gray-400">反密码子环</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22c55e]" /><span className="text-gray-400">TΨC环</span></div>
      </div>
    </div>
  );
}
