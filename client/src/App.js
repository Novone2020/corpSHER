import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const SERVER_URL = process.env.REACT_APP_SERVER_URL;

function App() {
  const [link, setLink] = useState('');
  const [videoId, setVideoId] = useState('');
  const [history, setHistory] = useState([]);

  const extractVideoId = (url) => {
    const regExp = /^.*((youtu.be\/)|(v\/)|(u\/\w\/)|(embed\/)|(watch\?v=))([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[7].length === 11 ? match[7] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const id = extractVideoId(link);
    if (id) {
      setVideoId(id);
      await axios.post(`${SERVER_URL}/api/videos`, {
        url: link,
        videoId: id
      });
      setLink('');
      fetchHistory();
    } else {
      alert('Invalid YouTube URL!');
    }
  };

  const fetchHistory = async () => {
    const res = await axios.get(`${SERVER_URL}/api/videos`);
    setHistory(res.data);
  };

  const deleteVideo = async (id) => {
    await axios.delete(`${SERVER_URL}/api/videos/${id}`);
    fetchHistory();
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="container">
      <h1>🎬 YouTube Embed Player</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Paste YouTube link here..."
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button type="submit">▶ Play</button>
      </form>

      {videoId && (
        <div className="video-container">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}`}
            frameBorder="0"
            allowFullScreen
            title="YouTube video"
          ></iframe>
        </div>
      )}

      <div className="history">
        <h2>📜 Watch History</h2>
        <div className="history-grid">
          {history.map((video) => (
            <div className="history-item" key={video._id}>
              <img
                src={`https://img.youtube.com/vi/${video.videoId}/0.jpg`}
                alt="thumbnail"
              />
              <div className="video-info">
                <a href={video.url} target="_blank" rel="noreferrer">
                  Open on YouTube
                </a>
                <a
                  href={`${SERVER_URL}/v/${video.shortcode}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  🔗 Short URL
                </a>
              </div>
              <button className="delete-btn" onClick={() => deleteVideo(video._id)}>🗑</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
