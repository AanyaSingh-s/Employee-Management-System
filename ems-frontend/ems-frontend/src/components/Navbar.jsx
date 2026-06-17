import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = AuthService.getCurrentUser();

  const isActive = (path) =>
    location.pathname === path ? 'nav-link active fw-semibold' : 'nav-link';

  const handleLogout = () => {
    AuthService.logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold fs-4" to="/employees">
          <i className="bi bi-people-fill me-2"></i>EMS
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-1 align-items-lg-center">
            <li className="nav-item">
              <Link className={isActive('/employees')} to="/employees">
                <i className="bi bi-list-ul me-1"></i>All Employees
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/add-employee')} to="/add-employee">
                <i className="bi bi-person-plus me-1"></i>Add Employee
              </Link>
            </li>
            <li className="nav-item">
              <Link className={isActive('/search-employee')} to="/search-employee">
                <i className="bi bi-search me-1"></i>Search
              </Link>
            </li>
            {user && (
              <li className="nav-item ms-lg-2">
                <span className="nav-link text-white-50 small d-none d-lg-inline">
                  <i className="bi bi-person-circle me-1"></i>{user.username}
                </span>
              </li>
            )}
            <li className="nav-item">
              <button
                type="button"
                className="btn btn-outline-light btn-sm ms-lg-2"
                onClick={handleLogout}
              >
                <i className="bi bi-box-arrow-right me-1"></i>Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
