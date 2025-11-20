import { useState, useEffect } from 'react';
import { searchBuddies, likeUser, passUser } from '../services/api';
import SwipeCard from '../components/search/SwipeCard';
import SearchFilters from '../components/search/SearchFilters';
import MatchCard from '../components/search/MatchCard';
import { X, RotateCcw, Sparkles, Sliders, Zap } from 'lucide-react';
import { showSuccess, showError } from '../utils/toast';

function SearchPage() {
  const [mode, setMode] = useState('swipe'); // 'swipe' or 'traditional'
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showMatchPopup, setShowMatchPopup] = useState(false);
  const [matchedUser, setMatchedUser] = useState(null);
  const [filters, setFilters] = useState({
    activity: '',
    location: '',
    time: '',
    mbtiType: '',
    zodiacSign: '',
    fitnessLevel: '',
    gender: '',
    latitude: null,
    longitude: null,
    radiusKm: null,
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async (searchFilters = {}, reset = true) => {
    setLoading(true);
    try {
      const response = await searchBuddies(searchFilters);
      setUsers(response.data);
      setFilteredUsers(response.data);
      if (reset) {
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      showError('Failed to load users');
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
        if (response.data.message && response.data.message.includes('match')) {
          setMatchedUser(currentUser);
          setShowMatchPopup(true);
          setTimeout(() => setShowMatchPopup(false), 3000);
        }
      } else {
        await passUser(currentUser.userId || currentUser.id);
      }
    } catch (error) {
      console.error('Swipe error:', error);
    }

    setCurrentIndex((prev) => prev + 1);

    const remaining = users.length - (currentIndex + 1);
    if (remaining <= 2) {
      fetchUsers(filters, false);
    }
  };

  const handleLike = () => handleSwipe('like');
  const handlePass = () => handleSwipe('pass');
  const handleRestart = () => {
    setCurrentIndex(0);
    fetchUsers();
  };

  const handleSendRequest = async (userId) => {
    try {
      await likeUser(userId);
      showSuccess('Buddy request sent!');
      fetchUsers(filters);
    } catch (error) {
      console.error('Failed to send request:', error);
      showError('Failed to send request');
    }
  };

  const handleSearch = (searchFilters) => {
    setFilters(searchFilters);
    fetchUsers(searchFilters);
  };

  // 🔸 Loading Screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF5F00] mx-auto mb-4"></div>
          <p className="text-[#FF5F00] text-xl font-bold">Finding your perfect buddy...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-8 px-4 text-white">
      {/* Match Popup */}
      {showMatchPopup && matchedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 animate-fadeIn">
          <div className="bg-[#1A1A1A] rounded-3xl p-8 max-w-md mx-4 text-center animate-scaleIn border border-[#FF5F00]/40">
            <div className="text-6xl mb-4">🔥</div>
            <h2 className="text-3xl font-bold text-[#FF5F00] mb-2">It's a Match!</h2>
            <p className="text-gray-300 mb-6">
              You and <span className="font-bold text-[#FF5F00]">{matchedUser.name}</span> liked each other!
            </p>
            <button
              onClick={() => setShowMatchPopup(false)}
              className="bg-[#FF5F00] hover:bg-[#ff7133] text-white px-8 py-3 rounded-full font-bold shadow-[0_4px_12px_rgba(255,95,0,0.4)] transition-all"
            >
              Keep Swiping
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        {/* Header + Mode Toggle */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#FF5F00] mb-4">
            Find Your Buddy
          </h1>

          <div className="flex justify-center gap-3 mb-4">
            <button
              onClick={() => setMode('swipe')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                mode === 'swipe'
                  ? 'bg-[#FF5F00] text-white shadow-[0_0_15px_rgba(255,95,0,0.5)]'
                  : 'bg-[#1A1A1A] text-gray-300 hover:text-white border border-[#2A2A2A]'
              }`}
            >
              <Zap className="w-5 h-5" />
              Swipe Mode
            </button>
            <button
              onClick={() => setMode('traditional')}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                mode === 'traditional'
                  ? 'bg-[#FF5F00] text-white shadow-[0_0_15px_rgba(255,95,0,0.5)]'
                  : 'bg-[#1A1A1A] text-gray-300 hover:text-white border border-[#2A2A2A]'
              }`}
            >
              <Sliders className="w-5 h-5" />
              Search Mode
            </button>
          </div>

          {mode === 'swipe' && (
            <p className="text-gray-400 text-sm">
              {users.length - currentIndex} buddies available
            </p>
          )}
        </div>

        {/* SWIPE MODE */}
        {mode === 'swipe' && (
          <>
            {currentIndex >= users.length ? (
              <div className="flex items-center justify-center">
                <div className="bg-[#1A1A1A] rounded-3xl p-8 text-center border border-[#2A2A2A]">
                  <Sparkles className="w-16 h-16 text-[#FF5F00] mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-white mb-2">
                    That's Everyone!
                  </h2>
                  <p className="text-gray-400 mb-6">
                    You've seen all available buddies. Check back later for more matches.
                  </p>
                  <button
                    onClick={handleRestart}
                    className="bg-[#FF5F00] hover:bg-[#ff7133] text-white px-8 py-3 rounded-full font-bold shadow-[0_4px_12px_rgba(255,95,0,0.4)] transition-all flex items-center justify-center mx-auto"
                  >
                    <RotateCcw className="mr-2 w-5 h-5" />
                    Start Over
                  </button>
                </div>
              </div>
            ) : (
              <div className="max-w-md mx-auto">
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
                        opacity: 1 - index * 0.2,
                      }}
                    />
                  ))}
                </div>

                {/* Buttons */}
                <div className="flex justify-center gap-8">
                  <button onClick={handlePass} className="group relative">
                    <div className="w-16 h-16 bg-[#1A1A1A] border-2 border-[#FF5F00] rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-200">
                      <X className="w-8 h-8 text-[#FF5F00]" strokeWidth={3} />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Pass
                    </span>
                  </button>

                  <button onClick={handleLike} className="group relative">
                    <div className="w-20 h-20 bg-[#FF5F00] hover:bg-[#ff7133] rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,95,0,0.4)] hover:scale-110 transition-transform duration-200">
                      <Zap className="w-10 h-10 text-white" strokeWidth={2} />
                    </div>
                    <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      Like
                    </span>
                  </button>
                </div>

                {currentIndex === 0 && (
                  <div className="mt-8 text-center text-gray-500 text-sm">
                    💡 Swipe right to like, left to pass
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* TRADITIONAL MODE */}
        {mode === 'traditional' && (
          <div className="grid md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <SearchFilters onSearch={handleSearch} />
            </div>

            <div className="md:col-span-2">
              <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6">
                <h2 className="text-2xl font-bold text-[#FF5F00] mb-6">
                  Matches ({filteredUsers.length})
                </h2>

                {filteredUsers.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Sparkles className="w-16 h-16 text-[#FF5F00] mx-auto mb-4 opacity-70" />
                    <p className="text-lg">No matches found</p>
                    <p className="text-sm text-gray-500 mt-2">
                      Try adjusting your filters
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto scrollbar-thin pr-2">
                    {filteredUsers.map((user) => (
                      <MatchCard
                        key={user.userId || user.id}
                        match={user}
                        onRequest={handleSendRequest}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchPage;
