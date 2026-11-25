import { Suspense, useEffect, useState } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import DashboardBottomNav from '../components/user/DashboardBottomNav';
import DashboardSidebar from '../components/user/DashboardSidebar';
import DashboardTopbar from '../components/user/DashboardTopbar';
import '../styles/user/StudentDashboard.css';

export default function DashboardLayout({ theme, toggleTheme }) {
    const { user, signOut } = useAuth();
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isSigningOut, setIsSigningOut] = useState(false);
    const [logoutError, setLogoutError] = useState('');

    useEffect(() => {
        if (!mobileOpen) return undefined;
        const closeOnEscape = (event) => {
            if (event.key === 'Escape') setMobileOpen(false);
        };
        document.addEventListener('keydown', closeOnEscape);
        return () => document.removeEventListener('keydown', closeOnEscape);
    }, [mobileOpen]);

    const handleLogout = async () => {
        setIsSigningOut(true);
        setLogoutError('');
        try {
            await signOut();
            navigate('/login', { replace: true });
        } catch (error) {
            setLogoutError(error.message || 'We could not sign you out. Please try again.');
        } finally {
            setIsSigningOut(false);
        }
    };

    return (
        <div className="student-dashboard">
            <DashboardSidebar
                collapsed={collapsed}
                mobileOpen={mobileOpen}
                onToggle={() => setCollapsed((value) => !value)}
                onClose={() => setMobileOpen(false)}
                onLogout={handleLogout}
                isSigningOut={isSigningOut}
            />
            <div className={`student-dashboard-main${collapsed ? ' sidebar-collapsed' : ''}`}>
                <DashboardTopbar user={user} theme={theme} toggleTheme={toggleTheme} mobileMenuOpen={mobileOpen} onMenuClick={() => setMobileOpen((value) => !value)} onLogout={handleLogout} isSigningOut={isSigningOut} />
                {logoutError && <p className="student-dashboard-alert" role="alert">{logoutError}</p>}
                <main className="student-dashboard-content" id="student-dashboard-main">
                    <Suspense fallback={<div className="student-page-loading" role="status">Loading your student space...</div>}>
                        <Outlet />
                    </Suspense>
                </main>
            </div>
            <DashboardBottomNav />
        </div>
    );
}
