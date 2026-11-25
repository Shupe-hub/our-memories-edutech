import { PageHeading, SectionCard } from '../../components/user/DashboardData';

export default function SettingsPage() {
    return (
        <section>
            <PageHeading
                eyebrow="ACCOUNT PREFERENCES"
                title="Settings"
                description="Review how your student account currently works. Preference editing is not connected yet."
            />
            <SectionCard title="Sign-in and account">
                <div className="dashboard-settings-list">
                    <div className="dashboard-settings-row"><span><strong>Session security</strong><small>Authentication uses a server-verified JWT in an HttpOnly cookie.</small></span><span className="dashboard-readonly-tag">Enabled</span></div>
                    <div className="dashboard-settings-row"><span><strong>Profile preferences</strong><small>Notification and study preferences are not stored by the account service.</small></span><span className="dashboard-readonly-tag">Unavailable</span></div>
                    <div className="dashboard-settings-row"><span><strong>Account changes</strong><small>Email and password changes are not available in this portal yet.</small></span><span className="dashboard-readonly-tag">Unavailable</span></div>
                </div>
            </SectionCard>
        </section>
    );
}
