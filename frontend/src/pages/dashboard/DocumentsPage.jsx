import { EmptyState, PageHeading } from '../../components/dashboard/DashboardData';

const documentCategories = [
    { title: 'Identity documents', description: 'Identity document or passport', icon: 'fa-id-card' },
    { title: 'Academic results', description: 'School reports and results', icon: 'fa-graduation-cap' },
    { title: 'Certificates', description: 'Certificates and qualifications', icon: 'fa-certificate' },
    { title: 'Proof of residence', description: 'A recent proof of address', icon: 'fa-house' },
    { title: 'Other supporting documents', description: 'Additional items requested by a provider', icon: 'fa-paperclip' },
];

export default function DocumentsPage() {
    return (
        <section>
            <PageHeading
                eyebrow="YOUR STUDY FILES"
                title="My documents"
                description="A future home for the files you may need when preparing education applications."
                actions={<button type="button" className="dashboard-primary-button" disabled title="Document uploads are not available yet"><i className="fas fa-lock" aria-hidden="true" />Upload unavailable</button>}
            />

            <div className="dashboard-info-banner">
                <i className="fas fa-circle-info" aria-hidden="true" />
                <p>File upload and secure document storage are not supported by the current backend. No files are stored in this portal. The categories below are a general reference, not a personalized checklist.</p>
            </div>

            <div className="dashboard-section-card dashboard-document-card">
                <div className="dashboard-card-heading"><h2>Document categories</h2><span className="dashboard-readonly-tag">0 files stored</span></div>
                <div className="dashboard-document-list">
                    {documentCategories.map((item) => <div className="dashboard-document-row" key={item.title}><span><i className={`fas ${item.icon}`} aria-hidden="true" /></span><div><strong>{item.title}</strong><small>{item.description}</small></div><span className="dashboard-document-empty">No files</span></div>)}
                </div>
                <EmptyState icon="fa-folder-open" title="Your document space is empty" description="When secure file storage is available, your uploaded documents will appear here." className="dashboard-empty-state--compact" />
            </div>
        </section>
    );
}
