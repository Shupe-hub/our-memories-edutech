import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, PageHeading } from '../../components/user/DashboardData';
import { apiRequest } from '../../services/apiRequest';

export default function NotificationsPage() {
    const [items, setItems] = useState([]);
    const [error, setError] = useState('');
    useEffect(() => { apiRequest('/education/notifications').then((result) => setItems(result.items || [])).catch((e) => setError(e.message)); }, []);
    const markRead = async (id) => {
        try { await apiRequest(`/education/notifications/${id}/read`, { method: 'PATCH', body: JSON.stringify({}) }); setItems((current) => current.map((item) => item.id === id ? { ...item, readAt: new Date().toISOString() } : item)); }
        catch (e) { setError(e.message); }
    };
    return <section><PageHeading eyebrow="ACCOUNT UPDATES" title="Notifications" description="Application status and document request updates from administrators appear here." />
        {error && <p className="dashboard-info-banner" role="alert">{error}</p>}
        {items.length ? <div className="dashboard-section-card dashboard-enquiry-list">{items.map((item) => <article className="dashboard-enquiry-card" key={item.id}><p><strong>{item.title}</strong> {item.readAt ? '· Read' : <span className="application-status status-submitted">New</span>}</p><p>{item.message}</p><time>{new Date(item.createdAt).toLocaleString()}</time><div className="application-document-actions">{item.entityId && item.type.includes('APPLICATION') && <Link className="dashboard-secondary-button" to="/account/university-applications">View application</Link>}{!item.readAt && <button className="dashboard-secondary-button" type="button" onClick={() => markRead(item.id)}>Mark as read</button>}</div></article>)}</div> : <div className="dashboard-section-card dashboard-page-empty-card"><EmptyState icon="fa-bell" title="You are all caught up" description="There are no notifications for your account." /></div>}
    </section>;
}
