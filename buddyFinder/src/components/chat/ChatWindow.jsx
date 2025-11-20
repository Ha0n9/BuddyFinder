import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getMessages } from '../../services/api';
import websocketService from '../../services/websocket';
import MessageBubble from './MessageBubble';
import { Send, User } from 'lucide-react';
import { showError } from '../../utils/toast';
import { encryptMatchMessage, decryptMatchMessage } from '../../utils/chatCrypto';
import { getPrimaryPhoto } from '../../utils/photoUtils';

function ChatWindow({ match }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);
  const typingStopTimeoutRef = useRef(null);
  const remoteTypingTimeoutRef = useRef(null);
  const typingActiveRef = useRef(false);

  useEffect(() => {
    if (match?.matchId) {
      initializeChat();
    }

    return () => {
      stopTyping();
      if (match?.matchId) {
        websocketService.unsubscribeFromMatch(match.matchId);
        websocketService.unsubscribeFromTyping(match.matchId);
      }
      if (typingStopTimeoutRef.current) {
        clearTimeout(typingStopTimeoutRef.current);
      }
      if (remoteTypingTimeoutRef.current) {
        clearTimeout(remoteTypingTimeoutRef.current);
      }
    };
  }, [match?.matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (remoteTyping) {
      scrollToBottom();
    }
  }, [remoteTyping]);

  const initializeChat = async () => {
    setLoading(true);
    setConnected(false);

    try {
      // 1. Load existing messages
      const response = await getMessages(match.matchId);
      const decrypted = (response.data || []).map((message) => ({
        ...message,
        content: decryptMatchMessage(match.matchId, message.content),
      }));
      setMessages(decrypted);
      
      // 2. Connect to WebSocket if not connected
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No auth token found');
      }

      if (!websocketService.isConnected()) {
        await websocketService.connect(token);
      }
      
      // 3. Subscribe to match chat
      subscriptionRef.current = websocketService.subscribeToMatch(
        match.matchId, 
        handleNewMessage
      );

      websocketService.subscribeToTyping(
        match.matchId,
        handleTypingEvent
      );

      if (subscriptionRef.current) {
        setConnected(true);
      } else {
        throw new Error('Failed to subscribe to match chat');
      }

    } catch (error) {
      console.error('❌ Failed to initialize chat:', error);
      showError('Failed to load chat. Please refresh.');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handle incoming WebSocket messages
   */
  const handleNewMessage = (incoming) => {
    const decryptedMessage = {
      ...incoming,
      content: decryptMatchMessage(match.matchId, incoming.content),
    };

    setMessages((prev) => {
      const exists = prev.some(
        (msg) =>
          msg.messageId === decryptedMessage.messageId ||
          (msg.content === decryptedMessage.content &&
            msg.senderId === decryptedMessage.senderId &&
            Math.abs(new Date(msg.timestamp) - new Date(decryptedMessage.timestamp)) < 1000)
      );

      if (exists) {
        return prev;
      }

      return [...prev, decryptedMessage];
    });
  };

  const handleTypingEvent = (event) => {
    if (!event || event.senderId === user?.userId) {
      return;
    }
    const isTyping = Boolean(event.typing);
    if (isTyping) {
      setRemoteTyping(true);
      if (remoteTypingTimeoutRef.current) {
        clearTimeout(remoteTypingTimeoutRef.current);
      }
      remoteTypingTimeoutRef.current = setTimeout(() => {
        setRemoteTyping(false);
      }, 3000);
    } else {
      setRemoteTyping(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const emitTypingState = (typing) => {
    if (!match?.matchId || !user?.userId) return;
    websocketService.sendTyping(match.matchId, user.userId, typing);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInput(value);

    if (!connected || !match?.matchId || !user?.userId) {
      return;
    }

    if (!typingActiveRef.current) {
      typingActiveRef.current = true;
      emitTypingState(true);
    }

    if (typingStopTimeoutRef.current) {
      clearTimeout(typingStopTimeoutRef.current);
    }

    typingStopTimeoutRef.current = setTimeout(() => {
      typingActiveRef.current = false;
      emitTypingState(false);
    }, 2000);
  };

  const stopTyping = () => {
    if (typingStopTimeoutRef.current) {
      clearTimeout(typingStopTimeoutRef.current);
      typingStopTimeoutRef.current = null;
    }
    if (typingActiveRef.current) {
      typingActiveRef.current = false;
      emitTypingState(false);
    }
  };

  /**
   * Send message via WebSocket
   */
  const handleSend = async () => {
    if (!input.trim() || sending || !connected) {
      return;
    }

    const content = input.trim();
    setInput('');
    stopTyping();
    setSending(true);

    try {
      const encryptedPayload = encryptMatchMessage(match.matchId, content);
      websocketService.sendMessage(match.matchId, user.userId, encryptedPayload);

    } catch (error) {
      console.error('❌ Failed to send message:', error);
      console.error('❌ Error stack:', error.stack);
      showError('Failed to send message');
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

  const avatarUrl = getPrimaryPhoto(match?.photos, match?.profilePictureUrl);

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
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
        flexShrink: 0
      }}>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#2A2A2A] overflow-hidden flex items-center justify-center">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={match?.name || 'Match avatar'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/80?text=BF';
                  }}
                />
              ) : (
                <User className="w-6 h-6 text-white" />
              )}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{match.name}</h3>
              <p className="text-white text-sm opacity-70">{match.location}</p>
            </div>
          </div>
          {/* Connection status */}
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
            <span className="text-white text-sm">
              {connected ? 'Connected' : 'Disconnected'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages */}
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
            {messages.map((msg, index) => (
                <MessageBubble 
                  key={msg.messageId || `${msg.timestamp}-${index}`}
                  message={msg}
                  isOwn={msg.senderId === user?.userId}
                />
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
        {remoteTyping && (
          <div className="px-4 py-2 text-sm text-white opacity-80 flex items-center gap-2">
            <span className="animate-pulse">⚡ {match.name} is typing...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid rgba(255, 255, 255, 0.3)',
        flexShrink: 0
      }}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            disabled={!connected || sending}
            className="flex-1 p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
            placeholder={
              !connected 
                ? "Connecting..." 
                : sending 
                  ? "Sending..." 
                  : "Type a message..."
            }
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !connected || sending}
            className="p-3 bg-gradient-to-r from-[#FF5F00] to-[#E05200] text-white font-medium rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-6 h-6" />
          </button>
        </div>
        
        {/* Debug info */}
        <div className="mt-2 text-xs text-white opacity-50">
          Messages: {messages.length} | Match: {match.matchId} | User: {user?.userId}
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
