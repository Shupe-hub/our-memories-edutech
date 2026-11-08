
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/education/CareerGuidance.css';

const careerFields = [
    {
        id: 1,
        title: 'Information Technology',
        category: 'Technology',
        icon: '💻',
        description: 'Explore careers involving computers, software, digital systems and technology.',
        careers: ['Software Developer', 'Web Developer', 'Data Analyst', 'Cybersecurity Analyst', 'IT Support Technician'],
        subjects: 'Mathematics, Physical Sciences and Information Technology (where offered).',
        pathway: 'Explore certificates, diplomas and degrees in Information Technology, Computer Science and related fields.'
    },
    {
        id: 2,
        title: 'Health Sciences',
        category: 'Health',
        icon: '🩺',
        description: 'Discover careers focused on healthcare, patient support and improving community wellbeing.',
        careers: ['Doctor', 'Nurse', 'Pharmacist', 'Physiotherapist', 'Medical Laboratory Scientist'],
        subjects: 'Life Sciences, Mathematics and Physical Sciences may be relevant, depending on the qualification.',
        pathway: 'Explore recognised health science qualifications and check each institution’s admission requirements.'
    },
    {
        id: 3,
        title: 'Engineering',
        category: 'Engineering',
        icon: '⚙️',
        description: 'Explore careers involving the design, development and maintenance of systems and infrastructure.',
        careers: ['Civil Engineer', 'Electrical Engineer', 'Mechanical Engineer', 'Chemical Engineer', 'Engineering Technician'],
        subjects: 'Mathematics and Physical Sciences are commonly important for engineering pathways.',
        pathway: 'Explore engineering diplomas, degrees and related technical qualifications.'
    },
    {
        id: 4,
        title: 'Business and Finance',
        category: 'Business',
        icon: '📊',
        description: 'Learn about careers in business operations, finance, management and entrepreneurship.',
        careers: ['Accountant', 'Financial Analyst', 'Business Manager', 'Auditor', 'Entrepreneur'],
        subjects: 'Mathematics, Accounting, Business Studies and Economics may support these pathways.',
        pathway: 'Explore qualifications in Accounting, Finance, Economics, Business Management and related fields.'
    },
    {
        id: 5,
        title: 'Law and Public Safety',
        category: 'Law and Public Safety',
        icon: '⚖️',
        description: 'Discover careers involving legal services, justice, public administration and community safety.',
        careers: ['Attorney', 'Advocate', 'Legal Adviser', 'Forensic Investigator', 'Law Enforcement Officer'],
        subjects: 'Languages, History and other relevant subjects can help develop useful communication and analytical skills.',
        pathway: 'Explore law, criminal justice, policing and public safety qualifications. Entry requirements differ by programme.'
    },
    {
        id: 6,
        title: 'Education',
        category: 'Education',
        icon: '🎓',
        description: 'Explore careers focused on teaching, learning, training and educational development.',
        careers: ['School Teacher', 'Lecturer', 'Education Specialist', 'Learning Support Practitioner', 'Training Facilitator'],
        subjects: 'Relevant subjects depend on the teaching specialisation you want to pursue.',
        pathway: 'Explore teaching degrees, education diplomas and other recognised education qualifications.'
    },
    {
        id: 7,
        title: 'Agriculture and Environment',
        category: 'Agriculture and Environment',
        icon: '🌱',
        description: 'Learn about careers in farming, food production, environmental management and conservation.',
        careers: ['Agricultural Scientist', 'Agricultural Advisor', 'Environmental Officer', 'Agricultural Manager', 'Conservationist'],
        subjects: 'Life Sciences, Geography, Mathematics and Agricultural Sciences may be relevant.',
        pathway: 'Explore Agriculture, Environmental Science, Animal Science and related qualifications.'
    },
    {
        id: 8,
        title: 'Creative Arts and Media',
        category: 'Creative Arts',
        icon: '🎨',
        description: 'Discover opportunities in design, communication, media, entertainment and creative production.',
        careers: ['Graphic Designer', 'Journalist', 'Photographer', 'Content Creator', 'Multimedia Designer'],
        subjects: 'Creative Arts, Visual Arts, Design and Languages may support selected pathways.',
        pathway: 'Explore qualifications in Graphic Design, Media Studies, Journalism, Film and related creative fields.'
    },
    {
        id: 9,
        title: 'Science and Research',
        category: 'Science',
        icon: '🔬',
        description: 'Explore careers involving scientific investigation, research, experiments and discovery.',
        careers: ['Biologist', 'Chemist', 'Research Scientist', 'Geologist', 'Laboratory Technician'],
        subjects: 'Mathematics, Physical Sciences and Life Sciences are relevant to many science pathways.',
        pathway: 'Explore degrees, diplomas and certificates in scientific and research-related disciplines.'
    }
];

