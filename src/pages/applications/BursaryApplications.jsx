import { Link } from "react-router-dom";
import "../../styles/applications/BursaryApplications.css";

const documents = [
  "Certified applicant ID copy",
  "Latest academic results or proof of registration, as applicable",
  "Certified parent or guardian ID copy, where required",
  "Proof of residence, where required",
  "Any documents specifically requested by the bursary provider",
];

function BursaryApplications() {
  return (
    <main className="application-page bursary-applications-page">
      <section className="application-hero application-hero-compact">
        <div className="application-hero-content">
          <span className="application-eyebrow">BURSARY APPLICATION SUPPORT</span>
          <h1>Explore funding options for <span>your studies.</span></h1>
          <p>Get assistance preparing Funza Lushaka or other bursary applications. Funding criteria and approval decisions are set by each bursary provider.</p>
          <div className="application-hero-actions"><Link className="application-btn application-btn-primary" to="/applications/apply">Apply now <span aria-hidden="true">→</span></Link><a className="application-btn application-btn-secondary" href="#bursary-fees">View service fees</a></div>
        </div>
        <div className="application-hero-visual application-hero-visual-simple" aria-hidden="true"><span className="application-hero-large-icon">🌱</span><div className="application-hero-visual-caption"><strong>Find a path to grow.</strong><span>Prepare your funding application</span></div></div>
      </section>

      <section className="application-section">
        <div className="application-section-inner">
          <div className="application-section-heading"><span className="application-section-label">BURSARY SUPPORT</span><h2>Help with your <span>application preparation</span></h2><p>We can help organise applicant and academic information and review the supporting documents requested by a provider.</p></div>
          <div className="application-info-grid">
            <article className="application-card"><span className="application-card-icon">🌍</span><h3>Funza Lushaka</h3><p>Get application assistance for the Funza Lushaka Bursary Programme. Check current eligibility, qualifying studies and requirements through the official programme channels.</p></article>
            <article className="application-card"><span className="application-card-icon">📚</span><h3>Other bursaries</h3><p>Get assistance preparing an application for another bursary. Each provider sets its own qualifying criteria, documents and application process.</p></article>
            <article className="application-card"><span className="application-card-icon">🧾</span><h3>Applicant and academic details</h3><p>Prepare your personal and contact information, study plans, academic results and any information requested by the bursary provider.</p></article>
          </div>
        </div>
      </section>

      <section className="application-section application-section-tint">
        <div className="application-section-inner application-documents-layout">
          <div><span className="application-section-label">DOCUMENT CHECKLIST</span><h2>Get your documents <span>ready</span></h2><p className="application-section-copy">This is a general checklist. Follow the current requirements from the bursary provider, including any certification or format instructions.</p></div>
          <ul className="application-check-list">{documents.map((document) => <li key={document}><span aria-hidden="true">✓</span>{document}</li>)}</ul>
        </div>
      </section>

      <section className="application-section" id="bursary-fees">
        <div className="application-section-inner">
          <div className="application-section-heading"><span className="application-section-label">OUR SERVICE FEES</span><h2>Clear fees for <span>application assistance</span></h2><p>These are Our Memories EduTech service fees. They are separate from any fee or cost set by a bursary provider.</p></div>
          <div className="application-price-cards">
            <article className="application-card application-price-card"><span className="application-price-kicker">TEACHING BURSARY</span><h3>Funza Lushaka</h3><p>Assistance preparing your Funza Lushaka bursary application.</p><strong className="application-price-value">R80</strong><span className="application-price-caption">Our service fee</span></article>
            <article className="application-card application-price-card application-price-card-featured"><span className="application-price-kicker">OTHER FUNDING</span><h3>Other bursary</h3><p>Assistance preparing an application for another bursary provider.</p><strong className="application-price-value">R180</strong><span className="application-price-caption">Our service fee</span></article>
          </div>
          <p className="application-footnote">We do not guarantee bursary approval. Funding decisions are made by the bursary provider.</p>
        </div>
      </section>
      <section className="application-cta-section"><div className="application-cta-inner"><div><span className="application-section-label">READY TO PREPARE?</span><h2>Start your bursary application enquiry.</h2><p>Tell us which bursary you’re interested in and ask about the next steps.</p></div><Link className="application-btn application-btn-primary" to="/applications/apply">Apply now <span aria-hidden="true">→</span></Link></div></section>
    </main>
  );
}

export default BursaryApplications;
