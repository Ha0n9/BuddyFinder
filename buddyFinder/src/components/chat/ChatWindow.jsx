import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/authStore';
import { onMessage, sendMessage, joinChat } from '../../services/socket';
import MessageBubble from './MessageBubble';
import Button from '../common/Button';

function ChatWindow({ matchId, matchName }) {
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    if (user) {
      joinChat(user.id);
      onMessage((message) => {
        if (message.matchId === matchId) {
          setMessages((prev) => [...prev, message]);
        }
      });
    }
  }, [user, matchId]);

  const handleSend = () => {
    if (input.trim()) {
      const message = {
        matchId,
        senderId: user.id,
        senderName: user.name,
        text: input,
        timestamp: new Date().toISOString(),
      };
      sendMessage(message);
      setMessages((prev) => [...prev, message]);
      setInput('');
    }
  };

  return (
    <div className="h-96 flex flex-col border rounded p-4">
      <h3 className="text-lg font-bold mb-2">Chat with {matchName}</h3>
      <div className="flex-1 overflow-y-auto">
        {messages.map((msg, index) => (
          <MessageBubble key={index} message={msg} />
        ))}
      </div>
      <div className="flex mt-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-l"
          placeholder="Type a message..."
        />
        <Button className="rounded-l-none" onClick={handleSend}>Send</Button>
      </div>
    </div>
  );
}

export default ChatWindow;