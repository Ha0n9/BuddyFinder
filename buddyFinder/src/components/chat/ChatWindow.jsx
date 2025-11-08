// import { useState, useEffect, useRef } from 'react';
// import { useAuthStore } from '../../store/authStore';
// import { getMessages } from '../../services/api';
// import websocketService from '../../services/websocket';
// import MessageBubble from './MessageBubble';
// import { Send } from 'lucide-react';
// import { showError, showSuccess } from '../../utils/toast';

// function ChatWindow({ match }) {
//   const { user } = useAuthStore();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState('');
//   const [loading, setLoading] = useState(true);
//   const [connected, setConnected] = useState(false);
//   const [sending, setSending] = useState(false);
//   const messagesEndRef = useRef(null);
//   const subscriptionRef = useRef(null);

//   // Initialize chat when match changes
//   useEffect(() => {
//     if (match?.matchId) {
//       console.log('🎯 Initializing chat for match:', match.matchId);
//       initializeChat();
//     }

//     // Cleanup on unmount or match change
//     return () => {
//       if (match?.matchId) {
//         console.log('🧹 Cleaning up chat for match:', match.matchId);
//         websocketService.unsubscribeFromMatch(match.matchId);
//       }
//     };
//   }, [match?.matchId]);

//   // ✅ Auto-scroll to bottom when new messages arrive
//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const initializeChat = async () => {
//     setLoading(true);
//     setConnected(false);

//     try {
//       // 1. Load existing messages
//       console.log('📥 Loading messages for match:', match.matchId);
//       const response = await getMessages(match.matchId);
//       console.log('✅ Loaded messages:', response.data);
//       setMessages(response.data || []);
      
//       // 2. Connect to WebSocket if not connected
//       const token = localStorage.getItem('token');
//       if (!token) {
//         throw new Error('No auth token found');
//       }

//       if (!websocketService.isConnected()) {
//         console.log('🔌 Connecting to WebSocket...');
//         await websocketService.connect(token);
//         console.log('✅ WebSocket connected');
//       } else {
//         console.log('✅ WebSocket already connected');
//       }
      
//       // 3. Subscribe to match chat
//       console.log('📡 Subscribing to match:', match.matchId);
//       subscriptionRef.current = websocketService.subscribeToMatch(
//         match.matchId, 
//         handleNewMessage
//       );

//       if (subscriptionRef.current) {
//         setConnected(true);
//         console.log('✅ Successfully subscribed to match chat');
//       } else {
//         throw new Error('Failed to subscribe to match chat');
//       }

//     } catch (error) {
//       console.error('❌ Failed to initialize chat:', error);
//       showError('Failed to load chat. Please refresh.');
//       setConnected(false);
//     } finally {
//       setLoading(false);
//     }
//   };

//   /**
//    * Handle incoming WebSocket messages
//    */
//   const handleNewMessage = (newMessage) => {
//     console.log('📨 Received new message via WebSocket:', newMessage);
    
//     setMessages(prev => {
//       // Prevent duplicates
//       const exists = prev.some(msg => 
//         msg.messageId === newMessage.messageId ||
//         (msg.content === newMessage.content && 
//          msg.senderId === newMessage.senderId &&
//          Math.abs(new Date(msg.timestamp) - new Date(newMessage.timestamp)) < 1000)
//       );
      
//       if (exists) {
//         console.log('⚠️ Duplicate message, skipping');
//         return prev;
//       }
      
//       console.log('✅ Adding new message to state');
//       return [...prev, newMessage];
//     });
//   };

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   };

//   /**
//    * FIX: Send message via WebSocket instead of REST API
//    */
//   const handleSend = async () => {
//     if (!input.trim() || sending || !connected) {
//       console.log('⚠️ Cannot send:', { 
//         hasInput: !!input.trim(), 
//         sending, 
//         connected 
//       });
//       return;
//     }

