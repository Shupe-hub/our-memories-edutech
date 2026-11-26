import { useEffect, useState } from 'react';
import { apiRequest } from '../../services/apiRequest';
import { apiBaseUrl } from '../../services/apiBase.js';

const labels = { ID_COPY: 'ID copy or birth certificate', ACADEMIC_RESULTS: 'Academic results', CERTIFICATE: 'Certificate or qualification', GUARDIAN_ID: 'Guardian ID', PROOF_OF_RESIDENCE: 'Proof of residence', UPGRADING_LETTER: 'Upgrading letter', OTHER: 'Other' };
const statuses = ['UPLOADED', 'UNDER_REVIEW', 'VERIFIED', 'REJECTED', 'REPLACEMENT_REQUIRED'];
const apiBase = apiBaseUrl;

export default function ApplicationDocumentReview({ applicationId }) {
  const [items, setItems] = useState([]);
  const [comments, setComments] = useState({});
  const [draftStatuses, setDraftStatuses] = useState({});
  const [error, setError] = useState('');
  const refresh = async () => { const result = await apiRequest(`/admin/applications/${applicationId}/documents`); setItems(result.items || []); };
  useEffect(() => { refresh().catch((requestError) => setError(requestError.message)); }, [applicationId]);
  const update = async (item, status) => {
    try { await apiRequest(`/admin/applications/${applicationId}/documents/${item.id}/status`, { method: 'PATCH', body: JSON.stringify({ status, comment: comments[item.id] ?? item.adminComment ?? '' }) }); await refresh(); }
    catch (requestError) { setError(requestError.message); }
  };
  return <section className="dashboard-card application-document-review"><h3>Submitted documents</h3>{error && <p role="alert">{error}</p>}{items.length ? items.map((item) => <article className="application-document-row" key={item.id}><div><strong>{item.originalName}</strong><span>{labels[item.category] || item.category} · {new Date(item.uploadedAt).toLocaleDateString()} · {item.sizeBytes.toLocaleString()} bytes</span><label>Status<select value={draftStatuses[item.id] ?? item.status} onChange={(event) => setDraftStatuses((current) => ({ ...current, [item.id]: event.target.value }))}>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label><label>Student-visible comment<textarea value={comments[item.id] ?? item.adminComment ?? ''} onChange={(event) => setComments((current) => ({ ...current, [item.id]: event.target.value }))} rows="2" /></label><button type="button" onClick={() => update(item, draftStatuses[item.id] ?? item.status)}>Save review</button>{item.history?.length > 0 && <details><summary>Review history</summary>{item.history.map((entry, index) => <p key={`${entry.changedAt}-${index}`}>{entry.action.replaceAll('_', ' ')}{entry.newStatus ? `: ${entry.newStatus.replaceAll('_', ' ')}` : ''} · {entry.actor ? `${entry.actor.name} ${entry.actor.surname}` : 'System'} · {new Date(entry.changedAt).toLocaleString()}</p>)}</details>}</div><a href={`${apiBase}/admin/applications/${applicationId}/documents/${item.id}/download`}>Secure download</a></article>) : <p>No documents submitted.</p>}</section>;
}
