import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/applications/ApplicationForm.css";

const applicationTypes = [
  "University Application",
  "TVET College Application",
  "School Application",
  "Bursary Application",
  "NSFAS Application",
  "CAO Application",
];

const provinces = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "Northern Cape",
  "North West",
  "Western Cape",
];

const documentOptions = [
  "Certified ID copy or birth certificate",
  "Academic results",
  "Certified parent / guardian ID copy, where required",
  "Proof of residence, where required",
  "Upgrading letter, if applicable",
];

const declarationOptions = [
  ["informationConfirmed", "I confirm that the information I have provided is true, correct and complete."],
  ["feesConfirmed", "I understand that Our Memories EduTech service fees are non-refundable."],
  ["feedbackConfirmed", "I understand that feedback is provided within 5–10 working days."],
  ["separateFeesConfirmed", "I understand that institution and funding organisation fees are separate."],
];

const fieldLabels = {
  fullNames: "Full names",
  surname: "Surname",
  email: "Email address",
  cellphone: "Cellphone number",
  province: "Province",
  postalCode: "Postal code",
  postalAddress: "Postal address",
  streetName: "Street name",
  town: "Town / city",
  highSchool: "High school name",
  homeLanguage: "Home language",
  currentGrade: "Current grade / status",
  guardianName: "Parent / guardian full names",
  guardianCellphone: "Parent / guardian cellphone",
  guardianEmail: "Parent / guardian email",
  firstChoiceCourse: "First choice course",
  secondChoiceCourse: "Second choice course",
  thirdChoiceCourse: "Third choice course",
  preferredInstitutions: "Preferred institution(s)",
  preferredSchools: "Preferred school(s)",
  fundingProgramme: "Funding programme",
  fundingCourse: "Course or programme of study",
  applicationStatus: "Current application status",
  previousNsfasDetails: "Previous NSFAS application details",
};

