import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { DialogueSession } from '../../types';

interface EditSessionModalProps {
  isOpen: boolean;
  session: DialogueSession | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const EditSessionModal: React.FC<EditSessionModalProps> = ({
  isOpen,
  session,
  onClose,
  onSuccess,
}) => {
  const { isArabic } = useLanguage();

  const [title, setTitle] = useState('');
  const [motion, setMotion] = useState('');
  const [description, setDescription] = useState('');
  const [format, setFormat] = useState('Structured Parliamentary Debate');
  const [meetingUrl, setMeetingUrl] = useState('');
  const [recordingUrl, setRecordingUrl] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(90);
  const [status, setStatus] = useState<string>('scheduled');
  const [scheduledAt, setScheduledAt] = useState('');
  const [discussionQuestions, setDiscussionQuestions] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      setTitle(session.title || '');
      setMotion(session.motion || '');
      setDescription(session.description || '');
      setFormat(session.format || 'Structured Parliamentary Debate');
      setMeetingUrl(session.meetingUrl || '');
      setRecordingUrl(session.recordingUrl || '');
      setDurationMinutes(session.durationMinutes || 90);
      setStatus(session.status || 'scheduled');
      setDiscussionQuestions(
        Array.isArray(session.discussionQuestions)
          ? session.discussionQuestions.join('\n')
          : ''
      );
      if (session.scheduledAt) {
        const d = new Date(session.scheduledAt);
        const iso = d.toISOString().slice(0, 16);
        setScheduledAt(iso);
      }
    }
  }, [session]);

  if (!isOpen || !session) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const questionsList = discussionQuestions
        .split('\n')
        .map((q) => q.trim())
        .filter(Boolean);

      await apiRequest(`/sessions/${session.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          title: title.trim(),
          motion: motion.trim() || undefined,
          description: description.trim(),
          format: format.trim() || undefined,
          meetingUrl: meetingUrl.trim() || '',
          recordingUrl: recordingUrl.trim() || '',
          durationMinutes: Number(durationMinutes) || 90,
          status,
          scheduledAt: scheduledAt ? new Date(scheduledAt).toISOString() : session.scheduledAt,
          discussionQuestions: questionsList,
        }),
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to update session.');
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
          maxWidth: '680px',
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
            {isArabic ? 'إدارة الجلسات التنسيقية' : 'Coordinator Session Management'}
          </span>
        </div>

        <h3 className="serif-text" style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '0.25rem 0 0.5rem 0' }}>
          {isArabic ? 'تعديل تفاصيل الجلسة وغرفة النقاش' : 'Edit Assigned Dialogue Session'}
        </h3>
        <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
          {isArabic
            ? 'بصفتك منسقاً، يمكنك تحديث رابط غرفة اللقاء المباشر، صيغة المناظرة، والأسئلة التوجيهية.'
            : 'As an authorized coordinator, update the live meeting chamber link, debate motion, schedule, and briefings.'}
        </p>

        {error && (
          <div style={{ background: '#fef2f2', color: '#991b1b', border: '1px solid #fecaca', padding: '0.65rem 0.85rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.85rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
              {isArabic ? 'عنوان الجلسة' : 'Session Title'}
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
              {isArabic ? 'صيغة القضية / المناظرة' : 'Debate Motion'}
            </label>
            <input
              type="text"
              value={motion}
              onChange={(e) => setMotion(e.target.value)}
              placeholder="e.g. This House would abolish the veto power..."
              style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
                {isArabic ? 'حالة الجلسة' : 'Session Status'}
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', background: '#fff' }}
              >
                <option value="scheduled">Scheduled</option>
                <option value="live">Live Now (Chamber Open)</option>
                <option value="completed">Completed</option>
                <option value="draft">Draft</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
                {isArabic ? 'شكل الجلسة' : 'Activity Format'}
              </label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem', background: '#fff' }}
              >
                <option value="Structured Parliamentary Debate">Structured Parliamentary Debate</option>
                <option value="Academic Discussion / Policy Roundtable">Academic Discussion / Policy Roundtable</option>
                <option value="Topic Presentation & Research Briefing">Topic Presentation & Research Briefing</option>
                <option value="Academic Workshop / Resolution Drafting">Academic Workshop / Resolution Drafting</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
                {isArabic ? 'توقيت الجلسة' : 'Scheduled Date & Time'}
              </label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={(e) => setScheduledAt(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
                {isArabic ? 'المدة (بالدقائق)' : 'Duration (Minutes)'}
              </label>
              <input
                type="number"
                min={15}
                max={300}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
                {isArabic ? 'رابط غرفة الاجتماع (Google Meet)' : 'Live Meeting URL (Google Meet)'}
              </label>
              <input
                type="url"
                placeholder="https://meet.google.com/xyz-abc-def"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
                {isArabic ? 'رابط التسجيل المؤرشف (اختياري)' : 'Recording Video URL (Optional)'}
              </label>
              <input
                type="url"
                placeholder="https://youtube.com/watch?v=..."
                value={recordingUrl}
                onChange={(e) => setRecordingUrl(e.target.value)}
                style={{ width: '100%', padding: '0.6rem 0.85rem', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '0.9rem' }}
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '0.85rem' }}>
            <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.3rem' }}>
              {isArabic ? 'وصف وسياق الجلسة' : 'Session Context & Description'}
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
              {isArabic ? 'أسئلة ومحاور النقاش التوجيهية (سؤال في كل سطر)' : 'Discussion Questions (One per line)'}
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Does the current veto structure compromise collective security?&#10;What are feasible alternatives?"
              value={discussionQuestions}
              onChange={(e) => setDiscussionQuestions(e.target.value)}
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
              {loading ? (isArabic ? 'جارٍ الحفظ...' : 'Saving Changes...') : (isArabic ? 'حفظ التعديلات' : 'Save Session Changes')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
