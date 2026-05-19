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

  // State from Landing page
  const username = location.state?.username || 'Anonymous';
  const isCreator = location.state?.isCreator || false;
  const initialVideoUrl = queryParams.get('url') || '';

  useEffect(() => {
    if (!roomId) return;

    socket.connect();
    
    const effectiveUrl = initialVideoUrl || '';
    console.log(`Attempting to join room ${roomId} as ${username}. URL from params: ${effectiveUrl}`);
    
    // Join the room - send URL if we have one (either from creator state or query params)
    socket.emit('join_room', { 
      roomId, 
      username, 
      videoUrl: effectiveUrl 
    });

    // Listen for the initial room state
    socket.on('room_state', (state) => {
      console.log('Received room_state:', state);
      setRoomState(state);
    });

    // Listen for updates from others
    socket.on('video_update', (data) => {
      console.log('Received video_update:', data);
      setRoomState(prev => ({ ...prev, ...data }));
    });

    return () => {
      socket.off('room_state');
      socket.off('video_update');
      socket.disconnect();
    };
  }, [roomId, username, isCreator, initialVideoUrl]);

  const forceSync = () => {
    if (initialVideoUrl) {
      socket.emit('video_update', { url: initialVideoUrl, playing: false, time: 0 });
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
            <p>SyncWatch Party</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
            url={roomState.url} 
            playing={roomState.playing} 
            time={roomState.time}
          />
        </div>
      </div>
      
      <ChatSidebar username={username} />
    </div>
  );
}
