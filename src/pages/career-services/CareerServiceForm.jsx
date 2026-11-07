import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/career-services/CareerServiceForm.css";

const careerServices = [
  "CV Preparation",
  "Cover Letters",
  "Job Applications",
  "Internships & Learnerships",
  "Graduate Programmes",
];

const contacts = [
  { label: "WhatsApp 072 817 9857", href: "https://wa.me/27728179857?text=Hello%20Our%20Memories%20EduTech%2C%20I%20would%20like%20career%20service%20assistance." },
  { label: "WhatsApp 067 691 6912", href: "https://wa.me/27676916912?text=Hello%20Our%20Memories%20EduTech%2C%20I%20would%20like%20career%20service%20assistance." },
];

function CareerServiceForm({
  initialService = "",
  initialCvPackage = "",
  onCvPackageChange,
  serviceFields = [],
  email = "info@ourmemoriesedutech.co.za",
  title = "Tell us what support you need",
}) {
  const [submittedForReview, setSubmittedForReview] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setSubmittedForReview(true);
  }

  return (
    <section className="career-form-section" id="career-enquiry">
      <div className="career-form-heading">
        <span className="career-section-label">CAREER SERVICE ENQUIRY</span>
        <h2>{title}</h2>
        <p>Complete the relevant fields to review what you want to ask us. This form is not connected to a submission service.</p>
      </div>

      <form className="career-enquiry-form" onSubmit={handleSubmit}>
        <div className="career-form-grid">
          <label className="career-field" htmlFor="career-service">
            <span>Service <b aria-hidden="true">*</b></span>
            <select id="career-service" name="service" defaultValue={initialService} required>
              <option value="">Choose a service</option>
              {careerServices.map((service) => <option key={service} value={service}>{service}</option>)}
            </select>
          </label>

          <label className="career-field" htmlFor="career-full-name">
            <span>Full name <b aria-hidden="true">*</b></span>
            <input id="career-full-name" name="fullName" type="text" autoComplete="name" required />
          </label>

          <label className="career-field" htmlFor="career-email">
            <span>Email address <b aria-hidden="true">*</b></span>
            <input id="career-email" name="email" type="email" autoComplete="email" required />
          </label>

          <label className="career-field" htmlFor="career-phone">
            <span>Contact number <b aria-hidden="true">*</b></span>
            <input id="career-phone" name="phone" type="tel" autoComplete="tel" required />
          </label>

          {initialService === "CV Preparation" && (
            <label className="career-field" htmlFor="career-cv-package">
              <span>Selected CV package <b aria-hidden="true">*</b></span>
              <select
                id="career-cv-package"
                name="cvPackage"
                value={initialCvPackage}
                onChange={(event) => onCvPackageChange?.(event.target.value)}
                required
              >
                <option value="">Choose a CV package</option>
                <option value="Basic">Basic CV – R80</option>
                <option value="Standard">Standard CV – R150</option>
                <option value="Senior / Executive">Senior / Executive CV – R300</option>
              </select>
            </label>
          )}

          {serviceFields.map((field) => (
            <label
              className={`career-field ${field.wide ? "career-field-wide" : ""}`}
              htmlFor={`career-${field.name}`}
              key={field.name}
            >
              <span>{field.label}{field.required && <> <b aria-hidden="true">*</b></>}</span>
              {field.type === "textarea" ? (
                <textarea
                  id={`career-${field.name}`}
                  name={field.name}
                  rows={field.rows || 3}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              ) : field.type === "select" ? (
                <select id={`career-${field.name}`} name={field.name} defaultValue="" required={field.required}>
                  <option value="">Select an option</option>
                  {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                </select>
              ) : (
                <input
                  id={`career-${field.name}`}
                  name={field.name}
                  type={field.type || "text"}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </label>
          ))}
        </div>

        <div className="career-form-submit">
          <p>Required fields are marked with <b>*</b>. Do not include passwords, ID numbers or sensitive personal information.</p>
          <button className="career-button career-button-primary" type="submit">Review enquiry details <i className="fas fa-arrow-right" aria-hidden="true" /></button>
        </div>
      </form>

      {submittedForReview && (
        <div className="career-form-notice" role="status" aria-live="polite">
          <strong>Your enquiry has not been sent or saved.</strong>
          <p>This frontend form is for reviewing the information only. Please contact us directly to make an enquiry. Secure backend submission can be integrated later.</p>
          <div className="career-contact-links">
            <a href={`mailto:${email}`}>Email {email}</a>
            {contacts.map((contact) => <a key={contact.href} href={contact.href} target="_blank" rel="noopener noreferrer">{contact.label}</a>)}
            <Link to="/contact">General contact page</Link>
          </div>
        </div>
      )}
    </section>
  );
}

export default CareerServiceForm;
