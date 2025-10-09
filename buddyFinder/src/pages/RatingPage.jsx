import { useState, useEffect } from 'react';
import { getMatches } from '../services/api';
import RatingForm from '../components/rating/RatingForm';

function RatingPage() {
  const [matches, setMatches] = useState([]);
  const [selectedBuddy, setSelectedBuddy] = useState(null);

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
        <h2 className="text-xl font-bold mb-4">Your Buddies</h2>
        {matches.map((buddy) => (
          <div
            key={buddy.id}
            onClick={() => setSelectedBuddy(buddy)}
            className={`p-2 cursor-pointer ${selectedBuddy?.id === buddy.id ? 'bg-blue-100' : ''}`}
          >
            {buddy.name}
          </div>
        ))}
      </div>
      <div className="w-3/4 pl-4">
        {selectedBuddy ? (
          <RatingForm buddyId={selectedBuddy.id} buddyName={selectedBuddy.name} />
        ) : (
          <p className="text-gray-500">Select a buddy to rate</p>
        )}
      </div>
    </div>
  );
}

export default RatingPage;