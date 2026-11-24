import { Link } from "react-router-dom";
import "../../styles/applications/SchoolApplications.css";

function SchoolApplications() {
  return (
    <main className="application-page school-applications-page">
      <section className="application-hero application-hero-compact">
        <div className="application-hero-content">
          <span className="application-eyebrow">SCHOOL APPLICATION SUPPORT</span>
          <h1>Helping families prepare for <span>the next school year.</span></h1>
          <p>
            Our Memories EduTech can assist parents and applicants with
            preparing school enquiries and organising application information.
            Admission decisions and placement are made by the relevant school
            or education authority.
          </p>
          <div className="application-hero-actions"><Link className="application-btn application-btn-primary" to="/applications/apply">Apply now <span aria-hidden="true">→</span></Link><a className="application-btn application-btn-secondary" href="#school-enquiry">Make an enquiry</a></div>
        </div>
        <div className="application-hero-visual application-hero-visual-simple" aria-hidden="true"><span className="application-hero-large-icon">📚</span><div className="application-hero-visual-caption"><strong>Prepare together.</strong><span>Guidance for families and learners</span></div></div>
      </section>

      <section className="application-section">
        <div className="application-section-inner">
          <div className="application-section-heading"><span className="application-section-label">START WITH THE DETAILS</span><h2>What to prepare for a <span>school enquiry</span></h2><p>Having key information ready can help you ask clear questions and understand the application steps.</p></div>
          <div className="application-info-grid">
            <article className="application-card"><span className="application-card-icon">👤</span><h3>Learner information</h3><p>Prepare the learner’s full names, date of birth, current grade and recent academic results.</p></article>
            <article className="application-card"><span className="application-card-icon">📍</span><h3>Family and location details</h3><p>Have a parent or guardian’s contact details and your residential address available.</p></article>
            <article className="application-card"><span className="application-card-icon">📑</span><h3>Documents to check</h3><p>Ask the school or education authority which documents are needed and whether copies must be certified.</p></article>
          </div>
        </div>
      </section>

      <section className="application-section application-section-tint">
        <div className="application-section-inner application-documents-layout">
          <div><span className="application-section-label">APPLICATION PREPARATION</span><h2>School selection and <span>application assistance</span></h2><p className="application-section-copy">We can help you organise school preferences and prepare information for an enquiry or application. School availability, catchment rules, admission requirements and placement processes vary. Confirm these directly with the relevant school or authority.</p></div>
          <div className="application-card application-note-card"><span className="application-card-icon">ℹ️</span><h3>Important to know</h3><p>We do not claim partnerships with particular schools, set school fees or guarantee admission or placement.</p><p>Our service fee is confirmed before work begins. Any school or authority fees are separate.</p></div>
        </div>
      </section>

      <section className="application-section" id="school-enquiry">
        <div className="application-section-inner application-enquiry-panel">
          <div><span className="application-section-label">LET’S TALK</span><h2>Have a question about <span>school applications?</span></h2><p>Tell us the learner’s grade, preferred area and the kind of help you’re looking for. We’ll discuss the next steps and confirm any service fee before starting.</p></div>
          <div className="application-enquiry-actions"><Link className="application-btn application-btn-primary" to="/applications/apply">Send an enquiry <span aria-hidden="true">→</span></Link><a href="https://wa.me/27634328758" target="_blank" rel="noopener noreferrer">WhatsApp 063 432 8758</a><a href="https://wa.me/27680513619" target="_blank" rel="noopener noreferrer">WhatsApp 068 051 3619</a><a href="mailto:Ourmemoriesapplicationoffice@gmail.com">Email our application office</a><a href="mailto:info@ourmemoriesedutech.co.za">Email info@ourmemoriesedutech.co.za</a></div>
        </div>
      </section>
      <section className="application-cta-section"><div className="application-cta-inner"><div><span className="application-section-label">READY TO START?</span><h2>Prepare your school application enquiry.</h2><p>Share your details and we’ll be in touch about the available assistance.</p></div><Link className="application-btn application-btn-primary" to="/applications/apply">Apply now <span aria-hidden="true">→</span></Link></div></section>
    </main>
  );
}

export default SchoolApplications;
