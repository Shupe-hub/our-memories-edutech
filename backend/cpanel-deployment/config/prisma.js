const provider = (process.env.DATABASE_PROVIDER || 'postgresql').toLowerCase();
let clientModule;
if (provider === 'mysql' || provider === 'mariadb') {
    clientModule = await import('../node_modules/.prisma/our-memories-mariadb-client/index.js');
} else if (provider === 'postgresql' || provider === 'postgres') {
    clientModule = await import('../node_modules/.prisma/our-memories-document-client/index.js');
} else {
    throw new Error('DATABASE_PROVIDER must be postgresql or mysql.');
}

const prisma = new clientModule.PrismaClient();

export default prisma;
