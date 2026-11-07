import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/education/Education.css';

const grades = [
  {
    grade: 'Grade 9',
    description: 'Build a strong foundation and prepare for the senior grades.',
    color: 'purple',
    subjects: ['Mathematics', 'English', 'Natural Sciences'],
  },
  {
    grade: 'Grade 10',
    description: 'Develop your subject knowledge and adapt to the FET phase.',
    color: 'teal',
    subjects: ['Mathematics', 'Physical Sciences', 'Accounting'],
  },
  {
    grade: 'Grade 11',
    description: 'Strengthen your understanding and prepare for Grade 12.',
    color: 'orange',
    subjects: ['Mathematics', 'Life Sciences', 'Business Studies'],
  },
  {
    grade: 'Grade 12',
    description: 'Get focused support for your final examinations and next steps.',
    color: 'blue',
    subjects: ['Mathematics', 'Physical Sciences', 'English'],
  },
];

const subjects = [
  { name: 'Mathematics', icon: '📐', color: 'purple' },
  { name: 'Physical Sciences', icon: '⚗️', color: 'teal' },
  { name: 'Life Sciences', icon: '🧬', color: 'green' },
  { name: 'Accounting', icon: '📊', color: 'orange' },
  { name: 'English', icon: '📚', color: 'blue' },
  { name: 'Mathematical Literacy', icon: '🔢', color: 'pink' },
  { name: 'Geography', icon: '🌍', color: 'green' },
  { name: 'Business Studies', icon: '💼', color: 'orange' },
  { name: 'History', icon: '🏛️', color: 'purple' },
  { name: 'Computer Applications Technology', icon: '💻', color: 'teal' },
  { name: 'Information Technology', icon: '🖥️', color: 'blue' },
];

const learningServices = [
  {
    icon: '👩‍🏫',
    title: 'Online Tutoring',
    description:
      'Get additional academic support from tutors through online learning sessions.',
    link: '/education/online-tutoring',
    color: 'purple',
  },
  {
    icon: '📝',
    title: 'Exam Preparation',
    description:
      'Prepare for tests and examinations with revision support, practice and study planning.',
    link: '/education/exam-preparation',
    color: 'orange',
  },
  {
    icon: '📖',
    title: 'Study Resources',
    description:
      'Access learning materials, study notes, revision guides and other educational resources.',
    link: '/education/study-resources',
    color: 'teal',
  },
  {
    icon: '🎯',
    title: 'Career Guidance',
    description:
      'Explore career options, recommended school subjects and possible study pathways.',
    link: '/education/career-guidance',
    color: 'blue',
  },
];

