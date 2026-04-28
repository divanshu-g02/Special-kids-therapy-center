import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { FormField, TextInput, PrimaryButton, Alert } from '../components/FormComponents';
import { loginUser, saveSession } from '../services/authService';

function PasswordInput({ error, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <TextInput type={show ? 'text' : 'password'} error={error} {...props} />
      <button type="button" onClick={() => setShow(s => !s)}
        style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#9CA3AF', display: 'flex', alignItems: 'center' }}>
        {show ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <path d="M14.12 14.12a3 3 0 11-4.24-4.24" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <line x1="3" y1="3" x2="21" y2="21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
          </svg>
        )}
      </button>
    </div>
  );
}

function validateField(name, value) {
  if (name === 'email') {
    if (!value) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email address';
  }
  if (name === 'password') {
    if (!value) return 'Password is required';
  }
  return '';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(key, value) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    if (touched[key]) setErrors(prev => ({ ...prev, [key]: validateField(key, value) }));
  }

  function handleBlur(key, value) {
    setTouched(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: validateField(key, value) }));
  }

  function validateAll() {
    const newErrors = {};
    Object.keys(form).forEach(k => {
      const err = validateField(k, form[k]);
      if (err) newErrors[k] = err;
    });
    setErrors(newErrors);
    setTouched({ email: true, password: true });
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);
    setApiError('');
    try {
      const data = await loginUser(form);
      saveSession(data);
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  const field = key => ({
    value: form[key],
    error: errors[key],
    onChange: e => handleChange(key, e.target.value),
    onBlur: e => handleBlur(key, e.target.value),
  });

  return (
    <AuthLayout>
      <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.1)', padding: '40px 44px', width: '100%', maxWidth: '420px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)' }}>

        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1A5F7A', marginBottom: '8px' }}>Secure Access</p>
          <h1 style={{ fontSize: '26px', fontFamily: "'DM Serif Display', serif", fontWeight: '400', color: '#111827', lineHeight: 1.2 }}>Sign in to your account</h1>
          <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px' }}>SKTC staff portal — authorised personnel only</p>
        </div>

        {apiError && <Alert type="error">{apiError}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <FormField label="Email address" error={errors.email}>
            <TextInput type="email" placeholder="you@sktc.org" autoComplete="email" {...field('email')} />
          </FormField>

          <FormField label="Password" error={errors.password}>
            <PasswordInput placeholder="••••••••" autoComplete="current-password" {...field('password')} />
          </FormField>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px', marginTop: '-4px' }}>
            <button type="button" onClick={() => alert('Contact your administrator to reset your password.')}
              style={{ background: 'none', border: 'none', color: '#1A5F7A', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}>
              Forgot password?
            </button>
          </div>

          <PrimaryButton type="submit" loading={loading} disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </PrimaryButton>
        </form>

        <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', marginTop: '20px' }}>
          New staff member?{' '}
          <Link to="/register" style={{ color: '#1A5F7A', fontWeight: '500', textDecoration: 'none' }}>Create an account</Link>
        </p>
      </div>
    </AuthLayout>
  );
}