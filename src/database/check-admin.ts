// Load environment variables from .env file
import 'dotenv/config';
import { DataSource } from 'typeorm';

// Script để check admin users
async function checkAdminUsers() {
  console.log('🔍 Checking Admin Users...\n');

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

    // Check users table
    const users = await dataSource.query(
      `SELECT id, username, email, "isAdmin", "isActive", "createdAt" 
       FROM users 
       WHERE "isDeleted" = false
       ORDER BY "createdAt" DESC`,
    );

    if (users.length === 0) {
      console.log('❌ No users found in database!');
      console.log(
        '\n💡 You need to run the migration that creates admin user:',
      );
      console.log('   yarn migration:run:dev');
    } else {
      console.log(`📊 Found ${users.length} user(s):\n`);

      users.forEach((user: any, index: number) => {
        console.log(`${index + 1}. ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Admin: ${user.isAdmin ? '✅ YES' : '❌ NO'}`);
        console.log(`   Active: ${user.isActive ? '✅' : '❌'}`);
        console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
        console.log('');
      });

      const adminUsers = users.filter((u: any) => u.isAdmin);
      if (adminUsers.length === 0) {
        console.log('⚠️  No admin users found!');
        console.log(
          '   You need at least one admin user to login to admin panel',
        );
      } else {
        console.log(`✅ Found ${adminUsers.length} admin user(s)`);
      }
    }

    // Check roles
    const roles = await dataSource.query(
      `SELECT id, name, description FROM roles WHERE "isDeleted" = false`,
    );

    console.log(`\n📋 Roles (${roles.length}):`);
    roles.forEach((role: any) => {
      console.log(`  - ${role.name}: ${role.description || 'No description'}`);
    });

    await dataSource.destroy();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

void checkAdminUsers();
