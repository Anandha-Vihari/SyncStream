import { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';

interface VideoPlayerProps {
  url: string;
  playing: boolean;
  time: number;
  isLocal?: boolean;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function VideoPlayer({ url, playing, time, isLocal }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const isInternalChange = useRef(false);

  // Load YouTube API
  useEffect(() => {
    if (isLocal) return;
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };
    } else {
      setIsApiReady(true);
    }
  }, [isLocal]);

  // Extract YouTube ID
  useEffect(() => {
    if (!url || isLocal) return;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    setYoutubeId(id);
  }, [url, isLocal]);

  // Initialize YouTube Player
  useEffect(() => {
    if (!isLocal && isApiReady && youtubeId && !playerRef.current) {
      playerRef.current = new window.YT.Player('yt-player', {
        height: '100%',
        width: '100%',
        videoId: youtubeId,
        playerVars: {
          'autoplay': 0,
          'controls': 1,
          'rel': 0,
          'modestbranding': 1,
          'enablejsapi': 1,
          'origin': window.location.origin
        },
        events: {
          'onStateChange': (event: any) => {
            if (isInternalChange.current) {
              isInternalChange.current = false;
              return;
            }
            const state = event.data;
            const currentTime = playerRef.current.getCurrentTime();
            if (state === 1) { // PLAYING
              socket.emit('video_update', { playing: true, time: currentTime });
            } else if (state === 2) { // PAUSED
              socket.emit('video_update', { playing: false, time: currentTime });
            }
          }
        }
      });
    }
  }, [isLocal, isApiReady, youtubeId]);

  // Sync YouTube state
  useEffect(() => {
    if (!isLocal && playerRef.current && playerRef.current.getPlayerState) {
      const serverPlaying = playing;
      const localPlaying = playerRef.current.getPlayerState() === 1;
      const currentTime = playerRef.current.getCurrentTime();

      isInternalChange.current = true;
      if (serverPlaying !== localPlaying) {
        if (serverPlaying) playerRef.current.playVideo();
        else playerRef.current.pauseVideo();
      }
      if (Math.abs(currentTime - time) > 2) {
        playerRef.current.seekTo(time, true);
      }
    }
  }, [isLocal, playing, time]);

  // Handle Local Video Events
  const handleLocalPlay = () => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (videoRef.current) {
      // In local mode, never emit the 'url' because it's a local blob: URL
      socket.emit('video_update', { playing: true, time: videoRef.current.currentTime });
    }
  };

  const handleLocalPause = () => {
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (videoRef.current) {
      socket.emit('video_update', { playing: false, time: videoRef.current.currentTime });
    }
  };

  const handleLocalSeek = () => {
    if (isInternalChange.current) return;
    if (videoRef.current) {
      socket.emit('video_update', { playing: !videoRef.current.paused, time: videoRef.current.currentTime });
    }
  };

  // Sync Local state
  useEffect(() => {
    if (isLocal && videoRef.current) {
      isInternalChange.current = true;
      if (playing && videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
      } else if (!playing && !videoRef.current.paused) {
        videoRef.current.pause();
      }

      if (Math.abs(videoRef.current.currentTime - time) > 2) {
        videoRef.current.currentTime = time;
      }
    }
  }, [isLocal, playing, time]);

  if (!url || url === 'LOCAL_WAITING' || url === 'LOCAL_FILE') {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', background: '#000', borderRadius: '8px' }}>
        <p>{isLocal ? 'Please select a local MP4 file...' : 'Waiting for video URL...'}</p>
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
          onPlay={handleLocalPlay}
          onPause={handleLocalPause}
          onSeeked={handleLocalSeek}
        />
      ) : (
        <div id="yt-player" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
      )}
    </div>
  );
}
