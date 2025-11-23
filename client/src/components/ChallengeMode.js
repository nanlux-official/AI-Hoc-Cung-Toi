import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChallengeMode({ userId }) {
  const [challenge, setChallenge] = useState(null);
  const [answer, setAnswer] = useState('');
  const [result, setResult] = useState(null);
  const [stats, setStats] = useState({
    level: 1,
    totalAnswers: 0,
    correctAnswers: 0,
    correctRate: 0
  });
  const [showLevelUp, setShowLevelUp] = useState(false);

  useEffect(() => {
    fetchChallenge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchChallenge = async () => {
    try {
      const response = await axios.get(`/api/challenge/next/${userId}`);
      setChallenge(response.data);
      setAnswer('');
      setResult(null);
    } catch (error) {
      console.error('Error fetching challenge:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      const oldLevel = stats.level;
      
      const response = await axios.post('/api/challenge/submit', {
        userId,
        answer,
        questionId: challenge.question
      });
      
      setResult(response.data);
      
      // Cập nhật stats
      setStats({
        level: response.data.newLevel,
        totalAnswers: response.data.totalAnswers,
        correctAnswers: response.data.correctAnswers,
        correctRate: response.data.correctRate
      });
      
      // Kiểm tra nâng level
      if (response.data.newLevel > oldLevel) {
        setShowLevelUp(true);
        setTimeout(() => setShowLevelUp(false), 3000);
      }
      
      setTimeout(() => {
        fetchChallenge();
      }, 3000);
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const getLevelBadge = (level) => {
    if (level === 1) return '🥉 Cơ bản';
    if (level === 2) return '🥈 Trung cấp';
    return '🥇 Nâng cao';
  };

  return (
    <>
      <style>{`
        @keyframes levelUpPop {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.1);
          }
          100% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
      `}</style>
      <div className="card">
      <h2>🏆 Challenge Mode - Thử Thách Phản Biện</h2>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Hệ thống tự động điều chỉnh độ khó dựa trên kết quả của bạn
      </p>

      {/* Stats Dashboard */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.level}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Level hiện tại</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.correctAnswers}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Câu đúng</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.totalAnswers}</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Tổng câu</div>
        </div>
        <div style={{
          background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
          color: 'white',
          padding: '1rem',
          borderRadius: '10px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{stats.correctRate}%</div>
          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Tỷ lệ đúng</div>
        </div>
      </div>

      {/* Level Up Animation */}
      {showLevelUp && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '3rem',
          borderRadius: '20px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          zIndex: 1000,
          textAlign: 'center',
          animation: 'levelUpPop 0.5s ease-out'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
          <h2 style={{ margin: '0 0 1rem 0', fontSize: '2rem' }}>LEVEL UP!</h2>
          <p style={{ fontSize: '1.5rem', margin: 0 }}>
            Bạn đã lên {getLevelBadge(stats.level)}
          </p>
        </div>
      )}

      {challenge && (
        <>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '1.5rem',
            borderRadius: '10px',
            marginBottom: '2rem'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3>Câu hỏi Level: {getLevelBadge(challenge.level || 1)}</h3>
              <span style={{ fontSize: '1.2rem' }}>
                {challenge.type === 'basic' ? '⭐' : challenge.type === 'intermediate' ? '⭐⭐' : '⭐⭐⭐'}
              </span>
            </div>
          </div>

          <div className="alert alert-warning">
            <h3 style={{ marginBottom: '1rem' }}>❓ Câu hỏi:</h3>
            <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
              {challenge.question}
            </p>
            {challenge.hint && (
              <p style={{ fontStyle: 'italic', color: '#856404' }}>
                💡 Gợi ý: {challenge.hint}
              </p>
            )}
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Nhập câu trả lời của bạn... (Tối thiểu 10 ký tự)"
            rows="5"
            style={{ marginBottom: '1rem' }}
          />
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
            📝 Độ dài: {answer.length} ký tự {answer.length < 10 && <span style={{ color: '#dc3545' }}>(⚠️ Cần ít nhất 10 ký tự)</span>}
          </div>

          <button 
            className="btn" 
            onClick={handleSubmit}
            disabled={!answer.trim() || result !== null}
          >
            Gửi câu trả lời
          </button>
        </>
      )}

      {result && (
        <div className={`alert ${result.correct ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '1rem' }}>
          <h3>{result.correct ? '✅ Chính xác!' : '❌ Chưa đúng'}</h3>
          <p style={{ fontSize: '1.05rem', marginTop: '0.5rem' }}>{result.message}</p>
          
          {result.correct && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(40, 167, 69, 0.1)', borderRadius: '8px' }}>
              <p style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>
                <strong>+1 điểm</strong> 🎯
              </p>
              <p style={{ margin: '0.5rem 0' }}>
                Tiến độ lên level: {result.totalAnswers}/5 câu
              </p>
              {result.correctAnswers >= 3 && result.totalAnswers >= 5 && (
                <p style={{ color: '#28a745', fontWeight: 'bold', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                  🎉 Bạn đã đủ điểm lên level! Câu tiếp theo sẽ nâng cấp!
                </p>
              )}
              {result.correctAnswers === 2 && result.totalAnswers >= 4 && (
                <p style={{ color: '#ffc107', fontWeight: 'bold', marginTop: '0.5rem', fontSize: '1.1rem' }}>
                  🔥 Còn 1 câu nữa là lên level! Cố gắng nhé!
                </p>
              )}
            </div>
          )}
          
          {!result.correct && (
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(220, 53, 69, 0.1)', borderRadius: '8px' }}>
              <p style={{ margin: '0.5rem 0' }}>
                💪 Đừng nản! Hãy thử lại câu tiếp theo.
              </p>
              <p style={{ margin: '0.5rem 0', fontSize: '0.9rem', color: '#666' }}>
                Mẹo: Câu trả lời cần ít nhất 10 ký tự và có ý nghĩa
              </p>
            </div>
          )}
        </div>
      )}

      <div className="alert alert-warning" style={{ marginTop: '2rem' }}>
        <strong>📊 Cách hoạt động:</strong>
        <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
          <li>✅ Đúng 3/5 câu → Lên level tiếp theo</li>
          <li>❌ Sai quá nhiều (&lt;40%) → Giảm level</li>
          <li>🎯 Mỗi level có câu hỏi khác độ khó</li>
          <li>🏆 Level tối đa: 3 (Nâng cao)</li>
        </ul>
      </div>
    </div>
    </>
  );
}

export default ChallengeMode;
