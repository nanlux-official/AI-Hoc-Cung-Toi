const express = require('express');
const router = express.Router();

// Challenge Mode - Thử thách phản biện
let userProgress = {}; // Trong thực tế dùng database

router.get('/next/:userId', (req, res) => {
  const { userId } = req.params;
  
  // Khởi tạo progress nếu chưa có
  if (!userProgress[userId]) {
    userProgress[userId] = { 
      level: 1, 
      correctRate: 0,
      totalAnswers: 0,
      correctAnswers: 0
    };
  }
  
  const progress = userProgress[userId];
  const challenge = generateChallenge(progress);
  
  // Thêm level vào response
  challenge.level = progress.level;
  
  res.json(challenge);
});

router.post('/submit', (req, res) => {
  const { userId, answer, questionId } = req.body;
  
  if (!userProgress[userId]) {
    userProgress[userId] = { 
      level: 1, 
      correctRate: 0, 
      totalAnswers: 0, 
      correctAnswers: 0,
      currentQuestion: null
    };
  }
  
  const isCorrect = checkAnswer(answer, questionId);
  const progress = userProgress[userId];
  
  progress.totalAnswers++;
  if (isCorrect) progress.correctAnswers++;
  progress.correctRate = (progress.correctAnswers / progress.totalAnswers) * 100;
  
  // Điều chỉnh độ khó - DỄ LÊN LEVEL HƠN
  // Đúng 3/5 câu (60%) → Lên level
  if (progress.correctAnswers >= 3 && progress.totalAnswers >= 5) {
    progress.level = Math.min(progress.level + 1, 3); // Max level 3
    progress.totalAnswers = 0;
    progress.correctAnswers = 0;
  } 
  // Sai quá nhiều → Giảm level
  else if (progress.correctRate < 40 && progress.totalAnswers >= 5) {
    progress.level = Math.max(1, progress.level - 1);
    progress.totalAnswers = 0;
    progress.correctAnswers = 0;
  }
  
  let feedback = '';
  if (isCorrect) {
    feedback = "✅ Xuất sắc! Câu trả lời của bạn đã nắm được điểm chính.";
  } else {
    feedback = "❌ Câu trả lời chưa đủ chi tiết hoặc thiếu từ khóa quan trọng. Hãy thử giải thích rõ hơn!";
  }
  
  res.json({
    correct: isCorrect,
    newLevel: progress.level,
    correctRate: Math.round(progress.correctRate),
    message: feedback,
    totalAnswers: progress.totalAnswers,
    correctAnswers: progress.correctAnswers
  });
});

