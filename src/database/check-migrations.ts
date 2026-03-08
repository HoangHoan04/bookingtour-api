// Load environment variables from .env file
import 'dotenv/config';
import { DataSource } from 'typeorm';

// Script để check migration history
async function checkMigrations() {
  console.log('📜 Checking Migration History...\n');

  const isCloud =
    process.env.DATABASE_URL ||
    process.env.TYPEORM_HOST?.includes('supabase') ||
    parseInt(process.env.TYPEORM_PORT || '5432', 10) === 6543;

  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    host: !process.env.DATABASE_URL ? process.env.TYPEORM_HOST : undefined,
    port: !process.env.DATABASE_URL
      ? parseInt(process.env.TYPEORM_PORT || '5432', 10)
      : undefined,
    username: !process.env.DATABASE_URL
      ? process.env.TYPEORM_USERNAME
      : undefined,
    password: !process.env.DATABASE_URL
      ? process.env.TYPEORM_PASSWORD
      : undefined,
    database: !process.env.DATABASE_URL
      ? process.env.TYPEORM_DATABASE || 'postgres'
      : undefined,
    ssl: isCloud ? { rejectUnauthorized: false } : false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to database\n');

    // Check migrations table
    const migrations = await dataSource.query(
      `SELECT id, timestamp, name FROM migrations ORDER BY timestamp DESC`,
    );

    if (migrations.length === 0) {
      console.log('❌ No migrations found!');
    } else {
      console.log(`📊 Found ${migrations.length} migration(s):\n`);

      migrations.forEach((migration: any, index: number) => {
        const date = new Date(parseInt(migration.timestamp));
        console.log(
          `${migrations.length - index}. ${migration.name} (${date.toLocaleString()})`,
        );
      });
    }

    await dataSource.destroy();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

void checkMigrations();
