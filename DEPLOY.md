# Hướng Dẫn Deploy Lên Vercel

## Bước 1: Chuẩn Bị

1. Tạo tài khoản tại [Vercel](https://vercel.com)
2. Đảm bảo code đã push lên GitHub

## Bước 2: Import Project vào Vercel

1. Vào [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Import repository từ GitHub: `AI-Hoc-Cung-Toi`
4. **QUAN TRỌNG**: Cấu hình như sau:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (để trống hoặc root)
   - **Build Command**: Để trống (Vercel sẽ dùng vercel.json)
   - **Output Directory**: Để trống (Vercel sẽ dùng vercel.json)
   - **Install Command**: Để trống

## Bước 3: Cấu Hình Environment Variables

Trong Vercel Dashboard → Settings → Environment Variables:

Thêm biến:
- **Name**: `GEMINI_API_KEY`
- **Value**: API key của bạn từ [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Environment**: Chọn tất cả (Production, Preview, Development)

## Bước 4: Deploy

1. Click **Deploy** 
2. Đợi build hoàn tất (khoảng 2-3 phút)
3. Vercel sẽ cung cấp URL: `https://your-app.vercel.app`

## Cấu Trúc Deploy

```
Root
├── api/
│   └── gemini.js          → Serverless Function (auto-detected)
├── client/
│   ├── build/             → Static files (được build bởi Vercel)
│   ├── public/
│   └── src/
├── vercel.json            → Cấu hình build & routing
└── .vercelignore          → Files bỏ qua khi deploy
```

## Cách Hoạt Động

1. **Build Process**:
   - Vercel đọc `vercel.json`
   - Build React app từ `client/` folder với `@vercel/static-build`
   - Output vào `client/build/`
   - Deploy API functions từ `api/` folder với `@vercel/node`

2. **Routing**:
   - `/api/*` → API serverless functions
   - `/*` → React app (SPA)

## Kiểm Tra Sau Deploy

✅ Trang chủ load được  
✅ AI Mentor có thể chat  
✅ API endpoint hoạt động: `https://your-app.vercel.app/api/gemini/generate`  
✅ Environment variable đã set đúng  

## Troubleshooting

### Lỗi: Build Failed - ESLint Warnings

**Giải pháp**: Đã fix bằng `CI=false` trong build script của client/package.json

### Lỗi: API không hoạt động (500 Error)

**Nguyên nhân**: Chưa set GEMINI_API_KEY  
**Giải pháp**: 
1. Vào Settings → Environment Variables
2. Thêm `GEMINI_API_KEY`
3. Redeploy: Deployments → ... → Redeploy

### Lỗi: 404 Not Found

**Nguyên nhân**: Routing không đúng  
**Giải pháp**: Kiểm tra `vercel.json` đã đúng format

### Xem Logs

1. Vào Vercel Dashboard
2. Click vào Deployment
3. Xem **Build Logs** hoặc **Function Logs**

## Auto Deploy

Mỗi khi push code lên GitHub:
- Branch `main` → Auto deploy to Production
- Branch khác → Auto deploy to Preview

## Custom Domain (Tùy chọn)

1. Vào **Settings** → **Domains**
2. Add domain của bạn
3. Cấu hình DNS theo hướng dẫn Vercel

---

**Lưu ý**: 
- File `.env` không được commit (đã có trong `.gitignore`)
- Mọi thay đổi push lên GitHub sẽ tự động trigger deploy
- Vercel cung cấp SSL certificate miễn phí
