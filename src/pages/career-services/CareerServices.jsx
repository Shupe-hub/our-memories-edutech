import { Link } from "react-router-dom";
import "../../styles/career-services/CareerServices.css";

const services = [
  {
    icon: "fa-file-lines",
    title: "CV Preparation",
    description:
      "Present your experience, skills and achievements in a polished, easy-to-read CV.",
    to: "/career-services/cv-preparation",
  },
  {
    icon: "fa-envelope-open-text",
    title: "Cover Letters",
    description:
      "Prepare a focused cover letter for a job, internship or graduate programme.",
    to: "/career-services/cover-letters",
  },
  {
    icon: "fa-briefcase",
    title: "Job Applications",
    description:
      "Get guidance organising information and documents for online job applications.",
    to: "/career-services/job-applications",
  },
  {
    icon: "fa-graduation-cap",
    title: "Internships & Learnerships",
    description:
      "Understand application requirements and prepare for internship and learnership opportunities.",
    to: "/career-services/internships-learnerships",
  },
  {
    icon: "fa-user-graduate",
    title: "Graduate Programmes",
    description:
      "Prepare your graduate CV, application information and supporting documents.",
    to: "/career-services/graduate-programmes",
  },
];

const steps = [
  ["01", "Choose the service you need", "Explore the services and decide what kind of career support would help you."],
  ["02", "Share relevant information", "Use the enquiry form to review what details are relevant to your request."],
  ["03", "Receive assistance", "Our Memories EduTech will discuss the requested support and next steps with you."],
  ["04", "Get your service or guidance", "Receive the agreed service or practical guidance for your application."],
];

const benefits = [
  ["fa-eye", "Professional presentation", "Present your skills, experience and application information clearly."],
  ["fa-sliders", "Personalised assistance", "Support is shaped around your experience and the service you choose."],
  ["fa-comments", "Convenient communication", "Contact us by email or WhatsApp to discuss your enquiry."],
  ["fa-people-group", "Support for your next step", "Career services for students, graduates and job seekers."],
];

const faqs = [
  ["Can you guarantee a job or placement?", "No. We provide preparation and application guidance. Employers and programme providers make their own selection and placement decisions."],
  ["Are service prices listed?", "The CV preparation page lists the supplied package prices. Contact us for pricing on other career services."],
  ["How do I enquire?", "Choose a service and use its enquiry form to review your requirements. The current forms are frontend previews and do not send or save information; contact us through the listed email or WhatsApp links."],
  ["Do you list vacancies or partner employers?", "We do not publish unverified vacancies or claim employer partnerships. Please confirm opportunities and requirements with the relevant organisation."],
];

function CareerServices() {
  return (
    <main className="career-page career-services-page">
      <section className="career-hero">
        <div className="career-hero-copy">
          <span className="career-eyebrow">CAREER SERVICES · LEARN. APPLY. GROW.</span>
          <h1>Build Your Career <span>With Confidence</span></h1>
          <p>
            Get professional support with your CV, job applications,
            internships, learnerships and graduate opportunities.
          </p>
          <div className="career-actions">
            <a className="career-button career-button-primary" href="#career-options">Explore services <i className="fas fa-arrow-right" aria-hidden="true" /></a>
            <Link className="career-button career-button-secondary" to="/contact">Request assistance</Link>
          </div>
          <div className="career-hero-note"><i className="fas fa-check" aria-hidden="true" /> Practical guidance for your next career step</div>
        </div>
        <div className="career-hero-art" aria-hidden="true">
          <div className="career-art-ring career-art-ring-one" />
          <div className="career-art-ring career-art-ring-two" />
          <div className="career-art-card">
            <span className="career-art-cap">🎓</span>
            <span className="career-art-label">YOUR CAREER JOURNEY</span>
            <strong>Make your next move count.</strong>
            <span className="career-art-rule" />
            <span className="career-art-tagline">Learn • Apply • Grow</span>
          </div>
          <span className="career-art-float career-art-float-top">✦ New possibilities</span>
          <span className="career-art-float career-art-float-bottom">✓ A plan for your goals</span>
        </div>
      </section>

      <section className="career-section" id="career-options">
        <div className="career-container">
          <header className="career-heading">
            <span className="career-section-label">CAREER SUPPORT</span>
            <h2>Explore our <span>services</span></h2>
            <p>Choose an area to learn more about the support available and how to enquire.</p>
          </header>
          <div className="career-service-grid">
            {services.map((service) => (
              <article className="career-card career-service-card" key={service.to}>
                <span className="career-icon"><i className={`fas ${service.icon}`} aria-hidden="true" /></span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link className="career-text-link" to={service.to}>Learn more <i className="fas fa-arrow-right" aria-hidden="true" /></Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="career-section career-section-tint">
        <div className="career-container">
          <header className="career-heading">
            <span className="career-section-label">A CLEAR PROCESS</span>
            <h2>How our career assistance <span>works</span></h2>
          </header>
          <ol className="career-steps">
            {steps.map(([number, title, description]) => (
              <li className="career-card career-step" key={number}>
                <span className="career-step-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="career-section">
        <div className="career-container">
          <header className="career-heading">
            <span className="career-section-label">WHY OUR MEMORIES EDUTECH</span>
            <h2>Support that helps you move <span>forward</span></h2>
          </header>
          <div className="career-benefits-grid">
            {benefits.map(([icon, title, description]) => (
              <article className="career-benefit" key={title}>
                <span className="career-icon"><i className={`fas ${icon}`} aria-hidden="true" /></span>
                <div><h3>{title}</h3><p>{description}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="career-section career-section-tint">
        <div className="career-container">
          <header className="career-heading">
            <span className="career-section-label">COMMON QUESTIONS</span>
            <h2>Frequently asked <span>questions</span></h2>
          </header>
          <div className="career-faq-list">
            {faqs.map(([question, answer]) => (
              <details className="career-faq" key={question}>
                <summary>{question}<i className="fas fa-plus" aria-hidden="true" /></summary>
                <p>{answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="career-cta">
        <div className="career-container career-cta-inner">
          <div>
            <span className="career-section-label">YOUR NEXT CHAPTER</span>
            <h2>Take the Next Step Towards Your Career</h2>
            <p>Explore a service or get in touch to discuss the assistance you need.</p>
          </div>
          <div className="career-actions">
            <Link className="career-button career-button-primary" to="/career-services/cv-preparation">Explore career services <i className="fas fa-arrow-right" aria-hidden="true" /></Link>
            <Link className="career-button career-button-light" to="/contact">Contact us</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default CareerServices;
