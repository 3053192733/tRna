import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Table2, Search } from 'lucide-react';
import CodonTable from '@/components/codon/CodonTable';
import AminoAcidCard from '@/components/codon/AminoAcidCard';

export default function CodonTablePage() {
  const [selectedCodon, setSelectedCodon] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Table2 className="w-8 h-8 text-bio-purple" />
          密码子表
        </h1>
        <p className="text-gray-400">
          探索遗传密码 - 64 个密码子与 20 种氨基酸的对应关系
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-[1fr,300px] gap-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <CodonTable
            selectedCodon={selectedCodon}
            onSelectCodon={setSelectedCodon}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-6"
        >
          <div className="card">
            <h3 className="font-display text-lg font-semibold text-white mb-4">快速搜索</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="输入氨基酸名称..."
                className="input-bio pl-10 text-sm"
              />
            </div>

            <div className="mt-4 space-y-2">
              <p className="text-xs text-gray-500">常用氨基酸</p>
              {['Phe', 'Leu', 'Ile', 'Met', 'Val', 'Ser', 'Pro', 'Thr', 'Ala'].map((aa) => (
                <button
                  key={aa}
                  onClick={() => setSelectedCodon(null)}
                  className="w-full text-left px-3 py-2 rounded-lg bg-space-700/30 text-gray-300 hover:bg-space-700/50 hover:text-white transition-colors text-sm font-mono"
                >
                  {aa}
                </button>
              ))}
            </div>
          </div>

          <div className="card bg-gradient-to-br from-bio-cyan/10 to-bio-purple/10">
            <h3 className="font-display text-sm font-semibold text-white mb-3">遗传密码特点</h3>
            <ul className="space-y-2 text-xs text-gray-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-bio-cyan mt-1.5 flex-shrink-0" />
                简并性：多个密码子可编码同一氨基酸
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-bio-cyan mt-1.5 flex-shrink-0" />
                通用性：几乎所有生物使用相同的遗传密码
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-bio-cyan mt-1.5 flex-shrink-0" />
                起始密码子：AUG 编码甲硫氨酸
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                终止密码子：UAA、UAG、UGA
              </li>
            </ul>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {selectedCodon && (
          <AminoAcidCard
            codon={selectedCodon}
            onClose={() => setSelectedCodon(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
