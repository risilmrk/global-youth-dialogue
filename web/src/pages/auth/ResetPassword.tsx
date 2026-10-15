import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiRequest } from '../../utils/api';
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await apiRequest('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, newPassword }),
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. Token may have expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="serif-heading text-3xl font-bold text-slate-900 dark:text-white">
          Create New Password
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Enter your new credentials below to restore account access.
        </p>
      </div>

      {success ? (
        <div className="bg-white dark:bg-gyde-canvas-cardDark p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="text-lg font-bold">Password Reset Successful!</h2>
          <p className="text-xs text-slate-500">Redirecting you to sign in...</p>
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
              New Password
            </label>
            <input
              type="password"
              required
              minLength={6}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
              placeholder="At least 6 characters"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              Confirm New Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
              placeholder="Repeat password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-lg bg-gyde-green hover:bg-gyde-green-light disabled:opacity-50 text-white font-bold text-sm shadow transition-colors"
          >
            {loading ? 'Updating Password...' : 'Save New Password'}
          </button>
        </form>
      )}
    </div>
  );
};
