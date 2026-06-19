import { Navigate, Outlet } from 'react-router-dom';
import { isAdmin, isRegularUser } from '../lib/auth';

export default function UserProtectedRoute() {
  if (!isRegularUser()) {
    if (isAdmin()) {
      return <Navigate to="/admin/approvals" replace />;
    }
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
