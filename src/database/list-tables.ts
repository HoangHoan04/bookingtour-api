// Load environment variables from .env file
import 'dotenv/config';
import { DataSource } from 'typeorm';

// Script để list tables trên database
async function listTables() {
  console.log('🔍 Checking Database Tables...\n');

  const config = {
    DATABASE_URL: process.env.DATABASE_URL,
    TYPEORM_HOST: process.env.TYPEORM_HOST,
    TYPEORM_PORT: process.env.TYPEORM_PORT,
    TYPEORM_DATABASE: process.env.TYPEORM_DATABASE || 'postgres',
    NODE_ENV: process.env.NODE_ENV,
  };

  console.log('📋 Configuration:');
  console.log('Environment:', config.NODE_ENV);
  console.log('Database:', config.TYPEORM_DATABASE);
  console.log('');

  // Check if using cloud database (Supabase, Neon, etc.)
  const host = config.TYPEORM_HOST || '';
  const port = parseInt(config.TYPEORM_PORT || '5432', 10);
  const isCloud =
    config.DATABASE_URL ||
    host.includes('supabase') ||
    host.includes('neon.tech') ||
    port === 6543;

  const dataSource = new DataSource({
    type: 'postgres',
    url: config.DATABASE_URL,
    host: !config.DATABASE_URL ? config.TYPEORM_HOST : undefined,
    port: !config.DATABASE_URL
      ? parseInt(config.TYPEORM_PORT || '5432', 10)
      : undefined,
    username: !config.DATABASE_URL ? process.env.TYPEORM_USERNAME : undefined,
    password: !config.DATABASE_URL ? process.env.TYPEORM_PASSWORD : undefined,
    database: !config.DATABASE_URL ? config.TYPEORM_DATABASE : undefined,
    ssl: isCloud ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('⏳ Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Connected successfully!\n');

    // Query to list all tables
    const tables = await dataSource.query(`
      SELECT 
        table_schema,
        table_name,
        table_type
      FROM information_schema.tables 
      WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
        AND table_type = 'BASE TABLE'
      ORDER BY table_schema, table_name;
    `);

    if (tables.length === 0) {
      console.log('📭 No tables found in database!');
      console.log('');
      console.log('💡 This means:');
      console.log('   - Migrations have not been run yet');
      console.log('   - Or tables are in a different schema');
      console.log('');
      console.log('🚀 To create tables, run:');
      console.log('   yarn migration:run:dev   (for development)');
      console.log('   yarn migration:run:prod  (for production)');
    } else {
      console.log(`📊 Found ${tables.length} table(s):\n`);

      const bySchema: Record<string, string[]> = {};
      tables.forEach((t: any) => {
        if (!bySchema[t.table_schema]) {
          bySchema[t.table_schema] = [];
        }
        bySchema[t.table_schema].push(t.table_name);
      });

      Object.keys(bySchema).forEach((schema) => {
        console.log(`Schema: ${schema}`);
        bySchema[schema].forEach((table) => {
          console.log(`  - ${table}`);
        });
        console.log('');
      });
    }

    // Check for TypeORM migrations table
    const migrationTables = await dataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_name LIKE '%migration%'
        AND table_schema NOT IN ('pg_catalog', 'information_schema');
    `);

    if (migrationTables.length > 0) {
      console.log('📝 Migration tracking table:');
      migrationTables.forEach((t: any) => {
        console.log(`  - ${t.table_name}`);
      });

      // Get migration history
      const migrationTable = migrationTables[0].table_name;
      try {
        const migrations = await dataSource.query(
          `SELECT * FROM "${migrationTable}" ORDER BY "timestamp" DESC`,
        );
        if (migrations.length > 0) {
          console.log('\n🕒 Migration History:');
          migrations.forEach((m: any) => {
            console.log(
              `  - ${m.name} (${new Date(m.timestamp).toLocaleString()})`,
            );
          });
        }
      } catch (e) {
        // Migration table exists but might have different structure
      }
    } else {
      console.log('⚠️  No migration tracking table found');
      console.log('   Migrations have never been run on this database');
    }

    await dataSource.destroy();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error('\nStack:', error.stack);
    process.exit(1);
  }
}

void listTables();
