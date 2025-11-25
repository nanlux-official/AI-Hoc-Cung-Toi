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

// ============= V4 ENDPOINTS =============

router.post('/socratic-v4', async (req, res) => {
  const { userId, message, config, conversationHistory, hintCount } = req.body;
  
  const response = generateSocraticV4Response(message, conversationHistory, config, hintCount);
  res.json(response);
});

router.post('/hint-v4', async (req, res) => {
  const { userId, config, conversationHistory, hintLevel } = req.body;
  
  const hint = generateHintV4(conversationHistory, hintLevel, config);
  res.json({ message: hint, level: hintLevel });
});

router.post('/solution-v4', async (req, res) => {
  const { userId, config, conversationHistory } = req.body;
  
  const solution = generateSolutionV4(conversationHistory, config);
  res.json(solution);
});

// Hàm tạo response Socratic V4 với 4 luật gợi ý
function generateSocraticV4Response(message, history, config, hintCount) {
  const { subject, grade, bookSet, teacher } = config;
  const isFirstQuestion = history.filter(h => h.type === 'user').length === 1;
  
  if (isFirstQuestion) {
    return {
      message: formatWithLatex(`🤔 **Câu hỏi hay đấy!** Hãy cùng tư duy theo phương pháp Socratic nhé.\n\n**Bước 1:** Em hãy cho thầy/cô biết:\n• Em đã biết gì về vấn đề này?\n• Em nghĩ nên bắt đầu từ đâu?\n\n💡 *Gợi ý: Hãy nhớ lại kiến thức đã học trong ${subject} lớp ${grade}*`),
      encouragement: "✨ Đừng lo sai, hãy thử suy nghĩ!"
    };
  }
  
  // Phân tích câu trả lời của học sinh
  const analysis = analyzeStudentAnswer(message, history, config);
  
  return {
    message: formatWithLatex(analysis.feedback),
    encouragement: analysis.encouragement,
    nextStep: analysis.nextStep
  };
}

// Hệ thống 4 luật gợi ý
function generateHintV4(history, level, config) {
  const { subject, grade, bookSet } = config;
  const firstQuestion = history.find(h => h.type === 'user')?.text || '';
  
  const hints = {
    1: `💡 **Gợi ý cấp 1 - Định hướng tổng quát:**\n\nHãy xem xét:\n• Đây là dạng bài gì trong ${subject}?\n• Kiến thức nào liên quan (công thức, định lý, quy luật)?\n• Dữ kiện đã cho là gì?\n\n🎯 *Mục tiêu: Xác định hướng giải*`,
    
    2: `💡 **Gợi ý cấp 2 - Phương pháp cụ thể:**\n\n**Bước tiếp cận:**\n1️⃣ Liệt kê các dữ kiện đã cho\n2️⃣ Xác định công thức/phương pháp phù hợp\n3️⃣ Lập kế hoạch giải từng bước\n\n📚 *Tham khảo: ${bookSet} - ${subject} ${grade}*`,
    
    3: `💡 **Gợi ý cấp 3 - Hướng dẫn chi tiết:**\n\n**Các bước giải:**\n• **Bước 1:** ${generateStep1Hint(firstQuestion, subject)}\n• **Bước 2:** ${generateStep2Hint(firstQuestion, subject)}\n• **Bước 3:** ${generateStep3Hint(firstQuestion, subject)}\n\n⚡ *Hãy thử làm theo từng bước!*`,
    
    4: `💡 **Gợi ý cấp 4 - Gần như lời giải:**\n\n**Hướng giải hoàn chỉnh:**\n\n${generateNearSolutionHint(firstQuestion, subject, config)}\n\n🎓 *Bây giờ em hãy hoàn thành phần tính toán cuối cùng!*`
  };
  
  return formatWithLatex(hints[level] || hints[1]);
}

// Tạo lời giải V4 với trích dẫn sách giáo khoa
function generateSolutionV4(history, config) {
  const { subject, grade, bookSet } = config;
  const firstQuestion = history.find(h => h.type === 'user')?.text || '';
  
  const solution = generateDetailedSolution(firstQuestion, subject, config);
  const bookReference = generateBookReferenceV4(firstQuestion, subject, grade, bookSet);
  
  return {
    solution: formatWithLatex(solution),
    bookReference
  };
}

