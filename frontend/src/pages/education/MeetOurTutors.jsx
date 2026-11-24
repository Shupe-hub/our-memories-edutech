
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/education/MeetOurTutors.css';

/*
 * Add verified tutor profiles to this array when the information is available.
 *
 * Example structure:
 * {
 *   id: 1,
 *   name: 'Tutor Name',
 *   photo: '/images/tutors/tutor-name.jpg',
 *   qualification: 'Verified qualification',
 *   experience: 'Verified experience',
 *   grades: ['Grade 10', 'Grade 11'],
 *   subjects: ['Mathematics'],
 *   bio: 'A short tutor introduction.'
 * }
 *
 * Only publish information that has been confirmed with the tutor.
 */

const tutors = [];

const gradeOptions = [
    'All Grades',
    'Grade 9',
    'Grade 10',
    'Grade 11',
    'Grade 12'
];

function MeetOurTutors() {
    const [selectedGrade, setSelectedGrade] = useState('All Grades');
    const [selectedSubject, setSelectedSubject] = useState('All Subjects');
    const [searchTerm, setSearchTerm] = useState('');

    const availableSubjects = useMemo(() => {
        const subjects = tutors.flatMap((tutor) => tutor.subjects || []);
        return ['All Subjects', ...new Set(subjects)];
    }, []);

    const filteredTutors = useMemo(() => {
        return tutors.filter((tutor) => {
            const matchesGrade =
                selectedGrade === 'All Grades' ||
                (tutor.grades || []).includes(selectedGrade);

            const matchesSubject =
                selectedSubject === 'All Subjects' ||
                (tutor.subjects || []).includes(selectedSubject);

            const searchContent = [
                tutor.name,
                tutor.qualification,
                tutor.bio,
                ...(tutor.subjects || []),
                ...(tutor.grades || [])
            ].join(' ').toLowerCase();

            const matchesSearch = searchContent.includes(searchTerm.toLowerCase());

            return matchesGrade && matchesSubject && matchesSearch;
        });
    }, [selectedGrade, selectedSubject, searchTerm]);

    const sendTutorEnquiry = (tutor = null) => {
        const message = `
Hello Our Memories EduTech.

I would like to enquire about online tutoring.

Tutor: ${tutor ? tutor.name : 'I would like assistance finding a suitable tutor'}
Grade: ${selectedGrade}
Subject: ${selectedSubject}

Please provide information about tutor availability, subjects offered, and tutoring arrangements.
        `.trim();

        window.open(
            `https://wa.me/27680513619?text=${encodeURIComponent(message)}`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    return (
        <main className="meet-tutors-page">

            {/* HERO SECTION */}
            <section className="tutors-hero">
                <div className="tutors-container tutors-hero-content">
                    <div className="tutors-hero-text">
                        <span className="tutors-eyebrow">
                            OUR MEMORIES EDUTECH
                        </span>

                        <h1>
                            Meet Our Tutors.
                            <span> Support Your Success.</span>
                        </h1>

                        <p>
                            Find out about our tutoring support for Grade 9–12
                            learners. Explore subject and grade options, then
                            contact our team to enquire about tutor availability.
                        </p>

                        <div className="tutors-hero-actions">
                            <a href="#tutor-directory" className="tutors-primary-btn">
                                Explore Tutors
                            </a>

                            <Link
                                to="/education/online-tutoring"
                                className="tutors-outline-btn"
                            >
                                Online Tutoring
                            </Link>
                        </div>
                    </div>

                    <div className="tutors-hero-visual">
                        <div className="tutors-hero-circle">
                            <span className="tutors-main-emoji">👩‍🏫</span>
                            <span className="tutors-floating-icon tutor-icon-one">📚</span>
                            <span className="tutors-floating-icon tutor-icon-two">🎓</span>
                            <span className="tutors-floating-icon tutor-icon-three">💡</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTRODUCTION */}
            <section className="tutors-intro">
                <div className="tutors-container">
                    <div className="tutors-section-heading">
                        <span className="tutors-eyebrow">ACADEMIC SUPPORT</span>
                        <h2>Learning Support for Every Step</h2>
                        <p>
                            Our tutoring service is designed to support learners
                            with their school subjects, improve understanding and
                            build confidence in their studies.
                        </p>
                    </div>

                    <div className="tutors-benefits-grid">
                        <article className="tutors-benefit-card">
                            <span>📘</span>
                            <h3>Subject Support</h3>
                            <p>
                                Get assistance with subjects offered through
                                our tutoring service.
                            </p>
                        </article>

                        <article className="tutors-benefit-card">
                            <span>🎯</span>
                            <h3>Learning Goals</h3>
                            <p>
                                Work towards improving your understanding of
                                challenging topics.
                            </p>
                        </article>

                        <article className="tutors-benefit-card">
                            <span>💻</span>
                            <h3>Online Learning</h3>
                            <p>
                                Enquire about online tutoring arrangements
                                that suit your learning needs.
                            </p>
                        </article>
                    </div>
                </div>
            </section>

            {/* TUTOR DIRECTORY */}
            <section className="tutor-directory" id="tutor-directory">
                <div className="tutors-container">
                    <div className="tutors-section-heading">
                        <span className="tutors-eyebrow">TUTOR DIRECTORY</span>
                        <h2>Find a Tutor</h2>
                        <p>
                            Browse tutor profiles when available, or send us an
                            enquiry so we can help you check subject and tutor availability.
                        </p>
                    </div>

                    <div className="tutor-filter-panel">
                        <div className="tutor-filter-field">
                            <label htmlFor="tutor-grade">Select Grade</label>
                            <select
                                id="tutor-grade"
                                value={selectedGrade}
                                onChange={(event) => setSelectedGrade(event.target.value)}
                            >
                                {gradeOptions.map((grade) => (
                                    <option key={grade} value={grade}>
                                        {grade}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="tutor-filter-field">
                            <label htmlFor="tutor-subject">Select Subject</label>
                            <select
                                id="tutor-subject"
                                value={selectedSubject}
                                onChange={(event) => setSelectedSubject(event.target.value)}
                            >
                                {availableSubjects.map((subject) => (
                                    <option key={subject} value={subject}>
                                        {subject}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="tutor-filter-field tutor-search-field">
                            <label htmlFor="tutor-search">Search Tutors</label>
                            <input
                                id="tutor-search"
                                type="search"
                                placeholder="Search by tutor name or subject..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>
                    </div>

                    {filteredTutors.length > 0 ? (
                        <div className="tutors-grid">
                            {filteredTutors.map((tutor) => (
                                <article className="tutor-card" key={tutor.id}>
                                    <div className="tutor-photo-wrapper">
                                        {tutor.photo ? (
                                            <img
                                                src={tutor.photo}
                                                alt={`${tutor.name} profile`}
                                                className="tutor-photo"
                                            />
                                        ) : (
                                            <div className="tutor-photo-placeholder">
                                                👩‍🏫
                                            </div>
                                        )}
                                    </div>

                                    <div className="tutor-card-body">
                                        <h3>{tutor.name}</h3>

                                        <p className="tutor-qualification">
                                            {tutor.qualification}
                                        </p>

                                        {tutor.experience && (
                                            <p className="tutor-experience">
                                                {tutor.experience}
                                            </p>
                                        )}

                                        <p className="tutor-bio">{tutor.bio}</p>

                                        <div className="tutor-tags">
                                            {(tutor.grades || []).map((grade) => (
                                                <span key={grade}>{grade}</span>
                                            ))}
                                        </div>

                                        <div className="tutor-subject-list">
                                            <strong>Subjects:</strong>
                                            <p>{(tutor.subjects || []).join(', ')}</p>
                                        </div>

                                        <button
                                            type="button"
                                            className="tutor-enquire-btn"
                                            onClick={() => sendTutorEnquiry(tutor)}
                                        >
                                            Enquire About Tutor
                                            <span>→</span>
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="tutors-empty-state">
                            <div className="tutors-empty-icon">👩‍🏫</div>
                            <h3>
                                {tutors.length === 0
                                    ? 'Tutor Profiles Coming Soon'
                                    : 'No Tutors Found'}
                            </h3>

                            <p>
                                {tutors.length === 0
                                    ? 'Our tutor directory is being prepared. Contact our team to enquire about available tutors and subjects.'
                                    : 'Try changing your grade, subject or search term.'}
                            </p>

                            <button
                                type="button"
                                className="tutors-primary-btn"
                                onClick={() => sendTutorEnquiry()}
                            >
                                Enquire About a Tutor
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="tutors-process">
                <div className="tutors-container">
                    <div className="tutors-section-heading">
                        <span className="tutors-eyebrow">GETTING STARTED</span>
                        <h2>How to Get a Tutor</h2>
                        <p>
                            Follow these steps to enquire about tutoring support.
                        </p>
                    </div>

                    <div className="tutors-process-grid">
                        <article className="tutors-process-card">
                            <span className="tutors-step-number">01</span>
                            <div>🎓</div>
                            <h3>Choose Your Grade</h3>
                            <p>Tell us whether you are in Grade 9, 10, 11 or 12.</p>
                        </article>

                        <article className="tutors-process-card">
                            <span className="tutors-step-number">02</span>
                            <div>📚</div>
                            <h3>Choose Your Subject</h3>
                            <p>Identify the subject or topics where you need support.</p>
                        </article>

                        <article className="tutors-process-card">
                            <span className="tutors-step-number">03</span>
                            <div>💬</div>
                            <h3>Contact Our Team</h3>
                            <p>Send an enquiry about tutoring and tutor availability.</p>
                        </article>

                        <article className="tutors-process-card">
                            <span className="tutors-step-number">04</span>
                            <div>✅</div>
                            <h3>Confirm Arrangements</h3>
                            <p>Discuss the available tutor, schedule and next steps.</p>
                        </article>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="tutors-cta">
                <div className="tutors-container tutors-cta-content">
                    <div>
                        <span className="tutors-eyebrow">READY TO GET STARTED?</span>
                        <h2>Give Your Learning Journey the Support It Deserves.</h2>
                        <p>
                            Contact Our Memories EduTech to enquire about tutoring
                            for your grade and subject.
                        </p>
                    </div>

                    <div className="tutors-cta-actions">
                        <button type="button" onClick={() => sendTutorEnquiry()}>
                            Enquire via WhatsApp
                        </button>

                        <Link to="/education/exam-preparation">
                            Exam Preparation
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}

export default MeetOurTutors;
