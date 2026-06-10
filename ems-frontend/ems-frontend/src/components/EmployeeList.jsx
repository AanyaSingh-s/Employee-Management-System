import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteMsg, setDeleteMsg] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = () => {
    setLoading(true);
    EmployeeService.getAllEmployees()
      .then((res) => {
        setEmployees(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load employees. Make sure the backend is running.');
        setLoading(false);
        console.error(err);
      });
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete ${name}?`)) {
      EmployeeService.deleteEmployee(id)
        .then(() => {
          setDeleteMsg(`Employee "${name}" deleted successfully.`);
          fetchEmployees();
          setTimeout(() => setDeleteMsg(''), 3000);
        })
        .catch((err) => {
          setError('Failed to delete employee.');
          console.error(err);
        });
    }
  };

  const handleEdit = (id) => {
    navigate(`/update-employee/${id}`);
  };

  const statusBadge = (status) => {
    const map = {
      Active:    'bg-success',
      'On Leave':'bg-warning text-dark',
      Remote:    'bg-info text-dark',
      Probation: 'bg-secondary',
    };
    return map[status] || 'bg-secondary';
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <span className="ms-3 text-muted">Loading employees…</span>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold">Employee List</h2>
          <small className="text-muted">{employees.length} employee{employees.length !== 1 ? 's' : ''} found</small>
        </div>
        <Link to="/add-employee" className="btn btn-primary">
          <i className="bi bi-person-plus me-2"></i>Add Employee
        </Link>
      </div>

      {/* Alerts */}
      {deleteMsg && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          <i className="bi bi-check-circle me-2"></i>{deleteMsg}
          <button type="button" className="btn-close" onClick={() => setDeleteMsg('')}></button>
        </div>
      )}
      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <i className="bi bi-exclamation-triangle me-2"></i>{error}
          <button type="button" className="btn-close" onClick={() => setError('')}></button>
        </div>
      )}

      {/* Stats Row */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total',    value: employees.length,                                     color: 'primary', icon: 'bi-people' },
          { label: 'Active',   value: employees.filter(e => e.status === 'Active').length,  color: 'success', icon: 'bi-person-check' },
          { label: 'Remote',   value: employees.filter(e => e.status === 'Remote').length,  color: 'info',    icon: 'bi-wifi' },
          { label: 'On Leave', value: employees.filter(e => e.status === 'On Leave').length,color: 'warning', icon: 'bi-calendar-x' },
        ].map((stat) => (
          <div key={stat.label} className="col-6 col-md-3">
            <div className={`card border-0 text-white bg-${stat.color} bg-opacity-90 h-100`}>
              <div className="card-body d-flex align-items-center gap-3 py-3">
                <i className={`bi ${stat.icon} fs-3`}></i>
                <div>
                  <div className="fs-3 fw-bold lh-1">{stat.value}</div>
                  <div className="small opacity-75">{stat.label}</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      {employees.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
          <p>No employees yet. <Link to="/add-employee">Add the first one</Link>.</p>
        </div>
      ) : (
        <div className="card shadow-sm border-0">
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-dark">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Department</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Join Date</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, index) => (
                  <tr key={emp.id}>
                    <td className="text-muted">{index + 1}</td>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold"
                          style={{
                            width: 36, height: 36, fontSize: 13,
                            background: `hsl(${(emp.firstName?.charCodeAt(0) || 65) * 5 % 360}, 60%, 50%)`,
                            flexShrink: 0,
                          }}
                        >
                          {emp.firstName?.[0]}{emp.lastName?.[0]}
                        </div>
                        <span className="fw-medium">{emp.firstName} {emp.lastName}</span>
                      </div>
                    </td>
                    <td className="text-muted">{emp.email}</td>
                    <td className="text-muted">{emp.phone}</td>
                    <td>{emp.department}</td>
                    <td className="text-muted small">{emp.role}</td>
                    <td>
                      <span className={`badge ${statusBadge(emp.status)} px-2 py-1`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="text-muted small">{emp.joinDate}</td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-primary me-1"
                        onClick={() => handleEdit(emp.id)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(emp.id, `${emp.firstName} ${emp.lastName}`)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
