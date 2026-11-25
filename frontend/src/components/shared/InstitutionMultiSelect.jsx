import { useEffect, useMemo, useState } from 'react';
import { apiRequest } from '../../services/apiRequest';
import { filterInstitutions, normalizeInstitutionSelection, toggleInstitutionSelection } from './institutionSelection';

export default function InstitutionMultiSelect({ value = [], onChange, id = 'selected-institutions' }) {
  const [institutions, setInstitutions] = useState([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  useEffect(() => { apiRequest('/institutions').then((result) => setInstitutions(result.items || [])).catch((requestError) => setError(requestError.message)); }, []);
  const selectedIds = useMemo(() => normalizeInstitutionSelection(value), [value]);
  const byId = useMemo(() => new Map(institutions.map((item) => [item.id, item])), [institutions]);
  const selected = selectedIds.map((institutionId) => byId.get(institutionId)).filter(Boolean);
  const visible = useMemo(() => filterInstitutions(institutions, query), [institutions, query]);

  const toggle = (institution) => {
    const ids = toggleInstitutionSelection(selectedIds, institution.id);
    onChange(ids, ids.map((institutionId) => byId.get(institutionId)?.name).filter(Boolean));
  };

  return <div className="institution-multiselect">
    <label className="application-field institution-search-field" htmlFor={`${id}-search`}>
      <span>Search universities <b aria-hidden="true">*</b></span>
      <input id={`${id}-search`} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by university name" />
    </label>
    <div className="institution-multiselect-options" role="group" aria-label="Available universities">
      {visible.map((institution) => {
        const checked = selectedIds.includes(institution.id);
        const location = institution.locationVerified ? institution.province : null;
        return <label className={`institution-multiselect-option${checked ? ' is-selected' : ''}`} key={institution.id}>
          <input type="checkbox" checked={checked} disabled={!checked && selectedIds.length >= 20} onChange={() => toggle(institution)} />
          <span className="institution-option-copy">
            <span className="institution-option-name">{institution.name}</span>
            {location && <small className="institution-option-location">{location}</small>}
            {institution.officialName !== institution.name && <small className="institution-option-official-name">Current official name: {institution.officialName}</small>}
          </span>
        </label>;
      })}
      {!visible.length && <p className="institution-empty-state">{error || (institutions.length ? 'No universities match your search.' : 'Loading the institution directory...')}</p>}
    </div>
    <div className="institution-selection-summary" aria-live="polite">
      <strong>Selected universities</strong>
      <span className="institution-selection-count">{selectedIds.length} of 20 selected</span>
    </div>
    {selected.length > 0 && <div className="institution-selected-chips" aria-label="Selected universities">{selected.map((institution) => <span className="institution-chip" key={institution.id}>{institution.name}<button type="button" onClick={() => toggle(institution)} aria-label={`Remove ${institution.name}`}>&times;</button></span>)}</div>}
    {selectedIds.length >= 20 && <small className="institution-limit-note">You&apos;ve reached the 20 institution limit. Remove a selection to choose another.</small>}
  </div>;
}