import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function TRNAStructure({ animating }: { animating: boolean }) {
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!animating) { setProgress(1); return; }
    setProgress(0);
    const startTime = Date.now();
    const duration = 4000;
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);
      if (newProgress < 1) animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => { if (animationRef.current) cancelAnimationFrame(animationRef.current); };
  }, [animating]);

  const stemProgress = (delay: number, dur: number) => ({ delay, duration: dur });

  return (
    <div className="card">
      <h3 className="font-display text-lg font-semibold text-white mb-4 text-center">tRNA 三叶草结构</h3>
      <svg viewBox="-220 -200 440 420" className="w-full max-w-lg mx-auto" style={{ minHeight: '450px' }}>
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="acceptorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00d4aa" />
            <stop offset="100%" stopColor="#00a88a" />
          </linearGradient>
          <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <polygon points="0 0, 6 3, 0 6" fill="#fff" opacity="0.5" />
          </marker>
        </defs>

        <g filter="url(#glow)">
          <motion.text x="0" y="-175" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="Orbitron" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.02 ? 1 : 0 }}>氨基酸 (AA)</motion.text>
          <motion.text x="0" y="-160" textAnchor="middle" fill="#00d4aa" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.05 ? 1 : 0 }}>↓</motion.text>

          <motion.line x1="-8" y1="-150" x2="-8" y2="-50" stroke="#00d4aa" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.1, 0.4)} />
          <motion.line x1="8" y1="-150" x2="8" y2="-50" stroke="#00d4aa" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.1, 0.4)} />
          <motion.text x="0" y="-45" textAnchor="middle" fill="#00d4aa" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.15 ? 1 : 0 }}>CCA 3'</motion.text>

          <motion.line x1="-8" y1="-50" x2="-50" y2="0" stroke="#00d4aa" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.2, 0.3)} />
          <motion.line x1="8" y1="-50" x2="50" y2="0" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.2, 0.3)} />

          <motion.line x1="-50" y1="0" x2="-70" y2="-60" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.3, 0.3)} />
          <motion.line x1="50" y1="0" x2="70" y2="-60" stroke="#7c3aed" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.3, 0.3)} />

          <motion.ellipse cx="0" cy="-55" rx="60" ry="35" fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray="5,3" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.4, 0.4)} />
          <motion.text x="0" y="-52" textAnchor="middle" fill="#7c3aed" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.7 ? 1 : 0 }}>D臂 (DHU环)</motion.text>
          <motion.text x="0" y="-38" textAnchor="middle" fill="#7c3aed" fontSize="8" opacity="0.7" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.75 ? 0.7 : 0 }}>二氢尿嘧啶</motion.text>

          <motion.line x1="-70" y1="-60" x2="-130" y2="-20" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.5, 0.3)} />
          <motion.line x1="70" y1="-60" x2="130" y2="-20" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.5, 0.3)} />

          <motion.line x1="-130" y1="-20" x2="-140" y2="-90" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.55, 0.3)} />
          <motion.line x1="130" y1="-20" x2="140" y2="-90" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.55, 0.3)} />

          <motion.ellipse cx="0" cy="-105" rx="130" ry="40" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,3" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.6, 0.5)} />
          <motion.text x="0" y="-100" textAnchor="middle" fill="#ef4444" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.95 ? 1 : 0 }}>反密码子环</motion.text>
          <motion.text x="0" y="-85" textAnchor="middle" fill="#ef4444" fontSize="8" opacity="0.7" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.98 ? 0.7 : 0 }}>5'-X-Y-Z-3' (与mRNA密码子互补)</motion.text>

          <motion.line x1="-140" y1="-90" x2="-100" y2="-160" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.7, 0.3)} />
          <motion.line x1="140" y1="-90" x2="100" y2="-160" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.7, 0.3)} />

          <motion.ellipse cx="0" cy="-130" rx="100" ry="25" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="5,3" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.75, 0.4)} />
          <motion.text x="0" y="-125" textAnchor="middle" fill="#22c55e" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 1.05 ? 1 : 0 }}>可变环</motion.text>

          <motion.line x1="-100" y1="-160" x2="-50" y2="-150" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.8, 0.3)} />
          <motion.line x1="100" y1="-160" x2="50" y2="-150" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.8, 0.3)} />

          <motion.ellipse cx="0" cy="-175" rx="50" ry="18" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,3" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.85, 0.4)} />
          <motion.text x="0" y="-170" textAnchor="middle" fill="#f59e0b" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 1.15 ? 1 : 0 }}>TΨC环</motion.text>
          <motion.text x="0" y="-155" textAnchor="middle" fill="#f59e0b" fontSize="8" opacity="0.7" initial={{ opacity: 0 }} animate={{ opacity: progress > 1.18 ? 0.7 : 0 }}>胸苷-假尿苷-胞苷</motion.text>
        </g>
      </svg>

      <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#00d4aa]" /><span className="text-gray-400">受体茎 (3' CCA)</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#7c3aed]" /><span className="text-gray-400">D臂 (DHU)</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ef4444]" /><span className="text-gray-400">反密码子臂</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22c55e]" /><span className="text-gray-400">可变环</span></div>
        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f59e0b]" /><span className="text-gray-400">TΨC环</span></div>
      </div>
    </div>
  );
}
