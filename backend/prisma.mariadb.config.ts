import './config/load-env.js';
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  schema: 'prisma/mariadb/schema.prisma',
  migrations: { path: 'prisma/mariadb/migrations' },
  datasource: { url: env('SOURCE_DATABASE_URL') },
});
