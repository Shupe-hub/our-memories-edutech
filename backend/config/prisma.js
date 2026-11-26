import './load-env.js';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/postgres/client.ts';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export default prisma;
