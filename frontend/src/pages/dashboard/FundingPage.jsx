import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmptyState, PageHeading } from '../../components/dashboard/DashboardData';

const fundingCategories = [
    { title: 'NSFAS', icon: 'fa-landmark', description: 'Visit the official NSFAS site for current application information and requirements.', external: 'https://www.nsfas.org.za/' },
    { title: 'University bursaries', icon: 'fa-building-columns', description: 'Bursary terms and application steps are set by each institution. Check directly with your chosen university.' },
    { title: 'Private bursaries', icon: 'fa-hand-holding-heart', description: 'No verified private bursary listings are connected to this portal yet.' },
    { title: 'Government funding', icon: 'fa-flag', description: 'No government funding opportunity feed is connected to this portal yet.' },
];

export default function FundingPage() {
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('all');
    const visibleCategories = fundingCategories.filter((item) => {
        const matchesQuery = `${item.title} ${item.description}`.toLowerCase().includes(query.trim().toLowerCase());
        const matchesCategory = category === 'all' || item.title === category;
        return matchesQuery && matchesCategory;
    });

    return (
        <section>
            <PageHeading
                eyebrow="FUNDING INFORMATION"
                title="Bursaries & funding"
                description="Find starting points for student funding research. This portal does not currently list live opportunities or deadlines."
                actions={<Link to="/applications/bursaries" className="dashboard-secondary-button"><i className="fas fa-circle-info" aria-hidden="true" />Bursary application guidance</Link>}
            />

            <div className="dashboard-info-banner">
                <i className="fas fa-triangle-exclamation" aria-hidden="true" />
                <p>Funding criteria, availability and closing dates change. Always confirm current details with the official funder. No opportunities or deadlines are invented or shown here.</p>
            </div>

            <div className="dashboard-filter-row dashboard-funding-filters" aria-label="Funding search and filters">
                <label className="dashboard-field-control dashboard-field-control--grow" htmlFor="funding-search"><i className="fas fa-search" aria-hidden="true" /><input id="funding-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search funding categories" /></label>
                <label className="dashboard-field-control" htmlFor="funding-category"><i className="fas fa-filter" aria-hidden="true" /><select id="funding-category" value={category} onChange={(event) => setCategory(event.target.value)}><option value="all">All categories</option>{fundingCategories.map((item) => <option key={item.title} value={item.title}>{item.title}</option>)}</select></label>
            </div>

            <div className="dashboard-category-grid dashboard-funding-grid">
                {visibleCategories.map((item) => (
                    <article className="dashboard-category-card" key={item.title}>
                        <span><i className={`fas ${item.icon}`} aria-hidden="true" /></span>
                        <h2>{item.title}</h2>
                        <p>{item.description}</p>
                        {item.external ? <a className="dashboard-official-link" href={item.external} target="_blank" rel="noopener noreferrer">Visit official NSFAS site <i className="fas fa-arrow-up-right-from-square" aria-hidden="true" /></a> : <Link className="dashboard-official-link" to="/applications/bursaries">View our guidance <i className="fas fa-arrow-right" aria-hidden="true" /></Link>}
                    </article>
                ))}
            </div>
            {!visibleCategories.length && <div className="dashboard-section-card"><EmptyState icon="fa-magnifying-glass" title="No funding categories match" description="Try another search or select all categories." className="dashboard-empty-state--compact" /></div>}
        </section>
    );
}
