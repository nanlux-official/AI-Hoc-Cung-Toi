const express = require('express');
const router = express.Router();

const conversations = {};

const SOCRATIC_SYSTEM_PROMPT = `Bạn là "AI Mentor" - trợ lý giáo dục theo phương pháp Socratic.
LUẬT: KHÔNG đưa đáp án trực tiếp. Đặt câu hỏi dẫn dắt. Khen ngợi và sửa hướng nhẹ nhàng.`;

router.post('/socratic', async (req, res) => {
  const { userId, message, conversationHistory, hintLevel, settings } = req.body;
  
  const response = generateSocraticResponse(message, conversationHistory, hintLevel || 0, settings);
  res.json(response);
});

router.post('/hint', async (req, res) => {
  const { conversationHistory, currentHintLevel, settings } = req.body;
  const newLevel = Math.min(currentHintLevel + 1, 4);
  const hint = generateHint(conversationHistory, newLevel, settings);
  res.json({ level: newLevel, message: hint, hintLevel: newLevel });
});

router.post('/solution', async (req, res) => {
  const { conversationHistory, settings } = req.body;
  const solution = generateSolution(conversationHistory, settings);
  res.json(solution);
});

function generateSocraticResponse(message, history, hintLevel, settings) {
  const isFirstQuestion = history.length <= 1;
  
  if (isFirstQuestion) {
    return generateInitialSocraticQuestion(message, settings);
  }
  
  return generateFollowUpResponse(message, history, hintLevel, settings);
}

function generateInitialSocraticQuestion(question, settings) {
  const subject = detectSubject(question);
  const templates = getSocraticQuestionTemplates(subject);
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  return {
    message: `🤔 **Câu hỏi hay đấy!** Thay vì mình đưa đáp án ngay, hãy cùng tư duy nhé.\n\n${template.question}`,
    hint: template.hint,
    encouragement: "✨ Hãy thử trả lời, đừng lo sai!",
    hintLevel: 0
  };
}

function generateFollowUpResponse(answer, history, hintLevel, settings) {
  const answerLength = answer.trim().length;
  
  if (answerLength < 10) {
    return {
      message: "🤔 Câu trả lời của em hơi ngắn. Hãy giải thích rõ hơn suy nghĩ của em nhé!",
      hint: "Thử phân tích từng bước và đưa ra lý do",
      encouragement: "Đừng ngại, hãy chia sẻ những gì em nghĩ!",
      hintLevel
    };
  }
  
  return {
    message: `✅ **Tốt lắm!** Em đã cố gắng suy nghĩ.\n\n🔍 Bây giờ hãy đi sâu hơn:\n• Em có thể giải thích **tại sao** lại như vậy không?\n• Có yếu tố nào ảnh hưởng đến kết quả này?`,
    hint: "Nghĩ về nguyên nhân và kết quả",
    encouragement: "Em đang trên đúng hướng!",
    hintLevel
  };
}

function generateHint(history, level, settings) {
  const hints = [
    "💡 **Gợi ý cấp 1:** Hãy xem xét các khái niệm cơ bản liên quan đến vấn đề này.",
    "💡 **Gợi ý cấp 2:** Thử áp dụng công thức hoặc quy luật em đã học.",
    "💡 **Gợi ý cấp 3:** Phân tích từng bước: xác định dữ liệu → áp dụng phương pháp → tính toán.",
    "💡 **Gợi ý cấp 4:** Đây là hướng giải: Bước 1... Bước 2... Hãy thử làm theo!"
  ];
  
  return hints[level - 1] || hints[0];
}

function generateSolution(history, settings) {
  const firstQuestion = history.find(h => h.type === 'user')?.text || '';
  const subject = detectSubject(firstQuestion);
  
  return {
    solution: `📚 **Lời giải chi tiết:**\n\n**Phân tích:**\nĐây là bài toán về ${subject}.\n\n**Các bước giải:**\n1️⃣ Xác định dữ liệu đã cho\n2️⃣ Áp dụng công thức/định lý\n3️⃣ Tính toán và kết luận\n\n**Đáp án:** [Kết quả]\n\n💡 **Ghi nhớ:** Luôn phân tích kỹ đề bài trước khi giải!`,
    bookReferences: generateBookReferences(firstQuestion, settings)
  };
}

function generateBookReferences(question, settings) {
  const { grade, subject, bookSet } = settings;
  
  return [
    {
      topic: "Kiến thức nền tảng",
      book: `SGK ${subject} ${grade} - ${bookSet}`,
      page: "45-48",
      lesson: "Bài 5"
    },
    {
      topic: "Bài tập vận dụng",
      book: `SBT ${subject} ${grade} - ${bookSet}`,
      page: "23-25",
      lesson: "Bài 5"
    }
  ];
}

function detectSubject(text) {
  const lower = text.toLowerCase();
  if (lower.match(/phương trình|hàm số|đạo hàm|tích phân/)) return 'Toán học';
  if (lower.match(/electron|phản ứng|nguyên tố|hóa/)) return 'Hóa học';
  if (lower.match(/tế bào|gen|quang hợp|sinh/)) return 'Sinh học';
  if (lower.match(/lực|năng lượng|điện|vật lý/)) return 'Vật lý';
  return 'Kiến thức chung';
}

function getSocraticQuestionTemplates(subject) {
  return [
    {
      question: "📍 **Bước 1:** Em đã biết những gì về vấn đề này?\n📍 **Bước 2:** Em nghĩ câu trả lời có thể là gì?",
      hint: "Bắt đầu từ kiến thức cơ bản em đã học"
    },
    {
      question: "📍 Hãy phân tích: Đây là vấn đề về gì?\n📍 Có công thức/quy luật nào liên quan không?",
      hint: "Nghĩ về các khái niệm đã học trong chương này"
    }
  ];
}

module.exports = router;
