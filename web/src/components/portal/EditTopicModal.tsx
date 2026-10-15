import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { Topic } from '../../types';
import { CATEGORIES } from '../../constants';

interface EditTopicModalProps {
  isOpen: boolean;
  topic: Topic | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditTopicModal: React.FC<EditTopicModalProps> = ({
  isOpen,
  topic,
  onClose,
  onSuccess,
}) => {
  const { isArabic } = useLanguage();

  const [title, setTitle] = useState('');
  const [motion, setMotion] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]?.id || '');
  const [subtopic, setSubtopic] = useState('');
  const [format, setFormat] = useState('Academic Discussion / Policy Roundtable');
  const [status, setStatus] = useState<string>('proposed');
  const [reviewNotes, setReviewNotes] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (topic) {
      setTitle(topic.title || '');
      setMotion(topic.motion || '');
      setDescription(topic.description || '');
      setCategory(topic.category || CATEGORIES[0]?.id || '');
      setSubtopic(topic.subtopic || '');
      setFormat(topic.format || 'Academic Discussion / Policy Roundtable');
      setStatus(topic.status || 'proposed');
      setReviewNotes(topic.reviewNotes || '');
    }
  }, [topic]);

  if (!isOpen || !topic) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await apiRequest(`/topics/${topic.id}/status`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: title.trim(),
          motion: motion.trim() || undefined,
          description: description.trim(),
          subtopic: subtopic.trim() || undefined,
          format: format.trim() || undefined,
          status,
          reviewNotes: reviewNotes.trim() || undefined,
        }),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update topic.');
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
          background: '#ffffff',
          borderRadius: '16px',
          width: '100%',
          maxWidth: '650px',
          maxHeight: '92vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '2rem',
          position: 'relative',
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#64748b',
          }}
          aria-label="Close"
        >
          &times;
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.35rem' }}>
          <span
            style={{
              background: 'rgba(72, 81, 186, 0.1)',
              color: '#4851BA',
              fontWeight: 700,
              fontSize: '0.78rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '999px',
            }}
          >
            {isArabic ? 'مراجعة وتنسيق القضايا' : 'Coordinator Motion Curation'}
          </span>
          {topic.interestedToPresent && (
            <span
              style={{
                background: 'rgba(158, 89, 172, 0.12)',
                color: '#9E59AC',
                fontWeight: 700,
                fontSize: '0.75rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '999px',
              }}
            >
              🎤 Speaker Volunteer
            </span>
          )}
        </div>

        <h3 className="serif-text" style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', margin: '0.25rem 0 0.5rem 0' }}>
          {isArabic ? 'مراجعة وتعديل القضية المقترحة' : 'Review & Edit Topic Motion'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
          {isArabic
            ? 'بصفتك منسقاً، يمكنك تنقيح صياغة القضية ومحتواها، تغيير حالتها الأكاديمية وإضافة ملاحظات التقييم.'
            : 'As an authorized coordinator, refine the motion text, update lifecycle status, and add review dossier notes.'}
        </p>

        {topic.proposedBy && (
          <div
            style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              padding: '0.6rem 0.85rem',
              marginBottom: '1rem',
              fontSize: '0.8rem',
              color: '#475569',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>
              <strong>{isArabic ? 'المقترح بواسطة:' : 'Proposed By:'}</strong>{' '}
              {topic.proposedBy.name} {topic.proposedBy.country ? `(${topic.proposedBy.country})` : ''}
            </span>
            <span style={{ color: '#94a3b8', fontSize: '0.75rem' }}>
              {new Date(topic.createdAt).toLocaleDateString()}
            </span>
          </div>
        )}

        {error && (
          <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
              {isArabic ? 'عنوان الموضوع' : 'Topic Title'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
              {isArabic ? 'صيغة القضية البرلمانية (Motion)' : 'Debate Motion ("This House Would...")'}
            </label>
            <input
              type="text"
              value={motion}
              onChange={(e) => setMotion(e.target.value)}
              placeholder="e.g. This House would establish a binding treaty on AI governance..."
              style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
                {isArabic ? 'حالة المراجعة والمسار' : 'Proposal Status'}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', background: '#fff' }}
              >
                <option value="proposed">Proposed (New Submission)</option>
                <option value="reviewing">Under Review (Assigned / Analyzing)</option>
                <option value="shortlisted">Shortlisted for Ballot</option>
                <option value="approved">Approved</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled for Live Session</option>
                <option value="completed">Completed</option>
                <option value="rejected">Rejected / Needs Revision</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
                {isArabic ? 'زاوية التركيز الفرعية' : 'Subtopic Focus'}
              </label>
              <input
                type="text"
                value={subtopic}
                onChange={(e) => setSubtopic(e.target.value)}
                placeholder="e.g. Global South representation"
                style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
              {isArabic ? 'صيغة الجلسة المقترحة' : 'Activity Format'}
            </label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', background: '#fff' }}
            >
              <option value="Academic Discussion / Policy Roundtable">Academic Discussion / Policy Roundtable</option>
              <option value="Oxford Parliamentary Debate">Oxford Parliamentary Debate</option>
              <option value="Topic Presentation & Research Briefing">Topic Presentation & Research Briefing</option>
              <option value="Academic Workshop / Resolution Drafting">Academic Workshop / Resolution Drafting</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
              {isArabic ? 'وصف القضية وسياقها' : 'Topic Description & Background'}
            </label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit' }}
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
              {isArabic ? 'ملاحظات وتوجيهات المنسق (تظهر للمقترح وأعضاء المنصة)' : 'Coordinator Review Notes & Advisory'}
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Motion verified against academic guidelines. Forwarded for scheduling."
              value={reviewNotes}
              onChange={(e) => setReviewNotes(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.875rem', fontFamily: 'inherit' }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{ padding: '0.6rem 1.25rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
            >
              {isArabic ? 'إلغاء' : 'Cancel'}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '0.6rem 1.35rem', borderRadius: '8px', fontSize: '0.875rem', fontWeight: 600, background: '#4851BA', color: '#fff', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
            >
              {loading ? (isArabic ? 'جارٍ الحفظ...' : 'Saving Changes...') : (isArabic ? 'حفظ وتحديث القضية' : 'Save Topic Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
