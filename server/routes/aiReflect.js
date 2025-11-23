const express = require('express');
const router = express.Router();

// AI Reflect - Phản hồi thông minh
router.post('/analyze', async (req, res) => {
  const { answer, correctAnswer, step } = req.body;
  
  const feedback = analyzeAnswer(answer, correctAnswer, step);
  
  res.json(feedback);
});

function analyzeAnswer(answer, correctAnswer, step) {
  const isCorrect = answer === correctAnswer;
  
  if (isCorrect) {
    return {
      correct: true,
      message: "Chính xác! Em đã hiểu bài rất tốt.",
      explanation: "Lập luận của em logic và đúng phương pháp.",
      nextLevel: true
    };
  }
  
  // Phân tích lỗi sai
  return {
    correct: false,
    message: `Em đang nhầm ở bước ${step}`,
    hint: "Thử áp dụng định luật bảo toàn điện tích xem kết quả có khác không?",
    suggestion: "Hãy xem lại phần lý thuyết về liên kết ion",
    encouragement: "Đừng nản, em gần đúng rồi!",
    correctApproach: "Cách tiếp cận đúng là..."
  };
}

module.exports = router;
