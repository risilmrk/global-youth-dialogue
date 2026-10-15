import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { DialogueSession } from '../../types';
import { EditSessionModal } from '../../components/portal/EditSessionModal';
import { Calendar, Video, ExternalLink, ArrowRight, Clock, Users, Shield, Edit3 } from 'lucide-react';

export const PortalSessions: React.FC = () => {
  const { user, isCoordinator } = useAuth();
  const { isArabic } = useLanguage();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<'all' | 'assigned' | 'scheduled' | 'completed'>('all');
  const [editingSession, setEditingSession] = useState<DialogueSession | null>(null);

  const { data: sessions = [], isLoading } = useQuery<DialogueSession[]>({
    queryKey: ['portal-sessions-list'],
    queryFn: () => apiRequest<DialogueSession[]>('/sessions'),
  });

  const filtered = sessions.filter((s) => {
    if (filter === 'assigned') {
      const coordId = typeof s.assignedCoordinator === 'object' ? (s.assignedCoordinator?.id || s.assignedCoordinator?._id) : s.assignedCoordinator;
      return coordId === user?.id || !s.assignedCoordinator;
    }
    if (filter === 'scheduled') return s.status === 'scheduled' || s.status === 'live';
    if (filter === 'completed') return s.status === 'completed';
    return true;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {isArabic ? 'جلسات ومناظرات الحوار' : 'Dialogue Sessions & Chambers'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {isArabic ? 'جدول الجلسات البرلمانية المباشرة ومسودات القضايا' : 'Scheduled live parliamentary sessions and debate chamber briefings'}
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'all' ? 'bg-white dark:bg-gyde-canvas-cardDark text-gyde-green shadow-sm' : 'text-slate-500'
            }`}
          >
            All Sessions
          </button>
          {isCoordinator && (
            <button
              onClick={() => setFilter('assigned')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                filter === 'assigned' ? 'bg-white dark:bg-gyde-canvas-cardDark text-gyde-green shadow-sm' : 'text-slate-500'
              }`}
            >
              Assigned to Me
            </button>
          )}
          <button
            onClick={() => setFilter('scheduled')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'scheduled' ? 'bg-white dark:bg-gyde-canvas-cardDark text-gyde-green shadow-sm' : 'text-slate-500'
            }`}
          >
            Upcoming
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              filter === 'completed' ? 'bg-white dark:bg-gyde-canvas-cardDark text-gyde-green shadow-sm' : 'text-slate-500'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-gyde-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Loading sessions...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gyde-canvas-cardDark rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <Calendar className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">No sessions found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {filtered.map((session) => (
            <div
              key={session.id}
              className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      session.status === 'live'
                        ? 'bg-red-500 text-white animate-pulse'
                        : session.status === 'scheduled'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                    }`}
                  >
                    {session.status}
                  </span>
                  <span className="text-xs font-semibold text-gyde-gold">
                    {session.category}
                  </span>
                  {isCoordinator && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                      🎯 {isArabic ? 'جلسة منسقة' : 'Coordinator Assigned'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{new Date(session.scheduledAt).toLocaleString()} ({session.durationMinutes} mins)</span>
                </div>
              </div>

              <div>
                <h2 className="serif-heading text-xl font-bold text-slate-900 dark:text-white">
                  {isArabic && session.titleAr ? session.titleAr : session.title}
                </h2>
                {session.motion && (
                  <p className="mt-1 text-xs font-semibold text-gyde-green dark:text-emerald-400 italic">
                    "{session.motion}"
                  </p>
                )}
                <p className="mt-2 text-xs text-slate-600 dark:text-slate-300 line-clamp-2">
                  {isArabic && session.descriptionAr ? session.descriptionAr : session.description}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Users className="w-4 h-4 text-gyde-gold" />
                  <span>{session.presenters?.map((p) => p.name).join(', ') || 'Delegates assigned'}</span>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  {isCoordinator && (
                    <button
                      type="button"
                      onClick={() => setEditingSession(session)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
                      title="Edit assigned session details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{isArabic ? 'تعديل الجلسة' : 'Edit Session'}</span>
                    </button>
                  )}

                  <Link
                    to={`/portal/sessions/${session.id}`}
                    className="text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-gyde-green"
                  >
                    View Briefing Dossier
                  </Link>

                  {session.meetingUrl && (session.status === 'scheduled' || session.status === 'live') && (
                    <a
                      href={session.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gyde-green hover:bg-gyde-green-light text-white text-xs font-bold shadow-sm"
                    >
                      <Video className="w-3.5 h-3.5" />
                      <span>Join Chamber</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}

                  {session.recordingUrl && session.status === 'completed' && (
                    <a
                      href={session.recordingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white dark:bg-slate-800 text-xs font-bold"
                    >
                      <Video className="w-3.5 h-3.5 text-red-500" />
                      <span>Watch Recording</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <EditSessionModal
        isOpen={!!editingSession}
        session={editingSession}
        onClose={() => setEditingSession(null)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['portal-sessions-list'] })}
      />
    </div>
  );
};
