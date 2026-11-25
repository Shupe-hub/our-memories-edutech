import { PageHeading } from '../../components/user/DashboardData';
import ApplicationDocumentsPanel from '../../components/shared/ApplicationDocumentsPanel';
import '../../styles/applications/ApplicationEnquiryForm.css';

export default function DocumentsPage() {
    return <section className="student-documents-page">
        <PageHeading eyebrow="YOUR STUDY FILES" title="My documents" description="Securely store your study documents and attach them to applications when needed." />
        <ApplicationDocumentsPanel standalone />
    </section>;
}