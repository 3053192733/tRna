import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Play, RotateCcw } from 'lucide-react';
import TRNAStructure from '@/components/calculator/TRNAStructure';

export default function TRNAVisualizer() {
  const [isAnimating, setIsAnimating] = useState(false);

  const handlePlay = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 3500);
  };

  const handleReset = () => {
    setIsAnimating(false);
    setTimeout(() => setIsAnimating(true), 100);
    setTimeout(() => setIsAnimating(false), 3500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 py-6 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="font-display text-2xl sm:text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FlaskConical className="w-7 h-7 sm:w-8 sm:h-8 text-bio-cyan" />
          tRNA 可视化器
        </h1>
        <p className="text-gray-400">探索 tRNA（转运RNA）的三叶草二级结构与真实3D模型</p>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr,350px] gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <TRNAStructure animating={isAnimating} />
          <div className="mt-6 flex justify-center gap-4">
            <button onClick={handlePlay} disabled={isAnimating} className="btn-primary flex items-center gap-2 disabled:opacity-50">
              {isAnimating ? <span className="animate-pulse">播放中...</span> : <><Play className="w-4 h-4" />播放动画</>}
            </button>
            <button onClick={handleReset} className="btn-secondary flex items-center gap-2">
              <RotateCcw className="w-4 h-4" />重播
            </button>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-4">
          <div className="card">
            <h3 className="font-display text-lg font-semibold text-white mb-4">结构组成</h3>
            <div className="space-y-3">
              <div className="p-3 bg-space-700/30 rounded-xl border-l-4 border-[#00d4aa]">
                <h4 className="text-white font-medium mb-1 text-sm">受体茎</h4>
                <p className="text-gray-400 text-xs">位于顶部，3' 端以 CCA 结尾，用于连接氨基酸</p>
              </div>
              <div className="p-3 bg-space-700/30 rounded-xl border-l-4 border-[#7c3aed]">
                <h4 className="text-white font-medium mb-1 text-sm">D 环</h4>
                <p className="text-gray-400 text-xs">含有二氢尿嘧啶 (DHU)，参与氨酰-tRNA 合成酶的识别</p>
              </div>
              <div className="p-3 bg-space-700/30 rounded-xl border-l-4 border-[#ef4444]">
                <h4 className="text-white font-medium mb-1 text-sm">反密码子环</h4>
                <p className="text-gray-400 text-xs">含有反密码子，与 mRNA 上的密码子互补配对</p>
              </div>
              <div className="p-3 bg-space-700/30 rounded-xl border-l-4 border-[#22c55e]">
                <h4 className="text-white font-medium mb-1 text-sm">TΨC 环</h4>
                <p className="text-gray-400 text-xs">含有胸苷-假尿苷-胞苷序列，参与核糖体结合</p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-bio-cyan/10 to-bio-purple/10">
            <h3 className="font-display text-lg font-semibold text-white mb-4">tRNA 功能</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-bio-cyan/20 text-bio-cyan flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                <span>识别并转运特定的氨基酸到核糖体</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-bio-purple/20 text-bio-purple flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                <span>通过反密码子与 mRNA 上的密码子互补配对</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                <span>参与蛋白质合成的翻译过程</span>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
