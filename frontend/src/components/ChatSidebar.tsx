import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Copy, Users, Film } from 'lucide-react';
import { socket } from '../socket';

interface Message {
  user: string;
  text: string;
  time: string;
}

interface ChatSidebarProps {
  username: string;
  roomId?: string;
  isLocal?: boolean;
  usersCount?: number;
  onChangeVideoClick?: () => void;
}

export default function ChatSidebar({ 
  username, 
  roomId, 
  isLocal, 
  usersCount, 
  onChangeVideoClick 
}: ChatSidebarProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleNewMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on('chat_message', handleNewMessage);

    return () => {
      socket.off('chat_message', handleNewMessage);
    };
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    socket.emit('chat_message', input);
    setInput('');
  };

  const formatTime = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleCopyId = () => {
    if (roomId) {
      navigator.clipboard.writeText(roomId);
    }
  };

  return (
    <aside className="chat-sidebar">
      {/* Sleek dashboard header at the top of the sidebar */}
      <div style={{ 
        padding: '1.25rem', 
        borderBottom: '1px solid var(--border)', 
        background: 'rgba(0, 0, 0, 0.12)',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Room ID
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '2px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-main)' }}>{roomId}</span>
              <button 
                onClick={handleCopyId}
                style={{ 
                  background: 'rgba(255,255,255,0.04)', 
                  border: '1px solid var(--border)', 
                  padding: '4px 8px', 
                  borderRadius: '6px', 
                  fontSize: '0.7rem', 
                  boxShadow: 'none',
                  cursor: 'pointer'
                }}
              >
                <Copy size={11} /> Copy
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Status
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '4px', fontSize: '0.8rem', color: 'var(--text-main)', fontWeight: 600 }}>
              <Users size={13} style={{ color: 'var(--accent)' }} />
              <span>{usersCount || 1} online</span>
            </div>
          </div>
        </div>

        {/* Change Video button shown inline inside the sidebar for online mode */}
        {!isLocal && onChangeVideoClick && (
          <button 
            onClick={onChangeVideoClick} 
            style={{ 
              width: '100%', 
              padding: '0.55rem', 
              fontSize: '0.82rem', 
              borderRadius: '8px', 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              gap: '6px',
              fontWeight: 700
            }}
          >
            <Film size={13} /> Change Video Source
          </button>
        )}
      </div>

      <div className="chat-header" style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
        <div className="chat-header-title" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MessageSquare size={16} style={{ color: 'var(--accent)' }} />
          <h3 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Room Chat
          </h3>
        </div>
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => {
          const isSystem = msg.user === 'System';
          const isOwn = msg.user === username;

          return (
            <div 
              key={index} 
              className={`message ${isSystem ? 'system' : ''} ${isOwn ? 'own' : ''}`}
            >
              {!isSystem && (
                <div className="msg-info">
                  <span className="msg-user">{msg.user}</span>
                  <span className="msg-time">{formatTime(msg.time)}</span>
                </div>
              )}
              <div className="msg-bubble">
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input-area">
        <form onSubmit={sendMessage} className="chat-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
          />
          <button type="submit" disabled={!input.trim()}>
            <Send size={18} />
          </button>
        </form>
      </div>
    </aside>
  );
}