const categories = [
    'All Fields',
    ...new Set(careerFields.map((field) => field.category))
];

const grades = ['Grade 9', 'Grade 10', 'Grade 11', 'Grade 12', 'Completed Grade 12'];

function CareerGuidance() {
    const [selectedCategory, setSelectedCategory] = useState('All Fields');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGrade, setSelectedGrade] = useState('Grade 12');
    const [selectedField, setSelectedField] = useState(null);

    const filteredFields = useMemo(() => {
        return careerFields.filter((field) => {
            const matchesCategory =
                selectedCategory === 'All Fields' ||
                field.category === selectedCategory;

            const searchText = [
                field.title,
                field.description,
                field.category,
                ...field.careers
            ].join(' ').toLowerCase();

            return matchesCategory &&
                searchText.includes(searchTerm.toLowerCase());
        });
    }, [selectedCategory, searchTerm]);

    const sendEnquiry = (field = null) => {
        const message = `
Hello Our Memories EduTech.

I would like to enquire about career guidance.

Current Grade/Status: ${selectedGrade}
Career Field of Interest: ${field ? field.title : 'General career guidance'}

Please assist me with information about career options, suitable qualifications and possible study pathways.
        `.trim();

        window.open(
            `https://wa.me/27680513619?text=${encodeURIComponent(message)}`,
            '_blank',
            'noopener,noreferrer'
        );
    };

    return (
        <main className="career-guidance-page">

            {/* HERO */}
            <section className="career-hero">
                <div className="career-container career-hero-content">
                    <div className="career-hero-text">
                        <span className="career-eyebrow">OUR MEMORIES EDUTECH</span>

                        <h1>
                            Discover Your Future.
                            <span> Explore Your Career.</span>
                        </h1>

                        <p>
                            Explore different career fields, learn about possible
                            study pathways and start planning your next step after
                            school with Our Memories EduTech.
                        </p>

                        <div className="career-hero-actions">
                            <a href="#career-fields" className="career-primary-btn">
                                Explore Career Fields
                            </a>

                            <a href="#career-enquiry" className="career-outline-btn">
                                Get Guidance
                            </a>
                        </div>
                    </div>

                    <div className="career-hero-visual">
                        <div className="career-visual-circle">
                            <span className="career-main-icon">🚀</span>
                            <div className="career-bubble bubble-one">🎓</div>
                            <div className="career-bubble bubble-two">💻</div>
                            <div className="career-bubble bubble-three">⚖️</div>
                            <div className="career-bubble bubble-four">🔬</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* INTRODUCTION */}
            <section className="career-intro">
                <div className="career-container">
                    <div className="career-section-heading">
                        <span className="career-eyebrow">PLAN YOUR FUTURE</span>
                        <h2>Your Future Starts with Exploring Your Options</h2>
                        <p>
                            Choosing a career is an important decision. Start by
                            discovering different industries, understanding what
                            professionals do and exploring qualifications that
                            could help you reach your goals.
                        </p>
                    </div>

                    <div className="career-benefits-grid">
                        <article className="career-benefit">
                            <span>🧭</span>
                            <h3>Explore Career Options</h3>
                            <p>Discover different industries and the careers within them.</p>
                        </article>

                        <article className="career-benefit">
                            <span>📘</span>
                            <h3>Understand Study Pathways</h3>
                            <p>Learn about qualifications related to your interests.</p>
                        </article>

                        <article className="career-benefit">
                            <span>🎯</span>
                            <h3>Plan Your Next Step</h3>
                            <p>Start preparing for university, TVET college or other opportunities.</p>
                        </article>
                    </div>
                </div>
            </section>

            {/* CAREER FIELDS */}
            <section className="career-fields-section" id="career-fields">
                <div className="career-container">
                    <div className="career-section-heading">
                        <span className="career-eyebrow">CAREER EXPLORER</span>
                        <h2>Explore Career Fields</h2>
                        <p>
                            Browse different fields and discover examples of careers,
                            relevant school subjects and possible study pathways.
                        </p>
                    </div>

                    <div className="career-filter-panel">
                        <div className="career-search-field">
                            <label htmlFor="career-search">Search career fields or careers</label>
                            <input
                                id="career-search"
                                type="search"
                                placeholder="e.g. Software Developer, Health, Engineering..."
                                value={searchTerm}
                                onChange={(event) => setSearchTerm(event.target.value)}
                            />
                        </div>

                        <div className="career-category-filters">
                            {categories.map((category) => (
                                <button
                                    type="button"
                                    key={category}
                                    className={selectedCategory === category ? 'active' : ''}
                                    onClick={() => {
                                        setSelectedCategory(category);
                                        setSelectedField(null);
                                    }}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="career-fields-grid">
                        {filteredFields.map((field) => (
                            <article className="career-field-card" key={field.id}>
                                <div className="career-field-icon">{field.icon}</div>

                                <span className="career-field-category">
                                    {field.category}
                                </span>

                                <h3>{field.title}</h3>
                                <p>{field.description}</p>

                                <button
                                    type="button"
                                    className="career-details-btn"
                                    onClick={() => setSelectedField(
                                        selectedField?.id === field.id ? null : field
                                    )}
                                    aria-expanded={selectedField?.id === field.id}
                                >
                                    {selectedField?.id === field.id
                                        ? 'Hide Details'
                                        : 'Explore This Field'}
                                    <span>→</span>
                                </button>

                                {selectedField?.id === field.id && (
                                    <div className="career-field-details">
                                        <h4>Example Careers</h4>
                                        <ul>
                                            {field.careers.map((career) => (
                                                <li key={career}>{career}</li>
                                            ))}
                                        </ul>

                                        <h4>Relevant School Subjects</h4>
                                        <p>{field.subjects}</p>

                                        <h4>Possible Study Pathway</h4>
                                        <p>{field.pathway}</p>

                                        <button
                                            type="button"
                                            className="career-enquire-link"
                                            onClick={() => sendEnquiry(field)}
                                        >
                                            Enquire About This Field
                                        </button>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>

                    {filteredFields.length === 0 && (
                        <div className="career-empty-state">
                            <span>🔎</span>
                            <h3>No matching career fields found</h3>
                            <p>Try another search term or select a different category.</p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedCategory('All Fields');
                                    setSelectedField(null);
                                }}
                            >
                                Clear Filters
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* STUDY PATHWAYS */}
            <section className="career-pathways">
                <div className="career-container">
                    <div className="career-section-heading">
                        <span className="career-eyebrow">AFTER GRADE 12</span>
                        <h2>Explore Your Study Pathways</h2>
                        <p>
                            There are different routes you can consider after school.
                            Explore the options and check the entry requirements for
                            each programme.
                        </p>
                    </div>

                    <div className="career-pathways-grid">
                        <article className="career-pathway-card">
                            <div className="pathway-icon">🏛️</div>
                            <h3>University</h3>
                            <p>
                                Explore higher education qualifications such as
                                bachelor's degrees and other university programmes.
                            </p>
                            <ul>
                                <li>Degree programmes</li>
                                <li>Diploma programmes</li>
                                <li>Higher certificates</li>
                            </ul>
                            <Link to="/education" className="pathway-link">
                                Explore Education Services →
                            </Link>
                        </article>

                        <article className="career-pathway-card">
                            <div className="pathway-icon">🛠️</div>
                            <h3>TVET College</h3>
                            <p>
                                Explore vocational and occupational learning
                                opportunities that develop practical and career-related skills.
                            </p>
                            <ul>
                                <li>National Certificate (Vocational)</li>
                                <li>Report 191 programmes</li>
                                <li>Occupational programmes</li>
                            </ul>
                            <Link to="/education" className="pathway-link">
                                Explore Education Services →
                            </Link>
                        </article>

                        <article className="career-pathway-card">
                            <div className="pathway-icon">📜</div>
                            <h3>Other Learning Opportunities</h3>
                            <p>
                                Consider additional learning and skills development
                                opportunities that match your interests and goals.
                            </p>
                            <ul>
                                <li>Skills programmes</li>
                                <li>Learnership opportunities</li>
                                <li>Accredited short courses</li>
                            </ul>
                            <Link to="/education" className="pathway-link">
                                Explore Education Services →
                            </Link>
                        </article>
                    </div>

                    <p className="career-pathway-note">
                        Qualification names, admission requirements and availability
                        vary by institution and programme. Always confirm the latest
                        requirements with the institution or relevant authority.
                    </p>
                </div>
            </section>

            {/* CAREER GUIDANCE PROCESS */}
            <section className="career-process">
                <div className="career-container">
                    <div className="career-section-heading">
                        <span className="career-eyebrow">OUR APPROACH</span>
                        <h2>How Career Guidance Works</h2>
                        <p>A simple starting point for exploring your future options.</p>
                    </div>

                    <div className="career-process-grid">
                        <article className="career-process-card">
                            <span className="career-process-number">01</span>
                            <div>💭</div>
                            <h3>Identify Your Interests</h3>
                            <p>Think about the subjects, activities and fields that interest you.</p>
                        </article>

                        <article className="career-process-card">
                            <span className="career-process-number">02</span>
                            <div>🔍</div>
                            <h3>Explore Career Fields</h3>
                            <p>Research different careers and understand what they involve.</p>
                        </article>

                        <article className="career-process-card">
                            <span className="career-process-number">03</span>
                            <div>🎓</div>
                            <h3>Explore Qualifications</h3>
                            <p>Identify possible programmes and their admission requirements.</p>
                        </article>

                        <article className="career-process-card">
                            <span className="career-process-number">04</span>
                            <div>🗺️</div>
                            <h3>Plan Your Next Step</h3>
                            <p>Prepare for applications and make informed study decisions.</p>
                        </article>
                    </div>
                </div>
            </section>

            {/* ENQUIRY */}
            <section className="career-enquiry-section" id="career-enquiry">
                <div className="career-container career-enquiry-content">
                    <div className="career-enquiry-text">
                        <span className="career-eyebrow">CAREER GUIDANCE ENQUIRY</span>
                        <h2>Not Sure Which Career to Choose?</h2>
                        <p>
                            Tell us your current grade or status and the career field
                            you are interested in. Our team can assist you with
                            information about possible study pathways.
                        </p>

                        <div className="career-enquiry-points">
                            <span>✓ Explore career options</span>
                            <span>✓ Understand qualification pathways</span>
                            <span>✓ Get information about study opportunities</span>
                        </div>
                    </div>

                    <div className="career-enquiry-form">
                        <h3>Start Your Enquiry</h3>
                        <p>Choose your current status and area of interest.</p>

                        <div className="career-form-group">
                            <label htmlFor="career-grade">Current Grade / Status</label>
                            <select
                                id="career-grade"
                                value={selectedGrade}
                                onChange={(event) => setSelectedGrade(event.target.value)}
                            >
                                {grades.map((grade) => (
                                    <option key={grade} value={grade}>{grade}</option>
                                ))}
                            </select>
                        </div>

                        <div className="career-form-group">
                            <label htmlFor="career-interest">Career Field of Interest</label>
                            <select
                                id="career-interest"
                                value={selectedCategory}
                                onChange={(event) => {
                                    setSelectedCategory(event.target.value);
                                    setSelectedField(null);
                                }}
                            >
                                <option value="All Fields">Not sure yet</option>
                                {categories.filter((category) => category !== 'All Fields').map((category) => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="button"
                            className="career-submit-btn"
                            onClick={() => sendEnquiry(
                                careerFields.find((field) => field.category === selectedCategory) || null
                            )}
                        >
                            Enquire via WhatsApp
                            <span>→</span>
                        </button>

                        <small>
                            This enquiry is for career information and guidance.
                            It is not a formal career assessment.
                        </small>
                    </div>
                </div>
            </section>

            {/* RELATED SERVICES */}
            <section className="career-related">
                <div className="career-container">
                    <div className="career-section-heading">
                        <span className="career-eyebrow">KEEP MOVING FORWARD</span>
                        <h2>Explore More Education Services</h2>
                    </div>

                    <div className="career-related-links">
                        <Link to="/education/grade-subjects">
                            <span>📘</span>
                            <div>
                                <strong>Grade 9–12 Subjects</strong>
                                <small>Explore school subjects</small>
                            </div>
                            <span className="related-arrow">→</span>
                        </Link>

                        <Link to="/education/online-tutoring">
                            <span>👩‍🏫</span>
                            <div>
                                <strong>Online Tutoring</strong>
                                <small>Get academic support</small>
                            </div>
                            <span className="related-arrow">→</span>
                        </Link>

                        <Link to="/education/study-resources">
                            <span>📚</span>
                            <div>
                                <strong>Study Resources</strong>
                                <small>Explore learning materials</small>
                            </div>
                            <span className="related-arrow">→</span>
                        </Link>
                    </div>
                </div>
            </section>

        </main>
    );
}

export default CareerGuidance;
