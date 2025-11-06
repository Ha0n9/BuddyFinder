// src/pages/ChatPage.jsx
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
      
      // Transform matches to include matchId
      const transformedMatches = response.data.map(match => ({
        ...match,
        matchId: match.userId, // Use userId as matchId for now
      }));
      
      setMatches(transformedMatches);
      
      if (transformedMatches.length > 0) {
        setSelectedMatch(transformedMatches[0]);
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 flex items-center justify-center px-4">
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-8 max-w-md text-center">
          <MessageCircle className="w-20 h-20 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Matches Yet</h2>
          <p className="text-white opacity-80">
            Start swiping to find workout buddies to chat with!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 py-12 px-4">
      <div className="max-w-6xl mx-auto h-[calc(100vh-8rem)]">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Messages</h1>
        
        <div className="grid md:grid-cols-3 gap-6 h-full">
          {/* Matches List */}
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6 overflow-hidden flex flex-col">
            <h2 className="text-xl font-bold text-white mb-4">Your Matches</h2>
            <div className="flex-1 overflow-y-auto space-y-2">
              {matches.map((match) => (
                <button
                  key={match.userId}
                  onClick={() => setSelectedMatch(match)}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedMatch?.userId === match.userId
                      ? 'bg-white bg-opacity-30'
                      : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-300 to-orange-300 rounded-full flex items-center justify-center mr-3">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate">{match.name}</p>
                      <p className="text-white text-sm opacity-70 truncate">
                        {match.location}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="md:col-span-2 h-full">
            {selectedMatch ? (
              <ChatWindow match={selectedMatch} />
            ) : (
              <div className="h-full bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl flex items-center justify-center">
                <p className="text-white opacity-70">Select a match to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;