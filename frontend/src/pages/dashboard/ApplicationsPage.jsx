import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, PageHeading } from '../../components/dashboard/DashboardData';

export default function ApplicationsPage() {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('all');

    return (
        <section>
            <PageHeading
                eyebrow="APPLICATION TRACKING"
                title="My applications"
                description="Keep university and college application information in one place. Tracking will appear here once your application records are connected."
                actions={<Link to="/applications/apply" className="dashboard-primary-button"><i className="fas fa-comments" aria-hidden="true" />Request application assistance</Link>}
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
                        <option value="draft">Draft</option>
                        <option value="submitted">Submitted</option>
                        <option value="review">Under review</option>
                        <option value="accepted">Accepted</option>
                        <option value="rejected">Rejected</option>
                        <option value="documents">Awaiting documents</option>
                    </select>
                </label>
            </div>

            <div className="dashboard-info-banner">
                <i className="fas fa-circle-info" aria-hidden="true" />
                <p>Search and status filters are ready for application records. The current backend does not save or track applications, so no institution, programme, reference or status is displayed here.</p>
            </div>

            <div className="dashboard-section-card dashboard-page-empty-card">
                <EmptyState
                    icon="fa-folder-open"
                    title="No tracked applications yet"
                    description={query || status !== 'all' ? 'There are no application records to match these filters yet.' : 'When application tracking is available, your university and TVET college applications will be listed here.'}
                    action={{ to: '/applications/apply', label: 'Request application assistance' }}
                />
            </div>
        </section>
    );
}
