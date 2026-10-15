import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { Publication } from '../../types';
import { BookOpen, Calendar, ArrowRight, User } from 'lucide-react';

export const PortalPublications: React.FC = () => {
  const { isArabic } = useLanguage();

  const { data: publications = [], isLoading } = useQuery<Publication[]>({
    queryKey: ['portal-publications-all'],
    queryFn: () => apiRequest<Publication[]>('/publications'),
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="serif-heading text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
          {isArabic ? 'الأوراق البحثية والمكتبة الأكاديمية' : 'Academic Research Repository'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          {isArabic
            ? 'الوصول الكامل إلى مسودات الأوراق البحثية المحكمة والمطبوعات الأكاديمية'
            : 'Access complete monographs and academic syntheses published by the GYDE research fellows.'}
        </p>
      </div>

      {isLoading ? (
        <div className="py-20 text-center">
          <div className="w-8 h-8 border-4 border-gyde-green border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-500">Loading publications...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publications.map((paper) => (
            <div
              key={paper.id}
              className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950 text-gyde-green border border-emerald-200 dark:border-emerald-800">
                    {paper.category}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {new Date(paper.publishedAt || paper.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <h3 className="font-serif text-lg font-bold text-slate-900 dark:text-white line-clamp-2">
                  <Link to={`/publications/${paper.slug}`} className="hover:text-gyde-green">
                    {paper.title}
                  </Link>
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                  {paper.abstract}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {paper.authors?.map((a) => a.name).join(', ') || 'Fellow'}
                </span>
                <Link
                  to={`/publications/${paper.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-gyde-green hover:underline"
                >
                  <span>Read Paper</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
