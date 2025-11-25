# Hướng dẫn Deploy lên Vercel

## Bước 1: Kết nối GitHub với Vercel

1. Truy cập https://vercel.com
2. Đăng nhập bằng GitHub
3. Click "Add New Project"
4. Import repository: `nanlux-official/AI-Hoc-Cung-Toi`

## Bước 2: Cấu hình Project

### Framework Preset
- Chọn: **Other** (vì có cả frontend và backend)

### Root Directory
- Để trống (sử dụng root)

### Build Command
```bash
npm run vercel-build
```

### Output Directory
```
client/build
```

### Install Command
```bash
npm install
```

## Bước 3: Thêm Environment Variables

Trong Vercel Dashboard > Settings > Environment Variables, thêm:

```
GEMINI_API_KEY=AIzaSyAPfGgFaHYKqag_UzDJzROgDXRLtiIIhfI
NODE_ENV=production
```

## Bước 4: Deploy

Click "Deploy" và đợi Vercel build.

## Tự động Deploy

Sau khi setup xong, mỗi lần bạn push code lên GitHub:
- Branch `main` → Tự động deploy lên Production
- Branch khác → Tự động tạo Preview deployment

## Kiểm tra Deployment

1. Vào Vercel Dashboard
2. Click vào project
3. Tab "Deployments" để xem trạng thái
4. Tab "Domains" để xem URL của website

## Lưu ý

- Vercel sẽ tự động detect và deploy khi có commit mới
- Backend API sẽ chạy dưới dạng Serverless Functions
- Gemini API key đã được cấu hình trong Environment Variables

## Troubleshooting

Nếu build lỗi:
1. Kiểm tra logs trong Vercel Dashboard
2. Đảm bảo `vercel.json` đã được commit
3. Kiểm tra Environment Variables đã được thêm chưa
