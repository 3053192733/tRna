import { Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/10 py-8 mt-auto">
      <div className="container mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm flex items-center gap-2">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500 animate-pulse" />
            <span>for Molecular Biology</span>
          </p>
          <p className="text-gray-600 text-xs font-mono">
            tRna © {new Date().getFullYear()} — 生物信息学工具集合
          </p>
        </div>
      </div>
    </footer>
  );
}
