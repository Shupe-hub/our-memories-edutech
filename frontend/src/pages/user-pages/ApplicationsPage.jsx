import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, PageHeading } from '../../components/user/DashboardData';
import { apiRequest } from '../../services/apiRequest';
import '../../styles/applications/ApplicationEnquiryForm.css';

const statusLabels = { SUBMITTED: 'New enquiry', UNDER_REVIEW: 'Under review', AWAITING_DOCUMENTS: 'Awaiting documents', IN_PROGRESS: 'In progress', COMPLETED: 'Completed', REJECTED: 'Rejected', CANCELLED: 'Cancelled' };
const typeLabels = { UNIVERSITY: 'University', TVET: 'TVET college', SCHOOL: 'School', BURSARY: 'Bursary', NSFAS: 'NSFAS', CAO: 'CAO' };
const date = (value) => new Date(value).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });

export default function ApplicationsPage() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('all');
    useEffect(() => { apiRequest('/applications/my').then((result) => setItems(result.items || [])).catch((e) => setError(e.message)).finally(() => setLoading(false)); }, []);
    const filtered = useMemo(() => items.filter((item) => (status === 'all' || item.status === status) && `${item.referenceNumber} ${typeLabels[item.applicationType] || item.applicationType}`.toLowerCase().includes(query.toLowerCase())), [items, query, status]);

    return (
        <section>
            <PageHeading
                eyebrow="APPLICATION TRACKING"
                title="My applications"
                description="Track your application enquiries, read feedback and follow any requests for additional documents."
                actions={<Link to="/account/applications/new" className="dashboard-primary-button"><i className="fas fa-file-circle-plus" aria-hidden="true" />Submit New Application</Link>}
            />

            <div className="dashboard-filter-row" aria-label="Application search and filters">
                <label className="dashboard-field-control dashboard-field-control--grow" htmlFor="application-search">
                    <i className="fas fa-search" aria-hidden="true" />
                    <input id="application-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search institution or programme" />
                </label>
                <label className="dashboard-field-control" htmlFor="application-status-filter">
                    <i className="fas fa-sliders" aria-hidden="true" />
                    <select id="application-status-filter" value={status} onChange={(event) => setStatus(event.target.value)}>
                        <option value="all">All statuses</option>
                        <option value="SUBMITTED">New enquiry</option><option value="UNDER_REVIEW">Under review</option><option value="AWAITING_DOCUMENTS">Awaiting documents</option><option value="IN_PROGRESS">In progress</option><option value="COMPLETED">Completed</option><option value="REJECTED">Rejected</option><option value="CANCELLED">Cancelled</option>
                    </select>
                </label>
            </div>

            {error && <p className="dashboard-info-banner" role="alert">{error}</p>}
            {loading ? <div className="dashboard-section-card">Loading your enquiries…</div> : filtered.length ? <div className="dashboard-section-card dashboard-enquiry-list">{filtered.map((item) => <article className="dashboard-enquiry-card" key={item.id}><div><span className={`application-status status-${item.status.toLowerCase()}`}>{statusLabels[item.status]}</span><h2>{typeLabels[item.applicationType]} application enquiry</h2><p>Reference <strong>{item.referenceNumber}</strong></p></div><dl><div><dt>Submitted</dt><dd>{date(item.submittedAt)}</dd></div><div><dt>Last updated</dt><dd>{date(item.updatedAt)}</dd></div></dl>{item.adminFeedback && <p className="dashboard-enquiry-feedback"><strong>Latest feedback:</strong> {item.adminFeedback}</p>}{item.requestedDocuments?.length > 0 && <p className="dashboard-enquiry-feedback"><strong>Additional documents requested:</strong> {item.requestedDocuments.join(', ')}</p>}<Link className="dashboard-primary-button" to={`/account/applications/${item.id}`}>View details</Link></article>)}</div> : <div className="dashboard-section-card dashboard-page-empty-card">
                <EmptyState
                    icon="fa-folder-open"
                    title={items.length ? 'No enquiries match these filters' : 'No application enquiries yet'}
                    description={items.length ? 'Try a different search or status.' : 'Submit an enquiry to receive a reference number and track updates here.'}
                    action={{ to: '/account/applications/new', label: 'Submit New Application' }}
                />
            </div>}
        </section>
    );
}
