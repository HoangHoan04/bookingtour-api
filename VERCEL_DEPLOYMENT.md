# 🚀 Hướng dẫn Deploy Backend lên Vercel

## ✅ Đã fix các lỗi sau:

1. ✅ Sửa lỗi import express trong main.ts
2. ✅ Thêm error handler cho bootstrap function
3. ✅ Cải thiện cấu hình vercel.json với routing cho api-docs
4. ✅ Thêm biến môi trường NODE_ENV
5. ✅ Tối ưu Cold Start với caching server

## 📋 Các bước Deploy

### Bước 1: Chuẩn bị Project

1. **Cài đặt Vercel CLI** (nếu chưa có):

```bash
npm install -g vercel
```

2. **Login vào Vercel**:

```bash
vercel login
```

### Bước 2: Cấu hình Environment Variables trên Vercel

Truy cập Vercel Dashboard và thêm các biến môi trường sau (hoặc dùng CLI):

#### **Biến bắt buộc:**

```bash
NODE_ENV=production
PORT=3000

# Database (sử dụng 1 trong 2 cách)
# Cách 1: DATABASE_URL (Khuyến nghị)
DATABASE_URL=postgresql://username:password@host:port/database

# Cách 2: Hoặc sử dụng từng biến riêng
TYPEORM_HOST=your_database_host
TYPEORM_PORT=5432
TYPEORM_USERNAME=your_username
TYPEORM_PASSWORD=your_password
TYPEORM_DATABASE=bookingtour_db
TYPEORM_LOGGING=false

# JWT
JWT_SECRET=your_strong_jwt_secret_key
JWT_EXPIRY=10h
JWT_REFRESH_SECRET=your_strong_refresh_secret_key
JWT_REFRESH_EXPIRY=7d
KEY_SECRET=your_strong_key_secret

# Rate Limiting
LIMIT_RQ_PER_SECOND_PER_IP=10
LIMIT_RQ_PER_MINUTE_PER_IP=100

# Email
EMAIL_VALIDATE_ACCOUNT=your_email@gmail.com
EMAIL_VALIDATE_PASSWORD=your_app_password
MILLISECOND_OTP_EFFECT=300000

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
LINK_UPLOAD=your_folder_name
```

#### **Biến tùy chọn (nếu dùng):**

```bash
# Zalo
ZNS_SECRETKEY=your_zns_secret
ZNS_APP_ID=your_app_id
ZALO_OAUTH_SECRET_KEY=your_oauth_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=https://your-domain.vercel.app/auth/google/callback
```

**Thêm qua Vercel CLI:**

```bash
vercel env add NODE_ENV
# Nhập: production

vercel env add DATABASE_URL
# Nhập: postgresql://...

# Thêm các biến khác tương tự
```

**Hoặc thêm qua Dashboard:**

1. Vào project trên Vercel
2. Settings → Environment Variables
3. Thêm từng biến một hoặc import từ `.env`

### Bước 3: Deploy

#### **Cách 1: Deploy qua CLI (Khuyến nghị)**

```bash
# Deploy lần đầu (preview)
vercel

# Deploy lên production
vercel --prod
```

#### **Cách 2: Deploy qua GitHub**

1. Push code lên GitHub repository
2. Import repository vào Vercel Dashboard
3. Vercel sẽ tự động deploy

```bash
git add .
git commit -m "Fix for Vercel deployment"
git push origin main
```

### Bước 4: Chạy Migration (Nếu cần)

Sau khi deploy, bạn có thể cần chạy migration. Có 2 cách:

**Cách 1: Qua Vercel CLI**

```bash
vercel env pull .env.prod
npm run migration:run:prod
```

**Cách 2: Sử dụng connection string trực tiếp**

```bash
# Kết nối vào database production và chạy migration thủ công
```

## 🎯 Kiểm tra Deploy thành công

### 1. Kiểm tra Status Code

```bash
curl -I https://your-domain.vercel.app/api
```

Kỳ vọng: HTTP 200 hoặc 404 (nếu route không tồn tại)

