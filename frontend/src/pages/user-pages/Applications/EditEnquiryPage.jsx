import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import ApplicationEnquiryForm from '../../../components/shared/ApplicationEnquiryForm';
import { apiRequest } from '../../../services/apiRequest';

const typeLabels = { UNIVERSITY: 'University Application', TVET: 'TVET College Application', SCHOOL: 'School Application', BURSARY: 'Bursary Application', NSFAS: 'NSFAS Application', CAO: 'CAO Application' };

export default function EditEnquiryPage() {
  const { id } = useParams();
  const [enquiry, setEnquiry] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { apiRequest(`/applications/${id}/edit`).then((result) => setEnquiry(result.enquiry)).catch((requestError) => setError(requestError.message)); }, [id]);
  if (error) return <section className="dashboard-section-card"><p role="alert">{error}</p><Link to={`/account/applications/${id}`}>Back to application details</Link></section>;
  if (!enquiry) return <p role="status">Loading application for editing…</p>;
  const extra = enquiry.additionalInformation && typeof enquiry.additionalInformation === 'object' ? enquiry.additionalInformation : {};
  const selectedInstitutionIds = enquiry.selectedInstitutions.map((entry) => entry.institutionId);
  const selectedNames = enquiry.selectedInstitutions.map((entry) => entry.institution.name);
  const initialData = {
    ...enquiry,
    ...extra,
    applicationType: typeLabels[enquiry.applicationType],
    selectedInstitutionIds,
    preferredInstitutions: selectedNames.join(', ') || extra.preferredInstitutions || '',
    documents: enquiry.documents || [],
    declarations: ['informationConfirmed', 'feesConfirmed', 'feedbackFeesConfirmed'].filter((key) => enquiry[key]),
  };
  return <ApplicationEnquiryForm applicationId={id} initialData={initialData} applicationStatus={enquiry.status} />;
}
