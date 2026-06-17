import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Signup = () => {
  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });
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
    else if (!/^[a-zA-Z0-9_]{3,20}$/.test(form.username.trim()))
      newErrors.username = 'Use 3–20 letters, numbers, or underscores.';
    if (!form.password) newErrors.password = 'Password is required.';
    else if (form.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters.';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password.';
    else if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';
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

    AuthService.signup(form.username, form.password)
      .then((res) => {
        AuthService.saveUser({
          id: res.data.id,
          username: res.data.username,
        });
        navigate('/employees');
      })
      .catch((err) => {
        const message = err.response?.data?.error || 'Signup failed. Please try again.';
        setApiError(message);
        setSubmitting(false);
      });
  };

  return (
    <div className="row justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
      <div className="col-md-5 col-lg-4">
        <Link to="/login" className="btn btn-sm btn-outline-secondary mb-3">
          <i className="bi bi-arrow-left me-1"></i> Back to Login
        </Link>

        <div className="text-center mb-4">
          <i className="bi bi-person-plus-fill text-primary" style={{ fontSize: '2.5rem' }}></i>
          <h2 className="fw-bold mt-2 mb-1">Create account</h2>
          <p className="text-muted">Username and password are saved to MySQL</p>
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
                  placeholder="choose_a_username"
                  className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                  autoComplete="username"
                />
                {errors.username && <div className="invalid-feedback">{errors.username}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  autoComplete="new-password"
                />
                {errors.password && <div className="invalid-feedback">{errors.password}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label">Confirm Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter your password"
                  className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                  autoComplete="new-password"
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword}</div>
                )}
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={submitting}>
                {submitting ? (
                  <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Creating account…</>
                ) : (
                  <><i className="bi bi-person-check me-2"></i>Create Account</>
                )}
              </button>
            </form>
          </div>
        </div>

        <p className="text-center mt-3 text-muted">
          Already have an account?{' '}
          <Link to="/login" className="text-decoration-none fw-semibold">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
