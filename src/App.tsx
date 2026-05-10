import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import Layout from '@/components/layout/Layout';
import DNAHelix from '@/components/animations/DNAHelix';
import ParticleField from '@/components/animations/ParticleField';

const Home = lazy(() => import('@/pages/Home'));
const Analyzer = lazy(() => import('@/pages/Analyzer'));
const CodonTablePage = lazy(() => import('@/pages/CodonTable'));
const Calculator = lazy(() => import('@/pages/Calculator'));
const TRNAVisualizer = lazy(() => import('@/pages/TRNAVisualizer'));
const ProteinLibrary = lazy(() => import('@/pages/ProteinLibrary'));

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-bio-cyan/30 border-t-bio-cyan rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">加载中...</p>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <div className="gradient-animated min-h-screen">
        <DNAHelix />
        <ParticleField />
        <Layout>
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analyzer" element={<Analyzer />} />
              <Route path="/codon" element={<CodonTablePage />} />
              <Route path="/calculator" element={<Calculator />} />
              <Route path="/trna" element={<TRNAVisualizer />} />
              <Route path="/protein-library" element={<ProteinLibrary />} />
            </Routes>
          </Suspense>
        </Layout>
      </div>
    </Router>
  );
}
