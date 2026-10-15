import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../../utils/api';
import { Mail, CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiRequest('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Failed to dispatch password reset request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="serif-heading text-3xl font-bold text-slate-900 dark:text-white">
          Reset Password
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your registered email address and we'll dispatch a secure recovery token.
        </p>
      </div>

      {submitted ? (
        <div className="bg-white dark:bg-gyde-canvas-cardDark p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="text-lg font-bold">Check Your Email</h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            If an account exists for {email}, password recovery instructions have been sent.
          </p>
          <Link
            to="/login"
            className="inline-block text-xs font-bold text-gyde-green hover:underline pt-2"
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
              placeholder="kofi@example.com"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-gyde-green hover:bg-gyde-green-light disabled:opacity-50 text-white font-bold text-sm shadow transition-colors"
          >
            {loading ? 'Sending Instructions...' : 'Send Reset Link'}
          </button>

          <div className="text-center">
            <Link to="/login" className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-gyde-green">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Login</span>
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};
