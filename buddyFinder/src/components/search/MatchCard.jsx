import { MapPin, Clock, Dumbbell, User, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';
import { getPrimaryPhoto } from '../../utils/photoUtils';

function MatchCard({ match, onRequest }) {
  const primaryPhoto = getPrimaryPhoto(match.photos, match.profilePictureUrl);
  const hasPhoto = Boolean(primaryPhoto);

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl shadow-[0_0_20px_rgba(255,95,0,0.15)] overflow-hidden hover:shadow-[0_0_25px_rgba(255,95,0,0.25)] transition-all duration-300 transform hover:-translate-y-1">
      <div className="md:flex">
        {/* Photo Section */}
        <div className="md:w-48 h-48 md:h-auto relative bg-[#0B0B0B] flex-shrink-0">
          {hasPhoto ? (
            <img
              src={primaryPhoto}
              alt={match.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://via.placeholder.com/200x200?text=No+Photo';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A]">
              <User className="w-20 h-20 text-[#FF5F00]/60" />
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            {match.isVerified && (
              <span className="bg-[#FF5F00] text-white px-2 py-1 rounded-full text-xs font-bold">
                ✓ Verified
              </span>
            )}
            {match.averageRating > 0 && (
              <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                <Star className="w-4 h-4 text-[#FF5F00]" />
                <span>{match.averageRating.toFixed(1)}</span>
                <span className="text-[10px] text-gray-300">
                  ({match.totalRatings || 0})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 flex-1 flex flex-col text-white">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-extrabold text-[#FF5F00]">
                {match.name}, {match.age}
              </h3>
              {match.averageRating > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-300 mt-2">
                  <span className="text-xs uppercase text-gray-500">Average Rating:</span>
                  <Star className="w-4 h-4 text-[#FF5F00]" />
                  <span className="font-semibold">{match.averageRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">
                    ({match.totalRatings || 0})
                  </span>
                </div>
              )}
              {match.fitnessLevel && (
                <span className="inline-block px-2 py-1 bg-[#FF5F00]/20 text-[#FF5F00] text-xs font-semibold rounded-full mt-1">
                  {match.fitnessLevel}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            {match.location && (
              <div className="flex items-center text-gray-400 text-sm">
                <MapPin className="w-4 h-4 mr-2 text-[#FF5F00]" />
                <span className="truncate">{match.location}</span>
              </div>
            )}

            {match.interests && (
              <div className="flex items-start text-gray-400 text-sm">
                <Dumbbell className="w-4 h-4 mr-2 text-[#FF5F00]" />
                <div className="flex flex-wrap gap-1">
                  {match.interests
                    .split(',')
                    .slice(0, 4)
                    .map((interest, index) => (
                      <span
                        key={index}
                        className="bg-[#1A1A1A] border border-[#2A2A2A] text-gray-300 px-2 py-0.5 rounded-full text-xs"
                      >
                        {interest.trim()}
                      </span>
                    ))}
                </div>
              </div>
            )}

            {match.availability && (
              <div className="flex items-center text-gray-400 text-sm">
                <Clock className="w-4 h-4 mr-2 text-[#FF5F00]" />
                <span className="truncate">{match.availability}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {match.bio && (
            <p className="text-gray-400 text-sm mb-4 line-clamp-2">
              {match.bio}
            </p>
          )}

          {/* Additional Info */}
          <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
            {match.zodiacSign && (
              <span className="bg-[#1A1A1A] border border-[#2A2A2A] px-2 py-1 rounded">
                {match.zodiacSign}
              </span>
            )}
            {match.mbtiType && (
              <span className="bg-[#1A1A1A] border border-[#2A2A2A] px-2 py-1 rounded">
                {match.mbtiType}
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2 mt-auto">
            {/* View Profile */}
            <Link to={`/user/${match.userId || match.id}`} className="flex-1">
              <button className="w-full bg-[#1A1A1A] border border-[#2A2A2A] text-gray-300 font-semibold py-2 rounded-lg hover:border-[#FF5F00] hover:text-[#FF5F00] transition-all flex items-center justify-center gap-2">
                View Profile
              </button>
            </Link>

            {/* Match (Like) */}
            <Button
              onClick={() => onRequest(match.userId || match.id)}
              className="flex-1 bg-[#FF5F00] text-white font-bold py-2 rounded-lg hover:shadow-[0_0_15px_rgba(255,95,0,0.5)] transition-all flex items-center justify-center gap-2"
            >
              Match
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;
