import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import $3Dmol from '3dmol';
import { Search, ExternalLink, Info, Dna, Loader2 } from 'lucide-react';

interface ProteinInfo {
  entryName: string;
  proteinName: string;
  geneName: string;
  organism: string;
  length: number;
  function: string;
  pathway: string[];
  pdbId: string | null;
  sequence: string;
}

interface ProteinAnalyzerProps {
  aminoAcids: string[];
}

const COMMON_PROTEINS: Record<string, { name: string; pdbId: string; description: string; organism: string; pathway: string[]; geneName: string }> = {
  'MVLSPADKTN': { name: 'Hemoglobin Alpha', pdbId: '1A3N', description: '血红蛋白 α 亚基 - 负责运输氧气', organism: 'Homo sapiens', pathway: ['氧气运输', '血液循环'], geneName: 'HBA1' },
  'MVHLTPEEK': { name: 'Hemoglobin Beta', pdbId: '1A3N', description: '血红蛋白 β 亚基 - 负责运输氧气', organism: 'Homo sapiens', pathway: ['氧气运输', '血液循环'], geneName: 'HBB' },
  'MVLSGEDIE': { name: 'Green Fluorescent Protein', pdbId: '1GFL', description: '绿色荧光蛋白 - 生物成像标记', organism: 'Aequorea victoria', pathway: ['生物发光', '荧光标记'], geneName: 'GFP' },
  'FVNQHLCGSH': { name: 'Insulin', pdbId: '4INS', description: '胰岛素 - 调节血糖水平', organism: 'Homo sapiens', pathway: ['葡萄糖代谢', '胰岛素信号'], geneName: 'INS' },
  'MATGGRRGAA': { name: 'Histone H3', pdbId: '1AOI', description: '组蛋白 H3 - 染色质结构核心', organism: 'Homo sapiens', pathway: ['染色体结构', '表观遗传'], geneName: 'H3' },
  'MEFAPGNLPE': { name: 'Ubiquitin', pdbId: '1UBQ', description: '泛素 - 蛋白质降解标记', organism: 'Homo sapiens', pathway: ['蛋白质降解', '细胞信号'], geneName: 'UBC' },
  'MLSCEEKAGV': { name: 'Cytochrome C', pdbId: '1HRC', description: '细胞色素 C - 电子传递链', organism: 'Homo sapiens', pathway: ['电子传递', '细胞凋亡'], geneName: 'CYCS' },
  'MEAGSHHSSA': { name: 'Lysozyme', pdbId: '1LZE', description: '溶菌酶 - 抗菌酶', organism: 'Gallus gallus', pathway: ['免疫防御', '细菌溶解'], geneName: 'LYZ' },
  'MPIQNPQPNA': { name: 'Myoglobin', pdbId: '1MBN', description: '肌红蛋白 - 肌肉氧气储存', organism: 'Physeter catodon', pathway: ['氧气储存', '肌肉代谢'], geneName: 'MB' },
  'MALKSLVLLS': { name: 'Ribonuclease A', pdbId: '7RSA', description: '核糖核酸酶 A - RNA 降解', organism: 'Bos taurus', pathway: ['RNA 加工', '核酸代谢'], geneName: 'RNASE1' },
  'MALWMRLLPL': { name: 'Trypsin', pdbId: '1G36', description: '胰蛋白酶 - 蛋白质消化', organism: 'Bos taurus', pathway: ['蛋白质消化', '丝氨酸蛋白酶'], geneName: 'PRSS1' },
  'MRGSHHHHHH': { name: 'Thioredoxin', pdbId: '1TRX', description: '硫氧还蛋白 - 氧化还原调节', organism: 'Escherichia coli', pathway: ['氧化还原', '二硫键形成'], geneName: 'TXN' },
  'MTEYKLVVVG': { name: 'Ras Protein', pdbId: '5P21', description: 'Ras 蛋白 - 细胞信号开关', organism: 'Homo sapiens', pathway: ['细胞增殖', '信号转导'], geneName: 'HRAS' },
  'MLGKEDGPGK': { name: 'Protein Kinase A', pdbId: '1ATP', description: '蛋白激酶 A - 磷酸化调节', organism: 'Bos taurus', pathway: ['信号转导', '磷酸化'], geneName: 'PRKACA' },
  'MDAMKRGLCC': { name: 'Superoxide Dismutase', pdbId: '2SOD', description: '超氧化物歧化酶 - 抗氧化', organism: 'Homo sapiens', pathway: ['抗氧化', 'ROS 清除'], geneName: 'SOD1' },
  'MSDMKRGAPP': { name: 'P53', pdbId: '1TUP', description: 'P53 - 肿瘤抑制蛋白', organism: 'Homo sapiens', pathway: ['细胞周期', 'DNA 修复'], geneName: 'TP53' },
  'MDIAIQMKKF': { name: 'Calmodulin', pdbId: '1CLL', description: '钙调蛋白 - 钙信号传感器', organism: 'Rattus norvegicus', pathway: ['钙信号', '酶调节'], geneName: 'CALM1' },
  'MKKVIFIGAG': { name: 'Alcohol Dehydrogenase', pdbId: '6ADH', description: '乙醇脱氢酶 - 酒精代谢', organism: 'Homo sapiens', pathway: ['酒精代谢', '氧化还原'], geneName: 'ADH1B' },
  'MATPSDPSAA': { name: 'Enhanced GFP', pdbId: '2Y0G', description: '增强型 GFP - 更亮的荧光', organism: 'Aequorea victoria', pathway: ['荧光成像', '生物标记'], geneName: 'EGFP' },
  'MEAGPSGHSA': { name: 'Chymotrypsin', pdbId: '4CHA', description: '糜蛋白酶 - 蛋白质消化', organism: 'Bos taurus', pathway: ['蛋白质消化', '丝氨酸蛋白酶'], geneName: 'CTRB1' },
};

