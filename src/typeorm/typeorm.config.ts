if (process.env.NODE_ENV !== 'production') {
  try {
    const dotenv = require('dotenv');
    const path = require('path');
    const envFile =
      process.env.NODE_ENV === 'development' ? '.env.dev' : '.env';
    const envPath = path.resolve(process.cwd(), envFile);

    dotenv.config({ path: envPath });
    console.log(`✅ Loaded environment from: ${envFile}`);
  } catch (error) {
    console.log('dotenv not loaded (production environment)');
  }
}

import { DataSource } from 'typeorm';

const host = process.env.TYPEORM_HOST || '';
const port = parseInt(process.env.TYPEORM_PORT ?? '5432', 10);
const isCloud =
  process.env.DATABASE_URL || host.includes('supabase') || port === 6543;

export const dataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  host: !process.env.DATABASE_URL ? process.env.TYPEORM_HOST : undefined,
  port: !process.env.DATABASE_URL ? port : undefined,
  username: !process.env.DATABASE_URL
    ? process.env.TYPEORM_USERNAME
    : undefined,
  password: !process.env.DATABASE_URL
    ? process.env.TYPEORM_PASSWORD
    : undefined,
  database: !process.env.DATABASE_URL
    ? process.env.TYPEORM_DATABASE
    : undefined,

  logging: process.env.TYPEORM_LOGGING === 'true',
  entities: [__dirname + '/../entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],
  ssl: isCloud ? { rejectUnauthorized: false } : false,
  extra: isCloud
    ? {
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 5000,
      }
    : {},
});