### 2. Kiểm tra API Docs

Truy cập: `https://your-domain.vercel.app/api-docs`

Bạn sẽ thấy Swagger UI với tất cả endpoints.

### 3. Kiểm tra Health Check

```bash
curl https://your-domain.vercel.app/api/health
```

### 4. Kiểm tra Logs trên Vercel

1. Vào Vercel Dashboard
2. Chọn project của bạn
3. Tab "Deployments" → Click vào deployment mới nhất
4. Xem logs để kiểm tra lỗi (nếu có)

### 5. Test một API endpoint

```bash
# Ví dụ: Test login endpoint
curl -X POST https://your-domain.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

## 🔍 Dấu hiệu Deploy Thành công

✅ **Deployment Status**: Ready (màu xanh)  
✅ **Build Logs**: No errors  
✅ **Function Logs**: Application starting logs hiển thị  
✅ **API Docs**: Truy cập được tại `/api-docs`  
✅ **API Endpoints**: Response đúng format  
✅ **Database**: Kết nối thành công

## ❌ Xử lý lỗi thường gặp

### Lỗi 1: "Function invocation failed"

**Nguyên nhân**: Thiếu biến môi trường hoặc database không kết nối được

**Giải pháp**:

- Kiểm tra lại Environment Variables trên Vercel
- Kiểm tra DATABASE_URL có đúng không
- Kiểm tra database có cho phép kết nối từ Vercel không

### Lỗi 2: "Build failed"

**Nguyên nhân**: Lỗi TypeScript hoặc thiếu dependencies

**Giải pháp**:

```bash
# Build thử trên local
npm run build

# Fix tất cả lỗi TypeScript
npm run lint
```

### Lỗi 3: "Module not found"

**Nguyên nhân**: Thiếu dependencies trong package.json

**Giải pháp**:

```bash
# Đảm bảo tất cả dependencies được install
npm install
npm run build
```

### Lỗi 4: "Timeout Error"

**Nguyên nhân**: Function chạy quá lâu (Vercel free: 10s limit)

**Giải pháp**:

- Tối ưu code
- Nâng cấp plan Vercel
- Sử dụng Background Jobs cho task nặng

### Lỗi 5: CORS Error

**Nguyên nhân**: Frontend không thể gọi API

**Giải pháp**: Đã có `app.enableCors()` trong main.ts, nhưng nếu cần cấu hình chi tiết:

```typescript
app.enableCors({
  origin: ['https://your-frontend-domain.com', 'http://localhost:3000'],
  credentials: true,
});
```

## 📊 Monitor và Optimize

### 1. Xem Function Performance

Vercel Dashboard → Analytics → Function Performance

### 2. Xem Error Logs

Vercel Dashboard → Deployments → Function Logs

### 3. Database Monitoring

Kiểm tra số lượng connections, query performance

## 🔄 Update sau khi Deploy

```bash
# Sau khi có thay đổi code
git add .
git commit -m "Update feature X"
git push origin main

# Hoặc deploy trực tiếp
vercel --prod
```

## 📝 Checklist cuối cùng

- [ ] Build thành công trên local (`npm run build`)
- [ ] Tất cả environment variables đã được thêm
- [ ] Database connection string đúng
- [ ] CORS được cấu hình
- [ ] API Docs hoạt động (`/api-docs`)
- [ ] Test ít nhất 1 endpoint thành công
- [ ] Migration đã chạy (nếu cần)
- [ ] Frontend có thể connect tới API

## 🎉 Kết luận

Sau khi hoàn thành các bước trên, backend của bạn đã được deploy thành công lên Vercel!

**URL API của bạn**: `https://[project-name].vercel.app/api`  
**Swagger Docs**: `https://[project-name].vercel.app/api-docs`

**Lưu ý**: Thay `[project-name]` bằng tên project của bạn trên Vercel.

---

## 🆘 Cần trợ giúp?

Nếu gặp lỗi, kiểm tra:

1. Vercel Function Logs
2. Build Logs
3. Environment Variables
4. Database Connection

Happy Deploying! 🚀
