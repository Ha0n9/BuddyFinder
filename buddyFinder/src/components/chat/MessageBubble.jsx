// src/components/chat/MessageBubble.jsx
import { formatDistanceToNow } from 'date-fns';

function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? 'order-2' : 'order-1'}`}>
        <div
          className={`rounded-2xl p-3 ${
            isOwn
              ? 'bg-white text-pink-500 rounded-br-none'
              : 'bg-white bg-opacity-30 text-white rounded-bl-none'
          }`}
        >
          {!isOwn && (
            <p className="text-xs font-bold mb-1 opacity-80">{message.senderName}</p>
          )}
          <p className="break-words">{message.content}</p>
          <p className={`text-xs mt-1 ${isOwn ? 'text-pink-300' : 'text-white opacity-70'}`}>
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </p>
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;