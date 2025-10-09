import { useState } from 'react';
import SearchFilters from '../components/search/SearchFilters';
import MatchCard from '../components/search/MatchCard';
import { sendBuddyRequest } from '../services/api';

function SearchPage() {
  const [matches, setMatches] = useState([]);

  const handleSearch = (results) => {
    setMatches(results);
  };

  const handleRequest = async (buddyId) => {
    try {
      await sendBuddyRequest({ buddyId });
      alert('Buddy request sent!');
    } catch (error) {
      console.error('Failed to send buddy request:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Find Your Gym Buddy</h1>
      <SearchFilters onSearch={handleSearch} />
      <div className="mt-6">
        <h2 className="text-xl font-bold mb-4">Matches</h2>
        {matches.length === 0 ? (
          <p className="text-gray-500">No matches found. Try different filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((match) => (
              <MatchCard key={match.id} match={match} onRequest={handleRequest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;