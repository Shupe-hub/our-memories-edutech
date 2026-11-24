import { Link, NavLink } from 'react-router-dom';
import logo from '../../assets/OM.png';

const mainLinks = [
    { label: 'Overview', to: '/account', icon: 'fa-house', end: true },
    { label: 'My Applications', to: '/account/applications', icon: 'fa-file-lines' },
    { label: 'Find Institutions', to: '/account/explore', icon: 'fa-building-columns' },
    { label: 'Bursaries & Funding', to: '/account/funding', icon: 'fa-award' },
    { label: 'My Documents', to: '/account/documents', icon: 'fa-folder-open' },
    { label: 'Notifications', to: '/account/notifications', icon: 'fa-bell' },
];

const accountLinks = [
    { label: 'My Profile', to: '/account/profile', icon: 'fa-user' },
    { label: 'Settings', to: '/account/settings', icon: 'fa-gear' },
];

function SidebarLinks({ links, onNavigate }) {
    return links.map((item) => (
        <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `student-sidebar-link${isActive ? ' active' : ''}`}
            onClick={onNavigate}
            title={item.label}
        >
            <i className={`fas ${item.icon}`} aria-hidden="true" />
            <span>{item.label}</span>
        </NavLink>
    ));
}

export default function DashboardSidebar({ collapsed, mobileOpen, onToggle, onClose, onLogout, isSigningOut }) {
    return (
        <>
            {mobileOpen && <button type="button" className="student-sidebar-backdrop" onClick={onClose} aria-label="Close navigation" />}
            <aside id="student-sidebar" className={`student-sidebar${collapsed ? ' is-collapsed' : ''}${mobileOpen ? ' is-mobile-open' : ''}`} aria-label="Student dashboard navigation">
                <div className="student-sidebar-brand-row">
                    <Link to="/account" className="student-sidebar-brand" onClick={onClose} aria-label="Our Memories EduTech dashboard">
                        <img src={logo} alt="" />
                        <span><strong>Our Memories</strong><small>EDUTECH STUDENT PORTAL</small></span>
                    </Link>
                    <button type="button" className="student-sidebar-collapse" onClick={onToggle} aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
                        <i className={`fas ${collapsed ? 'fa-angles-right' : 'fa-angles-left'}`} aria-hidden="true" />
                    </button>
                    <button type="button" className="student-sidebar-mobile-close" onClick={onClose} aria-label="Close navigation"><i className="fas fa-times" aria-hidden="true" /></button>
                </div>

                <nav className="student-sidebar-nav" aria-label="Student tools">
                    <p className="student-sidebar-label">STUDY SPACE</p>
                    <SidebarLinks links={mainLinks} onNavigate={onClose} />
                    <p className="student-sidebar-label student-sidebar-label--account">ACCOUNT</p>
                    <SidebarLinks links={accountLinks} onNavigate={onClose} />
                </nav>

                <div className="student-sidebar-bottom">
                    <Link to="/contact" className="student-sidebar-link" onClick={onClose} title="Help Centre">
                        <i className="fas fa-circle-question" aria-hidden="true" /><span>Help Centre</span>
                    </Link>
                    <button type="button" className="student-sidebar-link student-sidebar-logout" onClick={onLogout} disabled={isSigningOut} title="Logout">
                        <i className={`fas ${isSigningOut ? 'fa-spinner fa-spin' : 'fa-arrow-right-from-bracket'}`} aria-hidden="true" /><span>{isSigningOut ? 'Signing out...' : 'Logout'}</span>
                    </button>
                    <div className="student-sidebar-note"><span><i className="fas fa-shield-heart" aria-hidden="true" /></span><p>Your learning journey,<br />all in one place.</p></div>
                </div>
            </aside>
        </>
    );
}
