const configuredApiBase = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '/api';

export const apiBaseUrl = configuredApiBase.replace(/\/$/, '');
