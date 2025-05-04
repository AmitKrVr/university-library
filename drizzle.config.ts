import config from '@/lib/config';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    out: './drizzle',
    schema: './src/database/schema.ts',
    dialect: 'postgresql',
    dbCredentials: {
        url: config.env.databaseUrl!,
    },
});
