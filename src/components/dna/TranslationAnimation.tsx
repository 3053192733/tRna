import { motion } from 'framer-motion';

interface TranslationAnimationProps {
  mrnaSequence: string;
  aminoAcids: string[];
  showAnimation?: boolean;
}

const AMINO_ACID_COLORS: Record<string, string> = {
  A: '#22c55e', R: '#3b82f6', N: '#8b5cf6', D: '#f59e0b',
  C: '#10b981', E: '#f97316', Q: '#6366f1', G: '#ec4899',
  H: '#14b8a6', I: '#84cc16', L: '#06b6d4', K: '#7c3aed',
  M: '#f43f5e', F: '#a855f7', P: '#0ea5e9', S: '#eab308',
  T: '#d946ef', W: '#64748b', Y: '#f472b6', V: '#2dd4bf',
  '*': '#ef4444', '?': '#6b7280',
};

export default function TranslationAnimation({
  mrnaSequence,
  aminoAcids,
  showAnimation = true,
}: TranslationAnimationProps) {
  const codonGroups = [];
  for (let i = 0; i < mrnaSequence.length - 2; i += 3) {
    codonGroups.push(mrnaSequence.slice(i, i + 3));
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h4 className="text-sm font-medium text-bio-purple mb-1">mRNA 翻译为蛋白质</h4>
        <p className="text-xs text-gray-500">
          每 3 个核苷酸 = 1 个氨基酸
        </p>
      </div>

      <div className="relative overflow-hidden rounded-2xl bg-space-700/30 p-4">
        <div className="flex items-center gap-2 mb-4">
          <div className="px-2 py-1 bg-bio-cyan/20 text-bio-cyan text-xs rounded">
            mRNA
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-bio-cyan via-bio-purple to-bio-cyan opacity-50" />
          <div className="px-2 py-1 bg-bio-purple/20 text-bio-purple text-xs rounded">
            蛋白质
          </div>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <div className="flex flex-wrap gap-1 font-mono text-xs">
              {codonGroups.map((codon, index) => (
                <motion.div
                  key={`codon-${index}`}
                  initial={showAnimation ? { opacity: 0, x: -20 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: showAnimation ? index * 0.15 : 0 }}
                  className="relative group"
                >
                  <div className="flex gap-0.5">
                    {codon.split('').map((base, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center justify-center w-5 h-5 rounded bg-white/5"
                      >
                        {base}
                      </span>
                    ))}
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-bio-purple group-hover:bg-bio-cyan transition-colors" />
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.3, delay: showAnimation ? codonGroups.length * 0.15 : 0 }}
            className="h-6 flex items-center justify-center"
          >
            <svg width="20" height="24" viewBox="0 0 20 24" className="text-bio-purple">
              <path
                d="M10 0 L10 24 M5 18 L10 24 L15 18 M5 12 L10 18 L15 12"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
              />
            </svg>
          </motion.div>

          <div className="flex flex-wrap gap-2">
            {aminoAcids.map((aa, index) => (
              <motion.div
                key={`aa-${index}`}
                initial={showAnimation ? { opacity: 0, scale: 0, y: 20 } : false}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: showAnimation ? codonGroups.length * 0.15 + 0.3 + index * 0.1 : 0 }}
                className="relative group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center font-mono font-bold text-sm transition-transform group-hover:scale-110"
                  style={{
                    color: '#fff',
                    backgroundColor: `${AMINO_ACID_COLORS[aa] || '#6b7280'}40`,
                    border: `2px solid ${AMINO_ACID_COLORS[aa] || '#6b7280'}`,
                  }}
                >
                  {aa}
                </div>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-400 whitespace-nowrap">
                  {index + 1}
                </div>
              </motion.div>
            ))}
            {aminoAcids.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: showAnimation ? codonGroups.length * 0.15 + 0.3 + aminoAcids.length * 0.1 : 0 }}
                className="flex items-center text-gray-500 text-sm ml-2"
              >
                <span className="font-mono">({aminoAcids.length} 个氨基酸)</span>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
