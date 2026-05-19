import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare } from 'lucide-react';
import { socket } from '../socket';

interface Message {
  user: string;
  text: string;
  time: string;
}

export default function ChatSidebar({ username }: { username: string }) {
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

  return (
    <aside className="chat-sidebar">
      <div className="chat-header">
        <MessageSquare size={20} className="text-accent" />
        <h3>Room Chat</h3>
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
