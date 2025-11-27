# 🚀 Quick Start Guide - Hướng dẫn Nhanh

## Bắt đầu trong 5 phút

### 1️⃣ Cài đặt (2 phút)

```bash
# Clone và cài đặt
git clone <repository-url>
cd ai-learning-platform
npm install
cd client && npm install && cd ..
```

### 2️⃣ Cấu hình API Key (1 phút)

```bash
# Tạo file .env
cp .env.example .env
```

Mở file `.env` và thêm API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

**Lấy API key miễn phí tại**: https://makersuite.google.com/app/apikey

### 3️⃣ Chạy ứng dụng (2 phút)

```bash
# Terminal 1: Server
npm run dev

# Terminal 2: Client (mở terminal mới)
cd client
npm start
```

Truy cập: http://localhost:3000

## 🎯 Sử dụng tính năng mới: Mental Health Mentor

### Bước 1: Vào tab "Tâm lý" 🧠
- Click vào icon Brain ở sidebar bên trái

### Bước 2: Thiết lập hồ sơ
1. Nhập tên của bạn
2. Chọn người đồng hành:
   - 👨‍🏫 **Thầy giáo**: Phong cách nghiêm túc, nam tính
   - 👩‍🏫 **Cô giáo**: Phong cách ấm áp, nữ tính
3. Click "Bắt đầu ngay"

### Bước 3: Chọn cảm xúc
- 😢 **Áp lực / Buồn**: Khi bạn cần hỗ trợ
- 😊 **Vui vẻ / Tự tin**: Khi bạn muốn chia sẻ niềm vui

### Bước 4: Trò chuyện
- Chia sẻ vấn đề của bạn
- AI sẽ lắng nghe và tư vấn
- Lộ trình hành động sẽ tự động được tạo

### Bước 5: Theo dõi lộ trình
- Xem lộ trình ở sidebar bên phải (desktop)
- Hoặc click "Sổ tay Lộ trình" để xem tất cả

## 💡 Tips & Tricks

### Lộ trình 3 pha
1. **Pha 1: Ổn định** 🛡️
   - Giúp bạn bình tĩnh lại
   - Thời gian: 1-3 ngày

2. **Pha 2: Hành động** 🎯
   - Các bước cụ thể để giải quyết
   - Thời gian: 1-2 tuần

3. **Pha 3: Duy trì** 📈
   - Giữ vững kết quả
   - Thời gian: Dài hạn

### Khóa/Mở khóa lộ trình
- 🔒 **Khóa**: Giữ nguyên lộ trình, không cho AI sửa
- 🔓 **Mở khóa**: Cho phép AI cập nhật lộ trình mới

### Lưu phiên tư vấn
- Tất cả cuộc trò chuyện tự động lưu
- Xem lại trong "Lịch sử"
- Dữ liệu lưu trên trình duyệt của bạn

## 🔧 Troubleshooting

### Lỗi "Kết nối hơi chập chờn"
```bash
# Kiểm tra API key
cat .env

# Khởi động lại server
# Ctrl+C để dừng, sau đó:
npm run dev
```

### Lộ trình không được tạo
- Chia sẻ chi tiết hơn về vấn đề
- Đảm bảo lộ trình không bị khóa (🔓)
- Thử bắt đầu phiên mới

### Port đã được sử dụng
```bash
# Thay đổi port trong package.json
# Hoặc kill process đang dùng port:
# Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

## 📱 Các tính năng khác

### AI Mentor (Tab 📚)
- Hỏi đáp về bài tập
- Nhận gợi ý và lời giải
- Tham khảo sách giáo khoa

### Health Tracker (Tab ❤️)
- Theo dõi hoạt động thể chất
- Ghi nhận giấc ngủ
- Quản lý dinh dưỡng

### Pomodoro (Tab ⏰)
- Kỹ thuật 25-5-15
- Tập trung hiệu quả
- Nghỉ ngơi đúng cách

## 🎓 Best Practices

### Sử dụng Mental Health Mentor hiệu quả
1. **Chia sẻ cụ thể**: Càng chi tiết, AI càng hiểu rõ
2. **Thực hiện từng bước**: Đừng vội, làm từng bước một
3. **Xem lại thường xuyên**: Check lộ trình mỗi ngày
4. **Cập nhật tiến độ**: Chia sẻ kết quả với AI

### Bảo mật thông tin
- Dữ liệu chỉ lưu trên máy bạn
- Không chia sẻ thông tin nhạy cảm
- Xóa cache nếu dùng máy chung

### Khi nào cần tìm chuyên gia
- Vấn đề kéo dài > 2 tuần
- Ảnh hưởng nghiêm trọng đến học tập/sống
- Có ý nghĩ tiêu cực
- Cần hỗ trợ y tế

## 📞 Hỗ trợ

### Tài liệu chi tiết
- [README.md](./README.md) - Tổng quan dự án
- [MENTAL_HEALTH_MENTOR.md](./MENTAL_HEALTH_MENTOR.md) - Chi tiết tính năng
- [API_KEY_SETUP.md](./API_KEY_SETUP.md) - Cấu hình API
- [DEPLOY.md](./DEPLOY.md) - Deploy lên Vercel

### Liên hệ
- GitHub Issues: Báo lỗi và đề xuất tính năng
- Email: support@ailearning.com (nếu có)

## 🎉 Chúc bạn học tập hiệu quả!

---

**Nhớ**: Đây là công cụ hỗ trợ, không thay thế cho tư vấn chuyên nghiệp. Hãy tìm kiếm sự giúp đỡ từ chuyên gia khi cần thiết.
