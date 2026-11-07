
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/education/StudyResources.css';

const resourceTypes = [
    {
        title: 'Study Notes',
        description: 'Organised subject notes to help learners understand important topics.',
        icon: '📚',
        category: 'Notes'
    },
    {
        title: 'Past Exam Papers',
        description: 'Past-paper assistance to help learners practise exam-style questions.',
        icon: '📝',
        category: 'Past Papers'
    },
    {
        title: 'Revision Guides',
        description: 'Topic summaries and revision material to support exam preparation.',
        icon: '📖',
        category: 'Revision Guides'
    },
    {
        title: 'Formula Sheets',
        description: 'Useful formulas and key information for selected subjects.',
        icon: '📐',
        category: 'Formula Sheets'
    },
    {
        title: 'Educational Videos',
        description: 'Video-based learning support for selected subjects and topics.',
        icon: '🎥',
        category: 'Videos'
    },
    {
        title: 'Practice Quizzes',
        description: 'Practice questions to help learners test their understanding.',
        icon: '💡',
        category: 'Quizzes'
    },
    {
        title: 'Exam Preparation',
        description: 'Resources and guidance to help learners prepare for assessments.',
        icon: '🎯',
        category: 'Exam Preparation'
    },
    {
        title: 'Career Resources',
        description: 'Learning and career information to help learners explore future opportunities.',
        icon: '🚀',
        category: 'Career Resources'
    }
];

