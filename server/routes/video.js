const express = require('express');
const router = express.Router();

let videoProgress = {}; // Trong thực tế dùng database

// Lấy câu hỏi cho video
router.get('/question/:videoId/:timestamp', (req, res) => {
  const { videoId, timestamp } = req.params;
  
  const question = getQuestionForTimestamp(videoId, timestamp);
  
  res.json(question);
});

// Kiểm tra câu trả lời
router.post('/answer', (req, res) => {
  const { userId, videoId, questionId, answer, attempts } = req.body;
  
  const isCorrect = checkVideoAnswer(questionId, answer);
  
  if (!videoProgress[userId]) {
    videoProgress[userId] = {};
  }
  
  if (!videoProgress[userId][videoId]) {
    videoProgress[userId][videoId] = {
      wrongAttempts: 0,
      questionsAnswered: 0,
      correctAnswers: 0
    };
  }
  
  const progress = videoProgress[userId][videoId];
  
  if (isCorrect) {
    progress.correctAnswers++;
    progress.questionsAnswered++;
  } else {
    progress.wrongAttempts++;
    
    // Nếu sai 3 lần, yêu cầu xem lại
    if (attempts >= 3) {
      return res.json({
        correct: false,
        action: 'replay',
        message: "Hãy xem lại phần trước để hiểu rõ hơn nhé!",
        replayFrom: Math.max(0, parseInt(timestamp) - 180) // Tua lại 3 phút
      });
    }
  }
  
  res.json({
    correct: isCorrect,
    action: isCorrect ? 'continue' : 'retry',
    message: isCorrect ? "Chính xác! Tiếp tục xem nhé." : "Chưa đúng, thử lại xem!",
    attemptsLeft: 3 - attempts
  });
});

// Kiểm tra hoàn thành video
router.post('/complete', (req, res) => {
  const { userId, videoId } = req.body;
  
  const progress = videoProgress[userId]?.[videoId] || { correctAnswers: 0, questionsAnswered: 0 };
  const accuracy = progress.questionsAnswered > 0 
    ? (progress.correctAnswers / progress.questionsAnswered) * 100 
    : 0;
  
  const passed = accuracy >= 75;
  
  res.json({
    passed,
    accuracy: Math.round(accuracy),
    message: passed 
      ? "Xuất sắc! Bạn đã hiểu bài rất tốt. Chuyển sang bài tiếp theo!" 
      : "Bạn cần xem lại video để đạt 75% trở lên.",
    canProceed: passed
  });
});

function getQuestionForTimestamp(videoId, timestamp) {
  // Câu hỏi mẫu theo thời điểm
  const questions = {
    180: { // 3 phút
      id: 'q1',
      question: "Em vừa học được khái niệm gì?",
      options: ["Liên kết ion", "Liên kết cộng hóa trị", "Liên kết kim loại", "Liên kết hydro"],
      correctAnswer: 0
    },
    360: { // 6 phút
      id: 'q2',
      question: "Vì sao NaCl có cấu trúc tinh thể?",
      options: ["Do lực hút tĩnh điện", "Do lực Van der Waals", "Do liên kết cộng hóa trị", "Do áp suất"],
      correctAnswer: 0
    }
  };
  
  return questions[timestamp] || questions[180];
}

function checkVideoAnswer(questionId, answer) {
  // Logic kiểm tra - trong thực tế lấy từ database
  return Math.random() > 0.4;
}

module.exports = router;
