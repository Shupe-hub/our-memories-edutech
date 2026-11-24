import { useAuth } from '../../auth/useAuth';
import { PageHeading, SectionCard } from '../../components/dashboard/DashboardData';

function formatDate(value) {
    if (!value) return 'Not available';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Not available' : new Intl.DateTimeFormat('en-ZA', { dateStyle: 'long' }).format(date);
}

export default function ProfilePage() {
    const { user } = useAuth();
    const name = [user?.name, user?.surname].filter(Boolean).join(' ') || 'Student';
    const initials = `${user?.name?.[0] || ''}${user?.surname?.[0] || ''}`.toUpperCase() || 'ST';

    return (
        <section>
            <PageHeading
                eyebrow="YOUR ACCOUNT"
                title="My profile"
                description="These details come from your authenticated account. Profile editing is not available yet."
            />
            <div className="dashboard-profile-grid">
                <SectionCard title="Student account" className="dashboard-profile-card">
                    <span className="student-avatar">{initials}</span>
                    <h2>{name}</h2>
                    <p>{user?.email || 'Email not available'}</p>
                    <span className="dashboard-profile-tag"><i className="fas fa-shield-check" aria-hidden="true" />Authenticated account</span>
                </SectionCard>
                <SectionCard title="Account details">
                    <dl className="dashboard-profile-detail-list">
                        <div><dt>First name</dt><dd>{user?.name || 'Not available'}</dd></div>
                        <div><dt>Surname</dt><dd>{user?.surname || 'Not available'}</dd></div>
                        <div><dt>Email address</dt><dd>{user?.email || 'Not available'}</dd></div>
                        <div><dt>Account created</dt><dd>{formatDate(user?.createdAt)}</dd></div>
                    </dl>
                    <p className="dashboard-readonly-note"><i className="fas fa-lock" aria-hidden="true" /> Profile changes are not supported by the current account service.</p>
                </SectionCard>
            </div>
        </section>
    );
}
