import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedRoute({ roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }
  if (roles && !roles.includes(user.role)) {
    return (
      <div className="mx-auto max-w-md px-6 py-24 text-center">
        <h1 className="font-display text-3xl font-bold">Access denied</h1>
        <p className="mt-3 text-sm text-text-secondary">
          Your account ({user.role}) doesn't have permission to view this page.
        </p>
      </div>
    );
  }
  return <Outlet />;
}
