import React, { useState, useEffect } from 'react';
import axios from 'axios';

function LearningTracker({ userId }) {
  const [report, setReport] = useState(null);
  const [newActivity, setNewActivity] = useState({
    activity: '',
    duration: '',
    accuracy: '',
    subject: 'Hóa học'
  });

  useEffect(() => {
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchReport = async () => {
    try {
      const response = await axios.get(`/api/tracker/report/${userId}`);
      setReport(response.data);
    } catch (error) {
      console.error('Error fetching report:', error);
    }
  };

  const handleLog = async () => {
    try {
      await axios.post('/api/tracker/log', {
        userId,
        ...newActivity,
        duration: parseInt(newActivity.duration),
        accuracy: parseInt(newActivity.accuracy)
      });
      
      setNewActivity({
        activity: '',
        duration: '',
        accuracy: '',
        subject: 'Hóa học'
      });
      
      fetchReport();
    } catch (error) {
      console.error('Error logging activity:', error);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>📈 Learning Tracker - Nhật Ký Học Tập</h2>
        <p style={{ color: '#666', marginBottom: '2rem' }}>
          Theo dõi tiến trình học và nhận báo cáo chi tiết
        </p>

        <div className="grid">
          <div className="stat-card">
            <h3>{report?.totalTime || 0}</h3>
            <p>Phút học tuần này</p>
          </div>
          <div className="stat-card">
            <h3>{report?.sessionsCount || 0}</h3>
            <p>Buổi học</p>
          </div>
          <div className="stat-card">
            <h3>{report?.improvements?.length || 0}</h3>
            <p>Môn tiến bộ</p>
          </div>
        </div>
      </div>

      {report && (
        <div className="card">
          <h3>📊 Báo Cáo Tuần</h3>
          <div className="alert alert-success">
            <strong>{report.message}</strong>
          </div>
          
          {report.improvements.length > 0 && (
            <div style={{ marginTop: '1rem' }}>
              <h4>✨ Môn học tiến bộ:</h4>
              <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                {report.improvements.map((subject, idx) => (
                  <li key={idx}>{subject}</li>
                ))}
              </ul>
            </div>
          )}
          
          {report.weaknesses.length > 0 && (
            <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
              <h4>💪 Cần củng cố:</h4>
              <ul style={{ marginLeft: '1.5rem', marginTop: '0.5rem' }}>
                {report.weaknesses.map((subject, idx) => (
                  <li key={idx}>{subject}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="card">
        <h3>➕ Ghi Nhận Hoạt Động Học</h3>
        <input
          type="text"
          placeholder="Hoạt động (VD: Làm bài tập Hóa)"
          value={newActivity.activity}
          onChange={(e) => setNewActivity({...newActivity, activity: e.target.value})}
        />
        <select
          value={newActivity.subject}
          onChange={(e) => setNewActivity({...newActivity, subject: e.target.value})}
          style={{ 
            width: '100%', 
            padding: '0.8rem',
            marginBottom: '1rem',
            borderRadius: '10px',
            border: '2px solid #e0e0e0'
          }}
        >
          <option>Hóa học</option>
          <option>Sinh học</option>
          <option>Vật lý</option>
          <option>Toán học</option>
          <option>Văn học</option>
        </select>
        <input
          type="number"
          placeholder="Thời gian (phút)"
          value={newActivity.duration}
          onChange={(e) => setNewActivity({...newActivity, duration: e.target.value})}
        />
        <input
          type="number"
          placeholder="Độ chính xác (%)"
          value={newActivity.accuracy}
          onChange={(e) => setNewActivity({...newActivity, accuracy: e.target.value})}
          min="0"
          max="100"
        />
        <button 
          className="btn" 
          onClick={handleLog}
          disabled={!newActivity.activity || !newActivity.duration || !newActivity.accuracy}
        >
          Ghi nhận
        </button>
      </div>
    </div>
  );
}

export default LearningTracker;
