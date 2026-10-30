import React, { useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formStatus, setFormStatus] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormStatus('Sending...');

        setTimeout(() => {
            setFormStatus('Message sent successfully! We will be in touch soon.');
            e.target.reset();
        }, 1500);
    };

    // WhatsApp Configuration
    const whatsappNumber = "27676916912"; // Remember: Country code + number (no leading 0)
    const whatsappMessage = "Hello Our Memories EduTech, I would like assistance with...";
    const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

    return (
        <div className="contact-page">

            {/* Left Side: Contact Information */}
            <div className="contact-info-section">
                <div className="contact-badge">Get in Touch</div>
                <h1>Let's build your <br /><span>digital future.</span></h1>
                <p>Whether you need a tutor, help with an application, a professional CV, or a new website, our team is ready to assist you.</p>

                <div className="contact-details">

                    {/* Phone Link */}
                    <a href="tel:+27676916912" className="contact-detail-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="contact-icon-box">
                            <i className="fas fa-phone-alt"></i>
                        </div>
                        <div className="contact-detail-text">
                            <h4>Call or WhatsApp Us</h4>
                            <p>067 691 6912 / 072 817 9857</p>
                        </div>
                    </a>

                    {/* Email Link */}
                    <a href="mailto:ourmemoriesedutech@gmail.com" className="contact-detail-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="contact-icon-box">
                            <i className="fas fa-envelope"></i>
                        </div>
                        <div className="contact-detail-text">
                            <h4>Email Us</h4>
                            <p>ourmemoriesedutech@gmail.com</p>
                        </div>
                    </a>

                    <div className="contact-detail-item">
                        <div className="contact-icon-box">
                            <i className="fas fa-map-marker-alt"></i>
                        </div>
                        <div className="contact-detail-text">
                            <h4>Location</h4>
                            <p>South Africa</p>
                        </div>
                    </div>

                </div>

                {/* Social Media Links */}
                <div className="contact-socials">
                    {/* LinkedIn */}
                    <a
                        href="https://www.linkedin.com/company/your-page-name"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-btn"
                        aria-label="LinkedIn"
                    >
                        <i className="fab fa-linkedin-in"></i>
                    </a>

                    {/* Facebook */}
                    <a
                        href="https://www.facebook.com/your-page-name"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-btn"
                        aria-label="Facebook"
                    >
                        <i className="fab fa-facebook-f"></i>
                    </a>

                    {/* Instagram */}
                    <a
                        href="https://www.instagram.com/your-page-name"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-btn"
                        aria-label="Instagram"
                    >
                        <i className="fab fa-instagram"></i>
                    </a>

                    {/* WhatsApp */}
                    <a
                        href={whatsappLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-btn"
                        aria-label="WhatsApp"
                    >
                        <i className="fab fa-whatsapp"></i>
                    </a>
                </div>
            </div>

            {/* Right Side: Contact Form */}
            <div className="contact-form-section">
                <h2>Send us a message</h2>
                <p>Fill out the form below and we will get back to you as soon as possible.</p>

                <form onSubmit={handleSubmit}>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" id="firstName" className="form-control" placeholder="John" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" id="lastName" className="form-control" placeholder="Doe" required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" className="form-control" placeholder="john@example.com" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" className="form-control" placeholder="072 123 4567" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="service">Service Required</label>
                        <select id="service" className="form-control select-control" required defaultValue="">
                            <option value="" disabled>Select a service...</option>
                            <option value="tutoring">Online Tutoring</option>
                            <option value="applications">University / TVET Applications</option>
                            <option value="bursaries">Bursary Assistance</option>
                            <option value="cv">CV & Career Services</option>
                            <option value="web">Website Development</option>
                            <option value="other">Other Enquiry</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Your Message</label>
                        <textarea id="message" className="form-control" placeholder="Tell us exactly what you need help with..." required></textarea>
                    </div>

                    <button type="submit" className="submit-btn">
                        Send Message <i className="fas fa-paper-plane"></i>
                    </button>

                    {formStatus && <p style={{ marginTop: '1rem', color: 'var(--brand-teal)', fontWeight: '600', textAlign: 'center' }}>{formStatus}</p>}

                </form>
            </div>

        </div>
    );
};

export default Contact;