import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const dashboardSearch = [
    { label: 'Overview', to: '/account', keywords: 'home dashboard' },
    { label: 'My Applications', to: '/account/applications', keywords: 'university tvet college status' },
    { label: 'Find Institutions', to: '/account/explore', keywords: 'universities colleges courses' },
    { label: 'Bursaries & Funding', to: '/account/funding', keywords: 'nsfas bursary financial aid' },
    { label: 'My Documents', to: '/account/documents', keywords: 'certificates results identity files' },
    { label: 'Notifications', to: '/account/notifications', keywords: 'alerts updates' },
    { label: 'My Profile', to: '/account/profile', keywords: 'student name email account' },
    { label: 'Settings', to: '/account/settings', keywords: 'preferences security' },
    { label: 'Help Centre', to: '/contact', keywords: 'contact support help' },
];

const pageTitles = {
    '/account': 'Dashboard overview',
    '/account/applications': 'My applications',
    '/account/explore': 'Find institutions',
    '/account/funding': 'Bursaries & funding',
    '/account/documents': 'My documents',
    '/account/notifications': 'Notifications',
    '/account/profile': 'My profile',
    '/account/settings': 'Settings',
};

function userInitials(user) {
    return `${user?.name?.[0] || ''}${user?.surname?.[0] || ''}`.toUpperCase() || 'ST';
}

export default function DashboardTopbar({ user, theme, toggleTheme, onMenuClick, mobileMenuOpen, onLogout, isSigningOut }) {
    const location = useLocation();
    const containerRef = useRef(null);
    const [query, setQuery] = useState('');
    const [openPanel, setOpenPanel] = useState(null);
    const title = pageTitles[location.pathname] || 'Student dashboard';
    const results = useMemo(() => {
        const value = query.trim().toLowerCase();
        return value
            ? dashboardSearch.filter((item) => `${item.label} ${item.keywords}`.toLowerCase().includes(value)).slice(0, 5)
            : [];
    }, [query]);

    useEffect(() => {
        const closePanels = (event) => {
            if (!containerRef.current?.contains(event.target)) setOpenPanel(null);
            if (event.key === 'Escape') {
                setOpenPanel(null);
                setQuery('');
            }
        };
        document.addEventListener('pointerdown', closePanels);
        document.addEventListener('keydown', closePanels);
        return () => {
            document.removeEventListener('pointerdown', closePanels);
            document.removeEventListener('keydown', closePanels);
        };
    }, []);

    const displayName = `${user?.name || ''} ${user?.surname || ''}`.trim() || 'Student';

    return (
        <header className="student-topbar" ref={containerRef}>
            <div className="student-topbar-title">
                <button type="button" className="student-mobile-menu-button" onClick={onMenuClick} aria-label={mobileMenuOpen ? 'Close dashboard navigation' : 'Open dashboard navigation'} aria-expanded={mobileMenuOpen} aria-controls="student-sidebar">
                    <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true" />
                </button>
                <div>
                    <p className="student-breadcrumb"><span>Student space</span><i className="fas fa-chevron-right" aria-hidden="true" /><strong>{title}</strong></p>
                    <h1>{title}</h1>
                </div>
            </div>

            <div className="student-topbar-actions">
                <button type="button" className="student-icon-action" onClick={toggleTheme} aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'} title={theme === 'light' ? 'Dark mode' : 'Light mode'}><i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`} aria-hidden="true" /></button>
                <form className="student-global-search" role="search" onSubmit={(event) => event.preventDefault()}>
                    <i className="fas fa-search" aria-hidden="true" />
                    <input type="search" placeholder="Search your dashboard" aria-label="Search dashboard" value={query} onChange={(event) => setQuery(event.target.value)} aria-expanded={Boolean(query.trim())} aria-controls="student-search-results" />
                    {query.trim() && <div className="student-search-results" id="student-search-results">
                        {results.length ? results.map((result) => <Link key={result.to} to={result.to} onClick={() => setQuery('')}><span>{result.label}</span><i className="fas fa-arrow-right" aria-hidden="true" /></Link>) : <p>No matching dashboard pages.</p>}
                    </div>}
                </form>

                <div className="student-topbar-popover-wrap">
                    <button type="button" className={`student-icon-action${openPanel === 'notifications' ? ' active' : ''}`} onClick={() => setOpenPanel((current) => current === 'notifications' ? null : 'notifications')} aria-label="Notifications" aria-expanded={openPanel === 'notifications'}>
                        <i className="far fa-bell" aria-hidden="true" />
                    </button>
                    {openPanel === 'notifications' && <section className="student-popover student-notification-popover" aria-label="Notifications"><div className="student-popover-heading"><strong>Notifications</strong><span>0 new</span></div><div className="student-notification-empty"><span><i className="far fa-bell" aria-hidden="true" /></span><strong>You are all caught up</strong><p>New account updates will appear here.</p></div></section>}
                </div>

                <div className="student-topbar-popover-wrap">
                    <button type="button" className={`student-user-menu${openPanel === 'profile' ? ' active' : ''}`} onClick={() => setOpenPanel((current) => current === 'profile' ? null : 'profile')} aria-expanded={openPanel === 'profile'} aria-label={`Open profile menu for ${displayName}`}>
                        <span className="student-avatar">{userInitials(user)}</span>
                        <span className="student-user-copy"><strong>{displayName}</strong><small>Student account</small></span>
                        <i className="fas fa-chevron-down student-user-chevron" aria-hidden="true" />
                    </button>
                    {openPanel === 'profile' && <section className="student-popover student-profile-popover" aria-label="Profile menu">
                        <div className="student-profile-summary"><span className="student-avatar">{userInitials(user)}</span><span><strong>{displayName}</strong><small>{user?.email}</small></span></div>
                        <Link to="/account/profile" onClick={() => setOpenPanel(null)}><i className="far fa-user" aria-hidden="true" />My profile</Link>
                        <Link to="/account/settings" onClick={() => setOpenPanel(null)}><i className="fas fa-gear" aria-hidden="true" />Settings</Link>
                        <button type="button" onClick={onLogout} disabled={isSigningOut}><i className={`fas ${isSigningOut ? 'fa-spinner fa-spin' : 'fa-arrow-right-from-bracket'}`} aria-hidden="true" />{isSigningOut ? 'Signing out...' : 'Log out'}</button>
                    </section>}
                </div>
            </div>
        </header>
    );
}
