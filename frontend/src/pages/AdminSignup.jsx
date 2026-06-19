import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { authApi } from '../api/services';
import { isAdmin, saveUser } from '../lib/auth';
import { btnPrimary, inputClass, labelClass } from '../lib/ui';
import Alert from '../components/Alert';

export default function AdminSignup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAdmin()) {
    return <Navigate to="/admin/approvals" replace />;
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
      const data = await authApi.adminSignup(form.username, form.password);
      saveUser({ id: data.id, username: data.username, role: data.role });
      navigate('/admin/login');
    } catch (err) {
      setApiError(err.message || 'Admin signup failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1B1B1E] flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link
          to="/"
          className="mb-8 inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-white/50 hover:text-white transition-colors"
        >
          <i className="ti ti-arrow-left"></i>
          Back to Homepage
        </Link>

        <div className="text-center mb-8">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center bg-white">
            <i className="ti ti-shield-plus text-2xl text-[#1B1B1E]"></i>
          </div>
          <h1 className="font-serif text-3xl text-white">Create Admin Account</h1>
          <p className="mt-2 text-sm text-white/50">Register to review and approve requests</p>
        </div>

        <Alert type="error" message={apiError} onClose={() => setApiError('')} />

        <form onSubmit={handleSubmit} className="border border-white/10 bg-white p-8 shadow-sm space-y-6">
          <div>
            <label className={labelClass}>Admin Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="choose_admin_username"
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

          <button type="submit" className={`${btnPrimary} w-full !bg-[#1B1B1E]`} disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create Admin Account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-white/50">
          Already have an admin account?{' '}
          <Link to="/admin/login" className="font-bold text-white hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
