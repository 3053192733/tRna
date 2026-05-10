import { Link, useLocation } from 'react-router-dom';
import { Dna, Atom, Table2, Calculator, FlaskConical } from 'lucide-react';

const navItems = [
  { path: '/', label: '首页', icon: Dna },
  { path: '/analyzer', label: 'DNA分析器', icon: Atom },
  { path: '/codon', label: '密码子表', icon: Table2 },
  { path: '/calculator', label: '分子量计算', icon: Calculator },
  { path: '/trna', label: 'tRNA可视化', icon: FlaskConical },
];

export default function Header() {
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <Dna className="w-8 h-8 text-bio-cyan transition-all duration-300 group-hover:rotate-12" />
              <div className="absolute inset-0 bg-bio-cyan/20 blur-xl group-hover:bg-bio-cyan/40 transition-all duration-300" />
            </div>
            <span className="font-display text-xl font-bold tracking-wider text-white group-hover:text-bio-cyan transition-colors">
              tRna
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-300
                    ${isActive
                      ? 'bg-bio-cyan/20 text-bio-cyan border border-bio-cyan/50 shadow-[0_0_20px_rgba(0,212,170,0.2)]'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <button className="md:hidden p-2 text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
