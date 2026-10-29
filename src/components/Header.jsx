import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';
// Make sure to place your logo image in the assets folder
// and update this import path if necessary.
import logoImg from '../assets/OM.png';

const Header = ({ toggleTheme, theme }) => {
    const location = useLocation();

    // Data for the dropdown menus
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

    // Standard links structure to map paths correctly
    const standardLinks = [
        { title: 'ABOUT US', path: '/about' },
        { title: 'PORTFOLIO', path: '/#portfolio' },
        { title: 'PRICING', path: '/pricing' },
        { title: 'CONTACT US', path: '/#contact' }
    ];

    return (
        <header className="site-header">

            {/* Top Section */}
            <div className="top-bar">

                {/* Logo Area */}
                <Link to="/" className="logo-area">
                    <img
                        src={logoImg}
                        alt="Our Memories EduTech Logo"
                        className="brand-logo"
                    />
                    <span className="sub">Learn • Apply • Grow</span>
                </Link>

                {/* Center Tagline */}
                <div className="center-tagline">
                    <h1>WE <span>EMPOWER</span> PEOPLE</h1>
                    <p className="main-p">EDUCATION | APPLICATIONS | CAREER SUPPORT</p>
                    <p className="sub-p">TUTORING • UNIVERSITY • TVET • BURSARIES • DIGITAL SOLUTIONS</p>
                </div>

                {/* Right Actions */}
                <div className="top-actions">

                    {/* Centered Social Icons */}
                    <div className="social-icons">
                        <a href="#linkedin" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                        <a href="#facebook" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a href="#instagram" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="#whatsapp" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
                    </div>

                    {/* Stacked Action Buttons */}
                    <div className="action-buttons">
                        <a href="#apply" className="btn-pill btn-primary-pill">Apply With Us</a>
                        <a href="#tutor" className="btn-pill btn-secondary-pill">Find a Tutor</a>
                        <a href="#quote" className="btn-pill btn-secondary-pill">Request a Quote</a>
                    </div>
                </div>

            </div>

            {/* Bottom Navigation */}
            <nav className="main-nav">
                <div className="nav-container">
                    <ul className="nav-menu">

                        {/* Dropdown Menus */}
                        {menuData.map((menu, index) => (
                            <li className="nav-item" key={index}>
                                <button className="nav-link">
                                    {menu.title} <i className="fas fa-chevron-down"></i>
                                </button>
                                <ul className="dropdown-menu">
                                    {menu.items.map((item, itemIndex) => (
                                        <li key={itemIndex}>
                                            <a href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} className="dropdown-item">
                                                {item}
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        ))}

                        {/* Standard Links (Updated with React Router) */}
                        {standardLinks.map((link, index) => (
                            <li className="nav-item" key={`std-${index}`}>
                                <Link to={link.path} className="nav-link">
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