import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Dna, Atom, Table2, Calculator, FlaskConical, ArrowRight, Sparkles, Microscope } from 'lucide-react';

const tools = [
  { path: '/analyzer', icon: Atom, title: 'DNA/RNA 分析器', description: '序列输入、互补链生成、转录与翻译', color: '#00d4aa' },
  { path: '/codon', icon: Table2, title: '密码子表', description: '64 密码子与 20 氨基酸的可视化查询', color: '#7c3aed' },
  { path: '/calculator', icon: Calculator, title: '分子量计算', description: 'DNA、RNA、蛋白质的分子量精确计算', color: '#eab308' },
  { path: '/protein-library', icon: Microscope, title: '蛋白质数据库', description: '20种常见蛋白质的结构与功能查询', color: '#3b82f6' },
  { path: '/trna', icon: FlaskConical, title: 'tRNA 可视化', description: '三叶草结构的动态展示与交互', color: '#f472b6' },
];

export default function Home() {
  return (
    <div className="container mx-auto px-6 py-8 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10 sm:mb-16">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', damping: 10, stiffness: 100 }} className="inline-flex items-center gap-3 mb-6">
          <div className="relative"><Dna className="w-16 h-16 text-bio-cyan" /><div className="absolute inset-0 bg-bio-cyan/30 blur-xl rounded-full" /></div>
        </motion.div>
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-wider">t<span className="text-bio-cyan">R</span>na</h1>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-8">探索生命的遗传密码 — 生物信息学工具集合</p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-wrap justify-center gap-4">
          <span className="px-4 py-2 bg-bio-cyan/10 border border-bio-cyan/30 rounded-full text-bio-cyan text-sm">DNA 分析</span>
          <span className="px-4 py-2 bg-bio-purple/10 border border-bio-purple/30 rounded-full text-bio-purple text-sm">密码子表</span>
          <span className="px-4 py-2 bg-yellow-400/10 border border-yellow-400/30 rounded-full text-yellow-400 text-sm">分子量计算</span>
          <span className="px-4 py-2 bg-blue-400/10 border border-blue-400/30 rounded-full text-blue-400 text-sm">蛋白质数据库</span>
          <span className="px-4 py-2 bg-pink-400/10 border border-pink-400/30 rounded-full text-pink-400 text-sm">tRNA 可视化</span>
        </motion.div>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 mb-16">
        {tools.map((tool, index) => (
          <motion.div key={tool.path} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * index + 0.4 }}>
            <Link to={tool.path}>
              <motion.div whileHover={{ scale: 1.02, y: -5 }} whileTap={{ scale: 0.98 }} className="relative p-4 sm:p-6 lg:p-8 rounded-2xl lg:rounded-3xl border border-white/10 backdrop-blur-sm transition-all duration-300 hover:shadow-[0_0_40px_rgba(0,212,170,0.2)] group overflow-hidden" style={{ background: `linear-gradient(135deg, ${tool.color}15 0%, rgba(124,58,237,0.1) 100%)` }}>
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ backgroundColor: `${tool.color}30`, border: `1px solid ${tool.color}50` }}><tool.icon className="w-7 h-7" style={{ color: tool.color }} /></div>
                    <ArrowRight className="w-6 h-6 text-gray-500 group-hover:text-white group-hover:translate-x-2 transition-all" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-white mb-2">{tool.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{tool.description}</p>
                </div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 rounded-full bg-white/5 blur-2xl" />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }} className="card bg-gradient-to-br from-bio-cyan/5 to-bio-purple/5">
        <div className="flex items-center gap-3 mb-4"><Sparkles className="w-5 h-5 text-bio-cyan" /><h3 className="font-display text-lg font-semibold text-white">快速入门</h3></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="text-center p-4"><div className="w-10 h-10 rounded-full bg-bio-cyan/20 text-bio-cyan font-display font-bold mx-auto mb-3 flex items-center justify-center">1</div><h4 className="text-white font-medium mb-2">输入序列</h4><p className="text-gray-400 text-sm">在分析器中粘贴或输入 DNA/RNA 序列</p></div>
          <div className="text-center p-4"><div className="w-10 h-10 rounded-full bg-bio-purple/20 text-bio-purple font-display font-bold mx-auto mb-3 flex items-center justify-center">2</div><h4 className="text-white font-medium mb-2">选择分析类型</h4><p className="text-gray-400 text-sm">转录、翻译或计算分子量</p></div>
          <div className="text-center p-4"><div className="w-10 h-10 rounded-full bg-yellow-400/20 text-yellow-400 font-display font-bold mx-auto mb-3 flex items-center justify-center">3</div><h4 className="text-white font-medium mb-2">查看动画结果</h4><p className="text-gray-400 text-sm">直观的动画展示生物过程</p></div>
        </div>
      </motion.div>
    </div>
  );
}
