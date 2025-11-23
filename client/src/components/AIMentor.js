import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './AIMentor.css';

function AIMentor({ userId }) {
  const [conversation, setConversation] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [hintLevel, setHintLevel] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  
  // Settings
  const [settings, setSettings] = useState({
    grade: '11',
    subject: 'Hóa học',
    bookSet: 'Kết nối tri thức',
    province: 'Quảng Ngãi',
    district: '',
    school: ''
  });

  const chatEndRef = useRef(null);

  const subjects = ['Toán', 'Hóa học', 'Sinh học', 'Vật lý', 'Văn học', 'Tiếng Anh'];
  const grades = ['6', '7', '8', '9', '10', '11', '12'];
  const bookSets = ['Kết nối tri thức', 'Chân trời sáng tạo', 'Cánh diều'];
  
  const districts = {
    'Quảng Ngãi': ['Thành phố Quảng Ngãi', 'Bình Sơn', 'Tư Nghĩa', 'Sơn Tịnh', 'Trà Bồng', 
                    'Sơn Hà', 'Sơn Tây', 'Minh Long', 'Nghĩa Hành', 'Mộ Đức', 'Đức Phổ', 
                    'Ba Tơ', 'Lý Sơn']
  };

  const schools = {
    'Thành phố Quảng Ngãi': ['THPT Chuyên Lê Khiết', 'THPT Trần Phú', 'THPT Phạm Văn Đồng'],
    'Bình Sơn': ['THPT Bình Sơn', 'THPT Bình Châu'],
    'Tư Nghĩa': ['THPT Tư Nghĩa', 'THPT Nghĩa Phương'],
    'Sơn Tịnh': ['THPT Sơn Tịnh', 'THPT Tịnh Ấn Đông'],
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  const handleNewTopic = () => {
    if (window.confirm('Bạn có chắc muốn bắt đầu chủ đề mới? Lịch sử sẽ bị xóa.')) {
      setConversation([]);
      setCurrentInput('');
      setHintLevel(0);
    }
  };

  const handleSend = async () => {
    if (!currentInput.trim()) return;

    const userMessage = {
      type: 'user',
      text: currentInput,
      timestamp: new Date()
    };

    setConversation(prev => [...prev, userMessage]);
    setLoading(true);
    setCurrentInput('');

    try {
      const response = await axios.post('/api/mentor/socratic', {
        userId,
        message: currentInput,
        conversationHistory: conversation,
        hintLevel,
        settings
      });

      const aiMessage = {
        type: 'ai',
        data: response.data,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, aiMessage]);
      setHintLevel(response.data.hintLevel || 0);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = {
        type: 'error',
        text: 'Đã xảy ra lỗi. Vui lòng thử lại.',
        timestamp: new Date()
      };
      setConversation(prev => [...prev, errorMessage]);
    }
    setLoading(false);
  };

  const requestHint = async () => {
    if (conversation.length === 0) return;
    
    setLoading(true);
    try {
      const response = await axios.post('/api/mentor/hint', {
        userId,
        conversationHistory: conversation,
        currentHintLevel: hintLevel,
        settings
      });

      const hintMessage = {
        type: 'hint',
        data: response.data,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, hintMessage]);
      setHintLevel(response.data.hintLevel || hintLevel + 1);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const requestSolution = async () => {
    if (conversation.length === 0) return;
    
    if (!window.confirm('Bạn có chắc muốn xem lời giải? Hãy thử suy nghĩ thêm trước nhé!')) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/mentor/solution', {
        userId,
        conversationHistory: conversation,
        settings
      });

      const solutionMessage = {
        type: 'solution',
        data: response.data,
        timestamp: new Date()
      };

      setConversation(prev => [...prev, solutionMessage]);
    } catch (error) {
      console.error('Error:', error);
    }
    setLoading(false);
  };

  const renderMessage = (msg, idx) => {
    if (msg.type === 'user') {
      return (
        <div key={idx} className="message user-message">
          <div className="message-header">
            <span className="message-icon">👤</span>
            <span className="message-label">Bạn</span>
          </div>
          <div className="message-content">{msg.text}</div>
        </div>
      );
    }

    if (msg.type === 'ai') {
      return (
        <div key={idx} className="message ai-message">
          <div className="message-header">
            <span className="message-icon">🤖</span>
            <span className="message-label">AI Mentor</span>
          </div>
          <div className="message-content" dangerouslySetInnerHTML={{ __html: formatAIMessage(msg.data.message) }} />
          {msg.data.hint && (
            <div className="hint-box">
              💡 <strong>Gợi ý:</strong> {msg.data.hint}
            </div>
          )}
          {msg.data.encouragement && (
            <div className="encouragement-box">
              ✨ {msg.data.encouragement}
            </div>
          )}
        </div>
      );
    }

    if (msg.type === 'hint') {
      return (
        <div key={idx} className="message hint-message">
          <div className="message-header">
            <span className="message-icon">💡</span>
            <span className="message-label">Gợi ý cấp {msg.data.level}</span>
          </div>
          <div className="message-content" dangerouslySetInnerHTML={{ __html: formatAIMessage(msg.data.message) }} />
        </div>
      );
    }

    if (msg.type === 'solution') {
      return (
        <div key={idx} className="message solution-message">
          <div className="message-header">
            <span className="message-icon">📚</span>
            <span className="message-label">Lời giải chi tiết</span>
          </div>
          <div className="message-content" dangerouslySetInnerHTML={{ __html: formatAIMessage(msg.data.solution) }} />
          {msg.data.bookReferences && msg.data.bookReferences.length > 0 && (
            <div className="book-references">
              <h4>📖 Tham khảo sách giáo khoa:</h4>
              {msg.data.bookReferences.map((ref, i) => (
                <div key={i} className="book-ref-item">
                  <strong>{ref.topic}</strong>
                  <br />
                  📕 {ref.book} - Trang {ref.page} - Bài {ref.lesson}
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  const formatAIMessage = (text) => {
    if (!text) return '';
    
    // Format bold text
    text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Format bullet points
    text = text.replace(/^[•📍🔹]/gm, '<br/>$&');
    
    // Format line breaks
    text = text.replace(/\n/g, '<br/>');
    
    return text;
  };

  return (
    <div className="ai-mentor-container">
      {/* Header with Settings */}
      <div className="mentor-header">
        <div className="header-left">
          <h2>🧠 AI Mentor - Phương pháp Socratic</h2>
          <p>AI dẫn dắt bạn tự khám phá kiến thức</p>
        </div>
        <div className="header-actions">
          <button className="btn-icon" onClick={() => setShowSettings(!showSettings)} title="Cài đặt">
            ⚙️
          </button>
          <button className="btn-icon" onClick={handleNewTopic} title="Chủ đề mới">
            🔄
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="settings-panel">
          <h3>⚙️ Cài đặt học tập</h3>
          <div className="settings-grid">
            <div className="setting-item">
              <label>Lớp:</label>
              <select value={settings.grade} onChange={(e) => setSettings({...settings, grade: e.target.value})}>
                {grades.map(g => <option key={g} value={g}>Lớp {g}</option>)}
              </select>
            </div>
            <div className="setting-item">
              <label>Môn học:</label>
              <select value={settings.subject} onChange={(e) => setSettings({...settings, subject: e.target.value})}>
                {subjects.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="setting-item">
              <label>Bộ sách:</label>
              <select value={settings.bookSet} onChange={(e) => setSettings({...settings, bookSet: e.target.value})}>
                {bookSets.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div className="setting-item">
              <label>Tỉnh/Thành:</label>
              <select value={settings.province} onChange={(e) => setSettings({...settings, province: e.target.value, district: '', school: ''})}>
                <option value="Quảng Ngãi">Quảng Ngãi</option>
              </select>
            </div>
            <div className="setting-item">
              <label>Quận/Huyện:</label>
              <select value={settings.district} onChange={(e) => setSettings({...settings, district: e.target.value, school: ''})}>
                <option value="">-- Chọn quận/huyện --</option>
                {districts[settings.province]?.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="setting-item">
              <label>Trường:</label>
              <select value={settings.school} onChange={(e) => setSettings({...settings, school: e.target.value})}>
                <option value="">-- Chọn trường --</option>
                {settings.district && schools[settings.district]?.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Current Settings Display */}
      <div className="current-settings">
        <span>📚 Lớp {settings.grade}</span>
        <span>📖 {settings.subject}</span>
        <span>📕 {settings.bookSet}</span>
        {settings.school && <span>🏫 {settings.school}</span>}
      </div>

      {/* Chat Area */}
      <div className="chat-area">
        {conversation.length === 0 ? (
          <div className="welcome-message">
            <h3>👋 Chào mừng đến với AI Mentor!</h3>
            <p>Hãy đặt câu hỏi, AI sẽ dẫn dắt bạn tự tìm ra câu trả lời thông qua phương pháp Socratic.</p>
            <div className="example-questions">
              <p><strong>Ví dụ câu hỏi:</strong></p>
              <button onClick={() => setCurrentInput('Vì sao lá cây có màu xanh?')}>Vì sao lá cây có màu xanh?</button>
              <button onClick={() => setCurrentInput('Giải phương trình x² - 5x + 6 = 0')}>Giải phương trình x² - 5x + 6 = 0</button>
              <button onClick={() => setCurrentInput('Phân tích tác phẩm Vợ Nhặt')}>Phân tích tác phẩm Vợ Nhặt</button>
            </div>
          </div>
        ) : (
          <>
            {conversation.map((msg, idx) => renderMessage(msg, idx))}
            {loading && (
              <div className="message ai-message loading">
                <div className="message-header">
                  <span className="message-icon">🤖</span>
                  <span className="message-label">AI Mentor đang suy nghĩ...</span>
                </div>
                <div className="typing-indicator">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Input Area */}
      <div className="input-area">
        <div className="action-buttons">
          <button 
            className="btn-secondary" 
            onClick={requestHint}
            disabled={loading || conversation.length === 0 || hintLevel >= 4}
            title={`Gợi ý cấp ${hintLevel + 1}/4`}
          >
            💡 Gợi ý ({hintLevel}/4)
          </button>
          <button 
            className="btn-secondary" 
            onClick={requestSolution}
            disabled={loading || conversation.length === 0}
            title="Xem lời giải đầy đủ"
          >
            📚 Xem lời giải
          </button>
        </div>
        <div className="input-box">
          <textarea
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder="Nhập câu hỏi hoặc câu trả lời của bạn..."
            rows="3"
          />
          <button 
            className="btn-send" 
            onClick={handleSend}
            disabled={loading || !currentInput.trim()}
          >
            {loading ? '⏳' : '📤'} Gửi
          </button>
        </div>
        <div className="input-hint">
          💡 <strong>Mẹo:</strong> AI sẽ không cho đáp án ngay. Hãy thử trả lời để AI dẫn dắt bạn!
        </div>
      </div>
    </div>
  );
}

export default AIMentor;
