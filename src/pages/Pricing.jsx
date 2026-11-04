import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Pricing.css';

const Pricing = () => {
    // State to manage which FAQ is currently open
    const [activeFaq, setActiveFaq] = useState(null);

    const toggleFaq = (index) => {
        setActiveFaq(activeFaq === index ? null : index);
    };

    const faqs = [
        {
            question: "Do you require a deposit before starting?",
            answer: "Yes, we usually require a 50% deposit to secure your spot in our development queue and begin the design phase. The remaining 50% is due upon project completion and approval before we launch the website live."
        },
        {
            question: "How long does a typical website take to build?",
            answer: "Tier A (Static) sites can take 1-2 weeks. Tier B (Dynamic/CMS) sites take 2-4 weeks depending on the number of pages. Tier C (E-commerce/Web Apps) can take 4-8 weeks depending on the complexity."
        },
        {
            question: "Are there monthly hosting fees?",
            answer: "Yes. While the pricing listed here is for the design and development, you will need to pay for domain registration and hosting on an annual or monthly basis. We can handle this setup for you."
        },
        {
            question: "Do you offer maintenance after launch?",
            answer: "Absolutely. We offer ongoing maintenance packages that include software updates, security patches, daily backups, and minor content changes."
        }
    ];

    return (
        <div className="pricing-page">
            
            {/* Hero Section */}
            <section className="pricing-hero">
                <div className="badge">Transparent Pricing</div>
                <h1>Professional Website <br /><span>Design & Development</span></h1>
                <p>We create modern, responsive and affordable websites that help businesses, schools and individuals grow online. Whether you need a simple website or a fully functional web application, we've got you covered.</p>
                
                <div className="feature-checks">
                    <div><i className="fas fa-laptop-code"></i> Responsive Design</div>
                    <div><i className="fas fa-shield-alt"></i> Secure & Reliable</div>
                    <div><i className="fas fa-tags"></i> Affordable Prices</div>
                    <div><i className="fas fa-chart-line"></i> Build Your Presence</div>
                </div>
            </section>

            {/* Pricing Grid */}
            <section className="pricing-section">
                <div className="pricing-grid">
                    
                    {/* Tier A */}
                    <div className="price-card">
                        <div className="card-header">
                            <div className="card-icon"><i className="fas fa-laptop"></i></div>
                            <h3>Tier A: Static Websites</h3>
                            <p>Frontend-Only / No Database / No Login. Perfect for information display, local services, and basic portfolios.</p>
                        </div>
                        <div className="card-body">
                            <div className="price-display">
                                <span className="amount">R1,500</span>
                                <span className="period"> – R3,500</span>
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '5px' }}>1 Page (Landing Page)</div>
                            </div>
                            
                            <ul className="features-list">
                                <li><i className="fas fa-check-circle"></i> Fast loading & clean design</li>
                                <li><i className="fas fa-check-circle"></i> Mobile friendly & responsive</li>
                                <li><i className="fas fa-check-circle"></i> Easy to maintain</li>
                                <li><i className="fas fa-check-circle"></i> Basic SEO setup</li>
                            </ul>

                            <Link to="/contact" className="card-btn btn-outline">Get Started</Link>
                        </div>
                    </div>

                    {/* Tier B (Most Popular) */}
                    <div className="price-card popular">
                        <div className="popular-ribbon"><i className="fas fa-star"></i> Most Popular</div>
                        <div className="card-header">
                            <div className="card-icon"><i className="fab fa-wordpress"></i></div>
                            <h3>Tier B: Dynamic Websites</h3>
                            <p>Standard Backend / CMS Driven. Perfect for growing SMEs, corporate sites, and blogs.</p>
                        </div>
                        <div className="card-body">
                            <div className="inner-price-list">
                                <div className="inner-price-item">
                                    <span className="inner-price-title">1 Page (Splash/Lead Capture)</span>
                                    <span className="inner-price-amount">R3,500 – R5,500</span>
                                </div>
                                <div className="inner-price-item">
                                    <span className="inner-price-title">2 to 5 Pages</span>
                                    <span className="inner-price-desc">Standard Small Business</span>
                                    <span className="inner-price-amount">R5,000 – R14,780</span>
                                </div>
                                <div className="inner-price-item">
                                    <span className="inner-price-title">6 to 10 Pages</span>
                                    <span className="inner-price-desc">Growing SME / Blog Layout</span>
                                    <span className="inner-price-amount">R12,000 – R20,000</span>
                                </div>
                                <div className="inner-price-item">
                                    <span className="inner-price-title">11 to 20+ Pages</span>
                                    <span className="inner-price-desc">Corporate / Heavy Content</span>
                                    <span className="inner-price-amount">R17,420 – R45,000+</span>
                                </div>
                            </div>

                            <Link to="/contact" className="card-btn btn-primary">Request a Quote</Link>
                        </div>
                    </div>

                    {/* Tier C */}
                    <div className="price-card">
                        <div className="card-header">
                            <div className="card-icon"><i className="fas fa-shopping-cart"></i></div>
                            <h3>Tier C: Heavy Backend</h3>
                            <p>E-Commerce & Portals. For businesses that require secure payments, user accounts, and complex databases.</p>
                        </div>
                        <div className="card-body">
                            <div className="inner-price-list">
                                <div className="inner-price-item">
                                    <span className="inner-price-title">E-Commerce Shop</span>
                                    <span className="inner-price-desc">1 – 50 Products</span>
                                    <span className="inner-price-amount">R15,000 – R25,000</span>
                                </div>
                                <div className="inner-price-item">
                                    <span className="inner-price-title">E-Commerce Shop</span>
                                    <span className="inner-price-desc">Premium / High Inventory</span>
                                    <span className="inner-price-amount">R25,000 – R85,000+</span>
                                </div>
                                <div className="inner-price-item">
                                    <span className="inner-price-title">Web App / Custom Booking</span>
                                    <span className="inner-price-desc">Portals / SAAS Solutions</span>
                                    <span className="inner-price-amount">R18,500 – R100,000+</span>
                                </div>
                            </div>

                            <Link to="/contact" className="card-btn btn-outline">Request a Quote</Link>
                        </div>
                    </div>

                </div>
            </section>

            {/* Add-ons Section */}
            <section className="addons-section">
                <div className="addons-container">
                    <div className="addons-header">
                        <i className="fas fa-cogs"></i>
                        <h2>Additional Hidden Line-Items</h2>
                    </div>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', fontSize: '0.95rem' }}>A project quote usually includes these extra technical or regulatory dependencies:</p>
                    
                    <div className="addons-grid">
                        <div className="addon-item">
                            <h4>POPIA Compliance</h4>
                            <span className="addon-price">R850 – R2,500</span>
                            <p>Mandatory in South Africa for backend user data capture.</p>
                        </div>
                        <div className="addon-item">
                            <h4>Payment Gateway</h4>
                            <span className="addon-price">R1,500 – R3,500</span>
                            <p>Integration (PayFast, Yoco or Peach Payments).</p>
                        </div>
                        <div className="addon-item">
                            <h4>Advanced SSL (OV/EV)</h4>
                            <span className="addon-price">R900 – R4,500 / yr</span>
                            <p>For secure custom payment portals. Basic free SSL included.</p>
                        </div>
                        <div className="addon-item">
                            <h4>API Integration</h4>
                            <span className="addon-price">R2,500 – R8,000</span>
                            <p>Per endpoint (e.g., Xero, Courier Guy, etc.).</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="faq-section">
                <div className="faq-container">
                    <div className="faq-header">
                        <h2>Frequently Asked Questions</h2>
                    </div>

                    {faqs.map((faq, index) => (
                        <div 
                            key={index} 
                            className={`faq-item ${activeFaq === index ? 'active' : ''}`}
                        >
                            <div className="faq-question" onClick={() => toggleFaq(index)}>
                                {faq.question}
                                <i className="fas fa-chevron-down"></i>
                            </div>
                            <div className="faq-answer">
                                {faq.answer}
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Bottom CTA */}
            <section className="cta-bottom">
                <h2>Ready to build your digital future?</h2>
                <p>Let's discuss your project and find the perfect solution for your budget.</p>
                <Link to="/contact" className="cta-btn">Contact Us Today <i className="fas fa-arrow-right"></i></Link>
            </section>

        </div>
    );
};

export default Pricing;