//     const content = input.trim();
//     setInput('');
//     setSending(true);

//     try {
//       console.log('📤 Sending message via WebSocket...');
      
//       // Send via WebSocket (will be broadcast to all subscribers)
//       websocketService.sendMessage(match.matchId, user.userId, content);
      
//       console.log('✅ Message sent successfully');

//       // Note: We don't add optimistic message here
//       // The message will come back via WebSocket subscription
      
//     } catch (error) {
//       console.error('❌ Failed to send message:', error);
//       showError('Failed to send message');
//       setInput(content); // Restore input
//     } finally {
//       setSending(false);
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter' && !e.shiftKey) {
//       e.preventDefault();
//       handleSend();
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center" style={{ height: '600px' }}>
//         <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white"></div>
//       </div>
//     );
//   }

//   return (
//     <div style={{ 
//       height: '600px', 
//       display: 'flex', 
//       flexDirection: 'column',
//       backgroundColor: 'rgba(255, 255, 255, 0.2)',
//       backdropFilter: 'blur(10px)',
//       borderRadius: '24px',
//       overflow: 'hidden'
//     }}>
//       {/* Header */}
//       <div style={{
//         padding: '16px',
//         borderBottom: '1px solid rgba(255, 255, 255, 0.3)',
//         flexShrink: 0
//       }}>
//         <div className="flex items-center justify-between">
//           <div>
//             <h3 className="text-xl font-bold text-white">{match.name}</h3>
//             <p className="text-white text-sm opacity-70">{match.location}</p>
//           </div>
//           {/* Connection status */}
//           <div className="flex items-center gap-2">
//             <div className={`w-3 h-3 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`}></div>
//             <span className="text-white text-sm">
//               {connected ? 'Connected' : 'Disconnected'}
//             </span>
//           </div>
//         </div>
//       </div>

//       {/* Messages */}
//       <div style={{
//         flex: 1,
//         overflowY: 'auto',
//         padding: '16px',
//         minHeight: 0
//       }}>
//         {messages.length === 0 ? (
//           <div className="flex items-center justify-center h-full">
//             <p className="text-white opacity-70">No messages yet. Say hi! 👋</p>
//           </div>
//         ) : (
//           <div className="space-y-3">
//             {messages.map((msg, index) => (
//               <MessageBubble 
//                 key={msg.messageId || `${msg.timestamp}-${index}`}
//                 message={msg}
//                 isOwn={msg.senderId === user?.userId}
//               />
//             ))}
//             <div ref={messagesEndRef} />
//           </div>
//         )}
//       </div>

//       {/* Input */}
//       <div style={{
//         padding: '16px',
//         borderTop: '1px solid rgba(255, 255, 255, 0.3)',
//         flexShrink: 0
//       }}>
//         <div className="flex gap-2">
//           <input
//             type="text"
//             value={input}
//             onChange={(e) => setInput(e.target.value)}
//             onKeyPress={handleKeyPress}
//             disabled={!connected || sending}
//             className="flex-1 p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white disabled:opacity-50"
//             placeholder={
//               !connected 
//                 ? "Connecting..." 
//                 : sending 
//                   ? "Sending..." 
//                   : "Type a message..."
//             }
//           />
//           <button
//             onClick={handleSend}
//             disabled={!input.trim() || !connected || sending}
//             className="p-3 bg-white text-pink-500 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             <Send className="w-6 h-6" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ChatWindow;

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '../../store/authStore';
import { getMessages } from '../../services/api';
import websocketService from '../../services/websocket';
import MessageBubble from './MessageBubble';
import { Send } from 'lucide-react';
import { showError, showSuccess } from '../../utils/toast';

