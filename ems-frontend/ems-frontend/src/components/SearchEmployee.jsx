import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import EmployeeService from '../services/EmployeeService';

const SearchEmployee = () => {
  const [keyword, setKeyword]     = useState('');
  const [results, setResults]     = useState([]);
  const [searched, setSearched]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const navigate = useNavigate();

  const handleSearch = useCallback((e) => {
    e.preventDefault();
    if (!keyword.trim()) return;

    setLoading(true);
    setError('');

    EmployeeService.searchEmployees(keyword.trim())
      .then((res) => {
        setResults(res.data);
        setSearched(true);
        setLoading(false);
      })
      .catch((err) => {
        setError('Search failed. Make sure the backend is running.');
        setLoading(false);
        console.error(err);
      });
  }, [keyword]);

  const handleClear = () => {
    setKeyword('');
    setResults([]);
    setSearched(false);
    setError('');
  };

  const statusColor = (status) => {
    const map = {
      Active:    'success',
      'On Leave':'warning',
      Remote:    'info',
      Probation: 'secondary',
    };
    return map[status] || 'secondary';
  };

  return (
    <div className="row justify-content-center">
      <div className="col-lg-9">
        <div className="mb-4">
          <h2 className="fw-bold mb-0">Search Employees</h2>
          <small className="text-muted">Search by name, email, department, or role</small>
        </div>

        {/* Search Bar */}
        <div className="card shadow-sm border-0 mb-4">
          <div className="card-body p-4">
            <form onSubmit={handleSearch}>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-white border-end-0">
                  <i className="bi bi-search text-muted"></i>
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 ps-0"
                  placeholder="Type a name, email, department, or role…"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  autoFocus
                />
                {keyword && (
                  <button
                    type="button"
                    className="btn btn-outline-secondary border-start-0"
                    onClick={handleClear}
                    title="Clear"
                  >
                    <i className="bi bi-x-lg"></i>
                  </button>
                )}
                <button
                  type="submit"
                  className="btn btn-primary px-4"
                  disabled={!keyword.trim() || loading}
                >
                  {loading ? (
                    <span className="spinner-border spinner-border-sm" role="status"></span>
                  ) : 'Search'}
                </button>
              </div>
            </form>

            {/* Quick-filter chips */}
            <div className="mt-3 d-flex flex-wrap gap-2">
              <small className="text-muted me-1 align-self-center">Quick search:</small>
              {['Engineering', 'Marketing', 'Active', 'Remote', 'Manager'].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  className={`btn btn-sm btn-outline-secondary ${keyword === chip ? 'active' : ''}`}
                  onClick={() => {
                    setKeyword(chip);
                    setSearched(false);
                  }}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="alert alert-danger d-flex align-items-center gap-2">
            <i className="bi bi-exclamation-triangle-fill"></i> {error}
          </div>
        )}

        {/* Results */}
        {searched && (
          <div>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                {results.length > 0
                  ? <><span className="badge bg-primary me-2">{results.length}</span> result{results.length !== 1 ? 's' : ''} for "<em>{keyword}</em>"</>
                  : `No results for "${keyword}"`
                }
              </h5>
              {results.length > 0 && (
                <button className="btn btn-sm btn-outline-secondary" onClick={handleClear}>
                  Clear results
                </button>
              )}
            </div>

            {results.length === 0 ? (
              <div className="text-center py-5 text-muted">
                <i className="bi bi-person-x fs-1 d-block mb-2 opacity-50"></i>
                <p className="mb-1">No employees matched your search.</p>
                <small>Try searching by first name, last name, department, or role.</small>
              </div>
            ) : (
              <div className="row g-3">
                {results.map((emp) => (
                  <div key={emp.id} className="col-md-6">
                    <div className="card border-0 shadow-sm h-100 hover-shadow">
                      <div className="card-body p-3">
                        <div className="d-flex align-items-start gap-3">
                          {/* Avatar */}
                          <div
                            className="rounded-circle d-flex align-items-center justify-content-center text-white fw-bold flex-shrink-0"
                            style={{
                              width: 48, height: 48, fontSize: 16,
                              background: `hsl(${(emp.firstName?.charCodeAt(0) || 65) * 5 % 360}, 60%, 50%)`,
                            }}
                          >
                            {emp.firstName?.[0]}{emp.lastName?.[0]}
                          </div>

                          <div className="flex-grow-1 min-width-0">
                            <div className="d-flex justify-content-between align-items-start">
                              <h6 className="mb-0 fw-bold">{emp.firstName} {emp.lastName}</h6>
                              <span className={`badge text-bg-${statusColor(emp.status)} ms-2`}>
                                {emp.status}
                              </span>
                            </div>
                            <div className="text-muted small">{emp.role} · {emp.department}</div>

                            <div className="mt-2 d-flex flex-wrap gap-2" style={{ fontSize: 12 }}>
                              <span className="text-muted">
                                <i className="bi bi-envelope me-1"></i>{emp.email}
                              </span>
                              <span className="text-muted">
                                <i className="bi bi-phone me-1"></i>{emp.phone}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="d-flex gap-2 mt-3 border-top pt-3">
                          <button
                            className="btn btn-sm btn-outline-primary flex-fill"
                            onClick={() => navigate(`/update-employee/${emp.id}`)}
                          >
                            <i className="bi bi-pencil me-1"></i>Edit
                          </button>
                          <span className="text-muted small align-self-center ms-auto">
                            <i className="bi bi-calendar me-1"></i>{emp.joinDate}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Initial state hint */}
        {!searched && !loading && (
          <div className="text-center text-muted py-5 opacity-50">
            <i className="bi bi-person-lines-fill fs-1 d-block mb-2"></i>
            <p>Enter a keyword above to search employees</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchEmployee;
