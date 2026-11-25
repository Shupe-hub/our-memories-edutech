import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AdminLayout() {
    const { isLoading, user } = useAuth();
    const location = useLocation();
    if (isLoading) return <div className="student-auth-loading" role="status">Checking your administrator account...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'ADMIN') return <Navigate to={user.role === 'SUPER_ADMIN' ? '/system-admin' : '/account'} replace />;
    if (user.mustChangePassword && location.pathname !== '/admin/change-password') return <Navigate to="/admin/change-password" replace />;
    return <Outlet />;
}
