import { motion } from 'framer-motion';
import { NUCLEOTIDE_COLORS } from '@/utils/sequence';

interface TranscriptionAnimationProps {
  dnaSequence: string;
  mrnaSequence: string;
  showAnimation?: boolean;
}

export default function TranscriptionAnimation({
  dnaSequence,
  mrnaSequence,
  showAnimation = true,
}: TranscriptionAnimationProps) {
  const dnaBases = dnaSequence.split('');
  const mrnaBases = mrnaSequence.split('');

  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <h4 className="text-sm font-medium text-bio-cyan mb-1">DNA 转录为 mRNA</h4>
        <p className="text-xs text-gray-500">
          A → U, T → A, G → C, C → G
        </p>
      </div>

      <div className="relative">
        <div className="space-y-4">
          <div>
            <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-bio-cyan/20 text-bio-cyan rounded text-xs">
                DNA
              </span>
              <span>5'</span>
            </div>
            <div className="flex flex-wrap gap-1 font-mono text-sm">
              {dnaBases.map((base, index) => (
                <motion.span
                  key={`dna-${index}`}
                  initial={showAnimation ? { opacity: 0, scale: 0 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: showAnimation ? index * 0.03 : 0 }}
                  className="inline-flex items-center justify-center w-7 h-7 text-xs rounded"
                  style={{
                    color: NUCLEOTIDE_COLORS[base] || '#fff',
                    backgroundColor: `${NUCLEOTIDE_COLORS[base]}20`,
                  }}
                >
                  {base}
                </motion.span>
              ))}
              <span className="text-xs text-gray-500 self-center ml-1">3'</span>
            </div>
          </div>

          <motion.div
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.5, delay: showAnimation ? dnaBases.length * 0.03 : 0 }}
            className="flex justify-center"
          >
            <svg width="40" height="60" viewBox="0 0 40 60">
              <path
                d="M20 0 L20 60 M15 10 L20 5 L25 10 M15 25 L20 20 L25 25 M15 40 L20 35 L25 40 M15 55 L20 50 L25 55"
                stroke="url(#arrowGradient)"
                strokeWidth="2"
                fill="none"
                markerEnd="url(#arrowhead)"
              />
              <defs>
                <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00d4aa" />
                  <stop offset="100%" stopColor="#7c3aed" />
                </linearGradient>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#7c3aed" />
                </marker>
              </defs>
            </svg>
          </motion.div>

          <div>
            <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
              <span className="px-2 py-0.5 bg-bio-purple/20 text-bio-purple rounded text-xs">
                mRNA
              </span>
              <span>5'</span>
            </div>
            <div className="flex flex-wrap gap-1 font-mono text-sm">
              {mrnaBases.map((base, index) => (
                <motion.span
                  key={`mrna-${index}`}
                  initial={showAnimation ? { opacity: 0, scale: 0 } : false}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: showAnimation ? dnaBases.length * 0.03 + 0.3 + index * 0.05 : 0 }}
                  className="inline-flex items-center justify-center w-7 h-7 text-xs rounded"
                  style={{
                    color: NUCLEOTIDE_COLORS[base] || '#fff',
                    backgroundColor: `${NUCLEOTIDE_COLORS[base]}20`,
                  }}
                >
                  {base}
                </motion.span>
              ))}
              <span className="text-xs text-gray-500 self-center ml-1">3'</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
