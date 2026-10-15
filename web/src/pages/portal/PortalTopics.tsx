import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { Topic } from '../../types';
import { CATEGORIES } from '../../constants';
import { Lightbulb, Plus, CheckCircle2, AlertCircle, Clock, Sparkles } from 'lucide-react';

export const PortalTopics: React.FC = () => {
  const { isArabic } = useLanguage();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: CATEGORIES[0].id,
    description: '',
  });
  const [error, setError] = useState<string | null>(null);

  const { data: topics = [], isLoading } = useQuery<Topic[]>({
    queryKey: ['portal-topics-list'],
    queryFn: () => apiRequest<Topic[]>('/topics'),
  });

  const mutation = useMutation({
    mutationFn: (newTopic: any) =>
      apiRequest('/topics', {
        method: 'POST',
        body: JSON.stringify(newTopic),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-topics-list'] });
      setShowForm(false);
      setFormData({ title: '', category: CATEGORIES[0].id, description: '' });
      setError(null);
    },
    onError: (err: any) => {
      setError(err.message || 'Failed to submit topic proposal');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const getStatusBadge = (status: Topic['status']) => {
    switch (status) {
      case 'proposed':
        return <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold uppercase tracking-wider">Proposed</span>;
      case 'reviewing':
        return <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-800 text-[10px] font-bold uppercase tracking-wider">Under Review</span>;
      case 'approved':
        return <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold uppercase tracking-wider">Approved</span>;
      case 'scheduled':
        return <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider">Scheduled</span>;
      case 'completed':
        return <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-bold uppercase tracking-wider">Completed</span>;
      default:
        return <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">{status}</span>;
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {isArabic ? 'مسار القضايا والمقترحات' : 'Topic Proposals & Motion Pipeline'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isArabic ? 'اطرح قضايا نقاشية جديدة وتابع تقدمها في مسار دورة الحوار الخماسية' : 'Submit debate motions and track their progression through review to scheduling.'}
          </p>
        </div>

        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gyde-green hover:bg-gyde-green-light text-white font-bold text-xs shadow transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>{showForm ? 'Cancel' : 'Propose New Motion'}</span>
        </button>
      </div>

      {/* Proposal Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-6 sm:p-8 border-2 border-gyde-green/30 shadow-sm space-y-4">
          <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-gyde-gold" />
            <span>Submit a Motion Proposal</span>
          </h3>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Motion Title / Debate Resolution *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
              placeholder='e.g. This House would mandate open-weight source code for foundation AI models'
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Category Discipline *
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Academic Context & Clashing Arguments *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-gyde-green"
              placeholder="Outline the fundamental tension between affirmative and negative sides..."
            />
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="py-2.5 px-6 rounded-lg bg-gyde-green hover:bg-gyde-green-light text-white font-bold text-xs shadow"
          >
            {mutation.isPending ? 'Submitting...' : 'Propose Motion to Pipeline'}
          </button>
        </form>
      )}

      {/* Topics Pipeline List */}
      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-gyde-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Loading topic pipeline...</p>
        </div>
      ) : topics.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gyde-canvas-cardDark rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <Lightbulb className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">No topic proposals yet</h3>
          <p className="text-xs text-slate-500">Be the first to submit a motion for the upcoming cycle.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {topics.map((topic) => (
            <div
              key={topic.id}
              className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getStatusBadge(topic.status)}
                  <span className="text-xs font-semibold text-gyde-gold">{topic.category}</span>
                </div>
                <div className="text-xs text-slate-400">
                  Proposed by: <strong>{topic.proposedBy?.name || 'Delegate'}</strong>
                </div>
              </div>

              <div>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white">
                  {topic.title}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {topic.description}
                </p>
              </div>

              {topic.reviewNotes && (
                <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300">
                  <strong>Secretariat Review Note:</strong> {topic.reviewNotes}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