function ChatWindow({ match }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (match?.matchId) {
      console.log('🎯 Initializing chat for match:', match.matchId);
      initializeChat();
    }

    return () => {
      if (match?.matchId) {
        console.log('🧹 Cleaning up chat for match:', match.matchId);
        websocketService.unsubscribeFromMatch(match.matchId);
      }
    };
  }, [match?.matchId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    setLoading(true);
    setConnected(false);

    try {
      // 1. Load existing messages
      console.log('📥 Loading messages for match:', match.matchId);
      const response = await getMessages(match.matchId);
      console.log('✅ Loaded messages:', response.data);
      setMessages(response.data || []);
      
      // 2. Connect to WebSocket if not connected
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No auth token found');
      }

      if (!websocketService.isConnected()) {
        console.log('🔌 Connecting to WebSocket...');
        await websocketService.connect(token);
        console.log('✅ WebSocket connected');
      } else {
        console.log('✅ WebSocket already connected');
      }
      
      // 3. Subscribe to match chat
      console.log('📡 Subscribing to match:', match.matchId);
      subscriptionRef.current = websocketService.subscribeToMatch(
        match.matchId, 
        handleNewMessage
      );

      if (subscriptionRef.current) {
        setConnected(true);
        console.log('✅ Successfully subscribed to match chat');
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
  const handleNewMessage = (newMessage) => {
    console.log('📨 ========================================');
    console.log('📨 RECEIVED NEW MESSAGE VIA WEBSOCKET:');
    console.log('📨 Raw message:', JSON.stringify(newMessage, null, 2));
    console.log('📨 Message ID:', newMessage.messageId);
    console.log('📨 Sender ID:', newMessage.senderId);
    console.log('📨 Content:', newMessage.content);
    console.log('📨 Current user ID:', user?.userId);
    console.log('📨 ========================================');
    
    setMessages(prev => {
      console.log('📊 Current messages count:', prev.length);
      
      // Prevent duplicates
      const exists = prev.some(msg => 
        msg.messageId === newMessage.messageId ||
        (msg.content === newMessage.content && 
         msg.senderId === newMessage.senderId &&
         Math.abs(new Date(msg.timestamp) - new Date(newMessage.timestamp)) < 1000)
      );
      
      if (exists) {
        console.log('⚠️ Duplicate message detected, skipping');
        return prev;
      }
      
      console.log('✅ Adding new message to state');
      const updated = [...prev, newMessage];
      console.log('📊 New messages count:', updated.length);
      return updated;
    });
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  /**
   * Send message via WebSocket
   */
  const handleSend = async () => {
    console.log('📤 ========================================');
    console.log('📤 ATTEMPTING TO SEND MESSAGE');
    console.log('📤 Input:', input);
    console.log('📤 Sending:', sending);
    console.log('📤 Connected:', connected);
    console.log('📤 Match ID:', match.matchId);
    console.log('📤 User ID:', user?.userId);
    console.log('📤 ========================================');

    if (!input.trim() || sending || !connected) {
      console.log('⚠️ Cannot send:', { 
        hasInput: !!input.trim(), 
        sending, 
        connected 
      });
      return;
    }

    const content = input.trim();
    setInput('');
    setSending(true);

    try {
      console.log('📤 Calling websocketService.sendMessage()...');
      console.log('📤 Parameters:', {
        matchId: match.matchId,
        senderId: user.userId,
        content: content
      });
      
      // Send via WebSocket
      websocketService.sendMessage(match.matchId, user.userId, content);
      
      console.log('✅ Message sent via WebSocket');
      console.log('⏳ Waiting for broadcast response...');

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
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white">{match.name}</h3>
            <p className="text-white text-sm opacity-70">{match.location}</p>
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
            {messages.map((msg, index) => {
              console.log(`Rendering message ${index}:`, msg);
              return (
                <MessageBubble 
                  key={msg.messageId || `${msg.timestamp}-${index}`}
                  message={msg}
                  isOwn={msg.senderId === user?.userId}
                />
              );
            })}
            <div ref={messagesEndRef} />
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
            onChange={(e) => setInput(e.target.value)}
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