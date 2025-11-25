import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AIMentorV4.css';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';
import { provinces, districts, schools, subjects, grades, bookSets, teachersBySubject } from '../data/schoolData';

function AIMentorV4({ userId }) {
  // Cấu hình học sinh
  const [config, setConfig] = useState({
    studentName: '',
    province: 'Quảng Ngãi',
    district: '',
    school: '',
    grade: '11',
    subject: 'Hóa học',
    bookSet: 'Kết nối tri thức',
    teacher: null
  });
  
  const [showConfig, setShowConfig] = useState(true);
  const [conversation, setConversation] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  
  const chatEndRef = useRef(null);
  const MAX_HINTS = 4;

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleStartSession = () => {
    if (!config.studentName || !config.school || !config.teacher) {
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
    if (!config.teacher) return '';
    const pronoun = config.teacher.gender === 'Nam' ? 'Thầy' : 'Cô';
    return `${pronoun} ${config.teacher.name} đã giao cho mình hỗ trợ em.`;
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
    setCurrentInput('');

    try {
      const response = await axios.post('/api/mentor/socratic-v4', {
        userId,
        message: currentInput,
        config,
        conversationHistory: conversation,
        hintCount
      });

      const aiMessage = {
        type: 'ai',
        data: response.data,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error:', error);
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
      const response = await axios.post('/api/mentor/hint-v4', {
        userId,
        config,
        conversationHistory: conversation,
        hintLevel: hintCount + 1
      });

      const hintMessage = {
        type: 'hint',
        data: response.data,
        level: hintCount + 1,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, hintMessage]);
      setHintCount(prev => prev + 1);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const handleShowSolution = async () => {
    if (!window.confirm('Bạn có chắc muốn xem lời giải? Hãy thử suy nghĩ thêm nhé!')) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/mentor/solution-v4', {
        userId,
        config,
        conversationHistory: conversation
      });

      const solutionMessage = {
        type: 'solution',
        data: response.data,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, solutionMessage]);
      setCurrentInput('');
    } catch (error) {
      console.error('Error:', error);
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
          />

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
  const availableTeachers = teachersBySubject[config.subject] || [];

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
          <select value={config.subject} onChange={(e) => setConfig({...config, subject: e.target.value, teacher: null})}>
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
          <label>Giáo viên *</label>
          <select value={config.teacher ? config.teacher.name : ''} onChange={(e) => {
            const teacher = availableTeachers.find(t => t.name === e.target.value);
            setConfig({...config, teacher});
          }}>
            <option value="">-- Chọn giáo viên --</option>
            {availableTeachers.map(t => (
              <option key={t.name} value={t.name}>
                {t.gender === 'Nam' ? 'Thầy' : 'Cô'} {t.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button className="btn btn-primary" onClick={onStart}>
        Bắt đầu học 🚀
      </button>
    </div>
  );
}

// Các component khác sẽ được thêm vào file CSS
function Header({ config, hintCount, maxHints, onNewTopic, onReset, onShowHistory, onShowConfig }) {
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
      return <span key={idx} dangerouslySetInnerHTML={{ __html: part.content.replace(/\n/g, '<br/>') }} />;
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
    return (
      <div className="message solution-message">
        <strong>📚 Lời giải chi tiết:</strong>
        <div>{renderTextWithLatex(message.data.solution)}</div>
        {message.data.bookReference && (
          <div className="book-reference">
            <h4>📖 Tham khảo sách giáo khoa:</h4>
            <p><strong>Bài:</strong> {message.data.bookReference.lesson}</p>
            <p><strong>Chương:</strong> {message.data.bookReference.chapter}</p>
            <p><strong>Trang:</strong> {message.data.bookReference.pages}</p>
            <p><strong>Sách:</strong> {message.data.bookReference.book}</p>
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
