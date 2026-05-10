import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FlaskConical, Play, RotateCcw, Dna, Atom, Loader2, Layers, Box } from 'lucide-react';

const DNA_HELIX_PARAMS = {
  basePairs: 20,
  radius: 5,
  height: 8,
  turns: 2,
  colors: {
    backbone1: '#00d4aa',
    backbone2: '#7c3aed',
    baseA: '#22c55e',
    baseT: '#ef4444',
    baseC: '#3b82f6',
    baseG: '#f59e0b',
  },
};

const generateHelixData = () => {
  const points1: [number, number, number][] = [];
  const points2: [number, number, number][] = [];
  const basePairLines: [number, number, number, number, number, number][] = [];
  const bases: { pos: [number, number, number]; type: string; strand: number }[] = [];

  const { basePairs, radius, height, turns } = DNA_HELIX_PARAMS;
  const totalHeight = basePairs * height;

  for (let i = 0; i < basePairs; i++) {
    const angle1 = (i / basePairs) * turns * Math.PI * 2;
    const angle2 = angle1 + Math.PI;
    const y = (i / basePairs) * totalHeight - totalHeight / 2;

    const x1 = Math.cos(angle1) * radius;
    const z1 = Math.sin(angle1) * radius;
    const x2 = Math.cos(angle2) * radius;
    const z2 = Math.sin(angle2) * radius;

    points1.push([x1, y, z1]);
    points2.push([x2, y, z2]);

    const midpoint = [(x1 + x2) / 2, y, (z1 + z2) / 2];
    basePairLines.push([x1, y, z1, x2, y, z2]);

    const baseTypes = ['A', 'T', 'C', 'G'];
    const base = baseTypes[Math.floor(Math.random() * 4)];
    bases.push({ pos: [midpoint[0] * 0.5, y, midpoint[2] * 0.5], type: base, strand: 1 });
    const complement = base === 'A' ? 'T' : base === 'T' ? 'A' : base === 'C' ? 'G' : 'C';
    bases.push({ pos: [-midpoint[0] * 0.5, y, -midpoint[2] * 0.5], type: complement, strand: 2 });
  }

  return { points1, points2, basePairLines, bases };
};

