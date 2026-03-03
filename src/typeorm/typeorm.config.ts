import 'dotenv/config';
import { DataSource } from 'typeorm';

// Check if SSL is needed (Supabase or cloud databases)
const host = process.env.TYPEORM_HOST || '';
const port = parseInt(process.env.TYPEORM_PORT ?? '5432', 10);
const isCloud =
  process.env.DATABASE_URL || host.includes('supabase') || port === 6543;

export const dataSource = new DataSource({
  type: 'postgres',
  // Ưu tiên dùng URL (Connection String) cho môi trường Cloud/Vercel
  url: process.env.DATABASE_URL,

  // Fallback dùng biến rời cho môi trường Local
  host: !process.env.DATABASE_URL ? process.env.TYPEORM_HOST : undefined,
  port: !process.env.DATABASE_URL ? port : undefined,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,

  logging: process.env.TYPEORM_LOGGING === 'true',
  entities: [__dirname + '/../entities/**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/../migrations/*{.ts,.js}'],

  // 1. Cấu hình SSL: Bắt buộc cho Supabase
  ssl: isCloud ? { rejectUnauthorized: false } : false,

  // 2. CẤU HÌNH QUAN TRỌNG ĐỂ CHỐNG TRÀN KẾT NỐI (POOL CONFIG)
  extra: isCloud
    ? {
        max: 1, // Ép mỗi instance API chỉ được mở 1 kết nối duy nhất
        idleTimeoutMillis: 30000, // Tự động đóng kết nối thừa sau 30s
        connectionTimeoutMillis: 5000, // Timeout nếu không kết nối được sau 5s
      }
    : {},
});
