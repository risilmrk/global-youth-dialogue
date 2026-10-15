import React, { useState } from 'react';
import { countries } from 'countries-list';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { UserCheck, CheckCircle2, AlertCircle, Save } from 'lucide-react';

const countryOptions = Object.entries(countries)
  .map(([code, c]) => ({
    code,
    name: c.name,
    native: c.native,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const PortalProfile: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { isArabic } = useLanguage();

  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    country: user?.country || '',
    organization: user?.organization || '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await apiRequest(`/users/${user?.id}/profile`, {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });
      await refreshUser();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h1 className="serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {isArabic ? 'الملف الشخصي والبيانات' : 'Delegate Profile'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isArabic ? 'تحديث المعلومات العامة والبيانات الأكاديمية' : 'Update your public affiliation, bio, and debate credentials.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
        {success && (
          <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Profile successfully updated!</span>
          </div>
        )}

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Full Name
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Email Address (Primary Account)
          </label>
          <input
            type="email"
            disabled
            value={user?.email || ''}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 text-sm text-slate-500 cursor-not-allowed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              {isArabic ? 'الدولة' : 'Country of Residence'}
            </label>
            <select
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
            >
              <option value="">{isArabic ? '-- اختر الدولة --' : '-- Select Country --'}</option>
              {countryOptions.map((c) => (
                <option key={c.code} value={c.name}>
                  {isArabic && c.native ? `${c.native} (${c.name})` : c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
              School, University, or Debate Club
            </label>
            <input
              type="text"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Short Delegate Biography
          </label>
          <textarea
            rows={3}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
            placeholder="Share your competitive debate background or research interests..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 py-2.5 px-6 rounded-lg bg-gyde-green hover:bg-gyde-green-light disabled:opacity-50 text-white font-bold text-xs shadow transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>{loading ? 'Saving...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
};
