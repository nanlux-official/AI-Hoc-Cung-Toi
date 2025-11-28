# AI Learning Platform - Nền tảng Học tập Thông minh

Nền tảng học tập toàn diện với AI hỗ trợ, giúp học sinh quản lý thời gian, theo dõi sức khỏe và nhận tư vấn tâm lý.

## 🌟 Tính năng chính

### 🎯 Mục tiêu Đại học
- Đặt mục tiêu trường đại học mơ ước
- Đếm ngược thời gian đến kỳ thi
- Chọn khối thi (A00, B00, C00, D01...)
- Động lực học tập mỗi ngày

### 📊 Dashboard - Tổng quan
- Theo dõi tổng thời gian học tập với Global Timer
- Giới hạn tạm dừng (3 lần/ngày) để tập trung
- Thống kê số hoạt động
- Đặt và theo dõi mục tiêu học tập theo môn

### 📅 Scheduler - Lịch học
- Lập lịch học theo tuần
- Quản lý thời gian biểu chi tiết
- Phân loại theo môn học và hoạt động

### 📖 Daily Log - Nhật ký học tập
- Ghi nhận hoạt động học tập hàng ngày
- Theo dõi cảm xúc khi học
- Thống kê thời gian theo môn

### ⏰ Pomodoro Timer
- Kỹ thuật Pomodoro 25-5-15
- Chế độ tập trung, nghỉ ngắn, nghỉ dài
- Giao diện đồng hồ đếm ngược trực quan

### ☕ Relax Zone - Khu vực thư giãn
- Bài tập thở
- Bài tập giãn cơ
- Hướng dẫn thư giãn

### 🤖 AI Mentor - Gia sư AI
- Hỗ trợ học tập với AI
- Giải đáp thắc mắc
- Gợi ý và lời giải chi tiết
- Tham khảo sách giáo khoa

### ❤️ Health Tracker - Theo dõi sức khỏe
- Ghi nhận hoạt động thể chất
- Theo dõi giấc ngủ
- Quản lý dinh dưỡng
- Thống kê sức khỏe tổng quan

### 🧠 Mental Health Mentor - Tư vấn Tâm lý ⭐ MỚI
- Trò chuyện với AI mentor (Thầy/Cô giáo)
- Tạo lộ trình hành động cá nhân hóa (3 pha)
- Theo dõi cảm xúc và tiến độ
- Sổ tay lộ trình
- [Xem chi tiết →](./MENTAL_HEALTH_MENTOR.md)

## ✨ Cải thiện Giao diện (Mới nhất)

### Desktop UI Enhancements
- ✅ **Typography cải thiện**: Font sizes lớn hơn, line-height tốt hơn, letter-spacing tối ưu
- ✅ **Spacing & Layout**: Padding/margin cân đối, max-width 1400px cho desktop
- ✅ **Colors & Gradients**: Gradient backgrounds đẹp mắt, color scheme hài hòa
- ✅ **Shadows & Effects**: Box shadows sâu hơn, border-radius lớn hơn (14-20px)
- ✅ **Sidebar Menu**: Scrollable với 8 menu items, custom scrollbar đẹp
- ✅ **AI Mentor**: Giao diện chat hiện đại với gradients và animations
- ✅ **Responsive**: Tối ưu cho cả desktop và mobile

## 🚀 Cài đặt

### Yêu cầu
- Node.js 16+
- npm hoặc yarn
- Gemini API Key (miễn phí tại Google AI Studio)

### Bước 1: Clone repository
```bash
git clone <repository-url>
cd ai-learning-platform
```

### Bước 2: Cài đặt dependencies
```bash
# Cài đặt server dependencies
npm install

# Cài đặt client dependencies
cd client
npm install
cd ..
```

### Bước 3: Cấu hình API Key
```bash
# Copy file .env.example thành .env
cp .env.example .env

# Chỉnh sửa .env và thêm API key
# GEMINI_API_KEY=your_api_key_here
```

