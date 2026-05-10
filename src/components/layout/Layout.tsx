import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 pt-20 pb-8">
        {children}
      </main>
      <Footer />
      <div className="fixed bottom-6 right-6 md:hidden z-40">
        <MobileNav />
      </div>
    </div>
  );
}
