import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import AuthLayout from '../../components/auth/AuthLayout';
import { Field, Input, PasswordInput } from '../../components/ui/FormFields';
import Button from '../../components/ui/Buttons';
import { loginUser, saveSession } from '../../services/authService';

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
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(key, value) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    if (touched[key]) {
      setErrors(prev => ({ ...prev, [key]: validateField(key, value) }));
    }
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
    try {
      const data = await loginUser(form);
      saveSession(data);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Invalid email or password.');
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
      <div style={{ background: '#fff', borderRadius: '18px', border: '1px solid rgba(0,0,0,0.1)', padding: '40px 44px', width: '100%', maxWidth: '420px', boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.05)' }}>

        <div style={{ marginBottom: '32px' }}>
          <p style={{ fontSize: '11px', fontWeight: '500', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1A5F7A', marginBottom: '8px' }}>
            Secure Access
          </p>
          <h1 style={{ fontSize: '26px', fontFamily: "'DM Serif Display', serif", fontWeight: '400', color: '#111827', lineHeight: 1.2 }}>
            Sign in to your account
          </h1>
          <p style={{ fontSize: '13px', color: '#6B7280', marginTop: '6px' }}>
            SKTC staff portal — authorised personnel only
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <Field label="Email address" error={errors.email}>
            <Input
              type="email"
              placeholder="you@sktc.org"
              autoComplete="email"
              {...field('email')}
            />
          </Field>

          <Field label="Password" error={errors.password}>
            <PasswordInput
              placeholder="••••••••"
              autoComplete="current-password"
              {...field('password')}
            />
          </Field>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '24px', marginTop: '-4px' }}>
            <button
              type="button"
              onClick={() => alert('Contact your administrator to reset your password.')}
              style={{ background: 'none', border: 'none', color: '#1A5F7A', fontSize: '12px', cursor: 'pointer', fontWeight: '500' }}
            >
              Forgot password?
            </button>
          </div>

          <Button type="submit" fullWidth disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <p style={{ fontSize: '13px', color: '#6B7280', textAlign: 'center', marginTop: '20px' }}>
          New staff member?{' '}
          <Link to="/register" style={{ color: '#1A5F7A', fontWeight: '500', textDecoration: 'none' }}>
            Create an account
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}