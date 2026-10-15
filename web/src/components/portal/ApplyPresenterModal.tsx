import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import { CATEGORIES } from '../../constants';
import { apiRequest } from '../../utils/api';

interface ApplyPresenterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const ApplyPresenterModal: React.FC<ApplyPresenterModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { user } = useAuth();
  const { isArabic } = useLanguage();

  const [countryChapter, setCountryChapter] = useState('');
  const [sphere, setSphere] = useState(CATEGORIES[0]?.name || 'Geopolitics & International Relations');
  const [proposedTopic, setProposedTopic] = useState('');
  const [experience, setExperience] = useState('');
  const [dossierUrl, setDossierUrl] = useState('');
  const [preferredFormat, setPreferredFormat] = useState('15-min Keynote Briefing (Opening Research)');
  const [statementOfIntent, setStatementOfIntent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      setCountryChapter(user.country ? `${user.country} Delegation` : '');
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiRequest('/applications/presenter', {
        method: 'POST',
        body: JSON.stringify({
          countryChapter,
          sphere,
          proposedTopic,
          experience,
          dossierUrl: dossierUrl.trim() || undefined,
          preferredFormat,
          statementOfIntent,
        }),
      });

      setSuccessMsg('Your presenter application has been submitted successfully! The Coordinator Secretariat will review your credentials.');
      if (onSuccess) onSuccess();
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 2500);
    } catch (err: any) {
      setError(err?.message || 'Failed to submit presenter application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.25rem',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-dialog modal-wide"
        style={{
          background: 'var(--bg-card, #ffffff)',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '2rem',
          position: 'relative',
        }}
      >
        <button
          className="modal-close-btn"
          id="closeModalApplyPresenter"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            fontSize: '1.6rem',
            cursor: 'pointer',
            color: 'var(--text-muted, #64748b)',
            lineHeight: 1,
          }}
          aria-label="Close"
        >
          &times;
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <span
            className="badge presenter-status-badge"
            style={{
              background: 'rgba(72, 81, 186, 0.1)',
              color: 'var(--brand-primary, #4851BA)',
              fontWeight: 600,
              fontSize: '0.8rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '999px',
            }}
          >
            {isArabic ? 'اعتماد متحدث رسمي' : 'Presenter Accreditation'}
          </span>
          <span style={{ color: 'var(--text-muted, #64748b)', fontSize: '0.85rem' }}>
            {isArabic ? 'الحوار والتبادل الشبابي الدولي' : 'Global Youth Dialogue'}
          </span>
        </div>

        <h3
          className="modal-title serif-text"
          style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            color: 'var(--brand-navy, #0f172a)',
            margin: '0.25rem 0 0.5rem 0',
          }}
        >
          {isArabic ? 'التقديم للاعتماد كمتحدث رسمي' : 'Apply to Become an Official Presenter'}
        </h3>
        <p
          className="modal-subtitle"
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted, #64748b)',
            lineHeight: 1.5,
            marginBottom: '1.5rem',
          }}
        >
          {isArabic
            ? 'يمكن للمتحدثين المعتمدين اختيار أو إعداد مواضيع من بنك المواضيع وتقديم عروض بحثية من 10 إلى 30 دقيقة.'
            : 'Accredited presenters can choose or curate topics from the Topic Bank, deliver 10–30 min research briefings, and present keynotes in international dialogue sessions.'}
        </p>

        {error && (
          <div
            className="alert-box"
            style={{
              background: '#fef2f2',
              color: '#991b1b',
              border: '1px solid #fecaca',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        {successMsg && (
          <div
            className="alert-box"
            style={{
              background: '#f0fdf4',
              color: '#166534',
              border: '1px solid #bbf7d0',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.25rem',
              fontSize: '0.875rem',
            }}
          >
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} id="applyPresenterForm">
          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main, #1e293b)' }}>
                {isArabic ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                className="form-control"
                value={user?.name || ''}
                readOnly
                style={{
                  background: 'var(--bg-subtle, #f8fafc)',
                  cursor: 'not-allowed',
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  border: '1px solid var(--border-light, #e2e8f0)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main, #1e293b)' }}>
                {isArabic ? 'البريد الإلكتروني' : 'Email Address'}
              </label>
              <input
                type="email"
                className="form-control"
                value={user?.email || ''}
                readOnly
                style={{
                  background: 'var(--bg-subtle, #f8fafc)',
                  cursor: 'not-allowed',
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  border: '1px solid var(--border-light, #e2e8f0)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              />
            </div>
          </div>

          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main, #1e293b)' }}>
                {isArabic ? 'الدولة والانتماء الفرعي' : 'Country & Chapter Affiliation'}
              </label>
              <input
                type="text"
                className="form-control"
                required
                value={countryChapter}
                onChange={(e) => setCountryChapter(e.target.value)}
                placeholder="e.g. India Delegation, Brazil (Latin American Youth Chapter)"
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  border: '1px solid var(--border-light, #e2e8f0)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main, #1e293b)' }}>
                {isArabic ? 'المجال الأكاديمي الأساسي' : 'Primary Academic Sphere'}
              </label>
              <select
                className="form-control"
                value={sphere}
                onChange={(e) => setSphere(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  border: '1px solid var(--border-light, #e2e8f0)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: 'var(--bg-card, #ffffff)',
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {isArabic ? cat.nameAr : cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main, #1e293b)' }}>
              {isArabic ? 'الموضوع المقترح أو أطروحة العرض' : 'Proposed Topic or Thesis Dilemma to Present'}
            </label>
            <input
              type="text"
              className="form-control"
              required
              value={proposedTopic}
              onChange={(e) => setProposedTopic(e.target.value)}
              placeholder="e.g. Sovereign Debt Restructuring & Emerging Market Resilience in the Post-Bretton Woods Era"
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                border: '1px solid var(--border-light, #e2e8f0)',
                borderRadius: '8px',
                fontSize: '0.9rem',
              }}
            />
            <span style={{ display: 'block', fontSize: '0.78rem', color: 'var(--text-muted, #64748b)', marginTop: '0.25rem' }}>
              {isArabic ? 'يمكنك اقتراح موضوع مخصص أو اختيار موضوع من بنك المواضيع الأكاديمي.' : 'You may propose a custom topic or mention a topic from the Academic Topic Bank.'}
            </span>
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main, #1e293b)' }}>
              {isArabic ? 'الخلفية الأكاديمية والخطابية' : 'Academic, Public Speaking, or Debate Background'}
            </label>
            <textarea
              className="form-control"
              rows={3}
              required
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              placeholder="Detail past tournaments (e.g. ISDC7, WSDC, university debating), published youth essays, or research briefings you have delivered..."
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                border: '1px solid var(--border-light, #e2e8f0)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div className="form-grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main, #1e293b)' }}>
                {isArabic ? 'رابط الملف / العرض التقديمي (اختياري)' : 'Dossier / Slide Deck Link / Paper URL (Optional)'}
              </label>
              <input
                type="url"
                className="form-control"
                value={dossierUrl}
                onChange={(e) => setDossierUrl(e.target.value)}
                placeholder="https://drive.google.com/... or https://slides.com/..."
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  border: '1px solid var(--border-light, #e2e8f0)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                }}
              />
            </div>
            <div className="form-group">
              <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main, #1e293b)' }}>
                {isArabic ? 'شكل العرض المفضل' : 'Preferred Presentation Format'}
              </label>
              <select
                className="form-control"
                value={preferredFormat}
                onChange={(e) => setPreferredFormat(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.85rem',
                  border: '1px solid var(--border-light, #e2e8f0)',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: 'var(--bg-card, #ffffff)',
                }}
              >
                <option value="15-min Keynote Briefing (Opening Research)">15-min Keynote Briefing (Opening Research)</option>
                <option value="30-min Comprehensive Masterclass">30-min Comprehensive Masterclass</option>
                <option value="10-min Lightning Debate Opener">10-min Lightning Debate Opener</option>
                <option value="Interactive Policy Roundtable Lead">Interactive Policy Roundtable Lead</option>
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.35rem', color: 'var(--text-main, #1e293b)' }}>
              {isArabic ? 'بيان القصد والمعايير الأكاديمية' : 'Statement of Intent & Academic Rigor'}
            </label>
            <textarea
              className="form-control"
              rows={3}
              required
              value={statementOfIntent}
              onChange={(e) => setStatementOfIntent(e.target.value)}
              placeholder="Why do you wish to present at GYD? How will your presentation foster constructive, evidence-based dialogue among youth delegates?"
              style={{
                width: '100%',
                padding: '0.6rem 0.85rem',
                border: '1px solid var(--border-light, #e2e8f0)',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontFamily: 'inherit',
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={onClose}
              style={{
                padding: '0.6rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                border: '1px solid var(--border-light, #e2e8f0)',
                background: '#ffffff',
                color: 'var(--text-main, #1e293b)',
                cursor: 'pointer',
              }}
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                padding: '0.6rem 1.35rem',
                borderRadius: '8px',
                fontSize: '0.9rem',
                fontWeight: 600,
                background: 'var(--brand-primary, #4851BA)',
                color: '#ffffff',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
              <span>{loading ? (isArabic ? 'جارٍ الإرسال...' : 'Submitting...') : (isArabic ? 'إرسال طلب الاعتماد' : 'Submit Presenter Application')}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
