import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, Users } from 'lucide-react';

export default function Landing() {
  const [videoUrl, setVideoUrl] = useState('');
  const [roomId, setRoomId] = useState('');
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoUrl || !username) return;
    
    // Generate a random 6-character room ID
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    
    // Use URLSearchParams to build the query string cleanly
    const params = new URLSearchParams();
    params.set('url', videoUrl);
    
    navigate(`/room/${newRoomId}?${params.toString()}`, { state: { username, isCreator: true } });
  };

  const handleJoinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomId || !username) return;
    
    navigate(`/room/${roomId}`, { state: { username, isCreator: false } });
  };

  return (
    <div className="landing-container">
      <div className="landing-card">
        <div className="landing-header">
          <h1>SyncWatch</h1>
          <p>Watch videos together in perfect sync.</p>
        </div>

        <div className="form-group">
          <label>Choose a Username</label>
          <input 
            type="text" 
            placeholder="Enter your name" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <form onSubmit={handleCreateRoom}>
          <div className="form-group">
            <label>Create a new room</label>
            <input 
              type="url" 
              placeholder="Paste Video URL (YouTube, Vimeo, etc.)" 
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
          </div>
          <button type="submit" disabled={!videoUrl || !username} style={{ width: '100%' }}>
            <Play size={18} /> Create Room
          </button>
        </form>

        <div className="divider">OR</div>

        <form onSubmit={handleJoinRoom}>
          <div className="form-group">
            <label>Join an existing room</label>
            <input 
              type="text" 
              placeholder="Enter Room ID" 
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
            />
          </div>
          <button type="submit" disabled={!roomId || !username} style={{ width: '100%', background: 'var(--bg-input)' }}>
            <Users size={18} /> Join Room
          </button>
        </form>
      </div>
    </div>
  );
}
