import { useState } from "react";
import CareerServiceForm from "./CareerServiceForm";
import "../../styles/career-services/CVPreparation.css";

const packages = [
  {
    name: "Basic CV",
    key: "Basic",
    price: "R80",
    ideal: "Students, matriculants and graduates",
    experience: "0–2 years",
    pages: "1 page",
    features: [
      "Professional and attractive design",
      "Clean and easy-to-read layout",
      "Education, skills and personal profile",
      "1-page CV",
    ],
  },
  {
    name: "Standard CV",
    key: "Standard",
    price: "R150",
    ideal: "Professionals",
    experience: "3–7 years",
    pages: "Up to 2 pages",
    features: [
      "Professional and attractive design",
      "Well-structured work experience",
      "Professional duties and skills",
      "Career profile",
      "Up to 2 pages",
    ],
  },
  {
    name: "Senior / Executive CV",
    key: "Senior / Executive",
    price: "R300",
    ideal: "Managers, supervisors and experienced professionals",
    experience: "8+ years",
    pages: "2–3 pages",
    features: [
      "Professional and attractive design",
      "Detailed work experience",
      "Leadership and management experience",
      "Achievements and responsibilities",
      "2–3 pages",
    ],
  },
];

const faqs = [
  ["What is the difference between the packages?", "All packages provide a professional and attractive CV design. The difference is the level of experience and the amount of detail included in the CV."],
  ["What do I need to provide?", "Your old CV, or your personal information, education and work history, together with the job title or position you are applying for."],
  ["How long does preparation take?", "The stated turnaround time is 24–48 hours."],
  ["How is my CV delivered?", "The stated delivery format is a high-quality, print-ready PDF."],
];

function CVPreparation() {
  const [selectedPackage, setSelectedPackage] = useState("");

  function selectPackage(packageName) {
    setSelectedPackage(packageName);
    document.getElementById("cv-enquiry")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <main className="career-page cv-preparation-page">
      <section className="career-hero career-hero-compact">
        <div className="career-hero-copy">
          <span className="career-eyebrow">CV PREPARATION</span>
          <h1>Professional CV <span>Writing Services</span></h1>
          <p>
            Need a Professional, Attractive &amp; Well-Written CV? We create
            modern, neat and professional CVs tailored to your experience and
            the type of job you are applying for.
          </p>
          <div className="career-actions">
            <a className="career-button career-button-primary" href="#cv-packages">View CV packages <i className="fas fa-arrow-right" aria-hidden="true" /></a>
            <a className="career-button career-button-secondary" href="#cv-enquiry">Request a CV</a>
          </div>
        </div>
        <div className="career-hero-art career-hero-art-simple" aria-hidden="true">
          <span className="career-hero-emoji">📄</span>
          <strong>Professional CV.<br />Professional Presentation.</strong>
          <span>Better Opportunities.</span>
        </div>
      </section>

      <section className="career-section career-section-tint" id="cv-packages">
        <div className="career-container">
          <header className="career-heading">
            <span className="career-section-label">CV PACKAGES</span>
            <h2>Choose the CV that fits <span>your experience</span></h2>
            <p>Package names, inclusions and prices below follow the supplied service information.</p>
          </header>
          <div className="cv-package-grid">
            {packages.map((item, index) => (
              <article className={`career-card cv-package-card ${index === 1 ? "cv-package-featured" : ""}`} key={item.key}>
                <span className="cv-package-label">{item.name}</span>
                <h3>{item.price}</h3>
                <p className="cv-package-ideal"><strong>Ideal for:</strong> {item.ideal}</p>
                <p className="cv-package-experience"><strong>Experience:</strong> {item.experience}</p>
                <ul className="career-check-list">{item.features.map((feature) => <li key={feature}><i className="fas fa-check" aria-hidden="true" />{feature}</li>)}</ul>
                <button className="career-button career-button-primary" type="button" onClick={() => selectPackage(item.key)}>Enquire about this package <i className="fas fa-arrow-right" aria-hidden="true" /></button>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="career-section">
        <div className="career-container">
          <header className="career-heading">
            <span className="career-section-label">PACKAGE COMPARISON</span>
            <h2>One professional design, <span>three experience levels</span></h2>
            <p>Every package receives a professional and attractive design. Packages differ in experience level and amount of detail.</p>
          </header>
          <div className="career-table-wrap">
            <table className="career-comparison-table">
              <thead><tr><th scope="col">Package</th><th scope="col">Experience</th><th scope="col">Ideal for</th><th scope="col">Length</th><th scope="col">Price</th></tr></thead>
              <tbody>{packages.map((item) => <tr key={item.key}><th scope="row">{item.name}</th><td>{item.experience}</td><td>{item.ideal}</td><td>{item.pages}</td><td>{item.price}</td></tr>)}</tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="career-section career-section-tint">
        <div className="career-container cv-preparation-details">
          <div>
            <span className="career-section-label">WHAT WE NEED FROM YOU</span>
            <h2>Help us tell your <span>professional story</span></h2>
            <ol className="career-number-list">
              <li>Your old CV, or your personal information, education and work history.</li>
              <li>The job title or position you are applying for.</li>
            </ol>
          </div>
          <div className="cv-delivery-card">
            <article><span className="career-icon"><i className="fas fa-clock" aria-hidden="true" /></span><div><h3>Turnaround time</h3><p>24–48 hours</p></div></article>
            <article><span className="career-icon"><i className="fas fa-file-pdf" aria-hidden="true" /></span><div><h3>Delivery</h3><p>High-quality, print-ready PDF</p></div></article>
          </div>
        </div>
      </section>

      <section className="career-section">
        <div className="career-container">
          <header className="career-heading"><span className="career-section-label">CV SERVICE FAQ</span><h2>Good to <span>know</span></h2></header>
          <div className="career-faq-list">{faqs.map(([question, answer]) => <details className="career-faq" key={question}><summary>{question}<i className="fas fa-plus" aria-hidden="true" /></summary><p>{answer}</p></details>)}</div>
        </div>
      </section>

      <section className="career-cta cv-closing">
        <div className="career-container career-cta-inner">
          <div><span className="career-section-label">YOUR NEXT OPPORTUNITY</span><h2>Professional CV. Professional Presentation. Better Opportunities.</h2><p>Contact us about a package or request CV preparation assistance.</p></div>
          <div className="career-contact-stack">
            <a href="tel:+27728179857">072 817 9857</a>
            <a href="tel:+27680513619">068 051 3619</a>
            <a href="mailto:cv@ourmemoriesedutech.co.za">cv@ourmemoriesedutech.co.za</a>
            <a href="http://www.ourmemoriesedutech.co.za/" target="_blank" rel="noopener noreferrer">www.ourmemoriesedutech.co.za</a>
          </div>
        </div>
      </section>

      <div className="career-container cv-form-container">
        <CareerServiceForm
          initialService="CV Preparation"
          initialCvPackage={selectedPackage}
          onCvPackageChange={setSelectedPackage}
          email="cv@ourmemoriesedutech.co.za"
          title="Request CV preparation"
          serviceFields={[
            { name: "experienceLevel", label: "Current experience level", type: "select", options: ["0–2 years", "3–7 years", "8+ years"], required: true },
            { name: "targetJob", label: "Target job title", required: true },
            { name: "existingCv", label: "Do you have an existing CV?", type: "select", options: ["Yes", "No"], required: true },
            { name: "additionalInformation", label: "Additional information", type: "textarea", wide: true, placeholder: "Share relevant CV details. Do not include sensitive information." },
          ]}
        />
      </div>
    </main>
  );
}

export default CVPreparation;