function generateChallenge(progress) {
  const challengesByLevel = {
    1: [ // Level 1 - Cơ bản
      {
        id: 'q1_1',
        question: "Vì sao lá cây có màu xanh?",
        type: "basic",
        hint: "Nghĩ về sắc tố trong lá",
        keywords: ['diệp lục', 'chlorophyll', 'xanh', 'phản xạ', 'hấp thụ', 'ánh sáng']
      },
      {
        id: 'q1_2',
        question: "Tại sao nước đá nổi trên mặt nước?",
        type: "basic",
        hint: "So sánh khối lượng riêng",
        keywords: ['khối lượng riêng', 'nhẹ hơn', 'mật độ', 'nổi']
      },
      {
        id: 'q1_3',
        question: "Vì sao sắt để ngoài trời bị gỉ?",
        type: "basic",
        hint: "Nghĩ về phản ứng với không khí",
        keywords: ['oxi', 'oxi hóa', 'không khí', 'ẩm', 'gỉ sắt']
      },
      {
        id: 'q1_4',
        question: "Tại sao muối ăn tan trong nước?",
        type: "basic",
        hint: "Xét tương tác giữa muối và nước",
        keywords: ['ion', 'phân cực', 'tan', 'nước', 'tương tác']
      },
      {
        id: 'q1_5',
        question: "Vì sao cây cần ánh sáng mặt trời?",
        type: "basic",
        hint: "Nghĩ về quá trình quang hợp",
        keywords: ['quang hợp', 'năng lượng', 'glucose', 'diệp lục']
      }
    ],
    2: [ // Level 2 - Trung cấp (12 câu)
      // Hóa học
      {
        id: 'q2_1',
        question: "Vì sao NaCl tan trong nước nhưng không tan trong dầu?",
        type: "intermediate",
        hint: "Xét tính phân cực của dung môi",
        keywords: ['phân cực', 'ion', 'nước', 'dung môi', 'tương tác', 'dầu']
      },
      {
        id: 'q2_2',
        question: "Vì sao phản ứng oxi hóa - khử quan trọng trong đời sống?",
        type: "intermediate",
        hint: "Nghĩ về hô hấp, cháy, gỉ sét",
        keywords: ['oxi hóa', 'khử', 'electron', 'năng lượng', 'hô hấp']
      },
      {
        id: 'q2_3',
        question: "Giải thích tại sao kim loại dẫn điện tốt?",
        type: "intermediate",
        hint: "Nghĩ về cấu trúc electron trong kim loại",
        keywords: ['electron', 'tự do', 'di chuyển', 'dẫn điện', 'kim loại']
      },
      // Sinh học
      {
        id: 'q2_4',
        question: "Tại sao enzyme quan trọng trong cơ thể?",
        type: "intermediate",
        hint: "Vai trò xúc tác sinh học",
        keywords: ['xúc tác', 'phản ứng', 'tốc độ', 'chuyển hóa', 'protein']
      },
      {
        id: 'q2_5',
        question: "Vì sao ADN được gọi là chất mang thông tin di truyền?",
        type: "intermediate",
        hint: "Nghĩ về cấu trúc và chức năng",
        keywords: ['gen', 'mã hóa', 'protein', 'di truyền', 'thông tin']
      },
      {
        id: 'q2_6',
        question: "Giải thích vai trò của ty thể trong tế bào?",
        type: "intermediate",
        hint: "Nghĩ về năng lượng",
        keywords: ['năng lượng', 'atp', 'hô hấp', 'ty thể']
      },
      // Vật lý
      {
        id: 'q2_7',
        question: "Tại sao vật rơi tự do có gia tốc không đổi?",
        type: "intermediate",
        hint: "Nghĩ về trọng lực",
        keywords: ['trọng lực', 'gia tốc', 'không đổi', 'rơi']
      },
      {
        id: 'q2_8',
        question: "Vì sao ánh sáng bị khúc xạ khi đi qua các môi trường khác nhau?",
        type: "intermediate",
        hint: "Nghĩ về vận tốc ánh sáng",
        keywords: ['vận tốc', 'môi trường', 'khúc xạ', 'ánh sáng']
      },
      // Toán học
      {
        id: 'q2_9',
        question: "Giải thích tại sao phương trình bậc 2 có tối đa 2 nghiệm?",
        type: "intermediate",
        hint: "Nghĩ về bậc của phương trình",
        keywords: ['bậc', 'nghiệm', 'hai', 'phương trình']
      },
      {
        id: 'q2_10',
        question: "Vì sao số Pi (π) là số vô tỉ?",
        type: "intermediate",
        hint: "Nghĩ về tỉ số chu vi và đường kính",
        keywords: ['vô tỉ', 'chu vi', 'đường kính', 'không tuần hoàn']
      },
      // Văn học
      {
        id: 'q2_11',
        question: "Phân tích vai trò của xung đột trong tác phẩm văn học?",
        type: "intermediate",
        hint: "Nghĩ về cốt truyện và nhân vật",
        keywords: ['xung đột', 'cốt truyện', 'nhân vật', 'phát triển']
      },
      {
        id: 'q2_12',
        question: "Tại sao biện pháp so sánh làm tăng sức biểu cảm?",
        type: "intermediate",
        hint: "Nghĩ về hình ảnh và cảm xúc",
        keywords: ['so sánh', 'hình ảnh', 'cảm xúc', 'biểu cảm']
      }
    ],
    3: [ // Level 3 - Nâng cao (10 câu)
      // Hóa học
      {
        id: 'q3_1',
        question: "Giải thích vì sao MgO có năng lượng mạng lớn hơn NaCl?",
        type: "advanced",
        hint: "So sánh điện tích và bán kính ion",
        keywords: ['điện tích', 'mg2+', 'o2-', 'bán kính', 'lực hút', 'năng lượng mạng']
      },
      {
        id: 'q3_2',
        question: "Phân tích cơ chế phản ứng SN1 và SN2 trong hóa hữu cơ?",
        type: "advanced",
        hint: "Xét số bước và carbocation",
        keywords: ['sn1', 'sn2', 'carbocation', 'một bước', 'hai bước', 'nucleophile']
      },
      {
        id: 'q3_3',
        question: "Giải thích hiện tượng cộng hưởng trong phân tử benzene?",
        type: "advanced",
        hint: "Nghĩ về sự phân bố electron pi",
        keywords: ['cộng hưởng', 'electron', 'pi', 'benzene', 'bền', 'delocaliz']
      },
      // Sinh học
      {
        id: 'q3_4',
        question: "Phân tích cơ chế điều hòa gen ở sinh vật nhân thực?",
        type: "advanced",
        hint: "Nghĩ về yếu tố phiên mã",
        keywords: ['điều hòa', 'gen', 'phiên mã', 'yếu tố', 'biểu hiện']
      },
      {
        id: 'q3_5',
        question: "Giải thích quá trình vận chuyển electron trong chuỗi hô hấp?",
        type: "advanced",
        hint: "Nghĩ về ty thể và ATP",
        keywords: ['electron', 'chuỗi', 'atp', 'ty thể', 'năng lượng']
      },
      // Vật lý
      {
        id: 'q3_6',
        question: "Phân tích hiện tượng giao thoa ánh sáng theo thuyết sóng?",
        type: "advanced",
        hint: "Nghĩ về pha sóng",
        keywords: ['giao thoa', 'sóng', 'pha', 'cực đại', 'cực tiểu']
      },
      {
        id: 'q3_7',
        question: "Giải thích định luật bảo toàn năng lượng trong hệ kín?",
        type: "advanced",
        hint: "Nghĩ về chuyển hóa năng lượng",
        keywords: ['bảo toàn', 'năng lượng', 'chuyển hóa', 'hệ kín']
      },
      // Toán học
      {
        id: 'q3_8',
        question: "Chứng minh tại sao đạo hàm của e^x là chính nó?",
        type: "advanced",
        hint: "Nghĩ về giới hạn và định nghĩa đạo hàm",
        keywords: ['đạo hàm', 'e^x', 'giới hạn', 'hàm mũ']
      },
      {
        id: 'q3_9',
        question: "Phân tích ý nghĩa hình học của tích phân xác định?",
        type: "advanced",
        hint: "Nghĩ về diện tích dưới đồ thị",
        keywords: ['tích phân', 'diện tích', 'đồ thị', 'hình học']
      },
      // Văn học
      {
        id: 'q3_10',
        question: "Phân tích kỹ thuật dòng ý thức trong văn học hiện đại?",
        type: "advanced",
        hint: "Nghĩ về tâm lý nhân vật",
        keywords: ['dòng ý thức', 'tâm lý', 'nội tâm', 'hiện đại']
      }
    ]
  };
  
  const level = progress.level || 1;
  const questions = challengesByLevel[level] || challengesByLevel[1];
  
  // Random một câu hỏi từ level hiện tại
  const randomIndex = Math.floor(Math.random() * questions.length);
  return questions[randomIndex];
}

