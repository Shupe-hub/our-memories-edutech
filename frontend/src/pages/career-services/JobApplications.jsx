import CareerServiceForm from "./CareerServiceForm";
import "../../styles/career-services/JobApplications.css";

const supportAreas = [
  ["fa-globe", "Online application guidance", "Understand application sections and prepare clear, accurate information for online forms."],
  ["fa-folder-open", "Application information", "Organise your work history, qualifications and relevant experience."],
  ["fa-file-circle-check", "Supporting documents", "Check and organise documents requested in the job advertisement."],
  ["fa-paper-plane", "Submission guidance", "Review application instructions and prepare to submit through the employer’s stated channel."],
  ["fa-rotate", "Follow-up guidance", "Understand appropriate ways to follow up, based on the employer’s instructions."],
];

function JobApplications() {
  return (
    <main className="career-page job-applications-page">
      <section className="career-hero career-hero-compact">
        <div className="career-hero-copy">
          <span className="career-eyebrow">JOB APPLICATION SUPPORT</span>
          <h1>Prepare your application <span>with care.</span></h1>
          <p>Get practical guidance organising the information and documents needed for job applications.</p>
          <div className="career-actions"><a className="career-button career-button-primary" href="#job-support">Explore the support <i className="fas fa-arrow-right" aria-hidden="true" /></a><a className="career-button career-button-secondary" href="#career-enquiry">Make an enquiry</a></div>
        </div>
        <div className="career-hero-art career-hero-art-simple" aria-hidden="true"><span className="career-hero-emoji">💼</span><strong>Prepare clearly.<br />Apply thoughtfully.</strong><span>Support for your application process</span></div>
      </section>

      <section className="career-section" id="job-support">
        <div className="career-container">
          <header className="career-heading"><span className="career-section-label">HOW WE CAN HELP</span><h2>Job application <span>assistance</span></h2><p>Get support with the preparation process. Employers make all recruitment and interview decisions.</p></header>
          <div className="career-service-grid career-service-grid-three">
            {supportAreas.map(([icon, title, description]) => <article className="career-card" key={title}><span className="career-icon"><i className={`fas ${icon}`} aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p></article>)}
          </div>
        </div>
      </section>

      <section className="career-section career-section-tint">
        <div className="career-container career-two-column">
          <div><span className="career-section-label">GET PREPARED</span><h2>What applicants <span>should prepare</span></h2><p>Review the vacancy instructions and collect only the documents requested for that application.</p></div>
          <ul className="career-check-list">
            {["Updated CV", "Cover letter, where required", "Academic qualifications", "Relevant certificates", "Accurate contact information", "Job advertisement or reference"].map((item) => <li key={item}><i className="fas fa-check" aria-hidden="true" />{item}</li>)}
          </ul>
        </div>
      </section>

      <section className="career-section"><div className="career-container career-disclaimer"><i className="fas fa-circle-info" aria-hidden="true" /><p>We do not offer or advertise unverified vacancies, claim employer partnerships, or promise employment, interviews or successful applications.</p></div></section>

      <div className="career-container career-form-container">
        <CareerServiceForm
          initialService="Job Applications"
          title="Enquire about job application assistance"
          serviceFields={[
            { name: "jobTitle", label: "Job title", required: true },
            { name: "jobReference", label: "Job advertisement or reference", required: false },
            { name: "applicationStage", label: "Application stage", type: "select", options: ["Preparing to apply", "Completing an application", "Preparing documents", "Following up", "Other"] },
            { name: "additionalInformation", label: "Additional information", type: "textarea", wide: true },
          ]}
        />
      </div>
    </main>
  );
}

export default JobApplications;