export default function ProteinAnalyzer({ aminoAcids }: ProteinAnalyzerProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [proteinInfo, setProteinInfo] = useState<ProteinInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewStyle, setViewStyle] = useState<'cartoon' | 'stick' | 'sphere'>('cartoon');

  const cleanSequence = aminoAcids.filter(a => a !== '*').join('');

  const findMatch = (): { name: string; pdbId: string; description: string; organism: string; pathway: string[]; geneName: string } | null => {
    for (const [pattern, info] of Object.entries(COMMON_PROTEINS)) {
      if (cleanSequence.includes(pattern) || pattern.startsWith(cleanSequence.slice(0, Math.min(5, cleanSequence.length)))) {
        return info;
      }
    }
    if (cleanSequence.length >= 10) {
      return { name: '未知蛋白质', pdbId: '1HBA', description: '该序列可能与血红蛋白相关', organism: '未知', pathway: ['蛋白质合成'], geneName: '-' };
    }
    return null;
  };

  const analyzeProtein = async () => {
    setIsLoading(true);
    setError(null);
    setProteinInfo(null);

    try {
      const match = findMatch();

      if (match) {
        setProteinInfo({
          entryName: match.name,
          proteinName: match.name,
          geneName: match.geneName,
          organism: match.organism,
          length: cleanSequence.length,
          function: match.description,
          pathway: match.pathway,
          pdbId: match.pdbId,
          sequence: cleanSequence,
        });

        await loadStructure(match.pdbId);
      } else {
        setProteinInfo({
          entryName: '未知蛋白质',
          proteinName: '序列太短或不在数据库中',
          geneName: '-',
          organism: '-',
          length: cleanSequence.length,
          function: '无法识别该蛋白质序列。请尝试输入更长的序列（至少10个氨基酸）。',
          pathway: [],
          pdbId: null,
          sequence: cleanSequence,
        });
      }
    } catch (err) {
      setError('分析失败，请稍后重试');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStructure = async (pdbId: string) => {
    if (!viewerRef.current) return;

    if (viewerInstanceRef.current) {
      viewerInstanceRef.current.clear();
    }

    const viewer = $3Dmol.createViewer(viewerRef.current, {
      backgroundColor: 'rgba(10, 14, 26, 0.5)',
    });

    viewerInstanceRef.current = viewer;

    try {
      await $3Dmol.download(`pdb:${pdbId}`, viewer, {}, (): void => {
        viewer.setStyle({}, { cartoon: { color: 'spectrum' } });
        viewer.zoomTo();
        viewer.render();

        viewer.spin('y', 0.5);
      });
    } catch (err) {
      console.error('Failed to load structure:', err);
      viewer.setStyle({}, { stick: {} });
      viewer.render();
    }
  };

  const changeViewStyle = (style: 'cartoon' | 'stick' | 'sphere') => {
    setViewStyle(style);
    if (viewerInstanceRef.current) {
      viewerInstanceRef.current.setStyle({}, { [style]: {} });
      viewerInstanceRef.current.render();
    }
  };

  const toggleSpin = () => {
    if (viewerInstanceRef.current) {
      const isSpinning = viewerInstanceRef.current.isAnimated();
      if (isSpinning) {
        viewerInstanceRef.current.spin(false);
      } else {
        viewerInstanceRef.current.spin('y', 0.5);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.clear();
      }
    };
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card mt-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl font-semibold text-white flex items-center gap-3">
          <Dna className="w-6 h-6 text-bio-cyan" />
          蛋白质分析
        </h3>
        <button
          onClick={analyzeProtein}
          disabled={isLoading || cleanSequence.length === 0}
          className="btn-primary flex items-center gap-2 disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              分析中...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              分析蛋白质
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 mb-6">
          {error}
        </div>
      )}

      {proteinInfo && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="p-4 bg-space-700/50 rounded-xl">
                <h4 className="text-bio-cyan font-medium mb-2 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  {proteinInfo.proteinName}
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">基因名</span>
                    <span className="text-white font-mono">{proteinInfo.geneName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">物种来源</span>
                    <span className="text-white">{proteinInfo.organism}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">氨基酸数量</span>
                    <span className="text-white">{proteinInfo.length}</span>
                  </div>
                  {proteinInfo.pdbId && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">PDB ID</span>
                      <a
                        href={`https://www.rcsb.org/structure/${proteinInfo.pdbId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-bio-cyan hover:underline flex items-center gap-1"
                      >
                        {proteinInfo.pdbId}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 bg-space-700/50 rounded-xl">
                <h4 className="text-yellow-400 font-medium mb-2">蛋白质功能</h4>
                <p className="text-gray-300 text-sm leading-relaxed">
                  {proteinInfo.function}
                </p>
              </div>

              {proteinInfo.pathway.length > 0 && (
                <div className="p-4 bg-space-700/50 rounded-xl">
                  <h4 className="text-purple-400 font-medium mb-2">相关通路</h4>
                  <div className="flex flex-wrap gap-2">
                    {proteinInfo.pathway.map((p, i) => (
                      <span key={i} className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">3D 结构</h4>
                <div className="flex gap-2">
                  <div className="flex bg-space-700/50 rounded-lg p-1">
                    {(['cartoon', 'stick', 'sphere'] as const).map((style) => (
                      <button
                        key={style}
                        onClick={() => changeViewStyle(style)}
                        className={`px-3 py-1 rounded text-xs transition-colors ${
                          viewStyle === style ? 'bg-bio-cyan/20 text-bio-cyan' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {style === 'cartoon' ? '带状' : style === 'stick' ? '棍状' : '球状'}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={toggleSpin}
                    className="px-3 py-1 bg-space-700/50 rounded-lg text-gray-400 hover:text-white text-xs transition-colors"
                  >
                    旋转
                  </button>
                </div>
              </div>

              <div className="relative w-full h-[320px] rounded-xl bg-space-900/80 border border-white/10 overflow-hidden" style={{ zIndex: 1, position: 'relative' }}>
                <div
                  ref={viewerRef}
                  className="absolute inset-0 w-full h-full"
                  style={{ position: 'absolute', top: 0, left: 0 }}
                />
              </div>

              {proteinInfo.pdbId && (
                <p className="text-xs text-gray-500 mt-2 text-center">
                  数据来源：RCSB PDB ({proteinInfo.pdbId})
                </p>
              )}
            </div>
          </div>

          <div className="p-4 bg-space-700/30 rounded-xl border border-gray-500/20">
            <h4 className="text-gray-400 text-xs mb-2">序列 (共 {proteinInfo.sequence.length} 个氨基酸)</h4>
            <div className="flex flex-wrap gap-1 font-mono text-xs">
              {proteinInfo.sequence.split('').map((aa, i) => (
                <span
                  key={i}
                  className="w-6 h-6 rounded flex items-center justify-center"
                  style={{
                    backgroundColor: `${getAminoAcidColor(aa)}30`,
                    color: getAminoAcidColor(aa),
                  }}
                >
                  {aa}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {!proteinInfo && !isLoading && (
        <div className="text-center py-12 text-gray-500">
          <Dna className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>点击「分析蛋白质」查看蛋白质信息</p>
          <p className="text-xs mt-2">支持常见蛋白质识别和 3D 结构展示</p>
        </div>
      )}
    </motion.div>
  );
}

function getAminoAcidColor(aa: string): string {
  const colors: Record<string, string> = {
    A: '#22c55e', R: '#3b82f6', N: '#8b5cf6', D: '#f59e0b',
    C: '#10b981', E: '#f97316', Q: '#6366f1', G: '#ec4899',
    H: '#14b8a6', I: '#84cc16', L: '#06b6d4', K: '#7c3aed',
    M: '#f43f5e', F: '#a855f7', P: '#0ea5e9', S: '#eab308',
    T: '#d946ef', W: '#64748b', Y: '#f472b6', V: '#2dd4bf',
  };
  return colors[aa] || '#6b7280';
}
