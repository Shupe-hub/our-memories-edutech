import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageHeading } from '../../components/user/DashboardData';
import { apiRequest } from '../../services/apiRequest';

const editableStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'IN_PROGRESS'];

export default function InstitutionDirectoryPage() {
  const navigate = useNavigate();
  const [institutions, setInstitutions] = useState([]);
  const [applications, setApplications] = useState([]);
  const [query, setQuery] = useState('');
  const [type, setType] = useState('all');
  const [province, setProvince] = useState('all');
  const [selectedIds, setSelectedIds] = useState([]);
  const [targetApplication, setTargetApplication] = useState('');
  const [expandedId, setExpandedId] = useState('');
  const [programmesByInstitution, setProgrammesByInstitution] = useState({});
  const [error, setError] = useState('');
  useEffect(() => {
    Promise.all([apiRequest('/institutions'), apiRequest('/applications/my')]).then(([directory, records]) => {
      setInstitutions(directory.items || []);
      setApplications(records.items || []);
    }).catch((requestError) => setError(requestError.message));
  }, []);
  const provinces = useMemo(() => [...new Set(institutions.filter((item) => item.locationVerified && item.province).map((item) => item.province))].sort(), [institutions]);
  const visible = useMemo(() => institutions.filter((item) => !item.isLegacy && (type === 'all' || item.type === type) && (province === 'all' || item.province === province) && `${item.name} ${item.officialName} ${(item.aliases || []).join(' ')}`.toLowerCase().includes(query.trim().toLowerCase())), [institutions, province, query, type]);
  const selectableApplications = applications.filter((item) => editableStatuses.includes(item.status));
  const toggle = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((value) => value !== id) : current.length >= 20 ? current : [...current, id]);
  const addToNew = () => { if (selectedIds.length) navigate('/account/applications/new', { state: { selectedInstitutionIds: selectedIds } }); };
  const addToExisting = () => { if (selectedIds.length && targetApplication) navigate(`/account/applications/${targetApplication}/edit`, { state: { selectedInstitutionIds: selectedIds } }); };

  return <section className="institution-directory-page"><PageHeading eyebrow="EXPLORE YOUR OPTIONS" title="Find institutions" description="Search verified South African public university listings. Select one or more institutions to add them to a new or existing application." />
    {error && <p role="alert" className="dashboard-info-banner">{error}</p>}
    <div className="dashboard-filter-row" aria-label="Institution directory filters"><label className="dashboard-field-control dashboard-field-control--grow" htmlFor="institution-search"><i className="fas fa-search" aria-hidden="true"/><input id="institution-search" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search institution name or alias"/></label><label className="dashboard-field-control" htmlFor="institution-type"><i className="fas fa-building-columns" aria-hidden="true"/><select id="institution-type" value={type} onChange={(event) => setType(event.target.value)}><option value="all">All universities</option><option value="UNIVERSITY">Universities</option><option value="UNIVERSITY_OF_TECHNOLOGY">Universities of technology</option></select></label><label className="dashboard-field-control" htmlFor="institution-province"><i className="fas fa-location-dot" aria-hidden="true"/><select id="institution-province" value={province} onChange={(event) => setProvince(event.target.value)}><option value="all">All provinces</option>{provinces.map((item) => <option key={item}>{item}</option>)}</select></label></div>
    <div className="institution-directory-selection dashboard-section-card"><strong>{selectedIds.length} institution{selectedIds.length === 1 ? '' : 's'} selected</strong><button type="button" className="dashboard-primary-button" onClick={addToNew} disabled={!selectedIds.length}>Add selected to a new application</button><label>Select an existing application<select value={targetApplication} onChange={(event) => setTargetApplication(event.target.value)}><option value="">Choose an editable application</option>{selectableApplications.map((item) => <option key={item.id} value={item.id}>{item.referenceNumber} · {item.status.replaceAll('_', ' ')}</option>)}</select></label><button type="button" className="dashboard-secondary-button" onClick={addToExisting} disabled={!selectedIds.length || !targetApplication}>Add selected to this application</button><p>Selections are added to the form for your review. They are saved only after you review and submit the form.</p></div>
    {!institutions.length && !error && <p role="status">Loading institutions…</p>}
    <div className="institution-directory-grid">{visible.map((item) => <article className="dashboard-category-card institution-directory-card" key={item.id}><div className="institution-card-top"><span><i className={`fas ${item.type === 'UNIVERSITY_OF_TECHNOLOGY' ? 'fa-microchip' : 'fa-building-columns'}`} aria-hidden="true"/></span><label><input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => toggle(item.id)} aria-label={`Select ${item.name}`}/> Select</label></div><h2>{item.name}</h2>{item.officialName !== item.name && <p className="institution-official-name">Current official name: {item.officialName}</p>}<p>{item.type === 'UNIVERSITY_OF_TECHNOLOGY' ? 'University of technology' : 'University'}</p>{item.locationVerified && item.province && <p><i className="fas fa-location-dot" aria-hidden="true"/> {item.province}</p>}{item.websiteVerified && item.website && <a href={item.website} target="_blank" rel="noopener noreferrer">Official website <i className="fas fa-arrow-up-right-from-square" aria-hidden="true"/></a>}<button type="button" className="institution-details-toggle" onClick={async () => { const opening = expandedId !== item.id; setExpandedId(opening ? item.id : ''); if (opening && !programmesByInstitution[item.id]) { try { const result = await apiRequest(`/education/institutions/${item.id}/programmes`); setProgrammesByInstitution((current) => ({ ...current, [item.id]: result.items || [] })); } catch (requestError) { setError(requestError.message); } } }}>{expandedId === item.id ? 'Hide details' : 'View details'}</button>{expandedId === item.id && <div className="institution-card-details"><p>Directory name: {item.name}</p>{item.officialName !== item.name && <p>Verified official name: {item.officialName}</p>}{item.locationVerified && item.province && <p>Verified location: {item.province}</p>}{!item.websiteVerified && <p>Website has not been verified.</p>}<h3>Verified programmes</h3>{programmesByInstitution[item.id]?.length ? programmesByInstitution[item.id].map((programme) => <p key={programme.id}><strong>{programme.name}</strong>{programme.qualificationLevel ? ` · ${programme.qualificationLevel}` : ''}{programme.entryRequirements ? <small>{programme.entryRequirements}</small> : null}</p>) : <p>No verified programme information is available yet.</p>}</div>}</article>)}</div>
    {institutions.length > 0 && !visible.length && <p className="dashboard-section-card">No institutions match those filters.</p>}
  </section>;
}
