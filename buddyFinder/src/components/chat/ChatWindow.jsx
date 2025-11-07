import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getMessages, sendMessage } from '../../services/api';
import websocketService from '../../services/websocket';
import MessageBubble from './MessageBubble';
import { Send } from 'lucide-react';
import { showError } from '../../utils/toast';

function ChatWindow({ match }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (match?.matchId) {
      initializeChat();
    }
    return () => {
      if (match?.matchId) {
        websocketService.unsubscribeFromMatch(match.matchId);
      }
    };
  }, [match]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    setLoading(true);
    try {
      const response = await getMessages(match.matchId);
      setMessages(response.data);
      
      const token = localStorage.getItem('token');
      const isConnected = typeof websocketService.isConnected === 'function' 
        ? websocketService.isConnected() 
        : websocketService.client?.connected || false;
      
      if (!isConnected) {
        await websocketService.connect(token);
      }
      
      websocketService.subscribeToMatch(match.matchId, (newMessage) => {
        setMessages(prev => {
          const exists = prev.some(msg => msg.messageId === newMessage.messageId);
          if (exists) return prev;
          return [...prev, newMessage];
        });
      });

      setConnected(true);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
      showError('Failed to load messages');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
  if (!input.trim() || sending) return;
  const content = input.trim();
  setInput('');
  setSending(true);

  try {
    const response = await sendMessage({
      matchId: match.matchId,
      content
    });

    const optimisticMessage = {
      ...response.data,
      messageId: response.data.messageId || Date.now(),
      senderId: user.userId,
      senderName: user.name,
      timestamp: new Date().toISOString(),
      isRead: false
    };

    setMessages(prev => {
      const exists = prev.some(msg => 
        msg.messageId === optimisticMessage.messageId ||
        (msg.content === content && msg.senderId === user.userId)
      );
      if (exists) return prev;
      return [...prev, optimisticMessage];
    });

    setTimeout(scrollToBottom, 100);
  } catch (error) {
    console.error('Failed to send message:', error);
    // Don't show error toast here - api interceptor handles it
    setInput(content); // Restore input
  } finally {
    setSending(false);
  }
};
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center" style={{ height: '600px' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div style={{ 
      height: '600px', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
      backdropFilter: 'blur(10px)',
      borderRadius: '24px',
      overflow: 'hidden'
    }}>
      <div style={{
        padding: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        flexShrink: 0
      }}>
        <h3 className="text-xl font-bold text-white">{match.name}</h3>
        <p className="text-white text-sm opacity-70">{match.location}</p>
      </div>

      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        minHeight: 0
      }}>
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white opacity-70">No messages yet. Say hi! 👋</p>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((msg) => (
              <MessageBubble 
                key={msg.messageId || `${msg.timestamp}-${msg.content}`}
                message={msg}
                isOwn={msg.senderId === user?.userId}
              />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.3)',
        flexShrink: 0
      }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!connected || sending}
            className="flex-1 p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
            placeholder={!connected ? "Connecting..." : sending ? "Sending..." : "Type a message..."}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !connected || sending}
            className="p-3 bg-white text-pink-500 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;