# 🔧 Troubleshooting - Fix Deploy Errors

## ❌ Error: "Application failed to respond"

### Nguyên nhân thường gặp:

#### 0. **"Command 'start:server' not found" (FIXED)**

**Triệu chứng:**

```
error Command "start:server" not found.
yarn run v1.22.22
```

**✅ ĐÃ FIX:**

- Thêm script `start:server` vào package.json
- Tạo Procfile với command đúng
- Tạo nixpacks.toml để Railway build đúng cách
- Xóa `startCommand` khỏi railway.json (dùng Dockerfile CMD thay thế)

**Bây giờ hãy:**

```bash
# Commit và push lại
git add .
git commit -m "Fix: Add start:server script and Procfile"
git push

# Railway sẽ tự động redeploy
```

#### 1. **Environment Variables thiếu hoặc sai**

**Triệu chứng:**

```
Application failed to respond
Request ID: xxxxx
```

**Giải pháp:**

```bash
# Kiểm tra Railway/Render Variables
# Đảm bảo có ĐẦY ĐỦ các biến:

✅ NODE_ENV=production
✅ PORT=4300
✅ DATABASE_URL=postgresql://...
✅ JWT_SECRET=xxx
✅ JWT_REFRESH_SECRET=xxx
✅ TYPEORM_HOST=xxx
✅ TYPEORM_PORT=6543
✅ TYPEORM_USERNAME=xxx
✅ TYPEORM_PASSWORD=xxx
✅ TYPEORM_DATABASE=xxx
```

**Check logs:**

- Railway: Deployments → View Logs
- Render: Logs tab

#### 2. **Database Connection Failed**

**Triệu chứng trong logs:**

```
Error: connect ECONNREFUSED
Error: password authentication failed
```

**Giải pháp:**

1. Verify Supabase connection string:

   ```
   postgresql://postgres.xxxxx:password@host:6543/database
   ```

2. Kiểm tra:
   - Username có đúng format `postgres.xxxxx`?
   - Password có đặc biệt ký tự? → URL encode
   - Port phải là `6543` (Transaction Pooler)
   - Database name có tồn tại?

3. Test local:
   ```bash
   # Trong .env, test connection
   yarn start:dev
   ```

#### 3. **Port Configuration Sai**

**Triệu chứng:**

```
Application failed to respond
Address already in use
```

**Giải pháp:**

```bash
# Railway/Render tự động set PORT
# Đảm bảo code listen trên process.env.PORT

# File fixed: src/main.ts
const port = configService.get('PORT') || 4300;
await app.listen(port, '0.0.0.0');  # ← Must bind to 0.0.0.0
```

#### 4. **Health Check Failed**

**Triệu chứng:**

```
Health check timeout
Failed to respond on /health
```

**Giải pháp:**
✅ **FIXED trong commit này:**

- Removed versioning từ AppController
- Health endpoint bây giờ là `/health` (không phải `/v1.00/health`)
- Test: `curl https://your-app.railway.app/health`

#### 5. **Build Failed**

**Check logs:**

```bash
# Railway/Render → Deployments → Build Logs

# Common errors:
- "Module not found" → Missing dependency
- "TypeScript error" → Fix code errors
- "Out of memory" → Reduce build size
```

**Giải pháp:**

```bash
# Test build locally
yarn build

# If success locally → push again
git add .
git commit -m "Fix build"
git push
```

---

## 🔍 Debug Checklist

### Bước 1: Kiểm tra Logs

```
Railway/Render Dashboard → Logs
```

Look for:

- ❌ `Error: ` messages
- ❌ `Connection refused`
- ❌ `Cannot find module`
- ✅ `🚀 Application is running`

### Bước 2: Test Health Endpoint

**Sau khi deploy:**

```bash
# Test health check
curl https://your-app.railway.app/health

# Expected response:
{
  "status": "ok",
  "message": "API is healthy",
  "timestamp": "2026-03-08T...",
  "uptime": 123.45
}
```

### Bước 3: Verify Environment Variables

```bash
# Railway: Settings → Variables
# Render: Environment → Environment Variables

# Must have:
✅ NODE_ENV
✅ PORT
✅ DATABASE_URL
✅ JWT_SECRET
✅ All TYPEORM_* variables
```

