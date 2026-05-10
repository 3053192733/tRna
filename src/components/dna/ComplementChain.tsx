import { motion } from 'framer-motion';
import { NUCLEOTIDE_COLORS } from '@/utils/sequence';

interface ComplementChainProps {
  template: string;
  coding: string;
  showAnimation?: boolean;
}

export default function ComplementChain({ template, coding, showAnimation = true }: ComplementChainProps) {
  const bases = template.split('');

  return (
    <div className="space-y-6">
      <div>
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-bio-cyan" />
          <span>模板链 (3' → 5')</span>
        </div>
        <div className="flex flex-wrap gap-1 font-mono text-sm">
          {bases.map((base, index) => (
            <motion.span key={`template-${index}`} initial={showAnimation ? { opacity: 0, y: 10 } : false} animate={{ opacity: 1, y: 0 }} transition={{ delay: showAnimation ? index * 0.05 : 0 }} className="inline-flex items-center justify-center w-8 h-8 rounded-lg" style={{ color: NUCLEOTIDE_COLORS[base] || '#fff', backgroundColor: `${NUCLEOTIDE_COLORS[base]}15`, border: `1px solid ${NUCLEOTIDE_COLORS[base]}40` }}>
              {base}
            </motion.span>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-center">
        <motion.div initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: bases.length * 0.05 }} className="h-0.5 bg-gradient-to-r from-bio-cyan via-bio-purple to-bio-cyan w-full max-w-xs" />
        <span className="absolute px-3 py-1 bg-space-800 rounded-full text-xs text-bio-cyan">复制</span>
      </div>

      <div>
        <div className="text-xs text-gray-500 mb-2 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-bio-purple" />
          <span>编码链 (5' → 3')</span>
        </div>
        <div className="flex flex-wrap gap-1 font-mono text-sm">
          {coding.split('').map((base, index) => (
            <motion.span key={`coding-${index}`} initial={showAnimation ? { opacity: 0, y: -10 } : false} animate={{ opacity: 1, y: 0 }} transition={{ delay: showAnimation ? bases.length * 0.05 + index * 0.05 : 0 }} className="inline-flex items-center justify-center w-8 h-8 rounded-lg" style={{ color: NUCLEOTIDE_COLORS[base] || '#fff', backgroundColor: `${NUCLEOTIDE_COLORS[base]}15`, border: `1px solid ${NUCLEOTIDE_COLORS[base]}40` }}>
              {base}
            </motion.span>
          ))}
        </div>
      </div>
    </div>
  );
}
