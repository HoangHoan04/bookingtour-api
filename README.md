# 🚀 BookingTour API

Backend API cho hệ thống booking tour du lịch, xây dựng bằng NestJS.

## 📝 Tech Stack

- **Framework:** NestJS
- **Database:** PostgreSQL (Supabase)
- **ORM:** TypeORM
- **Authentication:** JWT, Google OAuth
- **File Upload:** Cloudinary
- **Documentation:** Swagger

## 🛠️ Development

### Prerequisites

- Node.js 20+
- Yarn
- PostgreSQL (hoặc Supabase)

### Installation

```bash
# Install dependencies
yarn install

# Copy environment variables
cp .env.example .env.dev

# Configure .env.dev with your values
# Then run development server
yarn start:dev
```

Server chạy tại: `http://localhost:4300`  
Swagger docs: `http://localhost:4300/api-docs`

### Available Scripts

```bash
yarn start:dev      # Development mode với hot-reload
yarn build          # Build production
yarn start:prod     # Run production build
yarn lint           # Lint code
yarn test           # Run tests
```

### Database Migration

```bash
# Generate migration
yarn migration:generate:dev

# Run migrations
yarn migration:run:dev
```

## 🚀 Deployment

### Option 1: Railway (Khuyến nghị)

- ⚡ Nhanh, stable, $5/month
- 📖 Xem hướng dẫn: [DEPLOYMENT.md](./DEPLOYMENT.md)

### Option 2: Render (Free)

- 🆓 Hoàn toàn miễn phí
- ⚠️ Có cold start
- 📖 Xem hướng dẫn: [DEPLOYMENT-RENDER.md](./DEPLOYMENT-RENDER.md)

### Quick Deploy Railway

```bash
# 1. Push code lên GitHub
git add .
git commit -m "Ready for deployment"
git push origin main

# 2. Vào https://railway.app
# 3. Deploy from GitHub repo
# 4. Add environment variables từ .env.example
# 5. Cấu hình domain: api.himlamtourist.xyz
```

Chi tiết xem file [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🌍 Production URLs

- **API:** https://api.himlamtourist.xyz
- **Swagger:** https://api.himlamtourist.xyz/api-docs
- **Health Check:** https://api.himlamtourist.xyz/health

## 📚 API Documentation

Swagger documentation available at `/api-docs` endpoint.

### Main Endpoints

- `GET /health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/tours` - Get all tours
- ... (xem Swagger để biết full endpoints)

## 🔐 Environment Variables

Xem file [.env.example](./.env.example) để biết tất cả biến môi trường cần thiết.

**Quan trọng:**

- `DATABASE_URL` - Supabase PostgreSQL connection
- `JWT_SECRET` - Secret key cho JWT
- `CLOUDINARY_*` - Cloudinary credentials
- `GOOGLE_CLIENT_*` - Google OAuth

## 🏗️ Project Structure

```
src/
├── common/          # Shared utilities, filters, guards
├── config/          # Configuration modules
├── database/        # Database setup
├── dto/             # Data Transfer Objects
├── entities/        # TypeORM entities
├── modules/         # Feature modules
│   ├── auth/
│   ├── tours/
│   ├── bookings/
│   └── ...
├── migrations/      # Database migrations
├── repositories/    # Custom repositories
├── services/        # Shared services
└── main.ts         # Application entry point
```

## 🔧 Configuration

### CORS

CORS đã được cấu hình cho các domains:

- `https://himlamtourist.xyz` (customer)
- `https://admin.himlamtourist.xyz` (admin)
- `http://localhost:*` (development)

### Rate Limiting

- 10 requests/second per IP
- 100 requests/minute per IP

## 🐛 Troubleshooting

### Database Connection Error

```bash
# Check DATABASE_URL format
postgresql://user:password@host:6543/database

# Test connection
yarn test:db
```

### Build Failed

```bash
# Clear dist and node_modules
rm -rf dist node_modules
yarn install
yarn build
```

### Port Already in Use

```bash
# Change PORT in .env.dev
PORT=4301
```

## 📞 Support

- **GitHub:** [Repository URL]
- **Developer:** Your Team Name
- **Email:** your.email@example.com

## 📄 License

Private - All rights reserved

---

**Chúc bạn deploy thành công! 🎉**

Nếu gặp vấn đề, xem [DEPLOYMENT.md](./DEPLOYMENT.md) hoặc check logs.
