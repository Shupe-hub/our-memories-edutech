import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logoImg from '../assets/OM.png';

const menuData = [
    {
        title: 'EDUCATION',
        icon: 'fa-graduation-cap',
        path: '/education',
        items: [
            { title: 'Online Tutoring', path: '/education/online-tutoring' },
            { title: 'Grade 9 - 12 Subjects', path: '/education/grade-subjects' },
            { title: 'Exam Preparation', path: '/education/exam-preparation' },
            { title: 'Study Resources', path: '/education/study-resources' },
            { title: 'Career Guidance', path: '/education/career-guidance' },
            { title: 'Meet Our Tutors', path: '/education/meet-our-tutors' },
        ],
    },
    {
        title: 'APPLICATIONS',
        icon: 'fa-file-alt',
        path: '/applications',
        items: [
            { title: 'University Applications', path: '/applications/university' },
            { title: 'TVET Applications', path: '/applications/tvet' },
            { title: 'School Applications', path: '/applications/school' },
            { title: 'Bursary Services', path: '/applications/bursaries' },
            { title: 'NSFAS & Funza Lushaka', path: '/applications/nsfas' },
            { title: 'CAO Applications', path: '/applications/cao' },
        ],
    },
    {
        title: 'CAREER SERVICES',
        icon: 'fa-briefcase',
        path: '/career-services',
        items: [
            { title: 'CV Preparation', path: '/career-services/cv-preparation' },
            { title: 'Cover Letters', path: '/career-services/cover-letters' },
            { title: 'Job Applications', path: '/career-services/job-applications' },
            {
                title: 'Internships & Learnerships',
                path: '/career-services/internships-learnerships',
            },
            {
                title: 'Graduate Programmes',
                path: '/career-services/graduate-programmes',
            },
        ],
    },
    {
        title: 'DIGITAL SERVICES',
        icon: 'fa-laptop-code',
        path: '/pricing',
        items: [
            { title: 'Website Development', path: '/pricing' },
            { title: 'Web & Mobile Apps', path: '/pricing' },
            { title: 'UI/UX Design', path: '/pricing' },
            { title: 'Graphic Design', path: '/pricing' },
            { title: 'Hosting & Domains', path: '/pricing' },
            { title: 'EduTech Solutions', path: '/pricing' },
        ],
    },
];

const standardLinks = [
    { title: 'ABOUT US', path: '/about', icon: 'fa-info-circle' },
    { title: 'GALLERY', path: '/gallery', icon: 'fa-images' },
    { title: 'PRICING', path: '/pricing', icon: 'fa-tags' },
    { title: 'CONTACT US', path: '/contact', icon: 'fa-envelope' },
];

