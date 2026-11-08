import { Link } from "react-router-dom";
import "../../styles/applications/Applications.css";

const services = [
  {
    title: "University applications",
    description:
      "Get guidance with course choices, university preferences and preparing an application.",
    path: "/applications/university",
    icon: "🎓",
  },
  {
    title: "TVET college applications",
    description:
      "Explore college and programme options and get help organising application information.",
    path: "/applications/tvet",
    icon: "🧰",
  },
  {
    title: "School applications",
    description:
      "Receive application assistance for school enquiries and the information families prepare.",
    path: "/applications/school",
    icon: "📚",
  },
  {
    title: "NSFAS applications",
    description:
      "Get assistance with new NSFAS applications and re-applications.",
    path: "/applications/nsfas",
    icon: "📄",
  },
  {
    title: "Bursary applications",
    description:
      "Get help preparing Funza Lushaka and other bursary applications.",
    path: "/applications/bursaries",
    icon: "🌱",
  },
  {
    title: "CAO applications",
    description:
      "Get guidance with CAO programme and institution choices and application information.",
    path: "/applications/cao",
    icon: "🗂️",
  },
];

const commonDocuments = [
  "Certified ID copy or birth certificate",
  "Latest academic results",
  "Certified parent or guardian ID copy, where required",
  "Proof of residence, where required",
  "Upgrading letter, if applicable",
];

const faqs = [
  {
    question: "Does application assistance guarantee admission or funding?",
    answer:
      "No. Institutions and funding organisations assess applications and make their own decisions. We do not guarantee admission, placement or bursary approval.",
  },
  {
    question: "Are institution application fees included?",
    answer:
      "No. Our service fee is separate from any application fee charged by an institution or funding organisation. Check the relevant organisation's requirements and fees.",
  },
  {
    question: "How long does feedback take?",
    answer:
      "Our stated feedback timeframe is 5–10 working days. Institution and funding organisation processing times are outside our control.",
  },
  {
    question: "What should I do before requesting assistance?",
    answer:
      "Choose the service you need, gather the information and documents listed on its page, and contact us if you are unsure what applies to you.",
  },
];

