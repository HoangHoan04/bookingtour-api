# Hướng dẫn Cấu hình Môi trường Database

## Cấu trúc File Môi trường

Dự án đã được cấu hình để tự động chuyển đổi giữa database dev và production dựa vào môi trường:

### 📁 Các file môi trường:

- **`.env`** → Database development (backup/default)
- **`.env.dev`** → Database development (Supabase Dev)
- **`.env.prod`** → Database production (Supabase Production)

## 🚀 Cách Sử Dụng

### 1. Development (Local)

```bash
npm run start:dev
```

→ Tự động kết nối **database development** từ `.env.dev`

### 2. Production (Deploy)

```bash
npm run build
npm run start:prod
```

→ Tự động kết nối **database production** từ `.env.prod`

### 3. Migration/TypeORM Commands

```bash
# Development migrations
npm run migration:generate migration_name
npm run migration:run

# Các lệnh này tự động dùng .env.dev vì có dotenv -e .env.dev
```

## ⚙️ Cách Hoạt động

Hệ thống sử dụng biến `NODE_ENV` để xác định môi trường:

1. **ConfigModule** (app.module.ts):
   - `NODE_ENV=development` → load `.env.dev`
   - `NODE_ENV=production` → load `.env.prod`

2. **TypeORM Config** (typeorm.config.ts):
   - Tự động load file môi trường phù hợp dựa vào `NODE_ENV`

3. **Package.json scripts**:
   - `start:dev`: Set NODE_ENV=development và load .env.dev
   - `start:prod`: Set NODE_ENV=production và load .env.prod

## 🔧 Cập nhật Database Connection

### Development Database (`.env.dev`):

```env
DATABASE_URL='postgresql://postgres.jcfzmdteguojxkxfozes:xEvyBeFJ3EcvZlPv@aws-1-ap-south-1.pooler.supabase.com:6543/postgres'
```

### Production Database (`.env.prod`):

```env
DATABASE_URL='postgresql://postgres.wttdlqsclulqeimazkvw:OLBKeQiDaeTTPsEd@aws-1-ap-south-1.pooler.supabase.com:6543/postgres'
```

## ✅ Kiểm tra Kết nối

```bash
# Kiểm tra database connection
npm run check:db

# Liệt kê tables
npm run list:tables

# Kiểm tra admin account
npm run check:admin
```

## 🌐 Deploy to Railway/Vercel

Trên các platform cloud, set biến môi trường trực tiếp:

- `NODE_ENV=production`
- `DATABASE_URL=<production-database-url>`
- Các biến khác từ `.env.prod`

Platform sẽ tự động inject các biến này, không cần file .env
