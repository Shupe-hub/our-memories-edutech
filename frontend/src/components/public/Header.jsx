import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import logoImg from '../../assets/OM.png';
import './Header.css';

const aboutLinks = [
    { title: 'Who We Are', path: '/about' },
    { title: 'Our Team', path: '/about#team' },
    { title: 'Our Stories', path: '/gallery' },
];

const serviceLinks = [
    { title: 'University Applications', path: '/applications/university' },
    { title: 'College Applications', path: '/applications/tvet' },
    { title: 'Bursary Applications', path: '/applications/bursaries' },
    { title: 'NSFAS Assistance', path: '/applications/nsfas' },
];

const searchPages = [
    { title: 'Home', path: '/', keywords: 'welcome' },
    { title: 'Who We Are', path: '/about', keywords: 'about story team' },
    { title: 'Our Team', path: '/about#team', keywords: 'people staff' },
    { title: 'Our Stories', path: '/gallery', keywords: 'gallery photos' },
    { title: 'Education', path: '/education', keywords: 'learning tutoring' },
    { title: 'Applications', path: '/applications', keywords: 'apply admissions' },
    ...serviceLinks.map((page) => ({ ...page, keywords: 'services apply college university bursary nsfas funding' })),
    { title: 'Gallery', path: '/gallery', keywords: 'photos stories' },
    { title: 'Contact', path: '/contact', keywords: 'help enquiry email' },
    { title: 'Login', path: '/login', keywords: 'sign in account' },
    { title: 'Sign Up', path: '/register', keywords: 'register account' },
];

function SearchForm({ value, onChange, onNavigate, className = '' }) {
    const resultsId = className.includes('mobile') ? 'header-search-results-mobile' : 'header-search-results-desktop';
    const results = useMemo(() => {
        const query = value.trim().toLowerCase();
        return query
            ? searchPages.filter((page) => `${page.title} ${page.keywords}`.toLowerCase().includes(query)).slice(0, 5)
            : [];
    }, [value]);

    return (
        <form className={`header-search ${className}`} role="search" onSubmit={(event) => event.preventDefault()}>
            <i className="fas fa-search" aria-hidden="true" />
            <input
                type="search"
                value={value}
                onChange={(event) => onChange(event.target.value)}
                placeholder="Search pages and services"
                aria-label="Search pages and services"
                aria-expanded={Boolean(value.trim())}
                aria-controls={resultsId}
            />
            {value.trim() && (
                <div className="header-search-results" id={resultsId}>
                    {results.length ? results.map((result) => (
                        <Link key={`${result.title}-${result.path}`} to={result.path} onClick={onNavigate}>
                            <span>{result.title}</span>
                            <i className="fas fa-arrow-right" aria-hidden="true" />
                        </Link>
                    )) : <p>No matching pages found.</p>}
                </div>
            )}
        </form>
    );
}

