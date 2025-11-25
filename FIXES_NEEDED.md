# 🔧 Danh Sách Fix Cần Làm

## ✅ Đã Fix
1. **Thêm nhiều môn học** - Đã thêm 10 môn (Toán, Lý, Hóa, Sinh, Anh, Văn, Sử, Địa, GDCD, Tin)

## ⚠️ Cần Fix

### 2. AI Mentor - Ghi câu hỏi mà không trả lời

**Nguyên nhân:** Backend API không hoạt động trên Vercel (chỉ deploy frontend)

**Giải pháp:**
- **Option A:** Deploy backend riêng (Heroku, Railway, Render)
- **Option B:** Sử dụng Vercel Serverless Functions
- **Option C:** Tạo mock responses để demo

**File cần sửa:** `client/src/components/AIMentorV4.js`
- Line ~110: `axios.post('/api/mentor/hint-v4')`
- Line ~130: `axios.post('/api/mentor/solution-v4')`

**Fix tạm thời - Mock response:**
```javascript
// Thay vì gọi API, dùng mock data
const mockResponse = {
  hint: "Gợi ý: Hãy xem xét công thức...",
  explanation: "Giải thích chi tiết..."
};
```

### 3. Thư giãn - Thêm chỗ nhập tên

**File cần sửa:** `client/src/components/StudySpace.js`
- Function `BreathingExercise` (line ~850)
- Function `StretchExercise` (line ~910)

**Thêm:**
```javascript
const [userName, setUserName] = useState('');
const [showNameInput, setShowNameInput] = useState(true);

// Hiển thị form nhập tên trước khi bắt đầu
{showNameInput && (
  <div>
    <input 
      value={userName}
      onChange={(e) => setUserName(e.target.value)}
      placeholder="Nhập tên của bạn..."
    />
    <button onClick={() => setShowNameInput(false)}>
      Bắt đầu
    </button>
  </div>
)}
```

### 4. Sức khỏe - Trắng tinh trên Vercel

**Nguyên nhân:** Backend API `/api/health` không hoạt động

**File cần sửa:** `client/src/components/HealthTracker.js`

**Giải pháp:**
- Lưu data vào localStorage thay vì gọi API
- Hoặc deploy backend riêng

**Fix tạm thời - LocalStorage:**
```javascript
// Thay vì fetch API
const savedData = localStorage.getItem('healthData');
if (savedData) {
  setHealthData(JSON.parse(savedData));
}

// Khi save
localStorage.setItem('healthData', JSON.stringify(healthData));
```

## 🚀 Khuyến Nghị

### Deploy Backend Riêng

**Option 1: Railway (Miễn phí, dễ dùng)**
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Deploy
railway init
railway up
```

**Option 2: Render (Miễn phí)**
1. Tạo account tại render.com
2. New Web Service
3. Connect GitHub repo
4. Build Command: `npm install`
5. Start Command: `npm start`

**Option 3: Heroku**
```bash
heroku create ai-hoc-cung-toi-api
git push heroku main
```

### Sau khi deploy backend

Cập nhật `client/package.json`:
```json
{
  "proxy": "https://your-backend-url.railway.app"
}
```

Hoặc thay đổi tất cả API calls:
```javascript
// Từ
axios.post('/api/mentor/hint')

// Thành
axios.post('https://your-backend-url.railway.app/api/mentor/hint')
```

## 📝 Tóm Tắt

**Vấn đề chính:** Vercel chỉ deploy frontend, backend không hoạt động

**Giải pháp ngắn hạn:** Dùng localStorage và mock data
**Giải pháp dài hạn:** Deploy backend riêng (Railway/Render/Heroku)
