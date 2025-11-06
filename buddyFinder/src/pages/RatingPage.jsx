// src/pages/RatingPage.jsx
import { useState, useEffect } from 'react';
import { getMatches, getRatings } from '../services/api';
import RatingForm from '../components/rating/RatingForm';
import RatingList from '../components/rating/RatingList';
import { User } from 'lucide-react';

function RatingPage() {
  const [matches, setMatches] = useState([]);
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('rate'); // 'rate' or 'view'

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedBuddy) {
      fetchRatings(selectedBuddy.userId);
    }
  }, [selectedBuddy]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await getMatches();
      setMatches(response.data);
      if (response.data.length > 0) {
        setSelectedBuddy(response.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async (userId) => {
    try {
      const response = await getRatings(userId);
      setRatings(response.data);
    } catch (error) {
      console.error('Failed to fetch ratings:', error);
    }
  };

  const handleRatingSubmitted = () => {
    fetchRatings(selectedBuddy.userId);
    setView('view');
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
          <User className="w-20 h-20 text-white mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Matches Yet</h2>
          <p className="text-white opacity-80">
            Start swiping to find workout buddies to rate!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Rate Your Buddies</h1>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Buddies List */}
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Your Matches</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {matches.map((buddy) => (
                <button
                  key={buddy.userId}
                  onClick={() => setSelectedBuddy(buddy)}
                  className={`w-full text-left p-3 rounded-xl transition-all ${
                    selectedBuddy?.userId === buddy.userId
                      ? 'bg-white bg-opacity-30'
                      : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                  }`}
                >
                  <p className="text-white font-bold">{buddy.name}</p>
                  <p className="text-white text-sm opacity-70">{buddy.location}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="md:col-span-2">
            {/* Toggle View */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setView('rate')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  view === 'rate'
                    ? 'bg-white text-pink-500'
                    : 'bg-white bg-opacity-20 text-white'
                }`}
              >
                Rate Buddy
              </button>
              <button
                onClick={() => setView('view')}
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                  view === 'view'
                    ? 'bg-white text-pink-500'
                    : 'bg-white bg-opacity-20 text-white'
                }`}
              >
                View Ratings
              </button>
            </div>

            {/* Content */}
            {selectedBuddy && (
              view === 'rate' ? (
                <RatingForm 
                  buddy={selectedBuddy} 
                  onRatingSubmitted={handleRatingSubmitted}
                />
              ) : (
                <RatingList ratings={ratings} />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RatingPage;