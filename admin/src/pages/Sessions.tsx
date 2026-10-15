import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../utils/api';
import { DialogueSession } from '../types';
import {
  Calendar,
  Plus,
  Search,
  Video,
  ExternalLink,
  Users,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

export const Sessions: React.FC = () => {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    category: 'Technology & AI Ethics',
    description: '',
    scheduledAt: '',
    durationMinutes: 90,
    meetingUrl: 'https://meet.google.com/gyde-dialogue-room',
  });

  const { data: sessions = [], isLoading } = useQuery<DialogueSession[]>({
    queryKey: ['admin-sessions'],
    queryFn: () => apiRequest<DialogueSession[]>('/admin/sessions'),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof formData) =>
      apiRequest('/admin/sessions', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      setShowCreateModal(false);
      setFormData({
        title: '',
        category: 'Technology & AI Ethics',
        description: '',
        scheduledAt: '',
        durationMinutes: 90,
        meetingUrl: 'https://meet.google.com/gyde-dialogue-room',
      });
    },
  });

  const filtered = sessions.filter((s) => {
    const q = search.toLowerCase();
    return s.title.toLowerCase().includes(q) || s.category.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Sessions & Chambers</h1>
          <p className="text-sm text-slate-500 mt-1">
            Schedule bi-weekly parliamentary dialogue chambers, configure meeting rooms and assign presenters.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Session</span>
        </button>
      </div>

      {/* Search and List */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by motion or discipline..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading scheduled sessions...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Calendar className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">No dialogue sessions found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Title & Discipline</th>
                  <th className="py-3 px-4">Scheduled Date</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Meeting Room</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-200">
                {filtered.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{s.title}</div>
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">{s.category}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{new Date(s.scheduledAt).toLocaleDateString()}</div>
                      <div className="text-[11px] text-slate-500">{new Date(s.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({s.durationMinutes}m)</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800">
                        {s.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {s.meetingUrl ? (
                        <a href={s.meetingUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-indigo-600 hover:underline">
                          <Video className="w-3.5 h-3.5" />
                          <span>Google Meet</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 text-xs">Unassigned</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button className="px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Schedule Dialogue Chamber</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate(formData);
              }}
              className="space-y-4"
            >
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Session Motion / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. AI Sovereignty & Civil Liberties"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full mt-1 p-2 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Discipline</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full mt-1 p-2 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="Technology & AI Ethics">Technology & AI Ethics</option>
                  <option value="Geopolitics & International Relations">Geopolitics & International Relations</option>
                  <option value="Environment & Climate Policy">Environment & Climate Policy</option>
                  <option value="Governance & Civil Society">Governance & Civil Society</option>
                  <option value="Education & Future of Learning">Education & Future of Learning</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Scheduled Date & Time (UTC)</label>
                <input
                  type="datetime-local"
                  required
                  value={formData.scheduledAt}
                  onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                  className="w-full mt-1 p-2 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Meeting Room URL</label>
                <input
                  type="url"
                  required
                  value={formData.meetingUrl}
                  onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                  className="w-full mt-1 p-2 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Brief Overview</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary of proposition and opposition arguments..."
                  className="w-full mt-1 p-2 text-xs rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createMutation.isPending}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded shadow-sm"
                >
                  {createMutation.isPending ? 'Scheduling...' : 'Save & Publish Session'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
