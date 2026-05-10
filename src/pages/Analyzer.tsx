import { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Trash2, Copy, Check } from 'lucide-react';
import { cleanSequence } from '@/utils/sequence';
import { getComplement } from '@/utils/complement';
import { transcribe } from '@/utils/transcription';
import { translate } from '@/utils/translation';

const NUCLEOTIDE_COLORS: Record<string, string> = {
  A: '#ef4444', T: '#3b82f6', G: '#22c55e', C: '#3b82f6', U: '#f59e0b',
};

const AMINO_ACID_COLORS: Record<string, string> = {
  A: '#22c55e', R: '#3b82f6', N: '#8b5cf6', D: '#f59e0b',
  C: '#10b981', E: '#f97316', Q: '#6366f1', G: '#ec4899',
  H: '#14b8a6', I: '#84cc16', L: '#06b6d4', K: '#7c3aed',
  M: '#f43f5e', F: '#a855f7', P: '#0ea5e9', S: '#eab308',
  T: '#d946ef', W: '#64748b', Y: '#f472b6', V: '#2dd4bf',
  '*': '#ef4444',
};

export default function Analyzer() {
  const [input, setInput] = useState('');
  const [copied, setCopied] = useState(false);
  const animationRef = useRef<{ complement: number; mrna: number; protein: number }>({ complement: 0, mrna: 0, protein: 0 });
  const rafRef = useRef<number>();

  const cleaned = cleanSequence(input);
  const complement = getComplement(cleaned);
  const mrna = transcribe(cleaned);
  const translation = mrna ? translate(mrna) : { aminoAcids: [], fullNames: [], protein: '', warnings: [] };

  const animateSequence = useCallback(() => {
    const targetComplement = complement.length;
    const targetMrna = mrna.length;
    const targetProtein = translation.aminoAcids.length;

    const animate = () => {
      const speed = 2;

      if (animationRef.current.complement < targetComplement) {
        animationRef.current.complement = Math.min(animationRef.current.complement + speed, targetComplement);
      }
      if (animationRef.current.mrna < targetMrna) {
        animationRef.current.mrna = Math.min(animationRef.current.mrna + speed, targetMrna);
      }
      if (animationRef.current.protein < targetProtein) {
        animationRef.current.protein = Math.min(animationRef.current.protein + speed * 0.3, targetProtein);
      }

      if (animationRef.current.complement < targetComplement ||
          animationRef.current.mrna < targetMrna ||
          animationRef.current.protein < targetProtein) {
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);
  }, [complement.length, mrna.length, translation.aminoAcids.length]);

  useEffect(() => {
    animationRef.current = { complement: 0, mrna: 0, protein: 0 };
    if (cleaned.length > 0) {
      animateSequence();
    }
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [cleaned, animateSequence]);

  const handleCopy = () => {
    navigator.clipboard.writeText(translation.protein);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInput('');
    animationRef.current = { complement: 0, mrna: 0, protein: 0 };
  };

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Sparkles className="w-8 h-8 text-bio-cyan" />
          DNA/RNA 分析器
        </h1>
        <p className="text-gray-400">输入 DNA 序列，实时查看互补链、转录和翻译过程</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card mb-8">
        <div className="flex items-center justify-between mb-4">
          <label className="text-sm font-medium text-gray-300 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-bio-cyan animate-pulse" />
            DNA 序列输入
          </label>
          {cleaned.length > 0 && (
            <button onClick={handleClear} className="text-gray-400 hover:text-white transition-colors flex items-center gap-1 text-sm">
              <Trash2 className="w-4 h-4" /> 清空
            </button>
          )}
        </div>

        <div className="relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="输入或粘贴 DNA 序列，如 ATGGCTACGAATTCCG..."
            className="input-bio min-h-[100px] resize-none font-mono text-lg tracking-wider"
            spellCheck={false}
          />
          <div className="absolute bottom-3 right-3 flex gap-3">
            <span className="text-xs text-gray-500 font-mono">{cleaned.length} bp</span>
            {cleaned.length > 0 && (
              <span className="text-xs text-bio-cyan font-medium animate-pulse">
                构建中...
              </span>
            )}
          </div>
        </div>

        {cleaned.length > 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-4 bg-space-700/30 rounded-xl border border-bio-cyan/20">
            <div className="text-xs text-gray-500 mb-2">输入序列</div>
            <div className="flex flex-wrap gap-1">
              {cleaned.split('').map((base, i) => (
                <motion.span
                  key={i}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.02, type: 'spring', stiffness: 500, damping: 20 }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm"
                  style={{ color: NUCLEOTIDE_COLORS[base], backgroundColor: `${NUCLEOTIDE_COLORS[base]}20`, border: `1px solid ${NUCLEOTIDE_COLORS[base]}50` }}
                >
                  {base}
                </motion.span>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>

      {cleaned.length >= 3 && (
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-bio-cyan to-bio-purple" />
                互补链构建
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-space-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-bio-cyan to-bio-purple"
                    animate={{ width: `${(animationRef.current.complement / Math.max(complement.length, 1)) * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-xs text-gray-500">{Math.round((animationRef.current.complement / Math.max(complement.length, 1)) * 100)}%</span>
              </div>
            </div>

            <div className="relative py-4">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">模板链</div>
                  <div className="flex flex-wrap justify-center gap-1 max-w-xl">
                    {cleaned.split('').map((base, i) => (
                      <motion.span
                        key={`template-${i}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: i * 0.02 }}
                        className="w-7 h-7 rounded flex items-center justify-center font-mono text-xs font-bold"
                        style={{ color: NUCLEOTIDE_COLORS[base], backgroundColor: `${NUCLEOTIDE_COLORS[base]}20` }}
                      >
                        {base}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </div>

              <motion.div
                className="flex justify-center my-4"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="h-0.5 w-full max-w-xl bg-gradient-to-r from-transparent via-bio-cyan to-transparent" />
              </motion.div>

              <div className="flex items-center justify-center gap-4">
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-2">互补链</div>
                  <div className="flex flex-wrap justify-center gap-1 max-w-xl">
                    {complement.split('').map((base, i) => {
                      const isAnimated = i < Math.floor(animationRef.current.complement);
                      return (
                        <motion.span
                          key={`comp-${i}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={isAnimated ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="w-7 h-7 rounded flex items-center justify-center font-mono text-xs font-bold"
                          style={{ color: NUCLEOTIDE_COLORS[base], backgroundColor: `${NUCLEOTIDE_COLORS[base]}20`, border: isAnimated ? `1px solid ${NUCLEOTIDE_COLORS[base]}50` : '1px dashed transparent' }}
                        >
                          {base}
                        </motion.span>
                      );
                    })}
                  </div>
                </div>
              </div>

              <motion.div
                className="absolute inset-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: animationRef.current.complement < complement.length ? 1 : 0 }}
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-bio-cyan/10 rounded-full blur-2xl animate-pulse" />
              </motion.div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-bio-purple to-pink-400" />
                转录为 mRNA
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-space-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-bio-purple to-pink-400"
                    animate={{ width: `${(animationRef.current.mrna / Math.max(mrna.length, 1)) * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-xs text-gray-500">{Math.round((animationRef.current.mrna / Math.max(mrna.length, 1)) * 100)}%</span>
              </div>
            </div>

            <div className="relative py-4 overflow-hidden rounded-xl bg-space-900/50 p-4">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bio-cyan via-bio-purple to-pink-400 opacity-50" />

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 bg-bio-cyan/20 text-bio-cyan text-xs rounded font-medium">DNA</span>
                  <div className="flex-1 flex flex-wrap gap-0.5">
                    {cleaned.split('').map((base, i) => (
                      <motion.span
                        key={`dna-${i}`}
                        initial={{ y: 0 }}
                        animate={i < Math.floor(animationRef.current.mrna) ? { y: -10, opacity: 0.5 } : { y: 0, opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="w-6 h-6 rounded flex items-center justify-center font-mono text-xs"
                        style={{ backgroundColor: `${NUCLEOTIDE_COLORS[base]}30` }}
                      >
                        <span style={{ color: NUCLEOTIDE_COLORS[base] }}>{base}</span>
                      </motion.span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-center">
                  <motion.div
                    animate={{ y: [0, -5, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-bio-purple"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-label="转录箭头">
                      <path d="M12 4l-8 8h6v8h4v-8h6z" />
                    </svg>
                  </motion.div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 bg-bio-purple/20 text-bio-purple text-xs rounded font-medium">mRNA</span>
                  <div className="flex-1 flex flex-wrap gap-0.5">
                    {mrna.split('').map((base, i) => {
                      const isAnimated = i < Math.floor(animationRef.current.mrna);
                      return (
                        <motion.span
                          key={`mrna-${i}`}
                          initial={{ y: 20, opacity: 0 }}
                          animate={isAnimated ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="w-6 h-6 rounded flex items-center justify-center font-mono text-xs"
                          style={{ backgroundColor: isAnimated ? `${NUCLEOTIDE_COLORS[base]}30` : 'transparent' }}
                        >
                          <span style={{ color: NUCLEOTIDE_COLORS[base] }}>{isAnimated ? base : ''}</span>
                        </motion.span>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500 flex items-center gap-4">
              <span>转录规则：A → U, T → A, G → C, C → G</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="card mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-white flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500" />
                翻译为蛋白质
              </h3>
              <div className="flex items-center gap-2">
                <div className="w-24 h-1.5 bg-space-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
                    animate={{ width: `${(animationRef.current.protein / Math.max(translation.aminoAcids.length, 1)) * 100}%` }}
                    transition={{ duration: 0.1 }}
                  />
                </div>
                <span className="text-xs text-gray-500">{Math.round((animationRef.current.protein / Math.max(translation.aminoAcids.length, 1)) * 100)}%</span>
              </div>
            </div>

            <div className="relative py-4 overflow-hidden rounded-xl bg-space-900/50 p-4">
              <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-yellow-500/10 to-transparent" />

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 bg-bio-purple/20 text-bio-purple text-xs rounded font-medium">mRNA 密码子</span>
                  <div className="flex-1 flex flex-wrap gap-1">
                    {Array.from({ length: Math.ceil(mrna.length / 3) }).map((_, i) => {
                      const codon = mrna.slice(i * 3, i * 3 + 3);
                      const isAnimated = i < Math.floor(animationRef.current.protein);
                      return (
                        <motion.div
                          key={`codon-${i}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={isAnimated ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                          transition={{ duration: 0.2, delay: i * 0.05 }}
                          className="flex gap-0.5 px-2 py-1 rounded-lg"
                          style={{ backgroundColor: isAnimated ? 'rgba(124,58,237,0.2)' : 'transparent' }}
                        >
                          {codon.split('').map((base, j) => (
                            <span key={j} className="font-mono text-xs" style={{ color: NUCLEOTIDE_COLORS[base] }}>
                              {base}
                            </span>
                          ))}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center">
                  <motion.div
                    className="px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <span className="text-yellow-400 text-sm">核糖体</span>
                  </motion.div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="px-2 py-1 bg-yellow-400/20 text-yellow-400 text-xs rounded font-medium">氨基酸</span>
                  <div className="flex-1 flex flex-wrap gap-2">
                    {translation.aminoAcids.map((aa, i) => {
                      const isAnimated = i < Math.floor(animationRef.current.protein);
                      return (
                        <motion.div
                          key={`aa-${i}`}
                          initial={{ scale: 0, y: 20 }}
                          animate={isAnimated ? { scale: 1, y: 0 } : { scale: 0, y: 20 }}
                          transition={{ duration: 0.3, type: 'spring', stiffness: 300 }}
                          className="relative group"
                        >
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-transform group-hover:scale-110"
                            style={{
                              backgroundColor: `${AMINO_ACID_COLORS[aa] || '#6b7280'}30`,
                              border: `2px solid ${AMINO_ACID_COLORS[aa] || '#6b7280'}`,
                              color: '#fff',
                            }}
                          >
                            {aa}
                          </div>
                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-space-700 text-xs px-2 py-1 rounded whitespace-nowrap">
                            {translation.fullNames[i]}
                          </div>

                          {i < translation.aminoAcids.length - 1 && aa !== '*' && (
                            <motion.div
                              initial={{ scaleX: 0 }}
                              animate={isAnimated ? { scaleX: 1 } : { scaleX: 0 }}
                              transition={{ duration: 0.2, delay: 0.1 }}
                              className="absolute -right-3 top-1/2 -translate-y-1/2 w-2 h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"
                            />
                          )}
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">
              每 3 个核苷酸翻译为 1 个氨基酸
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="card bg-gradient-to-br from-yellow-500/5 to-orange-500/5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-white">蛋白质序列</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-space-700/50 text-gray-400 hover:text-white transition-colors text-sm"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                {copied ? '已复制' : '复制'}
              </button>
            </div>

            <div className="p-4 bg-space-900/50 rounded-xl">
              <div className="font-mono text-xl text-center tracking-widest">
                {translation.protein || '---'}
              </div>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-space-700/30 rounded-lg">
                <div className="text-2xl font-display font-bold text-bio-cyan">{cleaned.length}</div>
                <div className="text-xs text-gray-500">核苷酸</div>
              </div>
              <div className="p-3 bg-space-700/30 rounded-lg">
                <div className="text-2xl font-display font-bold text-bio-purple">{Math.ceil(cleaned.length / 3)}</div>
                <div className="text-xs text-gray-500">密码子</div>
              </div>
              <div className="p-3 bg-space-700/30 rounded-lg">
                <div className="text-2xl font-display font-bold text-yellow-400">{translation.aminoAcids.filter(a => a !== '*').length}</div>
                <div className="text-xs text-gray-500">氨基酸</div>
              </div>
            </div>

            {translation.warnings.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-400 text-sm font-medium mb-1">注意</p>
                {translation.warnings.map((warning, i) => (
                  <p key={i} className="text-yellow-300/80 text-xs">{warning}</p>
                ))}
              </div>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
