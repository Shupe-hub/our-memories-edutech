import { Link } from 'react-router-dom';

export function EmptyState({ icon = 'fa-inbox', title, description, action, className = '' }) {
    return (
        <div className={`dashboard-empty-state ${className}`}>
            <span className="dashboard-empty-icon"><i className={`fas ${icon}`} aria-hidden="true" /></span>
            <h3>{title}</h3>
            <p>{description}</p>
            {action && <Link className="dashboard-secondary-button" to={action.to}>{action.label}</Link>}
        </div>
    );
}

export function PageHeading({ eyebrow, title, description, actions }) {
    return (
        <div className="dashboard-page-heading">
            <div>
                {eyebrow && <p className="dashboard-eyebrow">{eyebrow}</p>}
                <h1>{title}</h1>
                {description && <p className="dashboard-page-description">{description}</p>}
            </div>
            {actions && <div className="dashboard-page-actions">{actions}</div>}
        </div>
    );
}

export function StatCard({ icon, label, value = 0, detail, tone = 'blue' }) {
    return (
        <article className={`dashboard-stat-card dashboard-stat-card--${tone}`}>
            <div className="dashboard-stat-top">
                <span className="dashboard-stat-icon"><i className={`fas ${icon}`} aria-hidden="true" /></span>
                <span className="dashboard-stat-label">{label}</span>
            </div>
            <strong className="dashboard-stat-value">{value}</strong>
            <span className="dashboard-stat-detail">{detail}</span>
        </article>
    );
}

export function SectionCard({ title, action, children, className = '' }) {
    return (
        <section className={`dashboard-section-card ${className}`}>
            <div className="dashboard-card-heading">
                <h2>{title}</h2>
                {action && <Link to={action.to}>{action.label}<i className="fas fa-arrow-right" aria-hidden="true" /></Link>}
            </div>
            {children}
        </section>
    );
}
