import { useState, useEffect } from 'react';
import { getMatches } from '../services/api';
import ChatWindow from '../components/chat/ChatWindow';
import { MessageCircle, User } from 'lucide-react';

function ChatPage() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await getMatches();
      setMatches(response.data);
      if (response.data.length > 0) {
        setSelectedMatch(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🌀 Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF5F00]"></div>
      </div>
    );
  }

  // 🚫 No Matches Yet
  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 max-w-md text-center shadow-[0_0_20px_rgba(255,95,0,0.15)]">
          <MessageCircle className="w-20 h-20 text-[#FF5F00] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Matches Yet</h2>
          <p className="text-gray-400">
            Start swiping to find workout buddies to chat with!
          </p>
        </div>
      </div>
    );
  }

  // 💬 Main Chat Interface
  return (
    <div className="min-h-screen bg-[#0B0B0B] py-12 px-4 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#FF5F00] mb-8 text-center">
          Messages
        </h1>

        <div className="grid md:grid-cols-3 gap-6">
          {/* MATCHES LIST */}
          <div
            className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6"
            style={{ maxHeight: '600px', overflowY: 'auto' }}
          >
            <h2 className="text-xl font-bold text-[#FF5F00] mb-4">
              Your Matches
            </h2>

            <div className="space-y-2">
              {matches.map((match) => (
                <button
                  key={match.matchId}
                  onClick={() => setSelectedMatch(match)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedMatch?.matchId === match.matchId
                      ? 'bg-[#FF5F00]/20 border border-[#FF5F00] shadow-[0_0_15px_rgba(255,95,0,0.3)]'
                      : 'bg-[#2A2A2A]/40 hover:bg-[#2A2A2A]/70 border border-transparent'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#FF5F00] rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-[0_0_10px_rgba(255,95,0,0.4)]">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-semibold truncate">
                        {match.name}
                      </p>
                      <p className="text-gray-400 text-sm truncate">
                        {match.location}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* CHAT WINDOW */}
          <div className="md:col-span-2">
            {selectedMatch ? (
              <ChatWindow match={selectedMatch} />
            ) : (
              <div
                style={{ height: '600px' }}
                className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl flex items-center justify-center"
              >
                <p className="text-gray-400">Select a match to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
