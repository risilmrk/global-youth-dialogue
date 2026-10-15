import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { countries } from 'countries-list';
import { useLanguage } from '../../context/LanguageContext';
import { apiRequest } from '../../utils/api';
import { CATEGORIES } from '../../constants';

// Sorted countries list derived from countries-list
const countryOptions = Object.entries(countries)
  .map(([code, c]) => ({
    code,
    name: c.name,
    native: c.native,
  }))
  .sort((a, b) => a.name.localeCompare(b.name));

interface JoinCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const JoinCommunityModal: React.FC<JoinCommunityModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { isArabic } = useLanguage();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Fields
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [country, setCountry] = useState('India');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2 Fields
  const [organization, setOrganization] = useState('');
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>([CATEGORIES[0]?.name || 'Geopolitics & International Relations']);
  const [experience, setExperience] = useState('');
  const [motivation, setMotivation] = useState('');

  // Step 3 Fields (OTP)
  const [otp, setOtp] = useState('');
  const [devOtp, setDevOtp] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const toggleInterest = (catName: string) => {
    setAreasOfInterest((prev) =>
      prev.includes(catName) ? prev.filter((c) => c !== catName) : [...prev, catName]
    );
  };

  // Step 1 -> Step 2 validation
  const handleNextToDetails = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!firstName.trim() || !lastName.trim()) {
      setError(isArabic ? 'يرجى إدخال الاسم الأول واسم العائلة.' : 'Please enter your first and last name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setError(isArabic ? 'يرجى إدخال بريد إلكتروني صالح.' : 'Please enter a valid email address.');
      return;
    }
    if (!country) {
      setError(isArabic ? 'يرجى اختيار دولتك.' : 'Please select your country.');
      return;
    }
    if (password.length < 6) {
      setError(isArabic ? 'كلمة المرور يجب أن لا تقل عن 6 أحرف.' : 'Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError(isArabic ? 'كلمات المرور غير متطابقة.' : 'Passwords do not match.');
      return;
    }

    setStep(2);
  };

  // Step 2 -> Step 3: Trigger OTP sending
  const handleSendOtpAndProceed = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (areasOfInterest.length === 0) {
      setError(isArabic ? 'يرجى اختيار مجال اهتمام واحد على الأقل.' : 'Please select at least one area of interest.');
      return;
    }

    setLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const res = await apiRequest<{ devOtp?: string }>('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: fullName,
        }),
      });

      if (res?.devOtp) {
        setDevOtp(res.devOtp);
      }

      setStep(3);
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to dispatch verification code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0 || loading) return;
    setError(null);
    setLoading(true);

    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      const res = await apiRequest<{ devOtp?: string }>('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          name: fullName,
        }),
      });

      if (res?.devOtp) {
        setDevOtp(res.devOtp);
      }

      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err: any) {
      setError(err?.message || 'Failed to resend verification code.');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify OTP and create application
  const handleVerifyAndSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanOtp = otp.trim();
    if (cleanOtp.length !== 6) {
      setError(isArabic ? 'يرجى إدخال رمز التحقق المكون من 6 أرقام.' : 'Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const normalizedEmail = email.trim().toLowerCase();
      const applicantName = `${firstName.trim()} ${lastName.trim()}`;

      // 1. Verify OTP
      await apiRequest('/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({
          email: normalizedEmail,
          otp: cleanOtp,
        }),
      });

      // 2. Submit Application
      await apiRequest('/applications', {
        method: 'POST',
        body: JSON.stringify({
          applicantName,
          email: normalizedEmail,
          password,
          country,
          organization: organization.trim(),
          experience: experience.trim() || 'Debate delegate applicant',
          motivation: motivation.trim() || 'Desire to contribute to international youth debate & exchange.',
          areasOfInterest,
          preferredLanguages: ['English'],
        }),
      });

      setSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err?.message || 'Verification or submission failed. Please check the code and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignInRedirect = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(5px)',
        zIndex: 10000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="modal-dialog"
        style={{
          background: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '540px',
          maxHeight: '94vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '2rem 2.25rem',
          position: 'relative',
        }}
      >
        {/* Close Button */}
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
            lineHeight: 1,
            padding: '0.25rem',
          }}
          aria-label="Close"
        >
          &times;
        </button>

        {success ? (
          <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'rgba(72, 81, 186, 0.12)',
                color: '#4851BA',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1.25rem',
                fontSize: '2rem',
                fontWeight: 'bold',
              }}
            >
              ✓
            </div>
            <h2 className="serif-text" style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.65rem' }}>
              {isArabic ? 'تم التحقق وتقديم طلبك بنجاح!' : 'Application Submitted!'}
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.925rem', lineHeight: 1.55, marginBottom: '1.75rem' }}>
              {isArabic
                ? 'تم التحقق من بريدك الإلكتروني بنجاح وتسجيل طلبك في سجل المراجعة. ستقوم الأمانة بإشعارك عند اعتماد العضوية.'
                : 'Your email has been verified and your community application is now queued for secretariat review. You can log in once approved.'}
            </p>
            <button
              onClick={handleSignInRedirect}
              className="btn btn-primary btn-lg"
              style={{
                width: '100%',
                padding: '0.8rem 1.5rem',
                borderRadius: '12px',
                fontWeight: 600,
                background: '#4851BA',
                color: '#ffffff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              {isArabic ? 'الانتقال إلى صفحة تسجيل الدخول' : 'Proceed to Sign In'} &rarr;
            </button>
          </div>
        ) : (
          <>
            {/* Top Badge */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '999px',
                  background: 'rgba(72, 81, 186, 0.08)',
                  color: '#4851BA',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                <span>{isArabic ? 'التسجيل في مجتمع GYDE' : 'GYDE Community Registration'}</span>
              </span>
            </div>

            {/* Title & Subtitle */}
            <h2
              className="serif-text"
              style={{
                fontSize: '1.65rem',
                fontWeight: 700,
                color: '#0f172a',
                textAlign: 'center',
                margin: '0 0 0.4rem 0',
              }}
            >
              {isArabic ? 'طلب العضوية في المجتمع الدولي' : 'Apply for Community Membership'}
            </h2>
            <p
              style={{
                fontSize: '0.88rem',
                color: '#64748b',
                textAlign: 'center',
                margin: '0 auto 1.5rem auto',
                lineHeight: 1.45,
                maxWidth: '420px',
              }}
            >
              {isArabic
                ? 'أكمل طلبك في 3 خطوات بسيطة للانضمام إلى شبكتنا الدولية من المناظرين الشباب.'
                : 'Complete your application in 3 steps to join our international network of young debaters.'}
            </p>

            {/* 3-Step Stepper Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1.75rem',
                position: 'relative',
                padding: '0 1rem',
              }}
            >
              {/* Stepper Connecting Lines */}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '45px',
                  right: '45px',
                  height: '2px',
                  background: '#e2e8f0',
                  zIndex: 1,
                }}
              >
                <div
                  style={{
                    height: '100%',
                    background: '#4851BA',
                    transition: 'width 0.3s ease',
                    width: step === 1 ? '0%' : step === 2 ? '50%' : '100%',
                  }}
                ></div>
              </div>

              {/* Step 1 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: step >= 1 ? '#4851BA' : '#f1f5f9',
                    color: step >= 1 ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    boxShadow: step === 1 ? '0 0 0 4px rgba(72, 81, 186, 0.15)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  1
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: step === 1 ? 700 : 500,
                    color: step === 1 ? '#0f172a' : '#64748b',
                    marginTop: '0.35rem',
                  }}
                >
                  {isArabic ? 'المعلومات الأساسية' : 'Basic Info'}
                </span>
              </div>

              {/* Step 2 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: step >= 2 ? '#4851BA' : '#ffffff',
                    border: step >= 2 ? 'none' : '2px solid #cbd5e1',
                    color: step >= 2 ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    boxShadow: step === 2 ? '0 0 0 4px rgba(72, 81, 186, 0.15)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  2
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: step === 2 ? 700 : 500,
                    color: step === 2 ? '#0f172a' : '#64748b',
                    marginTop: '0.35rem',
                  }}
                >
                  {isArabic ? 'التفاصيل والاهتمامات' : 'Details'}
                </span>
              </div>

              {/* Step 3 */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2 }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: step === 3 ? '#4851BA' : '#ffffff',
                    border: step === 3 ? 'none' : '2px solid #cbd5e1',
                    color: step === 3 ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.875rem',
                    fontWeight: 700,
                    boxShadow: step === 3 ? '0 0 0 4px rgba(72, 81, 186, 0.15)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  3
                </div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: step === 3 ? 700 : 500,
                    color: step === 3 ? '#0f172a' : '#64748b',
                    marginTop: '0.35rem',
                  }}
                >
                  {isArabic ? 'التحقق من البريد' : 'OTP Verification'}
                </span>
              </div>
            </div>

            {/* Error Banner */}
            {error && (
              <div
                style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  color: '#b91c1c',
                  padding: '0.75rem 1rem',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  marginBottom: '1.25rem',
                  lineHeight: 1.4,
                }}
              >
                {error}
              </div>
            )}

            {/* Step 1 Form: Basic Info */}
            {step === 1 && (
              <form onSubmit={handleNextToDetails}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem' }}>
                      {isArabic ? 'الاسم الأول' : 'First Name'} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tariq"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        background: '#f8fafc',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#4851BA')}
                      onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem' }}>
                      {isArabic ? 'اسم العائلة' : 'Last Name'} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Al-Mansoor"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        background: '#f8fafc',
                        outline: 'none',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#4851BA')}
                      onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '0.85rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem' }}>
                      {isArabic ? 'الدولة' : 'Country'} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <select
                      required
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        background: '#f8fafc',
                        outline: 'none',
                      }}
                    >
                      {countryOptions.map((c) => (
                        <option key={c.code} value={c.name}>
                          {c.name} {isArabic && c.native ? `(${c.native})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem' }}>
                      {isArabic ? 'البريد الإلكتروني' : 'Email Address'} <span style={{ color: '#ef4444' }}>*</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="tariq@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.85rem',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        background: '#f8fafc',
                        outline: 'none',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#4851BA')}
                      onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                    />
                  </div>
                </div>

                <div style={{ marginBottom: '0.85rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem' }}>
                    {isArabic ? 'تعيين كلمة المرور' : 'Set Password'} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      placeholder="Minimum 6 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 2.5rem 0.65rem 0.85rem',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        background: '#f8fafc',
                        outline: 'none',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#4851BA')}
                      onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        padding: '0.2rem',
                      }}
                    >
                      {showPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                  <span style={{ display: 'block', fontSize: '0.76rem', color: '#64748b', marginTop: '0.25rem' }}>
                    {isArabic
                      ? 'ستستخدم كلمة المرور هذه لتسجيل الدخول بمجرد اعتماد عضويتك.'
                      : 'You will use this password to sign in once your membership is approved.'}
                  </span>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem' }}>
                    {isArabic ? 'تأكيد كلمة المرور' : 'Confirm Password'} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      placeholder="Re-enter password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.65rem 2.5rem 0.65rem 0.85rem',
                        border: '1.5px solid #e2e8f0',
                        borderRadius: '10px',
                        fontSize: '0.9rem',
                        background: '#f8fafc',
                        outline: 'none',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = '#4851BA')}
                      onBlur={(e) => (e.target.style.borderColor = '#e2e8f0')}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={{
                        position: 'absolute',
                        right: '0.75rem',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#94a3b8',
                        padding: '0.2rem',
                      }}
                    >
                      {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    background: '#4851BA',
                    color: '#ffffff',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span>{isArabic ? 'التالي: التفاصيل الإضافية' : 'Next: Additional Details'}</span>
                  <span>&rarr;</span>
                </button>

                <div style={{ textAlign: 'center', marginTop: '1.25rem', fontSize: '0.85rem', color: '#64748b' }}>
                  <span>{isArabic ? 'هل لديك حساب معتمد بالفعل؟' : 'Already have an approved account?'}</span>{' '}
                  <button
                    type="button"
                    onClick={handleSignInRedirect}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#4851BA',
                      fontWeight: 700,
                      cursor: 'pointer',
                      padding: 0,
                    }}
                  >
                    {isArabic ? 'تسجيل الدخول &larr;' : 'Sign In &rarr;'}
                  </button>
                </div>
              </form>
            )}

            {/* Step 2 Form: Details */}
            {step === 2 && (
              <form onSubmit={handleSendOtpAndProceed}>
                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem' }}>
                    {isArabic ? 'المؤسسة / المدرسة / الجامعة (اختياري)' : 'Organization / School / University (Optional)'}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Qatar Debate Alumni, Harvard Model UN, etc."
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '0.9rem',
                      background: '#f8fafc',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.45rem' }}>
                    {isArabic ? 'المجالات الأكاديمية ومحاور النقاش المفضلة' : 'Primary Academic Spheres of Interest'} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem', maxHeight: '130px', overflowY: 'auto', padding: '0.25rem 0' }}>
                    {CATEGORIES.map((cat) => {
                      const isSelected = areasOfInterest.includes(cat.name);
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => toggleInterest(cat.name)}
                          style={{
                            padding: '0.35rem 0.65rem',
                            borderRadius: '999px',
                            fontSize: '0.76rem',
                            fontWeight: isSelected ? 700 : 500,
                            background: isSelected ? '#4851BA' : '#f1f5f9',
                            color: isSelected ? '#ffffff' : '#475569',
                            border: '1px solid',
                            borderColor: isSelected ? '#4851BA' : '#e2e8f0',
                            cursor: 'pointer',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {isArabic ? cat.nameAr : cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem' }}>
                    {isArabic ? 'الخبرة التنافسية أو الخطابية السابقة' : 'Past Debate or Public Speaking Experience'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Participated in Qatar ISDC7, WSDC, local school debate tournaments..."
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      background: '#f8fafc',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem' }}>
                    {isArabic ? 'دافع الانضمام إلى الحوار الدولي' : 'Statement of Motivation'}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Why do you wish to join the GYDE international alumni chamber?"
                    value={motivation}
                    onChange={(e) => setMotivation(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.65rem 0.85rem',
                      border: '1.5px solid #e2e8f0',
                      borderRadius: '10px',
                      fontSize: '0.875rem',
                      background: '#f8fafc',
                      outline: 'none',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      background: '#ffffff',
                      color: '#475569',
                      border: '1.5px solid #cbd5e1',
                      cursor: 'pointer',
                    }}
                  >
                    &larr; {isArabic ? 'السابق' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary btn-lg"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      background: '#4851BA',
                      color: '#ffffff',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span>{loading ? (isArabic ? 'جارٍ إرسال الرمز...' : 'Sending Code...') : (isArabic ? 'التالي: رمز التحقق' : 'Next: Verify Email')}</span>
                    <span>&rarr;</span>
                  </button>
                </div>
              </form>
            )}

            {/* Step 3 Form: OTP Verification */}
            {step === 3 && (
              <form onSubmit={handleVerifyAndSubmit}>
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '50%',
                      background: 'rgba(72, 81, 186, 0.1)',
                      color: '#4851BA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 0.75rem',
                      fontSize: '1.5rem',
                    }}
                  >
                    ✉️
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', margin: '0 0 0.35rem 0' }}>
                    {isArabic ? 'التحقق من البريد الإلكتروني' : 'Verify Your Email'}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0, lineHeight: 1.45 }}>
                    {isArabic ? 'أرسلنا رمز تحقق مكوّناً من 6 أرقام إلى:' : "We've sent a 6-digit verification code to:"}
                    <br />
                    <strong style={{ color: '#0f172a' }}>{email}</strong>
                  </p>
                </div>

                {devOtp && (
                  <div
                    style={{
                      background: '#f0fdf4',
                      border: '1px dashed #22c55e',
                      borderRadius: '10px',
                      padding: '0.65rem 0.85rem',
                      marginBottom: '1.25rem',
                      textAlign: 'center',
                      fontSize: '0.85rem',
                      color: '#15803d',
                    }}
                  >
                    <strong>Dev Code:</strong> <span style={{ letterSpacing: '2px', fontWeight: 800 }}>{devOtp}</span>
                    <button
                      type="button"
                      onClick={() => setOtp(devOtp)}
                      style={{
                        marginLeft: '0.75rem',
                        padding: '0.2rem 0.5rem',
                        fontSize: '0.75rem',
                        background: '#22c55e',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Autofill Code
                    </button>
                  </div>
                )}

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.825rem', fontWeight: 600, color: '#1e293b', marginBottom: '0.35rem', textAlign: 'center' }}>
                    {isArabic ? 'رمز التحقق (6 أرقام)' : 'Enter 6-Digit Code'} <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    required
                    placeholder="123456"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    style={{
                      width: '100%',
                      maxWidth: '220px',
                      margin: '0 auto',
                      display: 'block',
                      padding: '0.75rem 1rem',
                      border: '2px solid #4851BA',
                      borderRadius: '12px',
                      fontSize: '1.5rem',
                      letterSpacing: '8px',
                      textAlign: 'center',
                      fontWeight: 700,
                      color: '#0f172a',
                      background: '#f8fafc',
                      outline: 'none',
                    }}
                  />
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{
                      padding: '0.75rem 1.25rem',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      background: '#ffffff',
                      color: '#475569',
                      border: '1.5px solid #cbd5e1',
                      cursor: 'pointer',
                    }}
                  >
                    &larr; {isArabic ? 'السابق' : 'Back'}
                  </button>
                  <button
                    type="submit"
                    disabled={loading || otp.length !== 6}
                    className="btn btn-primary btn-lg"
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      background: '#4851BA',
                      color: '#ffffff',
                      border: 'none',
                      cursor: loading || otp.length !== 6 ? 'not-allowed' : 'pointer',
                      opacity: loading || otp.length !== 6 ? 0.7 : 1,
                    }}
                  >
                    {loading ? (isArabic ? 'جارٍ التحقق...' : 'Verifying & Submitting...') : (isArabic ? 'تأكيد الرمز وتقديم الطلب' : 'Verify & Submit Application')}
                  </button>
                </div>

                <div style={{ textAlign: 'center', fontSize: '0.825rem', color: '#64748b' }}>
                  <span>{isArabic ? 'لم تستلم الرمز؟' : "Didn't receive the code?"}</span>{' '}
                  <button
                    type="button"
                    disabled={resendCooldown > 0 || loading}
                    onClick={handleResendOtp}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: resendCooldown > 0 ? '#94a3b8' : '#4851BA',
                      fontWeight: 700,
                      cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                      padding: 0,
                    }}
                  >
                    {resendCooldown > 0
                      ? `${isArabic ? 'إعادة الإرسال بعد' : 'Resend in'} ${resendCooldown}s`
                      : (isArabic ? 'إعادة إرسال الرمز' : 'Resend Code')}
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
};
