# 🧪 Test AI Mentor V4

## Kịch Bản Test

### Test 1: Cấu Hình Ban Đầu ✅

**Bước thực hiện:**
1. Mở `/mentor-v4`
2. Điền thông tin:
   - Tên: "Nguyễn Văn A"
   - Tỉnh: "Quảng Ngãi"
   - Huyện: "Thành phố Quảng Ngãi"
   - Trường: "THPT Chuyên Lê Khiết"
   - Lớp: "11"
   - Môn: "Hóa học"
   - Bộ sách: "Kết nối tri thức"
   - Giáo viên: "Cô Vũ Thị G"
3. Nhấn "Bắt đầu học"

**Kết quả mong đợi:**
- Form biến mất
- Hiển thị lời chào: "Chào Nguyễn Văn A! Mình là trợ lý AI..."
- Header hiển thị đúng thông tin

---

### Test 2: Hỏi Đáp Socratic ✅

**Câu hỏi test:**
```
Tính pH của dung dịch HCl 0.01M
```

**Kết quả mong đợi:**
- AI không đưa đáp án trực tiếp
- AI đặt câu hỏi dẫn dắt:
  - "Em đã biết gì về pH?"
  - "HCl là axit mạnh hay yếu?"
  - "Công thức tính pH là gì?"

---

### Test 3: Hệ Thống 4 Gợi Ý ✅

**Bước thực hiện:**
1. Đặt câu hỏi: "Giải phương trình: x² - 5x + 6 = 0"
2. Nhấn "💡 Gợi ý" lần 1
3. Nhấn "💡 Gợi ý" lần 2
4. Nhấn "💡 Gợi ý" lần 3
5. Nhấn "💡 Gợi ý" lần 4
6. Thử nhấn lần 5

**Kết quả mong đợi:**

**Gợi ý 1:**
```
💡 Gợi ý cấp 1 - Định hướng tổng quát:
• Đây là dạng bài gì trong Toán?
• Kiến thức nào liên quan?
```

**Gợi ý 2:**
```
💡 Gợi ý cấp 2 - Phương pháp cụ thể:
1️⃣ Liệt kê các dữ kiện
2️⃣ Xác định công thức
```

**Gợi ý 3:**
```
💡 Gợi ý cấp 3 - Hướng dẫn chi tiết:
• Bước 1: ...
• Bước 2: ...
```

**Gợi ý 4:**
```
💡 Gợi ý cấp 4 - Gần như lời giải:
[Hướng giải hoàn chỉnh]
```

**Lần 5:** Alert "Bạn đã hết lượt gợi ý!"

---

### Test 4: LaTeX Rendering ✅

**Câu hỏi test:**
```
Tính đạo hàm của hàm số $f(x) = x^2 + 2x + 1$
```

**Kết quả mong đợi:**
- Công thức $f(x) = x^2 + 2x + 1$ hiển thị đẹp
- Không hiển thị ký tự $ thô

**Test công thức block:**
```
Tính tích phân: $$\int_{0}^{1} x^2 dx$$
```

**Kết quả mong đợi:**
- Công thức hiển thị ở giữa trang
- Kích thước lớn hơn inline

---

### Test 5: Cheat Code M10 ✅

**Bước thực hiện:**
1. Đặt câu hỏi bất kỳ
2. Nhập "M10" vào chat
3. Nhấn Enter

**Kết quả mong đợi:**
- Hiển thị confirm dialog: "Bạn có chắc muốn xem lời giải?"
- Nếu OK: Hiển thị lời giải đầy đủ
- Nếu Cancel: Không làm gì

---

### Test 6: Trích Dẫn Sách Giáo Khoa ✅

**Bước thực hiện:**
1. Đặt câu hỏi
2. Xem lời giải (M10 hoặc nút)

**Kết quả mong đợi:**
```
📖 Tham khảo sách giáo khoa:
Bài: Bài 5: Phản ứng oxi hóa khử
Chương: Chương 3: Phản ứng hóa học
Trang: 67-74
Sách: SGK Hóa học 11 - Kết nối tri thức
```

---

### Test 7: Lịch Sử Học Tập ✅

**Bước thực hiện:**
1. Hỏi đáp vài câu
2. Nhấn "➕ Chủ đề mới"
3. Nhập tên: "Bài tập Hóa học"
4. Nhấn "📚 Lịch sử"
5. Click vào phiên đã lưu

**Kết quả mong đợi:**
- Prompt nhập tên phiên
- Lưu vào history
- Panel lịch sử hiển thị
- Click vào phiên → Load lại cuộc trò chuyện

---

### Test 8: Responsive Design ✅

**Bước thực hiện:**
1. Mở DevTools
2. Chuyển sang mobile view (375px)
3. Test các tính năng

**Kết quả mong đợi:**
- Form config: 1 cột
- Chat messages: Full width
- History panel: Full width
- Buttons: Stack vertically

---

### Test 9: Phân Tích Câu Trả Lời ✅

**Test câu trả lời ngắn:**
```
User: "Không biết"
```
**Kết quả:** AI yêu cầu giải thích rõ hơn

**Test câu trả lời vừa:**
```
User: "pH = 2 vì HCl là axit mạnh"
```
**Kết quả:** AI khen và hỏi thêm "Tại sao?"

**Test câu trả lời dài:**
```
User: "pH = 2 vì HCl là axit mạnh, phân ly hoàn toàn trong nước. 
Nồng độ H+ = 0.01M, nên pH = -log(0.01) = 2"
```
**Kết quả:** AI khen ngợi và đưa câu hỏi mở rộng

---

### Test 10: Edge Cases ✅

**Test 1: Không điền đủ thông tin**
- Bỏ trống tên → Alert "Vui lòng điền đầy đủ"

**Test 2: Gửi tin nhắn rỗng**
- Nhấn Enter với ô trống → Không gửi

**Test 3: Spam gợi ý**
- Nhấn gợi ý 5 lần → Chặn sau lần 4

**Test 4: LaTeX sai cú pháp**
- Nhập `$x^2 + $` → Hiển thị text thô, không crash

---

## 📊 Checklist Tổng Hợp

- [ ] Form cấu hình hoạt động
- [ ] Socratic method đúng
- [ ] 4 cấp gợi ý hoạt động
- [ ] LaTeX render đúng
- [ ] M10 cheat code hoạt động
- [ ] Trích dẫn SGK hiển thị
- [ ] Lịch sử lưu và load
- [ ] Responsive trên mobile
- [ ] Phân tích câu trả lời thông minh
- [ ] Xử lý edge cases

---

## 🚀 Chạy Test

### Cách 1: Manual Testing
```bash
# Terminal 1: Start server
npm run server

# Terminal 2: Start client
cd client
npm start

# Mở browser: http://localhost:3000/mentor-v4
```

### Cách 2: Automated Testing (Tương lai)
```bash
npm run test:e2e
```

---

## 📝 Ghi Chú

- Hiện tại backend dùng mock data
- Cần tích hợp AI thật (OpenAI/Gemini) để response thông minh hơn
- Database cần implement để lưu lịch sử vĩnh viễn
- Có thể thêm unit tests cho các hàm helper

---

**Người test:** _______  
**Ngày test:** _______  
**Kết quả:** ⭐⭐⭐⭐⭐