function ApplicationForm() {
  const formRef = useRef(null);
  const [formData, setFormData] = useState({
    applicationType: "",
    documents: [],
    declarations: [],
  });
  const [reviewVisible, setReviewVisible] = useState(false);

  const isStudyApplication = [
    "University Application",
    "TVET College Application",
    "CAO Application",
  ].includes(formData.applicationType);
  const isSchoolApplication = formData.applicationType === "School Application";
  const isFundingApplication = [
    "Bursary Application",
    "NSFAS Application",
  ].includes(formData.applicationType);
  const isNsfasApplication = formData.applicationType === "NSFAS Application";
  const hasPreferenceSection = isStudyApplication || isSchoolApplication;
  const fundingStepNumber = hasPreferenceSection ? 5 : 4;
  const documentsStepNumber =
    4 + Number(hasPreferenceSection) + Number(isFundingApplication);
  const declarationStepNumber = documentsStepNumber + 1;
  const institutionLabel = formData.applicationType === "TVET College Application"
    ? "Preferred TVET college(s)"
    : formData.applicationType === "CAO Application"
      ? "Preferred institution(s) through CAO"
      : "Preferred university / universities";

  function handleChange(event) {
    const { name, value, type, checked } = event.target;
    if (name === "documents" || name === "declarations") {
      setFormData((current) => {
        const selected = current[name] || [];
        return {
          ...current,
          [name]: checked
            ? [...selected, value]
            : selected.filter((item) => item !== value),
        };
      });
      return;
    }

    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "applicationType"
        ? {
            documents: [],
            declarations: [],
            fundingProgramme: value === "NSFAS Application" ? "NSFAS" : "",
            firstChoiceCourse: "",
            secondChoiceCourse: "",
            thirdChoiceCourse: "",
            preferredInstitutions: "",
            preferredSchools: "",
            fundingCourse: "",
            applicationStatus: "",
            previousNsfasDetails: "",
          }
        : {}),
    }));
    setReviewVisible(false);
  }

  function handleReview(event) {
    event.preventDefault();
    if (!formRef.current?.reportValidity()) return;
    setReviewVisible(true);
  }

  const reviewFields = Object.entries(fieldLabels).filter(
    ([key]) => formData[key]?.trim(),
  );
  const maskedIdentifiers = [
    ["ID number / passport number", formData.idNumber],
    ["Parent / guardian ID number", formData.guardianId],
  ].filter(([, value]) => value?.trim()).map(([label, value]) => ({
    label,
    value: `•••• ${value.slice(-4)}`,
  }));

  return (
    <main className="application-page application-form-page">
      <section className="application-form-intro">
        <div className="application-form-intro-inner">
          <span className="application-eyebrow">APPLICATION ENQUIRY</span>
          <h1>Let’s get your details <span>organised.</span></h1>
          <p>
            Complete the sections relevant to your application and review your
            information before proceeding. This form is a frontend preview only.
          </p>
          <div className="application-form-security-note">
            <span aria-hidden="true">🔒</span>
            <p><strong>Your privacy matters.</strong> Information entered here stays in this page session. It is not saved to localStorage or sent anywhere. Secure backend submission and document storage will be integrated later.</p>
          </div>
        </div>
      </section>

      <div className="application-form-layout">
        <form className="application-form" ref={formRef} onSubmit={handleReview} noValidate>
          <section className="application-form-section" aria-labelledby="form-type-heading">
            <div className="application-form-section-heading"><span>01</span><div><h2 id="form-type-heading">Application type</h2><p>Select the service you are enquiring about.</p></div></div>
            <label className="application-field application-field-full" htmlFor="applicationType">
              <span>Application type <b aria-hidden="true">*</b></span>
              <select id="applicationType" name="applicationType" value={formData.applicationType} onChange={handleChange} required>
                <option value="">Select an application type</option>
                {applicationTypes.map((type) => <option key={type} value={type}>{type}</option>)}
              </select>
            </label>
          </section>

          <section className="application-form-section" aria-labelledby="applicant-heading">
            <div className="application-form-section-heading"><span>02</span><div><h2 id="applicant-heading">Applicant information</h2><p>Enter your details as they appear on your official documents.</p></div></div>
            <div className="application-form-grid">
              <label className="application-field" htmlFor="idNumber"><span>ID number / passport number <b aria-hidden="true">*</b></span><input id="idNumber" name="idNumber" type="text" autoComplete="off" value={formData.idNumber || ""} onChange={handleChange} required /></label>
              <label className="application-field" htmlFor="fullNames"><span>Full names <b aria-hidden="true">*</b></span><input id="fullNames" name="fullNames" type="text" autoComplete="given-name" value={formData.fullNames || ""} onChange={handleChange} required /></label>
              <label className="application-field" htmlFor="surname"><span>Surname <b aria-hidden="true">*</b></span><input id="surname" name="surname" type="text" autoComplete="family-name" value={formData.surname || ""} onChange={handleChange} required /></label>
              <label className="application-field" htmlFor="email"><span>Email address <b aria-hidden="true">*</b></span><input id="email" name="email" type="email" autoComplete="email" value={formData.email || ""} onChange={handleChange} required /></label>
              <label className="application-field" htmlFor="cellphone"><span>Cellphone number <b aria-hidden="true">*</b></span><input id="cellphone" name="cellphone" type="tel" autoComplete="tel" value={formData.cellphone || ""} onChange={handleChange} required /></label>
              <label className="application-field" htmlFor="province"><span>Province <b aria-hidden="true">*</b></span><select id="province" name="province" autoComplete="address-level1" value={formData.province || ""} onChange={handleChange} required><option value="">Select province</option>{provinces.map((province) => <option key={province}>{province}</option>)}</select></label>
              <label className="application-field" htmlFor="postalCode"><span>Postal code <b aria-hidden="true">*</b></span><input id="postalCode" name="postalCode" type="text" inputMode="numeric" autoComplete="postal-code" value={formData.postalCode || ""} onChange={handleChange} required /></label>
              <label className="application-field application-field-full" htmlFor="postalAddress"><span>Postal address <b aria-hidden="true">*</b></span><textarea id="postalAddress" name="postalAddress" autoComplete="street-address" rows="2" value={formData.postalAddress || ""} onChange={handleChange} required /></label>
              <label className="application-field" htmlFor="streetName"><span>Street name <b aria-hidden="true">*</b></span><input id="streetName" name="streetName" type="text" autoComplete="address-line1" value={formData.streetName || ""} onChange={handleChange} required /></label>
              <label className="application-field" htmlFor="town"><span>Town / city <b aria-hidden="true">*</b></span><input id="town" name="town" type="text" autoComplete="address-level2" value={formData.town || ""} onChange={handleChange} required /></label>
              <label className="application-field" htmlFor="highSchool"><span>High school name <b aria-hidden="true">*</b></span><input id="highSchool" name="highSchool" type="text" value={formData.highSchool || ""} onChange={handleChange} required /></label>
              <label className="application-field" htmlFor="homeLanguage"><span>Home language <b aria-hidden="true">*</b></span><input id="homeLanguage" name="homeLanguage" type="text" value={formData.homeLanguage || ""} onChange={handleChange} required /></label>
              <label className="application-field" htmlFor="currentGrade"><span>Current grade / status <b aria-hidden="true">*</b></span><select id="currentGrade" name="currentGrade" value={formData.currentGrade || ""} onChange={handleChange} required><option value="">Select status</option><option>Grade 12</option><option>Upgrading</option><option>Completed</option></select></label>
            </div>
          </section>

          <section className="application-form-section" aria-labelledby="guardian-heading">
            <div className="application-form-section-heading"><span>03</span><div><h2 id="guardian-heading">Parent / guardian information</h2><p>Complete where applicable or required by your application.</p></div></div>
            <div className="application-form-grid">
              <label className="application-field" htmlFor="guardianName"><span>Full names and surname</span><input id="guardianName" name="guardianName" type="text" autoComplete="off" value={formData.guardianName || ""} onChange={handleChange} /></label>
              <label className="application-field" htmlFor="guardianId"><span>ID number</span><input id="guardianId" name="guardianId" type="text" autoComplete="off" value={formData.guardianId || ""} onChange={handleChange} /></label>
              <label className="application-field" htmlFor="guardianCellphone"><span>Cellphone number</span><input id="guardianCellphone" name="guardianCellphone" type="tel" value={formData.guardianCellphone || ""} onChange={handleChange} /></label>
              <label className="application-field" htmlFor="guardianEmail"><span>Email address (optional)</span><input id="guardianEmail" name="guardianEmail" type="email" value={formData.guardianEmail || ""} onChange={handleChange} /></label>
            </div>
          </section>

          {isStudyApplication && (
            <section className="application-form-section" aria-labelledby="institution-heading">
              <div className="application-form-section-heading"><span>04</span><div><h2 id="institution-heading">Institution and course information</h2><p>Share your preferences. These are not a guarantee of placement.</p></div></div>
              <div className="application-form-grid">
                <label className="application-field" htmlFor="firstChoiceCourse"><span>First choice course <b aria-hidden="true">*</b></span><input id="firstChoiceCourse" name="firstChoiceCourse" type="text" value={formData.firstChoiceCourse || ""} onChange={handleChange} required /></label>
                <label className="application-field" htmlFor="secondChoiceCourse"><span>Second choice course</span><input id="secondChoiceCourse" name="secondChoiceCourse" type="text" value={formData.secondChoiceCourse || ""} onChange={handleChange} /></label>
                <label className="application-field" htmlFor="thirdChoiceCourse"><span>Third choice course</span><input id="thirdChoiceCourse" name="thirdChoiceCourse" type="text" value={formData.thirdChoiceCourse || ""} onChange={handleChange} /></label>
                <label className="application-field application-field-full" htmlFor="preferredInstitutions"><span>{institutionLabel} <b aria-hidden="true">*</b></span><textarea id="preferredInstitutions" name="preferredInstitutions" rows="3" value={formData.preferredInstitutions || ""} onChange={handleChange} required /></label>
              </div>
            </section>
          )}

          {isSchoolApplication && (
            <section className="application-form-section" aria-labelledby="school-heading">
              <div className="application-form-section-heading"><span>04</span><div><h2 id="school-heading">School preferences</h2><p>Schools set their own admission processes and requirements.</p></div></div>
              <label className="application-field application-field-full" htmlFor="preferredSchools"><span>Preferred school(s) or area <b aria-hidden="true">*</b></span><textarea id="preferredSchools" name="preferredSchools" rows="3" value={formData.preferredSchools || ""} onChange={handleChange} required /></label>
            </section>
          )}

          {isFundingApplication && (
            <section className="application-form-section" aria-labelledby="funding-heading">
              <div className="application-form-section-heading"><span>{String(fundingStepNumber).padStart(2, "0")}</span><div><h2 id="funding-heading">Funding information</h2><p>Funding applications are assessed by the relevant organisation.</p></div></div>
              <div className="application-form-grid">
                <label className="application-field" htmlFor="fundingProgramme"><span>Funding programme <b aria-hidden="true">*</b></span><select id="fundingProgramme" name="fundingProgramme" value={formData.fundingProgramme || (isNsfasApplication ? "NSFAS" : "")} onChange={handleChange} required><option value="">Select programme</option>{isNsfasApplication ? <option value="NSFAS">NSFAS</option> : <><option>Funza Lushaka</option><option>Other Bursary</option><option>NSFAS</option></>}</select></label>
                <label className="application-field" htmlFor="fundingCourse"><span>Course or programme of study <b aria-hidden="true">*</b></span><input id="fundingCourse" name="fundingCourse" type="text" value={formData.fundingCourse || ""} onChange={handleChange} required /></label>
                <label className="application-field application-field-full" htmlFor="applicationStatus"><span>Current application status <b aria-hidden="true">*</b></span><select id="applicationStatus" name="applicationStatus" value={formData.applicationStatus || ""} onChange={handleChange} required><option value="">Select status</option><option>Not applied yet</option><option>Application in progress</option><option>Awaiting feedback</option><option>Previously applied</option><option>Other</option></select></label>
                {isNsfasApplication && <label className="application-field application-field-full" htmlFor="previousNsfasDetails"><span>Previous NSFAS application details (where applicable)</span><textarea id="previousNsfasDetails" name="previousNsfasDetails" rows="3" value={formData.previousNsfasDetails || ""} onChange={handleChange} placeholder="For example, application year and status. Do not include passwords." /></label>}
              </div>
            </section>
          )}

          <section className="application-form-section" aria-labelledby="documents-heading">
            <div className="application-form-section-heading"><span>{String(documentsStepNumber).padStart(2, "0")}</span><div><h2 id="documents-heading">Document checklist</h2><p>Tick the items you have available. This form does not upload documents.</p></div></div>
            <div className="application-checkbox-list">
              {documentOptions.map((document) => <label className="application-checkbox" key={document}><input type="checkbox" name="documents" value={document} checked={formData.documents.includes(document)} onChange={handleChange} /><span>{document}</span></label>)}
            </div>
            <p className="application-form-help">Do not email or send sensitive documents until a secure submission process is available and confirmed.</p>
          </section>

          <section className="application-form-section" aria-labelledby="declaration-heading">
            <div className="application-form-section-heading"><span>{String(declarationStepNumber).padStart(2, "0")}</span><div><h2 id="declaration-heading">Declaration</h2><p>Please confirm each statement before reviewing your enquiry.</p></div></div>
            <div className="application-checkbox-list application-declaration-list">
              {declarationOptions.map(([value, text]) => <label className="application-checkbox" key={value}><input type="checkbox" name="declarations" value={value} checked={formData.declarations.includes(value)} onChange={handleChange} required /><span>{text} <b aria-hidden="true">*</b></span></label>)}
            </div>
            <p className="application-form-help">Feedback is provided within 5–10 working days. This timeframe does not represent an institution’s or funder’s processing time.</p>
          </section>

          <div className="application-form-submit">
            <p>Review your information before proceeding. No application is submitted from this page.</p>
            <button type="submit" className="application-btn application-btn-primary">Review my information <span aria-hidden="true">→</span></button>
          </div>
        </form>

        {reviewVisible && (
          <section className="application-review-panel" id="application-review" aria-live="polite" aria-labelledby="review-heading">
            <div className="application-form-section-heading"><span>✓</span><div><h2 id="review-heading">Review your information</h2><p>Check these details before secure submission becomes available.</p></div></div>
            <dl className="application-review-list">
              <div><dt>Application type</dt><dd>{formData.applicationType}</dd></div>
              {reviewFields.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{formData[key]}</dd></div>)}
              {maskedIdentifiers.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
              {formData.documents.length > 0 && <div><dt>Documents available</dt><dd>{formData.documents.join(", ")}</dd></div>}
              <div><dt>Declaration confirmed</dt><dd>{declarationOptions.filter(([value]) => formData.declarations.includes(value)).map(([, text]) => text).join(" ")}</dd></div>
            </dl>
            <p className="application-review-privacy">For privacy, ID and passport numbers are masked in this review. Your entered information remains in this page session only.</p>
            <div className="application-review-actions">
              <button type="button" className="application-btn application-btn-secondary" onClick={() => setReviewVisible(false)}>Edit my information</button>
              <button type="button" className="application-btn application-btn-disabled" disabled>Secure submission coming soon</button>
            </div>
          </section>
        )}

        <aside className="application-form-contact">
          <h2>Need help with the form?</h2>
          <p>Contact us with a general enquiry. Do not include ID numbers or send personal documents through WhatsApp.</p>
          <a href="https://wa.me/27634328758" target="_blank" rel="noopener noreferrer">WhatsApp 063 432 8758</a>
          <a href="https://wa.me/27676916912" target="_blank" rel="noopener noreferrer">WhatsApp 067 691 6912</a>
          <a href="mailto:Ourmemoriesapplicationoffice@gmail.com">Ourmemoriesapplicationoffice@gmail.com</a>
          <a href="mailto:info@ourmemoriesedutech.co.za">info@ourmemoriesedutech.co.za</a>
          <Link to="/applications">Back to application services <span aria-hidden="true">→</span></Link>
        </aside>
      </div>
    </main>
  );
}

export default ApplicationForm;
