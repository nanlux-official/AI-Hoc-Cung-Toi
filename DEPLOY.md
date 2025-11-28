# 🚀 Hướng dẫn Deploy lên Vercel

## ⚠️ Quan trọng: Cấu hình API Key trước

Trước khi deploy, đảm bảo bạn đã có **Gemini API Key**. Xem hướng dẫn tại [API_KEY_SETUP.md](./API_KEY_SETUP.md)

## Bước 1: Kết nối GitHub với Vercel

1. Truy cập https://vercel.com
2. Đăng nhập bằng **GitHub account**
3. Click **"Add New Project"** hoặc **"Import Project"**
4. Tìm và chọn repository: `nanlux-official/AI-Hoc-Cung-Toi`
5. Click **"Import"**

## Bước 2: Cấu hình Project Settings

### Framework Preset
- Chọn: **Create React App** (Vercel sẽ tự detect)
- Hoặc chọn **Other** nếu không tự động

### Root Directory
- **Để trống** (sử dụng root directory)
- ❌ KHÔNG chọn `client` folder

### Build & Development Settings

#### Build Command (QUAN TRỌNG)
```bash
cd client && npm install && npm run build
```

#### Output Directory
```
client/build
```

#### Install Command
```bash
npm install
```

#### Development Command (optional)
```bash
npm run dev
```

## Bước 3: Thêm Environment Variables (QUAN TRỌNG NHẤT)

### Cách 1: Thêm trước khi Deploy

Trong màn hình Import Project, tìm phần **"Environment Variables"**:

1. Click **"Add"** hoặc mở rộng phần Environment Variables
2. Thêm biến:
   - **Name**: `GEMINI_API_KEY`
   - **Value**: `your_actual_api_key_here` (thay bằng API key thật của bạn)
   - **Environment**: Chọn **Production**, **Preview**, và **Development**
3. Click **"Add"** để lưu

### Cách 2: Thêm sau khi Deploy (nếu quên)

1. Vào Vercel Dashboard
2. Chọn project của bạn
3. Vào **Settings** → **Environment Variables**
4. Click **"Add New"**
5. Thêm:
   ```
   Name: GEMINI_API_KEY
   Value: your_actual_api_key_here
   Environments: Production, Preview, Development
   ```
6. Click **"Save"**
7. **Redeploy** project để áp dụng (vào tab Deployments → click "..." → Redeploy)

### ⚠️ LƯU Ý QUAN TRỌNG:
- ❌ **KHÔNG** commit API key vào code
- ❌ **KHÔNG** để API key trong file `.env` rồi push lên GitHub
- ✅ **CHỈ** thêm API key trong Vercel Dashboard
- ✅ File `.env` đã được thêm vào `.gitignore`

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

## Backend trên Vercel

Backend Express sẽ chạy như **Serverless Functions**:
- ✅ `/api/gemini/*` - Gemini API proxy (hoạt động)
- ✅ `/api/mentor/*` - AI Mentor routes (hoạt động)
- ✅ `/api/health/*` - Health tracker routes (hoạt động)

Mỗi API request sẽ khởi động một serverless function instance.

## Kiểm tra Backend hoạt động

Sau khi deploy, test API:
```bash
curl https://your-app.vercel.app/api/gemini/generate \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"prompt":"Hello"}'
```

## 🐛 Troubleshooting - Sửa lỗi thường gặp

### Lỗi 1: "API Error" hoặc "Failed to fetch"

**Nguyên nhân**: Chưa thêm `GEMINI_API_KEY` vào Environment Variables

**Giải pháp**:
1. Vào Vercel Dashboard → Settings → Environment Variables
2. Thêm `GEMINI_API_KEY` với giá trị API key thật
3. Chọn tất cả environments (Production, Preview, Development)
4. Click Save
5. Vào tab Deployments → Click "..." → **Redeploy**

### Lỗi 2: Build Failed

**Nguyên nhân**: Thiếu dependencies hoặc build command sai

