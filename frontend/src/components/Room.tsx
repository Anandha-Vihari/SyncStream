import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Copy, Users, FolderOpen, GraduationCap, ChevronDown, ChevronRight } from 'lucide-react';
import { socket } from '../socket';
import VideoPlayer from './VideoPlayer';
import ChatSidebar from './ChatSidebar';
import { dsaCourseData } from '../data/dsaCourse';

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const [roomState, setRoomState] = useState({
    url: '',
    playing: false,
    time: 0,
    users: 0,
    fileIndex: 0,
    isLocal: false
  });

  const username = location.state?.username || 'Anonymous';
  const isUrlLocalParam = queryParams.get('mode') === 'local';
  
  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);
  const [sortedFiles, setSortedFiles] = useState<File[]>([]);
  const [sidebarTab, setSidebarTab] = useState<'local' | 'course'>('local');
  
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});
  const [expandedSubSteps, setExpandedSubSteps] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!roomId) return;
    socket.connect();
    const initialUrl = queryParams.get('url') || '';
    
    socket.emit('join_room', { 
      roomId, 
      username, 
      videoUrl: isUrlLocalParam ? 'LOCAL_FILE' : initialUrl 
    });

    socket.on('room_state', (state) => {
      setRoomState(state);
      if (state.url === 'LOCAL_FILE') setSidebarTab('local');
      else if (state.url.includes('youtube') || state.url.includes('youtu.be')) setSidebarTab('course');
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
    if (roomState.isLocal && sortedFiles.length > roomState.fileIndex) {
      const file = sortedFiles[roomState.fileIndex];
      const url = URL.createObjectURL(file);
      setLocalFileUrl(url);
    }
  }, [roomState.fileIndex, sortedFiles, roomState.isLocal]);

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const videoFiles = files.filter(f => f.type.startsWith('video/') || f.name.endsWith('.mp4') || f.name.endsWith('.mkv'));
    const sorted = videoFiles.sort((a, b) => a.lastModified - b.lastModified);
    setSortedFiles(sorted);
    if (sorted.length > 0) {
      setLocalFileUrl(URL.createObjectURL(sorted[roomState.fileIndex || 0]));
      socket.emit('video_update', { isLocal: true, url: 'LOCAL_FILE' });
    }
  };

  const selectLocalVideo = (index: number) => {
    socket.emit('video_update', { isLocal: true, url: 'LOCAL_FILE', fileIndex: index, time: 0, playing: true });
  };

  const selectCourseVideo = (url: string) => {
    socket.emit('video_update', { isLocal: false, url, time: 0, playing: true });
  };

  const toggleStep = (idx: number) => {
    setExpandedSteps(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleSubStep = (stepIdx: number, subIdx: number) => {
    const key = `${stepIdx}-${subIdx}`;
    setExpandedSubSteps(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const copyRoomId = () => {
    if (roomId) navigator.clipboard.writeText(roomId);
  };

  return (
    <div className="room-layout">
      <aside className="chat-sidebar" style={{ width: '380px' }}>
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
          <button 
            onClick={() => setSidebarTab('local')}
            style={{ 
              flex: 1, borderRadius: 0, background: sidebarTab === 'local' ? 'var(--bg-input)' : 'transparent',
              borderBottom: sidebarTab === 'local' ? '2px solid var(--accent)' : 'none'
            }}
          >
            <FolderOpen size={16} /> Local
          </button>
          <button 
            onClick={() => setSidebarTab('course')}
            style={{ 
              flex: 1, borderRadius: 0, background: sidebarTab === 'course' ? 'var(--bg-input)' : 'transparent',
              borderBottom: sidebarTab === 'course' ? '2px solid var(--accent)' : 'none'
            }}
          >
            <GraduationCap size={16} /> A2Z Course
          </button>
        </div>

        <div className="messages-container" style={{ padding: '0.5rem' }}>
          {sidebarTab === 'local' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label className="copy-btn" style={{ cursor: 'pointer', background: 'var(--success)', marginBottom: '10px' }}>
                <FolderOpen size={18} /> {sortedFiles.length > 0 ? 'Change Folder' : 'Select Folder'}
                <input 
                  type="file" 
                  {...({ webkitdirectory: "true", directory: "" } as any)} 
                  onChange={handleFolderChange} 
                  style={{ display: 'none' }} 
                />
              </label>
              {sortedFiles.map((file, idx) => (
                <button key={idx} onClick={() => selectLocalVideo(idx)} style={{
                  textAlign: 'left', padding: '10px', fontSize: '0.85rem', width: '100%', border: 'none', color: 'white',
                  background: (roomState.isLocal && roomState.fileIndex === idx) ? 'var(--accent)' : 'rgba(255,255,255,0.05)',
                  borderRadius: '4px', cursor: 'pointer', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                }}>
                  {idx + 1}. {file.name}
                </button>
              ))}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {dsaCourseData.map((step, sIdx) => (
                <div key={sIdx} style={{ marginBottom: '4px' }}>
                  <button onClick={() => toggleStep(sIdx)} style={{
                    width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.08)', padding: '10px',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', color: 'white', borderRadius: '4px'
                  }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{step.title}</span>
                    {expandedSteps[sIdx] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  </button>
                  
                  {expandedSteps[sIdx] && (
                    <div style={{ paddingLeft: '10px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {step.subSteps.map((sub, subIdx) => (
                        <div key={subIdx}>
                          <button onClick={() => toggleSubStep(sIdx, subIdx)} style={{
                            width: '100%', textAlign: 'left', background: 'rgba(255,255,255,0.04)', padding: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', border: 'none', color: 'var(--text-muted)', borderRadius: '4px'
                          }}>
                            <span style={{ fontSize: '0.85rem' }}>{sub.title}</span>
                            {expandedSubSteps[`${sIdx}-${subIdx}`] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          </button>
                          
                          {expandedSubSteps[`${sIdx}-${subIdx}`] && (
                            <div style={{ paddingLeft: '10px', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              {sub.topics.map((topic, tIdx) => (
                                <button key={tIdx} onClick={() => selectCourseVideo(topic.url)} style={{
                                  textAlign: 'left', padding: '6px 10px', fontSize: '0.75rem', width: '100%', border: 'none',
                                  background: roomState.url === topic.url ? 'var(--accent)' : 'transparent',
                                  borderRadius: '4px', cursor: 'pointer', color: roomState.url === topic.url ? 'white' : 'var(--text-muted)'
                                }}>
                                  • {topic.title}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </aside>

      <div className="main-content" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
        <header className="room-header">
          <div className="room-info">
            <h2>Room: {roomId}</h2>
            <p>{roomState.isLocal ? 'Folder Sync' : 'Online Course Mode'}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
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
            url={roomState.isLocal ? (localFileUrl || 'LOCAL_WAITING') : roomState.url} 
            playing={roomState.playing} 
            time={roomState.time}
            isLocal={roomState.isLocal}
            onEnded={() => {
              if (roomState.isLocal) {
                const next = roomState.fileIndex + 1;
                if (next < sortedFiles.length) selectLocalVideo(next);
              }
            }}
          />
        </div>
      </div>
      <ChatSidebar username={username} />
    </div>
  );
}
