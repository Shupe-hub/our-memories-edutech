// PostgreSQL is the only supported application database. Keep database-specific
// Prisma filters here so controllers cannot accidentally use MySQL semantics.
export const containsInsensitive = (value) => ({ contains: value, mode: 'insensitive' });

export const containsArrayValue = (value) => ({ hasSome: [value] });
