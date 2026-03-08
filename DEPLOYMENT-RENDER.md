# Deploy Backend với Render (Free Alternative)

## 🆓 Option 2: Render (Free Tier)

Nếu bạn muốn deploy **hoàn toàn miễn phí**, dùng Render:

### ⚠️ Lưu ý Render Free Tier:

- ✅ **Hoàn toàn miễn phí**
- ⚠️ **Cold start:** API sẽ "ngủ" sau 15 phút không hoạt động
- ⚠️ Request đầu tiên sau khi ngủ sẽ mất 30-60 giây để "đánh thức"
- ⚠️ 750 giờ/tháng (đủ cho 1 instance)

### Các bước deploy:

#### 1. Đăng ký Render

1. Truy cập https://render.com
2. Sign up với GitHub

#### 2. Tạo Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect repository `bookingtour-api`
3. Cấu hình:
   - **Name:** `bookingtour-api`
   - **Region:** `Singapore` (gần Việt Nam nhất)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `yarn install && yarn build`
   - **Start Command:** `node dist/main`
   - **Plan:** `Free`

#### 3. Thêm Environment Variables

Trong phần **Environment**, thêm tất cả variables từ `.env.example`

#### 4. Deploy

- Click **"Create Web Service"**
- Đợi 5-10 phút để build
- Bạn sẽ có URL: `https://bookingtour-api.onrender.com`

#### 5. Custom Domain

1. Vào **Settings** → **Custom Domain**
2. Add `api.himlamtourist.xyz`
3. Cấu hình DNS:
   - **Type:** CNAME
   - **Name:** api
   - **Value:** bookingtour-api.onrender.com

---

## So sánh Railway vs Render

| Feature           | Railway         | Render              |
| ----------------- | --------------- | ------------------- |
| **Free Tier**     | $5 credit/month | Hoàn toàn free      |
| **Cold Start**    | ❌ Không        | ✅ Có (15 min)      |
| **Performance**   | ⚡ Nhanh hơn    | 🐢 Chậm hơn (free)  |
| **Auto-deploy**   | ✅              | ✅                  |
| **Custom Domain** | ✅              | ✅                  |
| **SSL**           | ✅ Auto         | ✅ Auto             |
| **Khuyến nghị**   | ⭐ Production   | 💡 Testing/Learning |

---

## Kết luận

- **Railway:** Tốt hơn cho production, $5/month
- **Render Free:** Tốt cho học tập, demo, chi phí $0

Nếu API cần **always online** và **responsive** → Dùng **Railway**  
Nếu chỉ **demo/testing** và chấp nhận cold start → Dùng **Render Free**
