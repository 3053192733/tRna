import { useState } from 'react';
import { motion } from 'framer-motion';
import { FlaskConical, Play, Pause, RotateCcw, Info } from 'lucide-react';
import TRNAStructure from '@/components/calculator/TRNAStructure';

export default function TRNAVisualizer() {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

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
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <FlaskConical className="w-8 h-8 text-bio-cyan" />
          tRNA 可视化器
        </h1>
        <p className="text-gray-400">
          探索 tRNA（转运RNA）的三叶草二级结构
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr,400px] gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <TRNAStructure animating={isAnimating} />

          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={handlePlay}
              disabled={isAnimating}
              className="btn-primary flex items-center gap-2 disabled:opacity-50"
            >
              {isAnimating ? (
                <Pause className="w-4 h-4 animate-pulse" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isAnimating ? '播放中...' : '播放动画'}
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              重播
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-white">结构组成</h3>
              <button
                onClick={() => setShowInfo(!showInfo)}
                className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
              >
                <Info className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-space-700/30 rounded-xl border-l-4 border-[#00d4aa]">
                <h4 className="text-white font-medium mb-1">受体茎 (Acceptor Stem)</h4>
                <p className="text-gray-400 text-sm">
                  位于顶部，5' 和 3' 端配对形成，3' 端以 CCA 结尾，用于连接氨基酸
                </p>
              </div>

              <div className="p-4 bg-space-700/30 rounded-xl border-l-4 border-[#7c3aed]">
                <h4 className="text-white font-medium mb-1">D 环 (D Loop)</h4>
                <p className="text-gray-400 text-sm">
                  含有二氢尿嘧啶 (DHU)，参与氨酰-tRNA 合成酶的识别
                </p>
              </div>

              <div className="p-4 bg-space-700/30 rounded-xl border-l-4 border-[#ef4444]">
                <h4 className="text-white font-medium mb-1">反密码子环 (Anticodon Loop)</h4>
                <p className="text-gray-400 text-sm">
                  含有反密码子（通常为 3 个核苷酸），与 mRNA 上的密码子互补配对
                </p>
              </div>

              <div className="p-4 bg-space-700/30 rounded-xl border-l-4 border-[#22c55e]">
                <h4 className="text-white font-medium mb-1">TΨC 环 (TΨC Loop)</h4>
                <p className="text-gray-400 text-sm">
                  含有胸苷-假尿苷-胞苷序列，参与核糖体结合
                </p>
              </div>

              <div className="p-4 bg-space-700/30 rounded-xl border-l-4 border-[#f59e0b]">
                <h4 className="text-white font-medium mb-1">可变环 (Variable Loop)</h4>
                <p className="text-gray-400 text-sm">
                  长度可变，在不同 tRNA 中大小不同
                </p>
              </div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-bio-cyan/10 to-bio-purple/10">
            <h3 className="font-display text-lg font-semibold text-white mb-4">tRNA 功能</h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-bio-cyan/20 text-bio-cyan flex items-center justify-center text-xs font-bold flex-shrink-0">
                  1
                </span>
                <span>识别并转运特定的氨基酸到核糖体</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-bio-purple/20 text-bio-purple flex items-center justify-center text-xs font-bold flex-shrink-0">
                  2
                </span>
                <span>通过反密码子与 mRNA 上的密码子互补配对</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-yellow-400/20 text-yellow-400 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  3
                </span>
                <span>参与蛋白质合成的翻译过程</span>
              </li>
            </ul>
          </div>

          <div className="card">
            <h3 className="font-display text-sm font-semibold text-white mb-3">碱基配对规则</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs">G</span>
                <span className="text-gray-400">≡</span>
                <span className="w-6 h-6 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xs">C</span>
                <span className="text-gray-500 text-xs">(3 个氢键)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded bg-red-500/20 text-red-400 flex items-center justify-center font-bold text-xs">G</span>
                <span className="text-gray-400">=</span>
                <span className="w-6 h-6 rounded bg-yellow-500/20 text-yellow-400 flex items-center justify-center font-bold text-xs">U</span>
                <span className="text-gray-500 text-xs">(2 个氢键)</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
