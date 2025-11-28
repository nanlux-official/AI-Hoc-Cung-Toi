// Prompt được tối ưu để đưa ra câu trả lời chi tiết và sát với câu hỏi

export const createShortPrompt = (config, userQuestion) => {
  return `Bạn là giáo viên ${config.subject} lớp ${config.grade}, sách ${config.bookSet} (Chương trình 2018).

CÂU HỎI CỦA HỌC SINH:
"${userQuestion}"

YÊU CẦU TRẢ LỜI:
1. PHÂN TÍCH CÂU HỎI: Xác định chính xác nội dung học sinh đang hỏi
2. KIẾN THỨC LIÊN QUAN: Nêu rõ kiến thức/công thức cần áp dụng
3. HƯỚNG DẪN CỤ THỂ: 
   - Nếu là bài tập: Hướng dẫn từng bước giải chi tiết
   - Nếu là lý thuyết: Giải thích rõ ràng, dễ hiểu với ví dụ
4. GỢI Ý THÊM: Lưu ý quan trọng, sai lầm thường gặp

ĐỊNH DẠNG:
- Dùng emoji phù hợp (🤔 💡 ⚠️ ✅)
- Công thức LaTeX: $công thức$
- Trình bày rõ ràng, có cấu trúc
- Độ dài: 5-8 câu (đủ chi tiết nhưng không dài dòng)

Hãy trả lời SAT với nội dung câu hỏi, KHÔNG nói chung chung!`;
};

export const createHintPrompt = (config, userQuestion, hintLevel) => {
  const levels = {
    1: {
      desc: 'Gợi ý nhẹ nhàng',
      guide: 'Chỉ hướng học sinh xem lại phần kiến thức nào trong sách, không nói cụ thể công thức'
    },
    2: {
      desc: 'Gợi ý trung bình',
      guide: 'Nêu tên công thức/định lý cần dùng, nhưng chưa hướng dẫn cách áp dụng'
    },
    3: {
      desc: 'Gợi ý chi tiết',
      guide: 'Hướng dẫn bước đầu tiên cần làm, gợi ý cách tiếp cận bài toán'
    },
    4: {
      desc: 'Gợi ý gần lời giải',
      guide: 'Hướng dẫn chi tiết các bước, chỉ để học sinh tự tính toán bước cuối'
    }
  };

  return `Bạn là giáo viên ${config.subject} lớp ${config.grade}.

CÂU HỎI: "${userQuestion}"

ĐÂY LÀ GỢI Ý LẦN ${hintLevel}/4 - ${levels[hintLevel].desc.toUpperCase()}

YÊU CẦU:
${levels[hintLevel].guide}

ĐỊNH DẠNG:
- Bắt đầu với emoji 💡
- Độ dài: 2-3 câu
- LaTeX: $công thức$
- Khuyến khích học sinh tự suy nghĩ

Gợi ý phải SÁT với câu hỏi cụ thể này!`;
};

export const createSolutionPrompt = (config, userQuestion) => {
  return `Bạn là giáo viên ${config.subject} lớp ${config.grade}, sách ${config.bookSet} (Chương trình 2018).

CÂU HỎI: "${userQuestion}"

YÊU CẦU LỜI GIẢI CHI TIẾT:

📖 BƯỚC 1: PHÂN TÍCH ĐỀ BÀI
- Xác định dữ kiện đã cho
- Xác định yêu cầu bài toán
- Nhận dạng dạng bài

📐 BƯỚC 2: KIẾN THỨC & CÔNG THỨC
- Nêu rõ công thức/định lý cần dùng
- Giải thích tại sao dùng công thức này
- Viết công thức bằng LaTeX: $công thức$

✍️ BƯỚC 3: GIẢI CHI TIẾT
- Trình bày từng bước tính toán
- Giải thích logic mỗi bước
- Không bỏ qua bước nào

✅ BƯỚC 4: KẾT LUẬN & KIỂM TRA
- Đưa ra đáp án cuối cùng
- Kiểm tra tính hợp lý
- Đơn vị (nếu có)

💡 LƯU Ý QUAN TRỌNG:
- Những điểm dễ nhầm lẫn
- Cách nhớ công thức
- Bài tập tương tự

📚 THAM KHẢO SGK:
Gợi ý cụ thể:
- BÀI: [Tên bài trong SGK]
- CHƯƠNG: [Chương nào]
- TRANG: [Khoảng trang]
- CHỦ ĐỀ: [Kiến thức liên quan]

Lời giải phải CHI TIẾT, DỄ HIỂU, và SÁT với câu hỏi!`;
};
