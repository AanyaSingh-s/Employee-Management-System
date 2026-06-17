import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '../api/services';
import { isAuthenticated, saveUser } from '../lib/auth';
import { btnPrimary, inputClass, labelClass } from '../lib/ui';
import Alert from '../components/Alert';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const next = {};
    if (!form.username.trim()) next.username = 'Username is required.';
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username.trim()))
      next.username = 'Use 3–20 letters, numbers, or underscores.';
    if (!form.password) next.password = 'Password is required.';
    else if (form.password.length < 6) next.password = 'Password must be at least 6 characters.';
    if (!form.confirmPassword) next.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword) next.confirmPassword = 'Passwords do not match.';
    return next;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setApiError('');

    try {
      const data = await authApi.signup(form.username, form.password);
      saveUser({ id: data.id, username: data.username });
      navigate('/dashboard');
    } catch (err) {
      setApiError(err.message || 'Signup failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#0B2545]/60 hover:text-[#0B2545] transition-colors"
        >
          <i className="ti ti-arrow-left"></i>
          Back to Homepage
        </Link>

        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-[#0B2545] text-white">
            <i className="ti ti-user-plus text-2xl"></i>
          </div>
          <h1 className="font-serif text-3xl text-[#1B1B1E]">Create account</h1>
          <p className="mt-2 text-sm text-[#1B1B1E]/50">Your credentials are saved to the database</p>
        </div>

        <Alert type="error" message={apiError} onClose={() => setApiError('')} />

        <form onSubmit={handleSubmit} className="border border-[#E9ECEF] bg-white p-8 shadow-sm space-y-6">
          <div>
            <label className={labelClass}>Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="choose_a_username"
              className={`${inputClass} ${errors.username ? 'border-red-400' : ''}`}
              autoComplete="username"
            />
            {errors.username && <p className="mt-1 text-[10px] text-red-600">{errors.username}</p>}
          </div>

          <div>
            <label className={labelClass}>Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              className={`${inputClass} ${errors.password ? 'border-red-400' : ''}`}
              autoComplete="new-password"
            />
            {errors.password && <p className="mt-1 text-[10px] text-red-600">{errors.password}</p>}
          </div>

          <div>
            <label className={labelClass}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter your password"
              className={`${inputClass} ${errors.confirmPassword ? 'border-red-400' : ''}`}
              autoComplete="new-password"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-[10px] text-red-600">{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" className={`${btnPrimary} w-full`} disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-[#1B1B1E]/50">
          Already have an account?{' '}
          <Link to="/login" className="font-bold text-[#0B2545] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
