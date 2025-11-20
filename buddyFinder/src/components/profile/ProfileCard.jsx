// src/components/profile/ProfileCard.jsx
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';
import { Edit, MapPin, Calendar, Clock8, Sparkles, Star, Zap } from 'lucide-react';

function ProfileCard({ verificationStatus }) {
  const { user } = useAuthStore();

  if (!user) return <p className="text-white">Loading...</p>;

  const isVerified = verificationStatus?.status === 'APPROVED';

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6">
      {/* Header with Avatar and Edit Button */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-20 h-20 rounded-2xl bg-white/10 overflow-hidden flex-shrink-0 border border-white/20">
          {user.profilePictureUrl ? (
            <img
              src={user.profilePictureUrl}
              alt={user.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name?.charAt(0)?.toUpperCase() || '?'}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-3xl font-bold text-white mb-1">{user.name}</h2>
          <p className="text-white opacity-80">{user.email}</p>
        </div>
        <Link
          to="/profile/edit"
          className="p-3 bg-white bg-opacity-30 rounded-full hover:bg-opacity-40 transition-colors"
        >
          <Edit className="w-5 h-5 text-white" />
        </Link>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-white bg-opacity-10 rounded-xl p-4">
          <p className="text-white opacity-70 text-sm mb-1">Age</p>
          <p className="text-white font-bold text-xl">{user.age || 'N/A'}</p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-xl p-4">
          <p className="text-white opacity-70 text-sm mb-1">Gender</p>
          <p className="text-white font-bold text-xl">{user.gender || 'N/A'}</p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-xl p-4">
          <p className="text-white opacity-70 text-sm mb-1">Fitness Level</p>
          <p className="text-white font-bold text-xl">{user.fitnessLevel || 'N/A'}</p>
        </div>
        <div className="bg-white bg-opacity-10 rounded-xl p-4">
          <p className="text-white opacity-70 text-sm mb-1">Tier</p>
          <p className="text-white font-bold text-xl">{user.tier || 'FREE'}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-3">
        <div className="flex items-start">
          <MapPin className="w-5 h-5 text-white mr-3 mt-1" />
          <div>
            <p className="text-white opacity-70 text-sm">Location</p>
            <p className="text-white font-medium">{user.location || 'Not set'}</p>
          </div>
        </div>

        <div className="flex items-start">
          <Zap className="w-5 h-5 text-white mr-3 mt-1" />
          <div>
            <p className="text-white opacity-70 text-sm">Interests</p>
            <p className="text-white font-medium">{user.interests || 'Not set'}</p>
          </div>
        </div>

        {user.availability && (
          <div className="flex items-start">
            <Clock8 className="w-5 h-5 text-white mr-3 mt-1" />
            <div>
              <p className="text-white opacity-70 text-sm">Availability</p>
              <p className="text-white font-medium">{user.availability}</p>
            </div>
          </div>
        )}

        {user.bio && (
          <div className="flex items-start">
            <Calendar className="w-5 h-5 text-white mr-3 mt-1" />
            <div>
              <p className="text-white opacity-70 text-sm">Bio</p>
              <p className="text-white font-medium">{user.bio}</p>
            </div>
          </div>
        )}
      </div>

      {(user.zodiacSign || user.mbtiType) && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {user.zodiacSign && (
            <div className="bg-white bg-opacity-10 rounded-xl p-4 flex items-center gap-3">
              <Star className="w-6 h-6 text-[#FF5F00]" />
              <div>
                <p className="text-white opacity-70 text-sm">Zodiac Sign</p>
                <p className="text-white font-semibold text-lg">{user.zodiacSign}</p>
              </div>
            </div>
          )}
          {user.mbtiType && (
            <div className="bg-white bg-opacity-10 rounded-xl p-4 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-[#FF5F00]" />
              <div>
                <p className="text-white opacity-70 text-sm">MBTI</p>
                <p className="text-white font-semibold text-lg">{user.mbtiType}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Verification Badge */}
      {isVerified && (
        <div className="mt-6 bg-green-500 bg-opacity-20 border border-green-300 rounded-lg p-3 flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
          <span className="text-white text-sm font-medium">Verified Account</span>
        </div>
      )}
    </div>
  );
}

export default ProfileCard;
