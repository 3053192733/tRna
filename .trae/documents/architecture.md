# tRna 技术架构文档

## 1. 架构设计

```
┌─────────────────────────────────────────────────────────┐
│                    前端层 (Frontend)                      │
│  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐    │
│  │ React   │  │ Tailwind│  │ Canvas  │  │ Zustand │    │
│  │ SPA     │  │ CSS     │  │ 动画    │  │ 状态管理 │    │
│  └─────────┘  └─────────┘  └─────────┘  └─────────┘    │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│                    数据层 (Data)                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │ 密码子表数据 │  │ 氨基酸属性  │  │ 原子量数据   │     │
│  │ (JSON)      │  │ (JSON)      │  │ (JSON)       │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
└─────────────────────────────────────────────────────────┘
```

## 2. 技术栈

| 技术 | 版本 | 用途 |
|------|------|------|
| React | 18.x | 用户界面框架 |
| Tailwind CSS | 3.x | 原子化 CSS 样式 |
| Zustand | 4.x | 轻量级状态管理 |
| Vite | 5.x | 构建工具 |
| Framer Motion | 11.x | 高级动画库 |

## 3. 路由定义

| 路由 | 页面 | 功能描述 |
|------|------|---------|
| `/` | 首页 | 工具导航、DNA 螺旋背景动画 |
| `/analyzer` | DNA/RNA 分析器 | 序列分析、转录翻译动画 |
| `/codon` | 密码子表 | 64 密码子可视化查询 |
| `/calculator` | 分子量计算器 | 分子量与浓度换算 |
| `/trna` | tRNA 可视化 | tRNA 三叶草结构动画 |

## 4. 组件架构

```
src/
├── components/
│   ├── layout/
│   │   ├── Header.tsx         # 顶部导航栏
│   │   ├── Sidebar.tsx        # 侧边工具栏
│   │   └── Footer.tsx         # 页脚
│   ├── ui/
│   │   ├── Button.tsx          # 按钮组件
│   │   ├── Card.tsx            # 卡片组件
│   │   ├── Input.tsx           # 输入框组件
│   │   └── Modal.tsx           # 模态框组件
│   ├── dna/
│   │   ├── SequenceInput.tsx   # 序列输入区
│   │   ├── ComplementChain.tsx  # 互补链动画
│   │   ├── Transcription.tsx    # 转录动画
│   │   └── Translation.tsx      # 翻译动画
│   ├── codon/
│   │   ├── CodonTable.tsx       # 密码子表格
│   │   └── AminoAcidCard.tsx     # 氨基酸详情卡
│   ├── calculator/
│   │   ├── MolecularWeight.tsx   # 分子量计算
│   │   └── Concentration.tsx     # 浓度换算
│   └── animations/
│       ├── DNAHelix.tsx         # DNA 双螺旋背景
│       ├── Particles.tsx         # 粒子效果
│       └── Nucleotide.tsx        # 碱基动画元素
├── pages/
│   ├── Home.tsx                 # 首页
│   ├── Analyzer.tsx            # DNA 分析器页面
│   ├── CodonTable.tsx           # 密码子表页面
│   ├── Calculator.tsx           # 计算器页面
│   └── TRNAVisualizer.tsx       # tRNA 可视化页面
├── data/
│   ├── codons.json              # 64 密码子数据
│   ├── aminoAcids.json          # 20 种氨基酸属性
│   └── atomicMasses.json        # 原子量数据
├── utils/
│   ├── sequence.ts              # 序列处理工具函数
│   ├── complement.ts            # 互补链生成
│   ├── transcription.ts         # DNA 转录为 RNA
│   ├── translation.ts           # 翻译为氨基酸
│   └── molecularWeight.ts       # 分子量计算
├── hooks/
│   ├── useAnimation.ts          # 动画控制钩子
│   └── useSequence.ts           # 序列输入状态钩子
└── store/
    └── useStore.ts              # Zustand 全局状态
```

## 5. 核心算法

### 5.1 DNA 互补链生成

```
输入: 5'-ATGCATGC-3'
输出: 3'-TACGTACG-5'

规则:
  A ↔ T
  G ↔ C
```

### 5.2 DNA 转录

```
输入: DNA 序列 (ATGC)
输出: mRNA 序列 (AUGC)

规则:
  DNA A → mRNA U
  DNA T → mRNA A
  DNA G → mRNA C
  DNA C → mRNA G
```

### 5.3 翻译（简并性）

```
输入: mRNA 序列 (每3个碱基为一个密码子)
输出: 氨基酸序列

终止密码子: UAA, UAG, UGA → 翻译终止
起始密码子: AUG → 甲硫氨酸 (Met)
```

### 5.4 分子量计算

```
DNA分子量 (双链) = (碱基对数 × 617.96) + 39.31  (g/mol)
DNA分子量 (单链) = (碱基对数 × 308.98) + 39.31  (g/mol)
RNA分子量 = (核苷酸数 × 321.98) + 17.04         (g/mol)
蛋白质分子量 = Σ(各氨基酸分子量) - (18 × 肽键数) (g/mol)
```

## 6. 动画实现方案

| 动画类型 | 实现方式 | 帧率目标 |
|---------|---------|---------|
| DNA 双螺旋背景 | Canvas 2D | 60fps |
| 粒子漂浮效果 | Canvas 2D | 60fps |
| 序列逐字显示 | Framer Motion | 60fps |
| 卡片入场动画 | Framer Motion | 60fps |
| 按钮悬停效果 | CSS Transitions | 60fps |
| 密码子高亮 | CSS + React State | 60fps |
| tRNA 结构绘制 | SVG + CSS | 60fps |

## 7. 数据文件结构

### 7.1 codons.json

```json
{
  "UUU": { "aminoAcid": "Phe", "name": "苯丙氨酸", "frequency": 0.45 },
  "UUC": { "aminoAcid": "Phe", "name": "苯丙氨酸", "frequency": 0.55 },
  ...
}
```

### 7.2 aminoAcids.json

```json
{
  "Phe": {
    "name": "苯丙氨酸",
    "abbr": "F",
    "molecularWeight": 147.18,
    "codons": ["UUU", "UUC"]
  },
  ...
}
```
