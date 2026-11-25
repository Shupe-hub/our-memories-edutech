import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useApplicationDraft } from "../../hooks/useApplicationDraft";
import { apiRequest } from "../../services/apiRequest";
import InstitutionMultiSelect from './InstitutionMultiSelect';
import "../../styles/applications/ApplicationEnquiryForm.css";

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
  ["feedbackFeesConfirmed", "I understand that feedback is provided within 5–10 working days and that institution and funding organisation fees are separate."],
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

function ApplicationForm({ applicationId = null, initialData = null, applicationStatus = null }) {
  const formRef = useRef(null);
  const submissionKeyRef = useRef(null);
  const { user } = useAuth();
  const { draft, saveDraft, clearDraft } = useApplicationDraft();
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(() => initialData || draft || { applicationType: "", documents: [], declarations: [], selectedInstitutionIds: [] });
  const [reviewVisible, setReviewVisible] = useState(() => Boolean(location.state?.resumeApplication && draft));
  const [draftUnavailable] = useState(() => Boolean(location.state?.resumeApplication && !draft));
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedReference, setSubmittedReference] = useState('');

  useEffect(() => {
    if (!location.state?.resumeApplication) return;
    navigate(location.pathname, { replace: true, state: null });
  }, [draft, location.pathname, location.state, navigate]);

  useEffect(() => {
    const incoming = location.state?.selectedInstitutionIds;
    if (!incoming?.length) return;
    setFormData((current) => {
      const updated = { ...current, selectedInstitutionIds: [...new Set([...(current.selectedInstitutionIds || []), ...incoming])].slice(0, 20) };
      saveDraft(updated);
      return updated;
    });
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate, saveDraft]);

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
        const updated = {
          ...current,
          [name]: checked
            ? [...selected, value]
            : selected.filter((item) => item !== value),
        };
        saveDraft(updated);
        return updated;
      });
      setReviewVisible(false);
      return;
    }

    setFormData((current) => {
      const updated = {
        ...current,
        [name]: type === "checkbox" ? checked : value,
        ...(name === "applicationType"
        ? {
            documents: [],
            declarations: [],
            selectedInstitutionIds: [],
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
      };
      saveDraft(updated);
      return updated;
    });
    setReviewVisible(false);
  }

  function handleReview(event) {
    event.preventDefault();
    if (!formRef.current?.reportValidity()) return;
    if (['University Application', 'CAO Application'].includes(formData.applicationType) && !formData.selectedInstitutionIds?.length) {
      setSubmitError('Select at least one university before reviewing your application.');
      return;
    }
    setSubmitError('');
    setReviewVisible(true);
  }

  async function handleFinalSubmit() {
    setSubmitError('');
    if (!user) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    if (user.role !== 'STUDENT') {
      setSubmitError('Application enquiries can be submitted from a student account.');
      return;
    }
    setIsSubmitting(true);
    if (!submissionKeyRef.current) submissionKeyRef.current = crypto.randomUUID();
    const payload = {
      ...formData,
      declarations: undefined,
      informationConfirmed: formData.declarations.includes('informationConfirmed'),
      feesConfirmed: formData.declarations.includes('feesConfirmed'),
      feedbackFeesConfirmed: formData.declarations.includes('feedbackFeesConfirmed'),
      submissionKey: submissionKeyRef.current,
    };
    try {
      const result = applicationId
        ? await apiRequest(`/applications/${applicationId}`, { method: 'PATCH', body: JSON.stringify(payload) })
        : await apiRequest('/applications', { method: 'POST', body: JSON.stringify(payload) });
      clearDraft();
      setSubmittedReference(result.enquiry.referenceNumber);
      setReviewVisible(false);
      navigate(`/account/applications/${result.enquiry.id || applicationId}`, { replace: true, state: { [applicationId ? 'edited' : 'submitted']: true } });
    } catch (error) {
      setSubmitError(error.message || 'Your enquiry could not be submitted. Please try again.');
    } finally { setIsSubmitting(false); }
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
            {applicationId ? 'Review and update your application. Your reference number and workflow status will be preserved.' : 'Complete the sections relevant to your application, review your details, and submit your enquiry securely from your student account.'}
          </p>
          <div className="application-form-security-note">
            <span aria-hidden="true">🔒</span>
            <p><strong>Your privacy matters.</strong> Your draft stays in this page session and is not saved to browser storage or sent before you sign in and submit. Refreshing or closing the browser may clear it. Secure document upload will be introduced separately.</p>
          </div>
        </div>
      </section>

      {draftUnavailable && <p className="application-form-help application-draft-notice" role="status">Your previous draft was not available after sign-in. Please complete the form again; we did not save it in browser storage.</p>}
      {applicationId && applicationStatus === 'IN_PROGRESS' && <p className="application-form-help application-draft-notice" role="status">An administrator may already be processing this application. Your changes will be recorded in its history.</p>}
      {submitError && <p className="application-form-help application-submit-error" role="alert">{submitError}</p>}
      {submittedReference && <section className="application-review-panel application-submit-success" role="status"><h2>Enquiry submitted</h2><p>Your reference number is <strong>{submittedReference}</strong>. You can follow updates in your student dashboard.</p><Link className="application-btn application-btn-primary" to="/account/applications">View my enquiries</Link></section>}

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
                {formData.applicationType === 'TVET College Application' ? <label className="application-field application-field-full" htmlFor="preferredInstitutions"><span>{institutionLabel} <b aria-hidden="true">*</b></span><textarea id="preferredInstitutions" name="preferredInstitutions" rows="3" value={formData.preferredInstitutions || ""} onChange={handleChange} required /></label> : <div className="application-field application-field-full"><InstitutionMultiSelect value={formData.selectedInstitutionIds || []} onChange={(selectedInstitutionIds, names) => { const updated = { ...formData, selectedInstitutionIds, preferredInstitutions: names.join(', ') }; setFormData(updated); saveDraft(updated); setReviewVisible(false); }} /><input type="hidden" name="preferredInstitutions" value={formData.preferredInstitutions || ''} /></div>}
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
            <p>{applicationId ? 'Review your changes before saving them to this application.' : 'Review your answers. Your enquiry is sent only after you sign in and select Submit Application Enquiry.'}</p>
            <button type="submit" className="application-btn application-btn-primary">Review my information <span aria-hidden="true">→</span></button>
          </div>
        </form>

        {reviewVisible && (
          <section className="application-review-panel" id="application-review" aria-live="polite" aria-labelledby="review-heading">
            <div className="application-form-section-heading"><span>✓</span><div><h2 id="review-heading">Review your information</h2><p>Check your details before final submission.</p></div></div>
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
              <button type="button" className="application-btn application-btn-primary" onClick={handleFinalSubmit} disabled={isSubmitting || Boolean(submittedReference)}>{isSubmitting ? (applicationId ? 'Saving changes...' : 'Submitting enquiry...') : applicationId ? 'Save Application Changes' : 'Submit Application Enquiry'}</button>
            </div>
          </section>
        )}

        <aside className="application-form-contact">
          <h2>Need help with the form?</h2>
          <p>Contact us with a general enquiry. Do not include ID numbers or send personal documents through WhatsApp.</p>
          <a href="https://wa.me/27634328758" target="_blank" rel="noopener noreferrer">WhatsApp 063 432 8758</a>
          <a href="https://wa.me/27680513619" target="_blank" rel="noopener noreferrer">WhatsApp 068 051 3619</a>
          <a href="mailto:Ourmemoriesapplicationoffice@gmail.com">Ourmemoriesapplicationoffice@gmail.com</a>
          <a href="mailto:info@ourmemoriesedutech.co.za">info@ourmemoriesedutech.co.za</a>
          <Link to="/applications">Back to application services <span aria-hidden="true">→</span></Link>
        </aside>
      </div>
    </main>
  );
}

export default ApplicationForm;
