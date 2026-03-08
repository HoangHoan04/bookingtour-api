# Hướng dẫn chạy Migration cho Production Database

## Vấn đề hiện tại

Database production đang **RỖNG** (chưa có bảng nào), nhưng migration hiện tại đang cố ALTER các bảng chưa tồn tại → sẽ **LỖI**.

## Giải pháp: Generate migration mới từ entities

### **Bước 1: Cấu hình .env.prod**

Mở file `.env.prod` và điền thông tin database production:

```env
# CÁCH 1: Dùng CONNECTION STRING (Khuyến nghị)
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require

# HOẶC CÁCH 2: Dùng biến riêng lẻ
TYPEORM_HOST=your-production-host.com
TYPEORM_PORT=5432
TYPEORM_USERNAME=your_username
TYPEORM_PASSWORD=your_password
TYPEORM_DATABASE=your_database_name

TYPEORM_LOGGING=false
NODE_ENV=production
```

### **Bước 2: Generate migration ban đầu**

Vì database production đang rỗng, cần tạo migration khởi tạo toàn bộ schema:

```powershell
# Generate migration từ entities hiện tại
yarn migration:generate:prod

# Lưu ý: Đặt tên file migration có ý nghĩa, ví dụ: initial_schema
```

Migration này sẽ tạo **TẤT CẢ** các bảng từ entities của bạn.

### **Bước 3: Xóa migration cũ (nếu cần)**

Nếu migration cũ `1772990826514-test_check.ts` không cần thiết, xóa nó đi:

```powershell
rm src/migrations/1772990826514-test_check.ts
```

### **Bước 4: Chạy migration trên production**

```powershell
# Chạy tất cả migrations
yarn migration:run:prod

# Kiểm tra logs để đảm bảo thành công
```

### **Bước 5: Verify database**

Kết nối vào database production và kiểm tra:

```sql
-- Xem tất cả bảng
SELECT tablename FROM pg_tables WHERE schemaname='public' ORDER BY tablename;

-- Hoặc dùng script có sẵn
yarn list:tables
```

## Các lệnh hữu ích

| Lệnh                           | Mô tả                                        |
| ------------------------------ | -------------------------------------------- |
| `yarn migration:generate:prod` | Tạo migration mới từ entities cho production |
| `yarn migration:run:prod`      | Chạy migrations trên production              |
| `yarn migration:revert:prod`   | Rollback migration cuối cùng                 |
| `yarn check:db`                | Kiểm tra kết nối database                    |
| `yarn list:tables`             | Liệt kê tất cả bảng trong database           |

## ⚠️ Lưu ý quan trọng

1. **Backup database trước khi chạy migration** (nếu có dữ liệu)
2. **Kiểm tra file .env.prod** - đảm bảo thông tin kết nối đúng
3. **Test migration trên staging trước** (nếu có)
4. **Không dùng synchronize:true trên production** (đã được vô hiệu hóa)
5. **Chạy migration trong maintenance window** để tránh ảnh hưởng users

## Troubleshooting

### Lỗi: "relation does not exist"

→ Migration đang ALTER bảng chưa tồn tại. Cần generate migration mới từ đầu.

### Lỗi: "connection timeout"

→ Kiểm tra firewall, IP whitelist, hoặc tăng `connectionTimeoutMillis` trong typeorm.config.ts

### Lỗi: "too many clients"

→ Database đã đạt giới hạn connections. Giảm `max` pool size trong config.

## Alternative: Chạy migration trực tiếp với TypeORM CLI

```powershell
# Nếu package.json scripts không hoạt động
dotenv -e .env.prod -- npx typeorm migration:run -d ./src/typeorm/typeorm.config.ts
```
