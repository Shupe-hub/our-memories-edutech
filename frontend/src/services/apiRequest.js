import { apiBaseUrl } from './apiBase.js';

export async function apiRequest(path, options = {}) {
    let response;
    try {
        response = await fetch(`${apiBaseUrl}${path}`, {
            ...options,
            credentials: 'include',
            headers: {
                ...(options.body ? { 'Content-Type': 'application/json' } : {}),
                ...options.headers,
            },
        });
    } catch {
        throw new Error('Could not connect to the service. Please try again.');
    }
    let result;
    try { result = await response.json(); }
    catch { throw new Error('The service returned an unexpected response.'); }
    if (!response.ok) {
        const error = new Error(result?.error || 'Request failed. Please try again.');
        error.status = response.status;
        throw error;
    }
    return result;
}
