const express = require('express');
const router = express.Router();

let healthData = {}; // Trong thực tế dùng database

// Theo dõi thời gian học
router.post('/track', (req, res) => {
  const { userId, sessionStart, currentTime } = req.body;
  
  if (!healthData[userId]) {
    healthData[userId] = {
      sessions: [],
      totalStudyTime: 0,
      breaks: []
    };
  }
  
  const studyDuration = (currentTime - sessionStart) / 1000 / 60; // phút
  const recommendation = getHealthRecommendation(studyDuration, healthData[userId]);
  
  res.json(recommendation);
});

// Ghi nhận nghỉ ngơi
router.post('/break', (req, res) => {
  const { userId, breakDuration } = req.body;
  
  if (!healthData[userId]) {
    healthData[userId] = { sessions: [], totalStudyTime: 0, breaks: [] };
  }
  
  healthData[userId].breaks.push({
    timestamp: new Date(),
    duration: breakDuration
  });
  
  res.json({
    message: "Tuyệt vời! Nghỉ ngơi giúp não bộ ghi nhớ tốt hơn.",
    nextBreakIn: 25 // phút
  });
});

// Đề xuất lịch học tối ưu
router.get('/schedule/:userId', (req, res) => {
  const { userId } = req.params;
  const data = healthData[userId] || { sessions: [], breaks: [] };
  
  const schedule = generateOptimalSchedule(data);
  
  res.json(schedule);
});

function getHealthRecommendation(studyDuration, userData) {
  // Pomodoro technique: 25 phút học, 5 phút nghỉ
  if (studyDuration >= 25 && studyDuration < 30) {
    return {
      alert: true,
      type: 'break',
      message: "Bạn nên nghỉ 5 phút để tránh mỏi não.",
      suggestion: "Hãy thử bài tập hít thở nhẹ hoặc đứng dậy vận động.",
      icon: "☕"
    };
  }
  
  if (studyDuration >= 50) {
    return {
      alert: true,
      type: 'long_break',
      message: "Đã học liên tục 50 phút! Nghỉ 10-15 phút nhé.",
      suggestion: "Ra ngoài hít thở không khí trong lành, uống nước.",
      icon: "🌳"
    };
  }
  
  if (studyDuration >= 120) {
    return {
      alert: true,
      type: 'stop',
      message: "Học quá lâu có thể gây căng thẳng. Hãy dừng lại!",
      suggestion: "Nghỉ ngơi ít nhất 30 phút trước khi tiếp tục.",
      icon: "⚠️"
    };
  }
  
  return {
    alert: false,
    message: "Bạn đang học rất tốt! Tiếp tục nhé.",
    timeLeft: 25 - studyDuration,
    icon: "💪"
  };
}

function generateOptimalSchedule(data) {
  return {
    recommendation: "Lịch học tối ưu cho bạn",
    sessions: [
      { time: "07:00-07:25", subject: "Toán", type: "focus" },
      { time: "07:30-07:55", subject: "Hóa", type: "focus" },
      { time: "08:00-08:15", subject: "Nghỉ", type: "break" },
      { time: "08:15-08:40", subject: "Sinh", type: "focus" },
      { time: "08:45-09:10", subject: "Lý", type: "focus" }
    ],
    tips: [
      "Học môn khó vào buổi sáng khi não bộ tỉnh táo",
      "Nghỉ 5 phút sau mỗi 25 phút học",
      "Uống đủ nước trong quá trình học"
    ]
  };
}

module.exports = router;
