import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dna, Atom, Table2, Calculator, FlaskConical, Microscope, Menu, X } from 'lucide-react';

const navItems = [
  { path: '/', label: '首页', icon: Dna },
  { path: '/analyzer', label: 'DNA分析器', icon: Atom },
  { path: '/codon', label: '密码子表', icon: Table2 },
  { path: '/calculator', label: '分子量计算', icon: Calculator },
  { path: '/protein-library', label: '蛋白质库', icon: Microscope },
  { path: '/trna', label: 'tRNA可视化', icon: FlaskConical },
];

export default function Header() {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <Dna className="w-7 h-7 text-bio-cyan transition-all duration-300 group-hover:rotate-12" />
            <span className="font-display text-lg font-bold tracking-wider text-white group-hover:text-bio-cyan transition-colors">
              tRna
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map(({ path, label, icon: Icon }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`
                    flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300
                    ${isActive
                      ? 'bg-bio-cyan/20 text-bio-cyan border border-bio-cyan/50'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pb-4 border-t border-white/10 pt-4">
            <div className="flex flex-col gap-1">
              {navItems.map(({ path, label, icon: Icon }) => {
                const isActive = location.pathname === path;
                return (
                  <Link
                    key={path}
                    to={path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-300
                      ${isActive
                        ? 'bg-bio-cyan/20 text-bio-cyan border-l-2 border-l-bio-cyan'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </Link>
                );
              })}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
