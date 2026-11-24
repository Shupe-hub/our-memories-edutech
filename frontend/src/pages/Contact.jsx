import React, { useRef, useState } from 'react';
import './Contact.css';

const Contact = () => {
    const [formStatus, setFormStatus] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const submissionInProgress = useRef(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (submissionInProgress.current) {
            return;
        }

        const form = event.currentTarget;
        const formData = new FormData(form);
        const payload = {
            name: `${formData.get('firstName')} ${formData.get('lastName')}`.trim(),
            email: formData.get('email'),
            phone: formData.get('phone'),
            service: formData.get('service'),
            subject: formData.get('subject'),
            message: formData.get('message'),
            website: formData.get('website'),
        };

        submissionInProgress.current = true;
        setIsSubmitting(true);
        setFormStatus({ type: 'loading', message: 'Sending your message…' });

        try {
            const response = await fetch('/api/contact.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            let result;
            try {
                result = await response.json();
            } catch {
                throw new Error('The enquiry service returned an unexpected response. Please try again later.');
            }
            if (!result || typeof result !== 'object' || Array.isArray(result)) {
                throw new Error('The enquiry service returned an unexpected response. Please try again later.');
            }

            if (!response.ok || result.success !== true) {
                throw new Error(
                    typeof result.error === 'string' && result.error.length < 300
                        ? result.error
                        : 'We could not send your message. Please try again.',
                );
            }

            form.reset();
            setFormStatus({
                type: 'success',
                message: 'Thank you. Your enquiry has been submitted, and our team will be in touch soon.',
            });
        } catch (error) {
            setFormStatus({
                type: 'error',
                message:
                    error instanceof TypeError
                        ? 'We could not connect to our enquiry service. Please try again later or email info@ourmemoriesedutech.co.za.'
                        : error instanceof Error
                            ? error.message
                            : 'We could not send your message. Please try again later.',
            });
        } finally {
            submissionInProgress.current = false;
            setIsSubmitting(false);
        }
    };

    // WhatsApp Configuration
    const whatsappNumber = "27634328758"; // Remember: Country code + number (no leading 0)
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
                    <a href="tel:+27680513619" className="contact-detail-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="contact-icon-box">
                            <i className="fas fa-phone-alt"></i>
                        </div>
                        <div className="contact-detail-text">
                            <h4>Call or WhatsApp Us</h4>
                            <p>068 051 3619 / 072 817 9857</p>
                        </div>
                    </a>

                    {/* Email Link */}
                    <a href="mailto:info@ourmemoriesedutech.co.za" className="contact-detail-item" style={{ textDecoration: 'none', color: 'inherit' }}>
                        <div className="contact-icon-box">
                            <i className="fas fa-envelope"></i>
                        </div>
                        <div className="contact-detail-text">
                            <h4>Email Us</h4>
                            <p>info@ourmemoriesedutech.co.za</p>
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
                    <div className="contact-honeypot" aria-hidden="true">
                        <label htmlFor="website">Leave this field empty</label>
                        <input
                            type="text"
                            id="website"
                            name="website"
                            tabIndex="-1"
                            autoComplete="off"
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="firstName">First Name</label>
                            <input type="text" id="firstName" name="firstName" className="form-control" placeholder="John" autoComplete="given-name" maxLength="80" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Last Name</label>
                            <input type="text" id="lastName" name="lastName" className="form-control" placeholder="Doe" autoComplete="family-name" maxLength="80" required />
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" className="form-control" placeholder="sthembile@example.com" autoComplete="email" maxLength="254" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input type="tel" id="phone" name="phone" className="form-control" placeholder="072 123 4567" autoComplete="tel" maxLength="40" required />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="service">Service Required</label>
                        <select id="service" name="service" className="form-control select-control" required defaultValue="">
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
                        <label htmlFor="subject">Subject</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            className="form-control"
                            placeholder="What would you like help with?"
                            maxLength="180"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="message">Your Message</label>
                        <textarea id="message" name="message" className="form-control" placeholder="Tell us exactly what you need help with..." maxLength="8000" required></textarea>
                    </div>

                    <button type="submit" className="submit-btn" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending…' : 'Send Message'}
                        <i className={`fas ${isSubmitting ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`} aria-hidden="true"></i>
                    </button>

                    {formStatus && (
                        <p
                            className={`contact-form-status contact-form-status--${formStatus.type}`}
                            role={formStatus.type === 'error' ? 'alert' : 'status'}
                            aria-live="polite"
                        >
                            {formStatus.message}
                        </p>
                    )}

                </form>
            </div>

        </div>
    );
};

export default Contact;