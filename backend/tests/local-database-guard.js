export function isDedicatedLocalDatabase(value = process.env.DATABASE_URL) {
  if (!value) return false;
  try {
    const url = new URL(value);
    const database = decodeURIComponent(url.pathname.replace(/^\//, ''));
    return ['postgres:', 'postgresql:'].includes(url.protocol)
      && ['localhost', '127.0.0.1', '::1'].includes(url.hostname)
      && /(?:^|[_-])(dev|development|test)(?:[_-]|$)/i.test(database)
      && !/prod|production|ourmemor_edutech/i.test(database);
  } catch {
    return false;
  }
}
