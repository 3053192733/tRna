import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import $3Dmol from '3dmol';

interface TRNAStructureProps {
  animating: boolean;
}

export default function TRNAStructure({ animating }: TRNAStructureProps) {
  const [progress, setProgress] = useState(0);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [isSpinning, setIsSpinning] = useState(true);
  const animationRef = useRef<number>();
  const viewer3DRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);

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

  useEffect(() => {
    if (viewMode === '3d' && viewer3DRef.current && !viewerInstanceRef.current) {
      const viewer = $3Dmol.createViewer(viewer3DRef.current, { backgroundColor: 'rgba(10, 14, 26, 0.5)' });
      viewerInstanceRef.current = viewer;
      $3Dmol.download('pdb:1EHZ', viewer, {}, () => {
        viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
        viewer.zoomTo();
        viewer.render();
        if (isSpinning) viewer.spin('y', 0.5);
      });
    }
    return () => {
      if (viewerInstanceRef.current && viewMode === '2d') {
        viewerInstanceRef.current.clear();
        viewerInstanceRef.current = null;
      }
    };
  }, [viewMode]);

  const toggleSpin = () => {
    if (viewerInstanceRef.current) {
      if (isSpinning) {
        viewerInstanceRef.current.spin(false);
        setIsSpinning(false);
      } else {
        viewerInstanceRef.current.spin('y', 0.5);
        setIsSpinning(true);
      }
    }
  };

  const changeViewStyle = (style: 'cartoon' | 'stick' | 'sphere') => {
    if (viewerInstanceRef.current) {
      if (style === 'cartoon') {
        viewerInstanceRef.current.setStyle({}, { cartoon: { color: 'spectrum' } });
      } else if (style === 'stick') {
        viewerInstanceRef.current.setStyle({}, { stick: { colorscheme: 'Jmol' } });
      } else {
        viewerInstanceRef.current.setStyle({}, { sphere: { colorscheme: 'Jmol' } });
      }
      viewerInstanceRef.current.render();
    }
  };

  const stemProgress = (delay: number, dur: number) => ({ delay, duration: dur });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={() => setViewMode('2d')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            viewMode === '2d' ? 'bg-bio-cyan/20 text-bio-cyan border border-bio-cyan/50' : 'bg-space-700/50 text-gray-400 hover:text-white'
          }`}
        >
          2D 结构图
        </button>
        <button
          onClick={() => setViewMode('3d')}
          className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
            viewMode === '3d' ? 'bg-bio-cyan/20 text-bio-cyan border border-bio-cyan/50' : 'bg-space-700/50 text-gray-400 hover:text-white'
          }`}
        >
          3D 真实模型
        </button>
      </div>

      <div className="card">
        {viewMode === '2d' ? (
          <>
            <h3 className="font-display text-lg font-semibold text-white mb-4 text-center">tRNA 三叶草结构</h3>
            <svg viewBox="-220 -200 440 420" className="w-full max-w-lg mx-auto" style={{ minHeight: '450px' }}>
              <defs>
                <filter id="glow"><feGaussianBlur stdDeviation="2" result="coloredBlur" /><feMerge><feMergeNode in="coloredBlur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
              <g filter="url(#glow)">
                <motion.text x="0" y="-175" textAnchor="middle" fill="#fff" fontSize="11" fontFamily="Orbitron" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.02 ? 1 : 0 }}>氨基酸 (AA)</motion.text>
                <motion.text x="0" y="-160" textAnchor="middle" fill="#00d4aa" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.05 ? 1 : 0 }}>↓</motion.text>

                <motion.line x1="-8" y1="-150" x2="-8" y2="-50" stroke="#00d4aa" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.1, 0.4)} />
                <motion.line x1="8" y1="-150" x2="8" y2="-50" stroke="#00d4aa" strokeWidth="3" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.1, 0.4)} />
                <motion.text x="0" y="-45" textAnchor="middle" fill="#00d4aa" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.15 ? 1 : 0 }}>CCA 3'</motion.text>

                <motion.ellipse cx="0" cy="-55" rx="60" ry="35" fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray="5,3" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.2, 0.5)} />
                <motion.text x="0" y="-52" textAnchor="middle" fill="#7c3aed" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.6 ? 1 : 0 }}>D臂 (DHU环)</motion.text>

                <motion.ellipse cx="0" cy="-105" rx="130" ry="40" fill="none" stroke="#ef4444" strokeWidth="3" strokeDasharray="5,3" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.4, 0.5)} />
                <motion.text x="0" y="-100" textAnchor="middle" fill="#ef4444" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.8 ? 1 : 0 }}>反密码子环</motion.text>

                <motion.ellipse cx="0" cy="-130" rx="100" ry="25" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="5,3" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.6, 0.4)} />
                <motion.text x="0" y="-125" textAnchor="middle" fill="#22c55e" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 0.9 ? 1 : 0 }}>可变环</motion.text>

                <motion.ellipse cx="0" cy="-175" rx="50" ry="18" fill="none" stroke="#f59e0b" strokeWidth="3" strokeDasharray="5,3" initial={{ pathLength: 0 }} animate={{ pathLength: progress }} transition={stemProgress(0.8, 0.4)} />
                <motion.text x="0" y="-170" textAnchor="middle" fill="#f59e0b" fontSize="10" initial={{ opacity: 0 }} animate={{ opacity: progress > 1.1 ? 1 : 0 }}>TΨC环</motion.text>
              </g>
            </svg>

            <div className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#00d4aa]" /><span className="text-gray-400">受体茎</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#7c3aed]" /><span className="text-gray-400">D臂</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#ef4444]" /><span className="text-gray-400">反密码子</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#22c55e]" /><span className="text-gray-400">可变环</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#f59e0b]" /><span className="text-gray-400">TΨC环</span></div>
            </div>
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-white">tRNA 真实3D结构</h3>
              <div className="flex items-center gap-2">
                <div className="flex bg-space-700/50 rounded-lg p-1">
                  {(['cartoon', 'stick', 'sphere'] as const).map((style) => (
                    <button
                      key={style}
                      onClick={() => changeViewStyle(style)}
                      className={`px-2 py-0.5 rounded text-xs transition-colors ${
                        style === 'cartoon' && viewMode === '3d' ? 'bg-bio-cyan/20 text-bio-cyan' : 'text-gray-400 hover:text-white'
                      }`}
                    >
                      {style === 'cartoon' ? '带状' : style === 'stick' ? '棍状' : '球状'}
                    </button>
                  ))}
                </div>
                <button
                  onClick={toggleSpin}
                  className={`px-2 py-0.5 rounded text-xs transition-colors ${
                    isSpinning ? 'bg-red-500/20 text-red-400' : 'bg-space-700/50 text-gray-400 hover:text-white'
                  }`}
                >
                  {isSpinning ? '停止' : '旋转'}
                </button>
              </div>
            </div>

            <div className="relative bg-gradient-to-b from-space-900/50 to-space-800/30 rounded-xl overflow-hidden" style={{ height: '400px' }}>
              <div ref={viewer3DRef} className="w-full h-full" />
            </div>

            <div className="mt-4 p-3 bg-space-700/30 rounded-lg">
              <p className="text-xs text-gray-400 text-center">
                数据来源：RCSB PDB (1EHZ) - 酿酒酵母苯丙氨酸tRNA晶体结构
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
