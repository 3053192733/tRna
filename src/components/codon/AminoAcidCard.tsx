import { motion } from 'framer-motion';
import { X, Droplets, Zap, Scale, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import codonsData from '@/data/codons.json';
import aminoAcidsData from '@/data/aminoAcids.json';

type CodonInfo = {
  aminoAcid: string;
  name: string;
  abbr: string;
  frequency: number;
};

type AminoAcidInfo = {
  name: string;
  abbr: string;
  fullAbbr: string;
  mw: number;
  codons: string[];
  type: string;
  charge: number;
  hydropathy: number;
};

const codons = codonsData as Record<string, CodonInfo>;
const aminoAcids = aminoAcidsData as Record<string, AminoAcidInfo>;

const AMINO_ACID_COLORS: Record<string, string> = {
  A: '#22c55e', R: '#3b82f6', N: '#8b5cf6', D: '#f59e0b',
  C: '#10b981', E: '#f97316', Q: '#6366f1', G: '#ec4899',
  H: '#14b8a6', I: '#84cc16', L: '#06b6d4', K: '#7c3aed',
  M: '#f43f5e', F: '#a855f7', P: '#0ea5e9', S: '#eab308',
  T: '#d946ef', W: '#64748b', Y: '#f472b6', V: '#2dd4bf',
  '*': '#ef4444', '?': '#6b7280',
};

interface AminoAcidCardProps {
  codon: string;
  onClose: () => void;
}

export default function AminoAcidCard({ codon, onClose }: AminoAcidCardProps) {
  const [copied, setCopied] = useState(false);
  const codonInfo = codons[codon];
  const aaInfo = aminoAcids[codonInfo?.aminoAcid || ''];

  if (!codonInfo) return null;

  const allCodons = aaInfo?.codons || [];
  const isStop = codonInfo.aminoAcid === 'Stop';

  const handleCopy = () => {
    navigator.clipboard.writeText(codon);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 20 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-space-800 border border-white/20 rounded-3xl p-8 max-w-md w-full shadow-2xl"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-3 mb-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center font-mono text-2xl font-bold text-white"
              style={{
                backgroundColor: `${AMINO_ACID_COLORS[codonInfo.abbr] || '#6b7280'}30`,
                border: `3px solid ${AMINO_ACID_COLORS[codonInfo.abbr] || '#6b7280'}`,
              }}
            >
              {codonInfo.abbr}
            </div>
            <div className="text-left">
              <h3 className="font-display text-xl font-bold text-white">
                {codonInfo.name}
              </h3>
              <p className="text-gray-400 text-sm">{aaInfo?.fullAbbr || codonInfo.aminoAcid}</p>
            </div>
          </div>

          <div className="flex justify-center gap-2">
            {codon.split('').map((base, i) => (
              <span
                key={i}
                className="w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-sm"
                style={{
                  backgroundColor: `${base === 'U' ? '#f59e0b' : base === 'A' ? '#ef4444' : base === 'G' ? '#22c55e' : '#3b82f6'}20`,
                  color: base === 'U' ? '#f59e0b' : base === 'A' ? '#ef4444' : base === 'G' ? '#22c55e' : '#3b82f6',
                }}
              >
                {base}
              </span>
            ))}
          </div>
        </div>

        {isStop ? (
          <div className="text-center py-6">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
              <span className="text-3xl">⏹</span>
            </div>
            <p className="text-red-400 font-medium">终止密码子</p>
            <p className="text-gray-400 text-sm mt-2">翻译过程在此终止</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-space-700/50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <Droplets className="w-3 h-3" />
                  疏水性
                </div>
                <div className="text-white font-medium">{aaInfo?.hydropathy || 0}</div>
              </div>
              <div className="p-3 bg-space-700/50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <Zap className="w-3 h-3" />
                  电荷
                </div>
                <div className="text-white font-medium">{aaInfo?.charge || 0}</div>
              </div>
              <div className="p-3 bg-space-700/50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <Scale className="w-3 h-3" />
                  分子量
                </div>
                <div className="text-white font-medium">{aaInfo?.mw || 0} Da</div>
              </div>
              <div className="p-3 bg-space-700/50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-400 text-xs mb-1">
                  <span className="w-3 h-3">分类</span>
                </div>
                <div className="text-white font-medium text-xs">{aaInfo?.type || '未知'}</div>
              </div>
            </div>

            <div>
              <p className="text-gray-400 text-xs mb-2">同义密码子</p>
              <div className="flex flex-wrap gap-2">
                {allCodons.map((c) => (
                  <span
                    key={c}
                    className={`
                      px-3 py-1 rounded-full font-mono text-sm
                      ${c === codon ? 'bg-bio-cyan/30 text-bio-cyan border border-bio-cyan' : 'bg-space-700/50 text-gray-300'}
                    `}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10">
              <p className="text-gray-500 text-xs mb-2">使用频率</p>
              <div className="h-2 bg-space-700/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(codonInfo.frequency || 0) * 100}%` }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-bio-cyan to-bio-purple rounded-full"
                />
              </div>
              <p className="text-gray-400 text-xs mt-1">
                {((codonInfo.frequency || 0) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleCopy}
            className="flex-1 btn-secondary flex items-center justify-center gap-2 text-sm"
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? '已复制' : '复制密码子'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
