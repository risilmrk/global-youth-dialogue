import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Target, Compass, Sparkles, CheckCircle2 } from 'lucide-react';

export const Mission: React.FC = () => {
  const { isArabic } = useLanguage();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-gyde-green dark:text-emerald-300">
          <Target className="w-4 h-4 text-gyde-gold" />
          <span>{isArabic ? 'الرسالة والرؤية الاستراتيجية' : 'Our Mission & Strategic Vision'}</span>
        </div>
        <h1 className="serif-heading text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white">
          {isArabic ? 'رسالتنا وأهدافنا المشتركة' : 'Our Mission & Vision'}
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300">
          {isArabic
            ? 'تمكين الجيل القادم من القادة والمفكرين بالمهارات الجدلية والقدرة على فهم وجهات النظر العالمية المتعددة.'
            : 'Empowering future diplomats, researchers, and global problem solvers through structured debate, deep mutual listening, and scholarly documentation.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Mission Card */}
        <div className="bg-white dark:bg-gyde-canvas-cardDark p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-gyde-green text-white flex items-center justify-center font-bold">
            <Compass className="w-5 h-5" />
          </div>
          <h2 className="serif-heading text-2xl font-bold text-slate-900 dark:text-white">
            {isArabic ? 'رسالتنا' : 'Our Mission'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isArabic
              ? 'توفير فضاء دولي آمن ومحايد يتيح للمناظرين والباحثين الشباب من جميع أنحاء العالم تفكيك أكثر القضايا تعقيداً بالمنطق الرصين والأدلة، وبناء صداقات عابرة للحدود تساهم في إحلال التفاهم الإنساني وتجاوز الاستقطاب السياسي.'
              : 'To establish a dedicated, non-partisan international chamber where youth scholars disassemble complex global crises using empirical evidence and parliamentary inquiry, fostering transnational empathy beyond geopolitical boundaries.'}
          </p>
        </div>

        {/* Vision Card */}
        <div className="bg-white dark:bg-gyde-canvas-cardDark p-8 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-10 h-10 rounded-lg bg-gyde-gold text-slate-950 flex items-center justify-center font-bold">
            <Sparkles className="w-5 h-5" />
          </div>
          <h2 className="serif-heading text-2xl font-bold text-slate-900 dark:text-white">
            {isArabic ? 'رؤيتنا' : 'Our Vision'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {isArabic
              ? 'أن نكون المنصة الشبابية المرجعية عالمياً في مجال المناظرات البرلمانية وإنتاج الأوراق البحثية، التي تسهم توصياتها في إثراء صانعي السياسات الدولية والمؤسسات الأكاديمية برؤى جيل المستقبل.'
              : 'To stand as the premier global youth-led parliamentary dialogue assembly and research repository, whose synthesized policy papers inform international academic institutions and multilateral forums.'}
          </p>
        </div>
      </div>

      {/* Strategic Objectives */}
      <div className="bg-emerald-50/50 dark:bg-emerald-950/20 rounded-2xl p-8 border border-emerald-100 dark:border-emerald-900/40 space-y-6">
        <h3 className="serif-heading text-xl font-bold text-slate-900 dark:text-white">
          {isArabic ? 'الأهداف الاستراتيجية الأساسية' : 'Core Strategic Objectives'}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-700 dark:text-slate-300">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-gyde-green dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>{isArabic ? 'عقد مناظرات برلمانية محكمة كل أسبوعين عبر الإنترنت.' : 'Host bi-weekly moderated parliamentary debates connecting vetted delegates.'}</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-gyde-green dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>{isArabic ? 'نشر أوراق بحثية أكاديمية ناتجة عن كل حوار تنافسي.' : 'Synthesize debate findings into published academic research papers.'}</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-gyde-green dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>{isArabic ? 'تقديم تغذية راجعة نوعية وملاحظات تدريبية لكل متحدث.' : 'Provide constructive qualitative evaluation for all participating speakers.'}</span>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-gyde-green dark:text-emerald-400 shrink-0 mt-0.5" />
            <span>{isArabic ? 'توسيع الشراكات مع أندية المناظرات الجامعية والمدارس في أكثر من 30 دولة.' : 'Expand partnerships with university debate societies across 30+ nations.'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