// Phân tích câu trả lời học sinh
function analyzeStudentAnswer(answer, history, config) {
  const answerLength = answer.trim().length;
  const hasNumbers = /\d/.test(answer);
  const hasExplanation = answer.length > 50;
  
  if (answerLength < 10) {
    return {
      feedback: "🤔 Câu trả lời của em hơi ngắn. Hãy giải thích rõ hơn:\n• Em nghĩ như vậy vì lý do gì?\n• Em đã áp dụng kiến thức nào?",
      encouragement: "💪 Đừng ngại, hãy chia sẻ suy nghĩ của em!",
      nextStep: "Thử viết chi tiết hơn"
    };
  }
  
  if (!hasExplanation) {
    return {
      feedback: "👍 **Tốt!** Em đã có câu trả lời.\n\n🔍 Bây giờ hãy đi sâu hơn:\n• **Tại sao** lại như vậy?\n• Em có thể chứng minh hoặc giải thích thêm không?",
      encouragement: "✨ Em đang trên đúng hướng!",
      nextStep: "Giải thích lý do"
    };
  }
  
  return {
    feedback: "🎉 **Xuất sắc!** Em đã suy nghĩ rất kỹ.\n\n✅ Những điểm tốt:\n• Có lập luận rõ ràng\n• Trình bày có hệ thống\n\n🚀 **Câu hỏi mở rộng:** Em có thể áp dụng cách này vào bài toán tương tự không?",
    encouragement: "🌟 Tuyệt vời! Tiếp tục phát huy!",
    nextStep: "Thử bài tập nâng cao"
  };
}

// Các hàm hỗ trợ tạo gợi ý theo bước
function generateStep1Hint(question, subject) {
  const hints = {
    'Toán': 'Xác định dạng toán và liệt kê dữ kiện',
    'Hóa học': 'Viết phương trình phản ứng và cân bằng',
    'Vật lý': 'Vẽ sơ đồ và xác định các đại lượng',
    'Sinh học': 'Phân tích cơ chế sinh học liên quan'
  };
  return hints[subject] || 'Phân tích đề bài và xác định yêu cầu';
}

function generateStep2Hint(question, subject) {
  const hints = {
    'Toán': 'Áp dụng công thức hoặc định lý phù hợp',
    'Hóa học': 'Tính toán số mol và khối lượng',
    'Vật lý': 'Áp dụng định luật vật lý',
    'Sinh học': 'Liên hệ với kiến thức đã học'
  };
  return hints[subject] || 'Chọn phương pháp giải phù hợp';
}

function generateStep3Hint(question, subject) {
  return 'Thực hiện tính toán và kiểm tra kết quả';
}

function generateNearSolutionHint(question, subject, config) {
  return `**Phân tích đề bài:**\n${question}\n\n**Kiến thức cần dùng:**\n• Công thức/Định lý chính\n• Các bước biến đổi\n\n**Hướng giải:**\n1. [Bước 1 cụ thể]\n2. [Bước 2 cụ thể]\n3. [Bước 3 cụ thể]\n\n*Giờ em hãy tính toán để ra kết quả cuối cùng!*`;
}

function generateDetailedSolution(question, subject, config) {
  return `📚 **Lời giải chi tiết**\n\n**Đề bài:** ${question}\n\n**Phân tích:**\nĐây là bài toán về ${subject}. Ta cần áp dụng các kiến thức:\n• Khái niệm cơ bản\n• Công thức liên quan\n• Phương pháp giải\n\n**Các bước giải:**\n\n**Bước 1:** Xác định dữ kiện\n• Dữ kiện 1: ...\n• Dữ kiện 2: ...\n\n**Bước 2:** Áp dụng công thức\n• Công thức: $f(x) = ax^2 + bx + c$\n• Thay số: ...\n\n**Bước 3:** Tính toán\n• Kết quả: ...\n\n**Đáp án:** [Kết quả cuối cùng]\n\n💡 **Lưu ý:** Luôn kiểm tra lại đơn vị và điều kiện của bài toán!`;
}

function generateBookReferenceV4(question, subject, grade, bookSet) {
  // Dữ liệu mẫu - trong thực tế nên có database
  const references = {
    'Toán': {
      lesson: 'Bài 3: Hàm số bậc hai',
      chapter: 'Chương 2: Hàm số và đồ thị',
      pages: '45-52',
      book: `SGK Toán ${grade} - ${bookSet}`
    },
    'Hóa học': {
      lesson: 'Bài 5: Phản ứng oxi hóa khử',
      chapter: 'Chương 3: Phản ứng hóa học',
      pages: '67-74',
      book: `SGK Hóa học ${grade} - ${bookSet}`
    },
    'Vật lý': {
      lesson: 'Bài 4: Định luật Newton',
      chapter: 'Chương 2: Động lực học',
      pages: '34-41',
      book: `SGK Vật lý ${grade} - ${bookSet}`
    },
    'Sinh học': {
      lesson: 'Bài 6: Quang hợp',
      chapter: 'Chương 3: Trao đổi chất',
      pages: '56-63',
      book: `SGK Sinh học ${grade} - ${bookSet}`
    }
  };
  
  return references[subject] || {
    lesson: 'Bài học liên quan',
    chapter: 'Chương tương ứng',
    pages: 'Xem SGK',
    book: `SGK ${subject} ${grade} - ${bookSet}`
  };
}

// Format text với LaTeX
function formatWithLatex(text) {
  // Giữ nguyên text, LaTeX sẽ được render ở frontend
  return text;
}

module.exports = router;
