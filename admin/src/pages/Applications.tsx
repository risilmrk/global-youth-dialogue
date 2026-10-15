import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../utils/api';
import { Application } from '../types';
import {
  Inbox,
  Search,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
  ShieldCheck,
  AlertCircle,
  UserCheck
} from 'lucide-react';

export const Applications: React.FC = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isPresenter, setIsPresenter] = useState(false);

  const { data: applications = [], isLoading } = useQuery<Application[]>({
    queryKey: ['admin-applications', statusFilter],
    queryFn: () =>
      apiRequest<Application[]>(
        `/admin/applications${statusFilter !== 'all' ? `?status=${statusFilter}` : ''}`
      ),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status, notes, approvePresenter }: { id: string; status: string; notes?: string; approvePresenter?: boolean }) =>
      apiRequest(`/admin/applications/${id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, reviewNotes: notes, isApprovedPresenter: approvePresenter }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      setSelectedApp(null);
      setReviewNotes('');
      setIsPresenter(false);
    },
  });

  const filtered = applications.filter((app) => {
    const q = search.toLowerCase();
    return (
      app.applicantName.toLowerCase().includes(q) ||
      app.email.toLowerCase().includes(q) ||
      app.country.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Applicant Dossiers & Vetting</h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and deliberate on incoming membership requests from international youth debaters.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
            Total Dossiers: {applications.length}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, or country..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
          {['all', 'pending', 'under_review', 'approved', 'rejected'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                statusFilter === st
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {st.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
        {isLoading ? (
          <div className="p-12 text-center text-slate-500">Loading applicant records...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 space-y-2">
            <Inbox className="w-8 h-8 mx-auto text-slate-400" />
            <p className="font-semibold text-sm">No applications found matching the selected criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3 px-4">Applicant</th>
                  <th className="py-3 px-4">Country & Inst.</th>
                  <th className="py-3 px-4">Interests</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Submitted</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs text-slate-700 dark:text-slate-200">
                {filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">{app.applicantName}</div>
                      <div className="text-[11px] text-slate-500">{app.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div>{app.country}</div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[180px]">
                        {app.organization || 'Independent'}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[220px]">
                        {app.areasOfInterest?.slice(0, 2).map((a: string, i: number) => (
                          <span
                            key={i}
                            className="px-1.5 py-0.5 rounded text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 truncate"
                          >
                            {a}
                          </span>
                        ))}
                        {app.areasOfInterest?.length > 2 && (
                          <span className="text-[10px] text-slate-400">+{app.areasOfInterest.length - 2}</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                          app.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : app.status === 'rejected'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : app.status === 'under_review'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}
                      >
                        {app.status === 'approved' && <CheckCircle2 className="w-3 h-3" />}
                        {app.status === 'rejected' && <XCircle className="w-3 h-3" />}
                        {app.status === 'pending' && <Clock className="w-3 h-3" />}
                        {app.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-500">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          setSelectedApp(app);
                          setReviewNotes(app.reviewNotes || '');
                          setIsPresenter(app.isApprovedPresenter || false);
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Inspect</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Inspect / Review Modal */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6 shadow-2xl">
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {selectedApp.applicantName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedApp.email} • {selectedApp.country} • {selectedApp.organization || 'Independent'}
                </p>
              </div>
              <button
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-slate-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {/* Experience */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Debate & Academic Experience
              </h4>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                {selectedApp.experience}
              </p>
            </div>

            {/* Motivation */}
            <div className="space-y-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Motivation for Joining GYDE
              </h4>
              <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                {selectedApp.motivation}
              </p>
            </div>

            {/* Areas of interest */}
            <div className="space-y-1.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Academic Spheres of Interest
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedApp.areasOfInterest?.map((area: string, idx: number) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 text-xs font-semibold rounded bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800"
                  >
                    {area}
                  </span>
                ))}
              </div>
            </div>

            {/* Deliberation review notes */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Secretariat Review Notes (Internal Audit)
              </label>
              <textarea
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Enter observations, debate chamber suitability, or deliberation rationale..."
                rows={3}
                className="w-full p-2.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Presenter Accreditation Checkbox */}
            <div className="flex items-center gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800/40">
              <input
                type="checkbox"
                id="modalPresenterCheck"
                checked={isPresenter}
                onChange={(e) => setIsPresenter(e.target.checked)}
                className="w-4 h-4 text-indigo-600 rounded"
              />
              <label htmlFor="modalPresenterCheck" className="text-xs font-bold text-amber-900 dark:text-amber-200 cursor-pointer">
                Accredit as Keynote Presenter (permits slide upload and motion presentations)
              </label>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setSelectedApp(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={() =>
                    updateMutation.mutate({
                      id: selectedApp.id,
                      status: 'rejected',
                      notes: reviewNotes,
                    })
                  }
                  className="px-4 py-2 text-xs font-bold rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-sm"
                >
                  Reject Application
                </button>

                <button
                  type="button"
                  disabled={updateMutation.isPending}
                  onClick={() =>
                    updateMutation.mutate({
                      id: selectedApp.id,
                      status: 'approved',
                      notes: reviewNotes,
                      approvePresenter: isPresenter,
                    })
                  }
                  className="px-5 py-2 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
                >
                  Approve & Onboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