export default function TRNAVisualizer() {
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [isAnimating, setIsAnimating] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [is3dLoading, setIs3dLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  const { points1, points2, basePairLines, bases } = generateHelixData();

  const handlePlay = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 3500);
  };

  const handleReset = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 100);
    setTimeout(() => setIsAnimating(false), 3500);
  };

  useEffect(() => {
    if (viewMode === '3d' && canvasRef.current) {
      setIs3dLoading(true);
      const timer = setTimeout(() => setIs3dLoading(false), 500);
      return () => clearTimeout(timer);
    }
  }, [viewMode]);

  useEffect(() => {
    if (viewMode === '3d' && isAnimating) {
      const animate = () => {
        setRotation(prev => (prev + 1) % 360);
        animationRef.current = requestAnimationFrame(animate);
      };
      animationRef.current = requestAnimationFrame(animate);
    } else if (!isAnimating && viewMode === '3d') {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [viewMode, isAnimating]);

  const render3DModel = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;

    ctx.fillStyle = 'rgba(10, 14, 26, 0.3)';
    ctx.fillRect(0, 0, width, height);

    const scale = Math.min(width, height) / 25;
    const rotRad = (rotation * Math.PI) / 180;

    const project = (x: number, y: number, z: number) => {
      const cosR = Math.cos(rotRad);
      const sinR = Math.sin(rotRad);
      const xRot = x * cosR - z * sinR;
      const zRot = x * sinR + z * cosR;
      return {
        x: centerX + xRot * scale,
        y: centerY - y * scale + zRot * scale * 0.3,
        z: zRot,
      };
    };

    const strand1Points = points1.map(p => project(p[0], p[1], p[2]));
    const strand2Points = points2.map(p => project(p[0], p[1], p[2]));

    const allPoints: { x: number; y: number; z: number; color: string }[] = [];
    strand1Points.forEach((p) => allPoints.push({ ...p, color: DNA_HELIX_PARAMS.colors.backbone1 }));
    strand2Points.forEach((p) => allPoints.push({ ...p, color: DNA_HELIX_PARAMS.colors.backbone2 }));

    allPoints.sort((a, b) => a.z - b.z);

    ctx.lineWidth = 2;
    for (let i = 0; i < strand1Points.length - 1; i++) {
      const p1 = strand1Points[i];
      const p2 = strand1Points[i + 1];
      ctx.strokeStyle = DNA_HELIX_PARAMS.colors.backbone1;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    for (let i = 0; i < strand2Points.length - 1; i++) {
      const p1 = strand2Points[i];
      const p2 = strand2Points[i + 1];
      ctx.strokeStyle = DNA_HELIX_PARAMS.colors.backbone2;
      ctx.globalAlpha = 0.8;
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    ctx.globalAlpha = 0.6;
    for (const line of basePairLines) {
      const p1 = project(line[0], line[1], line[2]);
      const p2 = project(line[3], line[4], line[5]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
    for (const base of bases) {
      const projected = project(base.pos[0], base.pos[1], base.pos[2]);
      const colors: Record<string, string> = {
        A: DNA_HELIX_PARAMS.colors.baseA,
        T: DNA_HELIX_PARAMS.colors.baseT,
        C: DNA_HELIX_PARAMS.colors.baseC,
        G: DNA_HELIX_PARAMS.colors.baseG,
      };
      ctx.fillStyle = colors[base.type];
      ctx.beginPath();
      ctx.arc(projected.x, projected.y, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 8px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(base.type, projected.x, projected.y);
    }

    for (const p of strand1Points) {
      ctx.fillStyle = DNA_HELIX_PARAMS.colors.backbone1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    for (const p of strand2Points) {
      ctx.fillStyle = DNA_HELIX_PARAMS.colors.backbone2;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  };

  useEffect(() => {
    if (viewMode === '3d') {
      render3DModel();
    }
  }, [viewMode, rotation]);

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FlaskConical className="w-7 h-7 sm:w-8 sm:h-8 text-bio-cyan" />
          分子结构可视化
        </h1>
        <p className="text-gray-400">探索 tRNA 三叶草结构与 DNA 双螺旋</p>
      </motion.div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setViewMode('2d')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            viewMode === '2d'
              ? 'bg-bio-cyan/20 text-bio-cyan border border-bio-cyan/50'
              : 'bg-space-700/50 text-gray-400 hover:text-white'
          }`}
        >
          <Layers className="w-4 h-4" />
          2D tRNA 结构
        </button>
        <button
          onClick={() => setViewMode('3d')}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            viewMode === '3d'
              ? 'bg-bio-cyan/20 text-bio-cyan border border-bio-cyan/50'
              : 'bg-space-700/50 text-gray-400 hover:text-white'
          }`}
        >
          <Box className="w-4 h-4" />
          3D DNA 双螺旋
        </button>
      </div>

      <AnimatePresence mode="wait">
        {viewMode === '2d' ? (
          <motion.div key="2d" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="card">
              <h3 className="font-display text-lg font-semibold text-white mb-4 text-center">tRNA 三叶草结构</h3>
              <svg viewBox="-220 -200 440 420" className="w-full max-w-lg mx-auto" style={{ minHeight: '450px' }}>
                <defs>
                  <filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <g filter="url(#glow)">
                  <motion.text x="0" y="-175" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="Orbitron" initial={{ opacity: 0 }} animate={{ opacity: isAnimating || !isAnimating ? 1 : 0 }}>氨基酸 (AA)</motion.text>
                  <motion.text x="0" y="-160" textAnchor="middle" fill="#00d4aa" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: isAnimating || !isAnimating ? 1 : 0 }}>↓</motion.text>

                  <motion.line x1="-8" y1="-150" x2="-8" y2="-50" stroke="#00d4aa" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: isAnimating ? 0 : 1 }} transition={{ duration: 0.4 }} />
                  <motion.line x1="8" y1="-150" x2="8" y2="-50" stroke="#00d4aa" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: isAnimating ? 0 : 1 }} transition={{ duration: 0.4 }} />
                  <motion.text x="0" y="-45" textAnchor="middle" fill="#00d4aa" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: isAnimating || !isAnimating ? 1 : 0 }}>CCA 3'</motion.text>

                  <motion.ellipse cx="0" cy="-55" rx="60" ry="35" fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray="5,3" initial={{ pathLength: 0 }} animate={{ pathLength: isAnimating ? 0 : 1 }} transition={{ duration: 0.5 }} />
                  <motion.text x="0" y="-52" textAnchor="middle" fill="#7c3aed" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: isAnimating || !isAnimating ? 1 : 0 }}>D臂 (DHU环)</motion.text>

                  <motion.ellipse cx="0" cy="-105" rx="130" ry="40" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,3" initial={{ pathLength: 0 }} animate={{ pathLength: isAnimating ? 0 : 1 }} transition={{ duration: 0.5 }} />
                  <motion.text x="0" y="-100" textAnchor="middle" fill="#ef4444" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: isAnimating || !isAnimating ? 1 : 0 }}>反密码子环</motion.text>

                  <motion.ellipse cx="0" cy="-130" rx="100" ry="25" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="5,3" initial={{ pathLength: 0 }} animate={{ pathLength: isAnimating ? 0 : 1 }} transition={{ duration: 0.4 }} />
                  <motion.text x="0" y="-125" textAnchor="middle" fill="#22c55e" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: isAnimating || !isAnimating ? 1 : 0 }}>可变环</motion.text>

                  <motion.ellipse cx="0" cy="-175" rx="50" ry="18" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,3" initial={{ pathLength: 0 }} animate={{ pathLength: isAnimating ? 0 : 1 }} transition={{ duration: 0.4 }} />
                  <motion.text x="0" y="-170" textAnchor="middle" fill="#f59e0b" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: isAnimating || !isAnimating ? 1 : 0 }}>TΨC环</motion.text>
                </g>
              </svg>

              <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#00d4aa]" /><span className="text-gray-400">受体茎</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#7c3aed]" /><span className="text-gray-400">D臂</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ef4444]" /><span className="text-gray-400">反密码子</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22c55e]" /><span className="text-gray-400">可变环</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f59e0b]" /><span className="text-gray-400">TΨC环</span></div>
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <button onClick={handlePlay} disabled={isAnimating} className="btn-primary flex items-center gap-2 disabled:opacity-50">
                  {isAnimating ? <span className="animate-pulse">播放中...</span> : <><Play className="w-4 h-4" />播放动画</>}
                </button>
                <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
                  <RotateCcw className="w-4 h-4" />重播
                </button>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="3d" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                  <Dna className="w-5 h-5 text-bio-cyan" />
                  DNA 双螺旋结构
                </h3>
                <label className="flex items-center gap-2 text-sm text-gray-400">
                  <Atom className="w-4 h-4" />
                  <span>自动旋转</span>
                  <input
                    type="checkbox"
                    checked={isAnimating}
                    onChange={(e) => setIsAnimating(e.target.checked)}
                    className="w-4 h-4 accent-bio-cyan"
                  />
                </label>
              </div>

              <div className="relative bg-gradient-to-b from-space-900/50 to-space-800/30 rounded-xl overflow-hidden" style={{ minHeight: '400px' }}>
                {is3dLoading && (
                  <div className="absolute inset-0 flex items-center justify-center z-10">
                    <Loader2 className="w-8 h-8 text-bio-cyan animate-spin" />
                  </div>
                )}
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={400}
                  className="w-full h-full"
                />
              </div>

              <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#00d4aa]" /><span className="text-gray-400">5' 链骨架</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#7c3aed]" /><span className="text-gray-400">3' 链骨架</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22c55e]" /><span className="text-gray-400">腺嘌呤 (A)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ef4444]" /><span className="text-gray-400">胸腺嘧啶 (T)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#3b82f6]" /><span className="text-gray-400">胞嘧啶 (C)</span></div>
                <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f59e0b]" /><span className="text-gray-400">鸟嘌呤 (G)</span></div>
              </div>

              <div className="mt-4 p-4 bg-space-700/30 rounded-lg">
                <h4 className="text-white font-medium mb-2">DNA 双螺旋结构说明</h4>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• 两条反向平行的多核苷酸链围绕中心轴缠绕</li>
                  <li>• A 与 T 通过两个氢键配对，G 与 C 通过三个氢键配对</li>
                  <li>• 磷酸-脱氧核糖骨架位于外侧，碱基位于内侧</li>
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="mt-6 space-y-6">
        <div className="card">
          <h3 className="font-display text-lg font-semibold text-white mb-4">tRNA 结构组成</h3>
          <div className="space-y-4">
            <div className="p-4 bg-space-700/30 rounded-xl border-l-4 border-[#00d4aa]"><h4 className="text-white font-medium mb-1">受体茎</h4><p className="text-gray-400 text-sm">位于顶部，3' 端以 CCA 结尾，用于连接氨基酸</p></div>
            <div className="p-4 bg-space-700/30 rounded-xl border-l-4 border-[#7c3aed]"><h4 className="text-white font-medium mb-1">D 环</h4><p className="text-gray-400 text-sm">含有二氢尿嘧啶 (DHU)，参与氨酰-tRNA 合成酶的识别</p></div>
            <div className="p-4 bg-space-700/30 rounded-xl border-l-4 border-[#ef4444]"><h4 className="text-white font-medium mb-1">反密码子环</h4><p className="text-gray-400 text-sm">含有反密码子，与 mRNA 上的密码子互补配对</p></div>
            <div className="p-4 bg-space-700/30 rounded-xl border-l-4 border-[#22c55e]"><h4 className="text-white font-medium mb-1">TΨC 环</h4><p className="text-gray-400 text-sm">含有胸苷-假尿苷-胞苷序列，参与核糖体结合</p></div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
