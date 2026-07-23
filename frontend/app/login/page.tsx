'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAppStore } from '@/lib/store';
import { KeyRound, Mail, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const setUser = useAppStore((state) => state.setUser);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await api.login({ email, password });
      localStorage.setItem('access_token', res.tokens.access_token);
      localStorage.setItem('refresh_token', res.tokens.refresh_token);
      setUser(res.user);
      const redirectUrl = new URLSearchParams(window.location.search).get('redirect') || '/dashboard';
      router.push(redirectUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="font-serif text-3xl font-semibold text-paper">Welcome Back</h1>
        <p className="font-mono text-xs text-paper-dim uppercase tracking-wider">Sign in to your co-founder workspace</p>
      </div>

      <div className="bg-surface border border-line p-8 rounded space-y-6 shadow-xl">
        {error && (
          <div className="p-3 bg-coral/10 border border-coral/30 rounded text-coral font-mono text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="font-mono text-xs text-paper-dim uppercase">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-3.5 text-paper-dim" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="w-full bg-ink-2 border border-line focus:border-cyan text-paper pl-10 pr-3 py-2.5 rounded text-sm outline-none transition-colors"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-xs text-paper-dim uppercase">Password</label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-3.5 text-paper-dim" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-ink-2 border border-line focus:border-cyan text-paper pl-10 pr-10 py-2.5 rounded text-sm outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-paper-dim hover:text-paper transition-colors focus:outline-none"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan text-[#082024] font-mono text-xs uppercase font-bold py-3 rounded hover:bg-cyan/90 transition-all disabled:opacity-50 mt-2"
          >
            {loading ? 'Authenticating...' : 'Sign In →'}
          </button>
        </form>

        <div className="text-center font-mono text-xs text-paper-dim pt-2">
          Don't have an account?{' '}
          <Link href="/signup" className="text-cyan hover:underline">
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
