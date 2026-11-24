import CareerServiceForm from "./CareerServiceForm";
import "../../styles/career-services/GraduateProgrammes.css";

const supportOptions = [
  ["fa-file-lines", "Graduate CV preparation", "Present your qualification, projects, practical experience and transferable skills clearly."],
  ["fa-envelope-open-text", "Cover letter assistance", "Prepare a focused introduction that connects your background and interests to the programme."],
  ["fa-list-check", "Application preparation", "Organise the information and supporting documents requested by the programme provider."],
];

const documents = [
  "Academic qualification or proof of studies",
  "Academic transcript or results, if requested",
  "Current graduate CV",
  "Cover letter, if required",
  "Relevant certificates or evidence of experience",
  "The programme notice and official application instructions",
];

function GraduateProgrammes() {
  return (
    <main className="career-page graduate-programmes-page">
      <section className="career-hero career-hero-compact">
        <div className="career-hero-copy">
          <span className="career-eyebrow">GRADUATE PROGRAMME GUIDANCE</span>
          <h1>Take your first career steps <span>with a plan.</span></h1>
          <p>Application preparation guidance for recent graduates and final-year students exploring graduate programmes.</p>
          <div className="career-actions"><a className="career-button career-button-primary" href="#graduate-support">Explore support <i className="fas fa-arrow-right" aria-hidden="true" /></a><a className="career-button career-button-secondary" href="#career-enquiry">Make an enquiry</a></div>
        </div>
        <div className="career-hero-art career-hero-art-simple" aria-hidden="true"><span className="career-hero-emoji">🎓</span><strong>Your learning is a<br />strong place to start.</strong><span>Prepare for graduate applications</span></div>
      </section>

      <section className="career-section" id="graduate-support">
        <div className="career-container">
          <header className="career-heading"><span className="career-section-label">SUPPORT FOR GRADUATES</span><h2>Prepare a confident <span>application</span></h2><p>We can help recent graduates and final-year students organise their materials and present their experience.</p></header>
          <div className="career-info-grid career-info-grid-three">
            {supportOptions.map(([icon, title, description]) => <article className="career-card" key={title}><span className="career-icon"><i className={`fas ${icon}`} aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="career-section career-section-tint">
        <div className="career-container career-two-column">
          <div><span className="career-section-label">ACADEMIC AND APPLICATION DETAILS</span><h2>Check the programme <span>requirements</span></h2><p>Graduate programmes set their own qualification, eligibility and document requirements. Read the official notice carefully and confirm anything unclear with the provider.</p></div>
          <ul className="career-check-list">{documents.map((item) => <li key={item}><i className="fas fa-check" aria-hidden="true" />{item}</li>)}</ul>
        </div>
      </section>

      <section className="career-section"><div className="career-container career-disclaimer"><i className="fas fa-circle-info" aria-hidden="true" /><p>We do not advertise graduate vacancies, claim participating company partnerships, set deadlines or guarantee employment. Contact us for service pricing.</p></div></section>

      <div className="career-container career-form-container">
        <CareerServiceForm
          initialService="Graduate Programmes"
          title="Enquire about graduate programme support"
          serviceFields={[
            { name: "qualification", label: "Qualification or field of study", required: true },
            { name: "studyStatus", label: "Study status", type: "select", options: ["Final-year student", "Recently graduated", "Other"], required: true },
            { name: "programmeTitle", label: "Programme title (if known)" },
            { name: "organisation", label: "Organisation (if known)" },
            { name: "additionalInformation", label: "Additional information", type: "textarea", wide: true },
          ]}
        />
      </div>
    </main>
  );
}

export default GraduateProgrammes;
