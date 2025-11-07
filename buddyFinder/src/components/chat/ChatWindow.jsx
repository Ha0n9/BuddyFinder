// src/components/chat/ChatWindow.jsx
import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getMessages, sendMessage } from '../../services/api';
import websocketService from '../../services/websocket';
import MessageBubble from './MessageBubble';
import { Send } from 'lucide-react';

function ChatWindow({ match }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

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

  // ✅ FIX: Auto-focus input when chat is ready
  useEffect(() => {
    if (!loading && connected) {
      inputRef.current?.focus();
    }
  }, [loading, connected]);

  const initializeChat = async () => {
    setLoading(true);

    try {
      // 1. Fetch existing messages
      const response = await getMessages(match.matchId);
      setMessages(response.data);
      console.log('📬 Loaded', response.data.length, 'messages');

      // 2. Connect WebSocket
      const token = localStorage.getItem('token');

      // Check if websocketService has the method (backward compatibility)
      const isConnected = typeof websocketService.isConnected === 'function' 
        ? websocketService.isConnected() 
        : websocketService.client?.connected || false;

      if (!isConnected) {
        console.log('🔌 Connecting to WebSocket...');
        await websocketService.connect(token);
      } else {
        console.log('✅ WebSocket already connected');
      }

      // 3. Subscribe to this match's messages
      websocketService.subscribeToMatch(match.matchId, (newMessage) => {
        console.log('📩 New message received:', newMessage);

        // ✅ FIX: Always add new message to state
        setMessages(prev => {
          // Check if message already exists (prevent duplicates)
          const exists = prev.some(msg => msg.messageId === newMessage.messageId);
          if (exists) {
            console.log('⚠️ Message already exists, skipping');
            return prev;
          }
          console.log('✅ Adding message to state');
          return [...prev, newMessage];
        });
      });

      setConnected(true);
      console.log('✅ Chat initialized');
    } catch (error) {
      console.error('❌ Failed to initialize chat:', error);
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
    setInput(''); // Clear input immediately for better UX
    setSending(true);

    try {
      console.log('📤 Sending message:', content);

      // Send via REST API (persists to DB and broadcasts via WebSocket)
      const response = await sendMessage({
        matchId: match.matchId,
        content
      });

      console.log('✅ Message sent:', response.data);

      // ✅ FIX: Add optimistic update (show message immediately)
      const optimisticMessage = {
        ...response.data,
        messageId: response.data.messageId || Date.now(), // Fallback ID
        senderId: user.userId,
        senderName: user.name,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      setMessages(prev => {
        // Check if message already added by WebSocket
        const exists = prev.some(msg => 
          msg.messageId === optimisticMessage.messageId ||
          (msg.content === content && msg.senderId === user.userId)
        );

        if (exists) {
          console.log('⚠️ Message already in state (from WebSocket)');
          return prev;
        }

        console.log('➕ Adding optimistic message');
        return [...prev, optimisticMessage];
      });

      // Scroll to bottom
      setTimeout(scrollToBottom, 100);

      // ✅ FIX: Focus back to input for better UX
      setTimeout(() => {
        inputRef.current?.focus();
      }, 150);

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      alert('Failed to send message: ' + (error.response?.data?.message || error.message));
      setInput(content); // Restore input on error
      // Focus back to input even on error
      inputRef.current?.focus();
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
      <div className="h-full flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl overflow-hidden">
      {/* Header - Fixed height */}
      <div className="flex-shrink-0 p-4 border-b border-white border-opacity-30 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{match.name}</h3>
          <p className="text-white text-sm opacity-70">{match.location}</p>
        </div>
        {/* Connection status */}
        <div className="flex items-center gap-2">
          <div 
            className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} 
            title={connected ? 'Connected' : 'Disconnected'} 
          />
          <span className="text-white text-xs opacity-70">
            {connected ? 'Online' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Messages - Scrollable container with custom scrollbar */}
      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-white scrollbar-thumb-rounded scrollbar-track-transparent">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white opacity-70">No messages yet. Say hi! 👋</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble 
              key={msg.messageId || `${msg.timestamp}-${msg.content}`}
              message={msg}
              isOwn={msg.senderId === user?.userId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input - Fixed height */}
      <div className="flex-shrink-0 p-4 border-t border-white border-opacity-30 bg-white bg-opacity-5">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!connected || sending}
            className="flex-1 p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
            placeholder={
              !connected ? "Connecting..." :
              sending ? "Sending..." :
              "Type a message..."
            }
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

      {/* Debug info (development only) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="px-4 pb-2 text-xs text-white opacity-50">
          Messages: {messages.length} | Connected: {connected ? 'Yes' : 'No'} | Sending: {sending ? 'Yes' : 'No'}
        </div>
      )}
    </div>
  );
}

export default ChatWindow