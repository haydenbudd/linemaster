import { type ReactNode } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './Footer';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A1628] text-[#F8FAFC]">
      <Navigation />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
