import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiBaseUrl } from '../../services/apiBase.js';
import { apiRequest } from '../../services/apiRequest';

const categories = [
  ['ID_COPY', 'Identity document'],
  ['ACADEMIC_RESULTS', 'Academic results'],
  ['CERTIFICATE', 'Certificate or qualification'],
  ['PROOF_OF_RESIDENCE', 'Proof of residence'],
  ['GUARDIAN_ID', 'Parent/guardian document'],
  ['UPGRADING_LETTER', 'Upgrading letter'],
  ['OTHER', 'Other supporting document'],
];
const statuses = { UPLOADED: 'Uploaded', UNDER_REVIEW: 'Under review', VERIFIED: 'Verified', REJECTED: 'Rejected', REPLACEMENT_REQUIRED: 'Replacement required' };
const editableApplicationStatuses = ['SUBMITTED', 'UNDER_REVIEW', 'AWAITING_DOCUMENTS', 'IN_PROGRESS'];
const apiBase = apiBaseUrl;
const formatSize = (bytes) => bytes < 1024 * 1024 ? `${Math.max(1, Math.round(bytes / 1024))} KB` : `${(bytes / 1024 / 1024).toFixed(1)} MB`;

export default function ApplicationDocumentsPanel({ applicationId = null, applicationStatus = null, standalone = false }) {
  const inputRef = useRef(null);
  const [items, setItems] = useState([]);
  const [applications, setApplications] = useState([]);
  const [targetApplication, setTargetApplication] = useState('');
  const [category, setCategory] = useState('ID_COPY');
  const [replacementId, setReplacementId] = useState('');
  const [maxBytes, setMaxBytes] = useState(5 * 1024 * 1024);
  const [progress, setProgress] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const collectionPath = standalone ? '/applications/documents' : `/applications/${applicationId}/documents`;
  const closed = !standalone && !editableApplicationStatuses.includes(applicationStatus);
  const selectableApplications = applications.filter((application) => editableApplicationStatuses.includes(application.status));

  const refresh = useCallback(async () => {
    const result = await apiRequest(collectionPath);
    setItems(result.items || []);
    if (result.maxFileBytes) setMaxBytes(Math.min(result.maxFileBytes, 5 * 1024 * 1024));
  }, [collectionPath]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(refresh).catch((requestError) => { if (active) setError(requestError.message); });
    return () => { active = false; };
  }, [refresh]);
  useEffect(() => {
    if (!standalone) return;
    apiRequest('/applications/my').then((result) => setApplications(result.items || [])).catch((requestError) => setError(requestError.message));
  }, [standalone]);

  const upload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError(''); setNotice('');
    if (file.size > maxBytes) { setError(`Choose a file no larger than ${formatSize(maxBytes)}.`); event.target.value = ''; return; }
    setBusy(true); setProgress(0);
    const request = new XMLHttpRequest();
    request.open('POST', `${apiBase}${collectionPath}`);
    request.withCredentials = true;
    request.setRequestHeader('Content-Type', 'application/octet-stream');
    request.setRequestHeader('X-Document-Category', category);
    request.setRequestHeader('X-File-Name', encodeURIComponent(file.name));
    if (replacementId) request.setRequestHeader('X-Replaces-Document', replacementId);
    request.upload.onprogress = (eventProgress) => { if (eventProgress.lengthComputable) setProgress(Math.round((eventProgress.loaded / eventProgress.total) * 100)); };
    request.onload = async () => {
      let result = {};
      try { result = JSON.parse(request.responseText); } catch { /* The request returned no JSON response. */ }
      if (request.status < 200 || request.status >= 300) {
        setError(result.error || 'The document could not be uploaded. Please try again.');
      } else {
        setNotice('Document uploaded securely.');
        setReplacementId('');
        try { await refresh(); } catch (requestError) { setError(requestError.message); }
      }
      setBusy(false); setProgress(0); if (inputRef.current) inputRef.current.value = '';
    };
    request.onerror = () => { setBusy(false); setProgress(0); setError('Could not connect to secure document storage.'); };
    request.send(file);
  };

  const remove = async (item) => {
    const prompt = standalone ? `Delete ${item.originalName} from My Documents?` : `Detach ${item.originalName} from this application? It will remain in My Documents.`;
    if (!window.confirm(prompt)) return;
    const path = standalone ? `/applications/documents/${item.id}` : `/applications/${applicationId}/documents/${item.id}`;
    try { await apiRequest(path, { method: 'DELETE' }); setNotice(standalone ? 'Document deleted.' : 'Document detached and kept in My Documents.'); await refresh(); }
    catch (requestError) { setError(requestError.message); }
  };

  const attach = async (item) => {
    if (!targetApplication) return;
    try {
      await apiRequest(`/applications/documents/${item.id}/applications/${targetApplication}`, { method: 'POST' });
      setNotice('Document attached to the selected application.');
      await refresh();
    } catch (requestError) { setError(requestError.message); }
  };

  const startReplacement = (item) => {
    setCategory(item.category);
    setReplacementId(item.id);
    setError(''); setNotice(`Choose a replacement file for ${item.originalName}.`);
    inputRef.current?.click();
  };

  return <section className={`application-documents-panel${standalone ? ' student-documents-manager' : ''}`}>
    <div className="dashboard-card-heading"><h2>{standalone ? 'Your documents' : 'Application documents'}</h2>{!standalone && <Link to="/account/documents">Manage My Documents</Link>}</div>
    <p className="student-documents-intro">PDF, JPG and PNG files up to {formatSize(maxBytes)}. Documents are stored privately and are only available to you and authorized administrators.</p>
    {!closed && <div className="application-document-upload student-document-upload">
      <label>Document category<select value={category} onChange={(event) => setCategory(event.target.value)}>{categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
      <label className="student-document-file-label">Choose a document<input ref={inputRef} type="file" accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png" onChange={upload} disabled={busy} /></label>
      <button type="button" className="dashboard-primary-button" disabled={busy} onClick={() => inputRef.current?.click()}><i className={`fas ${busy ? 'fa-spinner fa-spin' : 'fa-upload'}`} aria-hidden="true" />{busy ? 'Uploading...' : replacementId ? 'Choose replacement file' : 'Upload document'}</button>
      {busy && <div className="student-document-progress"><progress max="100" value={progress} aria-label="Document upload progress"/><span>{progress}% uploaded</span></div>}
    </div>}
    {error && <p className="dashboard-info-banner" role="alert">{error}</p>}
    {notice && <p className="student-document-success" role="status">{notice}</p>}
    {replacementId && <p className="dashboard-info-banner" role="status">The replacement must use the same category. Existing application links will be preserved.</p>}
    {standalone && selectableApplications.length > 0 && <label className="student-document-application-select">Attach a document to an application<select value={targetApplication} onChange={(event) => setTargetApplication(event.target.value)}><option value="">Choose an application when attaching</option>{selectableApplications.map((application) => <option key={application.id} value={application.id}>{application.referenceNumber} - {application.status.replaceAll('_', ' ')}</option>)}</select></label>}
    {items.length > 0 ? <div className="application-document-list">{items.map((item) => {
      const linkedApplications = (item.applications || []).map(({ enquiry }) => enquiry);
      const removable = ['UPLOADED', 'REJECTED', 'REPLACEMENT_REQUIRED'].includes(item.status);
      return <article className="application-document-row student-document-row" key={item.id}>
        <div className="student-document-details"><strong>{item.originalName}</strong><span>{categories.find(([value]) => value === item.category)?.[1] || item.category} · {new Date(item.uploadedAt).toLocaleDateString()} · {formatSize(item.sizeBytes)}</span><span className={`application-status status-${item.status.toLowerCase()}`}>{statuses[item.status] || item.status}</span>
          {item.adminComment && <p className="student-document-feedback"><strong>Administrator feedback:</strong> {item.adminComment}</p>}
          {linkedApplications.length > 0 && <p className="student-document-links"><strong>Attached to:</strong> {linkedApplications.map((application, index) => <span key={application.id}>{index > 0 && ', '}<Link to={`/account/applications/${application.id}`}>{application.referenceNumber}</Link>{application.requestedDocuments?.length > 0 && <> - Requested: {application.requestedDocuments.join(', ')}</>}</span>)}</p>}
        </div>
        <div className="application-document-actions"><a href={`${apiBase}${standalone ? `/applications/documents/${item.id}/download` : `/applications/${applicationId}/documents/${item.id}/download`}`}>Download</a>{standalone && targetApplication && !linkedApplications.some((application) => application.id === targetApplication) && item.status !== 'REJECTED' && item.status !== 'REPLACEMENT_REQUIRED' && <button type="button" onClick={() => attach(item)}>Attach</button>}{removable && <><button type="button" onClick={() => startReplacement(item)} disabled={busy}>Replace</button><button type="button" onClick={() => remove(item)}>{standalone ? 'Delete' : 'Detach'}</button></>}</div>
      </article>;
    })}</div> : <div className="dashboard-page-empty-card student-documents-empty"><i className="fas fa-folder-open" aria-hidden="true"/><h3>No documents uploaded yet</h3><p>Upload identity documents, results, certificates or supporting documents here. You can attach them to an application without uploading another copy.</p></div>}
    {closed && <p className="dashboard-info-banner">This application is closed. Existing documents remain available in My Documents.</p>}
  </section>;
}
