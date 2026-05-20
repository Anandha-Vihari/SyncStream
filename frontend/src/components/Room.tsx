import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Copy, Users, FolderOpen, ListVideo, MessageSquare } from 'lucide-react';
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
    users: 0,
    fileIndex: 0
  });

  const username = location.state?.username || 'Anonymous';
  const isUrlLocalParam = queryParams.get('mode') === 'local';
  
  const [isLocalMode, setIsLocalMode] = useState(isUrlLocalParam);
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);
  const [sortedFiles, setSortedFiles] = useState<File[]>([]);
  const [showPlaylist, setShowPlaylist] = useState(true); // Toggle for playlist view

  useEffect(() => {
    if (!roomId) return;
    socket.connect();
    const initialUrl = queryParams.get('url') || '';
    socket.emit('join_room', { roomId, username, videoUrl: isUrlLocalParam ? 'LOCAL_FILE' : initialUrl });

    socket.on('room_state', (state) => {
      setRoomState(state);
      if (state.url === 'LOCAL_FILE') setIsLocalMode(true);
    });

    socket.on('video_update', (data) => {
      setRoomState(prev => ({ ...prev, ...data }));
    });

    return () => {
      socket.off('room_state');
      socket.off('video_update');
      socket.disconnect();
    };
  }, [roomId, username, isUrlLocalParam]);

  useEffect(() => {
    if (isLocalMode && sortedFiles.length > roomState.fileIndex) {
      const file = sortedFiles[roomState.fileIndex];
      const url = URL.createObjectURL(file);
      setLocalFileUrl(url);
      console.log(`Switched to file index ${roomState.fileIndex}: ${file.name}`);
    }
  }, [roomState.fileIndex, sortedFiles, isLocalMode]);

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const videoFiles = files.filter(f => f.type.startsWith('video/') || f.name.endsWith('.mp4') || f.name.endsWith('.mkv') || f.name.endsWith('.webm'));
    
    // Sort by lastModified date
    const sorted = videoFiles.sort((a, b) => a.lastModified - b.lastModified);
    setSortedFiles(sorted);
    
    if (sorted.length > 0) {
      const currentIdx = roomState.fileIndex || 0;
      if (sorted[currentIdx]) {
        setLocalFileUrl(URL.createObjectURL(sorted[currentIdx]));
      }
      socket.emit('chat_message', `DEBUG: Loaded folder with ${sorted.length} videos.`);
    }
  };

  const handleVideoEnded = () => {
    const nextIndex = roomState.fileIndex + 1;
    if (nextIndex < sortedFiles.length) {
      socket.emit('video_update', { fileIndex: nextIndex, time: 0, playing: true });
    }
  };

  const selectVideo = (index: number) => {
    socket.emit('video_update', { fileIndex: index, time: 0, playing: true });
  };

  const copyRoomId = () => {
    if (roomId) navigator.clipboard.writeText(roomId);
  };

  return (
    <div className="room-layout">
      {/* Sidebar Area */}
      <aside className="chat-sidebar" style={{ width: showPlaylist ? '350px' : '60px', transition: 'width 0.3s' }}>
        <div className="chat-header" style={{ justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', overflow: 'hidden' }}>
            <ListVideo size={20} className={showPlaylist ? 'text-accent' : ''} style={{ flexShrink: 0 }} />
            {showPlaylist && <h3>Playlist</h3>}
          </div>
          <button 
            onClick={() => setShowPlaylist(!showPlaylist)} 
            style={{ padding: '4px', background: 'transparent', color: 'var(--text-muted)' }}
          >
            {showPlaylist ? '→' : '←'}
          </button>
        </div>

        {showPlaylist ? (
          <div className="messages-container" style={{ padding: '0.5rem' }}>
            {!isLocalMode ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Playlist only available in Local Folder mode.
              </div>
            ) : sortedFiles.length === 0 ? (
              <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Please select a folder to see videos.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {sortedFiles.map((file, idx) => (
                  <button
                    key={idx}
                    onClick={() => selectVideo(idx)}
                    style={{
                      textAlign: 'left',
                      padding: '10px 12px',
                      background: roomState.fileIndex === idx ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      display: 'block',
                      width: '100%',
                      border: 'none',
                      color: 'white',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'pointer'
                    }}
                  >
                    {idx + 1}. {file.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {/* Chat Toggle/Indicator when collapsed */}
        {!showPlaylist && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem', marginTop: '2rem' }}>
             <MessageSquare size={20} />
             <Users size={20} />
          </div>
        )}
      </aside>

      <div className="main-content" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="room-header">
          <div className="room-info">
            <h2>Room: {roomId}</h2>
            <p>{isLocalMode ? `Folder Sync (${sortedFiles.length} files)` : 'SyncWatch Party'}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            {isLocalMode && (
              <label className="copy-btn" style={{ cursor: 'pointer', background: 'var(--success)' }}>
                <FolderOpen size={18} /> {sortedFiles.length > 0 ? 'Change Folder' : 'Select Folder'}
                <input 
                  type="file" 
                  // @ts-ignore
                  webkitdirectory="true" 
                  directory="" 
                  onChange={handleFolderChange} 
                  style={{ display: 'none' }} 
                />
              </label>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <Users size={18} /> {roomState.users || 1}
            </div>
            <button className="copy-btn" onClick={copyRoomId}>
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
            onEnded={handleVideoEnded}
          />
        </div>
      </div>
      
      {/* Keep chat on the right */}
      <ChatSidebar username={username} />
    </div>
  );
}
