import { Navigate, Outlet } from 'react-router-dom';
import { isAdmin } from '../lib/auth';

export default function AdminProtectedRoute() {
  if (!isAdmin()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
}
