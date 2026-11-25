import React from 'react';
import { Link } from 'react-router-dom';
import './About.css';

const teamMembers = [
    { name: 'Sakhile Lusiba', email: 'sakhile@ourmemoriesedutech.co.za', initials: 'SL' },
    { name: 'Simphiwe Mabone', email: 'simpphiwe@ourmemoriesedutech.co.za', initials: 'SM' },
    { name: 'Mzwandile Thabethe', email: 'mzwandile@ourmemoriesedutech.co.za', initials: 'MT' },
    { name: 'Nomsa Metfula', email: 'nomsa@ourmemoriesedutech.co.za', initials: 'NM' },
    { name: 'Violin Mayan', email: 'violin@ourmemoriesedutech.co.za', initials: 'VM' }
];

const About = () => {
    return (
        <div className="about-page">

            {/* 1. Hero Section */}
            <section className="about-hero">
                <span className="section-label about-hero-label">WHO WE ARE</span>
                <h1>Our Story. Our Mission.</h1>
                <p>Empowering learners, students, job seekers and businesses through education, opportunity and technology.</p>
            </section>

            {/* 2. Our Story */}
            <section className="about-story" id="story">
                <div className="about-story-content">
                    <span className="section-label">OUR STORY</span>
                    <h2 className="section-title">How Our Memories EduTech <span>Started.</span></h2>
                    <p>Our Memories EduTech was born out of a simple realization: the path from education to career is often filled with complex, confusing steps. Students struggle to find the right tutor, figure out university applications, secure funding, and prepare for the job market.</p>
                    <p>We decided to bridge that gap. We didn't want to be just another application office or just another tech company. We wanted to create an integrated ecosystem where a learner can get academic support, apply to university, secure a bursary, build a professional CV, and even have a website built for their new business — all under one roof.</p>
                    <p>Today, Our Memories EduTech stands as a multi-division company dedicated to your success.</p>
                </div>
                <div className="about-story-visual">
                    <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" alt="Students learning" className="about-story-img" />
                    <div className="about-story-badge">Learn. Apply. Grow.</div>
                </div>
            </section>

            {/* 3. Mission & Vision */}
            <section className="about-mv">
                <div className="about-mv-container">
                    <div className="mv-card">
                        <div className="mv-icon"><i className="fas fa-bullseye"></i></div>
                        <h3>Our Mission</h3>
                        <p>To provide accessible, high-quality educational support, application assistance, career guidance, and digital solutions that empower individuals to reach their full potential and navigate their future with confidence.</p>
                    </div>
                    <div className="mv-card">
                        <div className="mv-icon"><i className="fas fa-eye"></i></div>
                        <h3>Our Vision</h3>
                        <p>To become a trusted digital education and opportunity platform connecting people to knowledge, education, careers, and technology across Africa and beyond.</p>
                    </div>
                </div>
            </section>

            {/* 4. Our Core Values */}
            <section className="about-values">
                <div className="about-values-header">
                    <span className="section-label">OUR CORE VALUES</span>
                    <h2 className="section-title">What Drives <span>Us.</span></h2>
                    <p>These principles guide every interaction, application, and project we take on.</p>
                </div>

                <div className="values-grid">
                    <div className="value-card">
                        <div className="value-icon"><i className="fas fa-handshake"></i></div>
                        <h4>Integrity</h4>
                        <p>We are honest, transparent, and ethical in all our dealings with students, parents, and business clients.</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon"><i className="fas fa-star"></i></div>
                        <h4>Excellence</h4>
                        <p>We strive for the highest quality in our tutoring, applications, and software development.</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon"><i className="fas fa-universal-access"></i></div>
                        <h4>Accessibility</h4>
                        <p>We make education and career guidance accessible to everyone, regardless of their background.</p>
                    </div>
                    <div className="value-card">
                        <div className="value-icon"><i className="fas fa-lightbulb"></i></div>
                        <h4>Innovation</h4>
                        <p>We use modern technology to solve educational and business challenges creatively.</p>
                    </div>
                </div>
            </section>

            {/* 5. Meet Our Team */}
            <section className="about-team" id="team" aria-labelledby="about-team-title">
                <div className="about-team-header">
                    <img
                        className="about-team-logo"
                        src="/our-memories-edutech-logo.png"
                        alt="Our Memories EduTech"
                    />
                    <span className="section-label">OUR PEOPLE</span>
                    <h2 className="section-title" id="about-team-title">Meet <span>Our Team.</span></h2>
                </div>
                <div className="about-team-grid">
                    {teamMembers.map((member) => (
                        <article className="team-card" key={member.email}>
                            <div className="team-avatar" aria-hidden="true">{member.initials}</div>
                            <h3>{member.name}</h3>
                            <a href={`mailto:${member.email}`}>{member.email}</a>
                        </article>
                    ))}
                </div>
            </section>

            {/* 6. Why Choose Us */}
            <section className="about-why">
                <div className="about-why-container">
                    <div className="about-why-content">
                        <span className="section-label">WHY CHOOSE US</span>
                        <h2>More than just a service. <br /> A partner in your journey.</h2>
                        <p>We are uniquely positioned to support you through every phase of your development.</p>
                        <ul className="about-why-list">
                            <li><i className="fas fa-check-circle"></i> 4 Core Divisions under one roof</li>
                            <li><i className="fas fa-check-circle"></i> Dedicated and qualified tutors</li>
                            <li><i className="fas fa-check-circle"></i> Expert application assistance (Uni, TVET, Bursaries)</li>
                            <li><i className="fas fa-check-circle"></i> Professional career and CV services</li>
                            <li><i className="fas fa-check-circle"></i> Modern, scalable digital and web solutions</li>
                        </ul>
                    </div>
                    <div className="about-why-visual">
                        <h3>4</h3>
                        <p>Integrated Divisions</p>
                        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', margin: '20px 0' }} />
                        <h3>100%</h3>
                        <p>Commitment to your success</p>
                    </div>
                </div>
            </section>

            {/* 7. Contact Information */}
            <section className="about-contact" id="contact" aria-labelledby="about-contact-title">
                <div className="about-contact-content">
                    <img
                        className="about-contact-logo"
                        src="/our-memories-edutech-logo.png"
                        alt="Our Memories EduTech"
                    />
                    <div>
                        <span className="section-label">GET IN TOUCH</span>
                        <h2 className="section-title" id="about-contact-title">Company <span>Contact.</span></h2>
                        <p>Have a question or need support? Give us a call.</p>
                        <a className="about-contact-phone" href="tel:+27680513619">
                            <i className="fas fa-phone" aria-hidden="true"></i>
                            <span>068 051 3619</span>
                        </a>
                    </div>
                </div>
            </section>

            {/* 8. Call to Action */}
            <section className="about-cta">
                <h2 className="section-title">Ready to take the <span>next step?</span></h2>
                <p>Whether you need a tutor, an application, a CV, or a website, we are here to help.</p>
                <Link to="/#contact" className="btn btn-primary">Get in Touch <i className="fas fa-arrow-right"></i></Link>
            </section>

        </div>
    );
};

export default About;