const searchPages = [
    { title: 'Home', path: '/', keywords: 'welcome' },
    { title: 'Education', path: '/education', keywords: 'learning tutoring' },
    { title: 'Online Tutoring', path: '/education/online-tutoring', keywords: 'lessons tutor' },
    { title: 'Grade 9 - 12 Subjects', path: '/education/grade-subjects', keywords: 'school subjects' },
    { title: 'Exam Preparation', path: '/education/exam-preparation', keywords: 'exams study' },
    { title: 'Study Resources', path: '/education/study-resources', keywords: 'learning materials' },
    { title: 'Career Guidance', path: '/education/career-guidance', keywords: 'career advice' },
    { title: 'Meet Our Tutors', path: '/education/meet-our-tutors', keywords: 'teachers educators' },
    { title: 'Applications', path: '/applications', keywords: 'apply admissions' },
    { title: 'University Applications', path: '/applications/university', keywords: 'tertiary' },
    { title: 'TVET Applications', path: '/applications/tvet', keywords: 'college' },
    { title: 'School Applications', path: '/applications/school', keywords: 'learner' },
    { title: 'Bursary Services', path: '/applications/bursaries', keywords: 'funding' },
    { title: 'NSFAS & Funza Lushaka', path: '/applications/nsfas', keywords: 'funding student' },
    { title: 'CAO Applications', path: '/applications/cao', keywords: 'programme institution' },
    { title: 'Application Form', path: '/applications/apply', keywords: 'application enquiry' },
    { title: 'Career Services', path: '/career-services', keywords: 'employment work' },
    { title: 'CV Preparation', path: '/career-services/cv-preparation', keywords: 'resume' },
    { title: 'Cover Letters', path: '/career-services/cover-letters', keywords: 'job' },
    { title: 'Job Applications', path: '/career-services/job-applications', keywords: 'employment' },
    {
        title: 'Internships & Learnerships',
        path: '/career-services/internships-learnerships',
        keywords: 'work experience',
    },
    {
        title: 'Graduate Programmes',
        path: '/career-services/graduate-programmes',
        keywords: 'graduate opportunities',
    },
    { title: 'Gallery', path: '/gallery', keywords: 'photos images projects' },
    { title: 'Pricing & Packages', path: '/pricing', keywords: 'cost price fees' },
    { title: 'About Us', path: '/about', keywords: 'company team' },
    { title: 'Contact Us', path: '/contact', keywords: 'email phone enquiry' },
    { title: 'Privacy Policy', path: '/privacy', keywords: 'privacy personal information' },
    { title: 'Terms & Conditions', path: '/terms', keywords: 'terms conditions' },
    { title: 'Refund Policy', path: '/refund', keywords: 'refund cancellation' },
    { title: 'Website Development', path: '/pricing', keywords: 'digital web design' },
    { title: 'Web & Mobile Apps', path: '/pricing', keywords: 'digital application software' },
    { title: 'UI/UX Design', path: '/pricing', keywords: 'digital interface user experience' },
    { title: 'Graphic Design', path: '/pricing', keywords: 'digital graphics' },
    { title: 'Hosting & Domains', path: '/pricing', keywords: 'digital website hosting' },
    { title: 'EduTech Solutions', path: '/pricing', keywords: 'digital technology' },
];

