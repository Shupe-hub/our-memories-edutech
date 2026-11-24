import { Link } from 'react-router-dom';
import './Home.css';
import logo from '../assets/OM.png';

const services = [
  {
    icon: '🎓',
    title: 'Online Tutoring',
    description:
      'Academic support, subject revision and exam preparation for Grades 9–12.',
    link: '#education-details',
    label: 'Explore tutoring',
  },
  {
    icon: '📝',
    title: 'Education Applications',
    description:
      'Get assistance with university, TVET college and school applications.',
    link: '#applications',
    label: 'Apply with us',
  },
  {
    icon: '💰',
    title: 'Bursary Assistance',
    description:
      'Guidance with NSFAS, Funza Lushaka and other bursary applications.',
    link: '#applications',
    label: 'Explore assistance',
  },
  {
    icon: '💼',
    title: 'Career Services',
    description:
      'Professional CVs, cover letters, internships and job applications.',
    link: '#careers',
    label: 'Build your career',
  },
  {
    icon: '📋',
    title: 'General Application Assistance',
    description:
      'Get practical help with online forms and organising application documents.',
    link: '#applications',
    label: 'Get assistance',
  },
];

function Home() {
  return (
    <div className="home-page">
      {/* Navigation */}
      {/*
      <header className="home-navbar">
        <a
          href="#home"
          className="home-brand"
          aria-label="Our Memories EduTech home"
        >
          <img src={logo} alt="Our Memories EduTech logo" />
        </a>

        <nav className="home-nav-links" aria-label="Main navigation">
          <a href="#home" className="home-active">Home</a>
          <a href="#about">About Us</a>
          <a href="#education-details">Education</a>
          <a href="#applications">Applications</a>
          <a href="#careers">Career Services</a>
        </nav>

        <a href="#contact" className="home-contact-button">
          Contact Us <span>↗</span>
        </a>
      </header> */}

      <main>
        {/* Hero Section */}
        <section className="home-hero home-hero-refresh" id="home">
          <div className="home-hero-content">
            <div className="home-eyebrow home-hero-eyebrow">
              <span className="home-eyebrow-do"></span>
              EDUCATION | OPPORTUNITY | GROWTH
            </div>

            <h1>Make your next move <span>with confidence.</span></h1>

            <p className="home-hero-description">
              From learning support to university, college and bursary
              applications, we help you take each next step with clarity.
            </p>

            <div className="home-hero-buttons">
              <Link to="/applications/apply" className="home-button home-button-primary">
                Get Started <i className="fas fa-arrow-right" aria-hidden="true" />
              </Link>
              <a href="#services" className="home-button home-button-outline">
                Explore Our Services
              </a>
            </div>

            <div className="home-hero-note">
              <span className="home-check-icon"><i className="fas fa-check" aria-hidden="true" /></span>
              <span>Practical support for your education and career journey.</span>
            </div>
          </div>

          <div className="home-hero-visual home-hero-preview-wrap" aria-label="Our application support services">
            <div className="home-preview-orbit home-preview-orbit-one"></div>
            <div className="home-preview-orbit home-preview-orbit-two"></div>

            <div className="home-application-preview">
              <div className="home-preview-topbar">
                <div className="home-preview-brand">
                  <img src={logo} alt="" />
                  <span>YOUR NEXT STEP</span>
                </div>
                <span className="home-preview-status"><i></i> HERE TO HELP</span>
              </div>

              <div className="home-preview-intro">
                <span>LEARN | APPLY | GROW</span>
                <h2>Find your way forward.</h2>
                <p>Explore support for the path you want to take.</p>
              </div>

              <div className="home-preview-options">
                <div className="home-preview-option">
                  <span className="home-preview-option-icon"><i className="fas fa-university" aria-hidden="true" /></span>
                  <span><strong>University</strong><small>Applications &amp; guidance</small></span>
                  <i className="fas fa-arrow-right home-preview-arrow" aria-hidden="true" />
                </div>
                <div className="home-preview-option">
                  <span className="home-preview-option-icon home-preview-orange"><i className="fas fa-building" aria-hidden="true" /></span>
                  <span><strong>College &amp; TVET</strong><small>Plan your next move</small></span>
                  <i className="fas fa-arrow-right home-preview-arrow" aria-hidden="true" />
                </div>
                <div className="home-preview-option">
                  <span className="home-preview-option-icon home-preview-gold"><i className="fas fa-award" aria-hidden="true" /></span>
                  <span><strong>Bursary support</strong><small>Explore funding options</small></span>
                  <i className="fas fa-arrow-right home-preview-arrow" aria-hidden="true" />
                </div>
              </div>

              <div className="home-preview-footer">
                <span className="home-preview-footer-icon"><i className="fas fa-handshake" aria-hidden="true" /></span>
                <span><strong>Guidance at every step</strong><small>We are here to help you move forward.</small></span>
              </div>
            </div>

            <div className="home-preview-float home-preview-float-top">
              <span><i className="fas fa-graduation-cap" aria-hidden="true" /></span>
              <strong>Education, made clearer</strong>
            </div>
            <div className="home-preview-float home-preview-float-bottom">
              <span>4</span>
              <div><strong>Ways to grow</strong><small>Learning | Applications | Careers</small></div>
            </div>
          </div>
        </section>
        {/* About Us Brief */}
        <section className="home-about" id="about">
          <div className="home-about-visual">
            <div className="home-about-circle">
              <img src={logo} alt="Our Memories EduTech" />
            </div>
            <span className="home-about-decoration">LEARN · APPLY · GROW</span>
          </div>

          <div className="home-about-content">
            <span className="home-section-label">WELCOME TO OUR MEMORIES EDUTECH</span>
            <h2>Helping you turn opportunities into <span>progress.</span></h2>
            <p>
              Our Memories EduTech is committed to helping learners,
              students and job seekers access educational support,
              application assistance and career services.
            </p>
            <p>
              We aim to make important next steps clearer through
              practical guidance, learning opportunities and accessible services.
            </p>

            {/* UPDATED LINK HERE */}
            <Link to="/about" className="home-text-link">
              Read Our Full Story <span>→</span>
            </Link>
          </div>
        </section>

        {/* Information Bar */}
        <section className="home-trust-bar">
          <div className="home-trust-inner">
            <span>SUPPORTING YOUR JOURNEY IN</span>
            <div>
              <b>Education</b>
              <i></i>
              <b>Applications</b>
              <i></i>
              <b>Bursaries</b>
              <i></i>
              <b>Careers</b>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="home-services" id="services">
          <div className="home-section-heading">
            <span className="home-section-label">OUR SERVICES</span>

            <h2>
              What can we help <span>you with?</span>
            </h2>

            <p>
              Find the right support to help you learn, apply and
              build your future.
            </p>
          </div>

          <div className="home-services-grid">
            {services.map((service) => (
              <article
                className="home-service-card"
                key={service.title}
              >
                <div className="home-service-icon">
                  {service.icon}
                </div>

                <h3>{service.title}</h3>
                <p>{service.description}</p>

                <a
                  href={service.link}
                  className="home-service-link"
                >
                  {service.label} <span>→</span>
                </a>
              </article>
            ))}
          </div>
        </section>

        {/* About Us */}
        <section className="home-about" id="about">
          <div className="home-about-visual">
            <div className="home-about-circle">
              <img src={logo} alt="Our Memories EduTech" />
            </div>

            <span className="home-about-decoration">
              LEARN · APPLY · GROW
            </span>
          </div>

          <div className="home-about-content">
            <span className="home-section-label">
              WELCOME TO OUR MEMORIES EDUTECH
            </span>

            <h2>
              Helping you turn opportunities into{' '}
              <span>progress.</span>
            </h2>

            <p>
              Our Memories EduTech is committed to helping learners,
              students and job seekers access educational support,
              application assistance and career services.
            </p>

            <p>
              We aim to make important next steps clearer through
              practical guidance, learning opportunities and accessible
              services.
            </p>

            <a href="/contact" className="home-text-link">
              Get in touch with us <span>↗</span>
            </a>
          </div>
        </section>

        {/* Education */}
        <section className="home-education" id="education-details">
          <div className="home-education-content">
            <span className="home-section-label">
              INVEST IN YOUR FUTURE
            </span>

            <h2>
              Learn today. Achieve <span>tomorrow.</span>
            </h2>

            <p>
              Strengthen your knowledge with academic support,
              revision sessions and examination preparation
              for Grades 9–12.
            </p>

            <ul>
              <li>Academic support for Grades 9–12</li>
              <li>Subject revision and exam preparation</li>
              <li>Study guidance and learning resources</li>
              <li>Career and course selection guidance</li>
            </ul>

            <a
              href="/contact"
              className="home-button home-button-primary"
            >
              Enquire About Tutoring <span>→</span>
            </a>
          </div>

          <div className="home-education-card">
            <span className="home-education-icon">📚</span>

            <span className="home-section-label">
              YOUR LEARNING JOURNEY
            </span>

            <h3>Prepare. Practise. Progress.</h3>

            <p>
              Take the next step towards stronger academic performance
              with the right guidance and preparation.
            </p>

            <div className="home-grade-list">
              <span>Grade 9</span>
              <span>Grade 10</span>
              <span>Grade 11</span>
              <span>Grade 12</span>
            </div>
          </div>
        </section>

        {/* Applications and Bursaries */}
        <section className="home-applications" id="applications">
          <div>
            <span className="home-section-label">
              OUR APPLICATION OFFICE
            </span>

            <h2>
              Your next chapter starts <span>here.</span>
            </h2>

            <p>
              Get assistance with university, TVET college, school
              and bursary applications. We help you understand the
              process and prepare the required information.
            </p>

            <div className="home-application-tags">
              <span>Universities</span>
              <span>TVET Colleges</span>
              <span>Schools</span>
              <span>Bursaries</span>
              <span>NSFAS</span>
              <span>CAO</span>
            </div>
          </div>

          <a
            href="/contact"
            className="home-button home-button-primary"
          >
            Request Application Assistance <span>↗</span>
          </a>
        </section>

        {/* Career Services */}
        <section className="home-other-services">
          <article id="careers">
            <div className="home-service-icon">💼</div>

            <span className="home-section-label">
              CAREER SUPPORT
            </span>

            <h3>Prepare for your next opportunity.</h3>

            <p>
              Get assistance with CVs, cover letters, job applications,
              internships, learnerships and graduate programmes.
            </p>

            <a href="/contact" className="home-text-link">
              Enquire about career services <span>→</span>
            </a>
          </article>
        </section>

        {/* Call to Action */}
        <section className="home-cta">
          <span className="home-section-label">
            YOUR FUTURE. OUR PRIORITY.
          </span>

          <h2>Let's take your next step together.</h2>

          <p>
            Tell us what you need help with and let us guide you
            through the process.
          </p>

          <a
            href="/contact"
            className="home-button home-button-primary"
          >
            Contact Our Team <span>↗</span>
          </a>
        </section>
      </main>

      {/* Footer */}
      {/*}
      <footer className="home-footer" id="contact">
        <div className="home-footer-content">
          <div className="home-footer-brand">
            <img src={logo} alt="Our Memories EduTech logo" />

            <p>Learn. Apply. Grow.</p>

            <span>
              Supporting education, opportunities and career development.
            </span>
          </div>

          <div className="home-footer-links">
            <h3>Quick Links</h3>
            <a href="#home">Home</a>
            <a href="#about">About Us</a>
            <a href="#education-details">Education</a>
            <a href="#applications">Applications</a>
            <a href="#careers">Career Services</a>
          </div>

          <div className="home-footer-contact">
            <h3>Contact Us</h3>

            <a href="mailto:info@ourmemoriesedutech.co.za">
              info@ourmemoriesedutech.co.za
            </a>

            <p>We welcome your enquiries.</p>
          </div>
        </div>

        <div className="home-footer-bottom">
          <span>
            © {new Date().getFullYear()} Our Memories EduTech.
            All rights reserved.
          </span>

          <span>Learn. Apply. Grow.</span>
        </div>
      </footer>
      */}
    </div>
  );
}

export default Home;

