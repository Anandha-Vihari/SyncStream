import { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { FolderOpen, GraduationCap, ChevronDown, ChevronRight, X } from 'lucide-react';
import { socket } from '../socket';
import VideoPlayer from './VideoPlayer';
import ChatSidebar from './ChatSidebar';
import { dsaCourseData } from '../data/dsaCourse';

export default function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  const username = location.state?.username || 'Anonymous';
  const isUrlLocalParam = queryParams.get('mode') === 'local';
  const initialUrl = (queryParams.get('url') || '').trim();
  
  const [roomState, setRoomState] = useState({
    url: isUrlLocalParam ? 'LOCAL_FILE' : initialUrl,
    playing: false,
    time: 0,
    users: 0,
    fileIndex: 0,
    isLocal: isUrlLocalParam
  });

  const [localFileUrl, setLocalFileUrl] = useState<string | null>(null);
  const [sortedFiles, setSortedFiles] = useState<File[]>([]);
  const [sidebarTab, setSidebarTab] = useState<'local' | 'course'>('local');
  
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({});
  const [expandedSubSteps, setExpandedSubSteps] = useState<Record<string, boolean>>({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  useEffect(() => {
    if (!roomId) return;
    socket.connect();
    
    socket.emit('join_room', { 
      roomId, 
      username, 
      videoUrl: isUrlLocalParam ? 'LOCAL_FILE' : initialUrl 
    });

    socket.on('room_state', (state) => {
      setRoomState(prev => ({ ...prev, ...state }));
      if (state.url === 'LOCAL_FILE') {
        setSidebarTab('local');
      } else if (state.url && (state.url.includes('youtube') || state.url.includes('youtu.be'))) {
        setSidebarTab('course');
      }
    });

    socket.on('video_update', (data) => {
      setRoomState(prev => ({ ...prev, ...data }));
    });

    return () => {
      socket.off('room_state');
      socket.off('video_update');
      socket.disconnect();
    };
  }, [roomId, username, isUrlLocalParam, initialUrl]);

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



  return (
    <div className="room-layout">
      {/* Render left sidebar only in Local File mode */}
      {roomState.isLocal && (
        <aside className="left-sidebar">
          <div className="left-sidebar-tabs">
            <button 
              onClick={() => setSidebarTab('local')}
              className={`left-sidebar-tab-btn ${sidebarTab === 'local' ? 'active' : ''}`}
            >
              <FolderOpen size={16} /> Local Folder
            </button>
            <button 
              onClick={() => setSidebarTab('course')}
              className={`left-sidebar-tab-btn ${sidebarTab === 'course' ? 'active' : ''}`}
            >
              <GraduationCap size={16} /> A2Z Course
            </button>
          </div>

          <div className="left-sidebar-content">
            {sidebarTab === 'local' ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <label className="copy-btn" style={{ cursor: 'pointer', background: 'var(--success)', color: 'white', display: 'flex', justifyContent: 'center', marginBottom: '10px', border: 'none' }}>
                  <FolderOpen size={18} /> {sortedFiles.length > 0 ? 'Change Folder' : 'Select Folder'}
                  <input 
                    type="file" 
                    {...({ webkitdirectory: "true", directory: "" } as any)} 
                    onChange={handleFolderChange} 
                    style={{ display: 'none' }} 
                  />
                </label>
                {sortedFiles.map((file, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => selectLocalVideo(idx)} 
                    className={`local-file-item ${(roomState.isLocal && roomState.fileIndex === idx) ? 'active' : ''}`}
                  >
                    {idx + 1}. {file.name}
                  </button>
                ))}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {dsaCourseData.map((step, sIdx) => (
                  <div key={sIdx} style={{ marginBottom: '4px' }}>
                    <button onClick={() => toggleStep(sIdx)} className="course-step-button">
                      <span style={{ fontWeight: 600 }}>{step.title}</span>
                      {expandedSteps[sIdx] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </button>
                    
                    {expandedSteps[sIdx] && (
                      <div style={{ paddingLeft: '10px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {step.subSteps.map((sub, subIdx) => (
                          <div key={subIdx}>
                            <button onClick={() => toggleSubStep(sIdx, subIdx)} className="course-substep-button">
                              <span>{sub.title}</span>
                              {expandedSubSteps[`${sIdx}-${subIdx}`] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                            </button>
                            
                            {expandedSubSteps[`${sIdx}-${subIdx}`] && (
                              <div style={{ paddingLeft: '10px', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                {sub.topics.map((topic, tIdx) => (
                                  <button 
                                    key={tIdx} 
                                    onClick={() => selectCourseVideo(topic.url)} 
                                    className={`course-topic-button ${roomState.url === topic.url ? 'active' : ''}`}
                                  >
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
      )}

      <div className="main-content">
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
      
      <ChatSidebar 
        username={username} 
        roomId={roomId}
        isLocal={roomState.isLocal}
        usersCount={roomState.users}
        onChangeVideoClick={() => setIsModalOpen(true)}
      />

      {/* Change Video Overlay Modal Drawer */}
      {isModalOpen && (
        <div className="modal-backdrop" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Change Video Source</h3>
              <button className="modal-close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="modal-body">
              <div className="modal-section">
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Stream Online Video
                </label>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const form = e.currentTarget;
                  const inputEl = form.elements.namedItem('videoUrlInput') as HTMLInputElement;
                  if (inputEl && inputEl.value.trim()) {
                    selectCourseVideo(inputEl.value.trim());
                    setIsModalOpen(false);
                  }
                }} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    name="videoUrlInput"
                    type="url" 
                    placeholder="Paste YouTube link or direct video URL..." 
                    defaultValue={roomState.isLocal ? '' : roomState.url}
                    required
                  />
                  <button type="submit">Load</button>
                </form>
              </div>

              <div className="divider">OR SELECT COURSE TOPIC</div>

              <div className="modal-section" style={{ maxHeight: '40vh', overflowY: 'auto', paddingRight: '4px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {dsaCourseData.map((step, sIdx) => (
                    <div key={sIdx} style={{ marginBottom: '4px' }}>
                      <button onClick={() => toggleStep(sIdx)} className="course-step-button">
                        <span style={{ fontWeight: 600 }}>{step.title}</span>
                        {expandedSteps[sIdx] ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      
                      {expandedSteps[sIdx] && (
                        <div style={{ paddingLeft: '10px', marginTop: '4px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          {step.subSteps.map((sub, subIdx) => (
                            <div key={subIdx}>
                              <button onClick={() => toggleSubStep(sIdx, subIdx)} className="course-substep-button">
                                <span>{sub.title}</span>
                                {expandedSubSteps[`${sIdx}-${subIdx}`] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                              </button>
                              
                              {expandedSubSteps[`${sIdx}-${subIdx}`] && (
                                <div style={{ paddingLeft: '10px', marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                  {sub.topics.map((topic, tIdx) => (
                                    <button 
                                      key={tIdx} 
                                      onClick={() => {
                                        selectCourseVideo(topic.url);
                                        setIsModalOpen(false);
                                      }} 
                                      className={`course-topic-button ${roomState.url === topic.url ? 'active' : ''}`}
                                    >
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
              </div>

              <div className="modal-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.25rem', marginTop: '1rem' }}>
                <button 
                  onClick={() => {
                    socket.emit('video_update', { isLocal: true, url: 'LOCAL_FILE', playing: false, time: 0 });
                    setIsModalOpen(false);
                  }}
                  style={{ width: '100%', background: 'rgba(255, 255, 255, 0.03)', color: 'var(--text-main)', border: '1px solid var(--border)' }}
                >
                  <FolderOpen size={16} /> Switch to Local Folder Sync
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

