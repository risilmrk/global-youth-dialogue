import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../utils/api';
import { Publication } from '../types';
import { BookOpen, Plus, Search, CheckCircle2, FileText } from 'lucide-react';

export const Publications: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');

  const { data: publications = [], isLoading } = useQuery<Publication[]>({
    queryKey: ['admin-publications'],
    queryFn: () => apiRequest<Publication[]>('/admin/publications'),
  });

  const publishMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      apiRequest(`/admin/publications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-publications'] }),
  });

  const filtered = publications.filter((p) => {
    const q = search.toLowerCase();
    return p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Academic Research & Papers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, peer-assess, and publish delegate academic papers to the public digital repository.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search papers by title or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading research papers...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">No research papers found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filtered.map((paper) => (
              <div key={paper.id} className="p-4 space-y-2 hover:bg-slate-50 dark:hover:bg-slate-800/40">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">{paper.title}</h4>
                    <span className="text-[11px] text-indigo-600 dark:text-indigo-400 font-semibold">{paper.category}</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800">
                    {paper.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{paper.abstract}</p>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-800">
                  <div>Authors: <strong>{paper.authors?.map((a: any) => a.name).join(', ') || 'GYDE Fellows'}</strong></div>
                  {paper.status !== 'published' ? (
                    <button
                      onClick={() => publishMutation.mutate({ id: paper.id, status: 'published' })}
                      className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 text-white hover:bg-emerald-700"
                    >
                      Publish to Library
                    </button>
                  ) : (
                    <span className="text-emerald-600 font-semibold">Published</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
