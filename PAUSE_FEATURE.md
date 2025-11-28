# ⏸️ Tính năng Tạm dừng Học tập

## 📋 Mô tả

Tính năng giới hạn số lần tạm dừng học tập để giúp học sinh tập trung hơn.

## ✨ Tính năng chính

### 1. Giới hạn số lần dừng
- **Tối đa**: 3 lần dừng mỗi phiên học
- **Hiển thị**: Số lần dừng hiện tại/tối đa (VD: 1/3)
- **Cảnh báo**: Khi đạt giới hạn, không thể dừng thêm

### 2. Yêu cầu lý do
Khi nhấn "Tạm dừng", một modal sẽ hiện ra yêu cầu:
- **Lý do dừng** (bắt buộc)
- Tối đa 100 ký tự
- VD: "Đi vệ sinh", "Uống nước", "Nghỉ ngơi"

### 3. Lưu trữ lịch sử
Mỗi lần dừng được lưu vào localStorage:
- Thời gian dừng
- Lý do dừng
- Tổng thời gian học đã tích lũy

## 🎯 Mục đích

1. **Tăng tập trung**: Giới hạn số lần dừng giúp học sinh tập trung hơn
2. **Tự giác**: Yêu cầu lý do giúp học sinh suy nghĩ trước khi dừng
3. **Theo dõi**: Lưu lịch sử để xem lại thói quen học tập

## 💡 Cách sử dụng

### Bước 1: Bắt đầu học
1. Click nút "Bắt đầu" ở sidebar
2. Timer bắt đầu đếm

### Bước 2: Tạm dừng (nếu cần)
1. Click nút "Tạm dừng"
2. Modal hiện ra
3. Nhập lý do dừng (bắt buộc)
4. Click "Xác nhận dừng"

### Bước 3: Tiếp tục học
1. Click "Bắt đầu" để tiếp tục
2. Timer tiếp tục đếm

## ⚠️ Lưu ý

### Khi đạt giới hạn (3/3)
- Nút "Tạm dừng" vẫn hiển thị
- Nhưng khi click sẽ có thông báo:
  > "⚠️ Bạn đã dừng 3 lần rồi! Hãy tập trung học tập nhé."
- Không thể dừng thêm cho đến khi reset

### Reset số lần dừng
Số lần dừng được lưu trong localStorage. Để reset:
1. Mở Console (F12)
2. Chạy: `localStorage.removeItem('pauseCount')`
3. Hoặc: `localStorage.clear()` (xóa tất cả)

## 📊 Dữ liệu lưu trữ

### pauseCount
```javascript
localStorage.getItem('pauseCount') // "3"
```

### pauseHistory
```javascript
[
  {
    "time": "2024-01-15T10:30:00.000Z",
    "reason": "Đi vệ sinh",
    "duration": 1800 // 30 phút (tính bằng giây)
  },
  {
    "time": "2024-01-15T11:00:00.000Z",
    "reason": "Uống nước",
    "duration": 3600 // 1 giờ
  }
]
```

## 🔮 Tính năng tương lai

- [ ] Xem lịch sử dừng trong Dashboard
- [ ] Thống kê số lần dừng theo ngày/tuần
- [ ] Cảnh báo khi dừng quá nhiều
- [ ] Đề xuất thời gian nghỉ hợp lý
- [ ] Reset tự động mỗi ngày
- [ ] Tích hợp với Pomodoro timer

## 🎨 Giao diện

### Modal Tạm dừng
```
┌─────────────────────────────────┐
│ ⏸️ Tạm dừng học tập          ✕ │
├─────────────────────────────────┤
│ Bạn đã dừng 2/3 lần.            │
│ ⚠️ Đây là lần dừng cuối cùng!   │
│                                 │
│ Lý do dừng học: *               │
│ ┌─────────────────────────────┐ │
│ │ VD: Đi vệ sinh, uống nước...│ │
│ │                             │ │
│ └─────────────────────────────┘ │
│ 25/100 ký tự                    │
│                                 │
│ [  Hủy  ] [Xác nhận dừng]      │
└─────────────────────────────────┘
```

### Sidebar Timer
```
┌─────────────────────┐
│ TỔNG THỜI GIAN      │
│ 00:14:28            │
│ Số lần dừng: 2/3    │
│ [⏸️ Tạm dừng]       │
└─────────────────────┘
```

## 🐛 Troubleshooting

### Modal không hiện
- Kiểm tra console có lỗi không
- Refresh trang (Ctrl+Shift+R)

### Số lần dừng không đúng
- Xóa localStorage và thử lại
- Kiểm tra: `localStorage.getItem('pauseCount')`

### Không thể dừng
- Kiểm tra đã đạt giới hạn chưa (3/3)
- Xem console có thông báo gì không

## 📝 Code Reference

File: `client/src/components/StudySpace.js`

Các state quan trọng:
- `showPauseModal`: Hiển thị/ẩn modal
- `pauseReason`: Lý do dừng
- `pauseCount`: Số lần đã dừng
- `MAX_PAUSES`: Giới hạn (3 lần)

Các function:
- `handlePauseClick()`: Xử lý khi click nút dừng
- `handleConfirmPause()`: Xác nhận dừng và lưu dữ liệu

---

**Lưu ý**: Tính năng này giúp học sinh tự giác hơn trong việc quản lý thời gian học tập. Không nên lạm dụng việc dừng quá nhiều!
