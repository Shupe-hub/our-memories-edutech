import { apiBaseUrl } from './apiBase.js';

export async function authRequest(path, options = {}) {
    let response;
    try {
        response = await fetch(`${apiBaseUrl}/auth/${path}`, {
            ...options,
            credentials: 'include',
            headers: {
                ...(options.body ? { 'Content-Type': 'application/json' } : {}),
                ...options.headers,
            },
        });
    } catch {
        throw new Error('Could not connect to the authentication service.');
    }

    let result;
    try {
        result = await response.json();
    } catch {
        throw new Error('The authentication service returned an unexpected response.');
    }

    if (!response.ok) {
        const error = new Error(result?.error || 'Authentication request failed.');
        error.status = response.status;
        throw error;
    }

    return result;
}
