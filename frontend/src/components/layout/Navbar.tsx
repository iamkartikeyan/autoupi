'use client';

import { useRouter } from 'next/navigation';
import BrandLogo from '@/components/ui/BrandLogo';

export default function Navbar() {
  const router = useRouter();

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#0A0B10]/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button onClick={() => router.push('/send')} className="flex items-center gap-3 active:scale-95 transition-transform">
          <BrandLogo size={36} />
          <span className="text-white font-bold text-xl tracking-tight">AutoPay <span className="text-primary-400">2.0</span></span>
        </button>
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/send')} className="text-slate-400 hover:text-white text-sm font-medium transition-colors px-2">Send</button>
          <button onClick={() => router.push('/dashboard')} className="text-slate-400 hover:text-white text-sm font-medium transition-colors px-2">Dashboard</button>
          <button onClick={() => router.push('/compare')} className="text-slate-400 hover:text-white text-sm font-medium transition-colors px-2">Compare</button>
          <button onClick={() => router.push('/explorer')} className="text-primary-400 hover:text-primary-300 text-sm font-bold transition-colors px-2">Explorer</button>
          <button onClick={() => router.push('/admin')} className="btn-primary py-2.5 px-6 text-sm">
            Admin
          </button>
        </div>
      </div>
    </nav>
  );
}