**Giải pháp**:
1. Kiểm tra Build Logs trong Vercel
2. Đảm bảo Build Command là: `cd client && npm install && npm run build`
3. Đảm bảo Output Directory là: `client/build`
4. Kiểm tra `client/package.json` có script `build`

### Lỗi 3: 404 Not Found cho API routes

**Nguyên nhân**: `vercel.json` chưa đúng hoặc chưa được commit

**Giải pháp**:
1. Kiểm tra file `vercel.json` có trong repository
2. Đảm bảo routes được cấu hình đúng
3. Commit và push lại nếu cần:
   ```bash
   git add vercel.json
   git commit -m "Fix vercel config"
   git push origin main
   ```

### Lỗi 4: CORS Error

**Nguyên nhân**: API không cho phép cross-origin requests

**Giải pháp**: File `api/gemini.js` đã có CORS headers, nếu vẫn lỗi:
1. Kiểm tra browser console để xem chi tiết lỗi
2. Đảm bảo đang gọi đúng endpoint: `/api/gemini/generate`
3. Kiểm tra request method là POST

### Lỗi 5: "Invalid API Key"

**Nguyên nhân**: API key không đúng hoặc đã hết hạn

**Giải pháp**:
1. Kiểm tra API key tại https://makersuite.google.com/app/apikey
2. Tạo API key mới nếu cần
3. Cập nhật lại trong Vercel Environment Variables
4. Redeploy

## 📊 Kiểm tra Deployment thành công

### 1. Kiểm tra Frontend
- Truy cập URL của bạn (VD: `https://your-app.vercel.app`)
- Trang chủ phải load được
- Sidebar menu phải hiển thị đầy đủ 8 items

### 2. Kiểm tra API
Mở Browser Console (F12) và chạy:
```javascript
fetch('https://your-app.vercel.app/api/gemini/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: 'Hello' })
})
.then(r => r.json())
.then(console.log)
```

Nếu thành công, bạn sẽ thấy response với `success: true`

### 3. Kiểm tra AI Mentor
1. Vào tab "AI Mentor"
2. Điền thông tin cấu hình
3. Gửi một câu hỏi test
4. Nếu nhận được phản hồi từ AI → Thành công! 🎉

## 🔄 Auto Deploy

Sau khi setup xong, mỗi lần push code lên GitHub:
- ✅ Branch `main` → Tự động deploy lên **Production**
- ✅ Branch khác → Tự động tạo **Preview** deployment
- ✅ Pull Request → Tự động tạo preview URL

## 📱 Custom Domain (Tùy chọn)

1. Vào Vercel Dashboard → Settings → Domains
2. Click "Add Domain"
3. Nhập domain của bạn (VD: `study.yourdomain.com`)
4. Follow hướng dẫn để cấu hình DNS
5. Đợi DNS propagate (5-10 phút)

## 🎯 Checklist Deploy thành công

- [ ] Repository đã được import vào Vercel
- [ ] Build Command: `cd client && npm install && npm run build`
- [ ] Output Directory: `client/build`
- [ ] Environment Variable `GEMINI_API_KEY` đã được thêm
- [ ] Deployment status: **Ready** (màu xanh)
- [ ] Website có thể truy cập được
- [ ] API `/api/gemini/generate` hoạt động
- [ ] AI Mentor có thể chat được
- [ ] Không có lỗi trong Console

## 💡 Tips

1. **Xem Logs**: Vào Deployments → Click vào deployment → View Function Logs
2. **Preview Deployments**: Mỗi branch/PR tự động có preview URL
3. **Rollback**: Có thể rollback về deployment cũ bất cứ lúc nào
4. **Analytics**: Bật Vercel Analytics để theo dõi traffic
5. **Speed Insights**: Bật để theo dõi performance

## 🆘 Cần trợ giúp?

- 📖 Vercel Docs: https://vercel.com/docs
- 💬 Vercel Community: https://github.com/vercel/vercel/discussions
- 🐛 Report Issues: Tạo issue trên GitHub repository