function Applications() {
  return (
    <main className="application-page applications-page">
      <section className="application-hero">
        <div className="application-hero-content">
          <span className="application-eyebrow">LEARN. APPLY. GROW.</span>
          <h1>
            Take your next step
            <span> with confidence.</span>
          </h1>
          <p>
            Our Memories EduTech offers application assistance for learners,
            students and families exploring education and funding opportunities.
            We help you prepare; the institution or funding organisation makes
            the final decision.
          </p>
          <div className="application-hero-actions">
            <Link className="application-btn application-btn-primary" to="/applications/apply">
              Apply now <span aria-hidden="true">→</span>
            </Link>
            <a className="application-btn application-btn-secondary" href="#application-services">
              Explore services
            </a>
          </div>
          <div className="application-hero-note">
            <span aria-hidden="true">✓</span> Clear guidance, one step at a time
          </div>
        </div>
        <div className="application-hero-visual" aria-hidden="true">
          <div className="application-hero-orbit application-hero-orbit-one" />
          <div className="application-hero-orbit application-hero-orbit-two" />
          <div className="application-hero-feature-card">
            <span className="application-hero-feature-icon">🎓</span>
            <span className="application-hero-feature-label">YOUR NEXT CHAPTER</span>
            <strong>Opportunity starts with a plan.</strong>
            <span className="application-hero-feature-footer">Learn. Apply. Grow.</span>
          </div>
          <span className="application-hero-badge application-hero-badge-top">Explore your options</span>
          <span className="application-hero-badge application-hero-badge-bottom">Guidance for your journey</span>
        </div>
      </section>

      <section className="application-section" id="application-services">
        <div className="application-section-inner">
          <div className="application-section-heading">
            <span className="application-section-label">APPLICATION SUPPORT</span>
            <h2>Find the service <span>you need</span></h2>
            <p>
              Explore the available services and visit the page for details,
              requirements and the next step.
            </p>
          </div>
          <div className="application-service-grid">
            {services.map((service) => (
              <article className="application-card application-service-card" key={service.path}>
                <span className="application-card-icon" aria-hidden="true">{service.icon}</span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link className="application-card-link" to={service.path}>
                  Explore service <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="application-section application-section-tint">
        <div className="application-section-inner">
          <div className="application-section-heading">
            <span className="application-section-label">SERVICE FEES</span>
            <h2>Know what to <span>expect</span></h2>
            <p>
              The prices below are Our Memories EduTech service fees. University
              and TVET service fees are confirmed before work begins. Institution
              and funding organisation fees, if any, are separate.
            </p>
          </div>
          <div className="application-pricing-table-wrap">
            <table className="application-pricing-table">
              <thead>
                <tr><th scope="col">Service</th><th scope="col">Our service fee</th><th scope="col">Details</th></tr>
              </thead>
              <tbody>
                <tr><th scope="row">University application assistance</th><td>Contact us for a quote</td><td>Institution fees may apply separately.</td></tr>
                <tr><th scope="row">TVET application assistance</th><td>Contact us for a quote</td><td>Placement test preparation is an extra-fee service.</td></tr>
                <tr><th scope="row">NSFAS application</th><td>R70</td><td>Our service fee; organisation fees, if any, are separate.</td></tr>
                <tr><th scope="row">NSFAS re-application</th><td>R40</td><td>Our service fee; organisation fees, if any, are separate.</td></tr>
                <tr><th scope="row">Funza Lushaka bursary assistance</th><td>R80</td><td>Our service fee; funding decisions are made by the organisation.</td></tr>
                <tr><th scope="row">Other bursary assistance</th><td>R180</td><td>Our service fee; check the bursary provider's requirements.</td></tr>
                <tr><th scope="row">School and CAO assistance</th><td>Contact us for a quote</td><td>No admission or placement is guaranteed.</td></tr>
              </tbody>
            </table>
          </div>
          <p className="application-footnote">
            Always confirm any institution or funding organisation fee directly
            with that organisation.
          </p>
        </div>
      </section>

      <section className="application-section">
        <div className="application-section-inner">
          <div className="application-section-heading">
            <span className="application-section-label">HOW IT WORKS</span>
            <h2>Simple steps, <span>thoughtful support</span></h2>
          </div>
          <ol className="application-steps">
            <li className="application-card application-step-card">
              <span className="application-step-number">01</span>
              <h3>Choose a service</h3>
              <p>Tell us which application or funding service you are interested in.</p>
            </li>
            <li className="application-card application-step-card">
              <span className="application-step-number">02</span>
              <h3>Prepare your details</h3>
              <p>Review the relevant checklist and gather your applicant information.</p>
            </li>
            <li className="application-card application-step-card">
              <span className="application-step-number">03</span>
              <h3>Confirm the service</h3>
              <p>We clarify the assistance, service fee and any separate organisation fees.</p>
            </li>
            <li className="application-card application-step-card">
              <span className="application-step-number">04</span>
              <h3>Get application guidance</h3>
              <p>Receive support with preparation. The organisation reviews and decides.</p>
            </li>
          </ol>
        </div>
      </section>

      <section className="application-section application-section-tint">
        <div className="application-section-inner application-documents-layout">
          <div>
            <span className="application-section-label">GETTING READY</span>
            <h2>Documents applicants <span>may need</span></h2>
            <p className="application-section-copy">
              Requirements differ by institution, funding programme and applicant.
              Check the official requirements for your application.
            </p>
          </div>
          <ul className="application-check-list">
            {commonDocuments.map((document) => (
              <li key={document}><span aria-hidden="true">✓</span>{document}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="application-section">
        <div className="application-section-inner">
          <div className="application-section-heading">
            <span className="application-section-label">YOUR QUESTIONS</span>
            <h2>Frequently asked <span>questions</span></h2>
          </div>
          <div className="application-faq-list">
            {faqs.map((faq) => (
              <details className="application-faq" key={faq.question}>
                <summary>{faq.question}<span aria-hidden="true">+</span></summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="application-cta-section">
        <div className="application-cta-inner">
          <div>
            <span className="application-section-label">READY WHEN YOU ARE</span>
            <h2>Let’s plan your next step.</h2>
            <p>Start an enquiry or contact us to discuss the assistance you need.</p>
          </div>
          <div className="application-cta-actions">
            <Link className="application-btn application-btn-primary" to="/applications/apply">Start an enquiry <span aria-hidden="true">→</span></Link>
            <a href="https://wa.me/27634328758" target="_blank" rel="noopener noreferrer">WhatsApp 063 432 8758</a>
            <a href="https://wa.me/27680513619" target="_blank" rel="noopener noreferrer">WhatsApp 068 051 3619</a>
            <a href="mailto:Ourmemoriesapplicationoffice@gmail.com">Ourmemoriesapplicationoffice@gmail.com</a>
            <a href="mailto:info@ourmemoriesedutech.co.za">info@ourmemoriesedutech.co.za</a>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Applications;
