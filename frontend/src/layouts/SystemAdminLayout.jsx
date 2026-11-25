import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function SystemAdminLayout() {
    const { isLoading, user } = useAuth();
    if (isLoading) return <div className="student-auth-loading" role="status">Checking your system administrator account...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'SUPER_ADMIN') return <Navigate to={user.role === 'ADMIN' ? (user.mustChangePassword ? '/admin/change-password' : '/admin') : '/account'} replace />;
    return <Outlet />;
}
