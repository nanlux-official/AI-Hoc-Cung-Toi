# ⚠️ API Key Bị Leak - Cần Tạo Mới

API key cũ đã bị leak và bị Google vô hiệu hóa. Bạn cần tạo API key mới.

## Bước 1: Tạo API Key Mới

1. Truy cập: https://makersuite.google.com/app/apikey
2. Đăng nhập bằng Google Account
3. Click "Create API Key"
4. Copy API key mới

## Bước 2: Cấu Hình Local

Mở file `.env` trong thư mục gốc và thay thế:

```env
GEMINI_API_KEY=your_new_api_key_here
```

Thay `your_new_api_key_here` bằng API key vừa tạo.

## Bước 3: Restart Server

```bash
# Dừng server cũ (Ctrl+C)
# Chạy lại
cd server
npm start
```

## Bước 4: Cấu Hình Vercel

1. Vào Vercel Dashboard: https://vercel.com/dashboard
2. Chọn project `ai-hoc-cung-toi`
3. Settings → Environment Variables
4. Thêm/Update:
   - Name: `GEMINI_API_KEY`
   - Value: `<API key mới>`
   - Environments: Production, Preview, Development
5. Redeploy

## ⚠️ Quan Trọng

- **KHÔNG BAO GIỜ** commit API key vào Git
- File `.env` đã được thêm vào `.gitignore`
- Chỉ lưu API key trong:
  - File `.env` (local)
  - Vercel Environment Variables (production)

## Kiểm Tra

Sau khi cấu hình xong, test:

```bash
node test-local-api.js
```

Nếu thành công, bạn sẽ thấy response từ Gemini API.
