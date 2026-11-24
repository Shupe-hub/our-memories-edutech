
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/education/GradeSubjects.css';

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
        'Computer Applications Technology (CAT)',
        'Information Technology (IT)'
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
        'Computer Applications Technology (CAT)',
        'Information Technology (IT)'
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
        'Computer Applications Technology (CAT)',
        'Information Technology (IT)'
    ]
};

const GradeSubjects = () => {
    const [selectedGrade, setSelectedGrade] = useState('Grade 9');

    const subjects = gradeSubjects[selectedGrade];

    const subjectCategories = [
        {
            title: 'Mathematics & Sciences',
            icon: 'fas fa-square-root-alt',
            subjects: [
                'Mathematics',
                'Mathematical Literacy',
                'Natural Sciences',
                'Physical Sciences',
                'Life Sciences'
            ]
        },
        {
            title: 'Languages',
            icon: 'fas fa-language',
            subjects: [
                'English'
            ]
        },
        {
            title: 'Commerce',
            icon: 'fas fa-chart-line',
            subjects: [
                'Accounting',
                'Business Studies',
                'Economic and Management Sciences'
            ]
        },
        {
            title: 'Humanities',
            icon: 'fas fa-globe-africa',
            subjects: [
                'Geography',
                'History'
            ]
        },
        {
            title: 'Technology',
            icon: 'fas fa-laptop-code',
            subjects: [
                'Technology',
                'Computer Applications Technology (CAT)',
                'Information Technology (IT)'
            ]
        }
    ];

    return (
        <div className="grade-subjects-page">

            {/* HERO */}
            <section className="grade-subjects-hero">

                <div className="grade-subjects-container grade-hero-layout">

                    <div className="grade-hero-content">

                        <span className="grade-eyebrow">
                            GRADE 9–12 ACADEMIC SUPPORT
                        </span>

                        <h1>
                            Explore Your
                            <span> School Subjects</span>
                        </h1>

                        <p>
                            Discover subject areas for Grades 9 to 12.
                            Choose your grade, explore the subjects and
                            identify where you need academic support.
                        </p>

                        <div className="grade-hero-actions">

                            <a
                                href="#explore-subjects"
                                className="grade-btn grade-btn-primary"
                            >
                                Explore Subjects
                                <i className="fas fa-arrow-down"></i>
                            </a>

                            <Link
                                to="/education/online-tutoring"
                                className="grade-btn grade-btn-outline"
                            >
                                Find Tutoring Support
                            </Link>

                        </div>

                        <div className="grade-hero-note">
                            <i className="fas fa-graduation-cap"></i>
                            Academic subject support for secondary school learners
                        </div>

                    </div>

                    <div className="grade-hero-visual">

                        <div className="grade-visual-card">

                            <div className="grade-visual-top">
                                <i className="fas fa-book-open"></i>
                                <span>YOUR ACADEMIC JOURNEY</span>
                            </div>

                            <h2>
                                Learn more.
                                <br />
                                Achieve more.
                            </h2>

                            <p>
                                Grade 9 • Grade 10 • Grade 11 • Grade 12
                            </p>

                            <div className="grade-visual-subjects">
                                <span><i className="fas fa-calculator"></i> Mathematics</span>
                                <span><i className="fas fa-flask"></i> Sciences</span>
                                <span><i className="fas fa-laptop"></i> Technology</span>
                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* GRADE SELECTOR */}
            <section
                className="grade-explorer section-padding"
                id="explore-subjects"
            >

                <div className="grade-subjects-container">

                    <div className="grade-section-heading">

                        <span className="grade-eyebrow">
                            EXPLORE BY GRADE
                        </span>

                        <h2>
                            Select Your <span>Grade</span>
                        </h2>

                        <p>
                            Choose your current school grade to view
                            the corresponding subject list.
                        </p>

                    </div>

                    <div
                        className="grade-selector"
                        role="group"
                        aria-label="Select school grade"
                    >

                        {Object.keys(gradeSubjects).map(grade => (

                            <button
                                type="button"
                                key={grade}
                                className={`grade-selector-btn ${
                                    selectedGrade === grade ? 'selected' : ''
                                }`}
                                onClick={() => setSelectedGrade(grade)}
                                aria-pressed={selectedGrade === grade}
                            >
                                <span className="grade-selector-icon">
                                    <i className="fas fa-graduation-cap"></i>
                                </span>

                                <span>{grade}</span>

                                {selectedGrade === grade && (
                                    <i className="fas fa-check grade-selected-check"></i>
                                )}
                            </button>

                        ))}

                    </div>

                    {/* SELECTED GRADE SUBJECTS */}
                    <div className="selected-grade-content">

                        <div className="selected-grade-heading">
                            <div>
                                <span className="grade-eyebrow">
                                    SUBJECT DIRECTORY
                                </span>

                                <h3>{selectedGrade} Subjects</h3>

                                <p>
                                    Explore the subjects listed for this grade.
                                </p>
                            </div>

                            <div className="subject-count">
                                <strong>{subjects.length}</strong>
                                <span>Listed subjects</span>
                            </div>
                        </div>

                        <div className="grade-subject-list">

                            {subjects.map((subject, index) => (

                                <article
                                    className="grade-subject-item"
                                    key={subject}
                                >

                                    <span className="subject-item-number">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>

                                    <div className="subject-item-icon">
                                        <i className="fas fa-book"></i>
                                    </div>

                                    <h4>{subject}</h4>

                                    <Link
                                        to={`/education/online-tutoring?grade=${encodeURIComponent(selectedGrade)}&subject=${encodeURIComponent(subject)}`}
                                        aria-label={`Request tutoring for ${subject} in ${selectedGrade}`}
                                    >
                                        <i className="fas fa-arrow-right"></i>
                                    </Link>

                                </article>

                            ))}

                        </div>

                    </div>

                    <div className="grade-availability-note">
                        <i className="fas fa-info-circle"></i>
                        <p>
                            This is a subject directory for enquiries.
                            Subject availability and tutoring arrangements
                            must be confirmed with Our Memories EduTech.
                        </p>
                    </div>

                </div>

            </section>

            {/* SUBJECT CATEGORIES */}
            <section className="grade-categories section-padding">

                <div className="grade-subjects-container">

                    <div className="grade-section-heading">

                        <span className="grade-eyebrow">
                            SUBJECT AREAS
                        </span>

                        <h2>
                            Explore Subject <span>Categories</span>
                        </h2>

                        <p>
                            Browse different areas of learning across
                            the secondary school curriculum.
                        </p>

                    </div>

                    <div className="grade-category-grid">

                        {subjectCategories.map(category => (

                            <article
                                className="grade-category-card"
                                key={category.title}
                            >

                                <div className="grade-category-icon">
                                    <i className={category.icon}></i>
                                </div>

                                <h3>{category.title}</h3>

                                <ul>
                                    {category.subjects.map(subject => (
                                        <li key={subject}>
                                            <i className="fas fa-check"></i>
                                            {subject}
                                        </li>
                                    ))}
                                </ul>

                            </article>

                        ))}

                    </div>

                </div>

            </section>

            {/* ACADEMIC SUPPORT */}
            <section className="grade-support-section section-padding">

                <div className="grade-subjects-container grade-support-layout">

                    <div className="grade-support-content">

                        <span className="grade-eyebrow">
                            NEED ACADEMIC ASSISTANCE?
                        </span>

                        <h2>
                            Get support in the subjects that
                            <span> matter to you.</span>
                        </h2>

                        <p>
                            Whether you need help understanding a topic,
                            preparing for an examination or improving
                            your subject knowledge, you can submit a
                            tutoring enquiry with your grade and subject.
                        </p>

                        <Link
                            to="/education/online-tutoring"
                            className="grade-btn grade-btn-primary"
                        >
                            Request Online Tutoring
                            <i className="fas fa-arrow-right"></i>
                        </Link>

                    </div>

                    <div className="grade-support-visual">
                        <div className="grade-support-icon">
                            <i className="fas fa-user-graduate"></i>
                        </div>

                        <h3>
                            Your education.
                            <span> Your future.</span>
                        </h3>

                        <p>
                            Learn. Apply. Grow.
                        </p>
                    </div>

                </div>

            </section>

            {/* FINAL CTA */}
            <section className="grade-final-cta">

                <div className="grade-subjects-container">

                    <h2>
                        Take the next step in your education.
                    </h2>

                    <p>
                        Explore our tutoring services and enquire
                        about academic support for your grade.
                    </p>

                    <Link
                        to="/education/online-tutoring"
                        className="grade-btn grade-btn-white"
                    >
                        Explore Online Tutoring
                        <i className="fas fa-arrow-right"></i>
                    </Link>

                </div>

            </section>

        </div>
    );
};

export default GradeSubjects;
