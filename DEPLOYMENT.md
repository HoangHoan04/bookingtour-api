# 🚀 Hướng Dẫn Deploy Backend lên Railway với Custom Domain

## 📋 Mục Lục

1. [Chuẩn Bị](#chuẩn-bị)
2. [Deploy lên Railway](#deploy-lên-railway)
3. [Cấu hình Domain himlamtourist.xyz](#cấu-hình-domain)
4. [Kiểm tra & Troubleshooting](#kiểm-tra)

---

## 1️⃣ Chuẩn Bị

### ✅ Checklist trước khi deploy:

- [ ] Có tài khoản GitHub (để kết nối với Railway)
- [ ] Code đã được push lên GitHub repository
- [ ] Database Supabase đã setup xong (đã có sẵn trong config)
- [ ] Có domain `himlamtourist.xyz` (đã mua)

### 📦 Files cần thiết (đã tạo sẵn):

- `Dockerfile` - Build Docker image
- `.dockerignore` - Ignore files không cần thiết
- `railway.json` - Cấu hình Railway
- `.env.example` - Template biến môi trường

---

## 2️⃣ Deploy lên Railway

### **Bước 1: Đăng ký/Đăng nhập Railway**

1. Truy cập https://railway.app
2. Click **"Login with GitHub"**
3. Cho phép Railway truy cập GitHub repositories của bạn

### **Bước 2: Tạo Project mới**

1. Click **"New Project"**
2. Chọn **"Deploy from GitHub repo"**
3. Chọn repository `bookingtour-api` của bạn
4. Railway sẽ tự động detect Dockerfile và bắt đầu build

### **Bước 3: Cấu hình Environment Variables**

1. Vào project vừa tạo
2. Click vào service (tên repo)
3. Chọn tab **"Variables"**
4. Click **"RAW Editor"** và paste tất cả biến môi trường:

```bash
# Copy từ file .env.example và điền đầy đủ thông tin
NODE_ENV=production
PORT=4300

# Database (Supabase)
DATABASE_URL=postgresql://postgres.xxxxx:password@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
TYPEORM_HOST=aws-1-ap-south-1.pooler.supabase.com
TYPEORM_PORT=6543
TYPEORM_USERNAME=postgres.xxxxx
TYPEORM_PASSWORD=your_password
TYPEORM_DATABASE=bookingtour-db-prod
TYPEORM_LOGGING=false

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRY=10h
JWT_REFRESH_EXPIRY=7d
KEY_SECRET=your_key_secret

# Rate Limiting
LIMIT_RQ_PER_SECOND_PER_IP=10
LIMIT_RQ_PER_MINUTE_PER_IP=100

# OTP
MILLISECOND_OTP_EFFECT=300000

# Cloudinary
CLOUDINARY_CLOUD_NAME=djyrtlm4t
CLOUDINARY_API_KEY=917163712376698
CLOUDINARY_API_SECRET=your_api_secret
LINK_UPLOAD=naohshop-image

# Zalo
ZNS_SECRETKEY=your_zns_secret
ZNS_APP_ID=your_app_id
ZALO_OAUTH_SECRET_KEY=your_oauth_key

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_CALLBACK_URL=https://api.himlamtourist.xyz/auth/google/callback

# Email
EMAIL_VALIDATE_ACCOUNT=your_email@gmail.com
EMAIL_VALIDATE_PASSWORD=your_app_password
```

5. Click **"Update Variables"**

**⚠️ LƯU Ý QUAN TRỌNG:**

- Thay TẤT CẢ các giá trị `your_xxx` bằng giá trị thực
- Kiểm tra kỹ DATABASE_URL từ Supabase
- JWT_SECRET phải là chuỗi random an toàn (dùng tool generate)

### **Bước 4: Deploy**

1. Sau khi thêm variables, Railway sẽ tự động **redeploy**
2. Đợi 2-5 phút để build và deploy
3. Kiểm tra logs bằng cách click vào **"Deployments"** → **"View logs"**

### **Bước 5: Lấy Railway Domain**

1. Vào tab **"Settings"**
2. Phần **"Networking"** → **"Public Networking"**
3. Click **"Generate Domain"**
4. Bạn sẽ có domain dạng: `bookingtour-api-production.up.railway.app`
5. Test bằng cách truy cập: `https://bookingtour-api-production.up.railway.app/api-docs`

---

## 3️⃣ Cấu hình Domain `himlamtourist.xyz`

### **Option A: Subdomain (Khuyến nghị)**

Dùng subdomain `api.himlamtourist.xyz` cho backend

#### **Bước 1: Thêm Custom Domain vào Railway**

1. Vào **Settings** → **Networking** → **Custom Domains**
2. Click **"Custom Domain"**
3. Nhập: `api.himlamtourist.xyz`
4. Railway sẽ cho bạn một CNAME record

#### **Bước 2: Cấu hình DNS**

Vào nhà cung cấp domain của bạn (GoDaddy, Namecheap, Cloudflare, etc.) và thêm:

**Type:** `CNAME`  
**Name:** `api`  
**Value:** `bookingtour-api-production.up.railway.app` (hoặc giá trị Railway cung cấp)  
**TTL:** `3600` (hoặc để Auto)

#### **Bước 3: Đợi DNS propagate**

- Thường mất **15-60 phút**
- Kiểm tra bằng lệnh:

```bash
nslookup api.himlamtourist.xyz
```

#### **Bước 4: Xác nhận trên Railway**

1. Quay lại Railway, domain sẽ tự động verify
2. Railway sẽ tự động cấp **SSL certificate** (HTTPS)
3. Test: `https://api.himlamtourist.xyz/api-docs`

### **Option B: Root Domain (Phức tạp hơn)**

Nếu muốn dùng `himlamtourist.xyz` trực tiếp:

1. Cần dùng **A record** hoặc **ALIAS/ANAME**
2. Railway không hỗ trợ direct IP, cần dùng **Cloudflare** làm proxy
3. Hoặc để frontend ở root, backend ở subdomain (khuyến nghị)

---

## 4️⃣ Kiểm tra & Troubleshooting

### ✅ Kiểm tra API hoạt động:

```bash
# 1. Health Check
curl https://api.himlamtourist.xyz/health

# 2. Swagger Docs
https://api.himlamtourist.xyz/api-docs

# 3. Test endpoint
curl https://api.himlamtourist.xyz/api/your-endpoint
```

### 🐛 Troubleshooting

#### **1. Build Failed**

- Kiểm tra logs trong Railway Deployments
- Đảm bảo `package.json` có đầy đủ dependencies
- Kiểm tra Dockerfile syntax

#### **2. Application Crashed**

**Nguyên nhân thường gặp:**

- Thiếu biến môi trường → Kiểm tra lại Variables
- Database connection failed → Verify DATABASE_URL
- Port không đúng → Đảm bảo PORT=4300

**Cách check:**

```bash
# Xem logs chi tiết
Railway Dashboard → Deployments → View Logs
```

#### **3. Domain không hoạt động**

- Đợi DNS propagate (tối đa 24h, thường 1h)
- Kiểm tra CNAME record đã đúng chưa
- Clear browser cache hoặc dùng Incognito

#### **4. CORS Error**

- File `main.ts` đã có sẵn CORS config
- Nếu cần thêm origin, sửa trong `src/main.ts`:

```typescript
app.enableCors({
  origin: [
    'https://himlamtourist.xyz',
    'https://admin.himlamtourist.xyz',
    'https://api.himlamtourist.xyz', // Thêm nếu cần
    // ... other origins
  ],
  credentials: true,
});
```

#### **5. Database Connection Failed**

```bash
# Kiểm tra connection string
# Đảm bảo dùng Supabase Transaction Pooler (port 6543)
# Format: postgresql://user:password@host:6543/database
```

---

## 5️⃣ Cập nhật Frontend để gọi API mới

Sau khi deploy xong, cập nhật frontend để trỏ đến domain mới:

### **bookingtour-admin** và **bookingtour-customer**

Tìm file config API (thường là `src/services/api.service.ts` hoặc `.env`):

```typescript
// Before
const API_URL = 'http://localhost:4300/api';

// After
const API_URL = 'https://api.himlamtourist.xyz/api';
```

Hoặc trong `.env`:

```bash
VITE_API_URL=https://api.himlamtourist.xyz/api
```

---

## 6️⃣ Auto-deploy từ GitHub

Railway đã tự động setup **CI/CD**:

1. Mỗi khi bạn push code lên GitHub
2. Railway tự động detect changes
3. Tự động build và deploy
4. Không cần làm gì thêm! 🎉

---

## 💰 Chi Phí Railway

### **Free Tier:**

- $5 credit mỗi tháng (miễn phí)
- Đủ cho dự án nhỏ/學習

### **Khi hết Free Credit:**

- $5/month cho 5GB RAM, 200GB bandwidth
- Thanh toán theo usage (pay-as-you-go)

**Tips tiết kiệm:**

- Optimize Docker image size
- Dùng environment variables thay vì rebuild
- Scale down khi không cần

---

## 📞 Support & Resources

- **Railway Docs:** https://docs.railway.app
- **Railway Discord:** https://discord.gg/railway
- **NestJS Docs:** https://docs.nestjs.com

---

## ✨ Tổng Kết

**Bạn đã hoàn thành:**

- ✅ Deploy backend NestJS lên Railway
- ✅ Cấu hình custom domain `api.himlamtourist.xyz`
- ✅ Setup auto-deploy từ GitHub
- ✅ SSL/HTTPS tự động
- ✅ Monitoring và logs

**Next Steps:**

1. Deploy frontend lên Vercel/Netlify
2. Cấu hình `himlamtourist.xyz` cho frontend
3. Cấu hình `admin.himlamtourist.xyz` cho admin panel

---

## 🎯 Quick Commands

```bash
# Generate strong JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Test DNS propagation
nslookup api.himlamtourist.xyz

# Test API
curl https://api.himlamtourist.xyz/health

# View Railway logs (CLI)
railway logs
```

---

**Chúc bạn deploy thành công! 🚀**

Nếu gặp vấn đề gì, check lại từng bước hoặc xem logs để debug.
