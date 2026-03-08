import 'dotenv/config';
import { dataSource } from '../typeorm/typeorm.config';

// Hàm mask password để không hiển thị đầy đủ
function maskPassword(str: string): string {
  const match = str.match(/(:\/\/)([^:]+):([^@]+)(@)/);
  if (match) {
    const password = match[3];
    const masked = password.substring(0, 3) + '*'.repeat(password.length - 3);
    return str.replace(password, masked);
  }
  return str;
}

async function testConnection() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('🔌 SUPABASE DATABASE CONNECTION TEST');
  console.log('═══════════════════════════════════════════════════════\n');

  // Hiển thị thông tin kết nối (ẩn password)
  console.log('📋 Connection Info:');
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);

  if (process.env.DATABASE_URL) {
    console.log(`   Database URL: ${maskPassword(process.env.DATABASE_URL)}`);
  } else {
    console.log(`   Host: ${process.env.TYPEORM_HOST}`);
    console.log(`   Port: ${process.env.TYPEORM_PORT}`);
    console.log(`   Database: ${process.env.TYPEORM_DATABASE}`);
    console.log(`   Username: ${process.env.TYPEORM_USERNAME}`);
  }

  console.log('\n🔄 Attempting to connect...\n');

  try {
    // Test connection với timeout
    const startTime = Date.now();
    await dataSource.initialize();
    const connectionTime = Date.now() - startTime;

    console.log('✅ Database connection successful!');
    console.log(`⏱️  Connection time: ${connectionTime}ms\n`);

    // Get database info
    const dbInfo = await dataSource.query(`
      SELECT 
        version() as version,
        current_database() as database,
        current_user as user,
        inet_server_addr() as server_ip,
        inet_server_port() as server_port
    `);

    console.log('📊 Database Information:');
    console.log(`   PostgreSQL: ${dbInfo[0].version.split(' ')[1]}`);
    console.log(`   Database: ${dbInfo[0].database}`);
    console.log(`   User: ${dbInfo[0].user}`);
    console.log(
      `   Server: ${dbInfo[0].server_ip || 'localhost'}:${dbInfo[0].server_port}`,
    );

    // Check database size
    const sizeInfo = await dataSource.query(`
      SELECT pg_size_pretty(pg_database_size(current_database())) as size;
    `);
    console.log(`   Size: ${sizeInfo[0].size}`);

    // Check existing tables
    console.log('\n📋 Tables in Database:');
    const tables = await dataSource.query(`
      SELECT 
        table_name,
        (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
      FROM information_schema.tables t
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);

    if (tables.length > 0) {
      console.log(`   ✅ Found ${tables.length} tables:\n`);

      // Nhóm tables theo category
      const tourTables = tables.filter((t: any) =>
        t.table_name.includes('tour'),
      );
      const bookingTables = tables.filter(
        (t: any) =>
          t.table_name.includes('booking') || t.table_name.includes('payment'),
      );
      const userTables = tables.filter(
        (t: any) =>
          t.table_name.includes('user') ||
          t.table_name.includes('customer') ||
          t.table_name.includes('role'),
      );
      const otherTables = tables.filter(
        (t: any) =>
          !tourTables.includes(t) &&
          !bookingTables.includes(t) &&
          !userTables.includes(t),
      );

      if (tourTables.length > 0) {
        console.log('   🗺️  Tour Tables:');
        tourTables.forEach((table: any) => {
          console.log(
            `      - ${table.table_name} (${table.column_count} columns)`,
          );
        });
      }

      if (bookingTables.length > 0) {
        console.log('\n   💰 Booking & Payment Tables:');
        bookingTables.forEach((table: any) => {
          console.log(
            `      - ${table.table_name} (${table.column_count} columns)`,
          );
        });
      }

      if (userTables.length > 0) {
        console.log('\n   👥 User & Role Tables:');
        userTables.forEach((table: any) => {
          console.log(
            `      - ${table.table_name} (${table.column_count} columns)`,
          );
        });
      }

      if (otherTables.length > 0) {
        console.log('\n   📦 Other Tables:');
        otherTables.forEach((table: any) => {
          console.log(
            `      - ${table.table_name} (${table.column_count} columns)`,
          );
        });
      }

      // Đếm số lượng records trong các bảng quan trọng
      console.log('\n📊 Record Counts:');
      const importantTables = [
        'users',
        'customers',
        'tours',
        'bookings',
        'payments',
      ];

      for (const tableName of importantTables) {
        const tableExists = tables.find((t: any) => t.table_name === tableName);
        if (tableExists) {
          try {
            const count = await dataSource.query(
              `SELECT COUNT(*) as count FROM "${tableName}"`,
            );
            console.log(`   - ${tableName}: ${count[0].count} records`);
          } catch (err) {
            // Bảng có thể chưa có dữ liệu
          }
        }
      }
    } else {
      console.log('   ⚠️  No tables found. Database is empty.');
      console.log('   💡 Run migrations to create tables:');
      console.log('      npm run typeorm migration:run');
    }

    // Check migrations table
    try {
      const migrations = await dataSource.query(`
        SELECT * FROM "migrations" ORDER BY "timestamp" DESC LIMIT 5;
      `);

      if (migrations.length > 0) {
        console.log('\n📝 Recent Migrations:');
        migrations.forEach((migration: any) => {
          const date = new Date(parseInt(migration.timestamp));
          console.log(`   ✅ ${migration.name}`);
          console.log(`      Run at: ${date.toLocaleString()}`);
        });
      }
    } catch (err) {
      console.log('\n⚠️  Migrations table not found.');
      console.log('   This is normal for a fresh database.');
    }

    // Test write permission
    console.log('\n🔐 Testing Database Permissions:');
    try {
      await dataSource.query(
        `CREATE TABLE IF NOT EXISTS _test_permissions (id SERIAL PRIMARY KEY)`,
      );
      await dataSource.query(`DROP TABLE IF EXISTS _test_permissions`);
      console.log('   ✅ Read & Write permissions: OK');
    } catch (err) {
      console.log('   ⚠️  Write permission test failed');
      console.log('   Error:', (err as Error).message);
    }

    console.log('\n═══════════════════════════════════════════════════════');
    console.log('🎉 CONNECTION TEST SUCCESSFUL!');
    console.log('═══════════════════════════════════════════════════════');

    console.log('\n💡 Next Steps:');
    if (tables.length === 0) {
      console.log('   1️⃣  Run migrations: npm run typeorm migration:run');
      console.log('   2️⃣  Start server: npm run start:dev');
      console.log('   3️⃣  Test API endpoints');
    } else {
      console.log('   ✅ Database is ready!');
      console.log('   🚀 Start server: npm run start:dev');
      console.log('   📖 API Docs: http://localhost:4300/api');
    }
  } catch (error: any) {
    console.log('═══════════════════════════════════════════════════════');
    console.error('❌ DATABASE CONNECTION FAILED!');
    console.log('═══════════════════════════════════════════════════════\n');

    console.error('❗ Error details:');
    console.error('   Message:', (error as Error).message);

    if (error.code) {
      console.error('   Code:', error.code);
    }

    console.log('\n🔧 Troubleshooting Steps:\n');
    console.log('   1️⃣  Check DATABASE_URL in .env file:');
    console.log('      Format: postgresql://user:password@host:port/database');
    console.log(
      '      Example: postgresql://postgres:pass@db.xxx.supabase.co:5432/postgres\n',
    );

    console.log('   2️⃣  Verify Supabase project is active:');
    console.log('      Visit: https://supabase.com/dashboard\n');

    console.log('   3️⃣  Check password is correct:');
    console.log('      No extra @ symbols (use only one @)');
    console.log('      Special chars may need URL encoding\n');

    console.log('   4️⃣  Test network connection:');
    console.log(
      '      Ensure firewall allows port 5432 (development) or 6543 (production)\n',
    );

    console.log('   5️⃣  Common error codes:');
    console.log('      - ENOTFOUND: Wrong host/DNS issue');
    console.log('      - ECONNREFUSED: Port blocked or wrong port');
    console.log('      - 28P01: Authentication failed (wrong password)');
    console.log('      - ETIMEDOUT: Network/firewall issue\n');

    console.log('═══════════════════════════════════════════════════════');
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('\n🔌 Connection closed.');
    }
  }

  process.exit(0);
}

testConnection();