function checkAnswer(answer, questionId) {
  // Kiểm tra đáp án - NỚI LỎNG, chỉ cần có cố gắng trả lời
  const lowerAnswer = answer.toLowerCase().trim();
  
  // Điều kiện tối thiểu: Câu trả lời phải >= 10 ký tự
  if (lowerAnswer.length < 10) {
    return false;
  }
  
  // Loại bỏ các câu trả lời vô nghĩa
  const meaninglessAnswers = [
    'không biết',
    'ko biết',
    'chưa biết',
    'không rõ',
    'ko rõ',
    'không hiểu',
    'ko hiểu'
  ];
  
  const isMeaningless = meaninglessAnswers.some(phrase => lowerAnswer.includes(phrase));
  if (isMeaningless && lowerAnswer.length < 20) {
    return false;
  }
  
  // Nếu câu trả lời đủ dài (>= 15 ký tự) và không phải câu vô nghĩa → Chấp nhận
  if (lowerAnswer.length >= 15) {
    return true;
  }
  
  // Với câu trả lời ngắn (10-14 ký tự), kiểm tra có từ khóa liên quan không
  const commonKeywords = [
    // Từ khóa chung
    'vì', 'do', 'bởi', 'là', 'có', 'được', 'tạo', 'thành',
    // Hóa học
    'phản ứng', 'nguyên tử', 'phân tử', 'ion', 'electron', 'oxi', 'khử',
    'axit', 'bazơ', 'muối', 'kim loại', 'phi kim', 'liên kết', 'hóa trị',
    // Sinh học
    'tế bào', 'gen', 'protein', 'enzyme', 'quang hợp', 'hô hấp', 'diệp lục',
    // Vật lý
    'lực', 'năng lượng', 'điện', 'từ', 'ánh sáng', 'nhiệt', 'áp suất',
    'khối lượng', 'vận tốc', 'gia tốc', 'động năng', 'thế năng'
  ];
  
  const hasRelevantKeyword = commonKeywords.some(keyword => lowerAnswer.includes(keyword));
  
  return hasRelevantKeyword;
}

module.exports = router;
