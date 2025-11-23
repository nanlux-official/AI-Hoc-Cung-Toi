# 🚀 Hướng Dẫn Deploy Lên Website

## Phương Án 1: Vercel (Miễn Phí, Dễ Nhất) ⭐

### Bước 1: Chuẩn bị
```bash
# Tạo tài khoản tại https://vercel.com
# Cài Vercel CLI
npm install -g vercel
```

### Bước 2: Tạo file vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/build/$1"
    }
  ]
}
```

### Bước 3: Deploy
```bash
vercel
```

**Link demo:** https://your-app.vercel.app

---

## Phương Án 2: Heroku (Miễn Phí)

### Bước 1: Cài Heroku CLI
```bash
# Download tại https://devcenter.heroku.com/articles/heroku-cli
heroku login
```

### Bước 2: Tạo Procfile
```
web: node server/index.js
```

### Bước 3: Deploy
```bash
heroku create ai-hoc-cung-toi
git push heroku main
heroku open
```

---

## Phương Án 3: Netlify (Frontend) + Railway (Backend)

### Frontend trên Netlify:
1. Đăng ký tại https://netlify.com
2. Kéo thả folder `client/build` vào Netlify
3. Hoặc connect với GitHub

### Backend trên Railway:
1. Đăng ký tại https://railway.app
2. New Project → Deploy from GitHub
3. Chọn folder `server`

---

## Phương Án 4: VPS (DigitalOcean, AWS, etc.)

### Bước 1: Kết nối VPS
```bash
ssh root@your-server-ip
```

### Bước 2: Cài đặt Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Bước 3: Clone và chạy
```bash
git clone https://github.com/your-repo/ai-hoc-cung-toi.git
cd ai-hoc-cung-toi
npm install
cd client && npm install && npm run build
cd ..
npm start
```

### Bước 4: Dùng PM2 để chạy liên tục
```bash
npm install -g pm2
pm2 start server/index.js --name "ai-learning"
pm2 startup
pm2 save
```

### Bước 5: Cấu hình Nginx
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## 🔒 Bảo Mật

### Environment Variables
Đừng commit file `.env`! Thêm vào `.gitignore`:
```
.env
```

Trên hosting, thêm biến môi trường:
- Vercel: Settings → Environment Variables
- Heroku: Settings → Config Vars
- Railway: Variables tab

---

## 📊 Monitoring

### Vercel Analytics
```bash
npm install @vercel/analytics
```

### Google Analytics
Thêm vào `client/public/index.html`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
```

---

## 🎯 Checklist Deploy

- [ ] Build thành công: `npm run build`
- [ ] Test local: `npm start`
- [ ] Đã thêm `.env` vào `.gitignore`
- [ ] Đã set environment variables trên hosting
- [ ] Đã test API endpoints
- [ ] Đã test responsive design
- [ ] Đã setup domain (nếu có)
- [ ] Đã setup SSL certificate

---

## 🆘 Troubleshooting

### Lỗi "Cannot GET /"
→ Kiểm tra routes trong `server/index.js`

### Lỗi CORS
→ Thêm vào `server/index.js`:
```javascript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

### Lỗi 502 Bad Gateway
→ Kiểm tra PORT environment variable:
```javascript
const PORT = process.env.PORT || 5000;
```

---

**Khuyến nghị:** Dùng Vercel cho dễ nhất! 🚀
