// Đây là phiên bản rút gọn prompt để tránh MAX_TOKENS

export const createShortPrompt = (config, userQuestion) => {
  return `Giáo viên ${config.subject} lớp ${config.grade}. Học sinh hỏi: "${userQuestion}"

Trả lời ngắn (2-3 câu) theo Socratic: đặt câu hỏi gợi mở, không đưa đáp án. Dùng emoji. LaTeX: $công thức$.`;
};

export const createHintPrompt = (config, userQuestion, hintLevel) => {
  const levels = {
    1: 'Gợi ý nhẹ: hướng xem lại kiến thức cơ bản',
    2: 'Gợi ý trung bình: đề cập công thức cần dùng',
    3: 'Gợi ý chi tiết: gợi ý bước đầu tiên',
    4: 'Gợi ý gần lời giải: chỉ thiếu bước tính cuối'
  };

  return `Giáo viên ${config.subject} lớp ${config.grade}. Câu hỏi: "${userQuestion}"

Gợi ý lần ${hintLevel}/4. ${levels[hintLevel]}. Trả lời ngắn 1-2 câu. Dùng emoji 💡. LaTeX: $công thức$.`;
};

export const createSolutionPrompt = (config, userQuestion) => {
  return `Giáo viên ${config.subject} lớp ${config.grade}. Câu hỏi: "${userQuestion}"

Đưa ra lời giải chi tiết:
Bước 1: [Phân tích]
Bước 2: [Công thức]
Bước 3: [Giải]
Bước 4: [Kết luận]

LaTeX: $công thức$. Ngắn gọn.`;
};
