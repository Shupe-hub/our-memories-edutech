
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
import logoImg from '../assets/OM.png';

const Header = ({ toggleTheme, theme }) => {
    const location = useLocation();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(null);

    // Navigation dropdown data
    const menuData = [
        {
            title: 'EDUCATION',
            items: [
                'Online Tutoring',
                'Grade 9 - 12 Subjects',
                'Exam Preparation',
                'Study Resources',
                'Career Guidance',
                'Meet Our Tutors'
            ]
        },
        {
            title: 'APPLICATIONS',
            items: [
                'University Applications',
                'TVET Applications',
                'School Applications',
                'Bursary Services',
                'NSFAS & Funza Lushaka',
                'CAO Applications',
                'APS Calculator'
            ]
        },
        {
            title: 'CAREER SERVICES',
            items: [
                'CV Preparation',
                'Cover Letters',
                'Job Applications',
                'Internships & Learnerships',
                'Graduate Programmes'
            ]
        },
        {
            title: 'DIGITAL SERVICES',
            items: [
                'Website Development',
                'Web & Mobile Apps',
                'UI/UX Design',
                'Graphic Design',
                'Hosting & Domains',
                'EduTech Solutions'
            ]
        }
    ];

    // Standard navigation links
    const standardLinks = [
        { title: 'ABOUT US', path: '/about' },
        { title: 'PORTFOLIO', path: '/#portfolio' },
        { title: 'PRICING', path: '/pricing' },
        { title: 'CONTACT US', path: '/contact' }
    ];

    // Close menus when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
        setOpenDropdown(null);
    }, [location.pathname, location.hash]);

    // Toggle mobile menu
    const handleMobileMenu = () => {
        setMobileMenuOpen(previous => !previous);
        setOpenDropdown(null);
    };

    // Toggle dropdown sections
    const handleDropdown = (index) => {
        setOpenDropdown(previous =>
            previous === index ? null : index
        );
    };

    // Close menus after selecting a link
    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
        setOpenDropdown(null);
    };

    return (
        <header className="site-header">

            {/* ==============================
                TOP HEADER
            ============================== */}

            <div className="top-bar">

                {/* LOGO */}
                <Link
                    to="/"
                    className="logo-area"
                    onClick={closeMobileMenu}
                >
                    <img
                        src={logoImg}
                        alt="Our Memories EduTech Logo"
                        className="brand-logo"
                    />

                    <span className="sub">
                        Learn • Apply • Grow
                    </span>
                </Link>

                {/* MOBILE HAMBURGER BUTTON */}
                <button
                    type="button"
                    className={`mobile-menu-toggle ${
                        mobileMenuOpen ? 'active' : ''
                    }`}
                    onClick={handleMobileMenu}
                    aria-label={
                        mobileMenuOpen
                            ? 'Close navigation menu'
                            : 'Open navigation menu'
                    }
                    aria-expanded={mobileMenuOpen}
                    aria-controls="main-navigation-menu"
                >
                    <i
                        className={`fas ${
                            mobileMenuOpen ? 'fa-times' : 'fa-bars'
                        }`}
                    ></i>
                </button>

                {/* CENTER TAGLINE - DESKTOP ONLY */}
                <div className="center-tagline">

                    <h1>
                        WE <span>EMPOWER</span> PEOPLE
                    </h1>

                    <p className="main-p">
                        EDUCATION | APPLICATIONS | CAREER SUPPORT
                    </p>

                    <p className="sub-p">
                        TUTORING • UNIVERSITY • TVET • BURSARIES • DIGITAL SOLUTIONS
                    </p>

                </div>

                {/* SOCIAL MEDIA AND ACTION BUTTONS - DESKTOP ONLY */}
                <div className="top-actions">

                    <div className="social-icons">

                        <a
                            href="https://www.linkedin.com/company/#page-name"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="LinkedIn"
                        >
                            <i className="fab fa-linkedin-in"></i>
                        </a>

                        <a
                            href="https://www.facebook.com/#page-name"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <i className="fab fa-facebook-f"></i>
                        </a>

                        <a
                            href="https://www.instagram.com/#page-name"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <i className="fab fa-instagram"></i>
                        </a>

                        <a
                            href="https://wa.me/27676916912?text=Hello%20Our%20Memories%20EduTech"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="WhatsApp"
                        >
                            <i className="fab fa-whatsapp"></i>
                        </a>

                    </div>

                    <div className="action-buttons">

                        <a
                            href="#apply"
                            className="btn-pill btn-primary-pill"
                        >
                            Apply With Us
                        </a>

                        <a
                            href="#tutor"
                            className="btn-pill btn-secondary-pill"
                        >
                            Find a Tutor
                        </a>

                        <a
                            href="#quote"
                            className="btn-pill btn-secondary-pill"
                        >
                            Request a Quote
                        </a>

                    </div>

                </div>

            </div>

            {/* ==============================
                MAIN NAVIGATION
            ============================== */}

            <nav className="main-nav">

                <div className="nav-container">

                    <ul
                        id="main-navigation-menu"
                        className={`nav-menu ${
                            mobileMenuOpen ? 'mobile-open' : ''
                        }`}
                    >

                        {/* DROPDOWN MENUS */}
                        {menuData.map((menu, index) => (

                            <li
                                className={`nav-item ${
                                    openDropdown === index
                                        ? 'dropdown-open'
                                        : ''
                                }`}
                                key={menu.title}
                            >

                                <button
                                    type="button"
                                    className="nav-link dropdown-toggle"
                                    onClick={() => handleDropdown(index)}
                                    aria-expanded={openDropdown === index}
                                >

                                    {menu.title}

                                    <i className="fas fa-chevron-down"></i>

                                </button>

                                <ul className="dropdown-menu">

                                    {menu.items.map((item) => (

                                        <li key={item}>

                                            <a
                                                href={`#${item
                                                    .toLowerCase()
                                                    .replace(/\s+/g, '-')}`}
                                                className="dropdown-item"
                                                onClick={closeMobileMenu}
                                            >
                                                {item}
                                            </a>

                                        </li>

                                    ))}

                                </ul>

                            </li>

                        ))}

                        {/* STANDARD NAVIGATION LINKS */}
                        {standardLinks.map((link) => (

                            <li
                                className="nav-item"
                                key={link.title}
                            >

                                <Link
                                    to={link.path}
                                    className={`nav-link ${
                                        location.pathname === link.path
                                            ? 'active-link'
                                            : ''
                                    }`}
                                    onClick={closeMobileMenu}
                                >
                                    {link.title}
                                </Link>

                            </li>

                        ))}

                    </ul>

                </div>

            </nav>

        </header>
    );
};

export default Header;
