# 🚂 Railway Deployment Guide

## Vấn Đề Healthcheck Failed

Nếu bạn gặp lỗi:

```
Attempt #1 failed with service unavailable
1/1 replicas never became healthy!
Healthcheck failed!
```

**Nguyên nhân:** Ứng dụng không thể start do thiếu environment variables hoặc database connection fail.

## ✅ Giải Pháp: Cấu Hình Environment Variables

### Bước 1: Vào Railway Project Settings

1. Mở project trên Railway dashboard
2. Click vào service của bạn
3. Vào tab **Variables**

### Bước 2: Thêm Các Environment Variables Sau

#### 🔧 Required Variables (Bắt buộc)

```bash
# Node Environment
NODE_ENV=production

# Port (Railway tự động set, nhưng có thể override)
PORT=4300

# Database Connection (QUAN TRỌNG!)
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE

# Hoặc dùng các biến riêng:
TYPEORM_HOST=aws-1-ap-south-1.pooler.supabase.com
TYPEORM_PORT=6543
TYPEORM_USERNAME=postgres.jcfzmdteguojxkxfozes
TYPEORM_PASSWORD=xEvyBeFJ3EcvZlPv
TYPEORM_DATABASE=bookingtour-db-dev
TYPEORM_LOGGING=false

# JWT Secrets
JWT_SECRET=ewfbufqoufheqiebvehf0_!!!!ưqhf0qh02138912u4713rt123421
JWT_EXPIRY=10h
JWT_REFRESH_SECRET=refresh_secret_key_here
JWT_REFRESH_EXPIRY=7d
KEY_SECRET=sdfjkhfksjhfksjhfksjhfksjhfksjhfsdjh

# Rate Limiting
LIMIT_RQ_PER_SECOND_PER_IP=10
LIMIT_RQ_PER_MINUTE_PER_IP=100

# Email (SMTP)
EMAIL_VALIDATE_ACCOUNT=hoanghoanpineapple04@gmail.com
EMAIL_VALIDATE_PASSWORD=beay oilc enwz pnzs
MILLISECOND_OTP_EFFECT=300000
```

#### 🎨 Cloudinary (Image Upload)

```bash
CLOUDINARY_CLOUD_NAME=djyrtlm4t
CLOUDINARY_API_KEY=917163712376698
CLOUDINARY_API_SECRET=l5R4x4BXKX4aWoHGI4UNpJjmeEA
LINK_UPLOAD=naohshop-image
```

#### 🔐 Google OAuth (Optional)

```bash
GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=https://your-railway-url.railway.app/auth/google/callback
```

#### 📱 Zalo Integration (Optional)

```bash
ZNS_SECRETKEY=YOUR_ZNS_SECRETKEY_HERE
ZNS_APP_ID=YOUR_ZNS_APP_ID_HERE
ZALO_OAUTH_SECRET_KEY=YOUR_ZALO_OAUTH_SECRET_KEY_HERE
```

### Bước 3: Deploy Lại

Sau khi thêm variables:

1. Railway sẽ tự động redeploy
2. Hoặc click **Deploy** để trigger manual deployment

---

## 🔍 Cách Kiểm Tra Logs

### Xem Logs Trên Railway

1. Click vào deployment của bạn
2. Tab **Deployments** → Click vào latest deployment
3. Xem **Build Logs** và **Deploy Logs**

### Những Gì Cần Tìm Trong Logs

✅ **Thành công:**

```
🔄 Initializing database connection...
✅ Database connected successfully!
==================================================
🚀 Application started successfully!
📍 Environment: production
🌐 Listening on: 0.0.0.0:4300
💚 Health Check: http://0.0.0.0:4300/health
==================================================
```

❌ **Lỗi:**

```
❌ Database Connection Error: ...
Database Config:
- TYPEORM_HOST: NOT SET
- DATABASE_URL: NOT SET
```

Nếu thấy "NOT SET" → Bạn chưa add environment variables

---

## 🎯 Quick Checklist

- [ ] Đã thêm `DATABASE_URL` hoặc các `TYPEORM_*` variables
- [ ] Đã thêm `JWT_SECRET` và các secrets khác
- [ ] Database của bạn đang chạy và accessible từ internet
- [ ] Nếu dùng Supabase, đã enable pooler connection
- [ ] Railway đã redeploy với variables mới

---

## 🔧 Testing Railway URL

Sau khi deploy thành công, Railway sẽ cung cấp public URL:

```bash
# Health check
curl https://your-app.railway.app/health

# Should return:
{
  "status": "ok",
  "message": "API is healthy",
  "timestamp": "2026-03-08T...",
  "uptime": 123.456
}
```

```bash
# API root
curl https://your-app.railway.app/api

# API docs (Swagger)
# Open in browser: https://your-app.railway.app/api-docs
```

---

## 🚨 Common Issues

### Issue 1: Database Connection Timeout

**Error:** `connection timeout`

**Solution:**

- Kiểm tra database có allow connections từ external IPs không
- Nếu dùng Supabase, dùng pooler connection (port 6543)
- Check database firewall rules

### Issue 2: Port Already in Use

**Error:** `EADDRINUSE`

**Solution:** Railway tự động assign port, đảm bảo code của bạn đọc `process.env.PORT`

### Issue 3: Module Not Found

**Error:** `Cannot find module`

**Solution:**

- Kiểm tra `package.json` có đầy đủ dependencies
- Railway phải chạy `yarn install` thành công
- Xem build logs để kiểm tra

### Issue 4: Memory Issues

**Error:** `JavaScript heap out of memory`

**Solution:**

- Nâng cấp Railway plan (free tier có giới hạn)
- Reduce build size
- Optimize dependencies

---

## 📊 Railway vs Other Platforms

| Feature           | Railway   | Heroku | Render  |
| ----------------- | --------- | ------ | ------- |
| Health Check Path | `/health` | Any    | Any     |
| Port Variable     | `PORT`    | `PORT` | `PORT`  |
| Auto Deploy       | ✅        | ✅     | ✅      |
| Free Tier         | Limited   | No     | Limited |
| Docker Support    | ✅        | ✅     | ✅      |

---

## 🎓 Advanced: Custom Healthcheck Path

Nếu muốn thay đổi healthcheck path trên Railway:

1. Vào **Service Settings**
2. Tab **Health Check**
3. Thay đổi `Path` từ `/health` sang path khác
4. Save và redeploy

---

## 📞 Support

Nếu vẫn gặp vấn đề:

1. **Check Railway Logs** - Xem chi tiết deployment logs
2. **Railway Discord** - https://discord.gg/railway
3. **Railway Docs** - https://docs.railway.app

---

## 🎉 Success!

Khi deploy thành công, bạn sẽ thấy:

- ✅ Build completed
- ✅ Healthcheck passed
- ✅ Service is live với public URL
- ✅ API có thể access được

Chúc mừng! 🚀
