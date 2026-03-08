// Load environment variables from .env file
import 'dotenv/config';
import { DataSource } from 'typeorm';

// Script để test database connection
async function checkDatabaseConnection() {
  console.log('🔍 Checking Database Connection...\n');

  const config = {
    DATABASE_URL: process.env.DATABASE_URL,
    TYPEORM_HOST: process.env.TYPEORM_HOST,
    TYPEORM_PORT: process.env.TYPEORM_PORT,
    TYPEORM_USERNAME: process.env.TYPEORM_USERNAME,
    TYPEORM_DATABASE: process.env.TYPEORM_DATABASE,
    NODE_ENV: process.env.NODE_ENV,
  };

  // Show config (hide password)
  console.log('📋 Current Configuration:');
  console.log('NODE_ENV:', config.NODE_ENV);
  console.log('Database Host:', config.TYPEORM_HOST);
  console.log('Database Port:', config.TYPEORM_PORT);
  console.log('Database Name:', config.TYPEORM_DATABASE);
  console.log('Database User:', config.TYPEORM_USERNAME);
  console.log('');

  // Check if using cloud database (Supabase, Neon, etc.)
  const host = config.TYPEORM_HOST || '';
  const port = parseInt(config.TYPEORM_PORT || '5432', 10);
  const isCloud =
    config.DATABASE_URL ||
    host.includes('supabase') ||
    host.includes('neon.tech') ||
    port === 6543;

  // Test connection with proper config
  const dataSource = new DataSource({
    type: 'postgres',
    // Prefer DATABASE_URL if available
    url: config.DATABASE_URL,

    // Fallback to individual vars
    host: !config.DATABASE_URL ? config.TYPEORM_HOST : undefined,
    port: !config.DATABASE_URL
      ? parseInt(config.TYPEORM_PORT || '5432', 10)
      : undefined,
    username: !config.DATABASE_URL ? config.TYPEORM_USERNAME : undefined,
    password: !config.DATABASE_URL ? process.env.TYPEORM_PASSWORD : undefined,
    database: !config.DATABASE_URL ? config.TYPEORM_DATABASE : undefined,

    // SSL config for cloud databases
    ssl: isCloud ? { rejectUnauthorized: false } : false,
  });

  try {
    console.log('⏳ Connecting to database...');
    await dataSource.initialize();
    console.log('✅ Database connection successful!');
    console.log('');

    // Run a test query
    const result = await dataSource.query('SELECT NOW(), current_database()');
    console.log('📊 Connection Details:');
    console.log('Server Time:', result[0].now);
    console.log('Connected to Database:', result[0].current_database);
    console.log('');

    // Check if we're on production or dev database
    const dbName = result[0].current_database;
    if (dbName.includes('prod')) {
      console.log('🌍 Connected to PRODUCTION database');
    } else if (dbName.includes('dev')) {
      console.log('🔧 Connected to DEVELOPMENT database');
    } else {
      console.log('📌 Connected to database:', dbName);
    }

    await dataSource.destroy();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Database connection failed!');
    console.error('Error:', error.message);
    console.error('');
    console.error('🔍 Troubleshooting:');
    console.error('1. Check DATABASE_URL format');
    console.error('2. Verify database credentials');
    console.error('3. Ensure database exists');
    console.error('4. Check network/firewall settings');
    process.exit(1);
  }
}

void checkDatabaseConnection();
