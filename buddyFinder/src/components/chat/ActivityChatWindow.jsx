import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import websocketService from '../../services/websocket';
import { getGroupMessages, getGroupMembers, leaveGroupChat } from '../../services/api';
import GroupMessageBubble from './GroupMessageBubble';
import ReportModal from './ReportModal';
import { Users, LogOut, Send, Flag, User } from 'lucide-react';
import { showError, showSuccess } from '../../utils/toast';
import { encryptGroupMessage, decryptGroupMessage } from '../../utils/chatCrypto';

function ActivityChatWindow({ roomId, roomName, onLeave }) {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [sending, setSending] = useState(false);
  const [reportTarget, setReportTarget] = useState(null);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!roomId) return;

    let isMounted = true;
    const initialize = async () => {
      setLoading(true);
      try {
        const [messagesRes, membersRes] = await Promise.all([
          getGroupMessages(roomId),
          getGroupMembers(roomId),
        ]);

        if (!isMounted) return;
        const decryptedMessages = (messagesRes.data || []).map((message) => ({
          ...message,
          content: message.systemMessage
            ? message.content
            : decryptGroupMessage(roomId, message.content),
        }));

        setMessages(decryptedMessages);
        setMembers(membersRes.data || []);

        const token = localStorage.getItem('token');
        if (!websocketService.isConnected()) {
          await websocketService.connect(token);
        }

        const subscription = websocketService.subscribeToGroup(roomId, (message) => {
          const normalized = message.systemMessage
            ? message
            : {
                ...message,
                content: decryptGroupMessage(roomId, message.content),
              };
          setMessages((prev) => [...prev, normalized]);

          if (message.systemMessage) {
            getGroupMembers(roomId)
              .then((res) => setMembers(res.data || []))
              .catch((err) => console.error('Failed to refresh member list', err));
          }
        });

        if (subscription) {
          setConnected(true);
        }
      } catch (error) {
        console.error('Failed to initialize group chat:', error);
        showError('Unable to load group chat');
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
      websocketService.unsubscribeFromGroup(roomId);
    };
  }, [roomId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || sending || !connected) return;

    const content = input.trim();
    setSending(true);
    setInput('');

    try {
      const encrypted = encryptGroupMessage(roomId, content);
      websocketService.sendGroupMessage(roomId, user?.userId, encrypted);
    } catch (error) {
      console.error('Failed to send group message:', error);
      showError('Failed to send message');
      setInput(content);
    } finally {
      setSending(false);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await leaveGroupChat(roomId);
      showSuccess('You left the group chat');
      onLeave?.();
    } catch (error) {
      console.error('Failed to leave group chat:', error);
      showError('Unable to leave group right now');
    }
  };

  const openReportModal = (member) => {
    if (!member || member.userId === user?.userId) return;
    setReportTarget(member);
    setReportModalOpen(true);
  };

  const closeReportModal = () => {
    setReportTarget(null);
    setReportModalOpen(false);
  };

  const goToProfile = (member) => {
    if (!member?.userId) return;
    navigate(`/user/${member.userId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[600px] bg-[#121212] border border-[#2A2A2A] rounded-3xl">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#FF5F00]" />
      </div>
    );
  }

  return (
    <div className="bg-[#121212] rounded-3xl border border-[#2A2A2A] shadow-[0_4px_30px_rgba(0,0,0,0.35)] h-[600px] flex flex-col overflow-hidden">
      <header className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A2A] bg-[#181818]">
        <div>
          <h3 className="text-2xl font-bold text-white">{roomName || 'Group Chat'}</h3>
          <p className="text-sm text-gray-400">{connected ? 'Connected' : 'Connecting...'}</p>
        </div>
        <button
          onClick={handleLeaveGroup}
          className="flex items-center gap-2 text-sm font-semibold text-red-400 hover:text-red-300"
        >
          <LogOut className="w-4 h-4" />
          Leave Group
        </button>
      </header>

      <div className="flex flex-1 min-h-0">
        <aside className="hidden md:flex w-60 flex-col border-r border-[#2A2A2A] bg-[#141414] p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-white">
              <Users className="w-5 h-5 text-[#FF5F00]" />
              <span className="text-sm font-semibold uppercase tracking-wide">Members</span>
            </div>
            <span className="text-xs text-gray-400">{members.length}</span>
          </div>
          <div className="flex-1 overflow-y-auto pr-1 space-y-2">
            {members.map((member) => (
              <div
                key={member.userId}
                className={`px-3 py-2 rounded-xl text-sm flex items-center justify-between gap-2 ${
                  member.userId === user?.userId
                    ? 'bg-[#FF5F00]/10 text-[#FF5F00]'
                    : 'bg-[#1F1F1F] text-gray-200'
                }`}
              >
                <span className="truncate">{member.name || member.email}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => goToProfile(member)}
                    className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
                    title="View profile"
                  >
                    <User className="w-4 h-4" />
                  </button>
                  {member.userId !== user?.userId && (
                    <button
                      type="button"
                      onClick={() => openReportModal(member)}
                      className="p-1 rounded-lg text-gray-400 hover:text-[#FF5F00] hover:bg-[#2A2A2A]"
                      title="Report member"
                    >
                      <Flag className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
            {members.length === 0 && (
              <p className="text-xs text-gray-500 text-center">No members yet</p>
            )}
          </div>
        </aside>

        <section className="flex-1 flex flex-col bg-[#101010] min-h-0">
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-3">
            {messages.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 text-sm">
                No messages yet. Be the first to say hi!
              </div>
            ) : (
              messages.map((message) => (
                <GroupMessageBubble
                  key={message.messageId || `${message.timestamp}-${message.senderId}`}
                  message={message}
                  currentUserId={user?.userId}
                />
              ))
            )}
            <div ref={bottomRef} />
          </div>

          <footer className="border-t border-[#2A2A2A] bg-[#161616] px-6 py-4">
            <div className="flex gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={connected ? 'Type a message...' : 'Connecting...'}
                disabled={!connected || sending}
                className="flex-1 p-3 rounded-2xl bg-[#1F1F1F] text-white placeholder-gray-500 border border-[#2A2A2A] focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
              />
              <button
                onClick={handleSend}
                disabled={!connected || sending || !input.trim()}
                className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#FF5F00] to-[#E05200] text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,95,0,0.4)] hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </footer>
        </section>
      </div>
      <ReportModal isOpen={reportModalOpen} onClose={closeReportModal} targetUser={reportTarget} />
    </div>
  );
}

export default ActivityChatWindow;
