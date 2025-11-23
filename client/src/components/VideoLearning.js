import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function VideoLearning({ userId }) {
  const [videoTime, setVideoTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [attempts, setAttempts] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [showVideoList, setShowVideoList] = useState(true);
  const [filterGrade, setFilterGrade] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [player, setPlayer] = useState(null);
  const [questionCheckpoints] = useState([180, 360, 540]); // 3, 6, 9 phút
  // eslint-disable-next-line no-unused-vars
  const playerRef = useRef(null);

  // Thư viện video học tập thực tế từ YouTube
  const videoLibrary = [
    // TOÁN HỌC
    {
      id: 'math6_1',
      title: 'Phân số - Lớp 6',
      subject: 'Toán',
      grade: '6',
      duration: 900,
      thumbnail: 'https://img.youtube.com/vi/kQZmZRE0cQY/maxresdefault.jpg',
      youtubeId: 'kQZmZRE0cQY',
      description: 'Các phép tính với phân số, quy đồng mẫu số, so sánh phân số'
    },
    {
      id: 'math7_1',
      title: 'Số hữu tỉ - Lớp 7',
      subject: 'Toán',
      grade: '7',
      duration: 1200,
      thumbnail: 'https://img.youtube.com/vi/Kp2bYWRQylk/maxresdefault.jpg',
      youtubeId: 'Kp2bYWRQylk',
      description: 'Khái niệm số hữu tỉ, biểu diễn trên trục số, các phép tính'
    },
    {
      id: 'math8_1',
      title: 'Phương trình bậc nhất - Lớp 8',
      subject: 'Toán',
      grade: '8',
      duration: 1500,
      thumbnail: 'https://img.youtube.com/vi/9Bv2zltQKQA/maxresdefault.jpg',
      youtubeId: '9Bv2zltQKQA',
      description: 'Giải phương trình bậc nhất một ẩn, ứng dụng thực tế'
    },
    {
      id: 'math9_1',
      title: 'Phương trình bậc 2 - Lớp 9',
      subject: 'Toán',
      grade: '9',
      duration: 1800,
      thumbnail: 'https://img.youtube.com/vi/i7idZfS8t8w/maxresdefault.jpg',
      youtubeId: 'i7idZfS8t8w',
      description: 'Công thức nghiệm, định lý Vi-et, ứng dụng'
    },
    {
      id: 'math10_1',
      title: 'Hàm số bậc nhất - Lớp 10',
      subject: 'Toán',
      grade: '10',
      duration: 2100,
      thumbnail: 'https://img.youtube.com/vi/rtIOM0u4v_s/maxresdefault.jpg',
      youtubeId: 'rtIOM0u4v_s',
      description: 'Đồ thị hàm số, tính chất, ứng dụng'
    },
    {
      id: 'math11_1',
      title: 'Đạo hàm - Lớp 11',
      subject: 'Toán',
      grade: '11',
      duration: 2400,
      thumbnail: 'https://img.youtube.com/vi/rAof9Ld5sOg/maxresdefault.jpg',
      youtubeId: 'rAof9Ld5sOg',
      description: 'Khái niệm đạo hàm, quy tắc tính đạo hàm, ứng dụng'
    },
    {
      id: 'math12_1',
      title: 'Tích phân - Lớp 12',
      subject: 'Toán',
      grade: '12',
      duration: 2700,
      thumbnail: 'https://img.youtube.com/vi/rfG8ce4nNh0/maxresdefault.jpg',
      youtubeId: 'rfG8ce4nNh0',
      description: 'Nguyên hàm, tích phân xác định, ứng dụng tính diện tích'
    },

    // HÓA HỌC
    {
      id: 'chem8_1',
      title: 'Nguyên tử - Phân tử - Lớp 8',
      subject: 'Hóa',
      grade: '8',
      duration: 1200,
      thumbnail: 'https://img.youtube.com/vi/yQP4UJhNn0I/maxresdefault.jpg',
      youtubeId: 'yQP4UJhNn0I',
      description: 'Cấu tạo nguyên tử, phân tử, nguyên tố hóa học'
    },
    {
      id: 'chem9_1',
      title: 'Axit - Bazơ - Muối - Lớp 9',
      subject: 'Hóa',
      grade: '9',
      duration: 1500,
      thumbnail: 'https://img.youtube.com/vi/Ew_tdY0V4Zo/maxresdefault.jpg',
      youtubeId: 'Ew_tdY0V4Zo',
      description: 'Tính chất hóa học, phản ứng trao đổi ion'
    },
    {
      id: 'chem10_1',
      title: 'Bảng tuần hoàn - Lớp 10',
      subject: 'Hóa',
      grade: '10',
      duration: 1800,
      thumbnail: 'https://img.youtube.com/vi/0RRVV4Diomg/maxresdefault.jpg',
      youtubeId: '0RRVV4Diomg',
      description: 'Cấu trúc bảng tuần hoàn, quy luật biến đổi tính chất'
    },
    {
      id: 'chem11_1',
      title: 'Liên kết hóa học - Lớp 11',
      subject: 'Hóa',
      grade: '11',
      duration: 2100,
      thumbnail: 'https://img.youtube.com/vi/QqjcCvzWwww/maxresdefault.jpg',
      youtubeId: 'QqjcCvzWwww',
      description: 'Liên kết ion, cộng hóa trị, kim loại'
    },
    {
      id: 'chem12_1',
      title: 'Hóa hữu cơ - Lớp 12',
      subject: 'Hóa',
      grade: '12',
      duration: 2400,
      thumbnail: 'https://img.youtube.com/vi/niOJ-NUbqYE/maxresdefault.jpg',
      youtubeId: 'niOJ-NUbqYE',
      description: 'Hidrocacbon, dẫn xuất, polime'
    },

    // VẬT LÝ
    {
      id: 'phys6_1',
      title: 'Chuyển động cơ học - Lớp 6',
      subject: 'Vật lý',
      grade: '6',
      duration: 900,
      thumbnail: 'https://img.youtube.com/vi/ZM8ECpBuQYE/maxresdefault.jpg',
      youtubeId: 'ZM8ECpBuQYE',
      description: 'Vận tốc, quãng đường, thời gian'
    },
    {
      id: 'phys8_1',
      title: 'Áp suất - Lớp 8',
      subject: 'Vật lý',
      grade: '8',
      duration: 1200,
      thumbnail: 'https://img.youtube.com/vi/qQWAOTznWxs/maxresdefault.jpg',
      youtubeId: 'qQWAOTznWxs',
      description: 'Áp suất chất rắn, lỏng, khí'
    },
    {
      id: 'phys10_1',
      title: 'Chuyển động thẳng đều - Lớp 10',
      subject: 'Vật lý',
      grade: '10',
      duration: 1800,
      thumbnail: 'https://img.youtube.com/vi/TG-MGZKoRXI/maxresdefault.jpg',
      youtubeId: 'TG-MGZKoRXI',
      description: 'Phương trình chuyển động, đồ thị'
    },
    {
      id: 'phys11_1',
      title: 'Điện trường - Lớp 11',
      subject: 'Vật lý',
      grade: '11',
      duration: 2100,
      thumbnail: 'https://img.youtube.com/vi/mdulzEfQXDE/maxresdefault.jpg',
      youtubeId: 'mdulzEfQXDE',
      description: 'Điện tích, cường độ điện trường, điện thế'
    },
    {
      id: 'phys12_1',
      title: 'Dao động điều hòa - Lớp 12',
      subject: 'Vật lý',
      grade: '12',
      duration: 2400,
      thumbnail: 'https://img.youtube.com/vi/Qf5qRCZbVxE/maxresdefault.jpg',
      youtubeId: 'Qf5qRCZbVxE',
      description: 'Phương trình dao động, năng lượng'
    },

    // SINH HỌC
    {
      id: 'bio6_1',
      title: 'Tế bào thực vật - Lớp 6',
      subject: 'Sinh',
      grade: '6',
      duration: 900,
      thumbnail: 'https://img.youtube.com/vi/URUJD5NEXC8/maxresdefault.jpg',
      youtubeId: 'URUJD5NEXC8',
      description: 'Cấu tạo tế bào, chức năng các bào quan'
    },
    {
      id: 'bio8_1',
      title: 'Hệ tuần hoàn - Lớp 8',
      subject: 'Sinh',
      grade: '8',
      duration: 1200,
      thumbnail: 'https://img.youtube.com/vi/H04d3rJCLCE/maxresdefault.jpg',
      youtubeId: 'H04d3rJCLCE',
      description: 'Tim mạch, máu, tuần hoàn máu'
    },
    {
      id: 'bio9_1',
      title: 'Di truyền học - Lớp 9',
      subject: 'Sinh',
      grade: '9',
      duration: 1500,
      thumbnail: 'https://img.youtube.com/vi/zwibgNGe4aY/maxresdefault.jpg',
      youtubeId: 'zwibgNGe4aY',
      description: 'ADN, gen, nhiễm sắc thể'
    },
    {
      id: 'bio10_1',
      title: 'Quang hợp - Lớp 10',
      subject: 'Sinh',
      grade: '10',
      duration: 1800,
      thumbnail: 'https://img.youtube.com/vi/g78utcLQrJ4/maxresdefault.jpg',
      youtubeId: 'g78utcLQrJ4',
      description: 'Cơ chế quang hợp, yếu tố ảnh hưởng'
    },
    {
      id: 'bio11_1',
      title: 'Hô hấp tế bào - Lớp 11',
      subject: 'Sinh',
      grade: '11',
      duration: 2100,
      thumbnail: 'https://img.youtube.com/vi/00jbG_cfGuQ/maxresdefault.jpg',
      youtubeId: '00jbG_cfGuQ',
      description: 'Đường phân, chu trình Krebs, chuỗi truyền electron'
    },
    {
      id: 'bio12_1',
      title: 'Tiến hóa - Lớp 12',
      subject: 'Sinh',
      grade: '12',
      duration: 2400,
      thumbnail: 'https://img.youtube.com/vi/hOfRN0KihOU/maxresdefault.jpg',
      youtubeId: 'hOfRN0KihOU',
      description: 'Thuyết tiến hóa, chọn lọc tự nhiên'
    },

    // VĂN HỌC
    {
      id: 'lit6_1',
      title: 'Văn tả người - Lớp 6',
      subject: 'Văn',
      grade: '6',
      duration: 900,
      thumbnail: 'https://img.youtube.com/vi/Hs3YejHHq8Y/maxresdefault.jpg',
      youtubeId: 'Hs3YejHHq8Y',
      description: 'Kỹ năng tả người, miêu tả chân dung'
    },
    {
      id: 'lit9_1',
      title: 'Vợ Nhặt - Kim Lân - Lớp 9',
      subject: 'Văn',
      grade: '9',
      duration: 1500,
      thumbnail: 'https://img.youtube.com/vi/xvFZjo5PgG0/maxresdefault.jpg',
      youtubeId: 'xvFZjo5PgG0',
      description: 'Phân tích tác phẩm, nhân vật, nghệ thuật'
    },
    {
      id: 'lit12_1',
      title: 'Chiếc Thuyền Ngoài Xa - Nguyễn Minh Châu',
      subject: 'Văn',
      grade: '12',
      duration: 2400,
      thumbnail: 'https://img.youtube.com/vi/P_SlAzsXa7E/maxresdefault.jpg',
      youtubeId: 'P_SlAzsXa7E',
      description: 'Phân tích tư tưởng, nghệ thuật, giá trị nhân văn'
    }
  ];

  // Load YouTube IFrame API
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      console.log('YouTube API Ready');
    };
  }, []);

  // Theo dõi thời gian video và kiểm tra checkpoint
  useEffect(() => {
    let interval;
    if (player && isPlaying) {
      interval = setInterval(() => {
        if (player.getCurrentTime) {
          const currentTime = Math.floor(player.getCurrentTime());
          setVideoTime(currentTime);
          
          // Kiểm tra checkpoint
          if (questionCheckpoints.includes(currentTime) && !currentQuestion) {
            player.pauseVideo();
            setIsPlaying(false);
            fetchQuestion(currentTime);
          }
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [player, isPlaying, questionCheckpoints, currentQuestion]);

  const fetchQuestion = async (timestamp) => {
    try {
      const response = await axios.get(`/api/video/question/video1/${timestamp}`);
      setCurrentQuestion(response.data);
    } catch (error) {
      console.error('Error fetching question:', error);
    }
  };

  const handleAnswer = async () => {
    try {
      const response = await axios.post('/api/video/answer', {
        userId,
        videoId: 'video1',
        questionId: currentQuestion.id,
        answer: parseInt(answer),
        attempts: attempts + 1
      });

      setFeedback(response.data);
      setAttempts(prev => prev + 1);

      if (response.data.correct) {
        setTimeout(() => {
          setCurrentQuestion(null);
          setAnswer('');
          setAttempts(0);
          setFeedback(null);
          if (player) {
            player.playVideo();
          }
        }, 2000);
      } else if (response.data.action === 'replay') {
        setTimeout(() => {
          if (player) {
            player.seekTo(response.data.replayFrom, true);
            player.playVideo();
          }
          setCurrentQuestion(null);
          setAnswer('');
          setAttempts(0);
          setFeedback(null);
        }, 3000);
      }
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Lọc video theo lớp và môn
  const filteredVideos = videoLibrary.filter(video => {
    const gradeMatch = filterGrade === 'all' || video.grade === filterGrade;
    const subjectMatch = filterSubject === 'all' || video.subject === filterSubject;
    return gradeMatch && subjectMatch;
  });

  const selectVideo = (video) => {
    setSelectedVideo(video);
    setShowVideoList(false);
    setVideoTime(0);
    setIsPlaying(false);
    setCurrentQuestion(null);
    setAnswer('');
    setAttempts(0);
    setFeedback(null);
    
    // Khởi tạo YouTube player
    setTimeout(() => {
      if (window.YT && window.YT.Player) {
        new window.YT.Player('youtube-player', {
          videoId: video.youtubeId,
          playerVars: {
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0
          },
          events: {
            onReady: (event) => {
              setPlayer(event.target);
              console.log('Player ready');
            },
            onStateChange: (event) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              }
            }
          }
        });
      }
    }, 100);
  };

  const backToList = () => {
    setShowVideoList(true);
    setSelectedVideo(null);
    setIsPlaying(false);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>🎥 Video Learning - Bài Giảng Tương Tác</h2>
          <p style={{ color: '#666', margin: '0.5rem 0 0 0' }}>
            Video tự động tạm dừng và kiểm tra hiểu biết của bạn
          </p>
        </div>
        {selectedVideo && (
          <button className="btn" onClick={backToList} style={{ background: '#6c757d' }}>
            ← Danh sách video
          </button>
        )}
      </div>

      {/* Video Library */}
      {showVideoList && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0 }}>📚 Thư viện video học tập ({filteredVideos.length} video)</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <select 
                value={filterGrade} 
                onChange={(e) => setFilterGrade(e.target.value)}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #667eea' }}
              >
                <option value="all">Tất cả lớp</option>
                <option value="6">Lớp 6</option>
                <option value="7">Lớp 7</option>
                <option value="8">Lớp 8</option>
                <option value="9">Lớp 9</option>
                <option value="10">Lớp 10</option>
                <option value="11">Lớp 11</option>
                <option value="12">Lớp 12</option>
              </select>
              <select 
                value={filterSubject} 
                onChange={(e) => setFilterSubject(e.target.value)}
                style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '2px solid #667eea' }}
              >
                <option value="all">Tất cả môn</option>
                <option value="Toán">Toán học</option>
                <option value="Hóa">Hóa học</option>
                <option value="Vật lý">Vật lý</option>
                <option value="Sinh">Sinh học</option>
                <option value="Văn">Văn học</option>
              </select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {filteredVideos.map(video => (
              <div 
                key={video.id}
                style={{
                  border: '2px solid #e0e0e0',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  background: 'white'
                }}
                onClick={() => selectVideo(video)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-5px)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <img 
                  src={video.thumbnail} 
                  alt={video.title}
                  style={{ width: '100%', height: '180px', objectFit: 'cover' }}
                />
                <div style={{ padding: '1rem' }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: '#667eea' }}>{video.title}</h4>
                  <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.5rem' }}>
                    <span>📚 {video.subject}</span> • <span>🎓 Lớp {video.grade}</span>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: '#999', margin: '0.5rem 0' }}>
                    {video.description}
                  </p>
                  <div style={{ fontSize: '0.85rem', color: '#667eea', fontWeight: 'bold', marginTop: '0.5rem' }}>
                    ⏱️ {Math.floor(video.duration / 60)} phút
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="alert alert-warning" style={{ marginTop: '2rem' }}>
            <strong>💡 Lưu ý:</strong> Chọn video để bắt đầu học. Video sẽ tự động tạm dừng và kiểm tra hiểu biết của bạn!
          </div>
        </div>
      )}

      {/* Video Player */}
      {selectedVideo && !showVideoList && (
        <div>

      {/* Video Player */}
      <div style={{
        background: '#000',
        borderRadius: '15px',
        overflow: 'hidden',
        marginBottom: '2rem',
        position: 'relative'
      }}>
        {/* YouTube Video Player */}
        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0 }}>
          <div
            id="youtube-player"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          />
        </div>
        
        {/* Video Controls Overlay */}
        <div style={{
          background: 'rgba(0,0,0,0.8)',
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ color: 'white', fontSize: '1.2rem' }}>
            📺 {selectedVideo.title}
          </div>
          <div style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold' }}>
            {formatTime(videoTime)} / {formatTime(selectedVideo.duration)}
          </div>
          <button 
            className="btn" 
            onClick={() => {
              if (player) {
                if (isPlaying) {
                  player.pauseVideo();
                } else {
                  player.playVideo();
                }
              }
            }}
            disabled={currentQuestion !== null}
            style={{ minWidth: '120px' }}
          >
            {isPlaying ? '⏸ Tạm dừng' : '▶ Phát'}
          </button>
        </div>
      </div>

      {currentQuestion && (
        <div className="alert alert-warning">
          <h3>❓ Câu hỏi kiểm tra</h3>
          <p style={{ fontSize: '1.1rem', margin: '1rem 0' }}>
            {currentQuestion.question}
          </p>
          <div style={{ marginBottom: '1rem' }}>
            {currentQuestion.options.map((option, idx) => (
              <div key={idx} style={{ marginBottom: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="answer"
                    value={idx}
                    checked={answer === idx.toString()}
                    onChange={(e) => setAnswer(e.target.value)}
                    style={{ marginRight: '0.5rem', width: 'auto' }}
                  />
                  {option}
                </label>
              </div>
            ))}
          </div>
          <button 
            className="btn" 
            onClick={handleAnswer}
            disabled={!answer}
          >
            Trả lời
          </button>
          {attempts > 0 && (
            <p style={{ marginTop: '1rem', color: '#856404' }}>
              Số lần thử: {attempts}/3
            </p>
          )}
        </div>
      )}

      {feedback && (
        <div className={`alert ${feedback.correct ? 'alert-success' : 'alert-error'}`}>
          <p><strong>{feedback.message}</strong></p>
          {feedback.action === 'replay' && (
            <p>Video sẽ tua lại để bạn xem lại phần này...</p>
          )}
        </div>
      )}

      <div className="alert alert-warning">
        <strong>📌 Cách hoạt động:</strong>
        <ul style={{ marginTop: '0.5rem', marginLeft: '1.5rem' }}>
          <li>Video tạm dừng sau mỗi 3 phút để kiểm tra</li>
          <li>Sai 3 lần → tua lại phần trước</li>
          <li>Sau {Math.floor(selectedVideo.duration / 60)} phút → bài test 10 câu (cần đạt 75%)</li>
        </ul>
      </div>
        </div>
      )}
    </div>
  );
}

export default VideoLearning;
