import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiRequest } from '../utils/api';
import { Feedback as FeedbackType } from '../types';
import { MessageSquareQuote, Search, Star } from 'lucide-react';

export const Feedback: React.FC = () => {
  const [search, setSearch] = useState('');

  const { data: feedback = [], isLoading } = useQuery<FeedbackType[]>({
    queryKey: ['admin-feedback'],
    queryFn: () => apiRequest<FeedbackType[]>('/admin/feedback'),
  });

  const filtered = feedback.filter((f) => {
    const q = search.toLowerCase();
    const sessionTitle = f.sessionId?.title || '';
    const submitter = f.submittedBy?.name || '';
    return sessionTitle.toLowerCase().includes(q) || submitter.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Delegate Reviews & Feedback</h1>
        <p className="text-sm text-slate-500 mt-1">
          Peer reflections and ratings on presentation clarity, argument strength, and floor debate rigor.
        </p>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search feedback by session or member..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading delegate reviews...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <MessageSquareQuote className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">No peer reviews found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((item) => {
              const avgRating = item.ratings
                ? Math.round(
                    ((item.ratings.argumentation || 0) +
                      (item.ratings.evidence || 0) +
                      (item.ratings.delivery || 0) +
                      (item.ratings.engagement || 0)) /
                      4
                  )
                : 5;

              return (
                <div key={item.id} className="p-4 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-sm text-slate-900 dark:text-white">
                      {item.sessionId?.title || 'Chamber Dialogue Session'}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{avgRating}/5</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300">
                    <strong>Strengths:</strong> {item.strengths || 'N/A'}
                  </div>
                  {item.improvements && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      <strong>Improvements:</strong> {item.improvements}
                    </div>
                  )}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                    <div>
                      Review by: <strong className="text-slate-600 dark:text-slate-300">{item.submittedBy?.name || 'Anonymous'}</strong> ({item.submittedBy?.country || 'Global'})
                    </div>
                    <div>{new Date(item.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
