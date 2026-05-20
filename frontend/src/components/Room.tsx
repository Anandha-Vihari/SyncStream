import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Copy, Users } from 'lucide-react';
import { socket } from '../socket';
import VideoPlayer from './VideoPlayer';
import ChatSidebar from './ChatSidebar';

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [roomState, setRoomState] = useState({
    url: '',
    playing: false,
    time: 0,
    users: 0
  });

  // State from Landing page or URL
  const username = location.state?.username || 'Anonymous';
  const isUrlLocalParam = queryParams.get('mode') === 'local';
  
  // Persistent local mode flag
  const [isLocalMode, setIsLocalMode] = useState(isUrlLocalParam);
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    socket.connect();
    
    const initialUrl = queryParams.get('url') || '';
    
    // Join the room - if local param is set, tell the server this is a LOCAL_FILE room
    socket.emit('join_room', { 
      roomId, 
      username, 
      videoUrl: isUrlLocalParam ? 'LOCAL_FILE' : initialUrl 
    });

    // Listen for the initial room state
    socket.on('room_state', (state) => {
      console.log('Received room_state:', state);
      setRoomState(state);
      // If server says this is a local file room, lock it in
      if (state.url === 'LOCAL_FILE') {
        setIsLocalMode(true);
      }
    });

    // Listen for updates from others
    socket.on('video_update', (data) => {
      console.log('Received video_update:', data);
      // Only update roomState, but DON'T let it change our isLocalMode
      setRoomState(prev => ({ ...prev, ...data }));
    });

    return () => {
      socket.off('room_state');
      socket.off('video_update');
      socket.disconnect();
    };
  }, [roomId, username, isUrlLocalParam]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setLocalFileUrl(url);
    }
  };

  const copyRoomId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
    }
  };

  return (
    <div className="room-layout">
      <div className="main-content" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="room-header">
          <div className="room-info">
            <h2>Room: {roomId}</h2>
            <p>{isLocalMode ? 'Local File Sync Mode' : 'SyncWatch Party'}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {isLocalMode && (
              <label className="copy-btn" style={{ cursor: 'pointer', background: 'var(--success)' }}>
                {localFileUrl ? 'Change MP4 File' : 'Select MP4 File'}
                <input type="file" accept="video/mp4,video/webm" onChange={handleFileChange} style={{ display: 'none' }} />
              </label>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Users size={18} /> {roomState.users || 1}
            </div>
            <button className="copy-btn" onClick={copyRoomId} title="Copy Room ID">
              <Copy size={18} /> Copy ID
            </button>
          </div>
        </header>

        <div className="video-container">
          <VideoPlayer 
            url={isLocalMode ? (localFileUrl || 'LOCAL_WAITING') : roomState.url} 
            playing={roomState.playing} 
            time={roomState.time}
            isLocal={isLocalMode}
          />
        </div>
      </div>
      
      <ChatSidebar username={username} />
    </div>
  );
}
