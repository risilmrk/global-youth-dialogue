import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { DialogueSession } from '../../types';
import { EditSessionModal } from '../../components/portal/EditSessionModal';
import { ArrowLeft, Calendar, Video, Clock, Users, Shield, ExternalLink, HelpCircle, Edit3 } from 'lucide-react';

export const PortalSessionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { isArabic } = useLanguage();
  const { isCoordinator } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data: session, isLoading, isError } = useQuery<DialogueSession>({
    queryKey: ['portal-session', id],
    queryFn: () => apiRequest<DialogueSession>(`/sessions/${id}`),
  });

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-8 h-8 border-4 border-gyde-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-500">Loading session briefing dossier...</p>
      </div>
    );
  }

  if (isError || !session) {
    return (
      <div className="text-center py-20 space-y-4">
        <h2 className="text-xl font-bold">Session Not Found</h2>
        <Link to="/portal/sessions" className="text-gyde-green text-sm font-semibold">
          Return to Sessions
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/portal/sessions')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-gyde-green"
        >
          <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
          <span>Back to Sessions</span>
        </button>

        {isCoordinator && (
          <button
            onClick={() => setIsEditOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isArabic ? 'تعديل بيانات الجلسة' : 'Edit Session'}</span>
          </button>
        )}
      </div>

      {/* Header */}
      <div className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950 text-gyde-green border border-emerald-200 dark:border-emerald-800">
            {session.category} • {session.format || 'Parliamentary Debate'}
          </span>
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Clock className="w-4 h-4" />
            <span>{new Date(session.scheduledAt).toLocaleString()} ({session.durationMinutes} mins)</span>
          </div>
        </div>

        <h1 className="serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {isArabic && session.titleAr ? session.titleAr : session.title}
        </h1>

        {session.motion && (
          <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border-l-4 border-gyde-gold rounded-r-xl text-sm font-semibold text-amber-950 dark:text-amber-200">
            <strong>Debate Motion:</strong> "{session.motion}"
          </div>
        )}

        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {isArabic && session.descriptionAr ? session.descriptionAr : session.description}
        </p>

        {session.meetingUrl && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">Confidential Chamber Link:</span>
            <a
              href={session.meetingUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow"
            >
              <Video className="w-4 h-4" />
              <span>Launch Google Meet</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Teams Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Proposition */}
        <div className="bg-white dark:bg-gyde-canvas-cardDark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="font-serif text-lg font-bold text-emerald-700 dark:text-emerald-400">
            Proposition Team (Government)
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {session.propositionTeam?.map((debater, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>{debater}</span>
              </li>
            )) || <li className="text-slate-400 italic">Speakers will be assigned shortly</li>}
          </ul>
        </div>

        {/* Opposition */}
        <div className="bg-white dark:bg-gyde-canvas-cardDark p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <h3 className="font-serif text-lg font-bold text-rose-700 dark:text-rose-400">
            Opposition Team (Loyal Opposition)
          </h3>
          <ul className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
            {session.oppositionTeam?.map((debater, i) => (
              <li key={i} className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                <span>{debater}</span>
              </li>
            )) || <li className="text-slate-400 italic">Speakers will be assigned shortly</li>}
          </ul>
        </div>
      </div>

      <EditSessionModal
        isOpen={isEditOpen}
        session={session}
        onClose={() => setIsEditOpen(false)}
        onSuccess={() => queryClient.invalidateQueries({ queryKey: ['portal-session', id] })}
      />
    </div>
  );
};
