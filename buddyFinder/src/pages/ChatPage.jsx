import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getMatches, getMyGroupChats } from '../services/api';
import ChatWindow from '../components/chat/ChatWindow';
import ActivityChatWindow from '../components/chat/ActivityChatWindow';
import { MessageCircle, User, Users, MoreHorizontal } from 'lucide-react';
import ReportModal from '../components/chat/ReportModal';

function ChatPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuConversationId, setMenuConversationId] = useState(null);
  const [reportTarget, setReportTarget] = useState(null);

  const fetchConversations = useCallback(async () => {
    setLoading(true);
    try {
      const [matchesResponse, groupRoomsResponse] = await Promise.all([
        getMatches(),
        getMyGroupChats(),
      ]);

      const matchItems = (matchesResponse.data || []).map((match) => ({
        id: `match-${match.matchId}`,
        type: 'match',
        title: match.name,
        subtitle: match.location || 'Direct chat',
        matchData: match,
      }));

      const groupItems = (groupRoomsResponse.data || []).map((room) => ({
        id: `group-${room.roomId}`,
        type: 'group',
        title: room.activityTitle || 'Group Chat',
        subtitle: 'Group chat',
        roomId: room.roomId,
        activityId: room.activityId,
      }));

      setConversations([...groupItems, ...matchItems]);
    } catch (error) {
      console.error('Failed to load chats:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  useEffect(() => {
    const handler = () => setMenuConversationId(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  useEffect(() => {
    if (loading) return;

    if (conversations.length === 0) {
      if (selectedConversation) {
        setSelectedConversation(null);
      }
      return;
    }

    const typeParam = searchParams.get('type');
    const roomParam = searchParams.get('room');
    const matchParam = searchParams.get('matchId');

    let targetConversation = null;

    if (typeParam === 'group' && roomParam) {
      targetConversation = conversations.find(
        (conversation) => conversation.type === 'group' && String(conversation.roomId) === roomParam
      );
    } else if (typeParam === 'match' && matchParam) {
      targetConversation = conversations.find(
        (conversation) =>
          conversation.type === 'match' &&
          String(conversation.matchData?.matchId) === matchParam
      );
    }

    if (targetConversation) {
      if (selectedConversation?.id !== targetConversation.id) {
        setSelectedConversation(targetConversation);
      }
      return;
    }

    const stillExists = conversations.some(
      (conversation) => conversation.id === selectedConversation?.id
    );

    if (!stillExists) {
      setSelectedConversation(conversations[0]);
    }
  }, [loading, conversations, searchParams, selectedConversation]);

  const updateSearchParams = (conversation) => {
    const params = new URLSearchParams();
    if (conversation.type === 'group') {
      params.set('type', 'group');
      params.set('room', conversation.roomId);
    } else {
      params.set('type', 'match');
      params.set('matchId', conversation.matchData?.matchId);
    }
    setSearchParams(params);
  };

  const handleSelectConversation = (conversation) => {
    setMenuConversationId(null);
    setSelectedConversation(conversation);
    updateSearchParams(conversation);
  };

  const handleGroupLeave = async () => {
    setSelectedConversation(null);
    setSearchParams({});
    await fetchConversations();
  };

  // 🌀 Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF5F00]"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 max-w-md text-center shadow-[0_0_20px_rgba(255,95,0,0.15)]">
          <MessageCircle className="w-20 h-20 text-[#FF5F00] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Chats Yet</h2>
          <p className="text-gray-400">
            Join an activity or match with a buddy to start chatting.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="min-h-screen bg-[#0B0B0B] py-12 px-4 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#FF5F00] mb-8 text-center">
          Messages
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* CONVERSATION LIST */}
          <div
            className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6"
            style={{ maxHeight: '600px', overflowY: 'auto' }}
          >
            <h2 className="text-xl font-bold text-[#FF5F00] mb-4">
              Your Chats
            </h2>

            <div className="space-y-2">
              {conversations.map((conversation) => {
                const isActive = selectedConversation?.id === conversation.id;
                const isGroup = conversation.type === 'group';
                return (
                  <div key={conversation.id} className="relative">
                    <div
                      onClick={() => handleSelectConversation(conversation)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleSelectConversation(conversation);
                        }
                      }}
                      className={`cursor-pointer w-full text-left p-4 rounded-xl transition-all ${
                        isActive
                          ? 'bg-[#FF5F00]/20 border border-[#FF5F00] shadow-[0_0_15px_rgba(255,95,0,0.3)]'
                          : 'bg-[#2A2A2A]/40 hover:bg-[#2A2A2A]/70 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-[#FF5F00] rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-[0_0_10px_rgba(255,95,0,0.4)]">
                          {isGroup ? (
                            <Users className="w-6 h-6 text-white" />
                          ) : (
                            <User className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white font-semibold truncate">
                            {conversation.title}
                          </p>
                          <p className="text-gray-400 text-xs uppercase tracking-wide">
                            {isGroup ? 'Group Chat' : 'Match'}
                          </p>
                          <p className="text-gray-400 text-sm truncate">
                            {conversation.subtitle}
                          </p>
                        </div>
                        {conversation.type === 'match' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMenuConversationId((prev) =>
                                prev === conversation.id ? null : conversation.id
                              );
                            }}
                            className="ml-2 text-gray-400 hover:text-white p-1 rounded-full focus:outline-none"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    </div>
                    {menuConversationId === conversation.id && conversation.type === 'match' && (
                      <div className="absolute right-4 top-14 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-lg w-44 z-10">
                        <button
                          onClick={() => {
                            setMenuConversationId(null);
                            navigate(`/user/${conversation.matchData?.userId}`);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-white hover:bg-[#2A2A2A] rounded-t-xl"
                        >
                          View Profile
                        </button>
                        <button
                          onClick={() => {
                            setMenuConversationId(null);
                            setReportTarget(conversation.matchData);
                          }}
                          className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-[#2A2A2A] rounded-b-xl"
                        >
                          Report User
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div className="md:col-span-2">
            {selectedConversation ? (
              selectedConversation.type === 'group' ? (
                <ActivityChatWindow
                  roomId={selectedConversation.roomId}
                  roomName={selectedConversation.title}
                  onLeave={handleGroupLeave}
                />
              ) : (
                <ChatWindow match={selectedConversation.matchData} />
              )
            ) : (
              <div
                style={{ height: '600px' }}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl flex items-center justify-center"
              >
                <p className="text-gray-400">Select a chat to start messaging</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    <ReportModal
      isOpen={!!reportTarget}
      targetUser={reportTarget}
      onClose={() => setReportTarget(null)}
    />
    </>
  );
}

export default ChatPage;
