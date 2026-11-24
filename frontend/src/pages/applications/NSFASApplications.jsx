import { Link } from "react-router-dom";
import "../../styles/applications/NSFASApplications.css";

const documents = [
  "Certified applicant ID copy or birth certificate",
  "Parent or guardian ID copy, where required",
  "Proof of income or other financial information, if requested",
  "Academic results or proof of registration, as applicable",
  "Any additional documents requested by NSFAS",
];

function NSFASApplications() {
  return (
    <main className="application-page nsfas-applications-page">
      <section className="application-hero application-hero-compact">
        <div className="application-hero-content">
          <span className="application-eyebrow">NSFAS APPLICATION SUPPORT</span>
          <h1>Prepare your NSFAS application <span>with guidance.</span></h1>
          <p>Get assistance with a new NSFAS application or a re-application, and organise information about any previous application. NSFAS assesses applications and makes funding decisions.</p>
          <div className="application-hero-actions"><Link className="application-btn application-btn-primary" to="/applications/apply">Apply now <span aria-hidden="true">→</span></Link><a className="application-btn application-btn-secondary" href="#nsfas-fees">View service fees</a></div>
        </div>
        <div className="application-hero-visual application-hero-visual-simple" aria-hidden="true"><span className="application-hero-large-icon">📄</span><div className="application-hero-visual-caption"><strong>Prepare with clarity.</strong><span>Support for new and returning applicants</span></div></div>
      </section>

      <section className="application-section">
        <div className="application-section-inner">
          <div className="application-section-heading"><span className="application-section-label">NSFAS SUPPORT</span><h2>Assistance for new and <span>returning applicants</span></h2><p>We can help you prepare your application information and understand which details may be needed.</p></div>
          <div className="application-info-grid">
            <article className="application-card"><span className="application-card-icon">✨</span><h3>New NSFAS applications</h3><p>Get assistance organising the information and documents for a new application. Confirm current eligibility and requirements with NSFAS.</p></article>
            <article className="application-card"><span className="application-card-icon">↻</span><h3>NSFAS re-applications</h3><p>Get assistance with a re-application and prepare the updated information requested for your circumstances.</p></article>
            <article className="application-card"><span className="application-card-icon">🗃️</span><h3>Previous application information</h3><p>Be ready to share whether you applied previously, the relevant application year and any status or reference information available to you.</p></article>
          </div>
        </div>
      </section>

      <section className="application-section application-section-tint">
        <div className="application-section-inner application-documents-layout">
          <div><span className="application-section-label">BEFORE YOU BEGIN</span><h2>Information and <span>supporting documents</span></h2><p className="application-section-copy">Requirements may depend on your application and household circumstances. Confirm current requirements through official NSFAS channels.</p></div>
          <ul className="application-check-list">{documents.map((document) => <li key={document}><span aria-hidden="true">✓</span>{document}</li>)}</ul>
        </div>
      </section>

      <section className="application-section" id="nsfas-fees">
        <div className="application-section-inner">
          <div className="application-section-heading"><span className="application-section-label">OUR SERVICE FEES</span><h2>NSFAS assistance <span>pricing</span></h2><p>These are Our Memories EduTech service fees. They are not NSFAS charges or institution fees.</p></div>
          <div className="application-price-cards">
            <article className="application-card application-price-card"><span className="application-price-kicker">FIRST APPLICATION</span><h3>NSFAS application</h3><p>Assistance preparing a new NSFAS application.</p><strong className="application-price-value">R70</strong><span className="application-price-caption">Our service fee</span></article>
            <article className="application-card application-price-card application-price-card-featured"><span className="application-price-kicker">RETURNING APPLICANT</span><h3>NSFAS re-application</h3><p>Assistance preparing an NSFAS re-application.</p><strong className="application-price-value">R40</strong><span className="application-price-caption">Our service fee</span></article>
          </div>
          <p className="application-footnote">We do not guarantee funding approval. NSFAS makes all application and funding decisions.</p>
        </div>
      </section>
      <section className="application-cta-section"><div className="application-cta-inner"><div><span className="application-section-label">NEED NSFAS ASSISTANCE?</span><h2>Tell us about your application.</h2><p>Let us know whether you are applying for the first time or re-applying.</p></div><Link className="application-btn application-btn-primary" to="/applications/apply">Apply now <span aria-hidden="true">→</span></Link></div></section>
    </main>
  );
}

export default NSFASApplications;
