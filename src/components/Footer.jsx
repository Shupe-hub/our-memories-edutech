import { useState } from "react";
import { Link } from "react-router-dom";
import logoImg from "../assets/OM.png";
import "./Footer.css";

const currentYear = new Date().getFullYear();

const serviceLinks = [
    { label: "Career Services", to: "/career-services" },
    { label: "CV Preparation", to: "/career-services/cv-preparation" },
    { label: "Cover Letters", to: "/career-services/cover-letters" },
    { label: "Job Applications", to: "/career-services/job-applications" },
    { label: "Internships & Learnerships", to: "/career-services/internships-learnerships" },
    { label: "Graduate Programmes", to: "/career-services/graduate-programmes" },
    { label: "Online Tutoring", to: "/education/online-tutoring" },
    { label: "University Applications", to: "/applications/university" },
    { label: "TVET Applications", to: "/applications/tvet" },
    { label: "School Applications", to: "/applications/school" },
    { label: "Bursary Services", to: "/applications/bursaries" },
    { label: "NSFAS Applications", to: "/applications/nsfas" },
    { label: "CAO Applications", to: "/applications/cao" },
    { label: "Study Resources", to: "/education/study-resources" },
    { label: "Career Guidance", to: "/education/career-guidance" },
];

const companyLinks = [
    { label: "About Us", to: "/about" },
    { label: "Education", to: "/education" },
    { label: "Applications", to: "/applications" },
    { label: "Pricing & Packages", to: "/pricing" },
    { label: "Contact Us", to: "/contact" },
];

const whatsappUrl =
    "https://wa.me/27676916912?text=Hello%20Our%20Memories%20EduTech%2C%20I%20would%20like%20to%20learn%20more%20about%20your%20services.";

function Footer() {
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterMessage, setNewsletterMessage] = useState("");

    function handleSubscribe(event) {
        event.preventDefault();
        setNewsletterMessage(
            "Newsletter subscriptions are not available yet. Please check back soon.",
        );
    }

    function handleEmailChange(event) {
        setNewsletterEmail(event.target.value);
        setNewsletterMessage("");
    }

    return (
        <footer className="site-footer">
            <div className="footer-container">
                <section className="footer-brand" aria-label="Our Memories EduTech contact information">
                    <Link to="/" className="footer-logo" aria-label="Our Memories EduTech home">
                        <img src={logoImg} alt="Our Memories EduTech" />
                        <span className="sub">Learn • Apply • Grow</span>
                    </Link>

                    <p>
                        Supporting learners and students with education,
                        application and career guidance.
                    </p>

                    <address className="contact-info">
                        <a href="tel:+27676916912" className="contact-item">
                            <i className="fas fa-phone-alt" aria-hidden="true"></i>
                            <span>067 691 6912</span>
                        </a>
                        <a href="mailto:info@ourmemoriesedutech.co.za" className="contact-item">
                            <i className="fas fa-envelope" aria-hidden="true"></i>
                            <span>info@ourmemoriesedutech.co.za</span>
                        </a>
                        <a href="mailto:Ourmemoriesapplicationoffice@gmail.com" className="contact-item">
                            <i className="fas fa-envelope" aria-hidden="true"></i>
                            <span>Ourmemoriesapplicationoffice@gmail.com</span>
                        </a>
                        <a
                            href="http://www.ourmemoriesedutech.co.za/"
                            className="contact-item"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <i className="fas fa-globe" aria-hidden="true"></i>
                            <span>www.ourmemoriesedutech.co.za</span>
                        </a>
                    </address>
                </section>

                <nav className="footer-column" aria-label="Our services">
                    <h3>Our Services</h3>
                    <ul className="footer-links">
                        {serviceLinks.map((link) => (
                            <li key={link.to}>
                                <Link to={link.to}>
                                    <i className="fas fa-chevron-right" aria-hidden="true"></i>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <nav className="footer-column" aria-label="Company">
                    <h3>Company</h3>
                    <ul className="footer-links">
                        {companyLinks.map((link) => (
                            <li key={link.to}>
                                <Link to={link.to}>
                                    <i className="fas fa-chevron-right" aria-hidden="true"></i>
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <section className="footer-column footer-connect">
                    <h3>Connect With Us</h3>
                    <div className="footer-socials" aria-label="Social media">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Contact Our Memories EduTech on WhatsApp"
                        >
                            <i className="fab fa-whatsapp" aria-hidden="true"></i>
                        </a>
                    </div>

                    <div className="newsletter-box">
                        <p>
                            Newsletter sign-up is not available yet. You can
                            subscribe here once the service is connected.
                        </p>
                        <form className="newsletter-form" onSubmit={handleSubscribe}>
                            <label className="footer-visually-hidden" htmlFor="footer-newsletter-email">
                                Email address
                            </label>
                            <input
                                id="footer-newsletter-email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                autoComplete="email"
                                value={newsletterEmail}
                                onChange={handleEmailChange}
                                required
                            />
                            <button type="submit">Subscribe</button>
                        </form>
                        <p className="newsletter-status" role="status" aria-live="polite">
                            {newsletterMessage}
                        </p>
                    </div>
                </section>
            </div>

            <div className="footer-bottom">
                <div className="footer-bottom-container">
                    <p className="copyright">
                        &copy; {currentYear} Our Memories EduTech. All rights reserved.
                    </p>
                    <nav aria-label="Legal information">
                        <ul className="legal-links">
                            <li><Link to="/privacy">Privacy Policy</Link></li>
                            <li><Link to="/terms">Terms &amp; Conditions</Link></li>
                            <li><Link to="/refund">Refund Policy</Link></li>
                        </ul>
                    </nav>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
