import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, PageHeading } from '../../components/dashboard/DashboardData';

const institutionTypes = [
    { title: 'Universities', description: 'Explore application guidance for university study.', icon: 'fa-building-columns', to: '/applications/university' },
    { title: 'Universities of Technology', description: 'Review practical and technology-focused study pathways.', icon: 'fa-microchip', to: '/applications/university' },
    { title: 'TVET Colleges', description: 'Learn about college application preparation and support.', icon: 'fa-building', to: '/applications/tvet' },
];

export default function InstitutionExplorerPage() {
    const [query, setQuery] = useState('');
    const [type, setType] = useState('all');
    const [location, setLocation] = useState('all');

    return (
        <section>
            <PageHeading
                eyebrow="EXPLORE YOUR OPTIONS"
                title="Find institutions"
                description="Start exploring university and TVET application guidance. A searchable institution and programme directory is not connected yet."
            />

            <div className="dashboard-category-grid">
                {institutionTypes.map((item) => (
                    <article className="dashboard-category-card" key={item.title}>
                        <span><i className={`fas ${item.icon}`} aria-hidden="true" /></span>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        <Link className="dashboard-official-link" to={item.to}>View application guidance <i className="fas fa-arrow-right" aria-hidden="true" /></Link>
                    </article>
                ))}
            </div>

            <div className="dashboard-section-card">
                <div className="dashboard-card-heading"><h2>Institution directory</h2><span className="dashboard-readonly-tag">Directory coming soon</span></div>
                <div className="dashboard-filter-row" aria-label="Institution search and filters">
                    <label className="dashboard-field-control dashboard-field-control--grow" htmlFor="institution-search"><i className="fas fa-search" aria-hidden="true" /><input id="institution-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search institutions or programmes" /></label>
                    <label className="dashboard-field-control" htmlFor="institution-type"><i className="fas fa-building-columns" aria-hidden="true" /><select id="institution-type" value={type} onChange={(event) => setType(event.target.value)}><option value="all">All institution types</option><option value="university">University</option><option value="technology">University of Technology</option><option value="tvet">TVET College</option></select></label>
                    <label className="dashboard-field-control" htmlFor="institution-location"><i className="fas fa-location-dot" aria-hidden="true" /><select id="institution-location" value={location} onChange={(event) => setLocation(event.target.value)}><option value="all">All locations</option><option value="eastern-cape">Eastern Cape</option><option value="free-state">Free State</option><option value="gauteng">Gauteng</option><option value="kwazulu-natal">KwaZulu-Natal</option><option value="limpopo">Limpopo</option><option value="mpumalanga">Mpumalanga</option><option value="north-west">North West</option><option value="northern-cape">Northern Cape</option><option value="western-cape">Western Cape</option></select></label>
                </div>
                <EmptyState icon="fa-map-location-dot" title="The institution catalogue is not connected yet" description={query || type !== 'all' || location !== 'all' ? 'Filters will show matching institutions when the directory is available.' : 'No institution or programme listings are available in this account yet. Use the application guidance links above to plan your next step.'} action={{ to: '/applications', label: 'Browse application guidance' }} className="dashboard-empty-state--compact" />
            </div>
        </section>
    );
}
