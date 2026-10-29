import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {

    // Prevent form submission from refreshing the page
    const handleSubscribe = (e) => {
        e.preventDefault();
        alert("Thank you for subscribing!");
    };

    return (
        <footer className="site-footer">

            <div className="footer-container">

                {/* Column 1: Brand & Contact */}
                <div className="footer-brand">
                    <div className="footer-logo">
                        <h2>Our Memories <span>EduTech</span></h2>
                        <div className="sub">Learn • Apply • Grow</div>
                    </div>

                    <p>Empowering learners, students, job seekers and businesses through education, opportunity and technology. Your future is our priority.</p>

                    <div className="contact-info">
                        <a href="tel:+27676916912" className="contact-item">
                            <i className="fas fa-phone-alt"></i>
                            <span>067 691 6912 / 072 817 9857</span>
                        </a>
                        <a href="mailto:ourmemoriesedutech@gmail.com" className="contact-item">
                            <i className="fas fa-envelope"></i>
                            <span>ourmemoriesedutech@gmail.com</span>
                        </a>
                        <div className="contact-item">
                            <i className="fas fa-map-marker-alt"></i>
                            <span>South Africa</span>
                        </div>
                    </div>
                </div>

                {/* Column 2: Quick Links (Services) */}
                <div className="footer-column">
                    <h3>Our Services</h3>
                    <ul className="footer-links">
                        {/* Using standard hash links for home page sections */}
                        <li><Link to="/#tutoring"><i className="fas fa-chevron-right"></i> Online Tutoring</Link></li>
                        <li><Link to="/#university"><i className="fas fa-chevron-right"></i> University Applications</Link></li>
                        <li><Link to="/#tvet"><i className="fas fa-chevron-right"></i> TVET Applications</Link></li>
                        <li><Link to="/#bursaries"><i className="fas fa-chevron-right"></i> Bursary Services</Link></li>
                        <li><Link to="/#cv"><i className="fas fa-chevron-right"></i> CV Preparation</Link></li>
                        <li><Link to="/#digital"><i className="fas fa-chevron-right"></i> Digital Services</Link></li>
                    </ul>
                </div>

                {/* Column 3: Company */}
                <div className="footer-column">
                    <h3>Company</h3>
                    <ul className="footer-links">
                        {/* Using React Router Link for actual pages */}
                        <li><Link to="/about"><i className="fas fa-chevron-right"></i> About Us</Link></li>
                        <li><Link to="/#team"><i className="fas fa-chevron-right"></i> Our Team</Link></li>
                        <li><Link to="/#portfolio"><i className="fas fa-chevron-right"></i> Portfolio</Link></li>
                        <li><Link to="/#pricing"><i className="fas fa-chevron-right"></i> Pricing & Packages</Link></li>
                        <li><Link to="/#blog"><i className="fas fa-chevron-right"></i> EduTech Insights</Link></li>
                        <li><Link to="/#contact"><i className="fas fa-chevron-right"></i> Contact Us</Link></li>
                    </ul>
                </div>

                {/* Column 4: Socials & Newsletter */}
                <div className="footer-column">
                    <h3>Connect With Us</h3>

                    <div className="footer-socials">
                        <a href="#linkedin" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
                        <a href="#facebook" aria-label="Facebook"><i className="fab fa-facebook-f"></i></a>
                        <a href="#instagram" aria-label="Instagram"><i className="fab fa-instagram"></i></a>
                        <a href="#whatsapp" aria-label="WhatsApp"><i className="fab fa-whatsapp"></i></a>
                    </div>

                    <div className="newsletter-box">
                        <p>Subscribe to our newsletter for the latest educational news, bursary updates, and career tips.</p>
                        <form className="newsletter-form" onSubmit={handleSubscribe}>
                            <input type="email" placeholder="Enter your email" required />
                            <button type="submit">Subscribe</button>
                        </form>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="footer-bottom">
                <div className="footer-bottom-container">
                    <div className="copyright">
                        &copy; {new Date().getFullYear()} Our Memories EduTech. All rights reserved.
                    </div>
                    <ul className="legal-links">
                        <li><Link to="/privacy">Privacy Policy</Link></li>
                        <li><Link to="/terms">Terms & Conditions</Link></li>
                        <li><Link to="/refund">Refund Policy</Link></li>
                    </ul>
                </div>
            </div>

        </footer>
    );
};

export default Footer;