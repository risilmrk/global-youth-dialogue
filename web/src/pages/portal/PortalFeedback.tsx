import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest, ApiError } from '../../utils/api';
import { DialogueSession } from '../../types';
import { MessageSquareQuote, Star, CheckCircle2, AlertCircle, Send } from 'lucide-react';

export const PortalFeedback: React.FC = () => {
  const { isArabic } = useLanguage();

  const { data: sessions = [] } = useQuery<DialogueSession[]>({
    queryKey: ['feedback-sessions'],
    queryFn: () => apiRequest<DialogueSession[]>('/sessions'),
  });

  const [formData, setFormData] = useState({
    sessionId: '',
    ratings: {
      argumentation: 5,
      evidence: 5,
      delivery: 5,
      engagement: 5,
    },
    strengths: '',
    improvements: '',
    missingPerspectives: '',
    futureTopicSuggestions: '',
    visibility: 'presenter_and_staff',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRatingChange = (field: keyof typeof formData.ratings, value: number) => {
    setFormData((prev) => ({
      ...prev,
      ratings: { ...prev.ratings, [field]: value },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.sessionId) {
      setError('Please select a debate session to evaluate');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await apiRequest('/feedback', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setSuccess(true);
      setFormData({
        sessionId: '',
        ratings: { argumentation: 5, evidence: 5, delivery: 5, engagement: 5 },
        strengths: '',
        improvements: '',
        missingPerspectives: '',
        futureTopicSuggestions: '',
        visibility: 'presenter_and_staff',
      });
      setTimeout(() => setSuccess(false), 4000);
    } catch (err: any) {
      setError(err instanceof ApiError ? err.message : 'Failed to submit presentation feedback');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {isArabic ? 'نموذج التقييم النوعي للمتحدثين' : 'Qualitative Presentation Review'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isArabic
            ? 'تقييم بناء للأدلة والحجج ومنهجية التفكير النقدي لمساعدة الزملاء على التطور الأكاديمي'
            : 'Structured peer review evaluating argumentation depth, evidence sufficiency, and rebuttal technique.'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
        {success && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Thank you! Your constructive evaluation has been submitted to the speaker and secretariat.</span>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Session Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Select Dialogue Session *
          </label>
          <select
            required
            value={formData.sessionId}
            onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
          >
            <option value="">-- Choose a session --</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id}>
                {s.title} ({new Date(s.scheduledAt).toLocaleDateString()})
              </option>
            ))}
          </select>
        </div>

        {/* 4 Rating Dimensions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Argumentation */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Argumentation Depth (1-5)
              </label>
              <span className="text-xs font-bold text-gyde-gold">{formData.ratings.argumentation} / 5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={formData.ratings.argumentation}
              onChange={(e) => handleRatingChange('argumentation', parseInt(e.target.value, 10))}
              className="w-full accent-gyde-green"
            />
          </div>

          {/* Evidence */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Evidence Sufficiency (1-5)
              </label>
              <span className="text-xs font-bold text-gyde-gold">{formData.ratings.evidence} / 5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={formData.ratings.evidence}
              onChange={(e) => handleRatingChange('evidence', parseInt(e.target.value, 10))}
              className="w-full accent-gyde-green"
            />
          </div>

          {/* Delivery */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Rebuttal Precision & Delivery (1-5)
              </label>
              <span className="text-xs font-bold text-gyde-gold">{formData.ratings.delivery} / 5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={formData.ratings.delivery}
              onChange={(e) => handleRatingChange('delivery', parseInt(e.target.value, 10))}
              className="w-full accent-gyde-green"
            />
          </div>

          {/* Engagement */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Chamber Engagement & POIs (1-5)
              </label>
              <span className="text-xs font-bold text-gyde-gold">{formData.ratings.engagement} / 5</span>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              value={formData.ratings.engagement}
              onChange={(e) => handleRatingChange('engagement', parseInt(e.target.value, 10))}
              className="w-full accent-gyde-green"
            />
          </div>
        </div>

        {/* Written Review */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Core Strengths & Strongest Analytical Points *
          </label>
          <textarea
            required
            rows={3}
            value={formData.strengths}
            onChange={(e) => setFormData({ ...formData, strengths: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
            placeholder="Highlight the most persuasive claims, case study evidence, or rebuttal impact..."
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
            Constructive Recommendations for Improvement *
          </label>
          <textarea
            required
            rows={3}
            value={formData.improvements}
            onChange={(e) => setFormData({ ...formData, improvements: e.target.value })}
            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
            placeholder="How could the speaker strengthen burden of proof, address opposing counter-examples, or refine pacing?"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-6 rounded-lg bg-gyde-green hover:bg-gyde-green-light disabled:opacity-50 text-white font-bold text-sm shadow transition-colors inline-flex items-center justify-center gap-2"
        >
          <Send className="w-4 h-4" />
          <span>{loading ? 'Submitting Review...' : 'Submit Presentation Evaluation'}</span>
        </button>
      </form>
    </div>
  );
};
