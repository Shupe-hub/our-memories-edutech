import { Link } from "react-router-dom";
import "../../styles/applications/UniversityApplications.css";

const documents = [
  "Certified ID copy or passport",
  "Latest academic results or final school-leaving results",
  "Parent or guardian details and certified ID copy, where required",
  "Proof of residence, where required",
  "Any additional documents requested by the university",
];

function UniversityApplications() {
  return (
    <main className="application-page university-applications-page">
      <section className="application-hero application-hero-compact">
        <div className="application-hero-content">
          <span className="application-eyebrow">UNIVERSITY APPLICATION SUPPORT</span>
          <h1>Make informed choices for <span>your future.</span></h1>
          <p>
            Our Memories EduTech can assist you with preparing a university
            application, organising your choices and checking the information
            you may need. Admission decisions remain with each university.
          </p>
          <div className="application-hero-actions">
            <Link className="application-btn application-btn-primary" to="/applications/apply">Apply now <span aria-hidden="true">→</span></Link>
            <a className="application-btn application-btn-secondary" href="#university-support">Explore the support</a>
          </div>
        </div>
        <div className="application-hero-visual application-hero-visual-simple" aria-hidden="true">
          <span className="application-hero-large-icon">🎓</span>
          <div className="application-hero-visual-caption"><strong>Explore. Choose. Prepare.</strong><span>Support for your application journey</span></div>
        </div>
      </section>

      <section className="application-section" id="university-support">
        <div className="application-section-inner">
          <div className="application-section-heading">
            <span className="application-section-label">MAKE YOUR CHOICES</span>
            <h2>Plan your university <span>preferences</span></h2>
            <p>We can help you think through your study interests and organise your choices before applying.</p>
          </div>
          <div className="application-info-grid">
            <article className="application-card"><span className="application-card-icon">🧭</span><h3>Course and programme selection</h3><p>Discuss subjects, interests and possible programmes to help you identify options to research further.</p></article>
            <article className="application-card"><span className="application-card-icon">1 · 2 · 3</span><h3>First, second and third choices</h3><p>Prepare up to three course choices and check each university’s entry criteria and application requirements.</p></article>
            <article className="application-card"><span className="application-card-icon">🏛️</span><h3>Preferred universities</h3><p>Identify the universities you would like to apply to. We do not represent or partner with a specific institution.</p></article>
          </div>
        </div>
      </section>

      <section className="application-section application-section-tint">
        <div className="application-section-inner application-documents-layout">
          <div>
            <span className="application-section-label">BEFORE YOU APPLY</span>
            <h2>Requirements and <span>supporting documents</span></h2>
            <p className="application-section-copy">Requirements vary by institution and programme. Check the official university application instructions for the latest details.</p>
          </div>
          <ul className="application-check-list">
            {documents.map((document) => <li key={document}><span aria-hidden="true">✓</span>{document}</li>)}
          </ul>
        </div>
      </section>

      <section className="application-section">
        <div className="application-section-inner">
          <div className="application-section-heading">
            <span className="application-section-label">SERVICE FEES</span>
            <h2>Choose the support <span>that suits you</span></h2>
            <p>We confirm the service fee with you before starting. University application fees, if charged, are separate and payable to the institution.</p>
          </div>
          <div className="application-price-cards">
            <article className="application-card application-price-card">
              <span className="application-price-kicker">GETTING STARTED</span><h3>Application guidance</h3>
              <p>Discuss your course and institution preferences and what to prepare.</p>
              <strong className="application-price-value">Fee confirmed by enquiry</strong>
              <Link className="application-card-link" to="/applications/apply">Ask about this service <span aria-hidden="true">→</span></Link>
            </article>
            <article className="application-card application-price-card application-price-card-featured">
              <span className="application-price-kicker">APPLICATION SUPPORT</span><h3>Application preparation</h3>
              <p>Get assistance organising your choices and application information.</p>
              <strong className="application-price-value">Fee confirmed before work begins</strong>
              <Link className="application-card-link" to="/applications/apply">Ask about this service <span aria-hidden="true">→</span></Link>
            </article>
          </div>
          <p className="application-footnote">These descriptions explain support options, not admission outcomes. No admission is guaranteed.</p>
        </div>
      </section>

      <section className="application-cta-section">
        <div className="application-cta-inner">
          <div><span className="application-section-label">READY TO EXPLORE?</span><h2>Start your university application enquiry.</h2><p>Share your preferences and we’ll help you understand the next steps.</p></div>
          <Link className="application-btn application-btn-primary" to="/applications/apply">Apply now <span aria-hidden="true">→</span></Link>
        </div>
      </section>
    </main>
  );
}

export default UniversityApplications;
