# 🎓 AI Mentor V4 - Hướng Dẫn Sử Dụng

## 📋 Tổng Quan

AI Mentor V4 là phiên bản nâng cấp hoàn chỉnh của hệ thống gia sư AI với phương pháp Socratic, được thiết kế đặc biệt cho học sinh THPT Việt Nam.

## ✨ Tính Năng Mới

### 1. 📝 Form Cấu Hình Đầy Đủ
- **Thông tin học sinh:** Tên, trường, lớp, môn học
- **Địa điểm:** Tỉnh/Thành phố, Quận/Huyện, Trường học
- **Bộ sách:** Kết nối tri thức, Chân trời sáng tạo, Cánh diều
- **Giáo viên:** Chọn giáo viên phụ trách môn học

### 2. 💡 Hệ Thống 4 Luật Gợi Ý

#### Gợi ý Cấp 1 - Định hướng tổng quát
- Xác định dạng bài toán
- Nhận diện kiến thức liên quan
- Liệt kê dữ kiện đã cho

#### Gợi ý Cấp 2 - Phương pháp cụ thể
- Các bước tiếp cận
- Công thức/phương pháp phù hợp
- Lập kế hoạch giải

#### Gợi ý Cấp 3 - Hướng dẫn chi tiết
- Từng bước giải cụ thể
- Giải thích rõ ràng
- Ví dụ minh họa

#### Gợi ý Cấp 4 - Gần như lời giải
- Hướng giải hoàn chỉnh
- Chỉ còn phần tính toán cuối
- Học sinh tự hoàn thành

### 3. 📐 Tích Hợp LaTeX/KaTeX

Hỗ trợ hiển thị công thức toán học đẹp mắt:

**Inline Math:** `$f(x) = ax^2 + bx + c$`
→ Hiển thị: $f(x) = ax^2 + bx + c$

**Block Math:** 
```
$$\int_{a}^{b} f(x)dx = F(b) - F(a)$$
```
→ Hiển thị công thức ở giữa trang

### 4. 📚 Lịch Sử Học Tập

- Lưu các phiên học
- Đặt tên cho từng phiên
- Xem lại cuộc trò chuyện cũ
- Theo dõi tiến độ

### 5. 🔐 Cheat Code M10

- Nhập "M10" để xem lời giải ngay lập tức
- Có cảnh báo trước khi hiển thị
- Khuyến khích học sinh tự suy nghĩ

### 6. 📖 Trích Dẫn Sách Giáo Khoa

Mỗi lời giải đều có:
- Tên bài học liên quan
- Chương trong SGK
- Số trang tham khảo
- Tên sách (theo bộ sách đã chọn)

## 🚀 Cách Sử Dụng

### Bước 1: Cấu Hình
1. Truy cập `/mentor-v4`
2. Điền đầy đủ thông tin:
   - Tên học sinh
   - Chọn tỉnh/thành phố
   - Chọn quận/huyện
   - Chọn trường học
   - Chọn lớp (6-12)
   - Chọn môn học
   - Chọn bộ sách
   - Chọn giáo viên
3. Nhấn "Bắt đầu học 🚀"

### Bước 2: Đặt Câu Hỏi
1. Nhập câu hỏi vào ô chat
2. AI sẽ đặt câu hỏi dẫn dắt (Socratic method)
3. Trả lời câu hỏi của AI
4. Tiếp tục trao đổi để tìm ra đáp án

### Bước 3: Sử Dụng Gợi Ý
- Nhấn nút "💡 Gợi ý" khi cần trợ giúp
- Có tối đa 4 lượt gợi ý
- Mỗi lượt gợi ý chi tiết hơn lượt trước

### Bước 4: Xem Lời Giải
- Nhấn "📚 Xem lời giải" hoặc nhập "M10"
- Xem lời giải chi tiết với công thức LaTeX
- Đọc trích dẫn sách giáo khoa

### Bước 5: Lưu Phiên Học
- Nhấn "➕" để bắt đầu chủ đề mới
- Đặt tên cho phiên học hiện tại
- Xem lại trong "📚 Lịch sử"

## 🎨 Giao Diện

### Header
- Hiển thị tên học sinh, môn học, lớp
- Đếm số lượt gợi ý đã dùng
- Các nút: Lịch sử, Chủ đề mới, Làm mới, Cài đặt

### Chat Area
- **Tin nhắn hệ thống:** Màu tím gradient
- **Tin nhắn học sinh:** Màu xanh dương, bên phải
- **Tin nhắn AI:** Màu xám, bên trái
- **Gợi ý:** Màu cam
- **Lời giải:** Màu xanh lá

### Input Area
- Nút "💡 Gợi ý" và "📚 Xem lời giải"
- Ô nhập text với hỗ trợ Enter để gửi
- Nút "Gửi 📤"

## 💻 Kỹ Thuật

### Frontend
- React Hooks (useState, useEffect, useRef)
- KaTeX cho render công thức toán
- CSS3 với animations
- Responsive design

### Backend
- Express.js routes
- 3 endpoints mới:
  - `/api/mentor/socratic-v4` - Trò chuyện Socratic
  - `/api/mentor/hint-v4` - Hệ thống gợi ý 4 cấp
  - `/api/mentor/solution-v4` - Lời giải + trích dẫn SGK

### Dữ Liệu
- `schoolData.js`: 10 tỉnh, huyện, trường học
- Danh sách môn học: 11 môn
- 3 bộ sách: Kết nối tri thức, Chân trời sáng tạo, Cánh diều
- Giáo viên mẫu theo từng môn

## 📱 Responsive

- Desktop: Giao diện đầy đủ
- Tablet: Điều chỉnh layout
- Mobile: Stack layout, full width

## 🔮 Tương Lai

### Tính năng có thể mở rộng:
1. **Tích hợp AI thật (OpenAI/Gemini)**
   - Thay thế mock data
   - Response thông minh hơn

2. **Database thực**
   - Lưu lịch sử vĩnh viễn
   - Phân tích tiến độ học tập

3. **Gamification**
   - Điểm thưởng khi tự giải
   - Huy hiệu thành tích
   - Bảng xếp hạng

4. **Chia sẻ**
   - Chia sẻ câu hỏi với bạn bè
   - Học nhóm online

5. **Giáo viên Dashboard**
   - Theo dõi học sinh
   - Giao bài tập
   - Nhận báo cáo

## 🐛 Troubleshooting

### LaTeX không hiển thị
- Kiểm tra đã cài `katex` và `react-katex`
- Import CSS: `import 'katex/dist/katex.min.css'`

### API không hoạt động
- Kiểm tra server đang chạy
- Xem console log lỗi
- Kiểm tra endpoint URL

### Dữ liệu không lưu
- Hiện tại dùng state local
- Cần implement localStorage hoặc database

## 📞 Liên Hệ

Nếu có vấn đề hoặc đề xuất tính năng mới, vui lòng tạo issue trên GitHub.

---

**Phiên bản:** 4.0.0  
**Ngày cập nhật:** 25/11/2025  
**Tác giả:** AI Learning Team
