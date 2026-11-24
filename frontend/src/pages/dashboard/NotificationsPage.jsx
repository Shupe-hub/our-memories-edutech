import { EmptyState, PageHeading } from '../../components/dashboard/DashboardData';

export default function NotificationsPage() {
    return (
        <section>
            <PageHeading
                eyebrow="ACCOUNT UPDATES"
                title="Notifications"
                description="Important account and education journey updates can be collected here when notification services are connected."
            />
            <div className="dashboard-section-card dashboard-page-empty-card">
                <EmptyState icon="fa-bell" title="You are all caught up" description="There are no notifications for your account. Application and deadline alerts are not available until those services are connected." />
            </div>
        </section>
    );
}
