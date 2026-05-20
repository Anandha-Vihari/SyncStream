import { useEffect, useRef, useState } from 'react';
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
  const [isApiReady, setIsApiReady] = useState(false);
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const lastEmittedTime = useRef(0);
  const lastEmittedState = useRef<boolean | null>(null);

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
      window.onYouTubeIframeAPIReady = () => setIsApiReady(true);
    } else {
      setIsApiReady(true);
    }
  }, []);

  // Extract YouTube ID when URL changes (only if not local)
  useEffect(() => {
    if (!url || isLocal) {
      setYoutubeId(null);
      return;
    }
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    setYoutubeId(id);
  }, [url, isLocal]);

  // Initialize/Update YouTube Player
  useEffect(() => {
    if (!isLocal && isApiReady && youtubeId) {
      if (!playerRef.current) {
        playerRef.current = new window.YT.Player('yt-player', {
          height: '100%', width: '100%', videoId: youtubeId,
          playerVars: { 'autoplay': 1, 'controls': 1, 'origin': window.location.origin },
          events: {
            'onStateChange': (event: any) => {
              const state = event.data;
              const currentTime = playerRef.current.getCurrentTime();
              const isPlaying = state === 1;
              if (lastEmittedState.current === isPlaying && Math.abs(lastEmittedTime.current - currentTime) < 1) return;
              if (state === 1 || state === 2) {
                lastEmittedState.current = isPlaying;
                lastEmittedTime.current = currentTime;
                socket.emit('video_update', { isLocal: false, url, playing: isPlaying, time: currentTime });
              } else if (state === 0 && onEnded) onEnded();
            }
          }
        });
      } else {
        // If player exists, just load the new video ID
        playerRef.current.loadVideoById(youtubeId);
      }
    }
    
    return () => {
      // We don't necessarily want to destroy the player every time, 
      // but if we switch TO local mode, we should stop it.
      if (isLocal && playerRef.current) {
        playerRef.current.pauseVideo();
      }
    };
  }, [isLocal, isApiReady, youtubeId, onEnded]);

  // Sync YouTube state FROM SERVER
  useEffect(() => {
    if (!isLocal && playerRef.current && playerRef.current.getPlayerState) {
      const serverPlaying = playing;
      const localPlaying = playerRef.current.getPlayerState() === 1;
      const currentTime = playerRef.current.getCurrentTime();

      if (serverPlaying !== localPlaying) {
        lastEmittedState.current = serverPlaying;
        if (serverPlaying) playerRef.current.playVideo();
        else playerRef.current.pauseVideo();
      }
      if (Math.abs(currentTime - time) > 2) {
        lastEmittedTime.current = time;
        playerRef.current.seekTo(time, true);
      }
    }
  }, [isLocal, playing, time]);

  const emitLocalUpdate = (isPlaying: boolean) => {
    if (!videoRef.current) return;
    const currentTime = videoRef.current.currentTime;
    if (lastEmittedState.current === isPlaying && Math.abs(lastEmittedTime.current - currentTime) < 1) return;
    lastEmittedState.current = isPlaying;
    lastEmittedTime.current = currentTime;
    socket.emit('video_update', { isLocal: true, playing: isPlaying, time: currentTime });
  };

  useEffect(() => {
    if (isLocal && videoRef.current) {
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
  }, [isLocal, playing, time]);

  if (!url || url === 'LOCAL_WAITING' || url === 'LOCAL_FILE') {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', background: '#111', borderRadius: '8px' }}>
        <p>{isLocal ? 'Please select your media folder...' : 'Select a video from the A2Z Course list...'}</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '450px', background: '#000', borderRadius: '8px', overflow: 'hidden' }}>
      {isLocal ? (
        <video 
          ref={videoRef}
          src={url}
          controls
          style={{ width: '100%', height: '100%' }}
          onPlay={() => emitLocalUpdate(true)}
          onPause={() => emitLocalUpdate(false)}
          onSeeked={() => emitLocalUpdate(!videoRef.current?.paused)}
          onEnded={onEnded}
        />
      ) : (
        <div id="yt-player" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
      )}
    </div>
  );
}