const Education = () => {
  return (
    <main className="education-page">

      {/* HERO SECTION */}
      <section className="education-hero">
        <div className="education-hero-content">
          <span className="education-eyebrow">
            <span className="education-eyebrow-dot"></span>
            OUR MEMORIES EDUTECH
          </span>

          <h1>
            Your Learning Journey
            <span> Starts Here.</span>
          </h1>

          <p className="education-hero-description">
            Every learner has the potential to achieve great things.
            We provide educational support, learning resources and guidance
            to help learners grow with confidence.
          </p>

          <div className="education-hero-actions">
            <Link
              to="/education/online-tutoring"
              className="education-btn education-btn-primary"
            >
              Explore Tutoring <span>→</span>
            </Link>

            <Link
              to="/education/study-resources"
              className="education-btn education-btn-secondary"
            >
              Explore Resources
            </Link>
          </div>

          <div className="education-hero-note">
            <span>✓</span>
            Supporting learners from Grade 9 to Grade 12
          </div>
        </div>

        <div className="education-hero-visual">
          <div className="education-hero-circle education-circle-one"></div>
          <div className="education-hero-circle education-circle-two"></div>

          <div className="education-learning-card">
            <div className="education-learning-top">
              <span className="education-learning-icon">🎓</span>
              <div>
                <strong>Learn. Apply. Grow.</strong>
                <small>Your future starts with learning.</small>
              </div>
            </div>

            <div className="education-learning-illustration">
              <div className="education-book book-one">📘</div>
              <div className="education-book book-two">📗</div>
              <div className="education-book book-three">📙</div>
              <span className="education-learning-star star-one">✦</span>
              <span className="education-learning-star star-two">✦</span>
              <span className="education-learning-star star-three">✦</span>
              <div className="education-learning-cap">🎓</div>
            </div>

            <div className="education-learning-bottom">
              <div>
                <strong>Keep learning</strong>
                <small>One step at a time.</small>
              </div>
              <span>✨</span>
            </div>
          </div>

          <div className="education-floating-card education-floating-top">
            <span>📚</span>
            <div>
              <strong>Study Smart</strong>
              <small>Build your knowledge</small>
            </div>
          </div>

          <div className="education-floating-card education-floating-bottom">
            <span>🌟</span>
            <div>
              <strong>Reach Your Goals</strong>
              <small>Believe in your potential</small>
            </div>
          </div>
        </div>
      </section>

      {/* GRADE LEVELS */}
      <section className="education-grades section-padding">
        <div className="education-section-heading">
          <span className="education-section-label">YOUR ACADEMIC JOURNEY</span>
          <h2>Learning Support for <span>Every Grade</span></h2>
          <p>
            Choose your grade and explore learning support designed around
            your academic journey.
          </p>
        </div>

        <div className="education-grade-grid">
          {grades.map((item) => (
            <article
              className={`education-grade-card grade-${item.color}`}
              key={item.grade}
            >
              <div className="education-grade-number">
                {item.grade.replace('Grade ', '')}
              </div>

              <span className="education-grade-tag">LEARNING SUPPORT</span>

              <h3>{item.grade}</h3>
              <p>{item.description}</p>

              <div className="education-grade-subjects">
                {item.subjects.map((subject) => (
                  <span key={subject}>{subject}</span>
                ))}
              </div>

              <Link
                to={`/education/${item.grade.toLowerCase().replace(' ', '-')}`}
                className="education-card-link"
              >
                Explore {item.grade} <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* LEARNING SERVICES */}
      <section className="education-services section-padding">
        <div className="education-section-heading">
          <span className="education-section-label">WHAT WE OFFER</span>
          <h2>Everything You Need to <span>Learn Better</span></h2>
          <p>
            Explore our education services and find the support that works
            best for you.
          </p>
        </div>

        <div className="education-services-grid">
          {learningServices.map((service) => (
            <article className="education-service-card" key={service.title}>
              <div className={`education-service-icon icon-${service.color}`}>
                {service.icon}
              </div>

              <h3>{service.title}</h3>
              <p>{service.description}</p>

              <Link to={service.link} className="education-card-link">
                Learn More <span>→</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* SUBJECT DIRECTORY */}
      <section className="education-subjects section-padding">
        <div className="education-section-heading">
          <span className="education-section-label">SUBJECT DIRECTORY</span>
          <h2>Explore Our <span>Subjects</span></h2>
          <p>
            Discover subjects that form part of the Grade 9–12 learning
            journey. Subject support can be explored by grade.
          </p>
        </div>

        <div className="education-subject-grid">
          {subjects.map((subject) => (
            <Link
              to="/education/subjects"
              className="education-subject-item"
              key={subject.name}
            >
              <span className={`education-subject-icon subject-${subject.color}`}>
                {subject.icon}
              </span>
              <span>{subject.name}</span>
              <span className="education-subject-arrow">→</span>
            </Link>
          ))}
        </div>

        <div className="education-subject-action">
          <Link to="/education/subjects" className="education-btn education-btn-secondary">
            View Subject Directory <span>→</span>
          </Link>
        </div>
      </section>

      {/* EXAM PREPARATION */}
      <section className="education-exam">
        <div className="education-exam-content">
          <span className="education-section-label">PREPARE WITH CONFIDENCE</span>

          <h2>
            Make Your Next
            <span> Exam Your Best.</span>
          </h2>

          <p>
            Preparation makes a difference. Strengthen your understanding,
            practise what you have learned and build a study routine that
            works for you.
          </p>

          <ul>
            <li>Test and examination preparation</li>
            <li>Subject revision support</li>
            <li>Past-paper assistance</li>
            <li>Mock examination practice</li>
            <li>Personal study planning</li>
          </ul>

          <Link
            to="/education/exam-preparation"
            className="education-btn education-btn-primary"
          >
            Explore Exam Preparation <span>→</span>
          </Link>
        </div>

        <div className="education-exam-visual">
          <div className="education-exam-paper">
            <div className="education-paper-header">
              <span>📄</span>
              <div>
                <strong>My Study Plan</strong>
                <small>Plan • Practise • Improve</small>
              </div>
            </div>

            <div className="education-paper-line long-line"></div>
            <div className="education-paper-line medium-line"></div>

            <div className="education-paper-task">
              <span>✓</span>
              <div>
                <strong>Review study notes</strong>
                <small>Revise key concepts</small>
              </div>
            </div>

            <div className="education-paper-task">
              <span>✓</span>
              <div>
                <strong>Practise questions</strong>
                <small>Test your understanding</small>
              </div>
            </div>

            <div className="education-paper-task">
              <span className="empty-check"></span>
              <div>
                <strong>Prepare for the exam</strong>
                <small>Stay focused on your goals</small>
              </div>
            </div>

            <div className="education-paper-stamp">YOU CAN DO IT!</div>
          </div>

          <span className="education-exam-decoration exam-decoration-one">✦</span>
          <span className="education-exam-decoration exam-decoration-two">✧</span>
        </div>
      </section>

      {/* STUDY RESOURCES */}
      <section className="education-resources section-padding">
        <div className="education-resource-intro">
          <div>
            <span className="education-section-label">LEARNING MATERIALS</span>
            <h2>Resources to Help You <span>Grow</span></h2>
            <p>
              Make learning easier with educational materials that support
              revision, understanding and independent study.
            </p>
          </div>

          <Link
            to="/education/study-resources"
            className="education-btn education-btn-secondary"
          >
            Browse Resources <span>→</span>
          </Link>
        </div>

        <div className="education-resource-grid">
          <div className="education-resource-card resource-notes">
            <span>📝</span>
            <h3>Study Notes</h3>
            <p>Helpful notes to support your understanding of key topics.</p>
          </div>

          <div className="education-resource-card resource-papers">
            <span>📑</span>
            <h3>Past Papers</h3>
            <p>Practise with examination-style questions and papers.</p>
          </div>

          <div className="education-resource-card resource-guides">
            <span>📚</span>
            <h3>Study Guides</h3>
            <p>Organise your learning with useful study guides.</p>
          </div>

          <div className="education-resource-card resource-quizzes">
            <span>🧠</span>
            <h3>Quizzes</h3>
            <p>Test your knowledge and identify topics to improve.</p>
          </div>
        </div>
      </section>

      {/* CAREER GUIDANCE */}
      <section className="education-career">
        <div className="education-career-icon">🚀</div>

        <div className="education-career-content">
          <span className="education-section-label">THINK ABOUT YOUR FUTURE</span>
          <h2>Discover Where Your <span>Education Can Take You</span></h2>
          <p>
            Explore different career fields, understand subject requirements
            and learn about possible study pathways after school.
          </p>
        </div>

        <Link
          to="/education/career-guidance"
          className="education-btn education-btn-primary"
        >
          Explore Careers <span>→</span>
        </Link>
      </section>

      {/* FINAL CTA */}
      <section className="education-final-cta">
        <span className="education-cta-decoration">✦</span>

        <span className="education-section-label">YOUR FUTURE MATTERS</span>
        <h2>Ready to Take the <span>Next Step?</span></h2>
        <p>
          Whether you need tutoring, study resources or career guidance,
          start exploring the opportunities available to you.
        </p>

        <div className="education-cta-buttons">
          <Link
            to="/education/online-tutoring"
            className="education-btn education-btn-primary"
          >
            Find Learning Support <span>→</span>
          </Link>

          <Link
            to="/contact"
            className="education-btn education-btn-secondary"
          >
            Contact Us
          </Link>
        </div>

        <small>Our Memories EduTech — Learn. Apply. Grow.</small>
      </section>

    </main>
  );
};

export default Education;