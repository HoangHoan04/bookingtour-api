# ⚡ Quick Start - Deploy Backend trong 10 phút

## 🎯 Mục tiêu

Deploy backend lên `api.himlamtourist.xyz` bằng Railway

## ✅ Checklist Trước Khi Bắt Đầu

- [ ] Code đã được push lên GitHub
- [ ] Có tài khoản GitHub
- [ ] Có domain `himlamtourist.xyz` (đã mua)
- [ ] Database Supabase đã sẵn sàng
- [ ] Đã có các credentials (JWT_SECRET, Cloudinary, Google OAuth, etc.)

## 🚀 5 Bước Deploy

### 1️⃣ Đăng ký Railway (2 phút)

```
1. Vào https://railway.app
2. Click "Login with GitHub"
3. Authorize Railway
```

### 2️⃣ Deploy từ GitHub (1 phút)

```
1. Click "New Project" → "Deploy from GitHub repo"
2. Chọn repository "bookingtour-api"
3. Railway tự động build (đợi 3-5 phút)
```

### 3️⃣ Cấu hình Environment Variables (3 phút)

```
1. Click vào service → Tab "Variables"
2. Click "RAW Editor"
3. Copy nội dung từ file .env.example
4. Điền đầy đủ các giá trị thực:
   - DATABASE_URL (từ Supabase)
   - JWT_SECRET (generate bằng: node -e "console.log(require('crypto').randomBytes(64).toString('hex'))")
   - CLOUDINARY_API_SECRET
   - GOOGLE_CLIENT_ID & SECRET
   - ZNS keys
   - EMAIL credentials
5. Click "Update Variables"
6. Railway tự động redeploy
```

### 4️⃣ Cấu hình Custom Domain (3 phút)

```
1. Railway → Settings → Networking → Custom Domain
2. Nhập: api.himlamtourist.xyz
3. Railway cho bạn CNAME record
4. Vào nhà cung cấp domain (GoDaddy/Namecheap/Cloudflare):
   - Type: CNAME
   - Name: api
   - Value: bookingtour-api-production.up.railway.app
5. Đợi 15-60 phút (DNS propagate)
```

### 5️⃣ Kiểm Tra (1 phút)

```bash
# Health check
curl https://api.himlamtourist.xyz/health

# Swagger docs
https://api.himlamtourist.xyz/api-docs
```

## ✨ Hoàn Thành!

Backend của bạn đã online tại: **https://api.himlamtourist.xyz** 🎉

## 📝 Next Steps

1. **Cập nhật Frontend:**

   ```typescript
   // Sửa API_URL trong frontend
   const API_URL = 'https://api.himlamtourist.xyz/api';
   ```

2. **Test API:**
   - Thử login, register
   - Test các endpoints chính
   - Kiểm tra database connection

3. **Monitor:**
   - Railway Dashboard → View Logs
   - Theo dõi errors, performance

## 🐛 Gặp Vấn Đề?

| Vấn đề                 | Giải pháp                                |
| ---------------------- | ---------------------------------------- |
| Build failed           | Xem logs trong Railway Deployments       |
| App crashed            | Kiểm tra Variables, DATABASE_URL         |
| Domain không hoạt động | Đợi DNS propagate, check CNAME           |
| CORS error             | Đã config sẵn trong main.ts              |
| 500 error              | Check logs, verify environment variables |

## 📚 Tài Liệu Đầy Đủ

- **Railway:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Render (Free):** [DEPLOYMENT-RENDER.md](./DEPLOYMENT-RENDER.md)
- **API Docs:** [README.md](./README.md)

## 💡 Tips

- **Generate JWT Secret:**

  ```bash
  node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
  ```

- **Test DNS:**

  ```bash
  nslookup api.himlamtourist.xyz
  ```

- **View Railway Logs:**
  ```
  Railway Dashboard → Deployments → View Logs
  ```

## 💰 Chi Phí

- **Railway:** $5 credit/month (free tier)
- **Hoặc Render:** Hoàn toàn miễn phí (có cold start)

---

**Chúc bạn deploy thành công! 🚀**

_Nếu cần hỗ trợ, xem DEPLOYMENT.md để có hướng dẫn chi tiết hơn._
