import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ShieldAlert, Lock, Mail, AlertCircle, Sparkles } from 'lucide-react';

export const Login: React.FC = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err: any) {
      setError(err.message || 'Secretariat authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAdminDemo = async () => {
    setEmail('3681mubashircp@gmail.com');
    setPassword('368136');
    setLoading(true);
    setError(null);
    try {
      await login('3681mubashircp@gmail.com', '368136');
      navigate(redirect);
    } catch (err: any) {
      setError(err.message || 'Coordinator demo failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-slate-950 border border-slate-800 rounded-2xl p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-gyde-gold text-slate-950 font-black flex items-center justify-center mx-auto shadow-md">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-white tracking-tight">
            Administrator Portal Login
          </h1>
          <p className="text-xs text-slate-400">
            Strictly Restricted to Authorized Platform Administrators Only
          </p>
        </div>

        {/* 1-Click Administrator Demo Button */}
        <div className="bg-amber-950/40 border border-amber-800/40 rounded-xl p-3.5 text-xs text-amber-200 space-y-2">
          <div className="flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-gyde-gold" />
            <span>Chief Platform Administrator (1-Click)</span>
          </div>
          <p className="text-[11px] text-amber-300/80">
            Instant evaluation login as Executive Director & Super Admin Mubashir CP.
          </p>
          <button
            type="button"
            onClick={handleAdminDemo}
            className="w-full py-1.5 px-3 rounded bg-gyde-gold text-slate-950 font-bold hover:bg-gyde-gold-light transition-colors text-xs"
          >
            Sign in as Chief Administrator
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-900 flex items-center gap-2 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gyde-gold"
                placeholder="admin@thegyde.in"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-white text-sm focus:outline-none focus:ring-2 focus:ring-gyde-gold"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-gyde-green hover:bg-gyde-green-light disabled:opacity-50 text-white font-bold text-sm shadow transition-colors"
          >
            {loading ? 'Authenticating Secretariat...' : 'Enter Secretariat Console'}
          </button>
        </form>
      </div>
    </div>
  );
};
