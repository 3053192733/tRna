import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import $3Dmol from '3dmol';
import { Dna, Search, ExternalLink, Info, Loader2, Microscope } from 'lucide-react';

interface Protein {
  id: string;
  name: string;
  pdbId: string;
  description: string;
  organism: string;
  pathway: string[];
  geneName: string;
  length: number;
  function: string;
  category: string;
}

const PROTEIN_DATABASE: Protein[] = [
  {
    id: 'hba',
    name: 'Hemoglobin Alpha',
    pdbId: '1A3N',
    description: '血红蛋白 α 亚基',
    organism: 'Homo sapiens',
    pathway: ['氧气运输', '血液循环', '气体交换'],
    geneName: 'HBA1',
    length: 142,
    function: '负责在血液中运输氧气，是红细胞中的重要蛋白。与血红蛋白 β 亚基结合形成完整的血红蛋白四聚体。',
    category: '运输蛋白'
  },
  {
    id: 'hbb',
    name: 'Hemoglobin Beta',
    pdbId: '1A3N',
    description: '血红蛋白 β 亚基',
    organism: 'Homo sapiens',
    pathway: ['氧气运输', '血液循环', '气体交换'],
    geneName: 'HBB',
    length: 147,
    function: '与 α 亚基共同组成血红蛋白，负责从肺部向组织运输氧气，并将二氧化碳从组织运回肺部。',
    category: '运输蛋白'
  },
  {
    id: 'gfp',
    name: 'Green Fluorescent Protein',
    pdbId: '1GFL',
    description: '绿色荧光蛋白',
    organism: 'Aequorea victoria',
    pathway: ['生物发光', '荧光标记', '光信号传导'],
    geneName: 'GFP',
    length: 238,
    function: '能够自身催化产生绿色荧光。广泛应用于生物学研究作为报告基因和蛋白质标签。',
    category: '荧光蛋白'
  },
  {
    id: 'insulin',
    name: 'Insulin',
    pdbId: '4INS',
    description: '胰岛素',
    organism: 'Homo sapiens',
    pathway: ['葡萄糖代谢', '胰岛素信号', '糖代谢调节'],
    geneName: 'INS',
    length: 110,
    function: '调节血糖水平，促进细胞对葡萄糖的吸收。是治疗糖尿病的关键药物。',
    category: '激素蛋白'
  },
  {
    id: 'histone-h3',
    name: 'Histone H3',
    pdbId: '1AOI',
    description: '组蛋白 H3',
    organism: 'Homo sapiens',
    pathway: ['染色体结构', '表观遗传', 'DNA 包装'],
    geneName: 'H3',
    length: 136,
    function: '真核生物染色质的核心组成部分，参与 DNA 的包装和基因表达调控。',
    category: '结构蛋白'
  },
  {
    id: 'ubiquitin',
    name: 'Ubiquitin',
    pdbId: '1UBQ',
    description: '泛素',
    organism: 'Homo sapiens',
    pathway: ['蛋白质降解', '细胞信号', '蛋白质周转'],
    geneName: 'UBC',
    length: 76,
    function: '参与蛋白质降解途径（泛素-蛋白酶体系统），也参与细胞信号传导和 DNA 修复。',
    category: '调节蛋白'
  },
  {
    id: 'cytochrome-c',
    name: 'Cytochrome C',
    pdbId: '1HRC',
    description: '细胞色素 C',
    organism: 'Homo sapiens',
    pathway: ['电子传递', '细胞凋亡', '线粒体呼吸'],
    geneName: 'CYCS',
    length: 104,
    function: '线粒体电子传递链的重要组成部分，参与 ATP 合成。也是细胞凋亡的关键因子。',
    category: '电子传递蛋白'
  },
  {
    id: 'lysozyme',
    name: 'Lysozyme',
    pdbId: '1LZE',
    description: '溶菌酶',
    organism: 'Gallus gallus',
    pathway: ['免疫防御', '细菌溶解', '先天免疫'],
    geneName: 'LYZ',
    length: 130,
    function: '一种抗菌酶，能水解细菌细胞壁的肽聚糖。是先天免疫系统的重要组成部分。',
    category: '酶'
  },
  {
    id: 'myoglobin',
    name: 'Myoglobin',
    pdbId: '1MBN',
    description: '肌红蛋白',
    organism: 'Physeter catodon',
    pathway: ['氧气储存', '肌肉代谢', '肌肉收缩'],
    geneName: 'MB',
    length: 154,
    function: '在肌肉细胞中储存氧气，在缺氧时释放氧气供肌肉使用。赋予肌肉红色。',
    category: '储存蛋白'
  },
  {
    id: 'rnase-a',
    name: 'Ribonuclease A',
    pdbId: '7RSA',
    description: '核糖核酸酶 A',
    organism: 'Bos taurus',
    pathway: ['RNA 加工', '核酸代谢', 'RNA 降解'],
    geneName: 'RNASE1',
    length: 124,
    function: '催化 RNA 的降解，在消化系统中分解膳食 RNA。也是重要的研究工具酶。',
    category: '酶'
  },
  {
    id: 'trypsin',
    name: 'Trypsin',
    pdbId: '1G36',
    description: '胰蛋白酶',
    organism: 'Bos taurus',
    pathway: ['蛋白质消化', '胰酶级联', '蛋白质水解'],
    geneName: 'PRSS1',
    length: 223,
    function: '胰脏分泌的消化酶，负责在十二指肠中水解蛋白质。是丝氨酸蛋白酶家族的典型成员。',
    category: '酶'
  },
  {
    id: 'thioredoxin',
    name: 'Thioredoxin',
    pdbId: '1TRX',
    description: '硫氧还蛋白',
    organism: 'Escherichia coli',
    pathway: ['氧化还原', '二硫键形成', '抗氧化防御'],
    geneName: 'TXN',
    length: 108,
    function: '参与氧化还原反应，维持细胞蛋白质的还原状态。在抗氧化防御中起关键作用。',
    category: '氧化还原蛋白'
  },
  {
    id: 'ras',
    name: 'Ras Protein',
    pdbId: '5P21',
    description: 'Ras 蛋白',
    organism: 'Homo sapiens',
    pathway: ['细胞增殖', '信号转导', '细胞分化'],
    geneName: 'HRAS',
    length: 189,
    function: '细胞信号转导的关键开关，控制细胞生长和分裂。Ras 突变与多种癌症相关。',
    category: '信号蛋白'
  },
  {
    id: 'pk-a',
    name: 'Protein Kinase A',
    pdbId: '1ATP',
    description: '蛋白激酶 A',
    organism: 'Bos taurus',
    pathway: ['信号转导', '磷酸化', 'cAMP 信号'],
    geneName: 'PRKACA',
    length: 350,
    function: '被 cAMP 激活后磷酸化多种靶蛋白，调节细胞代谢、基因表达和离子通道活性。',
    category: '激酶'
  },
  {
    id: 'sod1',
    name: 'Superoxide Dismutase',
    pdbId: '2SOD',
    description: '超氧化物歧化酶',
    organism: 'Homo sapiens',
    pathway: ['抗氧化', 'ROS 清除', '氧化应激防御'],
    geneName: 'SOD1',
    length: 153,
    function: '清除超氧自由基，保护细胞免受氧化损伤。是体内重要的抗氧化酶。',
    category: '抗氧化蛋白'
  },
  {
    id: 'p53',
    name: 'P53',
    pdbId: '1TUP',
    description: '肿瘤抑制蛋白 P53',
    organism: 'Homo sapiens',
    pathway: ['细胞周期', 'DNA 修复', '细胞凋亡'],
    geneName: 'TP53',
    length: 393,
    function: '细胞的"基因组守护者"，监测 DNA 损伤并诱导细胞修复或凋亡。是最重要的肿瘤抑制因子。',
    category: '肿瘤抑制蛋白'
  },
  {
    id: 'calmodulin',
    name: 'Calmodulin',
    pdbId: '1CLL',
    description: '钙调蛋白',
    organism: 'Rattus norvegicus',
    pathway: ['钙信号', '酶调节', '离子通道调节'],
    geneName: 'CALM1',
    length: 148,
    function: '感知细胞内钙离子浓度，激活多种靶酶和离子通道。是钙信号传导的关键介质。',
    category: '钙结合蛋白'
  },
  {
    id: 'adh',
    name: 'Alcohol Dehydrogenase',
    pdbId: '6ADH',
    description: '乙醇脱氢酶',
    organism: 'Homo sapiens',
    pathway: ['酒精代谢', '氧化还原', '小分子代谢'],
    geneName: 'ADH1B',
    length: 374,
    function: '催化乙醇氧化为乙醛，是酒精代谢的关键酶。参与体内乙醇的分解。',
    category: '代谢酶'
  },
  {
    id: 'egfp',
    name: 'Enhanced GFP',
    pdbId: '2Y0G',
    description: '增强型绿色荧光蛋白',
    organism: 'Aequorea victoria',
    pathway: ['荧光成像', '生物标记', '蛋白质追踪'],
    geneName: 'EGFP',
    length: 239,
    function: 'GFP 的优化版本，荧光强度更高。广泛用于活细胞成像和蛋白质定位研究。',
    category: '荧光蛋白'
  },
  {
    id: 'chymotrypsin',
    name: 'Chymotrypsin',
    pdbId: '4CHA',
    description: '糜蛋白酶',
    organism: 'Bos taurus',
    pathway: ['蛋白质消化', '丝氨酸蛋白酶', '肽键水解'],
    geneName: 'CTRB1',
    length: 245,
    function: '胰脏分泌的消化酶，选择性水解芳香族氨基酸残基后的肽键。',
    category: '酶'
  }
];

