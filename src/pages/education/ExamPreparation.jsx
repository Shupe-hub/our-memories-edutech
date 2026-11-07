
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/education/ExamPreparation.css';

const subjectsByGrade = {
    'Grade 9': [
        'Mathematics',
        'Natural Sciences',
        'English',
        'Geography',
        'History',
        'Business Studies',
        'Economic and Management Sciences'
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

const preparationServices = [
    {
        icon: 'fas fa-book-open',
        title: 'Subject Revision',
        description: 'Revise important topics, concepts and subject content to strengthen your understanding.'
    },
    {
        icon: 'fas fa-file-alt',
        title: 'Past Paper Assistance',
        description: 'Get guidance on working through past examination papers and understanding question formats.'
    },
    {
        icon: 'fas fa-clipboard-check',
        title: 'Practice Tests',
        description: 'Use practice questions and mock assessments to identify areas that need more attention.'
    },
    {
        icon: 'fas fa-users',
        title: 'Revision Classes',
        description: 'Enquire about structured revision sessions for selected subjects and grades.'
    },
    {
        icon: 'fas fa-user-graduate',
        title: 'One-on-One Revision',
        description: 'Request individual academic assistance focused on your learning needs.'
    },
    {
        icon: 'fas fa-calendar-alt',
        title: 'Study Planning',
        description: 'Develop a study plan that helps you organise your revision time and priorities.'
    }
];

const ExamPreparation = () => {
    const [formData, setFormData] = useState({
        learnerName: '',
        parentName: '',
        grade: '',
        subject: '',
        preparationType: '',
        examDate: '',
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

        if (!formData.preparationType) {
            newErrors.preparationType = 'Please select a preparation service.';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Please enter an email address.';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Please enter a contact number.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        const message = `
EXAM PREPARATION ENQUIRY

Learner Name: ${formData.learnerName}
Parent/Guardian: ${formData.parentName || 'Not provided'}
Grade: ${formData.grade}
Subject: ${formData.subject}
Preparation Service: ${formData.preparationType}
Exam Date: ${formData.examDate || 'Not specified'}
Email: ${formData.email}
Contact Number: ${formData.phone}

Additional Information:
${formData.message || 'None provided'}
        `.trim();

        const whatsappLink =
            `https://wa.me/27676916912?text=${encodeURIComponent(message)}`;

        window.open(whatsappLink, '_blank', 'noopener,noreferrer');
    };

    return (
        <div className="exam-preparation-page">

            {/* HERO */}
            <section className="exam-hero">
                <div className="exam-container exam-hero-layout">

                    <div className="exam-hero-content">
                        <span className="exam-eyebrow">
                            PREPARE WITH CONFIDENCE
                        </span>

                        <h1>
                            Get Ready for Your
                            <span> Examinations</span>
                        </h1>

                        <p>
                            Build your understanding, practise important
                            questions and prepare for your examinations
                            with academic support for Grades 9–12.
                        </p>

                        <div className="exam-hero-actions">
                            <a href="#exam-enquiry" className="exam-btn exam-btn-primary">
                                Request Exam Support
                                <i className="fas fa-arrow-right"></i>
                            </a>

                            <Link
                                to="/education/grade-subjects"
                                className="exam-btn exam-btn-outline"
                            >
                                Explore Subjects
                            </Link>
                        </div>

                        <div className="exam-hero-note">
                            <i className="fas fa-graduation-cap"></i>
                            Revision and examination support for Grades 9–12
                        </div>
                    </div>

                    <div className="exam-hero-visual">
                        <div className="exam-visual-card">
                            <div className="exam-visual-icon">
                                <i className="fas fa-file-alt"></i>
                            </div>

                            <span>YOUR EXAM PREPARATION</span>
                            <h2>Prepare. Practise. Progress.</h2>
                            <p>
                                Make time for learning, revision and practice.
                            </p>

                            <div className="exam-visual-bottom">
                                <span><i className="fas fa-book"></i> Revise</span>
                                <span><i className="fas fa-pencil-alt"></i> Practise</span>
                                <span><i className="fas fa-check-circle"></i> Prepare</span>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* INTRODUCTION */}
            <section className="exam-intro exam-section-padding">
                <div className="exam-container">
                    <div className="exam-section-heading">
                        <span className="exam-eyebrow">ACADEMIC SUPPORT</span>
                        <h2>
                            Prepare for exams with
                            <span> the right support</span>
                        </h2>
                        <p>
                            Examination preparation involves understanding
                            your subjects, practising questions and planning
                            your revision. Explore the support options
                            available through Our Memories EduTech.
                        </p>
                    </div>

                    <div className="exam-services-grid">
                        {preparationServices.map((service) => (
                            <article className="exam-service-card" key={service.title}>
                                <div className="exam-service-icon">
                                    <i className={service.icon}></i>
                                </div>
                                <h3>{service.title}</h3>
                                <p>{service.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* PREPARATION APPROACH */}
            <section className="exam-approach exam-section-padding">
                <div className="exam-container exam-approach-layout">

                    <div className="exam-approach-content">
                        <span className="exam-eyebrow">A BETTER WAY TO PREPARE</span>
                        <h2>
                            Make your revision
                            <span> more organised</span>
                        </h2>
                        <p>
                            A good preparation routine helps learners
                            understand what they need to study and where
                            they should focus their attention.
                        </p>

                        <ul>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                Identify subjects and topics that need attention.
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                Organise revision time around your school schedule.
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                Practise questions and review your answers.
                            </li>
                            <li>
                                <i className="fas fa-check-circle"></i>
                                Track topics that need further revision.
                            </li>
                        </ul>

                        <Link
                            to="/education/online-tutoring"
                            className="exam-btn exam-btn-primary"
                        >
                            Explore Online Tutoring
                            <i className="fas fa-arrow-right"></i>
                        </Link>
                    </div>

                    <div className="exam-approach-visual">
                        <div className="exam-plan-card">
                            <div className="exam-plan-heading">
                                <i className="fas fa-calendar-check"></i>
                                <div>
                                    <strong>Study Preparation</strong>
                                    <span>Organise your revision</span>
                                </div>
                            </div>

                            <div className="exam-plan-row">
                                <span>01</span>
                                <div>
                                    <strong>Review your topics</strong>
                                    <small>Identify what to study</small>
                                </div>
                            </div>

                            <div className="exam-plan-row">
                                <span>02</span>
                                <div>
                                    <strong>Practise questions</strong>
                                    <small>Apply what you have learned</small>
                                </div>
                            </div>

                            <div className="exam-plan-row">
                                <span>03</span>
                                <div>
                                    <strong>Revise and improve</strong>
                                    <small>Review areas that need attention</small>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* GRADES */}
            <section className="exam-grades exam-section-padding">
                <div className="exam-container">
                    <div className="exam-section-heading">
                        <span className="exam-eyebrow">WHO WE SUPPORT</span>
                        <h2>
                            Examination support for
                            <span> Grades 9–12</span>
                        </h2>
                        <p>
                            Select your grade when submitting an enquiry
                            so we can understand your academic requirements.
                        </p>
                    </div>

                    <div className="exam-grade-grid">
                        {Object.keys(subjectsByGrade).map((grade, index) => (
                            <a
                                href="#exam-enquiry"
                                className="exam-grade-card"
                                key={grade}
                            >
                                <span className="exam-grade-number">
                                    0{index + 1}
                                </span>
                                <i className="fas fa-graduation-cap"></i>
                                <h3>{grade}</h3>
                                <span>Request exam support</span>
                                <i className="fas fa-arrow-right exam-grade-arrow"></i>
                            </a>
                        ))}
                    </div>
                </div>
            </section>

            {/* PROCESS */}
            <section className="exam-process exam-section-padding">
                <div className="exam-container">
                    <div className="exam-section-heading">
                        <span className="exam-eyebrow">HOW IT WORKS</span>
                        <h2>
                            Get started in
                            <span> four steps</span>
                        </h2>
                        <p>
                            Submit your requirements and discuss the
                            preparation support you need.
                        </p>
                    </div>

                    <div className="exam-process-grid">
                        {[
                            {
                                number: '01',
                                icon: 'fas fa-clipboard-list',
                                title: 'Submit an Enquiry',
                                description: 'Tell us your grade, subject and examination preparation needs.'
                            },
                            {
                                number: '02',
                                icon: 'fas fa-comments',
                                title: 'Discuss Your Needs',
                                description: 'We will discuss the areas where you need academic support.'
                            },
                            {
                                number: '03',
                                icon: 'fas fa-calendar-alt',
                                title: 'Confirm Arrangements',
                                description: 'Discuss suitable services, availability and scheduling.'
                            },
                            {
                                number: '04',
                                icon: 'fas fa-book-reader',
                                title: 'Start Preparing',
                                description: 'Begin your agreed revision and examination preparation activities.'
                            }
                        ].map((step) => (
                            <article className="exam-process-card" key={step.number}>
                                <span className="exam-process-number">{step.number}</span>
                                <div className="exam-process-icon">
                                    <i className={step.icon}></i>
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            {/* ENQUIRY FORM */}
            <section className="exam-enquiry exam-section-padding" id="exam-enquiry">
                <div className="exam-container exam-enquiry-layout">

                    <div className="exam-enquiry-info">
                        <span className="exam-eyebrow">START YOUR PREPARATION</span>
                        <h2>
                            Request <span>exam preparation</span> support
                        </h2>
                        <p>
                            Complete the form with your details and the
                            support you need. Your enquiry will open
                            WhatsApp for you to review and send.
                        </p>

                        <div className="exam-contact-item">
                            <i className="fab fa-whatsapp"></i>
                            <div>
                                <strong>WhatsApp Enquiries</strong>
                                <span>+27 67 691 6912</span>
                            </div>
                        </div>

                        <div className="exam-contact-item">
                            <i className="fas fa-book-open"></i>
                            <div>
                                <strong>Grades Supported</strong>
                                <span>Grade 9, 10, 11 and 12</span>
                            </div>
                        </div>
                    </div>

                    <form className="exam-enquiry-form" onSubmit={handleSubmit} noValidate>
                        <div className="exam-form-heading">
                            <h3>Exam Preparation Enquiry</h3>
                            <p>Fields marked with * are required.</p>
                        </div>

                        <div className="exam-form-grid">

                            <div className="exam-form-group">
                                <label htmlFor="examLearnerName">Learner Full Name *</label>
                                <input
                                    id="examLearnerName"
                                    name="learnerName"
                                    value={formData.learnerName}
                                    onChange={handleChange}
                                    placeholder="Enter learner's full name"
                                />
                                {errors.learnerName && <small>{errors.learnerName}</small>}
                            </div>

                            <div className="exam-form-group">
                                <label htmlFor="examParentName">Parent / Guardian Name</label>
                                <input
                                    id="examParentName"
                                    name="parentName"
                                    value={formData.parentName}
                                    onChange={handleChange}
                                    placeholder="Enter parent or guardian name"
                                />
                            </div>

                            <div className="exam-form-group">
                                <label htmlFor="examGrade">Select Grade *</label>
                                <select
                                    id="examGrade"
                                    name="grade"
                                    value={formData.grade}
                                    onChange={handleChange}
                                >
                                    <option value="">Choose grade</option>
                                    {Object.keys(subjectsByGrade).map(grade => (
                                        <option key={grade} value={grade}>{grade}</option>
                                    ))}
                                </select>
                                {errors.grade && <small>{errors.grade}</small>}
                            </div>

                            <div className="exam-form-group">
                                <label htmlFor="examSubject">Select Subject *</label>
                                <select
                                    id="examSubject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    disabled={!formData.grade}
                                >
                                    <option value="">Choose subject</option>
                                    {formData.grade && subjectsByGrade[formData.grade].map(subject => (
                                        <option key={subject} value={subject}>{subject}</option>
                                    ))}
                                </select>
                                {errors.subject && <small>{errors.subject}</small>}
                            </div>

                            <div className="exam-form-group">
                                <label htmlFor="preparationType">Preparation Service *</label>
                                <select
                                    id="preparationType"
                                    name="preparationType"
                                    value={formData.preparationType}
                                    onChange={handleChange}
                                >
                                    <option value="">Choose service</option>
                                    <option value="Subject Revision">Subject Revision</option>
                                    <option value="Past Paper Assistance">Past Paper Assistance</option>
                                    <option value="Practice Tests / Mock Exams">Practice Tests / Mock Exams</option>
                                    <option value="Revision Classes">Revision Classes</option>
                                    <option value="One-on-One Revision">One-on-One Revision</option>
                                    <option value="Study Planning">Study Planning</option>
                                </select>
                                {errors.preparationType && <small>{errors.preparationType}</small>}
                            </div>

                            <div className="exam-form-group">
                                <label htmlFor="examDate">Examination Date (if known)</label>
                                <input
                                    id="examDate"
                                    type="date"
                                    name="examDate"
                                    value={formData.examDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="exam-form-group">
                                <label htmlFor="examEmail">Email Address *</label>
                                <input
                                    id="examEmail"
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                />
                                {errors.email && <small>{errors.email}</small>}
                            </div>

                            <div className="exam-form-group">
                                <label htmlFor="examPhone">Contact Number *</label>
                                <input
                                    id="examPhone"
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Enter contact number"
                                />
                                {errors.phone && <small>{errors.phone}</small>}
                            </div>

                            <div className="exam-form-group exam-full-width">
                                <label htmlFor="examMessage">Additional Information</label>
                                <textarea
                                    id="examMessage"
                                    name="message"
                                    rows="4"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us which topics or areas you need help with..."
                                />
                            </div>

                        </div>

                        <button type="submit" className="exam-submit-btn">
                            Send Enquiry via WhatsApp
                            <i className="fab fa-whatsapp"></i>
                        </button>

                        <p className="exam-form-disclaimer">
                            Your enquiry is not a confirmed booking.
                            Services and availability will be discussed with you.
                        </p>
                    </form>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="exam-final-cta">
                <div className="exam-container">
                    <h2>Start preparing for your next examination.</h2>
                    <p>
                        Take the first step by telling us which subject
                        and preparation support you need.
                    </p>
                    <a href="#exam-enquiry" className="exam-btn exam-btn-white">
                        Make an Enquiry
                        <i className="fas fa-arrow-right"></i>
                    </a>
                </div>
            </section>

        </div>
    );
};

export default ExamPreparation;
