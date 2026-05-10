import { motion } from 'framer-motion';

interface CodonTableProps {
  selectedCodon: string | null;
  onSelectCodon: (codon: string) => void;
}

const CODON_TABLE = [
  ['UUU', 'UUC', 'UUA', 'UUG'], ['CUU', 'CUC', 'CUA', 'CUG'],
  ['AUU', 'AUC', 'AUA', 'AUG'], ['GUU', 'GUC', 'GUA', 'GUG'],
  ['UCU', 'UCC', 'UCA', 'UCG'], ['CCU', 'CCC', 'CCA', 'CCG'],
  ['ACU', 'ACC', 'ACA', 'ACG'], ['GCU', 'GCC', 'GCA', 'GCG'],
  ['UAU', 'UAC', 'UAA', 'UAG'], ['CAU', 'CAC', 'CAA', 'CAG'],
  ['AAU', 'AAC', 'AAA', 'AAG'], ['GAU', 'GAC', 'GAA', 'GAG'],
  ['UGU', 'UGC', 'UGA', 'UGG'], ['CGU', 'CGC', 'CGA', 'CGG'],
  ['AGU', 'AGC', 'AGA', 'AGG'], ['GGU', 'GGC', 'GGA', 'GGG'],
];

const NUCLEOTIDE_COLORS: Record<string, string> = { U: '#f59e0b', A: '#ef4444', G: '#22c55e', C: '#3b82f6' };

export default function CodonTable({ selectedCodon, onSelectCodon }: CodonTableProps) {
  return (
    <div className="card">
      <h3 className="font-display text-lg font-semibold text-white mb-4">64 密码子表</h3>
      <p className="text-sm text-gray-400 mb-6">点击任意密码子查看详细信息</p>
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          <div className="grid grid-cols-4 gap-2">
            {CODON_TABLE.map((row, rowIndex) => (
              <div key={rowIndex} className="contents">
                {row.map((codon) => {
                  const isSelected = selectedCodon === codon;
                  return (
                    <motion.button key={codon} onClick={() => onSelectCodon(codon)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className={`relative p-2 rounded-lg font-mono text-sm transition-all duration-200 ${isSelected ? 'bg-bio-cyan/30 border-2 border-bio-cyan shadow-[0_0_20px_rgba(0,212,170,0.3)]' : 'bg-space-700/50 border border-white/10 hover:border-white/30'}`}>
                      <div className="flex justify-center gap-0.5">
                        {codon.split('').map((base, i) => (
                          <span key={i} className="w-5 h-5 flex items-center justify-center rounded text-xs font-bold" style={{ color: NUCLEOTIDE_COLORS[base] }}>{base}</span>
                        ))}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            ))}
          </div>
          <div className="mt-6 flex items-center justify-center gap-6 text-xs">
            {Object.entries(NUCLEOTIDE_COLORS).map(([base, color]) => (
              <div key={base} className="flex items-center gap-2">
                <span className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
                <span className="text-gray-400">{base === 'U' ? 'U (尿嘧啶)' : base === 'A' ? 'A (腺嘌呤)' : base === 'G' ? 'G (鸟嘌呤)' : 'C (胞嘧啶)'}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
