// src/components/search/MatchCard.jsx
import { MapPin, Clock, Dumbbell, Heart, User, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

function MatchCard({ match, onRequest }) {
  // Parse photos
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

  const photos = parsePhotos(match.photos);
  const hasPhoto = photos.length > 0;

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="md:flex">
        {/* Photo Section */}
        <div className="md:w-48 h-48 md:h-auto relative bg-gradient-to-br from-pink-300 to-orange-300 flex-shrink-0">
          {hasPhoto ? (
            <img 
              src={photos[0]} 
              alt={match.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/200x200?text=No+Photo';
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-20 h-20 text-white opacity-50" />
            </div>
          )}
          
          {/* Badges */}
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            {match.isVerified && (
              <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                ✓ Verified
              </span>
            )}
            {match.tier && match.tier !== 'FREE' && (
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                match.tier === 'PREMIUM' ? 'bg-purple-500 text-white' : 'bg-yellow-500 text-white'
              }`}>
                {match.tier}
              </span>
            )}
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {match.name}, {match.age}
              </h3>
              {match.fitnessLevel && (
                <span className="inline-block px-2 py-1 bg-pink-100 text-pink-700 text-xs font-bold rounded-full mt-1">
                  {match.fitnessLevel}
                </span>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="space-y-2 mb-4">
            {match.location && (
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{match.location}</span>
              </div>
            )}

            {match.interests && (
              <div className="flex items-start text-gray-600 text-sm">
                <Dumbbell className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {match.interests.split(',').slice(0, 4).map((interest, index) => (
                    <span 
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs"
                    >
                      {interest.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {match.availability && (
              <div className="flex items-center text-gray-600 text-sm">
                <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                <span className="truncate">{match.availability}</span>
              </div>
            )}
          </div>

          {/* Bio */}
          {match.bio && (
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {match.bio}
            </p>
          )}

          {/* Additional Info */}
          <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
            {match.zodiacSign && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                {match.zodiacSign}
              </span>
            )}
            {match.mbtiType && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                {match.mbtiType}
              </span>
            )}
          </div>

          {/* Action Buttons - UPDATED SECTION */}
          <div className="flex gap-2 mt-auto">
            {/* View Profile Button */}
            <Link 
              to={`/user/${match.userId || match.id}`}
              className="flex-1"
            >
              <button className="w-full bg-gray-200 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-300 transition-all flex items-center justify-center gap-2">
                View Profile
              </button>
            </Link>

            {/* Like Button */}
            <Button 
              onClick={() => onRequest(match.userId || match.id)}
              className="flex-1 bg-blue-500 text-white font-bold py-2 rounded-lg hover:shadow-lg transition-all flex items-center justify-center gap-2"
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