// Load environment variables from .env file
import 'dotenv/config';
import { DataSource } from 'typeorm';

// Script để check admin user details including relations
async function checkAdminDetails() {
  console.log('🔍 Checking Admin User Details...\n');

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

    // Get admin user
    const [user] = await dataSource.query(
      `SELECT u.*, c.id as customer_id, c.name as customer_name 
       FROM users u 
       LEFT JOIN customers c ON u."customerId" = c.id 
       WHERE u.username = 'admin' AND u."isDeleted" = false`,
    );

    if (!user) {
      console.log('❌ Admin user not found!');
      process.exit(1);
    }

    console.log('👤 Admin User:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Username: ${user.username}`);
    console.log(`   Email: ${user.email}`);
    console.log(`   isAdmin: ${user.isAdmin}`);
    console.log(`   isActive: ${user.isActive}`);
    console.log(`   Customer ID: ${user.customer_id || '❌ NULL'}`);
    console.log(`   Customer Name: ${user.customer_name || '❌ NULL'}`);

    // Check user_roles
    const userRoles = await dataSource.query(
      `SELECT ur.id, ur."userId", ur."roleId", r.name as role_name
       FROM user_roles ur
       LEFT JOIN roles r ON ur."roleId" = r.id
       WHERE ur."userId" = $1 AND ur."isDeleted" = false`,
      [user.id],
    );

    console.log(`\n🔐 User Roles (${userRoles.length}):`);
    if (userRoles.length === 0) {
      console.log('   ❌ No roles assigned!');
    } else {
      userRoles.forEach((ur: any) => {
        console.log(`   - ${ur.role_name || 'Unknown role'}`);
      });
    }

    // Check all roles
    const allRoles = await dataSource.query(
      `SELECT id, name, description FROM roles WHERE "isDeleted" = false`,
    );

    console.log(`\n📋 Available Roles (${allRoles.length}):`);
    if (allRoles.length === 0) {
      console.log('   ⚠️  No roles in database!');
      console.log('   💡 You may need to seed roles data');
    } else {
      allRoles.forEach((role: any) => {
        console.log(
          `   - ${role.name}: ${role.description || 'No description'}`,
        );
      });
    }

    // Check password hash format
    console.log('\n🔑 Password:');
    console.log(`   Hash: ${user.password.substring(0, 20)}...`);
    console.log(
      `   Format: ${user.password.startsWith('$2a$') || user.password.startsWith('$2b$') ? '✅ bcrypt' : '❌ Invalid'}`,
    );

    await dataSource.destroy();
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

void checkAdminDetails();
