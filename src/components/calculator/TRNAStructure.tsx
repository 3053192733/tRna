import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Play, Pause, RotateCcw } from 'lucide-react';

interface TRNAStructureProps {
  animating: boolean;
}

export default function TRNAStructure({ animating }: TRNAStructureProps) {
  const [progress, setProgress] = useState(0);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!animating) {
      setProgress(1);
      return;
    }

    setProgress(0);
    const startTime = Date.now();
    const duration = 3000;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);
      setProgress(newProgress);

      if (newProgress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [animating]);

  const stemLength = 60;
  const loopRadius = 50;
  const armLength = 80;

  const drawLine = (
    x1: number, y1: number,
    x2: number, y2: number,
    progress: number,
    delay: number
  ) => {
    const adjustedProgress = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
    if (adjustedProgress <= 0) return null;

    const currentX = x1 + (x2 - x1) * adjustedProgress;
    const currentY = y1 + (y2 - y1) * adjustedProgress;

    return (
      <motion.line
        x1={x1}
        y1={y1}
        x2={currentX}
        y2={currentY}
        stroke="#00d4aa"
        strokeWidth="3"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: adjustedProgress }}
        transition={{ duration: 0.1 }}
      />
    );
  };

  const baseColor = (base: string) => {
    switch (base) {
      case 'A': return '#ef4444';
      case 'U': return '#f59e0b';
      case 'G': return '#22c55e';
      case 'C': return '#3b82f6';
      default: return '#fff';
    }
  };

  return (
    <div className="card">
      <h3 className="font-display text-lg font-semibold text-white mb-4 text-center">
        tRNA 三叶草结构
      </h3>

      <svg
        viewBox="-200 -150 400 300"
        className="w-full max-w-lg mx-auto"
        style={{ minHeight: '400px' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <linearGradient id="stemGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00d4aa" />
            <stop offset="100%" stopColor="#7c3aed" />
          </linearGradient>
        </defs>

        <g filter="url(#glow)">
          {/* Main stem (acceptor stem) */}
          <motion.line
            x1="0" y1="100"
            x2="0" y2="100 - stemLength"
            stroke="url(#stemGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ duration: 0.5 }}
          />

          {/* 3' end (acceptor end) */}
          <motion.path
            d="M 0 40 L 15 35 M 0 40 L 20 40 M 0 40 L 15 45"
            stroke="#00d4aa"
            strokeWidth="2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ delay: 0.4, duration: 0.3 }}
          />

          {/* D-arm (top) */}
          <motion.line
            x1="0" y1="40"
            x2="-30" y2="-40"
            stroke="#7c3aed"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ delay: 0.5, duration: 0.4 }}
          />
          <motion.circle
            cx="-30" cy="-60"
            r={loopRadius * 0.4}
            fill="none"
            stroke="#7c3aed"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ delay: 0.8, duration: 0.3 }}
          />
          <motion.text
            x="-30" y="-58"
            textAnchor="middle"
            className="text-xs"
            fill="#7c3aed"
            fontSize="10"
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 0.9 ? 1 : 0 }}
          >
            D环
          </motion.text>

          {/* Anticodon arm (left) */}
          <motion.line
            x1="-30" y1="-60"
            x2="-100" y2="-20"
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ delay: 1.0, duration: 0.4 }}
          />
          <motion.circle
            cx="-120" cy="-10"
            r={loopRadius * 0.5}
            fill="none"
            stroke="#ef4444"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ delay: 1.3, duration: 0.3 }}
          />
          <motion.text
            x="-120" y="-8"
            textAnchor="middle"
            className="text-xs"
            fill="#ef4444"
            fontSize="10"
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 1.2 ? 1 : 0 }}
          >
            反密码子
          </motion.text>
          {/* Anticodon bases */}
          {[0, 1, 2].map((i) => (
            <motion.text
              key={i}
              x={-130 + i * 10}
              y={-15}
              textAnchor="middle"
              fill={baseColor(['G', 'G', 'C'][i])}
              fontSize="12"
              fontFamily="monospace"
              fontWeight="bold"
              initial={{ opacity: 0 }}
              animate={{ opacity: progress > 1.4 + i * 0.1 ? 1 : 0 }}
            >
              {['G', 'G', 'C'][i]}
            </motion.text>
          ))}

          {/* Variable loop */}
          <motion.line
            x1="-100" y1="-20"
            x2="-110" y2="30"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ delay: 1.5, duration: 0.3 }}
          />

          {/* TΨC arm (right) */}
          <motion.line
            x1="0" y1="40"
            x2="50" y2="-30"
            stroke="#22c55e"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ delay: 1.6, duration: 0.4 }}
          />
          <motion.circle
            cx="70" cy="-50"
            r={loopRadius * 0.5}
            fill="none"
            stroke="#22c55e"
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ delay: 1.9, duration: 0.3 }}
          />
          <motion.text
            x="70" y="-48"
            textAnchor="middle"
            className="text-xs"
            fill="#22c55e"
            fontSize="10"
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 2.0 ? 1 : 0 }}
          >
            TΨC环
          </motion.text>

          {/* CCA tail (bottom) */}
          <motion.line
            x1="0" y1="100"
            x2="0" y2="130"
            stroke="#00d4aa"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: progress }}
            transition={{ delay: 2.1, duration: 0.3 }}
          />
          <motion.text
            x="0" y="145"
            textAnchor="middle"
            fill="#00d4aa"
            fontSize="10"
            fontWeight="bold"
            initial={{ opacity: 0 }}
            animate={{ opacity: progress > 2.3 ? 1 : 0 }}
          >
            CCA 3'
          </motion.text>
        </g>

        {/* Labels */}
        <motion.text
          x="0" y="-90"
          textAnchor="middle"
          fill="#fff"
          fontSize="14"
          fontFamily="Orbitron"
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 0.5 ? 1 : 0 }}
        >
          氨基酸结合位点
        </motion.text>

        {/* Hydrogen bond indicators */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: progress > 2.5 ? 0.6 : 0 }}
        >
          <line x1="-35" y1="-50" x2="-25" y2="-50" stroke="#fff" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="-35" y1="-52" x2="-25" y2="-52" stroke="#fff" strokeWidth="1" strokeDasharray="2,2" />
          <line x1="-35" y1="-54" x2="-25" y2="-54" stroke="#fff" strokeWidth="1" strokeDasharray="2,2" />
        </motion.g>
      </svg>

      <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#00d4aa]" />
          <span className="text-gray-400">受体茎</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#7c3aed]" />
          <span className="text-gray-400">D环</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ef4444]" />
          <span className="text-gray-400">反密码子环</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#22c55e]" />
          <span className="text-gray-400">TΨC环</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#f59e0b]" />
          <span className="text-gray-400">可变环</span>
        </div>
      </div>
    </div>
  );
}
