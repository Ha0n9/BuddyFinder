// src/pages/SearchPage.jsx
import { useState, useEffect } from 'react';
import { searchBuddies, likeUser, passUser } from '../services/api';
import SwipeCard from '../components/search/SwipeCard';
import { Heart, X, RotateCcw, Sparkles } from 'lucide-react';

function SearchPage() {
  const [users, setUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await searchBuddies({});
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSwipe = async (direction) => {
    if (currentIndex >= users.length) return;

    const currentUser = users[currentIndex];
    
    try {
      if (direction === 'like') {
        const response = await likeUser(currentUser.userId || currentUser.id);
        console.log('Like response:', response.data);
        
        // Check if it's a match
        if (response.data.message && response.data.message.includes('match')) {
          setMatchedUser(currentUser);
          setShowMatchPopup(true);
          setTimeout(() => setShowMatchPopup(false), 3000);
        }
      } else {
        await passUser(currentUser.userId || currentUser.id);
        console.log('Passed:', currentUser.name);
      }
    } catch (error) {
      console.error('Swipe error:', error);
    }

    setCurrentIndex(prev => prev + 1);
  };

  const handleLike = () => handleSwipe('like');
  const handlePass = () => handleSwipe('pass');
  const handleRestart = () => {
    setCurrentIndex(0);
    fetchUsers();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">Finding your perfect buddy...</p>
        </div>
      </div>
    );
  }

  // No more users
  if (currentIndex >= users.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-8 max-w-md">
            <Sparkles className="w-20 h-20 text-white mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-white mb-4">That's Everyone!</h2>
            <p className="text-white opacity-90 mb-6">
              You've seen all available buddies. Check back later for more matches!
            </p>
            <button 
              onClick={handleRestart}
              className="bg-white text-pink-500 px-8 py-4 rounded-full font-bold hover:shadow-2xl transform hover:scale-105 transition-all duration-200 flex items-center justify-center mx-auto"
            >
              <RotateCcw className="mr-2 w-5 h-5" />
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 py-8 px-4">
      {/* Match Popup */}
      {showMatchPopup && matchedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-8 max-w-md mx-4 text-center animate-scaleIn">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-3xl font-bold text-pink-500 mb-2">It's a Match!</h2>
            <p className="text-gray-600 mb-6">
              You and {matchedUser.name} liked each other!
            </p>
            <button
              onClick={() => setShowMatchPopup(false)}
              className="bg-gradient-to-r from-pink-500 to-orange-500 text-white px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
            >
              Keep Swiping
            </button>
          </div>
        </div>
      )}

      <div className="max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">
            Find Your Buddy
          </h1>
          <p className="text-white opacity-80">
            {users.length - currentIndex} buddies available
          </p>
        </div>

        {/* Card Stack */}
        <div className="relative h-[520px] mb-8">
          {users.slice(currentIndex, currentIndex + 3).map((user, index) => (
            <SwipeCard
              key={user.userId || user.id}
              user={user}
              onSwipe={index === 0 ? handleSwipe : () => {}}
              style={{
                zIndex: 10 - index,
                scale: 1 - index * 0.05,
                y: index * 10,
                opacity: 1 - index * 0.2
              }}
            />
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-8">
          <button
            onClick={handlePass}
            className="group relative"
          >
            <div className="w-16 h-16 bg-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200">
              <X className="w-8 h-8 text-red-500" strokeWidth={3} />
            </div>
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Pass
            </span>
          </button>

          <button
            onClick={handleLike}
            className="group relative"
          >
            <div className="w-20 h-20 bg-gradient-to-r from-pink-500 to-red-500 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-200">
              <Heart className="w-10 h-10 text-white" fill="currentColor" strokeWidth={2} />
            </div>
            <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">
              Like
            </span>
          </button>
        </div>

        {/* Instructions (first time) */}
        {currentIndex === 0 && (
          <div className="mt-8 text-center">
            <p className="text-white opacity-80 text-sm">
              💡 Swipe right to like, left to pass
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;