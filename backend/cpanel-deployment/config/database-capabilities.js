const provider = (process.env.DATABASE_PROVIDER || 'postgresql').toLowerCase();

export const usesMySqlProvider = provider === 'mysql' || provider === 'mariadb';

// MySQL/MariaDB case-insensitive matching follows the configured column collation;
// Prisma's `mode: 'insensitive'` filter is PostgreSQL-specific.
export const containsInsensitive = (value) => usesMySqlProvider
    ? { contains: value }
    : { contains: value, mode: 'insensitive' };

// For a top-level MySQL JSON scalar array, Prisma expects the contained scalar value.
export const containsArrayValue = (value) => usesMySqlProvider
    ? { array_contains: value }
    : { hasSome: [value] };
