import CareerServiceForm from "./CareerServiceForm";
import "../../styles/career-services/InternshipsLearnerships.css";

const checklist = [
  "Current CV and accurate contact information",
  "Academic results or proof of studies, as applicable",
  "Relevant certificates or qualifications",
  "Identification documents only if requested by the provider",
  "The official opportunity notice and application instructions",
];

const faqs = [
  ["What is an internship?", "An internship is generally a time-limited work experience or training opportunity that helps a participant develop practical workplace skills. The exact structure depends on the provider."],
  ["What is a learnership?", "A learnership generally combines structured learning with practical workplace experience and may lead to a registered qualification. Confirm the specific programme details with its provider."],
  ["Can you guarantee placement?", "No. Providers set their own eligibility and selection criteria and decide who is placed."],
];

function InternshipsLearnerships() {
  return (
    <main className="career-page internships-learnerships-page">
      <section className="career-hero career-hero-compact">
        <div className="career-hero-copy">
          <span className="career-eyebrow">EARLY CAREER OPPORTUNITIES</span>
          <h1>Prepare for practical <span>experience.</span></h1>
          <p>Get application guidance for internships and learnerships, from understanding requirements to preparing your CV and supporting documents.</p>
          <div className="career-actions"><a className="career-button career-button-primary" href="#opportunity-types">Explore opportunities <i className="fas fa-arrow-right" aria-hidden="true" /></a><a className="career-button career-button-secondary" href="#career-enquiry">Enquire now</a></div>
        </div>
        <div className="career-hero-art career-hero-art-simple" aria-hidden="true"><span className="career-hero-emoji">🌱</span><strong>Learn by doing.<br />Grow your skills.</strong><span>Prepare for your next step</span></div>
      </section>

      <section className="career-section" id="opportunity-types">
        <div className="career-container">
          <header className="career-heading"><span className="career-section-label">UNDERSTAND THE OPTIONS</span><h2>Internships and <span>learnerships</span></h2><p>Both can provide practical learning, but programme structures and requirements differ.</p></header>
          <div className="career-info-grid">
            <article className="career-card"><span className="career-icon"><i className="fas fa-briefcase" aria-hidden="true" /></span><h3>Internship assistance</h3><p>Guidance preparing internship applications, including CV presentation, supporting documents and application instructions.</p><p className="career-small-note">An internship is usually a structured period of practical work experience. Specific arrangements vary by provider.</p></article>
            <article className="career-card"><span className="career-icon"><i className="fas fa-book-open" aria-hidden="true" /></span><h3>Learnership assistance</h3><p>Guidance preparing learnership applications and understanding what information the programme provider requests.</p><p className="career-small-note">A learnership generally combines structured learning with workplace experience and may lead to a qualification.</p></article>
          </div>
        </div>
      </section>

      <section className="career-section career-section-tint">
        <div className="career-container career-two-column">
          <div><span className="career-section-label">APPLICATION PREPARATION</span><h2>Get your information <span>ready</span></h2><p>Eligibility, requirements and application processes are determined by each opportunity provider. Check their official instructions before applying.</p></div>
          <ul className="career-check-list">{checklist.map((item) => <li key={item}><i className="fas fa-check" aria-hidden="true" />{item}</li>)}</ul>
        </div>
      </section>

      <section className="career-section">
        <div className="career-container">
          <header className="career-heading"><span className="career-section-label">COMMON QUESTIONS</span><h2>Before you <span>apply</span></h2></header>
          <div className="career-faq-list">{faqs.map(([question, answer]) => <details className="career-faq" key={question}><summary>{question}<i className="fas fa-plus" aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
          <p className="career-disclaimer-text">We do not invent or advertise opportunities, employers, deadlines or partnerships. No placement is guaranteed. Contact us for service pricing.</p>
        </div>
      </section>

      <div className="career-container career-form-container">
        <CareerServiceForm
          initialService="Internships & Learnerships"
          title="Enquire about internship or learnership support"
          serviceFields={[
            { name: "opportunityType", label: "Type of opportunity", type: "select", options: ["Internship", "Learnership", "Not sure yet"], required: true },
            { name: "fieldOfInterest", label: "Field of interest", required: true },
            { name: "qualification", label: "Current study or qualification" },
            { name: "opportunityReference", label: "Opportunity title or reference (if available)" },
            { name: "additionalInformation", label: "Additional information", type: "textarea", wide: true },
          ]}
        />
      </div>
    </main>
  );
}

export default InternshipsLearnerships;
