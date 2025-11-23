# 🚀 Hướng dẫn Deploy lên Vercel

## Bước 1: Chuẩn bị

### 1.1. Tạo tài khoản Vercel
- Truy cập: https://vercel.com
- Đăng ký bằng GitHub (khuyến nghị)

### 1.2. Cài đặt Vercel CLI (Tùy chọn)
```bash
npm install -g vercel
```

## Bước 2: Push code lên GitHub

### 2.1. Khởi tạo Git (nếu chưa có)
```bash
git init
git add .
git commit -m "Initial commit - AI Hoc Cung Toi"
```

### 2.2. Tạo repository trên GitHub
1. Vào https://github.com/new
2. Tạo repository mới (ví dụ: `ai-hoc-cung-toi`)
3. Không chọn "Initialize with README"

### 2.3. Push code lên GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-hoc-cung-toi.git
git branch -M main
git push -u origin main
```

## Bước 3: Deploy trên Vercel

### Cách 1: Deploy qua Web (Dễ nhất)

1. **Đăng nhập Vercel**
   - Vào https://vercel.com/dashboard
   - Đăng nhập bằng GitHub

2. **Import Project**
   - Click "Add New..." → "Project"
   - Chọn repository `ai-hoc-cung-toi`
   - Click "Import"

3. **Cấu hình Project**
   - Framework Preset: **Other**
   - Root Directory: `./` (để trống)
   - Build Command: `npm run vercel-build`
   - Output Directory: `client/build`
   - Install Command: `npm install`

4. **Environment Variables** (Nếu cần)
   - Không cần thiết lập gì thêm cho bản demo

5. **Deploy**
   - Click "Deploy"
   - Đợi 2-3 phút
   - Xong! 🎉

### Cách 2: Deploy qua CLI

```bash
# Đăng nhập Vercel
vercel login

# Deploy
vercel

# Làm theo hướng dẫn:
# - Set up and deploy? Y
# - Which scope? (Chọn account của bạn)
# - Link to existing project? N
# - What's your project's name? ai-hoc-cung-toi
# - In which directory is your code located? ./
# - Want to override the settings? N

# Deploy production
vercel --prod
```

## Bước 4: Kiểm tra

Sau khi deploy xong, Vercel sẽ cung cấp URL:
```
https://ai-hoc-cung-toi.vercel.app
```

Truy cập URL để kiểm tra:
- ✅ Dashboard hiển thị đúng
- ✅ AI Mentor hoạt động
- ✅ Video Learning load được
- ✅ Challenge Mode chạy tốt

## Bước 5: Cập nhật sau này

Mỗi khi có thay đổi code:

```bash
git add .
git commit -m "Update features"
git push

# Vercel tự động deploy lại!
```

## 🔧 Troubleshooting

### Lỗi: "Build failed"
**Giải pháp:**
```bash
# Test build local trước
cd client
npm install
npm run build

# Nếu build thành công local → Push lại
```

### Lỗi: "API not working"
**Giải pháp:**
- Kiểm tra file `vercel.json` đã đúng chưa
- Đảm bảo routes `/api/*` trỏ đến `server/index.js`

### Lỗi: "Module not found"
**Giải pháp:**
```bash
# Xóa node_modules và cài lại
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

## 📊 Monitoring

Sau khi deploy:
- **Logs:** https://vercel.com/dashboard → Project → Deployments → View Logs
- **Analytics:** https://vercel.com/dashboard → Project → Analytics
- **Domains:** https://vercel.com/dashboard → Project → Settings → Domains

## 🎯 Custom Domain (Tùy chọn)

Nếu có domain riêng:
1. Vào Project Settings → Domains
2. Add domain của bạn
3. Cấu hình DNS theo hướng dẫn
4. Đợi DNS propagate (5-10 phút)

## ⚡ Performance Tips

1. **Enable Caching:**
   - Vercel tự động cache static files
   - API responses có thể cache bằng headers

2. **Optimize Images:**
   - Dùng Next.js Image nếu chuyển sang Next.js
   - Hoặc dùng Vercel Image Optimization

3. **Monitor Performance:**
   - Xem Analytics để theo dõi tốc độ load
   - Optimize các API chậm

## 🆘 Support

Nếu gặp vấn đề:
- Docs: https://vercel.com/docs
- Community: https://github.com/vercel/vercel/discussions
- Support: support@vercel.com

---

**Chúc bạn deploy thành công! 🚀**