const CATEGORIES = ['全部', '酶', '运输蛋白', '结构蛋白', '信号蛋白', '荧光蛋白', '调节蛋白', '抗氧化蛋白'];

export default function ProteinLibrary() {
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerInstanceRef = useRef<any>(null);
  const [selectedProtein, setSelectedProtein] = useState<Protein | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewStyle, setViewStyle] = useState<'cartoon' | 'stick' | 'sphere'>('cartoon');
  const [isSpinning, setIsSpinning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');

  const filteredProteins = PROTEIN_DATABASE.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         p.geneName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === '全部' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const loadStructure = async (pdbId: string) => {
    if (!viewerRef.current) return;

    setIsLoading(true);

    if (viewerInstanceRef.current) {
      viewerInstanceRef.current.spin(false);
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
        setIsSpinning(true);
      });
    } catch (err) {
      console.error('Failed to load structure:', err);
      viewer.setStyle({}, { stick: {} });
      viewer.render();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProtein = (protein: Protein) => {
    setSelectedProtein(protein);
    loadStructure(protein.pdbId);
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
      if (isSpinning) {
        viewerInstanceRef.current.spin(false);
        setIsSpinning(false);
      } else {
        viewerInstanceRef.current.spin('y', 0.5);
        setIsSpinning(true);
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

  useEffect(() => {
    const handleResize = () => {
      if (viewerInstanceRef.current) {
        viewerInstanceRef.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="h-full overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-bold text-white flex items-center gap-3">
          <Microscope className="w-7 h-7 text-bio-cyan" />
          蛋白质数据库
        </h2>
        <div className="text-sm text-gray-400">
          共 {PROTEIN_DATABASE.length} 种已知蛋白质
        </div>
      </div>

      <div className="flex gap-4" style={{ height: 'calc(100vh - 160px)' }}>
        <div className="w-72 flex flex-col bg-space-800/50 rounded-xl border border-white/10 overflow-hidden">
          <div className="p-3 border-b border-white/10">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="搜索蛋白质..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-space-900/50 border border-white/10 rounded-lg text-white placeholder-gray-500 text-sm focus:outline-none focus:border-bio-cyan/50"
              />
            </div>
          </div>

          <div className="p-2 border-b border-white/10 overflow-x-auto">
            <div className="flex gap-1 min-w-max">
              {CATEGORIES.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded text-xs whitespace-nowrap transition-colors ${
                    selectedCategory === cat 
                      ? 'bg-bio-cyan/20 text-bio-cyan' 
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredProteins.map(protein => (
              <button
                key={protein.id}
                onClick={() => handleSelectProtein(protein)}
                className={`w-full p-3 text-left border-b border-white/5 transition-colors ${
                  selectedProtein?.id === protein.id 
                    ? 'bg-bio-cyan/10 border-l-2 border-l-bio-cyan' 
                    : 'hover:bg-white/5 border-l-2 border-l-transparent'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-8 h-8 rounded flex items-center justify-center flex-shrink-0 ${
                    selectedProtein?.id === protein.id ? 'bg-bio-cyan/20' : 'bg-space-700/50'
                  }`}>
                    <Dna className={`w-4 h-4 ${selectedProtein?.id === protein.id ? 'text-bio-cyan' : 'text-gray-400'}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-sm font-medium truncate ${
                      selectedProtein?.id === protein.id ? 'text-bio-cyan' : 'text-white'
                    }`}>
                      {protein.name}
                    </div>
                    <div className="text-xs text-gray-400">{protein.geneName}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          {selectedProtein ? (
            <>
              <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-4 bg-space-800/50 rounded-xl border border-white/10">
                    <h4 className="text-bio-cyan font-medium mb-2 flex items-center gap-2 text-sm">
                      <Info className="w-4 h-4" />
                      基本信息
                    </h4>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">基因名</span>
                        <span className="text-white font-mono">{selectedProtein.geneName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">物种来源</span>
                        <span className="text-white text-right max-w-[150px] truncate">{selectedProtein.organism}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">氨基酸数量</span>
                        <span className="text-white">{selectedProtein.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">PDB ID</span>
                        <a
                          href={`https://www.rcsb.org/structure/${selectedProtein.pdbId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-bio-cyan hover:underline flex items-center gap-1"
                        >
                          {selectedProtein.pdbId}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-space-800/50 rounded-xl border border-white/10">
                    <h4 className="text-yellow-400 font-medium mb-2 text-sm">蛋白质功能</h4>
                    <p className="text-gray-300 text-sm leading-relaxed">
                      {selectedProtein.function}
                    </p>
                  </div>

                  <div className="col-span-2 p-4 bg-space-800/50 rounded-xl border border-white/10">
                    <h4 className="text-purple-400 font-medium mb-2 text-sm">相关通路</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProtein.pathway.map((p, i) => (
                        <span key={i} className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex-shrink-0 bg-space-800/50 rounded-xl border border-white/10 overflow-hidden">
                <div className="p-4 border-b border-white/10">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-semibold text-white">{selectedProtein.name}</h3>
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded text-xs">
                        {selectedProtein.category}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex bg-space-700/50 rounded-lg p-1">
                        {(['cartoon', 'stick', 'sphere'] as const).map((style) => (
                          <button
                            key={style}
                            onClick={() => changeViewStyle(style)}
                            className={`px-2 py-0.5 rounded text-xs transition-colors ${
                              viewStyle === style ? 'bg-bio-cyan/20 text-bio-cyan' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {style === 'cartoon' ? '带状' : style === 'stick' ? '棍状' : '球状'}
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={toggleSpin}
                        className={`px-2 py-0.5 rounded text-xs transition-colors ${
                          isSpinning 
                            ? 'bg-red-500/20 text-red-400' 
                            : 'bg-space-700/50 text-gray-400 hover:text-white'
                        }`}
                      >
                        {isSpinning ? '停止' : '旋转'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="relative" style={{ height: '280px' }}>
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-space-900/80 z-10">
                      <Loader2 className="w-8 h-8 text-bio-cyan animate-spin" />
                    </div>
                  )}
                  <div ref={viewerRef} className="w-full h-full" />
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-space-800/50 rounded-xl border border-white/10">
              <div className="text-center text-gray-500">
                <Microscope className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p>从左侧列表选择蛋白质</p>
                <p className="text-xs mt-2">查看蛋白质结构和详细信息</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
