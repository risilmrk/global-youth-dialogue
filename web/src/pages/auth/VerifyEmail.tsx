import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest, ApiError } from '../../utils/api';
import { Mail, CheckCircle2, AlertCircle } from 'lucide-react';

export const VerifyEmail: React.FC = () => {
  const { isArabic } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const emailParam = searchParams.get('email') || '';

  const [email, setEmail] = useState(emailParam);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiRequest('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Invalid verification code');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    try {
      await apiRequest('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setMessage('A new 6-digit code has been dispatched to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to resend code');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-gyde-green text-white flex items-center justify-center mx-auto shadow-md">
          <Mail className="w-6 h-6" />
        </div>
        <h1 className="serif-heading text-3xl font-bold text-slate-900 dark:text-white">
          {isArabic ? 'تأكيد البريد الإلكتروني' : 'Verify Email Address'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isArabic ? 'ادخل رمز التحقق المكون من 6 أرقام لتفعيل حسابك' : 'Enter the 6-digit verification code sent to your email'}
        </p>
      </div>

      <form onSubmit={handleVerify} className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 flex items-center gap-2 text-rose-700 dark:text-rose-300 text-xs">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {message && (
          <div className="p-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-700 dark:text-emerald-300 text-xs">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{message}</span>
          </div>
        )}

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            {isArabic ? 'رمز التحقق (6 أرقام)' : '6-Digit Verification Code'}
          </label>
          <input
            type="text"
            required
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full text-center tracking-[8px] font-mono text-2xl py-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-gyde-green font-bold text-gyde-green"
            placeholder="000000"
          />
        </div>

        <button
          type="submit"
          disabled={loading || otp.length !== 6}
          className="w-full py-3 px-4 rounded-lg bg-gyde-green hover:bg-gyde-green-light disabled:opacity-50 text-white font-bold text-sm shadow transition-colors"
        >
          {loading ? 'Verifying...' : 'Verify Email & Activate'}
        </button>

        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || !email}
            className="text-xs text-gyde-green hover:underline font-semibold disabled:opacity-50"
          >
            {resending ? 'Sending new code...' : 'Resend Verification Code'}
          </button>
        </div>
      </form>
    </div>
  );
};
