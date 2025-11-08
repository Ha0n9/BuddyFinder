// src/pages/UserProfileView.jsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, likeUser } from '../services/api';
import { ArrowLeft, MapPin, Dumbbell, Calendar, Star, Heart, X, MessageCircle } from 'lucide-react';
import { showError, showSuccess } from '../utils/toast';
import { useAuthStore } from '../store/authStore';

function UserProfileView() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const response = await getUserById(userId);
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      showError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const parsePhotos = (photosJson) => {
    if (!photosJson || photosJson === 'null' || photosJson === '[]') {
      return [];
    }
    try {
      if (typeof photosJson === 'string') {
        return JSON.parse(photosJson);
      }
      if (Array.isArray(photosJson)) {
        return photosJson;
      }
      return [];
    } catch (e) {
      console.error('Error parsing photos:', e);
      return [];
    }
  };

  const handleLike = async () => {
    try {
      const response = await likeUser(userId);
      if (response.data.message && response.data.message.includes('match')) {
        showSuccess("🎉 It's a match!");
        setTimeout(() => navigate('/chat'), 1500);
      } else {
        showSuccess('Like sent!');
        navigate('/search');
      }
    } catch (error) {
      console.error('Like error:', error);
      showError('Failed to send like');
    }
  };

  const handlePass = () => {
    navigate('/search');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">User not found</h2>
          <button
            onClick={() => navigate('/search')}
            className="bg-white text-pink-500 px-6 py-3 rounded-full font-bold"
          >
            Back to Search
          </button>
        </div>
      </div>
    );
  }

  const photos = parsePhotos(user.photos);
  const hasPhotos = photos.length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold text-white">Profile</h1>
          <div className="w-10"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Photos Section */}
          <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="relative h-96 bg-gradient-to-br from-pink-300 to-orange-300">
              {hasPhotos ? (
                <>
                  <img
                    src={photos[currentPhotoIndex]}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/400x400?text=No+Photo';
                    }}
                  />

                  {/* Photo Navigation */}
                  {photos.length > 1 && (
                    <>
                      <div className="absolute top-4 left-0 right-0 flex justify-center gap-1">
                        {photos.map((_, index) => (
                          <div
                            key={index}
                            className={`h-1 rounded-full transition-all ${
                              index === currentPhotoIndex
                                ? 'bg-white w-8'
                                : 'bg-white bg-opacity-50 w-1'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="absolute inset-0 flex">
                        <div
                          className="w-1/2 cursor-pointer"
                          onClick={() => setCurrentPhotoIndex(Math.max(0, currentPhotoIndex - 1))}
                        />
                        <div
                          className="w-1/2 cursor-pointer"
                          onClick={() => setCurrentPhotoIndex(Math.min(photos.length - 1, currentPhotoIndex + 1))}
                        />
                      </div>

                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                        {currentPhotoIndex + 1} / {photos.length}
                      </div>
                    </>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {user.isVerified && (
                      <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                        ✓ Verified
                      </span>
                    )}
                    {user.tier && user.tier !== 'FREE' && (
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.tier === 'PREMIUM' ? 'bg-purple-500 text-white' : 'bg-yellow-500 text-white'
                      }`}>
                        {user.tier}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-24 h-24 bg-white bg-opacity-30 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-bold">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="opacity-70">No photos</p>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="p-6 flex gap-4">
              <button
                onClick={handlePass}
                className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-300 transition-all flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Pass
              </button>
              <button
                onClick={handleLike}
                className="flex-1 bg-gradient-to-r from-pink-500 to-red-500 text-white py-3 rounded-xl font-bold hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Like
              </button>
            </div>
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-1">
                    {user.name}, {user.age}
                  </h2>
                  {user.gender && (
                    <p className="text-white opacity-80">{user.gender}</p>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {user.location && (
                  <div className="flex items-center text-white">
                    <MapPin className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>{user.location}</span>
                  </div>
                )}

                {user.fitnessLevel && (
                  <div className="flex items-center text-white">
                    <Dumbbell className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>{user.fitnessLevel}</span>
                  </div>
                )}

                {user.availability && (
                  <div className="flex items-center text-white">
                    <Calendar className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span>{user.availability}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Bio Card */}
            {user.bio && (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">About</h3>
                <p className="text-white opacity-90">{user.bio}</p>
              </div>
            )}

            {/* Interests Card */}
            {user.interests && (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">Interests</h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.split(',').map((interest, index) => (
                    <span
                      key={index}
                      className="bg-white bg-opacity-30 text-white px-3 py-1 rounded-full text-sm"
                    >
                      {interest.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info Card */}
            {(user.zodiacSign || user.mbtiType) && (
              <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6">
                <h3 className="text-lg font-bold text-white mb-3">More About Me</h3>
                <div className="grid grid-cols-2 gap-4">
                  {user.zodiacSign && (
                    <div>
                      <p className="text-white opacity-70 text-sm mb-1">Zodiac Sign</p>
                      <p className="text-white font-bold">{user.zodiacSign}</p>
                    </div>
                  )}
                  {user.mbtiType && (
                    <div>
                      <p className="text-white opacity-70 text-sm mb-1">MBTI Type</p>
                      <p className="text-white font-bold">{user.mbtiType}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfileView;