'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAppStore } from '@/lib/store';
import { api } from '@/lib/api';
import { Sparkles, LogOut, FolderKanban, PlusCircle } from 'lucide-react';

import { useEffect } from 'react';

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useAppStore();

  useEffect(() => {
    if (!user && typeof window !== 'undefined' && localStorage.getItem('access_token')) {
      api.me().then(setUser).catch(() => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setUser(null);
      });
    }
  }, [user, setUser]);

  const handleLogout = async () => {
    try {
      await api.logout();
    } catch (e) {
      // Ignore logout errors
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      router.push('/login');
    }
  };

  return (
    <header className="border-b border-line bg-ink/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-cyan/10 border border-cyan/40 flex items-center justify-center text-cyan group-hover:bg-cyan/20 transition-all">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="font-mono text-sm font-semibold tracking-wider text-paper uppercase flex items-center gap-2">
            <span>AI Startup</span>
            <span className="text-gold italic font-serif lowercase text-base">Co-Founder</span>
          </div>
        </Link>

        <nav className="flex items-center gap-4">
          {user ? (
            <>
              <Link
                href="/dashboard"
                className="font-mono text-xs text-paper-dim hover:text-cyan transition-colors flex items-center gap-2 px-3 py-1.5 rounded border border-line hover:border-cyan/40"
              >
                <FolderKanban className="w-3.5 h-3.5" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/projects/new"
                className="font-mono text-xs font-semibold bg-cyan text-[#082024] hover:bg-cyan/90 transition-all flex items-center gap-2 px-3.5 py-1.5 rounded"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New Project</span>
              </Link>
              <button
                onClick={handleLogout}
                className="font-mono text-xs text-paper-dim hover:text-coral transition-colors flex items-center gap-1.5 px-3 py-1.5"
                title="Logout"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              {pathname !== '/login' && (
                <Link
                  href="/login"
                  className="font-mono text-xs text-paper-dim hover:text-paper transition-colors px-3 py-1.5"
                >
                  Login
                </Link>
              )}
              {pathname !== '/signup' && (
                <Link
                  href="/signup"
                  className="font-mono text-xs font-semibold bg-cyan text-[#082024] hover:bg-cyan/90 transition-all px-4 py-1.5 rounded"
                >
                  Sign Up
                </Link>
              )}
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
