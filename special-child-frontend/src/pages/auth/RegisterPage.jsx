import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import { Field, Input, PasswordInput, Select, FieldRow } from '../../components/ui/FormFields';
import Button from '../../components/ui/Buttons';
import { registerUser, saveSession } from '../../services/authService';

const ROLES = ['Admin', 'Receptionist', 'Doctor', 'Patient', 'Guardian'];

function validateField(name, value, form) {
  switch (name) {
    case 'firstName':
      if (!value.trim()) return 'First name is required';
      if (value.trim().length < 2) return 'Must be at least 2 characters';
      return '';
    case 'lastName':
      if (!value.trim()) return 'Last name is required';
      if (value.trim().length < 2) return 'Must be at least 2 characters';
      return '';
    case 'email':
      if (!value) return 'Email is required';
      if (!/\S+@\S+\.\S+/.test(value)) return 'Enter a valid email address';
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

// Password strength indicator
function PasswordStrength({ password }) {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8)          score++;
  if (/[A-Z]/.test(password))        score++;
  if (/[0-9]/.test(password))        score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  const colors = ['', '#E24B4A', '#EF9F27', '#639922', '#1D9E75'];
  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div style={{ marginTop: '6px' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '4px' }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ flex: 1, height: '3px', borderRadius: '2px', background: score >= i ? colors[Math.min(score,4)] : 'rgba(0,0,0,0.1)', transition: 'background 0.2s' }} />
        ))}
      </div>
      <span style={{ fontSize: '11px', color: colors[score] || '#9CA3AF' }}>
        {labels[score]}
      </span>
    </div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form,    setForm]    = useState({ firstName: '', lastName: '', email: '', phoneNo: '', role: '', password: '', confirm: '' });
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(key, value) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    if (touched[key]) {
      setErrors(prev => ({ ...prev, [key]: validateField(key, value, updated) }));
    }
    // recheck confirm when password changes
    if (key === 'password' && touched['confirm']) {
      setErrors(prev => ({ ...prev, confirm: validateField('confirm', updated.confirm, updated) }));
    }
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
    try {
      const data = await registerUser(form);
      saveSession(data);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const field = key => ({
    value:    form[key],
    error:    errors[key],
    onChange: e => handleChange(key, e.target.value),
    onBlur:   e => handleBlur(key, e.target.value),
  });

  return (
    <AuthLayout>
      <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.1)', padding: '40px 44px', width: '100%', maxWidth: '460px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)' }}>

        <div style={{ marginBottom: '28px' }}>
          <p style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1A5F7A', marginBottom: '8px' }}>
            Registration
          </p>
          <h1 style={{ fontSize: '26px', fontFamily: "'DM Serif Display', serif", fontWeight: '400', color: '#111827', lineHeight: 1.2 }}>
            Create your account
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px' }}>
            Fill in your details to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <FieldRow>
            <Field label="First name" error={errors.firstName}>
              <Input placeholder="Aanya" autoComplete="given-name" {...field('firstName')} />
            </Field>
            <Field label="Last name" error={errors.lastName}>
              <Input placeholder="Sharma" autoComplete="family-name" {...field('lastName')} />
            </Field>
          </FieldRow>

          <Field label="Email address" error={errors.email}>
            <Input type="email" placeholder="you@sktc.org" autoComplete="email" {...field('email')} />
          </Field>

          <Field label="Phone number" error={errors.phoneNo}>
            <Input type="tel" placeholder="+92 300 0000000" autoComplete="tel" maxLength={20} {...field('phoneNo')} />
          </Field>

          <Field label="Role" error={errors.role}>
            <Select {...field('role')}>
              <option value="">Select your role...</option>
              {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
            </Select>
          </Field>

          <Field label="Password" error={errors.password}>
            <PasswordInput placeholder="Min. 8 characters" autoComplete="new-password" {...field('password')} />
            <PasswordStrength password={form.password} />
          </Field>

          <Field label="Confirm password" error={errors.confirm}>
            <PasswordInput placeholder="Re-enter password" autoComplete="new-password" {...field('confirm')} />
            {form.confirm && form.confirm === form.password && !errors.confirm && (
              <p style={{ fontSize: '11px', color: '#1D9E75', marginTop: '5px' }}>✓ Passwords match</p>
            )}
          </Field>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', marginTop: '20px' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1A5F7A', fontWeight: '500', textDecoration: 'none' }}>
            Sign in
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}