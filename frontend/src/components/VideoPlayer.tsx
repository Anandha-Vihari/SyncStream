import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { socket } from '../socket';

interface VideoPlayerProps {
  url: string;
  playing: boolean;
  time: number;
  isLocal?: boolean;
  onEnded?: () => void;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function VideoPlayer({ url, playing, time, isLocal, onEnded }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const ytContainerRef = useRef<HTMLDivElement>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  
  // Extract YouTube ID synchronously during render to prevent DOM thrashing
  const youtubeId = (() => {
    if (!url || isLocal) return null;
    const trimmed = url.trim();
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\? ]*).*/;
    const match = trimmed.match(regExp);
    if (match && match[2]) {
      const id = match[2].trim();
      return id.length === 11 ? id : null;
    }
    return null;
  })();

  const isYouTube = !isLocal && youtubeId !== null;
  const isHls = !isLocal && (url.toLowerCase().includes('.m3u8') || url.toLowerCase().includes('/m3u8'));
  const isEmbed = !isLocal && !isYouTube && !isHls && (
    url.toLowerCase().includes('/embed/') || 
    url.toLowerCase().includes('vidsrc') || 
    url.toLowerCase().includes('player') || 
    url.toLowerCase().includes('embed') ||
    url.toLowerCase().includes('iframe')
  );

  // Initialize refs to initial props to prevent boot-up loops
  const lastEmittedTime = useRef(time);
  const lastEmittedState = useRef<boolean | null>(playing);

  // Use refs to avoid stale closures in YouTube callbacks
  const playingRef = useRef(playing);
  const timeRef = useRef(time);
  const onEndedRef = useRef(onEnded);

  // Sync props to refs on every render
  useEffect(() => {
    playingRef.current = playing;
    timeRef.current = time;
    onEndedRef.current = onEnded;
  }, [playing, time, onEnded]);

  // Load YouTube API with fallback polling and duplicate script checks
  useEffect(() => {
    const checkApi = () => {
      if (window.YT && window.YT.Player) {
        setIsApiReady(true);
        return true;
      }
      return false;
    };

    if (checkApi()) return;

    // Save previous callback to avoid overwriting other initializations
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (previousCallback) previousCallback();
      setIsApiReady(true);
    };

    // Fallback polling in case the script tag was cued but event didn't fire
    const interval = setInterval(() => {
      if (checkApi()) {
        clearInterval(interval);
      }
    }, 100);

    const scripts = Array.from(document.getElementsByTagName('script'));
    const hasScript = scripts.some(s => s.src.includes("youtube.com/iframe_api"));
    
    if (!hasScript) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    return () => {
      clearInterval(interval);
    };
  }, []);

  // Initialize/Update HLS player
  useEffect(() => {
    let hlsInstance: Hls | null = null;

    if (isHls && videoRef.current) {
      if (Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hlsInstance.loadSource(url);
        hlsInstance.attachMedia(videoRef.current);
        
        hlsInstance.on(Hls.Events.ERROR, function (_, data) {
          if (data.fatal) {
            switch (data.type) {
              case Hls.ErrorTypes.NETWORK_ERROR:
                console.error("HLS network error, trying to recover...");
                hlsInstance?.startLoad();
                break;
              case Hls.ErrorTypes.MEDIA_ERROR:
                console.error("HLS media error, trying to recover...");
                hlsInstance?.recoverMediaError();
                break;
              default:
                console.error("HLS fatal error:", data);
                break;
            }
          }
        });
      } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support (Safari)
        videoRef.current.src = url;
      }
    }

    return () => {
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [isHls, url]);

  // Initialize/Update YouTube Player
  useEffect(() => {
    if (isYouTube && isApiReady && youtubeId && ytContainerRef.current) {
      if (!playerRef.current) {
        playerRef.current = new window.YT.Player(ytContainerRef.current, {
          height: '100%', 
          width: '100%', 
          playerVars: { 
            'autoplay': 0, 
            'controls': 1, 
            'origin': window.location.origin,
            'rel': 0
          },
          events: {
            'onReady': () => {
              try {
                if (playerRef.current) {
                  const targetTime = timeRef.current;
                  const targetPlaying = playingRef.current;

                  // Set the tracking refs to match initial sync values
                  lastEmittedTime.current = targetTime;
                  lastEmittedState.current = targetPlaying;

                  if (targetPlaying) {
                    playerRef.current.loadVideoById({
                      videoId: youtubeId,
                      startSeconds: targetTime
                    });
                  } else {
                    playerRef.current.cueVideoById({
                      videoId: youtubeId,
                      startSeconds: targetTime
                    });
                  }
                }
              } catch (e) {
                console.error("Error in onReady:", e);
              }
            },
            'onStateChange': (event: any) => {
              try {
                const state = event.data;
                if (!playerRef.current || typeof playerRef.current.getCurrentTime !== 'function') return;
                
                // If ended (0), fire onEnded callback
                if (state === 0) {
                  if (onEndedRef.current) onEndedRef.current();
                  return;
                }

                // We only care about playing (1) and paused (2) transitions.
                if (state !== 1 && state !== 2) {
                  return;
                }

                const currentTime = playerRef.current.getCurrentTime();
                const isPlaying = state === 1;
                
                // Prevent duplicate emissions for the same state and very close timestamps
                if (lastEmittedState.current === isPlaying && Math.abs(lastEmittedTime.current - currentTime) < 2.0) {
                  return;
                }
                
                lastEmittedState.current = isPlaying;
                lastEmittedTime.current = currentTime;
                socket.emit('video_update', { isLocal: false, url, playing: isPlaying, time: currentTime });
              } catch (e) {
                console.error("Error in onStateChange:", e);
              }
            }
          }
        });
      }
    }
    
    return () => {
      // When unmounting or switching, destroy the player so it can be recreated clean
      if (playerRef.current) {
        try {
          if (typeof playerRef.current.destroy === 'function') {
            playerRef.current.destroy();
          }
        } catch (e) {
          console.error("Error destroying YouTube player:", e);
        }
        playerRef.current = null;
      }
    };
  }, [isYouTube, isApiReady, youtubeId]);

  // Sync YouTube state FROM SERVER
  useEffect(() => {
    if (isYouTube && playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
      try {
        const playerState = playerRef.current.getPlayerState();
        
        // Treat both playing (1) and buffering (3) as local playing to avoid loop playing calls
        const localPlaying = playerState === 1 || playerState === 3;
        const serverPlaying = playing;

        if (serverPlaying !== localPlaying) {
          lastEmittedState.current = serverPlaying;
          if (serverPlaying && typeof playerRef.current.playVideo === 'function') {
            playerRef.current.playVideo();
          } else if (!serverPlaying && typeof playerRef.current.pauseVideo === 'function') {
            playerRef.current.pauseVideo();
          }
        }

        // Only sync time if the player is NOT currently buffering to prevent lockups
        if (playerState !== 3) {
          const currentTime = typeof playerRef.current.getCurrentTime === 'function' 
            ? playerRef.current.getCurrentTime() 
            : 0;

          if (Math.abs(currentTime - time) > 3.0 && typeof playerRef.current.seekTo === 'function') {
            lastEmittedTime.current = time;
            playerRef.current.seekTo(time, true);
          }
        }
      } catch (e) {
        console.error("Error during sync update:", e);
      }
    }
  }, [isYouTube, playing, time]);

  // Periodic active sync update (every 5 seconds) to align peers and catch up late joiners
  useEffect(() => {
    if (!playing) return;

    const interval = setInterval(() => {
      try {
        if ((isLocal || !isYouTube) && videoRef.current && !videoRef.current.paused) {
          const currentTime = videoRef.current.currentTime;
          socket.emit('video_update', { isLocal: !!isLocal, time: currentTime });
        } else if (!isLocal && isYouTube && playerRef.current && typeof playerRef.current.getPlayerState === 'function') {
          const playerState = playerRef.current.getPlayerState();
          if (playerState === 1) { // Only emit time update if player is actively playing
            const currentTime = playerRef.current.getCurrentTime();
            lastEmittedTime.current = currentTime;
            socket.emit('video_update', { isLocal: false, url, playing: true, time: currentTime });
          }
        }
      } catch (e) {
        console.error("Error in periodic sync update:", e);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLocal, isYouTube, playing, url]);

  const emitLocalUpdate = (isPlaying: boolean) => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    if (lastEmittedState.current === isPlaying && Math.abs(lastEmittedTime.current - currentTime) < 1) return;
    lastEmittedState.current = isPlaying;
    lastEmittedTime.current = currentTime;
    socket.emit('video_update', { isLocal: !!isLocal, playing: isPlaying, time: currentTime });
  };

  useEffect(() => {
    if ((isLocal || !isYouTube) && videoRef.current) {
      const serverPlaying = playing;
      const localPlaying = !videoRef.current.paused;
      const currentTime = videoRef.current.currentTime;

      if (serverPlaying !== localPlaying) {
        lastEmittedState.current = serverPlaying;
        if (serverPlaying) videoRef.current.play().catch(() => {});
        else videoRef.current.pause();
      }
      if (Math.abs(currentTime - time) > 2) {
        lastEmittedTime.current = time;
        videoRef.current.currentTime = time;
      }
    }
  }, [isLocal, isYouTube, playing, time]);

  // Force YouTube controls to hide faster by shifting focus back to the parent page on mouse leave
  const handleMouseLeave = () => {
    try {
      window.focus();
      if (document.activeElement && document.activeElement.tagName === 'IFRAME') {
        (document.activeElement as HTMLElement).blur();
      }
    } catch (e) {
      // Ignore
    }
  };

  if (!url || url === 'LOCAL_WAITING' || url === 'LOCAL_FILE') {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', background: '#090a12', borderRadius: '8px' }}>
        <p style={{ textAlign: 'center', padding: '2rem' }}>
          {isLocal ? 'Please select your media folder to start synchronization...' : 'No online video loaded. Click "Change Video" to load a stream.'}
        </p>
      </div>
    );
  }

  return (
    <div 
      onMouseLeave={handleMouseLeave}
      style={{ position: 'relative', width: '100%', height: '100%', minHeight: '480px', background: '#000', borderRadius: '8px', overflow: 'hidden' }}
    >
      {isEmbed ? (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
          <iframe 
            src={url}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture"
          />
          <div style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            background: 'rgba(7, 9, 19, 0.85)',
            backdropFilter: 'blur(8px)',
            border: '1px solid var(--border)',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            zIndex: 10,
            pointerEvents: 'none'
          }}>
            ⚠️ Embed Mode: Auto-sync disabled. Extract & paste the direct .m3u8 stream link for full sync.
          </div>
        </div>
      ) : isLocal || !isYouTube ? (
        <video 
          ref={videoRef}
          src={isHls ? undefined : url}
          controls
          style={{ width: '100%', height: '100%' }}
          onPlay={() => emitLocalUpdate(true)}
          onPause={() => emitLocalUpdate(false)}
          onSeeked={() => emitLocalUpdate(!videoRef.current?.paused)}
          onEnded={onEnded}
        />
      ) : (
        <div ref={ytContainerRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
      )}
    </div>
  );
}
