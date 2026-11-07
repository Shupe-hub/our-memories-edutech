
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/education/OnlineTutoring.css';

const gradeSubjects = {
    'Grade 9': [
        'Mathematics',
        'Natural Sciences',
        'English',
        'Geography',
        'History',
        'Business Studies',
        'Economic and Management Sciences',
        'Technology'
    ],
    'Grade 10': [
        'Mathematics',
        'Mathematical Literacy',
        'Physical Sciences',
        'Life Sciences',
        'Accounting',
        'English',
        'Geography',
        'Business Studies',
        'History',
        'CAT',
        'IT'
    ],
    'Grade 11': [
        'Mathematics',
        'Mathematical Literacy',
        'Physical Sciences',
        'Life Sciences',
        'Accounting',
        'English',
        'Geography',
        'Business Studies',
        'History',
        'CAT',
        'IT'
    ],
    'Grade 12': [
        'Mathematics',
        'Mathematical Literacy',
        'Physical Sciences',
        'Life Sciences',
        'Accounting',
        'English',
        'Geography',
        'Business Studies',
        'History',
        'CAT',
        'IT'
    ]
};

const OnlineTutoring = () => {
    const [formData, setFormData] = useState({
        learnerName: '',
        parentName: '',
        grade: '',
        subject: '',
        email: '',
        phone: '',
        message: ''
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(previous => ({
            ...previous,
            [name]: value,
            ...(name === 'grade' ? { subject: '' } : {})
        }));

        setErrors(previous => ({
            ...previous,
            [name]: ''
        }));
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.learnerName.trim()) {
            newErrors.learnerName = 'Please enter the learner name.';
        }

        if (!formData.grade) {
            newErrors.grade = 'Please select a grade.';
        }

        if (!formData.subject) {
            newErrors.subject = 'Please select a subject.';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Please enter a contact number.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Please enter an email address.';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const whatsappMessage = `
ONLINE TUTORING ENQUIRY

Learner Name: ${formData.learnerName}
Parent/Guardian Name: ${formData.parentName || 'Not provided'}
Grade: ${formData.grade}
Subject: ${formData.subject}
Email: ${formData.email}
Contact Number: ${formData.phone}

Additional Information:
${formData.message || 'No additional information provided.'}
        `.trim();

        const whatsappLink = `https://wa.me/27676916912?text=${encodeURIComponent(whatsappMessage)}`;

        window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="online-tutoring-page">

            {/* HERO SECTION */}
            <section className="tutoring-hero">

                <div className="tutoring-container tutoring-hero-content">

                    <div className="tutoring-hero-text">

                        <span className="tutoring-eyebrow">
                            OUR EDUCATION SERVICES
                        </span>

                        <h1>
                            Online Tutoring for
                            <span> Grades 9–12</span>
                        </h1>

                        <p>
                            Get academic support that helps you understand
                            your subjects, strengthen your knowledge and
                            prepare for your examinations.
                        </p>

                        <div className="tutoring-hero-buttons">

                            <a
                                href="#tutoring-enquiry"
                                className="tutoring-btn tutoring-btn-primary"
                            >
                                Request a Tutor
                                <i className="fas fa-arrow-right"></i>
                            </a>

                            <Link
                                to="/education"
                                className="tutoring-btn tutoring-btn-outline"
                            >
                                Explore Education
                            </Link>

                        </div>

                        <div className="tutoring-hero-note">
                            <i className="fas fa-graduation-cap"></i>
                            Academic support for Grade 9 to Grade 12 learners
                        </div>

                    </div>

                    <div className="tutoring-hero-visual">

                        <div className="tutoring-illustration-card">

                            <div className="tutoring-illustration-icon">
                                <i className="fas fa-laptop"></i>
                            </div>

                            <div className="tutoring-illustration-content">
                                <span>YOUR LEARNING JOURNEY</span>
                                <h3>Learn with confidence.</h3>
                                <p>
                                    Understand. Practise. Improve.
                                </p>
                            </div>

                            <div className="tutoring-floating-icon tutoring-icon-one">
                                <i className="fas fa-book-open"></i>
                            </div>

                            <div className="tutoring-floating-icon tutoring-icon-two">
                                <i className="fas fa-calculator"></i>
                            </div>

                            <div className="tutoring-floating-icon tutoring-icon-three">
                                <i className="fas fa-pencil-alt"></i>
                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* INTRODUCTION */}
            <section className="tutoring-intro section-padding">

                <div className="tutoring-container">

                    <div className="tutoring-section-heading">

                        <span className="tutoring-eyebrow">
                            LEARN WITH US
                        </span>

                        <h2>
                            Supporting your <span>academic success</span>
                        </h2>

                        <p>
                            Every learner has different academic needs.
                            Our online tutoring service connects learners
                            with subject-focused academic support for
                            Grades 9 to 12.
                        </p>

                    </div>

                    <div className="tutoring-benefits-grid">

                        <article className="tutoring-benefit-card">
                            <div className="tutoring-benefit-icon">
                                <i className="fas fa-book-reader"></i>
                            </div>

                            <h3>Subject Support</h3>

                            <p>
                                Get help understanding important topics
                                and concepts in your selected subjects.
                            </p>
                        </article>

                        <article className="tutoring-benefit-card">
                            <div className="tutoring-benefit-icon">
                                <i className="fas fa-file-alt"></i>
                            </div>

                            <h3>Exam Preparation</h3>

                            <p>
                                Strengthen your examination preparation
                                through revision and practice.
                            </p>
                        </article>

                        <article className="tutoring-benefit-card">
                            <div className="tutoring-benefit-icon">
                                <i className="fas fa-user-graduate"></i>
                            </div>

                            <h3>Individual Support</h3>

                            <p>
                                Request learning assistance based on
                                your grade, subject and academic needs.
                            </p>
                        </article>

                        <article className="tutoring-benefit-card">
                            <div className="tutoring-benefit-icon">
                                <i className="fas fa-clock"></i>
                            </div>

                            <h3>Flexible Enquiries</h3>

                            <p>
                                Tell us about your learning requirements
                                so we can discuss suitable arrangements.
                            </p>
                        </article>

                    </div>

                </div>

            </section>

            {/* GRADES SECTION */}
            <section className="tutoring-grades section-padding">

                <div className="tutoring-container">

                    <div className="tutoring-section-heading">

                        <span className="tutoring-eyebrow">
                            WHO CAN APPLY?
                        </span>

                        <h2>
                            Choose your <span>grade</span>
                        </h2>

                        <p>
                            We provide online tutoring enquiries for
                            learners from Grade 9 to Grade 12.
                        </p>

                    </div>

                    <div className="tutoring-grade-grid">

                        {Object.keys(gradeSubjects).map((grade, index) => (

                            <article
                                className="tutoring-grade-card"
                                key={grade}
                            >

                                <div className="grade-number">
                                    0{index + 1}
                                </div>

                                <div className="grade-icon">
                                    <i className="fas fa-graduation-cap"></i>
                                </div>

                                <h3>{grade}</h3>

                                <p>
                                    Academic support and subject-focused
                                    learning assistance.
                                </p>

                                <a
                                    href="#tutoring-enquiry"
                                    onClick={() => {
                                        setFormData(previous => ({
                                            ...previous,
                                            grade,
                                            subject: ''
                                        }));
                                    }}
                                >
                                    Request tutoring
                                    <i className="fas fa-arrow-right"></i>
                                </a>

                            </article>

                        ))}

                    </div>

                </div>

            </section>

            {/* SUBJECTS SECTION */}
            <section className="tutoring-subjects section-padding">

                <div className="tutoring-container">

                    <div className="tutoring-section-heading">

                        <span className="tutoring-eyebrow">
                            SUBJECT AREAS
                        </span>

                        <h2>
                            Subjects we <span>support</span>
                        </h2>

                        <p>
                            Select your grade to explore the subject
                            areas available for tutoring enquiries.
                        </p>

                    </div>

                    <div className="tutoring-subjects-content">

                        <div className="tutoring-subjects-list">

                            {Object.entries(gradeSubjects).map(([grade, subjects]) => (

                                <div
                                    className="tutoring-subject-group"
                                    key={grade}
                                >

                                    <h3>{grade}</h3>

                                    <div className="tutoring-subject-tags">

                                        {subjects.map(subject => (

                                            <span key={`${grade}-${subject}`}>
                                                <i className="fas fa-check"></i>
                                                {subject}
                                            </span>

                                        ))}

                                    </div>

                                </div>

                            ))}

                        </div>

                    </div>

                    <p className="tutoring-subject-note">
                        <i className="fas fa-info-circle"></i>
                        Subject availability and tutor matching will be
                        confirmed when you submit your enquiry.
                    </p>

                </div>

            </section>

            {/* HOW IT WORKS */}
            <section className="tutoring-process section-padding">

                <div className="tutoring-container">

                    <div className="tutoring-section-heading">

                        <span className="tutoring-eyebrow">
                            GET STARTED
                        </span>

                        <h2>
                            How does <span>it work?</span>
                        </h2>

                        <p>
                            Getting started with online tutoring is simple.
                        </p>

                    </div>

                    <div className="tutoring-process-grid">

                        <article className="tutoring-process-card">

                            <span className="process-step">01</span>

                            <div className="process-icon">
                                <i className="fas fa-clipboard-list"></i>
                            </div>

                            <h3>Submit an Enquiry</h3>

                            <p>
                                Complete the enquiry form with your
                                grade, subject and contact details.
                            </p>

                        </article>

                        <article className="tutoring-process-card">

                            <span className="process-step">02</span>

                            <div className="process-icon">
                                <i className="fas fa-comments"></i>
                            </div>

                            <h3>Discuss Your Needs</h3>

                            <p>
                                We will discuss your academic requirements
                                and the tutoring support you need.
                            </p>

                        </article>

                        <article className="tutoring-process-card">

                            <span className="process-step">03</span>

                            <div className="process-icon">
                                <i className="fas fa-user-check"></i>
                            </div>

                            <h3>Tutor Matching</h3>

                            <p>
                                We will discuss suitable tutor availability
                                and the next steps with you.
                            </p>

                        </article>

                        <article className="tutoring-process-card">

                            <span className="process-step">04</span>

                            <div className="process-icon">
                                <i className="fas fa-laptop-house"></i>
                            </div>

                            <h3>Begin Learning</h3>

                            <p>
                                Once arrangements are confirmed, you can
                                begin your tutoring sessions.
                            </p>

                        </article>

                    </div>

                </div>

            </section>

            {/* ENQUIRY FORM */}
            <section
                className="tutoring-enquiry section-padding"
                id="tutoring-enquiry"
            >

                <div className="tutoring-container tutoring-enquiry-layout">

                    <div className="tutoring-enquiry-info">

                        <span className="tutoring-eyebrow">
                            START YOUR LEARNING JOURNEY
                        </span>

                        <h2>
                            Request an <span>online tutor</span>
                        </h2>

                        <p>
                            Complete the form and send us your tutoring
                            enquiry through WhatsApp. Our team can then
                            discuss your requirements with you.
                        </p>

                        <div className="tutoring-contact-item">
                            <i className="fab fa-whatsapp"></i>
                            <div>
                                <strong>WhatsApp Enquiries</strong>
                                <span>+27 67 691 6912</span>
                            </div>
                        </div>

                        <div className="tutoring-contact-item">
                            <i className="fas fa-graduation-cap"></i>
                            <div>
                                <strong>Grades Supported</strong>
                                <span>Grade 9, 10, 11 and 12</span>
                            </div>
                        </div>

                    </div>

                    <form
                        className="tutoring-enquiry-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        <div className="form-heading">
                            <h3>Tutoring Enquiry Form</h3>
                            <p>Fields marked with * are required.</p>
                        </div>

                        <div className="tutoring-form-grid">

                            <div className="tutoring-form-group">
                                <label htmlFor="learnerName">
                                    Learner Full Name *
                                </label>

                                <input
                                    type="text"
                                    id="learnerName"
                                    name="learnerName"
                                    value={formData.learnerName}
                                    onChange={handleChange}
                                    placeholder="Enter learner's full name"
                                />

                                {errors.learnerName && (
                                    <small className="tutoring-error">
                                        {errors.learnerName}
                                    </small>
                                )}
                            </div>

                            <div className="tutoring-form-group">
                                <label htmlFor="parentName">
                                    Parent / Guardian Name
                                </label>

                                <input
                                    type="text"
                                    id="parentName"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleChange}
                                    placeholder="Parent or guardian name"
                                />
                            </div>

                            <div className="tutoring-form-group">
                                <label htmlFor="grade">
                                    Select Grade *
                                </label>

                                <select
                                    id="grade"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                >
                                    <option value="">Choose grade</option>

                                    {Object.keys(gradeSubjects).map(grade => (
                                        <option key={grade} value={grade}>
                                            {grade}
                                        </option>
                                    ))}

                                </select>

                                {errors.grade && (
                                    <small className="tutoring-error">
                                        {errors.grade}
                                    </small>
                                )}
                            </div>

                            <div className="tutoring-form-group">
                                <label htmlFor="subject">
                                    Select Subject *
                                </label>

                                <select
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    disabled={!formData.grade}
                                >
                                    <option value="">
                                        {formData.grade
                                            ? 'Choose subject'
                                            : 'Select grade first'}
                                    </option>

                                    {formData.grade &&
                                        gradeSubjects[formData.grade].map(subject => (
                                            <option
                                                key={subject}
                                                value={subject}
                                            >
                                                {subject}
                                            </option>
                                        ))
                                    }

                                </select>

                                {errors.subject && (
                                    <small className="tutoring-error">
                                        {errors.subject}
                                    </small>
                                )}
                            </div>

                            <div className="tutoring-form-group">
                                <label htmlFor="email">
                                    Email Address *
                                </label>

                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                />

                                {errors.email && (
                                    <small className="tutoring-error">
                                        {errors.email}
                                    </small>
                                )}
                            </div>

                            <div className="tutoring-form-group">
                                <label htmlFor="phone">
                                    Contact Number *
                                </label>

                                <input
                                    type="tel"
                                    id="phone"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter contact number"
                                />

                                {errors.phone && (
                                    <small className="tutoring-error">
                                        {errors.phone}
                                    </small>
                                )}
                            </div>

                            <div className="tutoring-form-group full-width">
                                <label htmlFor="message">
                                    Additional Information
                                </label>

                                <textarea
                                    id="message"
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us about the subjects or topics where you need assistance..."
                                ></textarea>
                            </div>

                        </div>

                        <button
                            type="submit"
                            className="tutoring-submit-btn"
                        >
                            Send Enquiry via WhatsApp
                            <i className="fab fa-whatsapp"></i>
                        </button>

                        <p className="tutoring-form-disclaimer">
                            Your enquiry will open WhatsApp so you can
                            review and send your information.
                        </p>

                    </form>

                </div>

            </section>

            {/* FINAL CTA */}
            <section className="tutoring-final-cta">

                <div className="tutoring-container">

                    <h2>
                        Ready to take the next step?
                    </h2>

                    <p>
                        Tell us what you need help with and start your
                        online tutoring enquiry today.
                    </p>

                    <a
                        href="#tutoring-enquiry"
                        className="tutoring-btn tutoring-btn-white"
                    >
                        Get Started
                        <i className="fas fa-arrow-right"></i>
                    </a>

                </div>

            </section>

        </div>
    );
};

export default OnlineTutoring;
