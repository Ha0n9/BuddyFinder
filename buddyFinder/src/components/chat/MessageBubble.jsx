import { useAuthStore } from '../../store/authStore';

function MessageBubble({ message }) {
  const { user } = useAuthStore();
  const isOwnMessage = message.senderId === user?.id;

  return (
    <div className={`mb-2 ${isOwnMessage ? 'text-right' : 'text-left'}`}>
      <div
        className={`inline-block p-2 rounded ${isOwnMessage ? 'bg-blue-100' : 'bg-gray-100'}`}
      >
        <p className="font-bold">{message.senderName}</p>
        <p>{message.text}</p>
        <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleTimeString()}</p>
      </div>
    </div>
  );
}

export default MessageBubble;