import React, { useState } from 'react';
import axios from 'axios';

function AIReflect({ userId }) {
  const [answer, setAnswer] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [step, setStep] = useState('');
  const [feedback, setFeedback] = useState(null);

  const handleAnalyze = async () => {
    try {
      const response = await axios.post('/api/reflect/analyze', {
        answer,
        correctAnswer,
        step: parseInt(step)
      });
      setFeedback(response.data);
    } catch (error) {
      console.error('Error analyzing answer:', error);
    }
  };

  return (
    <div className="card">
      <h2>🔍 AI Reflect - Phản Hồi Thông Minh</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        AI phân tích lỗi tư duy và đưa ra hướng điều chỉnh
      </p>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Nhập bài làm của bạn:</h3>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="VD: Na + Cl2 → NaCl (em nghĩ phản ứng này tạo ra muối)"
          rows="4"
        />

        <h3>Đáp án đúng:</h3>
        <textarea
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          placeholder="VD: 2Na + Cl2 → 2NaCl"
          rows="2"
        />

        <h3>Bước đang làm:</h3>
        <input
          type="number"
          value={step}
          onChange={(e) => setStep(e.target.value)}
          placeholder="VD: 2 (bước cân bằng phương trình)"
          min="1"
        />

        <button 
          className="btn" 
          onClick={handleAnalyze}
          disabled={!answer || !correctAnswer || !step}
        >
          Phân tích bài làm
        </button>
      </div>

      {feedback && (
        <div className={`alert ${feedback.correct ? 'alert-success' : 'alert-warning'}`}>
          <h3>{feedback.correct ? '✅ Chính xác!' : '⚠️ Cần điều chỉnh'}</h3>
          <p style={{ fontSize: '1.1rem', marginTop: '1rem' }}>
            <strong>{feedback.message}</strong>
          </p>

          {!feedback.correct && (
            <>
              {feedback.hint && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: '8px'
                }}>
                  <strong>💡 Gợi ý:</strong>
                  <p>{feedback.hint}</p>
                </div>
              )}

              {feedback.suggestion && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem',
                  background: 'rgba(255,255,255,0.5)',
                  borderRadius: '8px'
                }}>
                  <strong>📚 Nên xem lại:</strong>
                  <p>{feedback.suggestion}</p>
                </div>
              )}

              {feedback.encouragement && (
                <p style={{ 
                  marginTop: '1rem',
                  color: '#28a745',
                  fontWeight: 'bold'
                }}>
                  ✨ {feedback.encouragement}
                </p>
              )}
            </>
          )}

          {feedback.correct && feedback.explanation && (
            <p style={{ marginTop: '1rem' }}>
              {feedback.explanation}
            </p>
          )}
        </div>
      )}

      <div className="alert alert-warning" style={{ marginTop: '2rem' }}>
        <strong>🎯 Lợi ích của AI Reflect:</strong>
        <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
          <li>Phát hiện lỗi tư duy, không chỉ lỗi kết quả</li>
          <li>Đưa ra hướng điều chỉnh cụ thể</li>
          <li>Rèn khả năng tự học - tự sửa sai</li>
          <li>Tăng độ chính xác nhận thức</li>
        </ul>
      </div>

      <div className="card" style={{ marginTop: '2rem', background: '#f5f5f5' }}>
        <h3>📝 Ví dụ minh họa:</h3>
        <div style={{ 
          padding: '1rem',
          background: 'white',
          borderRadius: '8px',
          marginTop: '1rem'
        }}>
          <p><strong>Học sinh:</strong> "2Na + Cl → 2NaCl"</p>
          <p style={{ marginTop: '0.5rem' }}>
            <strong>AI Reflect:</strong> "Bạn đang nhầm ở bước 2. Cl tồn tại dưới dạng phân tử Cl₂, không phải nguyên tử Cl. Thử áp dụng định luật bảo toàn điện tích xem kết quả có khác không?"
          </p>
        </div>
      </div>
    </div>
  );
}

export default AIReflect;
