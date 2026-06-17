import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Navbar         from './components/Navbar';
import EmployeeList   from './components/EmployeeList';
import AddEmployee    from './components/AddEmployee';
import UpdateEmployee from './components/UpdateEmployee';
import SearchEmployee from './components/SearchEmployee';
import Login          from './components/Login';
import Signup         from './components/Signup';
import ProtectedRoute from './components/ProtectedRoute';
import AuthService    from './services/AuthService';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  const isLoggedIn = AuthService.isAuthenticated();

  return (
    <Router>
      {isLoggedIn && <Navbar />}
      <div className={isLoggedIn ? 'container py-4' : ''}>
        <Routes>
          <Route path="/login" element={
            isLoggedIn ? <Navigate to="/employees" replace /> : <Login />
          } />
          <Route path="/signup" element={
            isLoggedIn ? <Navigate to="/employees" replace /> : <Signup />
          } />
          <Route path="/" element={
            <Navigate to={isLoggedIn ? '/employees' : '/login'} replace />
          } />
          <Route path="/employees" element={
            <ProtectedRoute><EmployeeList /></ProtectedRoute>
          } />
          <Route path="/add-employee" element={
            <ProtectedRoute><AddEmployee /></ProtectedRoute>
          } />
          <Route path="/update-employee/:id" element={
            <ProtectedRoute><UpdateEmployee /></ProtectedRoute>
          } />
          <Route path="/search-employee" element={
            <ProtectedRoute><SearchEmployee /></ProtectedRoute>
          } />
          <Route path="*" element={
            <Navigate to={isLoggedIn ? '/employees' : '/login'} replace />
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
