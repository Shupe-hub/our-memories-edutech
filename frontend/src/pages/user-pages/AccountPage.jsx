import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { EmptyState, SectionCard, StatCard } from '../../components/user/DashboardData';

const statusRows = ['Submitted', 'Under review', 'Accepted', 'Awaiting documents'];

export default function AccountPage() {
    const { user } = useAuth();
    const firstName = user?.name || 'Student';

    return (
        <div className="dashboard-overview">
            <section className="dashboard-welcome-banner" aria-labelledby="dashboard-welcome-title">
                <div className="dashboard-welcome-copy">
                    <p className="dashboard-eyebrow">YOUR EDUCATION JOURNEY</p>
                    <h2 id="dashboard-welcome-title">Welcome back, <span>{firstName}</span></h2>
                    <p>Use your student space to explore education options, find funding information and request support with your next steps.</p>
                    <div className="dashboard-welcome-actions">
                        <Link to="/account/explore" className="dashboard-primary-button"><i className="fas fa-compass" aria-hidden="true" />Explore study options</Link>
                        <Link to="/account/applications/new" className="dashboard-secondary-button"><i className="fas fa-file-circle-plus" aria-hidden="true" />Submit New Application</Link>
                    </div>
                </div>
                <div className="dashboard-welcome-mark" aria-hidden="true"><img src="/our-memories-edutech-logo.png" alt="" /></div>
            </section>

            <section className="dashboard-stats-grid" aria-label="Application overview">
                <StatCard icon="fa-file-lines" label="Total applications" value={0} detail="No application records connected" />
                <StatCard icon="fa-circle-check" label="Accepted" value={0} detail="No status updates available" tone="green" />
                <StatCard icon="fa-clock" label="Pending" value={0} detail="No status updates available" tone="gold" />
                <StatCard icon="fa-award" label="Bursary applications" value={0} detail="No application records connected" tone="rose" />
            </section>

            <div className="dashboard-overview-grid">
                <SectionCard title="Recent applications" action={{ to: '/account/applications', label: 'View all' }}>
                    <EmptyState icon="fa-file-circle-plus" title="No application enquiries yet" description="Your submitted enquiries and their updates are available in My Applications." action={{ to: '/account/applications/new', label: 'Submit New Application' }} className="dashboard-empty-state--compact" />
                </SectionCard>

                <SectionCard title="Application status">
                    <div className="dashboard-status-breakdown" aria-label="Application status counts">
                        {statusRows.map((status) => <div className="dashboard-status-row" key={status}><span className="dashboard-status-dot" /><span>{status}</span><strong>0</strong></div>)}
                    </div>
                    <p className="dashboard-status-note">Status counts will update when application tracking is connected.</p>
                </SectionCard>
            </div>

            <div className="dashboard-overview-lower">
                <SectionCard title="Upcoming deadlines">
                    <EmptyState icon="fa-calendar-days" title="No deadlines to show" description="There are no deadline records linked to your account." className="dashboard-empty-state--compact" />
                </SectionCard>

                <SectionCard title="Helpful next steps">
                    <div className="dashboard-recommended-list">
                        <Link to="/applications/university" className="dashboard-recommended-link"><i className="fas fa-building-columns" /><span><strong>Prepare for applications</strong><small>Review university application guidance</small></span><i className="fas fa-arrow-right" /></Link>
                        <Link to="/account/funding" className="dashboard-recommended-link"><i className="fas fa-award" /><span><strong>Explore funding information</strong><small>Find official funding resources</small></span><i className="fas fa-arrow-right" /></Link>
                        <Link to="/account/documents" className="dashboard-recommended-link"><i className="fas fa-folder-open" /><span><strong>Get document-ready</strong><small>Review common document categories</small></span><i className="fas fa-arrow-right" /></Link>
                    </div>
                </SectionCard>

                <SectionCard title="Updates">
                    <EmptyState icon="fa-bullhorn" title="No announcements yet" description="Student updates will be shown here when available." className="dashboard-empty-state--compact" />
                </SectionCard>
            </div>
        </div>
    );
}