Xem hướng dẫn chi tiết: [API_KEY_SETUP.md](./API_KEY_SETUP.md)

### Bước 4: Chạy ứng dụng

#### Development
```bash
# Terminal 1: Chạy server
npm run dev

# Terminal 2: Chạy client
cd client
npm start
```

#### Production
```bash
# Build client
cd client
npm run build
cd ..

# Chạy server
npm start
```

## 📦 Cấu trúc dự án

```
ai-learning-platform/
├── api/                    # Vercel serverless functions
│   └── gemini.js          # Gemini API proxy
├── client/                # React frontend
│   ├── public/
│   └── src/
│       ├── components/    # React components
│       │   ├── AIMentorV4.js
│       │   ├── HealthTracker.js
│       │   ├── MentalHealthMentor.js  ⭐ MỚI
│       │   └── StudySpace.js
│       ├── data/          # Data files
│       ├── utils/         # Utility functions
│       ├── App.js
│       └── index.js
├── server/                # Express backend
│   ├── routes/
│   └── index.js
├── .env.example           # Environment variables template
├── package.json
└── vercel.json           # Vercel deployment config
```

## 🔧 Công nghệ sử dụng

### Frontend
- React 18
- Tailwind CSS
- Lucide React (Icons)
- React KaTeX (Math rendering)
- Recharts (Charts)
- Axios

### Backend
- Node.js
- Express
- Gemini AI API

### Deployment
- Vercel (Recommended)
- Hoặc bất kỳ platform nào hỗ trợ Node.js

## 📱 Responsive Design

Ứng dụng được tối ưu cho:
- 💻 **Desktop** (1920x1080+) - Giao diện đầy đủ với sidebar, max-width 1400px
- 💻 **Laptop** (1366x768+) - Layout cân đối, typography rõ ràng
- 📱 **Tablet** (768x1024+) - Hamburger menu, touch-friendly buttons
- 📱 **Mobile** (375x667+) - Full responsive, safe area support

### Tính năng Responsive
- ✅ Hamburger menu cho mobile
- ✅ Touch-friendly buttons (min 44px)
- ✅ Scrollable sidebar với custom scrollbar
- ✅ Backdrop blur effects
- ✅ Safe area cho iPhone X+ (notch support)

## 🔐 Bảo mật

- API key được lưu trên server, không expose ra client
- Dữ liệu người dùng lưu trên localStorage (client-side)
- CORS được cấu hình đúng cách
- Không lưu trữ thông tin nhạy cảm

## 📚 Tài liệu

- [API Key Setup](./API_KEY_SETUP.md) - Hướng dẫn cấu hình API key
- [Deployment Guide](./DEPLOY.md) - Hướng dẫn deploy lên Vercel
- [Mental Health Mentor](./MENTAL_HEALTH_MENTOR.md) - Tính năng tư vấn tâm lý
- [Fixes Needed](./FIXES_NEEDED.md) - Danh sách lỗi cần sửa

## 🐛 Báo lỗi

Nếu bạn phát hiện lỗi, vui lòng:
1. Kiểm tra [FIXES_NEEDED.md](./FIXES_NEEDED.md)
2. Tạo issue mới trên GitHub
3. Mô tả chi tiết lỗi và cách tái hiện

## 🤝 Đóng góp

Mọi đóng góp đều được chào đón! Vui lòng:
1. Fork repository
2. Tạo branch mới (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Tạo Pull Request

## 📝 License

Dự án này được phát hành dưới MIT License.

## 👥 Tác giả

- Phát triển bởi AI Learning Team
- Hỗ trợ bởi Gemini AI

## 🙏 Lời cảm ơn

- Google Gemini AI
- React Team
- Tailwind CSS Team
- Lucide Icons
- Tất cả contributors

---

**Lưu ý**: Đây là công cụ hỗ trợ học tập, không thay thế cho giáo viên và tư vấn chuyên nghiệp.
