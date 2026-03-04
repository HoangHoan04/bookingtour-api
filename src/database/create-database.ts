import 'dotenv/config';
import { Client } from 'pg';

async function createDatabase() {
  // Parse DATABASE_URL if available, otherwise use individual TYPEORM_* variables
  let connectionConfig: any;

  if (process.env.DATABASE_URL) {
    // Parse DATABASE_URL for Supabase or other hosted databases
    const url = new URL(process.env.DATABASE_URL);
    connectionConfig = {
      host: url.hostname,
      port: parseInt(url.port || '5432', 10),
      user: url.username,
      password: url.password,
      database: 'postgres', // Connect to postgres database to create the target database
      ssl: { rejectUnauthorized: false }, // Enable SSL for Supabase
    };
  } else {
    // Use individual environment variables
    const host = process.env.TYPEORM_HOST;
    const port = parseInt(process.env.TYPEORM_PORT ?? '5432', 10);

    connectionConfig = {
      host: host,
      port: port,
      user: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
      database: 'postgres',
      // Enable SSL for Supabase or cloud databases (port 6543 or hostname contains 'supabase')
      ssl:
        host?.includes('supabase') || port === 6543
          ? { rejectUnauthorized: false }
          : false,
    };
  }

  const client = new Client(connectionConfig);
  const dbName = process.env.TYPEORM_DATABASE;

  try {
    await client.connect();
    const res = await client.query(
      `SELECT 1 FROM pg_database WHERE datname='${dbName}'`,
    );
    if (res.rowCount === 0) {
      console.log(`🛠️  Database "${dbName}" không tồn tại. Đang tạo...`);
      await client.query(
        `CREATE DATABASE "${dbName}" WITH ENCODING='UTF8' LC_COLLATE='en_US.UTF-8' LC_CTYPE='en_US.UTF-8' TEMPLATE=template0`,
      );
      console.log(`✅ Database "${dbName}" đã được tạo với UTF8.`);
    } else {
      console.log(`✅ Database "${dbName}" đã tồn tại.`);
    }
  } catch (err) {
    console.error('❌ Lỗi khi tạo database:', err);
  } finally {
    await client.end();
  }
}

void createDatabase();
