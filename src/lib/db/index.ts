import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Create a PostgreSQL connection
const connectionString = process.env.POSTGRES_URL || '';
const client = postgres(connectionString, { ssl: 'require' });
export const db = drizzle(client, { schema }); 