import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, RotateCcw, Sparkles } from 'lucide-react';
import SequenceInput from '@/components/dna/SequenceInput';
import ComplementChain from '@/components/dna/ComplementChain';
import TranscriptionAnimation from '@/components/dna/TranscriptionAnimation';
import TranslationAnimation from '@/components/dna/TranslationAnimation';
import { cleanSequence } from '@/utils/sequence';
import { getComplement } from '@/utils/complement';
import { transcribe } from '@/utils/transcription';
import { translate } from '@/utils/translation';

export default function Analyzer() {
  const [input, setInput] = useState('');
  const [cleaned, setCleaned] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  const handleAnalyze = useCallback(() => {
    const seq = cleanSequence(input);
    if (seq.length === 0) return;
    setCleaned(seq);
    setShowResults(true);
    setAnimationKey(prev => prev + 1);
  }, [input]);

  const handleReset = useCallback(() => {
    setInput('');
    setCleaned('');
    setShowResults(false);
    setAnimationKey(prev => prev + 1);
  }, []);

  const complement = cleaned ? getComplement(cleaned) : '';
  const mrna = cleaned ? transcribe(cleaned) : '';
  const translation = mrna ? translate(mrna) : { aminoAcids: [], fullNames: [], protein: '', warnings: [] };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-bio-cyan" />
          DNA/RNA 分析器
        </h1>
        <p className="text-gray-400">
          输入 DNA 序列，分析互补链、进行转录和翻译
        </p>
      </motion.div>

      <div className="grid gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card"
        >
          <SequenceInput
            value={input}
            onChange={setInput}
            label="DNA 序列输入"
            placeholder="输入 DNA 序列，如 ATGGCTACGA..."
          />

          <div className="flex gap-4 mt-6">
            <button
              onClick={handleAnalyze}
              disabled={cleanSequence(input).length === 0}
              className="btn-primary flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              分析序列
            </button>
            <button
              onClick={handleReset}
              className="btn-secondary flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              重置
            </button>
          </div>
        </motion.div>

        {showResults && cleaned && (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card"
            >
              <h3 className="font-display text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-bio-cyan" />
                互补链生成
              </h3>
              <ComplementChain
                key={`complement-${animationKey}`}
                template={cleaned}
                coding={complement}
                showAnimation={true}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card"
            >
              <TranscriptionAnimation
                key={`transcription-${animationKey}`}
                dnaSequence={cleaned}
                mrnaSequence={mrna}
                showAnimation={true}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="card"
            >
              <TranslationAnimation
                key={`translation-${animationKey}`}
                mrnaSequence={mrna}
                aminoAcids={translation.aminoAcids}
                showAnimation={true}
              />

              {translation.warnings.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl"
                >
                  <p className="text-yellow-400 text-sm font-medium mb-1">注意</p>
                  {translation.warnings.map((warning, i) => (
                    <p key={i} className="text-yellow-300/80 text-xs">{warning}</p>
                  ))}
                </motion.div>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="card bg-space-800/80"
            >
              <h3 className="font-display text-lg font-semibold text-white mb-4">蛋白质序列</h3>
              <div className="p-4 bg-space-900/50 rounded-xl font-mono text-lg text-center">
                {translation.protein || '无有效翻译结果'}
              </div>
              <p className="text-gray-500 text-sm mt-4 text-center">
                共 {translation.aminoAcids.length} 个氨基酸
              </p>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
