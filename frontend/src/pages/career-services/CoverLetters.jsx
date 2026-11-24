import CareerServiceForm from "./CareerServiceForm";
import "../../styles/career-services/CoverLetters.css";

function CoverLetters() {
  return (
    <main className="career-page cover-letters-page">
      <section className="career-hero career-hero-compact">
        <div className="career-hero-copy">
          <span className="career-eyebrow">COVER LETTER SUPPORT</span>
          <h1>Make a thoughtful first <span>impression.</span></h1>
          <p>Get help preparing a clear, professional cover letter tailored to the opportunity you are applying for.</p>
          <div className="career-actions">
            <a className="career-button career-button-primary" href="#cover-letter-support">Explore support <i className="fas fa-arrow-right" aria-hidden="true" /></a>
            <a className="career-button career-button-secondary" href="#career-enquiry">Enquire now</a>
          </div>
        </div>
        <div className="career-hero-art career-hero-art-simple" aria-hidden="true">
          <span className="career-hero-emoji">✉️</span>
          <strong>Clear words.<br />Confident applications.</strong>
          <span>Tell your story with purpose</span>
        </div>
      </section>

      <section className="career-section" id="cover-letter-support">
        <div className="career-container">
          <header className="career-heading"><span className="career-section-label">COVER LETTER SERVICES</span><h2>Writing support for <span>your next application</span></h2><p>We can help you shape a professional letter that connects your experience and interests to the opportunity.</p></header>
          <div className="career-service-grid career-service-grid-four">
            {[
              ["fa-briefcase", "Job-specific letters", "Present your fit for a particular role and organisation."],
              ["fa-building-columns", "Internship applications", "Explain your interests, learning goals and relevant strengths."],
              ["fa-user-graduate", "Graduate programmes", "Introduce your academic background and early-career goals."],
              ["fa-compass", "Career application support", "Organise the key details an effective letter should address."],
            ].map(([icon, title, description]) => <article className="career-card" key={title}><span className="career-icon"><i className={`fas ${icon}`} aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="career-section career-section-tint">
        <div className="career-container career-two-column">
          <div><span className="career-section-label">BEFORE WE BEGIN</span><h2>Information to <span>provide</span></h2><p>A useful starting point is the role or programme you are applying for, the organisation, the relevant job advertisement and a current CV or summary of your experience.</p></div>
          <ul className="career-check-list">
            <li><i className="fas fa-check" aria-hidden="true" />The role, internship or programme title</li>
            <li><i className="fas fa-check" aria-hidden="true" />Company or organisation name</li>
            <li><i className="fas fa-check" aria-hidden="true" />Job advertisement or application instructions</li>
            <li><i className="fas fa-check" aria-hidden="true" />Relevant experience, studies and strengths</li>
            <li><i className="fas fa-check" aria-hidden="true" />Any specific points you would like to include</li>
          </ul>
        </div>
      </section>

      <section className="career-cta">
        <div className="career-container career-cta-inner"><div><span className="career-section-label">PRICING</span><h2>Contact us for pricing</h2><p>We’ll confirm the available cover letter assistance and applicable price before starting.</p></div><a className="career-button career-button-primary" href="#career-enquiry">Ask about this service <i className="fas fa-arrow-right" aria-hidden="true" /></a></div>
      </section>

      <div className="career-container career-form-container">
        <CareerServiceForm
          initialService="Cover Letters"
          title="Enquire about a cover letter"
          serviceFields={[
            { name: "letterType", label: "Type of cover letter", type: "select", options: ["Job application", "Internship application", "Graduate programme", "Other"], required: true },
            { name: "jobTitle", label: "Job or programme title", required: true },
            { name: "organisation", label: "Company or organisation", required: true },
            { name: "instructions", label: "Additional instructions", type: "textarea", wide: true },
          ]}
        />
      </div>
    </main>
  );
}

export default CoverLetters;
