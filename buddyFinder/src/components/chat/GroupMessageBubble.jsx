import { formatDistanceToNow } from 'date-fns';

function GroupMessageBubble({ message, currentUserId }) {
  const isSystem = message.type === 'SYSTEM' || message.systemMessage;
  const isOwn = message.senderId === currentUserId;

  if (isSystem) {
    return (
      <div className="flex justify-center my-4">
        <div className="text-xs text-gray-400 uppercase tracking-wide bg-[#1A1A1A]/70 px-3 py-1 rounded-full">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-md rounded-2xl px-4 py-3 mb-3 shadow transition-all ${
          isOwn
            ? 'bg-gradient-to-r from-[#FF5F00] to-[#E05200] text-white rounded-br-none'
            : 'bg-[#1A1A1A] text-gray-100 border border-[#2A2A2A] rounded-bl-none'
        }`}
      >
        {!isOwn && (
          <p className="text-xs font-semibold text-gray-400 mb-1">
            {message.senderName || 'Member'}
          </p>
        )}
        <p className="break-words leading-relaxed">{message.content}</p>
        <p
          className={`text-[10px] mt-2 ${
            isOwn ? 'text-[#FFD8C0]' : 'text-gray-500'
          }`}
        >
          {message.timestamp
            ? formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })
            : 'Just now'}
        </p>
      </div>
    </div>
  );
}

export default GroupMessageBubble;
