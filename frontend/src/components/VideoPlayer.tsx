import { useEffect, useRef, useState } from 'react';
import { socket } from '../socket';

interface VideoPlayerProps {
  url: string;
  playing: boolean;
  time: number;
}

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

export default function VideoPlayer({ url, playing, time }: VideoPlayerProps) {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [youtubeId, setYoutubeId] = useState<string | null>(null);
  const isInternalChange = useRef(false);

  // Load YouTube API
  useEffect(() => {
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
  }, []);

  // Extract ID
  useEffect(() => {
    if (!url) return;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    const id = (match && match[2].length === 11) ? match[2] : null;
    setYoutubeId(id);
  }, [url]);

  // Initialize Player
  useEffect(() => {
    if (isApiReady && youtubeId && containerRef.current && !playerRef.current) {
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

            // YT.PlayerState.PLAYING = 1, PAUSED = 2
            if (state === 1) {
              socket.emit('video_update', { url, playing: true, time: currentTime });
            } else if (state === 2) {
              socket.emit('video_update', { url, playing: false, time: currentTime });
            }
          }
        }
      });
    }
    
    // Cleanup player if ID changes
    return () => {
      if (playerRef.current && playerRef.current.destroy) {
        // Only destroy if we are actually changing the video
      }
    };
  }, [isApiReady, youtubeId]);

  // Sync state from server
  useEffect(() => {
    if (playerRef.current && playerRef.current.getPlayerState) {
      const serverPlaying = playing;
      const localPlaying = playerRef.current.getPlayerState() === 1;
      const currentTime = playerRef.current.getCurrentTime();

      isInternalChange.current = true;

      // Sync playing state
      if (serverPlaying !== localPlaying) {
        if (serverPlaying) playerRef.current.playVideo();
        else playerRef.current.pauseVideo();
      }

      // Sync time
      if (Math.abs(currentTime - time) > 2) {
        playerRef.current.seekTo(time, true);
      }
    }
  }, [playing, time]);

  if (!url) {
    return (
      <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
        <p>Waiting for video URL...</p>
      </div>
    );
  }

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '100%', minHeight: '450px', background: '#000' }}>
      <div id="yt-player" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}></div>
    </div>
  );
}