const grades = ['All Grades', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'];

function StudyResources() {
    const [selectedGrade, setSelectedGrade] = useState('All Grades');
    const [selectedCategory, setSelectedCategory] = useState('All Resources');
    const [searchTerm, setSearchTerm] = useState('');

    const categories = [
        'All Resources',
        ...resourceTypes.map((resource) => resource.category)
    ];

    const filteredResources = useMemo(() => {
        return resourceTypes.filter((resource) => {
            const matchesCategory =
                selectedCategory === 'All Resources' ||
                resource.category === selectedCategory;

            const matchesSearch =
                resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                resource.description.toLowerCase().includes(searchTerm.toLowerCase());

            return matchesCategory && matchesSearch;
        });
    }, [selectedCategory, searchTerm]);

    const enquireAboutResource = (resource) => {
        const message = `
Hello Our Memories EduTech.

I would like to enquire about study resources.

Grade: ${selectedGrade}
Resource: ${resource.title}

Please let me know about availability and how I can access these resources.
        `.trim();

        window.open(
            `https://wa.me/27676916912?text=${encodeURIComponent(message)}`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    return (
        <main className="study-resources-page">

            {/* HERO SECTION */}
            <section className="resources-hero">
                <div className="resources-container resources-hero-content">
                    <div className="resources-hero-text">
                        <span className="resources-eyebrow">
                            OUR MEMORIES EDUTECH
                        </span>

                        <h1>
                            Study Resources That Help You
                            <span> Learn Better.</span>
                        </h1>

                        <p>
                            Explore study notes, revision guides, past-paper
                            assistance, quizzes and other learning resources
                            designed to support Grade 9–12 learners.
                        </p>

                        <div className="resources-hero-actions">
                            <a href="#available-resources" className="resources-primary-btn">
                                Explore Resources
                            </a>

                            <Link
                                to="/education/online-tutoring"
                                className="resources-outline-btn"
                            >
                                Explore Tutoring
                            </Link>
                        </div>
                    </div>

                    <div className="resources-hero-visual">
                        <div className="resources-illustration">
                            <div className="resources-book">📚</div>
                            <div className="resources-floating-card card-one">
                                <span>📝</span>
                                <div>
                                    <strong>Practice</strong>
                                    <small>Build confidence</small>
                                </div>
                            </div>
                            <div className="resources-floating-card card-two">
                                <span>🎯</span>
                                <div>
                                    <strong>Prepare</strong>
                                    <small>Study with purpose</small>
                                </div>
                            </div>
                            <div className="resources-floating-card card-three">
                                <span>💡</span>
                                <div>
                                    <strong>Understand</strong>
                                    <small>Keep learning</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTRODUCTION */}
            <section className="resources-intro">
                <div className="resources-container">
                    <div className="resources-section-heading">
                        <span className="resources-eyebrow">LEARNING SUPPORT</span>
                        <h2>Resources for Your Learning Journey</h2>
                        <p>
                            Find the type of learning support you need.
                            Select your grade and explore the available resource categories.
                        </p>
                    </div>
                </div>
            </section>

            {/* RESOURCE FILTERS AND CARDS */}
            <section className="resources-library" id="available-resources">
                <div className="resources-container">

                    <div className="resources-filter-panel">
                        <div className="resources-filter-heading">
                            <div>
                                <h3>Explore Study Resources</h3>
                                <p>Choose a grade or search for a resource category.</p>
                            </div>
                        </div>

                        <div className="resources-filter-controls">
                            <div className="resources-filter-field">
                                <label htmlFor="resource-grade">Select Grade</label>
                                <select
                                    id="resource-grade"
                                    value={selectedGrade}
                                    onChange={(event) => setSelectedGrade(event.target.value)}
                                >
                                    {grades.map((grade) => (
                                        <option key={grade} value={grade}>
                                            {grade}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="resources-filter-field resources-search-field">
                                <label htmlFor="resource-search">Search Resources</label>
                                <input
                                    id="resource-search"
                                    type="search"
                                    placeholder="Search notes, past papers, videos..."
                                    value={searchTerm}
                                    onChange={(event) => setSearchTerm(event.target.value)}
                                />
                            </div>
                        </div>

                        <div className="resources-category-filters">
                            {categories.map((category) => (
                                <button
                                    type="button"
                                    key={category}
                                    className={
                                        selectedCategory === category ? 'active' : ''
                                    }
                                    onClick={() => setSelectedCategory(category)}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="resources-results-heading">
                        <h3>Resource Categories</h3>
                        <span>{filteredResources.length} categories</span>
                    </div>

                    {filteredResources.length > 0 ? (
                        <div className="resources-grid">
                            {filteredResources.map((resource) => (
                                <article className="resource-card" key={resource.category}>
                                    <div className="resource-card-icon">
                                        {resource.icon}
                                    </div>

                                    <div className="resource-card-content">
                                        <span className="resource-card-category">
                                            {resource.category}
                                        </span>

                                        <h3>{resource.title}</h3>

                                        <p>{resource.description}</p>

                                        <button
                                            type="button"
                                            className="resource-enquire-btn"
                                            onClick={() => enquireAboutResource(resource)}
                                        >
                                            Enquire About Resource
                                            <span>→</span>
                                        </button>
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="resources-empty-state">
                            <span>🔎</span>
                            <h3>No matching resource categories</h3>
                            <p>Try another search term or select a different category.</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('All Resources');
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}

                    <p className="resources-availability-note">
                        <strong>Please note:</strong> These are resource categories.
                        Specific materials, subjects and grade availability must be
                        confirmed with Our Memories EduTech.
                    </p>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section className="resources-process">
                <div className="resources-container">
                    <div className="resources-section-heading">
                        <span className="resources-eyebrow">GETTING STARTED</span>
                        <h2>How to Access Study Resources</h2>
                        <p>Follow these simple steps to enquire about learning materials.</p>
                    </div>

                    <div className="resources-process-grid">
                        <div className="resources-process-card">
                            <span className="process-number">01</span>
                            <div className="process-icon">🎓</div>
                            <h3>Select Your Grade</h3>
                            <p>Choose your current grade from Grade 9 to Grade 12.</p>
                        </div>

                        <div className="resources-process-card">
                            <span className="process-number">02</span>
                            <div className="process-icon">📚</div>
                            <h3>Explore Categories</h3>
                            <p>Browse the resource categories and identify what you need.</p>
                        </div>

                        <div className="resources-process-card">
                            <span className="process-number">03</span>
                            <div className="process-icon">💬</div>
                            <h3>Send an Enquiry</h3>
                            <p>Contact our team to ask about specific materials.</p>
                        </div>

                        <div className="resources-process-card">
                            <span className="process-number">04</span>
                            <div className="process-icon">✅</div>
                            <h3>Confirm Availability</h3>
                            <p>Our team will guide you on available resources and next steps.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* TUTORING CTA */}
            <section className="resources-cta">
                <div className="resources-container resources-cta-content">
                    <div>
                        <span className="resources-eyebrow">NEED MORE SUPPORT?</span>
                        <h2>Combine Study Resources with Expert Learning Support.</h2>
                        <p>
                            Get additional academic support through our online tutoring
                            and exam preparation services.
                        </p>
                    </div>

                    <div className="resources-cta-actions">
                        <Link to="/education/online-tutoring">
                            Online Tutoring
                        </Link>
                        <Link to="/education/exam-preparation">
                            Exam Preparation
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}

export default StudyResources;
