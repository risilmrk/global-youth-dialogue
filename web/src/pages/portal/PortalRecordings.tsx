import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { DialogueSession } from '../../types';
import { Video, Shield, Calendar, ExternalLink, Play } from 'lucide-react';

export const PortalRecordings: React.FC = () => {
  const { isArabic } = useLanguage();

  const { data: sessions = [], isLoading } = useQuery<DialogueSession[]>({
    queryKey: ['portal-recordings'],
    queryFn: () => apiRequest<DialogueSession[]>('/sessions'),
  });

  const recordings = sessions.filter((s) => !!s.recordingUrl);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {isArabic ? 'أرشيف التسجيلات الخاصة' : 'Confidential Debate Video Archive'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isArabic
            ? 'تسجيلات فيديو غير مدرجة ومتاحة حصرياً للأعضاء المعتمدين لمراجعة الأداء والتحليل'
            : 'Unlisted video recordings of completed parliamentary sessions for research review and speaker development.'}
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-gyde-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Loading video archive...</p>
        </div>
      ) : recordings.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-gyde-canvas-cardDark rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <Video className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">No recordings uploaded yet</h3>
          <p className="text-xs text-slate-500">Recordings are posted within 24 hours after a debate concludes.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recordings.map((session) => (
            <div
              key={session.id}
              className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between"
            >
              <div className="h-44 bg-slate-900 relative flex items-center justify-center group">
                <div className="w-14 h-14 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 ml-0.5 fill-white" />
                </div>
                <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-black/70 text-[10px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                  {session.category}
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 text-[10px] font-semibold text-white backdrop-blur-sm">
                  {session.durationMinutes} mins
                </div>
              </div>

              <div className="p-6 space-y-3">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(session.scheduledAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white line-clamp-1">
                  {isArabic && session.titleAr ? session.titleAr : session.title}
                </h3>
                {session.motion && (
                  <p className="text-xs text-slate-600 dark:text-slate-400 italic line-clamp-2">
                    "{session.motion}"
                  </p>
                )}
                <div className="pt-2">
                  <a
                    href={session.recordingUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-gyde-green dark:text-emerald-400 hover:underline"
                  >
                    <span>Watch Private YouTube Recording</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
