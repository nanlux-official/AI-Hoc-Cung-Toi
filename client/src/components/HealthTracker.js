import React, { useState, useEffect } from 'react';
import axios from 'axios';

function HealthTracker({ userId }) {
  const [sessionStart] = useState(Date.now());
  const [studyTime, setStudyTime] = useState(0);
  const [recommendation, setRecommendation] = useState(null);
  const [schedule, setSchedule] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setStudyTime(prev => prev + 1);
      checkHealth();
    }, 60000); // Mỗi phút

    fetchSchedule();

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkHealth = async () => {
    try {
      const response = await axios.post('/api/health/track', {
        userId,
        sessionStart,
        currentTime: Date.now()
      });
      setRecommendation(response.data);
    } catch (error) {
      console.error('Error checking health:', error);
    }
  };

  const fetchSchedule = async () => {
    try {
      const response = await axios.get(`/api/health/schedule/${userId}`);
      setSchedule(response.data);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    }
  };

  const takeBreak = async () => {
    try {
      await axios.post('/api/health/break', {
        userId,
        breakDuration: 5
      });
      alert('Nghỉ ngơi 5 phút! Hãy đứng dậy vận động nhẹ nhàng.');
    } catch (error) {
      console.error('Error logging break:', error);
    }
  };

  const formatTime = (minutes) => {
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  return (
    <div>
      <div className="card">
        <h2>💪 Health & Focus Tracker</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Đảm bảo học tập bền vững, không quá tải
        </p>

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

      {schedule && (
        <div className="card">
          <h3>📅 Lịch Học Tối Ưu</h3>
          <p style={{ color: '#666', marginBottom: '1rem' }}>
            {schedule.recommendation}
          </p>

          <div style={{ 
            background: '#f5f5f5', 
            padding: '1.5rem', 
            borderRadius: '10px',
            marginBottom: '1rem'
          }}>
            {schedule.sessions.map((session, idx) => (
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
              {schedule.tips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
