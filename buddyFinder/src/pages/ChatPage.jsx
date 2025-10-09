import { useState, useEffect } from 'react';
import { getMatches } from '../services/api';
import ChatWindow from '../components/chat/ChatWindow';

function ChatPage() {
  const [matches, setMatches] = useState([]);
  const [selectedMatch, setSelectedMatch] = useState(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const response = await getMatches();
        setMatches(response.data);
      } catch (error) {
        console.error('Failed to fetch matches:', error);
      }
    };
    fetchMatches();
  }, []);

  return (
    <div className="container mx-auto p-4 flex">
      <div className="w-1/4 border-r pr-4">
        <h2 className="text-xl font-bold mb-4">Your Matches</h2>
        {matches.map((match) => (
          <div
            key={match.id}
            onClick={() => setSelectedMatch(match)}
            className={`p-2 cursor-pointer ${selectedMatch?.id === match.id ? 'bg-blue-100' : ''}`}
          >
            {match.name}
          </div>
        ))}
      </div>
      <div className="w-3/4 pl-4">
        {selectedMatch ? (
          <ChatWindow matchId={selectedMatch.id} matchName={selectedMatch.name} />
        ) : (
          <p className="text-gray-500">Select a match to start chatting</p>
        )}
      </div>
    </div>
  );
}

export default ChatPage;