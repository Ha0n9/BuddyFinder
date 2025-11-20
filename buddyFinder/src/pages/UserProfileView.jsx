import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getUserById, likeUser, getRatingStats } from '../services/api';
import {
  ArrowLeft,
  MapPin,
  Dumbbell,
  Calendar,
  Star,
  X,
  MessageCircle,
  Zap,
} from 'lucide-react';
import { showError, showSuccess } from '../utils/toast';
import { useAuthStore } from '../store/authStore';

function UserProfileView() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuthStore();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [ratingStats, setRatingStats] = useState(null);
  const isViewingSelf = currentUser?.userId?.toString() === userId?.toString();

  useEffect(() => {
    fetchUser();
  }, [userId]);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const [userResponse, ratingResponse] = await Promise.all([
        getUserById(userId),
        getRatingStats(userId).catch(() => ({ data: null })),
      ]);
      setUser(userResponse.data);
      setRatingStats(ratingResponse?.data || null);
    } catch (error) {
      console.error('Failed to fetch user:', error);
      showError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const parsePhotos = (photosJson) => {
    if (!photosJson || photosJson === 'null' || photosJson === '[]') return [];
    try {
      if (typeof photosJson === 'string') return JSON.parse(photosJson);
      if (Array.isArray(photosJson)) return photosJson;
      return [];
    } catch {
      return [];
    }
  };

  const handleLike = async () => {
    if (isViewingSelf) return;
    try {
      const response = await likeUser(userId);
      if (response.data.message && response.data.message.includes('match')) {
        showSuccess("🔥 It's a match!");
        setTimeout(() => navigate('/chat'), 1500);
      } else {
        showSuccess('Workout request sent!');
        navigate('/search');
      }
    } catch (error) {
      console.error('Like error:', error);
      showError('Failed to send request');
    }
  };

  const handlePass = () => {
    if (isViewingSelf) return;
    navigate('/search');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF5F00]" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-center text-white">
        <h2 className="text-2xl font-bold mb-4">User not found</h2>
        <button
          onClick={() => navigate('/search')}
          className="bg-[#FF5F00] hover:bg-[#ff7133] text-white px-6 py-3 rounded-full font-bold shadow-[0_0_15px_rgba(255,95,0,0.4)] transition-all"
        >
          Back to Search
        </button>
      </div>
    );
  }

  const galleryPhotos = parsePhotos(user.photos);
  const displayPhotos =
    galleryPhotos.length > 0
      ? galleryPhotos
      : user.profilePictureUrl
      ? [user.profilePictureUrl]
      : [];
  const hasPhotos = displayPhotos.length > 0;
  const hasRatings = ratingStats && ratingStats.totalRatings > 0;

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-10 px-4 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-gray-400 hover:text-[#FF5F00] hover:bg-[#1A1A1A] rounded-full transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-extrabold text-[#FF5F00] tracking-tight">
            Athlete Profile
          </h1>
          <div className="w-10" />
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Photo Section */}
          <div className="bg-[#111111] border border-[#2A2A2A] rounded-3xl overflow-hidden shadow-[0_0_20px_rgba(255,95,0,0.1)]">
            <div className="relative h-96 bg-[#1A1A1A]">
              {hasPhotos ? (
                <>
                  <img
                    src={displayPhotos[currentPhotoIndex]}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src =
                        'https://via.placeholder.com/400x400?text=No+Photo';
                    }}
                  />

                  {/* Dots */}
                  {displayPhotos.length > 1 && (
                    <>
                      <div className="absolute top-4 left-0 right-0 flex justify-center gap-1">
                        {displayPhotos.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all ${
                              i === currentPhotoIndex
                                ? 'bg-[#FF5F00] w-8'
                                : 'bg-[#FF5F00]/40 w-2'
                            }`}
                          />
                        ))}
                      </div>

                      <div className="absolute inset-0 flex">
                        <div
                          className="w-1/2 cursor-pointer"
                          onClick={() =>
                            setCurrentPhotoIndex((i) => Math.max(0, i - 1))
                          }
                        />
                        <div
                          className="w-1/2 cursor-pointer"
                          onClick={() =>
                            setCurrentPhotoIndex((i) =>
                            Math.min(displayPhotos.length - 1, i + 1)
                            )
                          }
                        />
                      </div>

                      <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 px-2 py-1 rounded-full text-xs">
                        {currentPhotoIndex + 1}/{displayPhotos.length}
                      </div>
                    </>
                  )}

                  {/* Tier badge */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {user.isVerified && (
                      <span className="bg-[#FF5F00] text-white px-3 py-1 rounded-full text-xs font-bold">
                        Verified
                      </span>
                    )}
                    {user.tier && user.tier !== 'FREE' && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          user.tier === 'PREMIUM'
                            ? 'bg-[#FF5F00]/90'
                            : 'bg-yellow-500'
                        }`}
                      >
                        {user.tier}
                      </span>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-[#FF5F00]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-bold text-[#FF5F00]">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <p className="opacity-70">No photos available</p>
                  </div>
                </div>
              )}
            </div>

            {/* Buttons */}
            {!isViewingSelf && (
              <div className="p-6 flex gap-4">
                <button
                  onClick={handlePass}
                  className="flex-1 bg-[#1A1A1A] text-gray-400 py-3 rounded-xl font-bold hover:text-white hover:bg-[#2A2A2A] transition-all flex items-center justify-center gap-2"
                >
                  <X className="w-5 h-5" />
                  Skip
                </button>
                <button
                  onClick={handleLike}
                  className="flex-1 bg-[#FF5F00] hover:bg-[#ff7133] text-white py-3 rounded-xl font-bold shadow-[0_0_15px_rgba(255,95,0,0.4)] transition-all flex items-center justify-center gap-2"
                >
                  <Zap className="w-5 h-5" />
                  Connect
                </button>
              </div>
            )}
          </div>

          {/* Info Section */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-3xl p-6 shadow-[0_0_15px_rgba(255,95,0,0.05)]">
              <h2 className="text-3xl font-extrabold text-[#FF5F00] mb-2">
                {user.name}, {user.age}
              </h2>
              {user.gender && (
                <p className="text-gray-400 text-sm mb-4">{user.gender}</p>
              )}

              <div className="space-y-3">
                {user.location && (
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-5 h-5 mr-3 text-[#FF5F00]" />
                    <span>{user.location}</span>
                  </div>
                )}

                {user.fitnessLevel && (
                  <div className="flex items-center text-gray-300">
                    <Dumbbell className="w-5 h-5 mr-3 text-[#FF5F00]" />
                    <span>{user.fitnessLevel}</span>
                  </div>
                )}

                {user.availability && (
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-5 h-5 mr-3 text-[#FF5F00]" />
                    <span>{user.availability}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Rating Summary */}
            {ratingStats && (
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-3xl p-6 shadow-[0_0_15px_rgba(255,95,0,0.05)]">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#FF5F00]/20 flex items-center justify-center text-[#FF5F00]">
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm uppercase tracking-wide">Average Rating</p>
                      <p className="text-3xl font-extrabold text-white">
                        {ratingStats.averageRating?.toFixed(1) ?? '0.0'}
                      </p>
                    </div>
                  </div>
                  <div className="text-gray-400 text-sm">
                    {hasRatings
                      ? `${ratingStats.totalRatings} review${ratingStats.totalRatings > 1 ? 's' : ''}`
                      : 'No ratings yet'}
                  </div>
                </div>
                {hasRatings && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                    <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
                      <p className="text-gray-500 text-xs uppercase mb-1">Reliability</p>
                      <p className="text-white text-xl font-semibold">
                        {ratingStats.averageReliability?.toFixed(1)}
                      </p>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
                      <p className="text-gray-500 text-xs uppercase mb-1">Punctuality</p>
                      <p className="text-white text-xl font-semibold">
                        {ratingStats.averagePunctuality?.toFixed(1)}
                      </p>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-[#2A2A2A]">
                      <p className="text-gray-500 text-xs uppercase mb-1">Friendliness</p>
                      <p className="text-white text-xl font-semibold">
                        {ratingStats.averageFriendliness?.toFixed(1)}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bio */}
            {user.bio && (
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-3xl p-6">
                <h3 className="text-lg font-bold text-[#FF5F00] mb-3">About</h3>
                <p className="text-gray-300">{user.bio}</p>
              </div>
            )}

            {/* Interests */}
            {user.interests && (
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-3xl p-6">
                <h3 className="text-lg font-bold text-[#FF5F00] mb-3">
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {user.interests.split(',').map((i, idx) => (
                    <span
                      key={idx}
                      className="bg-[#FF5F00]/20 text-[#FF5F00] px-3 py-1 rounded-full text-sm font-semibold"
                    >
                      {i.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Info */}
            {(user.zodiacSign || user.mbtiType) && (
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-3xl p-6">
                <h3 className="text-lg font-bold text-[#FF5F00] mb-3">
                  More About Me
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {user.zodiacSign && (
                    <div>
                      <p className="text-gray-500 text-sm mb-1">
                        Zodiac Sign
                      </p>
                      <p className="text-white font-semibold">
                        {user.zodiacSign}
                      </p>
                    </div>
                  )}
                  {user.mbtiType && (
                    <div>
                      <p className="text-gray-500 text-sm mb-1">MBTI Type</p>
                      <p className="text-white font-semibold">{user.mbtiType}</p>
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
