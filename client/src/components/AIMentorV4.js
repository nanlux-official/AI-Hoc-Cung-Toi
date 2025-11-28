import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AIMentorV4.css';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { provinces, districts, schools, subjects, grades, bookSets } from '../data/schoolData';
import { createShortPrompt } from './AIMentorV4_short';

// Gemini API Configuration - sử dụng backend proxy
const GEMINI_PROXY_URL = '/api/gemini';

function AIMentorV4({ userId }) {
  // Load config from localStorage
  const [config, setConfig] = useState(() => {
    const saved = localStorage.getItem('aiMentorConfig');
    return saved ? JSON.parse(saved) : {
      studentName: '',
      province: 'Quảng Ngãi',
      district: '',
      school: '',
      grade: '11',
      subject: 'Hóa học',
      bookSet: 'Kết nối tri thức',
      teacherName: ''
    };
  });
  
  const [showConfig, setShowConfig] = useState(() => {
    const saved = localStorage.getItem('aiMentorConfig');
    return !saved || !JSON.parse(saved).studentName;
  });
  
  const [conversation, setConversation] = useState(() => {
    const saved = localStorage.getItem('aiMentorConversation');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [currentInput, setCurrentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  
  const [sessionHistory, setSessionHistory] = useState(() => {
    const saved = localStorage.getItem('aiMentorHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [showHistory, setShowHistory] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  
  const chatEndRef = useRef(null);
  const MAX_HINTS = 4;

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('aiMentorConfig', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('aiMentorConversation', JSON.stringify(conversation));
  }, [conversation]);

  useEffect(() => {
    localStorage.setItem('aiMentorHistory', JSON.stringify(sessionHistory));
  }, [sessionHistory]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleStartSession = () => {
    if (!config.studentName || !config.school || !config.teacherName) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    setShowConfig(false);
    
    const greeting = {
      type: 'system',
      text: `Chào ${config.studentName}! Mình là trợ lý AI, sẽ đồng hành cùng em học ${config.subject} lớp ${config.grade}. ${getTeacherGreeting()} Hãy đặt câu hỏi để bắt đầu nhé! 📚`,
      timestamp: new Date()
    };
    setConversation([greeting]);
  };

  const getTeacherGreeting = () => {
    if (!config.teacherName) return '';
    return `Giáo viên ${config.teacherName} đã giao cho mình hỗ trợ em.`;
  };

  const callGeminiAPI = async (prompt) => {
    try {
      const response = await axios.post(GEMINI_PROXY_URL, { prompt });

      if (response.data?.success && response.data?.text) {
        return response.data.text;
      }
      throw new Error('Invalid response from Gemini API');
    } catch (error) {
      console.error('Gemini API Error:', error);
      throw error;
    }
  };

  const handleSend = async () => {
    if (!currentInput.trim()) return;

    // Check cheat code M10
    if (currentInput.trim().toUpperCase() === 'M10') {
      handleShowSolution();
      return;
    }

    const userMessage = {
      type: 'user',
      text: currentInput,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setLoading(true);
    const userQuestion = currentInput;
    setCurrentInput('');

    try {
      // Sử dụng prompt ngắn gọn
      const prompt = createShortPrompt(config, userQuestion);

      const aiResponse = await callGeminiAPI(prompt);

      const aiMessage = {
        type: 'ai',
        data: {
          message: aiResponse
        },
        timestamp: new Date()
      };

      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
      
      // Fallback khi API lỗi
      const mockResponse = {
        message: `Câu hỏi hay đấy! Hãy thử suy nghĩ theo hướng này:\n\n🤔 Em đã thử áp dụng công thức nào chưa?\n\n💡 Gợi ý: Hãy xem lại phần lý thuyết trong sách giáo khoa ${config.bookSet}.\n\n(Lỗi kết nối API, đây là câu trả lời mẫu)`
      };

      const aiMessage = {
        type: 'ai',
        data: mockResponse,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, aiMessage]);
    }
    setLoading(false);
  };

  const handleRequestHint = async () => {
    if (hintCount >= MAX_HINTS) {
      alert('Bạn đã hết lượt gợi ý! Hãy tự suy nghĩ hoặc nhập M10 để xem lời giải.');
      return;
    }

    setLoading(true);
    try {
      // Lấy câu hỏi gần nhất từ conversation
      const lastUserMessage = [...conversation].reverse().find(msg => msg.type === 'user');
      const question = lastUserMessage ? lastUserMessage.text : 'câu hỏi hiện tại';

      const hintLevel = hintCount + 1;
      const hintPrompts = {
        1: 'Gợi ý rất nhẹ, chỉ hướng học sinh xem lại kiến thức cơ bản',
        2: 'Gợi ý trung bình, đề cập đến công thức hoặc phương pháp cần dùng',
        3: 'Gợi ý chi tiết hơn, gợi ý bước đầu tiên cần làm',
        4: 'Gợi ý gần như lời giải, chỉ thiếu bước tính toán cuối cùng'
      };

      const prompt = `Bạn là giáo viên ${config.subject} lớp ${config.grade}.

Câu hỏi của học sinh: "${question}"

Đây là lần gợi ý thứ ${hintLevel}/4. ${hintPrompts[hintLevel]}.

Hãy đưa ra gợi ý phù hợp với cấp độ này:
- Sử dụng emoji 💡
- Ngắn gọn, dễ hiểu
- Không đưa ra đáp án hoàn chỉnh
- Khuyến khích học sinh tự suy nghĩ
- Nếu có công thức, dùng LaTeX: $công thức$ hoặc $$công thức$$

Chỉ trả lời gợi ý, không cần giải thích thêm.`;

      const aiResponse = await callGeminiAPI(prompt);

      const hintMessage = {
        type: 'hint',
        data: {
          message: aiResponse
        },
        level: hintLevel,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, hintMessage]);
      setHintCount(prev => prev + 1);
    } catch (error) {
      console.error('Error:', error);
      
      // Fallback
      const hintLevels = [
        { message: '💡 Gợi ý cấp 1: Hãy xem lại định nghĩa cơ bản trong sách giáo khoa.' },
        { message: '💡 Gợi ý cấp 2: Công thức liên quan là gì? Hãy viết ra giấy.' },
        { message: '💡 Gợi ý cấp 3: Thử áp dụng công thức vào bài toán này xem sao.' },
        { message: '💡 Gợi ý cấp 4: Bước đầu tiên là... (gần như lời giải)' }
      ];

      const hintMessage = {
        type: 'hint',
        data: hintLevels[hintCount] || hintLevels[3],
        level: hintCount + 1,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, hintMessage]);
      setHintCount(prev => prev + 1);
    }
    setLoading(false);
  };

  const handleShowSolution = async () => {
    if (!window.confirm('Bạn có chắc muốn xem lời giải? Hãy thử suy nghĩ thêm nhé!')) {
      return;
    }

    setLoading(true);
    try {
      // Lấy câu hỏi gần nhất
      const lastUserMessage = [...conversation].reverse().find(msg => msg.type === 'user');
      const question = lastUserMessage ? lastUserMessage.text : 'câu hỏi hiện tại';

      const prompt = `Bạn là giáo viên ${config.subject} lớp ${config.grade}, sách ${config.bookSet} (Chương trình phổ thông 2018).

Câu hỏi: "${question}"

Hãy đưa ra lời giải CHI TIẾT theo format BẮT BUỘC sau:

✅ ĐÁP ÁN:
[Đưa ra đáp án cuối cùng rõ ràng, ngắn gọn]

📖 LỜI GIẢI CHI TIẾT:
Bước 1: [Phân tích đề bài]
Bước 2: [Xác định công thức/phương pháp]
Bước 3: [Giải chi tiết từng bước]
Bước 4: [Kết luận]

💡 LƯU Ý:
- [Những điểm cần chú ý]
- [Sai lầm thường gặp]

📚 KIẾN THỨC LIÊN QUAN TRONG SGK:
BẮT BUỘC phải điền đầy đủ các thông tin sau (dựa vào nội dung SGK ${config.subject} lớp ${config.grade} - ${config.bookSet}):

[CHƯƠNG]: [Viết tên chương cụ thể, VD: Chương 1: Phản ứng oxi hóa - khử]
[BÀI]: [Viết tên bài học cụ thể, VD: Bài 1: Phản ứng oxi hóa - khử]
[TRANG]: [Ước tính khoảng trang, VD: Trang 10-15]
[KIẾN THỨC]: [Liệt kê các kiến thức cần xem lại, VD: Khái niệm số oxi hóa, quy tắc xác định số oxi hóa]

QUAN TRỌNG: 
- PHẢI điền đầy đủ 4 mục [CHƯƠNG], [BÀI], [TRANG], [KIẾN THỨC]
- Tên chương và bài phải chính xác theo SGK ${config.bookSet}
- LaTeX: $công thức$`;

      const aiResponse = await callGeminiAPI(prompt);

      // Parse thông tin từ response - hỗ trợ nhiều format
      const answerMatch = aiResponse.match(/✅\s*ĐÁP ÁN:?\s*\n(.+?)(?=\n\n|📖)/is);
      
      // Helper function để clean text - loại bỏ dấu ** thừa và markdown
      const cleanText = (text) => {
        if (!text) return null;
        return text
          .trim()
          .replace(/^\[|\]$/g, '') // Loại bỏ dấu ngoặc vuông đầu/cuối
          .replace(/^\*\*\s*/g, '') // Loại bỏ ** ở đầu
          .replace(/\s*\*\*$/g, '') // Loại bỏ ** ở cuối
          .trim();
      };
      
      // Parse chương - hỗ trợ nhiều format và loại bỏ dấu ngoặc vuông
      let chapterText = null;
      let chapterMatch = aiResponse.match(/\[CHƯƠNG\]:?\s*\[?(.+?)\]?(?=\n|\[BÀI\]|\[TRANG\]|$)/is);
      if (!chapterMatch) {
        chapterMatch = aiResponse.match(/Chương:?\s*(.+?)(?=\n|Bài|Trang|$)/i);
      }
      if (chapterMatch) {
        chapterText = cleanText(chapterMatch[1]);
      }
      
      // Parse bài học
      let lessonText = null;
      let lessonMatch = aiResponse.match(/\[BÀI\]:?\s*\[?(.+?)\]?(?=\n|\[TRANG\]|\[KIẾN THỨC\]|$)/is);
      if (!lessonMatch) {
        lessonMatch = aiResponse.match(/Bài học:?\s*(.+?)(?=\n|Trang|Kiến thức|$)/i);
      }
      if (lessonMatch) {
        lessonText = cleanText(lessonMatch[1]);
      }
      
      // Parse trang
      let pagesText = null;
      let pagesMatch = aiResponse.match(/\[TRANG\]:?\s*\[?(.+?)\]?(?=\n|\[KIẾN THỨC\]|$)/is);
      if (!pagesMatch) {
        pagesMatch = aiResponse.match(/Trang:?\s*(.+?)(?=\n|Kiến thức|Chủ đề|$)/i);
      }
      if (pagesMatch) {
        pagesText = cleanText(pagesMatch[1]);
      }
      
      // Parse kiến thức
      let knowledgeText = null;
      let knowledgeMatch = aiResponse.match(/\[KIẾN THỨC\]:?\s*\[?(.+?)\]?(?=\n\n|$)/is);
      if (!knowledgeMatch) {
        knowledgeMatch = aiResponse.match(/Chủ đề liên quan:?\s*(.+?)(?=\n\n|$)/is);
      }
      if (knowledgeMatch) {
        knowledgeText = cleanText(knowledgeMatch[1]);
      }

      const solutionMessage = {
        type: 'solution',
        data: {
          answer: answerMatch ? answerMatch[1].trim() : null,
          solution: aiResponse,
          bookReference: {
            book: `Sách giáo khoa ${config.subject} lớp ${config.grade}`,
            bookSet: config.bookSet,
            program: 'Chương trình Giáo dục phổ thông 2018',
            chapter: chapterText || 'Xem trong lời giải chi tiết ở trên',
            lesson: lessonText || 'Xem trong lời giải chi tiết ở trên',
            pages: pagesText || 'Tham khảo mục lục SGK',
            knowledge: knowledgeText || 'Xem nội dung liên quan trong lời giải'
          }
        },
        timestamp: new Date()
      };

      setConversation(prev => [...prev, solutionMessage]);
      setCurrentInput('');
    } catch (error) {
      console.error('Error:', error);
      
      // Fallback
      const mockSolution = {
        solution: `📖 Lời giải chi tiết:\n\nBước 1: Xác định dữ kiện đề bài\nBước 2: Áp dụng công thức phù hợp\nBước 3: Tính toán và kiểm tra\nBước 4: Kết luận\n\n💡 Lưu ý: Đây là lời giải mẫu. Hãy tự làm lại để hiểu sâu hơn!\n\n(Lỗi kết nối API)`,
        bookReference: {
          book: `Sách giáo khoa ${config.subject} ${config.grade} - ${config.bookSet}`,
          program: 'Chương trình Giáo dục phổ thông 2018',
          publisher: 'Nhà xuất bản Giáo dục Việt Nam',
          note: 'Tham khảo thêm sách bài tập và tài liệu bổ trợ'
        }
      };

      const solutionMessage = {
        type: 'solution',
        data: mockSolution,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, solutionMessage]);
      setCurrentInput('');
    }
    setLoading(false);
  };

  const handleNewTopic = () => {
    if (conversation.length > 1) {
      const sessionName = prompt('Đặt tên cho phiên học này:', `Phiên ${sessionHistory.length + 1}`);
      if (sessionName) {
        setSessionHistory(prev => [...prev, {
          name: sessionName,
          conversation,
          config,
          timestamp: new Date()
        }]);
      }
    }
    setConversation([]);
    setHintCount(0);
    setCurrentInput('');
  };

  const handleReset = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ cuộc trò chuyện?')) {
      setConversation([]);
      setHintCount(0);
      setCurrentInput('');
    }
  };

  const loadHistorySession = (session) => {
    setConversation(session.conversation);
    setConfig(session.config);
    setShowHistory(false);
  };

  const handleGenerateSummary = async () => {
    if (conversation.length < 2) {
      alert('Chưa có đủ nội dung để tóm tắt!');
      return;
    }

    setLoadingSummary(true);
    setShowSummary(true);

    try {
      // Tạo prompt để AI tóm tắt và tạo sơ đồ
      const conversationText = conversation
        .filter(msg => msg.type === 'user' || msg.type === 'ai')
        .map(msg => `${msg.type === 'user' ? 'Học sinh' : 'AI'}: ${msg.text || msg.data?.message || ''}`)
        .join('\n');

      const prompt = `Hãy phân tích cuộc trò chuyện học tập sau và tạo tóm tắt với sơ đồ tư duy dạng cây:

Cuộc trò chuyện:
${conversationText}

Môn: ${config.subject} - Lớp ${config.grade}

Trả lời theo format BẮT BUỘC:

📝 TÓM TẮT:
- [Điểm chính 1]
- [Điểm chính 2]
- [Điểm chính 3]

🌳 SƠ ĐỒ TƯ DUY (dạng cây phân cấp):
[ROOT]Chủ đề chính
  [NODE]Khái niệm 1
    [LEAF]Chi tiết 1.1
    [LEAF]Chi tiết 1.2
  [NODE]Khái niệm 2
    [LEAF]Chi tiết 2.1
    [LEAF]Chi tiết 2.2

💡 GỢI Ý HỌC TIẾP:
- [Gợi ý 1]
- [Gợi ý 2]

LƯU Ý: 
- Dùng [ROOT] cho chủ đề chính
- Dùng [NODE] cho các nhánh chính
- Dùng [LEAF] cho các chi tiết cuối
- Giữ nguyên indent (2 spaces cho mỗi cấp)`;

      const response = await callGeminiAPI(prompt);
      setSummary(response);
    } catch (error) {
      console.error('Error generating summary:', error);
      setSummary('❌ Lỗi khi tạo tóm tắt. Vui lòng thử lại!');
    }
    setLoadingSummary(false);
  };

  return (
    <div className="ai-mentor-v4">
      {showConfig ? (
        <ConfigPanel 
          config={config}
          setConfig={setConfig}
          onStart={handleStartSession}
        />
      ) : (
        <>
          <Header 
            config={config}
            hintCount={hintCount}
            maxHints={MAX_HINTS}
            onNewTopic={handleNewTopic}
            onReset={handleReset}
            onShowHistory={() => setShowHistory(!showHistory)}
            onShowConfig={() => setShowConfig(true)}
            onShowSummary={handleGenerateSummary}
          />

          {showSummary && (
            <SummaryPanel 
              summary={summary}
              loading={loadingSummary}
              onClose={() => setShowSummary(false)}
            />
          )}

          {showHistory && (
            <HistoryPanel 
              sessions={sessionHistory}
              onLoadSession={loadHistorySession}
              onClose={() => setShowHistory(false)}
            />
          )}

          <ChatArea 
            conversation={conversation}
            loading={loading}
            chatEndRef={chatEndRef}
          />

          <InputArea 
            currentInput={currentInput}
            setCurrentInput={setCurrentInput}
            onSend={handleSend}
            onRequestHint={handleRequestHint}
            onShowSolution={handleShowSolution}
            loading={loading}
            hintCount={hintCount}
            maxHints={MAX_HINTS}
          />
        </>
      )}
    </div>
  );
}

// Component con sẽ được định nghĩa tiếp...
function ConfigPanel({ config, setConfig, onStart }) {
  const availableDistricts = districts[config.province] || [];
  const availableSchools = schools[config.district] || [];

  return (
    <div className="config-panel">
      <h2>⚙️ Cấu hình học tập</h2>
      <p>Vui lòng điền đầy đủ thông tin để bắt đầu</p>

      <div className="config-grid">
        <div className="config-item">
          <label>Tên học sinh *</label>
          <input
            type="text"
            value={config.studentName}
            onChange={(e) => setConfig({...config, studentName: e.target.value})}
            placeholder="Nhập tên của bạn"
          />
        </div>

        <div className="config-item">
          <label>Tỉnh/Thành phố *</label>
          <select value={config.province} onChange={(e) => setConfig({...config, province: e.target.value, district: '', school: ''})}>
            {provinces.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="config-item">
          <label>Quận/Huyện *</label>
          <select value={config.district} onChange={(e) => setConfig({...config, district: e.target.value, school: ''})}>
            <option value="">-- Chọn quận/huyện --</option>
            {availableDistricts.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>

        <div className="config-item">
          <label>Trường học *</label>
          <select value={config.school} onChange={(e) => setConfig({...config, school: e.target.value})}>
            <option value="">-- Chọn trường --</option>
            {availableSchools.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="config-item">
          <label>Lớp *</label>
          <select value={config.grade} onChange={(e) => setConfig({...config, grade: e.target.value})}>
            {grades.map(g => <option key={g} value={g}>Lớp {g}</option>)}
          </select>
        </div>

        <div className="config-item">
          <label>Môn học *</label>
          <select value={config.subject} onChange={(e) => setConfig({...config, subject: e.target.value})}>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        <div className="config-item">
          <label>Bộ sách *</label>
          <select value={config.bookSet} onChange={(e) => setConfig({...config, bookSet: e.target.value})}>
            {bookSets.map(b => <option key={b} value={b}>{b}</option>)}
          </select>
        </div>

        <div className="config-item">
          <label>Tên giáo viên *</label>
          <input
            type="text"
            value={config.teacherName}
            onChange={(e) => setConfig({...config, teacherName: e.target.value})}
            placeholder="Nhập tên giáo viên (VD: Thầy Nguyễn Văn A)"
          />
        </div>
      </div>

      <button className="btn btn-primary" onClick={onStart}>
        Bắt đầu học 🚀
      </button>
    </div>
  );
}

// Các component khác sẽ được thêm vào file CSS
function Header({ config, hintCount, maxHints, onNewTopic, onReset, onShowHistory, onShowConfig, onShowSummary }) {
  return (
    <div className="mentor-header-v4">
      <div className="header-info">
        <h3>👋 {config.studentName}</h3>
        <p>{config.subject} - Lớp {config.grade} - {config.bookSet}</p>
      </div>
      <div className="header-stats">
        <span className="hint-counter">💡 Gợi ý: {hintCount}/{maxHints}</span>
      </div>
      <div className="header-actions">
        <button onClick={onShowSummary} title="Tóm tắt & Sơ đồ">📊</button>
        <button onClick={onShowHistory} title="Lịch sử">📚</button>
        <button onClick={onNewTopic} title="Chủ đề mới">➕</button>
        <button onClick={onReset} title="Làm mới">🔄</button>
        <button onClick={onShowConfig} title="Cài đặt">⚙️</button>
      </div>
    </div>
  );
}

function ChatArea({ conversation, loading, chatEndRef }) {
  return (
    <div className="chat-area-v4">
      {conversation.map((msg, idx) => (
        <Message key={idx} message={msg} />
      ))}
      {loading && <div className="loading">AI đang suy nghĩ...</div>}
      <div ref={chatEndRef} />
    </div>
  );
}


// Hàm chuyển Markdown sang HTML
function parseMarkdown(text) {
  if (!text) return '';
  
  // Bold: **text** hoặc __text__
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  text = text.replace(/__(.+?)__/g, '<strong>$1</strong>');
  
  // Italic: *text* hoặc _text_ (nhưng không phải **)
  text = text.replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>');
  text = text.replace(/_(.+?)_/g, '<em>$1</em>');
  
  // Line breaks
  text = text.replace(/\n/g, '<br/>');
  
  return text;
}

// Hàm render text với LaTeX
function renderTextWithLatex(text) {
  if (!text) return null;
  
  // Tách text thành các phần: text thường và LaTeX
  const parts = [];
  let lastIndex = 0;
  
  // Regex để tìm LaTeX: $...$ (inline) hoặc $$...$$ (block)
  const latexRegex = /\$\$([^$]+)\$\$|\$([^$]+)\$/g;
  let match;
  
  while ((match = latexRegex.exec(text)) !== null) {
    // Thêm text trước LaTeX
    if (match.index > lastIndex) {
      parts.push({
        type: 'text',
        content: text.substring(lastIndex, match.index)
      });
    }
    
    // Thêm LaTeX
    if (match[1]) {
      // Block math $$...$$
      parts.push({
        type: 'block-math',
        content: match[1]
      });
    } else if (match[2]) {
      // Inline math $...$
      parts.push({
        type: 'inline-math',
        content: match[2]
      });
    }
    
    lastIndex = match.index + match[0].length;
  }
  
  // Thêm phần text còn lại
  if (lastIndex < text.length) {
    parts.push({
      type: 'text',
      content: text.substring(lastIndex)
    });
  }
  
  // Render các phần
  return parts.map((part, idx) => {
    if (part.type === 'text') {
      const htmlContent = parseMarkdown(part.content);
      return <span key={idx} dangerouslySetInnerHTML={{ __html: htmlContent }} />;
    } else if (part.type === 'inline-math') {
      try {
        return <InlineMath key={idx} math={part.content} />;
      } catch (e) {
        return <span key={idx}>${part.content}$</span>;
      }
    } else if (part.type === 'block-math') {
      try {
        return <BlockMath key={idx} math={part.content} />;
      } catch (e) {
        return <div key={idx}>$${part.content}$$</div>;
      }
    }
    return null;
  });
}

function Message({ message }) {
  if (message.type === 'system') {
    return <div className="message system-message">{renderTextWithLatex(message.text)}</div>;
  }
  
  if (message.type === 'user') {
    return (
      <div className="message user-message">
        <strong>Bạn:</strong> {renderTextWithLatex(message.text)}
      </div>
    );
  }
  
  if (message.type === 'ai') {
    return (
      <div className="message ai-message">
        <strong>AI Mentor:</strong>
        <div>{renderTextWithLatex(message.data.message)}</div>
      </div>
    );
  }
  
  if (message.type === 'hint') {
    return (
      <div className="message hint-message">
        <strong>💡 Gợi ý cấp {message.level}:</strong>
        <div>{renderTextWithLatex(message.data.message)}</div>
      </div>
    );
  }
  
  if (message.type === 'solution') {
    const { answer, solution, bookReference } = message.data;
    
    return (
      <div className="message solution-message">
        <strong>📚 Lời giải chi tiết:</strong>
        
        {/* Hiển thị đáp án nổi bật nếu có */}
        {answer && (
          <div className="answer-highlight">
            <h4>✅ ĐÁP ÁN:</h4>
            <div className="answer-content">{renderTextWithLatex(answer)}</div>
          </div>
        )}
        
        {/* Hiển thị lời giải đầy đủ */}
        <div className="solution-content">{renderTextWithLatex(solution)}</div>
        
        {/* Hiển thị thông tin sách giáo khoa - LUÔN HIỂN THỊ ĐẦY ĐỦ */}
        {bookReference && (
          <div className="book-reference">
            <h4>📖 Tham khảo Sách giáo khoa:</h4>
            <div className="book-info">
              <p><strong>📚 Sách:</strong> {bookReference.book} - {bookReference.bookSet}</p>
              <p><strong>📋 Chương trình:</strong> {bookReference.program}</p>
              <p><strong>📂 Chương:</strong> {bookReference.chapter}</p>
              <p><strong>📄 Bài học:</strong> {bookReference.lesson}</p>
              <p><strong>📖 Trang:</strong> {bookReference.pages}</p>
              <p><strong>💡 Chủ đề liên quan:</strong> {bookReference.knowledge}</p>
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return null;
}

function InputArea({ currentInput, setCurrentInput, onSend, onRequestHint, onShowSolution, loading, hintCount, maxHints }) {
  return (
    <div className="input-area-v4">
      <div className="action-buttons">
        <button onClick={onRequestHint} disabled={loading || hintCount >= maxHints}>
          💡 Gợi ý ({hintCount}/{maxHints})
        </button>
        <button onClick={onShowSolution} disabled={loading}>
          📚 Xem lời giải (M10)
        </button>
      </div>
      <div className="input-box">
        <textarea
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
          placeholder="Nhập câu hỏi hoặc câu trả lời... (Nhập M10 để xem lời giải)"
          rows="3"
        />
        <button onClick={onSend} disabled={loading || !currentInput.trim()}>
          Gửi 📤
        </button>
      </div>
    </div>
  );
}

// Component render sơ đồ tư duy dạng mind map
function MindMapTree({ text }) {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Parse cấu trúc
  let rootNode = null;
  const branches = [];
  let currentBranch = null;
  
  lines.forEach((line) => {
    if (line.includes('[ROOT]')) {
      rootNode = line.replace('[ROOT]', '').trim();
    } else if (line.includes('[NODE]')) {
      const content = line.replace('[NODE]', '').trim();
      currentBranch = { title: content, leaves: [] };
      branches.push(currentBranch);
    } else if (line.includes('[LEAF]') && currentBranch) {
      const content = line.replace('[LEAF]', '').trim();
      currentBranch.leaves.push(content);
    }
  });
  
  return (
    <div className="mind-map-container">
      {/* Node trung tâm */}
      {rootNode && (
        <div className="mind-map-center">
          <div className="center-node">
            <span className="node-icon">🎯</span>
            <span className="node-text">{rootNode}</span>
          </div>
        </div>
      )}
      
      {/* Các nhánh xung quanh */}
      <div className="mind-map-branches">
        {branches.map((branch, idx) => (
          <div key={idx} className={`branch-container branch-${idx % 4}`}>
            <div className="branch-line"></div>
            <div className="branch-node">
              <span className="node-icon">📌</span>
              <span className="node-text">{branch.title}</span>
            </div>
            {branch.leaves.length > 0 && (
              <div className="leaf-container">
                {branch.leaves.map((leaf, leafIdx) => (
                  <div key={leafIdx} className="leaf-node">
                    <div className="leaf-line"></div>
                    <span className="leaf-icon">🔹</span>
                    <span className="leaf-text">{leaf}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryPanel({ summary, loading, onClose }) {
  // Parse summary thành các phần
  const parseSummary = (text) => {
    if (!text) return { summary: '', mindMap: '', suggestions: '' };
    
    const summaryMatch = text.match(/📝 TÓM TẮT:(.+?)(?=🌳|💡|$)/s);
    const mindMapMatch = text.match(/🌳 SƠ ĐỒ TƯ DUY[^:]*:(.+?)(?=💡|$)/s);
    const suggestionsMatch = text.match(/💡 GỢI Ý HỌC TIẾP:(.+?)$/s);
    
    return {
      summary: summaryMatch ? summaryMatch[1].trim() : '',
      mindMap: mindMapMatch ? mindMapMatch[1].trim() : '',
      suggestions: suggestionsMatch ? suggestionsMatch[1].trim() : ''
    };
  };
  
  const { summary: summaryText, mindMap, suggestions } = parseSummary(summary);
  
  return (
    <div className="history-panel summary-panel">
      <div className="history-header">
        <h3>📊 Tóm tắt & Sơ đồ tư duy</h3>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="history-list" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="loading">Đang phân tích cuộc trò chuyện...</div>
          </div>
        ) : summary ? (
          <div style={{ padding: '20px' }}>
            {/* Tóm tắt */}
            {summaryText && (
              <div className="summary-section">
                <h4>📝 TÓM TẮT</h4>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                  {renderTextWithLatex(summaryText)}
                </div>
              </div>
            )}
            
            {/* Sơ đồ tư duy */}
            {mindMap && (
              <div className="summary-section">
                <h4>🌳 SƠ ĐỒ TƯ DUY</h4>
                <MindMapTree text={mindMap} />
              </div>
            )}
            
            {/* Gợi ý học tiếp */}
            {suggestions && (
              <div className="summary-section">
                <h4>💡 GỢI Ý HỌC TIẾP</h4>
                <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                  {renderTextWithLatex(suggestions)}
                </div>
              </div>
            )}
            
            {/* Fallback nếu không parse được */}
            {!summaryText && !mindMap && !suggestions && (
              <div style={{ whiteSpace: 'pre-wrap', lineHeight: '1.8' }}>
                {renderTextWithLatex(summary)}
              </div>
            )}
          </div>
        ) : (
          <p style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
            Chưa có tóm tắt
          </p>
        )}
      </div>
    </div>
  );
}

function HistoryPanel({ sessions, onLoadSession, onClose }) {
  return (
    <div className="history-panel">
      <div className="history-header">
        <h3>📚 Lịch sử học tập</h3>
        <button onClick={onClose}>✕</button>
      </div>
      <div className="history-list">
        {sessions.length === 0 ? (
          <p>Chưa có phiên học nào</p>
        ) : (
          sessions.map((session, idx) => (
            <div key={idx} className="history-item" onClick={() => onLoadSession(session)}>
              <h4>{session.name}</h4>
              <p>{session.config.subject} - Lớp {session.config.grade}</p>
              <small>{new Date(session.timestamp).toLocaleString('vi-VN')}</small>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default AIMentorV4;
