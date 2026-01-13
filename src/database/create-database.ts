import 'dotenv/config';
import { Client } from 'pg';

async function createDatabase() {
  const client = new Client({
    host: process.env.TYPEORM_HOST,
    port: parseInt(process.env.TYPEORM_PORT ?? '5432', 10),
    user: process.env.TYPEORM_USERNAME,
    password: process.env.TYPEORM_PASSWORD,
    database: 'postgres',
  });

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

createDatabase();
