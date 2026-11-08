import { Link } from "react-router-dom";
import "../../styles/applications/CAOApplications.css";

const documents = [
  "Applicant ID copy or passport",
  "Latest academic results or final school-leaving results",
  "Parent or guardian information, where required",
  "Any supporting documents requested by CAO or the institution",
];

function CAOApplications() {
  return (
    <main className="application-page cao-applications-page">
      <section className="application-hero application-hero-compact">
        <div className="application-hero-content">
          <span className="application-eyebrow">CAO APPLICATION SUPPORT</span>
          <h1>Organise your choices and <span>prepare to apply.</span></h1>
          <p>Get assistance preparing a CAO application, organising programme and institution choices, and checking the information you may need. Institutions make their own admission decisions.</p>
          <div className="application-hero-actions"><Link className="application-btn application-btn-primary" to="/applications/apply">Apply now <span aria-hidden="true">→</span></Link><a className="application-btn application-btn-secondary" href="#cao-enquiry">Make an enquiry</a></div>
        </div>
        <div className="application-hero-visual application-hero-visual-simple" aria-hidden="true"><span className="application-hero-large-icon">🗂️</span><div className="application-hero-visual-caption"><strong>Compare your options.</strong><span>Prepare your CAO application</span></div></div>
      </section>

      <section className="application-section">
        <div className="application-section-inner">
          <div className="application-section-heading"><span className="application-section-label">PLAN YOUR PREFERENCES</span><h2>Programme and institution <span>choices</span></h2><p>Prepare a considered list of the programmes and institutions you would like to include in your application.</p></div>
          <div className="application-info-grid">
            <article className="application-card"><span className="application-card-icon">📘</span><h3>Explore programmes</h3><p>Think about your interests and entry subjects, then confirm programme details and requirements with the institution.</p></article>
            <article className="application-card"><span className="application-card-icon">🏛️</span><h3>Choose institutions</h3><p>Organise your institution preferences and verify that the programmes you select are listed in the current CAO process.</p></article>
            <article className="application-card"><span className="application-card-icon">✓</span><h3>Review before applying</h3><p>Check that your choices and personal details are accurate and that you have followed current CAO instructions.</p></article>
          </div>
        </div>
      </section>

      <section className="application-section application-section-tint">
        <div className="application-section-inner application-documents-layout">
          <div><span className="application-section-label">APPLICANT INFORMATION</span><h2>Prepare your details and <span>documents</span></h2><p className="application-section-copy">Keep your contact details and academic information accurate. Check official CAO and institution requirements; the list below is a general guide.</p></div>
          <ul className="application-check-list">{documents.map((document) => <li key={document}><span aria-hidden="true">✓</span>{document}</li>)}</ul>
        </div>
      </section>

      <section className="application-section" id="cao-enquiry">
        <div className="application-section-inner application-enquiry-panel">
          <div><span className="application-section-label">QUESTIONS ABOUT CAO?</span><h2>Ask us about <span>application assistance.</span></h2><p>Tell us which programmes and institutions you are considering. We will clarify the support available and confirm any service fee before starting. CAO and institution charges, if any, are separate.</p></div>
          <div className="application-enquiry-actions"><Link className="application-btn application-btn-primary" to="/applications/apply">Start an enquiry <span aria-hidden="true">→</span></Link><a href="https://wa.me/27634328758" target="_blank" rel="noopener noreferrer">WhatsApp 063 432 8758</a><a href="https://wa.me/27680513619" target="_blank" rel="noopener noreferrer">WhatsApp 068 051 3619</a><a href="mailto:Ourmemoriesapplicationoffice@gmail.com">Ourmemoriesapplicationoffice@gmail.com</a><a href="mailto:info@ourmemoriesedutech.co.za">info@ourmemoriesedutech.co.za</a></div>
        </div>
      </section>
      <section className="application-cta-section"><div className="application-cta-inner"><div><span className="application-section-label">READY TO PREPARE?</span><h2>Start your CAO application enquiry.</h2><p>Share your programme and institution preferences with us.</p></div><Link className="application-btn application-btn-primary" to="/applications/apply">Apply now <span aria-hidden="true">→</span></Link></div></section>
    </main>
  );
}

export default CAOApplications;
