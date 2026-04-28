import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../components/AuthLayout';
import { FormField, TextInput, SelectInput, PasswordStrength, PrimaryButton, Alert } from '../components/FormComponents';
import { registerUser, saveSession } from '../services/authService';

const ROLES = ['Admin', 'Receptionist', 'Doctor', 'Patient', 'Guardian'];

function PasswordInput({ error, onChange, onBlur, ...props }) {
  const [show, setShow] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <TextInput type={show ? 'text' : 'password'} error={error} onChange={onChange} onBlur={onBlur} {...props} />
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

function validateField(name, value, form) {
  switch (name) {
    case 'firstName':
      if (!value.trim()) return 'First name is required';
      if (value.trim().length < 2) return 'Must be at least 2 characters';
      if (value.trim().length > 50) return 'Maximum 50 characters';
      return '';
    case 'lastName':
      if (!value.trim()) return 'Last name is required';
      if (value.trim().length < 2) return 'Must be at least 2 characters';
      if (value.trim().length > 50) return 'Maximum 50 characters';
      return '';
    case 'email':
      if (!value) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email address';
      if (value.length > 100) return 'Maximum 100 characters';
      return '';
    case 'phoneNo':
      if (!value) return '';
      if (!/^\+?[\d\s\-()]{7,20}$/.test(value)) return 'Enter a valid phone number';
      return '';
    case 'role':
      if (!value) return 'Please select a role';
      return '';
    case 'password':
      if (!value) return 'Password is required';
      if (value.length < 8) return 'Minimum 8 characters';
      return '';
    case 'confirm':
      if (!value) return 'Please confirm your password';
      if (value !== form.password) return 'Passwords do not match';
      return '';
    default:
      return '';
  }
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phoneNo: '', role: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [apiError, setApiError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleChange(key, value) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    if (touched[key]) setErrors(prev => ({ ...prev, [key]: validateField(key, value, updated) }));
    if (key === 'password' && touched['confirm'])
      setErrors(prev => ({ ...prev, confirm: validateField('confirm', updated.confirm, updated) }));
  }

  function handleBlur(key, value) {
    setTouched(prev => ({ ...prev, [key]: true }));
    setErrors(prev => ({ ...prev, [key]: validateField(key, value, form) }));
  }

  function validateAll() {
    const newErrors = {};
    Object.keys(form).forEach(k => {
      const err = validateField(k, form[k], form);
      if (err) newErrors[k] = err;
    });
    setErrors(newErrors);
    setTouched(Object.keys(form).reduce((a, k) => ({ ...a, [k]: true }), {}));
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validateAll()) return;
    setLoading(true);
    setApiError('');
    try {
      const data = await registerUser(form);
      saveSession(data);         
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message || 'Registration failed. Please try again.');
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
      <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.1)', padding: '40px 44px', width: '100%', maxWidth: '460px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)' }}>

        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1A5F7A', marginBottom: '8px' }}>Registration</p>
          <h1 style={{ fontSize: '26px', fontFamily: "'DM Serif Display', serif", fontWeight: '400', color: '#111827', lineHeight: 1.2 }}>Create your account</h1>
          <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px' }}>Fill in your details to get started</p>
        </div>

        {apiError && <Alert type="error">{apiError}</Alert>}

        <form onSubmit={handleSubmit} noValidate>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <FormField label="First name" error={errors.firstName}>
              <TextInput placeholder="Aanya" autoComplete="given-name" {...field('firstName')} />
            </FormField>
            <FormField label="Last name" error={errors.lastName}>
              <TextInput placeholder="Sharma" autoComplete="family-name" {...field('lastName')} />
            </FormField>
          </div>

          <FormField label="Email address" error={errors.email}>
            <TextInput type="email" placeholder="you@sktc.org" autoComplete="email" {...field('email')} />
          </FormField>

          <FormField label="Phone number" error={errors.phoneNo}>
            <TextInput type="tel" placeholder="+92 300 0000000" autoComplete="tel" maxLength={20} {...field('phoneNo')} />
          </FormField>

          <FormField label="Role" error={errors.role}>
            <SelectInput {...field('role')}>
              <option value="">Select your role…</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </SelectInput>
          </FormField>

          <FormField label="Password" error={errors.password}>
            <PasswordInput placeholder="Min. 8 characters" autoComplete="new-password" {...field('password')} />
            <PasswordStrength password={form.password} />
          </FormField>

          <FormField label="Confirm password" error={errors.confirm}>
            <PasswordInput placeholder="Re-enter password" autoComplete="new-password" {...field('confirm')} />
            {form.confirm && form.confirm === form.password && !errors.confirm && (
              <p style={{ fontSize: '11px', color: '#1D9E75', marginTop: '5px' }}>✓ Passwords match</p>
            )}
          </FormField>

          <PrimaryButton type="submit" loading={loading} disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </PrimaryButton>
        </form>

        <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1A5F7A', fontWeight: '500', textDecoration: 'none' }}>Sign in</Link>
        </p>
      </div>
    </AuthLayout>
  );
}