import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORIES } from '../../constants';
import { ArrowLeft, Globe, Lightbulb, Compass, CheckCircle2 } from 'lucide-react';

export const TopicDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { isArabic } = useLanguage();
  const navigate = useNavigate();

  const category = CATEGORIES.find((c) => c.id === slug);

  if (!category) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold">Category Not Found</h2>
        <p className="text-slate-500">The requested topic category could not be found.</p>
        <Link to="/topics" className="text-gyde-green font-semibold hover:underline">
          Back to Topic Bank
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      <button
        onClick={() => navigate('/topics')}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-gyde-green transition-colors"
      >
        <ArrowLeft className="w-4 h-4 rtl:rotate-180" />
        <span>{isArabic ? 'العودة إلى بنك المواضيع' : 'Back to Topic Bank'}</span>
      </button>

      <div className="space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-gyde-green/10 text-gyde-green dark:text-emerald-400 flex items-center justify-center font-bold">
          <Globe className="w-7 h-7" />
        </div>
        <h1 className="serif-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
          {isArabic ? category.nameAr : category.name}
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
          {isArabic ? category.descriptionAr : category.description}
        </p>
      </div>

      <div className="bg-white dark:bg-gyde-canvas-cardDark rounded-2xl p-8 border border-slate-200 dark:border-slate-800 space-y-6">
        <h2 className="serif-heading text-2xl font-bold text-slate-900 dark:text-white">
          {isArabic ? 'القضايا والمحاور الفرعية المعتمدة' : 'Curated Debate Motions & Subtopics'}
        </h2>
        <div className="grid grid-cols-1 gap-4">
          {(isArabic ? category.subTopicsAr : category.subTopics).map((st, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-start gap-3"
            >
              <CheckCircle2 className="w-5 h-5 text-gyde-gold shrink-0 mt-0.5" />
              <div className="text-sm font-medium text-slate-800 dark:text-slate-200">{st}</div>
            </div>
          ))}
        </div>

        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">
            {isArabic
              ? 'هل ترغب في طرح قضية جديدة ضمن هذا المحور؟'
              : 'Interested in debating or submitting research on this track?'}
          </p>
          <Link
            to="/apply"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gyde-green hover:bg-gyde-green-light text-white text-sm font-semibold transition-colors"
          >
            <Lightbulb className="w-4 h-4 text-gyde-gold" />
            <span>{isArabic ? 'تقديم طلب للمناظرة' : 'Apply for this Track'}</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
