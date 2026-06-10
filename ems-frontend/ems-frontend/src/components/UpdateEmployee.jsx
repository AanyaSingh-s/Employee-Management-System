import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

const DEPARTMENTS = ['Engineering', 'Marketing', 'Finance', 'HR', 'Operations', 'Design', 'Sales', 'Legal'];
const ROLES       = ['Manager', 'Senior Engineer', 'Engineer', 'Analyst', 'Designer', 'Coordinator', 'Director', 'Specialist'];
const STATUSES    = ['Active', 'On Leave', 'Remote', 'Probation'];

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName:  '',
    lastName:   '',
    email:      '',
    phone:      '',
    department: '',
    role:       '',
    status:     'Active',
    joinDate:   '',
    salary:     '',
  });
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [apiError, setApiError]   = useState('');

  useEffect(() => {
    EmployeeService.getEmployeeById(id)
      .then((res) => {
        setForm(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setApiError('Failed to load employee data.');
        setLoading(false);
        console.error(err);
      });
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName.trim())   newErrors.firstName  = 'First name is required.';
    if (!form.lastName.trim())    newErrors.lastName   = 'Last name is required.';
    if (!form.email.trim())       newErrors.email      = 'Email is required.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
                                  newErrors.email      = 'Enter a valid email address.';
    if (!form.phone.trim())       newErrors.phone      = 'Phone number is required.';
    if (!form.department)         newErrors.department = 'Select a department.';
    if (!form.role)               newErrors.role       = 'Select a role.';
    if (!form.joinDate)           newErrors.joinDate   = 'Join date is required.';
    if (!form.salary)             newErrors.salary     = 'Salary is required.';
    else if (isNaN(Number(form.salary)) || Number(form.salary) <= 0)
                                  newErrors.salary     = 'Enter a valid salary amount.';
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

    EmployeeService.updateEmployee(id, form)
      .then(() => {
        setSuccessMsg(`${form.firstName} ${form.lastName}'s details were updated successfully!`);
        setSubmitting(false);
        setTimeout(() => navigate('/employees'), 1500);
      })
      .catch((err) => {
        setApiError('Failed to update employee. Please try again.');
        setSubmitting(false);
        console.error(err);
      });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3 text-muted">Loading employee details…</span>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-lg-8">
        {/* Header */}
        <div className="d-flex align-items-center gap-3 mb-4">
          <Link to="/employees" className="btn btn-sm btn-outline-secondary">
            <i className="bi bi-arrow-left"></i>
          </Link>
          <div>
            <h2 className="mb-0 fw-bold">Update Employee</h2>
            <small className="text-muted">
              Editing: <strong>{form.firstName} {form.lastName}</strong>
            </small>
          </div>
        </div>

        {/* Alerts */}
        {successMsg && (
          <div className="alert alert-success d-flex align-items-center gap-2">
            <i className="bi bi-check-circle-fill"></i> {successMsg}
          </div>
        )}
        {apiError && (
          <div className="alert alert-danger d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill"></i> {apiError}
          </div>
        )}

        {/* Form Card */}
        <div className="card shadow-sm border-0">
          <div className="card-header bg-warning bg-opacity-10 border-0 px-4 pt-4 pb-0">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                style={{
                  width: 48, height: 48, fontSize: 16,
                  background: `hsl(${(form.firstName?.charCodeAt(0) || 65) * 5 % 360}, 60%, 50%)`,
                }}
              >
                {form.firstName?.[0]}{form.lastName?.[0]}
              </div>
              <div>
                <div className="fw-bold">{form.firstName} {form.lastName}</div>
                <div className="text-muted small">{form.role} · {form.department}</div>
              </div>
            </div>
          </div>

          <div className="card-body p-4">
            <form onSubmit={handleSubmit} noValidate>
              {/* Personal Info */}
              <h6 className="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">
                Personal Information
              </h6>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">First Name <span className="text-danger">*</span></label>
                  <input
                    type="text" name="firstName" value={form.firstName}
                    onChange={handleChange}
                    className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                  />
                  {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name <span className="text-danger">*</span></label>
                  <input
                    type="text" name="lastName" value={form.lastName}
                    onChange={handleChange}
                    className={`form-control ${errors.lastName ? 'is-invalid' : ''}`}
                  />
                  {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email Address <span className="text-danger">*</span></label>
                  <input
                    type="email" name="email" value={form.email}
                    onChange={handleChange}
                    className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  />
                  {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone <span className="text-danger">*</span></label>
                  <input
                    type="tel" name="phone" value={form.phone}
                    onChange={handleChange}
                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                  />
                  {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                </div>
              </div>

              {/* Job Info */}
              <h6 className="text-muted text-uppercase small fw-bold mb-3 border-bottom pb-2">
                Job Information
              </h6>
              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label className="form-label">Department <span className="text-danger">*</span></label>
                  <select
                    name="department" value={form.department}
                    onChange={handleChange}
                    className={`form-select ${errors.department ? 'is-invalid' : ''}`}
                  >
                    <option value="">— Select department —</option>
                    {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
                  </select>
                  {errors.department && <div className="invalid-feedback">{errors.department}</div>}
                </div>
                <div className="col-md-6">
                  <label className="form-label">Role <span className="text-danger">*</span></label>
                  <select
                    name="role" value={form.role}
                    onChange={handleChange}
                    className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                  >
                    <option value="">— Select role —</option>
                    {ROLES.map((r) => <option key={r}>{r}</option>)}
                  </select>
                  {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Status</label>
                  <select name="status" value={form.status} onChange={handleChange} className="form-select">
                    {STATUSES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div className="col-md-4">
                  <label className="form-label">Join Date <span className="text-danger">*</span></label>
                  <input
                    type="date" name="joinDate" value={form.joinDate}
                    onChange={handleChange}
                    className={`form-control ${errors.joinDate ? 'is-invalid' : ''}`}
                  />
                  {errors.joinDate && <div className="invalid-feedback">{errors.joinDate}</div>}
                </div>
                <div className="col-md-4">
                  <label className="form-label">Annual Salary (₹) <span className="text-danger">*</span></label>
                  <input
                    type="number" name="salary" value={form.salary}
                    onChange={handleChange} min="0"
                    className={`form-control ${errors.salary ? 'is-invalid' : ''}`}
                  />
                  {errors.salary && <div className="invalid-feedback">{errors.salary}</div>}
                </div>
              </div>

              {/* Actions */}
              <div className="d-flex gap-2 justify-content-end border-top pt-3">
                <Link to="/employees" className="btn btn-outline-secondary px-4">Cancel</Link>
                <button type="submit" className="btn btn-warning px-4 text-dark" disabled={submitting}>
                  {submitting ? (
                    <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Saving…</>
                  ) : (
                    <><i className="bi bi-save me-2"></i>Save Changes</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEmployee;
