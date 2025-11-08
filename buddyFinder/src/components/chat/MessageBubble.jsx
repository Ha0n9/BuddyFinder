import { formatDistanceToNow } from "date-fns";

function MessageBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-xs lg:max-w-md ${isOwn ? "order-2" : "order-1"}`}>
        <div
          className={`relative rounded-2xl px-4 py-3 transition-all duration-200 shadow-md
            ${
              isOwn
                ? "bg-gradient-to-r from-[#FF5F00] to-[#E05200] text-white font-medium rounded-br-none shadow-[0_0_15px_rgba(255,95,0,0.25)]"
                : "bg-[#1A1A1A] text-gray-200 border border-[#2A2A2A] rounded-bl-none"
            }`}
        >
          {!isOwn && (
            <p className="text-xs font-semibold text-gray-400 mb-1">
              {message.senderName}
            </p>
          )}

          {/* Nội dung tin nhắn */}
          <p className="break-words leading-relaxed tracking-wide">
            {message.content}
          </p>

          {/* Thời gian */}
          <p
            className={`text-[11px] mt-1 ${
              isOwn ? "text-[#FFD8C0]" : "text-gray-500"
            }`}
          >
            {formatDistanceToNow(new Date(message.timestamp), {
              addSuffix: true,
            })}
          </p>

          {/* Hiệu ứng glow nhẹ khi hover */}
          {isOwn && (
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#FF5F00]/30 to-[#E05200]/30 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
