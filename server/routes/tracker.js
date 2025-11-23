const express = require('express');
const router = express.Router();

let learningData = {}; // Trong thực tế dùng database

// Ghi nhận hoạt động học
router.post('/log', (req, res) => {
  const { userId, activity, duration, accuracy, subject } = req.body;
  
  if (!learningData[userId]) {
    learningData[userId] = {
      sessions: [],
      totalTime: 0,
      subjects: {},
      weeklyProgress: []
    };
  }
  
  const session = {
    timestamp: new Date(),
    activity,
    duration,
    accuracy,
    subject
  };
  
  learningData[userId].sessions.push(session);
  learningData[userId].totalTime += duration;
  
  if (!learningData[userId].subjects[subject]) {
    learningData[userId].subjects[subject] = { time: 0, accuracy: [] };
  }
  
  learningData[userId].subjects[subject].time += duration;
  learningData[userId].subjects[subject].accuracy.push(accuracy);
  
  res.json({ success: true, message: "Đã ghi nhận tiến độ" });
});

// Lấy báo cáo tuần
router.get('/report/:userId', (req, res) => {
  const { userId } = req.params;
  const data = learningData[userId] || { sessions: [], totalTime: 0, subjects: {} };
  
  const report = generateWeeklyReport(data);
  
  res.json(report);
});

function generateWeeklyReport(data) {
  const subjects = Object.keys(data.subjects);
  const improvements = [];
  const weaknesses = [];
  
  subjects.forEach(subject => {
    const accuracies = data.subjects[subject].accuracy;
    const avgAccuracy = accuracies.reduce((a, b) => a + b, 0) / accuracies.length;
    
    if (avgAccuracy > 75) {
      improvements.push(subject);
    } else if (avgAccuracy < 50) {
      weaknesses.push(subject);
    }
  });
  
  return {
    totalTime: Math.round(data.totalTime / 60), // phút
    sessionsCount: data.sessions.length,
    improvements,
    weaknesses,
    message: improvements.length > 0 
      ? `Tuần này bạn tiến bộ ở ${improvements.join(', ')}!` 
      : "Hãy cố gắng hơn tuần sau nhé!",
    suggestion: weaknesses.length > 0 
      ? `Cần củng cố thêm: ${weaknesses.join(', ')}` 
      : "Bạn đang học rất tốt!"
  };
}

module.exports = router;
