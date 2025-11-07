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
      // 1. Fetch existing messages
      const response = await getMessages(match.matchId);
      setMessages(response.data);

      // 2. Connect WebSocket
      const token = localStorage.getItem('token');
      if (!websocketService.client?.connected) {
        await websocketService.connect(token);
      }
      
      // 3. Subscribe to this match's messages
      websocketService.subscribeToMatch(match.matchId, (newMessage) => {
        console.log('📩 New message received:', newMessage);
        setMessages(prev => [...prev, newMessage]);
      });

      setConnected(true);
    } catch (error) {
      console.error('Failed to initialize chat:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const content = input.trim();
    setInput('');

    try {
      // Send via REST API (persists to DB)
      const response = await sendMessage({
        matchId: match.matchId,
        content
      });

      // WebSocket will broadcast and update UI automatically
      // No need to manually add to messages array
      
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send message');
      setInput(content); // Restore input on error
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
    <div className="h-full flex flex-col bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl">
      {/* Header */}
      <div className="p-4 border-b border-white border-opacity-30 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold text-white">{match.name}</h3>
          <p className="text-white text-sm opacity-70">{match.location}</p>
        </div>
        {/* Connection status */}
        <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} 
             title={connected ? 'Connected' : 'Disconnected'} />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white opacity-70">No messages yet. Say hi! 👋</p>
          </div>
        ) : (
          messages.map((msg) => (
            <MessageBubble 
              key={msg.messageId} 
              message={msg}
              isOwn={msg.senderId === user?.userId}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-white border-opacity-30">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={!connected}
            className="flex-1 p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
            placeholder={connected ? "Type a message..." : "Connecting..."}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || !connected}
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