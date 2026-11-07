import { Link } from "react-router-dom";
import "../../styles/applications/TVETApplications.css";

const documents = [
  "Certified ID copy or birth certificate",
  "Latest school or college academic results",
  "Parent or guardian ID copy, where required",
  "Proof of residence, where required",
  "Any forms or supporting documents requested by the college",
];

function TVETApplications() {
  return (
    <main className="application-page tvet-applications-page">
      <section className="application-hero application-hero-compact">
        <div className="application-hero-content">
          <span className="application-eyebrow">TVET COLLEGE APPLICATION SUPPORT</span>
          <h1>Build practical skills for <span>what’s next.</span></h1>
          <p>
            Get help exploring TVET college and programme options, preparing
            your application information and understanding the steps to take.
            Admission and placement decisions are made by each college.
          </p>
          <div className="application-hero-actions">
            <Link className="application-btn application-btn-primary" to="/applications/apply">Apply now <span aria-hidden="true">→</span></Link>
            <a className="application-btn application-btn-secondary" href="#tvet-support">View support details</a>
          </div>
        </div>
        <div className="application-hero-visual application-hero-visual-simple" aria-hidden="true">
          <span className="application-hero-large-icon">🧰</span>
          <div className="application-hero-visual-caption"><strong>Explore practical pathways.</strong><span>Choose with confidence</span></div>
        </div>
      </section>

      <section className="application-section" id="tvet-support">
        <div className="application-section-inner">
          <div className="application-section-heading"><span className="application-section-label">YOUR APPLICATION JOURNEY</span><h2>Support to explore <span>your options</span></h2><p>We can help you organise your preferences and understand what an application may involve.</p></div>
          <div className="application-info-grid">
            <article className="application-card"><span className="application-card-icon">🏫</span><h3>College selection</h3><p>Identify colleges you would like to research and check their locations, programmes and application instructions.</p></article>
            <article className="application-card"><span className="application-card-icon">🛠️</span><h3>Programme selection</h3><p>Discuss your interests and possible programmes, then check entry requirements directly with the college.</p></article>
            <article className="application-card"><span className="application-card-icon">📝</span><h3>Application preparation</h3><p>Organise applicant information and supporting documents requested by your chosen college.</p></article>
          </div>
        </div>
      </section>

      <section className="application-section application-section-tint">
        <div className="application-section-inner application-documents-layout">
          <div><span className="application-section-label">GET READY</span><h2>Supporting <span>documents</span></h2><p className="application-section-copy">The college sets its own requirements. Use this general checklist as a starting point and confirm the current list with the college.</p></div>
          <ul className="application-check-list">{documents.map((document) => <li key={document}><span aria-hidden="true">✓</span>{document}</li>)}</ul>
        </div>
      </section>

      <section className="application-section">
        <div className="application-section-inner application-extra-service">
          <div><span className="application-section-label">OPTIONAL SUPPORT</span><h2>Placement test <span>preparation</span></h2><p>We can discuss preparation support for a college placement test where applicable. Test preparation is an <strong>extra-fee service</strong>; ask us to confirm the service fee before booking.</p></div>
          <Link className="application-btn application-btn-secondary" to="/applications/apply">Enquire about preparation</Link>
        </div>
      </section>

      <section className="application-section application-section-tint">
        <div className="application-section-inner">
          <div className="application-section-heading"><span className="application-section-label">SERVICE FEES</span><h2>TVET application <span>support options</span></h2><p>We confirm our service fee before starting. College application fees, if any, are separate and payable to the college.</p></div>
          <div className="application-price-cards">
            <article className="application-card application-price-card"><span className="application-price-kicker">GUIDANCE</span><h3>College and programme guidance</h3><p>Discuss college preferences, programme options and requirements to prepare.</p><strong className="application-price-value">Contact us for a quote</strong><Link className="application-card-link" to="/applications/apply">Request details <span aria-hidden="true">→</span></Link></article>
            <article className="application-card application-price-card application-price-card-featured"><span className="application-price-kicker">APPLICATION SUPPORT</span><h3>Application preparation</h3><p>Get help organising your application information and supporting documents.</p><strong className="application-price-value">Fee confirmed before work begins</strong><Link className="application-card-link" to="/applications/apply">Request details <span aria-hidden="true">→</span></Link></article>
          </div>
          <p className="application-footnote">Placement test preparation is not included in these options and carries an extra fee.</p>
        </div>
      </section>

      <section className="application-cta-section"><div className="application-cta-inner"><div><span className="application-section-label">TAKE THE NEXT STEP</span><h2>Tell us what you’re looking for.</h2><p>Share your college and programme interests in an enquiry.</p></div><Link className="application-btn application-btn-primary" to="/applications/apply">Apply now <span aria-hidden="true">→</span></Link></div></section>
    </main>
  );
}

export default TVETApplications;
