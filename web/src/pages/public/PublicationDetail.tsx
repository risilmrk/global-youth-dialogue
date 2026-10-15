import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { Publication } from '../../types';
import { ArrowLeft, BookOpen, Calendar, User, Share2, Quote, FileCheck } from 'lucide-react';

export const PublicationDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isArabic } = useLanguage();
  const navigate = useNavigate();

  const { data: paper, isLoading, isError } = useQuery<Publication>({
    queryKey: ['publication', slug],
    queryFn: () => apiRequest<Publication>(`/publications/${slug}`),
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="py-24 text-center">
        <div className="w-10 h-10 border-4 border-gyde-green border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-slate-500">Loading academic paper monograph...</p>
      </div>
    );
  }

  if (isError || !paper) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold">Paper Not Available</h2>
        <p className="text-slate-500">This paper might be reserved for members or currently in review.</p>
        <Link to="/publications" className="text-gyde-green font-semibold hover:underline">
          Back to Publications
        </Link>
      </div>
    );
  }

  const citationText = `${paper.authors?.map((a) => a.name).join(', ')} (${new Date(paper.publishedAt || paper.createdAt).getFullYear()}). "${paper.title}". Global Youth Dialogue & Exchange Academic Papers, Repository ID: ${paper.slug}. https://www.thegyde.in/publications/${paper.slug}`;

  const copyCitation = () => {
    navigator.clipboard.writeText(citationText);
    alert('Citation copied to clipboard!');
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <button
        onClick={() => navigate('/publications')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-gyde-green transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        <span>{isArabic ? 'العودة إلى الأوراق البحثية' : 'Back to Publications'}</span>
      </button>

      {/* Header & Metadata */}
      <header className="space-y-6 border-b border-slate-200 dark:border-slate-800 pb-8">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-50 dark:bg-emerald-950/60 text-gyde-green dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
            {paper.category}
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {new Date(paper.publishedAt || paper.createdAt).toLocaleDateString()}
          </span>
        </div>

        <h1 className="serif-heading text-3xl sm:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
          {isArabic && paper.titleAr ? paper.titleAr : paper.title}
        </h1>

        {/* Authors */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {paper.authors?.map((author, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gyde-green text-white text-xs font-bold flex items-center justify-center">
                {author.name.slice(0, 2).toUpperCase()}
              </div>
              <div className="text-xs">
                <div className="font-bold text-slate-900 dark:text-white">{author.name}</div>
                <div className="text-slate-500">{author.country} • {author.role || 'Fellow'}</div>
              </div>
            </div>
          ))}
        </div>
      </header>

      {/* Abstract Box */}
      <div className="p-6 sm:p-8 bg-gyde-green-subtle dark:bg-emerald-950/20 rounded-2xl border border-gyde-green/15 dark:border-emerald-800/30 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gyde-green dark:text-emerald-400">
          <FileCheck className="w-4 h-4" />
          <span>{isArabic ? 'ملخص الدراسة (Abstract)' : 'Abstract'}</span>
        </div>
        <p className="text-sm sm:text-base text-slate-800 dark:text-slate-200 leading-relaxed font-serif italic">
          "{isArabic && paper.abstractAr ? paper.abstractAr : paper.abstract}"
        </p>
      </div>

      {/* 8-Section Academic Monograph Body */}
      <div className="space-y-10">
        {paper.sections && paper.sections.length > 0 ? (
          paper.sections.map((section, idx) => (
            <section key={idx} className="space-y-3">
              <h2 className="serif-heading text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {isArabic && section.titleAr ? section.titleAr : section.title}
              </h2>
              <div className="text-slate-700 dark:text-slate-300 leading-relaxed space-y-4 text-base sm:text-lg">
                {(isArabic && section.contentAr ? section.contentAr : section.content)
                  .split('\n\n')
                  .map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
              </div>
            </section>
          ))
        ) : (
          <div className="prose dark:prose-invert max-w-none text-base sm:text-lg leading-relaxed">
            <p>{isArabic && (paper as any).contentAr ? (paper as any).contentAr : (paper as any).content || paper.abstract}</p>
          </div>
        )}
      </div>

      {/* Citation Box */}
      <footer className="pt-8 border-t border-slate-200 dark:border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            {isArabic ? 'كيفية الاقتباس الأكاديمي' : 'How to Cite This Paper (APA/Chicago)'}
          </h3>
          <button
            onClick={copyCitation}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-gyde-green dark:text-emerald-400 hover:underline"
          >
            <Quote className="w-3.5 h-3.5" />
            <span>Copy Citation</span>
          </button>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-900 rounded-xl text-xs font-mono text-slate-700 dark:text-slate-300 select-all border border-slate-200 dark:border-slate-800">
          {citationText}
        </div>
      </footer>
    </article>
  );
};
