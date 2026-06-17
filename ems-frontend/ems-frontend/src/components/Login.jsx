import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    if (apiError) setApiError('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.username.trim()) newErrors.username = 'Username is required.';
    if (!form.password) newErrors.password = 'Password is required.';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    setApiError('');

    AuthService.login(form.username, form.password)
      .then((res) => {
        AuthService.saveUser({
          id: res.data.id,
          username: res.data.username,
        });
        navigate('/employees');
      })
      .catch((err) => {
        const message = err.response?.data?.error || 'Login failed. Please try again.';
        setApiError(message);
        setSubmitting(false);
      });
  };

  return (
    <div className="row justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="col-md-5 col-lg-4">
        <div className="text-center mb-4">
          <i className="bi bi-people-fill text-primary" style={{ fontSize: '2.5rem' }}></i>
          <h2 className="fw-bold mt-2 mb-1">Welcome back</h2>
          <p className="text-muted">Sign in with your database credentials</p>
        </div>

        {apiError && (
          <div className="alert alert-danger d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill"></i> {apiError}
          </div>
        )}

        <div className="card shadow-sm border-0">
          <div className="card-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="your_username"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  autoComplete="username"
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  autoComplete="current-password"
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                {submitting ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Signing in…</>
                ) : (
                  <><i className="bi bi-box-arrow-in-right me-2"></i>Sign In</>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center mt-3 text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-decoration-none fw-semibold">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
