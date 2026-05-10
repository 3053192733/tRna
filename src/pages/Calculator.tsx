import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator as CalcIcon, Dna } from 'lucide-react';
import SequenceInput from '@/components/dna/SequenceInput';
import { calculateDNAMolecularWeight, calculateRNAMolecularWeight, calculateProteinMolecularWeight } from '@/utils/molecularWeight';

type CalcMode = 'dna-ds' | 'dna-ss' | 'rna' | 'protein';

export default function Calculator() {
  const [mode, setMode] = useState<CalcMode>('dna-ds');
  const [input, setInput] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!input) { setResult(null); setDisplayValue(0); return; }
    let mw = 0;
    switch (mode) {
      case 'dna-ds': mw = calculateDNAMolecularWeight(input, true); break;
      case 'dna-ss': mw = calculateDNAMolecularWeight(input, false); break;
      case 'rna': mw = calculateRNAMolecularWeight(input); break;
      case 'protein': mw = calculateProteinMolecularWeight(input).mw; break;
    }
    setResult(mw);
  }, [input, mode]);

  useEffect(() => {
    if (result === null) return;
    const duration = 1000, steps = 30;
    const increment = result / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= result) { setDisplayValue(result); clearInterval(timer); }
      else setDisplayValue(current);
    }, duration / steps);
    return () => clearInterval(timer);
  }, [result]);

  const modes = [
    { id: 'dna-ds' as CalcMode, label: 'DNA (双链)', color: '#00d4aa' },
    { id: 'dna-ss' as CalcMode, label: 'DNA (单链)', color: '#00d4aa' },
    { id: 'rna' as CalcMode, label: 'RNA', color: '#7c3aed' },
    { id: 'protein' as CalcMode, label: '蛋白质', color: '#eab308' },
  ];

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3"><CalcIcon className="w-8 h-8 text-yellow-400" />分子量计算器</h1>
        <p className="text-gray-400">计算 DNA、RNA 和蛋白质的分子量</p>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr,400px] gap-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-6">
          <div className="card">
            <h3 className="font-display text-lg font-semibold text-white mb-4">分子类型</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {modes.map(({ id, label, color }) => (
                <button key={id} onClick={() => setMode(id)} className={`p-4 rounded-xl border transition-all duration-300 ${mode === id ? 'shadow-[0_0_20px_rgba(0,212,170,0.3)]' : 'hover:border-white/30'}`} style={{ backgroundColor: mode === id ? `${color}15` : 'rgba(31,41,55,0.5)', borderColor: mode === id ? color : 'rgba(255,255,255,0.1)' }}>
                  <Dna className="w-6 h-6 mx-auto mb-2" style={{ color: mode === id ? color : '#6b7280' }} />
                  <span className={`text-sm font-medium ${mode === id ? 'text-white' : 'text-gray-400'}`}>{label}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="card">
            <SequenceInput value={input} onChange={setInput} label={mode === 'protein' ? '氨基酸序列 (单字母缩写)' : `${mode.includes('dna') ? 'DNA' : 'RNA'} 序列`} placeholder={mode === 'protein' ? '输入氨基酸序列，如 MVLSPADKTNVK...' : '输入核苷酸序列'} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="space-y-6">
          <div className="card bg-gradient-to-br from-bio-cyan/10 to-bio-purple/10">
            <h3 className="font-display text-lg font-semibold text-white mb-6 text-center">计算结果</h3>
            <div className="text-center mb-8">
              <motion.div className="text-5xl md:text-6xl font-display font-bold text-white mb-2" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>{displayValue.toFixed(2)}</motion.div>
              <p className="text-gray-400 text-lg">Da</p>
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-4 bg-space-700/50 rounded-xl"><p className="text-gray-400 text-xs mb-1">千道尔顿</p><p className="text-white font-mono text-lg">{(displayValue / 1000).toFixed(3)} kDa</p></div>
              <div className="p-4 bg-space-700/50 rounded-xl"><p className="text-gray-400 text-xs mb-1">兆道尔顿</p><p className="text-white font-mono text-lg">{(displayValue / 1000000).toFixed(6)} MDa</p></div>
            </div>
          </div>
          <div className="card">
            <h3 className="font-display text-sm font-semibold text-white mb-3">计算公式</h3>
            <div className="space-y-3 text-xs font-mono text-gray-400">
              {mode === 'dna-ds' && <p>MW = (bp × 617.96) + 39.31 g/mol</p>}
              {mode === 'dna-ss' && <p>MW = (nt × 308.98) + 79.0 g/mol</p>}
              {mode === 'rna' && <p>MW = (nt × 320.98) + 17.04 g/mol</p>}
              {mode === 'protein' && <p>MW = Σ(氨基酸分子量) - 18.015 × (n-1) g/mol</p>}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