function Header({ toggleTheme, theme }) {
    const location = useLocation();
    const { user } = useAuth();
    const headerRef = useRef(null);
    const routeKey = `${location.pathname}${location.hash}`;
    const [navigationState, setNavigationState] = useState({
        routeKey,
        mobileMenuOpen: false,
        openDropdown: null,
        searchQuery: '',
    });
    const routeMatchesState = navigationState.routeKey === routeKey;
    const mobileMenuOpen = routeMatchesState && navigationState.mobileMenuOpen;
    const openDropdown = routeMatchesState ? navigationState.openDropdown : null;
    const searchQuery = routeMatchesState ? navigationState.searchQuery : '';

    const closeNavigation = useCallback(() => {
        setNavigationState({ routeKey, mobileMenuOpen: false, openDropdown: null, searchQuery: '' });
    }, [routeKey]);

    useEffect(() => {
        if (location.hash) {
            requestAnimationFrame(() => {
                document.querySelector(location.hash)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        }
    }, [location.pathname, location.hash]);

    const updateSearchQuery = (value) => {
        setNavigationState((current) => ({ ...current, routeKey, searchQuery: value }));
    };

    useEffect(() => {
        const handlePointerDown = (event) => {
            if (!headerRef.current?.contains(event.target)) closeNavigation();
        };
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') closeNavigation();
        };
        document.addEventListener('pointerdown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('pointerdown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [closeNavigation]);

    const renderDropdown = (name, links) => (
        <li
            className={`nav-item nav-dropdown${openDropdown === name ? ' dropdown-open' : ''}`}
            onMouseEnter={() => window.matchMedia('(hover: hover) and (min-width: 1121px)').matches && setNavigationState((current) => ({ ...current, routeKey, openDropdown: name }))}
            onMouseLeave={() => window.matchMedia('(hover: hover) and (min-width: 1121px)').matches && setNavigationState((current) => ({ ...current, routeKey, openDropdown: current.openDropdown === name ? null : current.openDropdown }))}
        >
            <button
                type="button"
                className="nav-link nav-dropdown-toggle"
                aria-expanded={openDropdown === name}
                aria-controls={`${name}-menu`}
                onClick={() => {
                    const isDesktop = window.matchMedia('(hover: hover) and (min-width: 1121px)').matches;
                    setNavigationState((current) => ({
                        ...current,
                        routeKey,
                        openDropdown: isDesktop ? name : current.openDropdown === name ? null : name,
                    }));
                }}
            >
                {name === 'about' ? 'About' : 'Services'}
                <i className="fas fa-chevron-down" aria-hidden="true" />
            </button>
            <ul className="dropdown-menu" id={`${name}-menu`} aria-hidden={openDropdown !== name} inert={openDropdown !== name}>
                {links.map((link) => (
                    <li key={link.title}>
                        <Link to={link.path} className="dropdown-item" onClick={closeNavigation}>{link.title}</Link>
                    </li>
                ))}
            </ul>
        </li>
    );

    return (
        <header className="site-header" ref={headerRef}>
            <div className="header-container">
                <Link to="/" className="logo-area" onClick={closeNavigation} aria-label="Our Memories EduTech home">
                    <img src={logoImg} alt="Our Memories EduTech" className="brand-logo" />
                    <span className="logo-tagline">Learn. Apply. Grow.</span>
                </Link>

                <button
                    type="button"
                    className={`mobile-menu-toggle${mobileMenuOpen ? ' active' : ''}`}
                    onClick={() => {
                        setNavigationState((current) => ({
                            ...current,
                            routeKey,
                            mobileMenuOpen: !mobileMenuOpen,
                            openDropdown: null,
                        }));
                    }}
                    aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="main-navigation-menu"
                >
                    <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true" />
                </button>

                <nav className={`main-nav${mobileMenuOpen ? ' mobile-open' : ''}`} aria-label="Main navigation">
                    <ul className="nav-menu" id="main-navigation-menu">
                        <li className="nav-item">
                            <Link to="/" className={`nav-link${location.pathname === '/' ? ' active-link' : ''}`} onClick={closeNavigation}>Home</Link>
                        </li>
                        {renderDropdown('about', aboutLinks)}
                        {renderDropdown('services', serviceLinks)}
                        <li className="nav-item"><Link to="/education" className={`nav-link${location.pathname.startsWith('/education') ? ' active-link' : ''}`} onClick={closeNavigation}>Education</Link></li>
                        <li className="nav-item"><Link to="/applications" className={`nav-link${location.pathname.startsWith('/applications') ? ' active-link' : ''}`} onClick={closeNavigation}>Applications</Link></li>
                        <li className="nav-item"><Link to="/gallery" className={`nav-link${location.pathname === '/gallery' ? ' active-link' : ''}`} onClick={closeNavigation}>Gallery</Link></li>
                        <li className="nav-item"><Link to="/contact" className={`nav-link${location.pathname === '/contact' ? ' active-link' : ''}`} onClick={closeNavigation}>Contact</Link></li>
                        <li className="mobile-search-item"><SearchForm value={searchQuery} onChange={updateSearchQuery} onNavigate={closeNavigation} className="mobile-search" /></li>
                        <li className="mobile-auth-actions">
                            <Link to={user ? '/account' : '/login'} className="header-login" onClick={closeNavigation}>{user ? 'My Account' : 'Login'}</Link>
                            <Link to="/register" className="header-signup" onClick={closeNavigation}>Sign Up</Link>
                        </li>
                    </ul>
                </nav>

                <div className="header-actions">
                    <SearchForm value={searchQuery} onChange={updateSearchQuery} onNavigate={closeNavigation} className="desktop-search" />
                    {toggleTheme && (
                        <button type="button" className="theme-toggle" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
                            <i className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`} aria-hidden="true" />
                        </button>
                    )}
                    <Link to={user ? '/account' : '/login'} className="header-login desktop-auth" onClick={closeNavigation}>{user ? 'My Account' : 'Login'}</Link>
                    <Link to="/register" className="header-signup desktop-auth" onClick={closeNavigation}>Sign Up</Link>
                </div>
            </div>
        </header>
    );
}

export default Header;


