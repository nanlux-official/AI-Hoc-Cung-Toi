import React, { useState, useEffect } from 'react';

function HealthTracker({ userId }) {
  const [sessionStart] = useState(Date.now());
  const [studyTime, setStudyTime] = useState(0);
  const [recommendation, setRecommendation] = useState(null);
  const [breaksTaken, setBreaksTaken] = useState(0);

  // Load data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem(`healthTracker_${userId}`);
    if (savedData) {
      const data = JSON.parse(savedData);
      setStudyTime(data.studyTime || 0);
      setBreaksTaken(data.breaksTaken || 0);
    }
  }, [userId]);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(`healthTracker_${userId}`, JSON.stringify({
      studyTime,
      breaksTaken,
      lastUpdate: Date.now()
    }));
  }, [studyTime, breaksTaken, userId]);

  // Timer and health check
  useEffect(() => {
    const interval = setInterval(() => {
      setStudyTime(prev => prev + 1);
      checkHealth();
    }, 60000); // Mỗi phút

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyTime]);

  const checkHealth = () => {
    const minutesSinceBreak = studyTime - (breaksTaken * 25);
    
    if (minutesSinceBreak >= 50) {
      setRecommendation({
        alert: true,
        type: 'stop',
        icon: '🛑',
        message: 'Dừng lại ngay!',
        suggestion: 'Bạn đã học quá lâu. Hãy nghỉ ngơi 10-15 phút để não bộ hồi phục.',
        timeLeft: 0
      });
    } else if (minutesSinceBreak >= 25) {
      setRecommendation({
        alert: true,
        type: 'warning',
        icon: '⚠️',
        message: 'Đến giờ nghỉ rồi!',
        suggestion: 'Hãy nghỉ ngơi 5 phút. Đứng dậy, vận động nhẹ, uống nước.',
        timeLeft: 0
      });
    } else {
      setRecommendation({
        alert: false,
        icon: '✅',
        message: 'Bạn đang học tốt!',
        timeLeft: 25 - minutesSinceBreak
      });
    }
  };

  const takeBreak = () => {
    setBreaksTaken(prev => prev + 1);
    setRecommendation({
      alert: false,
      icon: '☕',
      message: 'Đang nghỉ ngơi...',
      timeLeft: 25
    });
    alert('Nghỉ ngơi 5 phút! Hãy đứng dậy vận động nhẹ nhàng.');
  };

  const resetSession = () => {
    if (window.confirm('Bạn có chắc muốn reset phiên học?')) {
      setStudyTime(0);
      setBreaksTaken(0);
      setRecommendation(null);
      localStorage.removeItem(`healthTracker_${userId}`);
    }
  };

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  // Optimal schedule based on Pomodoro
  const optimalSchedule = [
    { time: '06:00 - 06:25', subject: 'Học buổi sáng', type: 'study' },
    { time: '06:25 - 06:30', subject: 'Nghỉ ngắn', type: 'break' },
    { time: '06:30 - 06:55', subject: 'Tiếp tục học', type: 'study' },
    { time: '06:55 - 07:10', subject: 'Nghỉ dài', type: 'break' },
    { time: '19:00 - 19:25', subject: 'Học buổi tối', type: 'study' },
    { time: '19:25 - 19:30', subject: 'Nghỉ ngắn', type: 'break' },
    { time: '19:30 - 19:55', subject: 'Tiếp tục học', type: 'study' }
  ];

  const tips = [
    'Học 25 phút, nghỉ 5 phút (Pomodoro)',
    'Uống đủ nước trong ngày (2 lít)',
    'Ngủ đủ 7-8 tiếng mỗi đêm',
    'Tập thể dục 30 phút mỗi ngày',
    'Ăn uống đầy đủ dinh dưỡng'
  ];

  return (
    <div>
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2>💪 Health & Focus Tracker</h2>
            <p style={{ color: '#666' }}>
              Đảm bảo học tập bền vững, không quá tải
            </p>
          </div>
          <button 
            onClick={resetSession}
            style={{
              padding: '0.5rem 1rem',
              background: '#f0f0f0',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            🔄 Reset
          </button>
        </div>

        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '2rem',
          borderRadius: '15px',
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <h3 style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
            {formatTime(studyTime)}
          </h3>
          <p>Thời gian học hôm nay</p>
          <p style={{ fontSize: '0.9rem', opacity: 0.9, marginTop: '0.5rem' }}>
            Đã nghỉ: {breaksTaken} lần
          </p>
        </div>

        {recommendation && recommendation.alert && (
          <div className={`alert ${
            recommendation.type === 'stop' ? 'alert-error' : 'alert-warning'
          }`}>
            <h3>{recommendation.icon} {recommendation.message}</h3>
            <p style={{ marginTop: '0.5rem' }}>{recommendation.suggestion}</p>
            <button 
              className="btn" 
              onClick={takeBreak}
              style={{ marginTop: '1rem' }}
            >
              Nghỉ ngơi ngay
            </button>
          </div>
        )}

        {recommendation && !recommendation.alert && (
          <div className="alert alert-success">
            <p>{recommendation.icon} {recommendation.message}</p>
            <p style={{ marginTop: '0.5rem' }}>
              Còn {Math.round(recommendation.timeLeft)} phút nữa đến giờ nghỉ
            </p>
          </div>
        )}
      </div>

      <div className="card">
        <h3>📅 Lịch Học Tối Ưu (Pomodoro)</h3>
        <p style={{ color: '#666', marginBottom: '1rem' }}>
          Học 25 phút, nghỉ 5 phút. Sau 4 chu kỳ, nghỉ dài 15-30 phút.
        </p>

        <div style={{ 
          background: '#f5f5f5', 
          padding: '1.5rem', 
          borderRadius: '10px',
          marginBottom: '1rem'
        }}>
          {optimalSchedule.map((session, idx) => (
            <div key={idx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '0.8rem',
              background: session.type === 'break' ? '#fff3cd' : 'white',
              borderRadius: '8px',
              marginBottom: '0.5rem'
            }}>
              <span style={{ fontWeight: 'bold' }}>{session.time}</span>
              <span>{session.subject}</span>
              <span>{session.type === 'break' ? '☕' : '📚'}</span>
            </div>
          ))}
        </div>

        <div className="alert alert-warning">
          <h4>💡 Mẹo học tập hiệu quả:</h4>
          <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
            {tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card">
        <h3>🧘 Bài Tập Thư Giãn</h3>
        <div className="grid">
          <div style={{ 
            padding: '1.5rem', 
            background: '#f5f5f5', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h4>🌬️ Hít thở sâu</h4>
            <p>Hít vào 4 giây, giữ 4 giây, thở ra 4 giây</p>
          </div>
          <div style={{ 
            padding: '1.5rem', 
            background: '#f5f5f5', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h4>👀 Nghỉ mắt</h4>
            <p>Nhìn xa 20m trong 20 giây mỗi 20 phút</p>
          </div>
          <div style={{ 
            padding: '1.5rem', 
            background: '#f5f5f5', 
            borderRadius: '10px',
            textAlign: 'center'
          }}>
            <h4>🤸 Vận động</h4>
            <p>Đứng dậy, duỗi người, xoay cổ nhẹ nhàng</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthTracker;