### Bước 4: Check Database Connection

**Create test script** `src/test-db.ts`:

```typescript
import { DataSource } from 'typeorm';

const testConnection = async () => {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Database connected!');
    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Database connection failed:', error);
  }
};

testConnection();
```

Run locally:

```bash
dotenv -e .env.prod -- ts-node src/test-db.ts
```

---

## 🚨 Common Errors & Solutions

### Error 1: "connect ECONNREFUSED"

```bash
❌ Error: connect ECONNREFUSED 127.0.0.1:5432

Fix: Check DATABASE_URL
    - Must use Supabase host, not localhost
    - Use port 6543 (Transaction Pooler)
```

### Error 2: "password authentication failed"

```bash
❌ Error: password authentication failed for user "postgres"

Fix:
    1. Copy password exactly from Supabase
    2. URL encode special characters:
       @ → %40
       # → %23
       $ → %24
```

### Error 3: "Cannot find module"

```bash
❌ Error: Cannot find module '@nestjs/common'

Fix:
    1. Check package.json dependencies
    2. Ensure yarn.lock is committed
    3. Clear Railway build cache (Redeploy)
```

### Error 4: "Application timeout"

```bash
❌ Health check timeout after 100s

Fix:
    1. Check /health endpoint exists
    2. Ensure app listens on 0.0.0.0
    3. Increase healthcheckTimeout in railway.json
```

### Error 5: "Out of memory during build"

```bash
❌ JavaScript heap out of memory

Fix: Add to package.json scripts:
"build": "NODE_OPTIONS='--max-old-space-size=4096' nest build"
```

---

## ✅ Quick Fixes

### Fix 1: Redeploy

```bash
# Trigger new deployment
git commit --allow-empty -m "Trigger redeploy"
git push
```

### Fix 2: Clear Cache

```
Railway: Settings → Delete Service → Recreate
Render: Manual Deploy → Clear build cache
```

### Fix 3: Check Service Status

```
Railway: Service → Deployments → Latest
Should show: ✅ Deployed
```

### Fix 4: Restart Service

```
Railway: Settings → Restart
Render: Manual Deploy → Deploy latest commit
```

---

## 📊 Monitoring

### 1. Railway Logs

```
Real-time logs:
railway logs --follow
```

### 2. Custom Health Endpoint

```bash
# Check every 30s
watch -n 30 curl https://api.himlamtourist.xyz/health
```

### 3. Uptime Monitoring (Optional)

- UptimeRobot (free)
- Better Uptime
- Pingdom

---

## 💡 Prevention Tips

### 1. Test Local First

```bash
# Always test before deploy
yarn build
yarn start:prod
curl http://localhost:4300/health
```

### 2. Use .env.example Template

```bash
# Copy and fill all variables
cp .env.example .env.prod
# Fill all values, then copy to Railway
```

### 3. Commit Essential Files

```bash
git add Dockerfile .dockerignore railway.json
git add src/
git add package.json yarn.lock
git commit -m "Deployment ready"
```

### 4. Monitor First Deploy

```bash
# Watch logs during first deploy
Railway: Deployments → View Logs (live)

# Look for:
✅ "Build completed"
✅ "Application is running"
✅ "Health check passed"
```

---

## 🆘 Still Having Issues?

### 1. Share Logs

```bash
# Copy last 100 lines of logs
Railway: Logs → Copy

# Share in:
- GitHub Issues
- Discord/Support channel
```

### 2. Check Railway Status

https://status.railway.app

### 3. Try Alternative Platform

If Railway fails → Try Render (see DEPLOYMENT-RENDER.md)

---

## 📞 Get Help

- **Railway Discord:** https://discord.gg/railway
- **Railway Docs:** https://docs.railway.app
- **NestJS Discord:** https://discord.gg/nestjs

---

## ✨ Success Checklist

After fixing, verify:

- [ ] Build completes successfully
- [ ] Deployment shows "Live"
- [ ] `/health` returns 200 OK
- [ ] `/api-docs` loads Swagger
- [ ] Can make API requests
- [ ] Database queries work
- [ ] No errors in logs

**If all ✅ → You're deployed! 🎉**