const Header = ({ toggleTheme, theme }) => {
    const location = useLocation();
    const headerRef = useRef(null);
    const searchInputRef = useRef(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);
    const [searchOpen, setSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [submittedQuery, setSubmittedQuery] = useState('');

    useEffect(() => {
        if (!mobileMenuOpen && openDropdown === null && !searchOpen) {
            return undefined;
        }

        const closeOnOutsideClick = (event) => {
            if (!headerRef.current?.contains(event.target)) {
                setMobileMenuOpen(false);
                setOpenDropdown(null);
                setSearchOpen(false);
                return;
            }

            const activeDropdown = headerRef.current.querySelector('.nav-item.dropdown-open');
            if (
                activeDropdown &&
                !activeDropdown.contains(event.target) &&
                !event.target.closest('.nav-dropdown-arrow')
            ) {
                setOpenDropdown(null);
            }
        };

        const closeOnEscape = (event) => {
            if (event.key === 'Escape') {
                setMobileMenuOpen(false);
                setOpenDropdown(null);
                setSearchOpen(false);
            }
        };

        document.addEventListener('pointerdown', closeOnOutsideClick);
        document.addEventListener('keydown', closeOnEscape);

        return () => {
            document.removeEventListener('pointerdown', closeOnOutsideClick);
            document.removeEventListener('keydown', closeOnEscape);
        };
    }, [mobileMenuOpen, openDropdown, searchOpen]);

    useEffect(() => {
        if (searchOpen) {
            searchInputRef.current?.focus();
        }
    }, [searchOpen]);

    const closeNavigation = () => {
        setMobileMenuOpen(false);
        setOpenDropdown(null);
        setSearchOpen(false);
    };

    const toggleMobileMenu = () => {
        setMobileMenuOpen((isOpen) => !isOpen);
        setOpenDropdown(null);
        setSearchOpen(false);
    };

    const toggleDropdown = (index) => {
        setOpenDropdown((current) => (current === index ? null : index));
    };

    const handleDropdownKeyDown = (event, dropdownId) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            setOpenDropdown(menuData.findIndex((menu) => (
                `${menu.title.toLowerCase().replace(/\s+/g, '-')}-dropdown` === dropdownId
            )));
            requestAnimationFrame(() => {
                const links = document.querySelectorAll(`#${dropdownId} a`);
                links[event.key === 'ArrowDown' ? 0 : links.length - 1]?.focus();
            });
        }
    };

    const handleSearchSubmit = (event) => {
        event.preventDefault();
        setSubmittedQuery(searchQuery.trim());
    };

    const normalizedQuery = submittedQuery.toLocaleLowerCase();
    const searchResults = normalizedQuery
        ? searchPages.filter((page) =>
              `${page.title} ${page.keywords}`
                  .toLocaleLowerCase()
                  .includes(normalizedQuery),
          )
        : [];

    const closeSearch = () => {
        setSearchOpen(false);
        setSearchQuery('');
        setSubmittedQuery('');
    };

    return (
        <header className="site-header" ref={headerRef}>
            <div className="top-bar">
                <Link
                    to="/"
                    className="logo-area"
                    onClick={closeNavigation}
                    aria-label="Our Memories EduTech home"
                >
                    <img
                        src={logoImg}
                        alt="Our Memories EduTech"
                        className="brand-logo"
                    />
                    <span className="sub">Learn • Apply • Grow</span>
                </Link>

                <div className="center-tagline">
                    <h1>WE <span>EMPOWER</span> PEOPLE</h1>
                    <p className="main-p">EDUCATION | APPLICATIONS | CAREER SUPPORT</p>
                    <p className="sub-p">
                        TUTORING • UNIVERSITY • TVET • BURSARIES • DIGITAL SOLUTIONS
                    </p>
                </div>

                <div className="top-actions">
                    <div className="header-controls">
                        <a
                            className="header-whatsapp"
                            href="https://wa.me/27680513619?text=Hello%20Our%20Memories%20EduTech"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Contact us on WhatsApp"
                            title="WhatsApp"
                        >
                            <i className="fab fa-whatsapp" aria-hidden="true" />
                        </a>
                        <button
                            type="button"
                            className="header-icon-button"
                            onClick={() => {
                                setSearchOpen(true);
                                setMobileMenuOpen(false);
                                setOpenDropdown(null);
                            }}
                            aria-label="Search website"
                            aria-expanded={searchOpen}
                            aria-controls="header-search-panel"
                            title="Search"
                        >
                            <i className="fas fa-search" aria-hidden="true" />
                        </button>
                        <button
                            type="button"
                            className="header-icon-button"
                            onClick={toggleTheme}
                            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            <i
                                className={`fas ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`}
                                aria-hidden="true"
                            />
                        </button>
                    </div>
                    <div className="action-buttons">
                        <Link
                            to="/applications/apply"
                            className="btn-pill btn-primary-pill"
                            onClick={closeNavigation}
                        >
                            Apply With Us
                        </Link>
                        <Link
                            to="/education/meet-our-tutors"
                            className="btn-pill btn-secondary-pill"
                            onClick={closeNavigation}
                        >
                            Find a Tutor
                        </Link>
                        <Link
                            to="/contact"
                            className="btn-pill btn-secondary-pill"
                            onClick={closeNavigation}
                        >
                            Request a Quote
                        </Link>
                    </div>
                </div>

                <button
                    type="button"
                    className={`mobile-menu-toggle${mobileMenuOpen ? ' active' : ''}`}
                    onClick={toggleMobileMenu}
                    aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="main-navigation-menu"
                >
                    <i
                        className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}
                        aria-hidden="true"
                    />
                </button>
            </div>

            <nav className="main-nav" aria-label="Main navigation">
                <div className="nav-container">
                    <ul
                        id="main-navigation-menu"
                        className={`nav-menu${mobileMenuOpen ? ' mobile-open' : ''}`}
                    >
                        <li className="nav-item" key="HOME">
                            <Link
                                to="/"
                                className={`nav-link${location.pathname === '/' ? ' active-link' : ''}`}
                                onClick={closeNavigation}
                            >
                                <i className="fas fa-home" aria-hidden="true" />
                                <span>HOME</span>
                            </Link>
                        </li>
                        {menuData.map((menu, index) => {
                            const dropdownId = `${menu.title.toLowerCase().replace(/\s+/g, '-')}-dropdown`;
                            const isActive =
                                location.pathname === menu.path ||
                                location.pathname.startsWith(`${menu.path}/`);

                            return (
                                <li
                                    className={`nav-item${openDropdown === index ? ' dropdown-open' : ''}`}
                                    key={menu.title}
                                >
                                    <div className="nav-dropdown-heading">
                                        <Link
                                            to={menu.path}
                                            className={`nav-link nav-dropdown-main-link${isActive ? ' active-link' : ''}`}
                                            onClick={closeNavigation}
                                        >
                                            <i className={`fas ${menu.icon}`} aria-hidden="true" />
                                            <span>{menu.title}</span>
                                        </Link>
                                        <button
                                            type="button"
                                            className="nav-link dropdown-toggle nav-dropdown-arrow"
                                            onClick={() => toggleDropdown(index)}
                                            aria-label={`${openDropdown === index ? 'Close' : 'Open'} ${menu.title.toLowerCase()} menu`}
                                            aria-expanded={openDropdown === index}
                                            aria-controls={dropdownId}
                                            onKeyDown={(event) => handleDropdownKeyDown(event, dropdownId)}
                                        >
                                            <i className="fas fa-chevron-down" aria-hidden="true" />
                                        </button>
                                    </div>
                                    <ul
                                        className="dropdown-menu"
                                        id={dropdownId}
                                        aria-hidden={openDropdown !== index}
                                        inert={openDropdown !== index}
                                    >
                                        {menu.items.map((item) => (
                                            <li key={item.title}>
                                                <Link
                                                    to={item.path}
                                                    className="dropdown-item"
                                                    onClick={closeNavigation}
                                                >
                                                    {item.title}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </li>
                            );
                        })}

                        {standardLinks.map((link) => (
                            <li className="nav-item" key={link.title}>
                                <Link
                                    to={link.path}
                                    className={`nav-link${location.pathname === link.path ? ' active-link' : ''}`}
                                    onClick={closeNavigation}
                                >
                                    <i className={`fas ${link.icon}`} aria-hidden="true" />
                                    <span>{link.title}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {searchOpen && (
                <div
                    className="header-search-backdrop"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            closeSearch();
                        }
                    }}
                >
                    <section
                        className="header-search-panel"
                        id="header-search-panel"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="header-search-title"
                    >
                        <div className="header-search-heading">
                            <div>
                                <span className="header-search-eyebrow">OUR MEMORIES EDUTECH</span>
                                <h2 id="header-search-title">What are you looking for?</h2>
                            </div>
                            <button
                                type="button"
                                className="header-search-close"
                                onClick={closeSearch}
                                aria-label="Close search"
                            >
                                <i className="fas fa-times" aria-hidden="true" />
                            </button>
                        </div>
                        <form className="header-search-form" onSubmit={handleSearchSubmit} role="search">
                            <i className="fas fa-search" aria-hidden="true" />
                            <input
                                ref={searchInputRef}
                                type="search"
                                value={searchQuery}
                                onChange={(event) => setSearchQuery(event.target.value)}
                                placeholder="Search pages and services"
                                aria-label="Search pages and services"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="header-search-clear"
                                    onClick={() => {
                                        setSearchQuery('');
                                        setSubmittedQuery('');
                                        searchInputRef.current?.focus();
                                    }}
                                    aria-label="Clear search"
                                >
                                    Clear
                                </button>
                            )}
                            <button className="header-search-submit" type="submit">
                                Search
                            </button>
                        </form>
                        <div className="header-search-results" aria-live="polite">
                            {!submittedQuery ? (
                                <p className="header-search-hint">
                                    Search education, applications, career services, and more.
                                </p>
                            ) : searchResults.length ? (
                                <>
                                    <p className="header-search-result-count">
                                        {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'}
                                    </p>
                                    <ul>
                                        {searchResults.map((result) => (
                                            <li key={`${result.path}-${result.title}`}>
                                                <Link to={result.path} onClick={closeSearch}>
                                                    <span>{result.title}</span>
                                                    <i className="fas fa-arrow-right" aria-hidden="true" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            ) : (
                                <p className="header-search-hint">
                                    No matching pages found. Try a different search term.
                                </p>
                            )}
                        </div>
                    </section>
                </div>
            )}
        </header>
    );
};

export default Header;
