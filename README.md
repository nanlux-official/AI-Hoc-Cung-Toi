# 🎓 AI Học Cùng Tôi

Nền tảng học tập thông minh với 6 module AI hỗ trợ học sinh phát triển tư duy phản biện và học tập chủ động.

## 🌟 6 Module Chính

### 1. 🧠 AI Mentor - Trí Tuệ Hướng Dẫn
- Phương pháp Socratic: đặt câu hỏi ngược thay vì cho đáp án
- Gợi mở tư duy phản biện
- Giúp học sinh tự khám phá kiến thức

#### 🆕 AI Mentor V4 - Phiên Bản Nâng Cao
- ✅ **Form cấu hình đầy đủ:** Tên, trường, lớp, môn, bộ sách, giáo viên
- ✅ **Hệ thống 4 luật gợi ý:** Từ định hướng tổng quát đến gần như lời giải
- ✅ **Tích hợp LaTeX/KaTeX:** Hiển thị công thức toán học đẹp mắt
- ✅ **Lịch sử học tập:** Lưu và xem lại các phiên học
- ✅ **Cheat code M10:** Xem lời giải nhanh khi cần
- ✅ **Trích dẫn sách giáo khoa:** Tham khảo SGK theo bộ sách đã chọn

👉 **Truy cập:** `/mentor-v4` để trải nghiệm phiên bản mới!  
📖 **Hướng dẫn chi tiết:** Xem file `AI_MENTOR_V4_GUIDE.md`

### 2. 🔍 AI Reflect - Phản Hồi Thông Minh
- Phân tích lỗi tư duy, không chỉ lỗi kết quả
- Đưa ra hướng điều chỉnh cụ thể
- Rèn khả năng tự học - tự sửa sai

### 3. 🏆 Challenge Mode - Thử Thách Phản Biện
- Tự động điều chỉnh độ khó
- Đúng >70% → tăng level
- Sai nhiều → giảm level và gợi ý học lại

### 4. 📈 Learning Tracker - Nhật Ký Học Tập
- Theo dõi thời gian học, độ chính xác
- Báo cáo tuần tự động
- Phân tích điểm mạnh/yếu

### 5. 🎥 Video Learning - Bài Giảng Tương Tác
- Video tạm dừng mỗi 3 phút để kiểm tra
- Sai 3 lần → tua lại phần trước
- Test cuối bài (cần đạt 75%)

### 6. 💪 Health & Focus Tracker
- Theo dõi thời gian học
- Nhắc nghỉ ngơi theo Pomodoro (25 phút học, 5 phút nghỉ)
- Đề xuất lịch học tối ưu

## 🚀 Cài Đặt

### Yêu cầu
- Node.js 16+
- npm hoặc yarn

### Bước 1: Cài đặt dependencies

```bash
# Cài đặt server dependencies
npm install

# Cài đặt client dependencies
cd client
npm install
cd ..
```

### Bước 2: Chạy ứng dụng

**Development mode (chạy cả server và client):**
```bash
npm run dev
```

**Hoặc chạy riêng:**
```bash
# Terminal 1 - Server
npm run server

# Terminal 2 - Client
npm run client
```

Server: http://localhost:5000
Client: http://localhost:3000

### Bước 3: Build cho production

```bash
npm run build
npm start
```

## 📁 Cấu Trúc Dự Án

```
ai-hoc-cung-toi/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/    # 6 module components
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── server/                # Express backend
│   ├── routes/           # API routes cho 6 module
│   │   ├── aiMentor.js
│   │   ├── aiReflect.js
│   │   ├── challenge.js
│   │   ├── tracker.js
│   │   ├── video.js
│   │   └── health.js
│   └── index.js
├── package.json
└── README.md
```

## 🎯 4 Giai Đoạn Triển Khai

### Giai đoạn 1: Khởi động (Orientation)
- Khảo sát phong cách học
- AI cá nhân hóa lộ trình

### Giai đoạn 2: Đồng hành (Co-learning)
- AI gợi câu hỏi, không cho đáp án
- Phản hồi theo tiến độ

### Giai đoạn 3: Phản hồi (Reflection)
- Tự đánh giá năng lực
- Kiểm tra hiểu sâu

### Giai đoạn 4: Ứng dụng (Creative Use)
- Bài tập sáng tạo
- Vận dụng thực tế

## 🔧 Tích Hợp AI Thật

Hiện tại dùng logic giả lập. Để tích hợp AI thật (GPT, Claude):

1. Tạo file `.env`:
```
OPENAI_API_KEY=your_key_here
```

2. Cài thêm package:
```bash
npm install openai
```

3. Sửa file `server/routes/aiMentor.js`:
```javascript
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Thay thế hàm generateSocraticResponse
```

## 🌐 Deploy Lên Web

### Vercel (Recommended)
```bash
npm install -g vercel
vercel
```

### Heroku
```bash
heroku create
git push heroku main
```

### Netlify
- Build command: `npm run build`
- Publish directory: `client/build`

## 📝 License

MIT License - Tự do sử dụng cho mục đích giáo dục

## 🤝 Đóng Góp

Mọi đóng góp đều được chào đón! Hãy tạo Pull Request hoặc Issue.

---

**Phát triển bởi:** AI Học Cùng Tôi Team
**Mục tiêu:** Giúp học sinh phát triển tư duy phản biện và học tập chủ động
