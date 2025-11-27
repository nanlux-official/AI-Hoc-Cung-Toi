# Mental Health Mentor - Tư vấn Tâm lý & Học tập

## Giới thiệu

Mental Health Mentor là một công cụ AI tư vấn tâm lý và học tập được tích hợp vào ứng dụng AI Learning. Công cụ này giúp học sinh:

- 💬 Trò chuyện với AI mentor (Thầy/Cô giáo)
- 🗺️ Tạo lộ trình hành động cá nhân hóa (3 pha: Ổn định → Hành động → Duy trì)
- 📊 Theo dõi cảm xúc và tiến độ
- 📖 Lưu trữ và xem lại các phiên tư vấn

## Tính năng chính

### 1. Chọn người đồng hành
- **Thầy giáo**: Phong cách tư vấn nam tính, nghiêm túc
- **Cô giáo**: Phong cách tư vấn nữ tính, ấm áp

### 2. Chọn cảm xúc ban đầu
- 😢 **Áp lực / Buồn**: Dành cho khi bạn cần hỗ trợ tâm lý
- 😊 **Vui vẻ / Tự tin**: Dành cho khi bạn muốn chia sẻ niềm vui

### 3. Lộ trình 3 pha
AI sẽ tự động tạo lộ trình hành động gồm 3 pha:

- **Pha 1: Ổn định** 🛡️ - Giúp bạn ổn định cảm xúc
- **Pha 2: Hành động** 🎯 - Các bước cụ thể để giải quyết vấn đề
- **Pha 3: Duy trì** 📈 - Duy trì kết quả lâu dài

### 4. Sổ tay Lộ trình
- Xem tất cả các lộ trình đã tạo
- Mở lại các phiên tư vấn cũ
- Theo dõi tiến độ theo thời gian

### 5. Khóa/Mở khóa Lộ trình
- 🔒 **Khóa**: Giữ nguyên lộ trình hiện tại
- 🔓 **Mở khóa**: Cho phép AI cập nhật lộ trình

## Cách sử dụng

### Bước 1: Thiết lập hồ sơ
1. Nhập tên của bạn
2. Chọn người đồng hành (Thầy/Cô)
3. Nhấn "Bắt đầu ngay"

### Bước 2: Bắt đầu phiên tư vấn
1. Chọn cảm xúc hiện tại
2. Bắt đầu trò chuyện với AI
3. Chia sẻ vấn đề của bạn

### Bước 3: Nhận lộ trình
- AI sẽ tự động tạo lộ trình dựa trên cuộc trò chuyện
- Lộ trình xuất hiện ở sidebar bên phải (desktop) hoặc có thể xem trong Sổ tay

### Bước 4: Theo dõi và thực hiện
- Thực hiện từng bước trong lộ trình
- Tiếp tục trò chuyện để nhận hỗ trợ
- Xem lại các phiên cũ trong Lịch sử

## Cấu hình kỹ thuật

### API Configuration
Component sử dụng backend proxy để gọi Gemini API:
- Endpoint: `/api/gemini/generate`
- Model: `gemini-2.0-flash-exp`
- Response format: JSON

### Local Storage
Dữ liệu được lưu trong localStorage:
- `mindful_sessions_v9`: Các phiên tư vấn
- `mindful_user_v9`: Thông tin người dùng

### Dependencies
- `lucide-react`: Icons
- `tailwindcss`: Styling

## Tích hợp vào ứng dụng

Component đã được tích hợp vào `StudySpace.js`:

```javascript
import MentalHealthMentor from './MentalHealthMentor';

// Trong tabs:
{ id: 'mental', icon: Brain, label: 'Tâm lý' }

// Trong render:
{activeTab === 'mental' && (
  <div className="rounded-2xl shadow-lg overflow-hidden" style={{ height: 'calc(100vh - 100px)' }}>
    <MentalHealthMentor />
  </div>
)}
```

## Lưu ý quan trọng

1. **API Key**: Đảm bảo đã cấu hình `GEMINI_API_KEY` trong file `.env`
2. **Bảo mật**: Không bao giờ commit API key vào Git
3. **Privacy**: Dữ liệu chỉ lưu trên trình duyệt của người dùng
4. **Responsive**: Giao diện tối ưu cho cả desktop và mobile

## Troubleshooting

### Lỗi "Kết nối hơi chập chờn"
- Kiểm tra API key trong `.env`
- Kiểm tra kết nối internet
- Xem console log để biết chi tiết lỗi

### Lộ trình không được tạo
- Đảm bảo đã chia sẻ đủ thông tin về vấn đề
- Thử mở khóa lộ trình (nếu đang bị khóa)
- Bắt đầu phiên mới

### Dữ liệu bị mất
- Kiểm tra localStorage của trình duyệt
- Không xóa cache/cookies nếu muốn giữ dữ liệu
- Xuất dữ liệu quan trọng ra file (tính năng sẽ được thêm)

## Roadmap

- [ ] Xuất/Nhập dữ liệu
- [ ] Thống kê cảm xúc theo thời gian
- [ ] Nhắc nhở thực hiện lộ trình
- [ ] Chia sẻ lộ trình với giáo viên/phụ huynh
- [ ] Tích hợp với Health Tracker

## Liên hệ & Đóng góp

Nếu bạn có ý tưởng hoặc phát hiện lỗi, vui lòng tạo issue trên GitHub.

---

**Lưu ý**: Đây là công cụ hỗ trợ, không thay thế cho tư vấn tâm lý chuyên nghiệp. Nếu bạn gặp vấn đề nghiêm trọng, hãy tìm kiếm sự giúp đỡ từ chuyên gia.
