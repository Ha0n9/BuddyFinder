// src/components/search/SwipeCard.jsx
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, MapPin, Dumbbell, User } from 'lucide-react';
import { useState } from 'react';

function SwipeCard({ user, onSwipe, style }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-30, 0, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  // Parse photos from user profile
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const photos = parsePhotos(user.photos);
  const hasPhotos = photos.length > 0;

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe(info.offset.x > 0 ? 'like' : 'pass');
    }
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex(prev => prev + 1);
    }
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex(prev => prev - 1);
    }
  };

  return (
    <motion.div
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate, opacity, ...style }}
      className="absolute w-full h-[500px] cursor-grab active:cursor-grabbing"
    >
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden h-full">
        {/* Photo Section */}
        <div className="relative h-3/5 bg-gradient-to-br from-pink-300 to-orange-300">
          {hasPhotos ? (
            <>
              <img 
                src={photos[currentPhotoIndex]} 
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://via.placeholder.com/400x300?text=No+Photo';
                }}
              />
              
              {/* Photo Navigation */}
              {photos.length > 1 && (
                <>
                  {/* Dots Indicator */}
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

                  {/* Click Areas for Navigation */}
                  <div className="absolute inset-0 flex">
                    <div 
                      className="w-1/2 cursor-pointer" 
                      onClick={prevPhoto}
                    />
                    <div 
                      className="w-1/2 cursor-pointer" 
                      onClick={nextPhoto}
                    />
                  </div>

                  {/* Photo Counter */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
                    {currentPhotoIndex + 1} / {photos.length}
                  </div>
                </>
              )}

              {/* Verified Badge */}
              {user.isVerified && (
                <div className="absolute top-4 right-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                  ✓ Verified
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <User className="w-24 h-24 text-white opacity-50" />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-6 h-2/5 overflow-y-auto">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-gray-800">
              {user.name}, {user.age}
            </h2>
            {user.tier && user.tier !== 'FREE' && (
              <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                user.tier === 'PREMIUM' ? 'bg-purple-100 text-purple-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {user.tier}
              </span>
            )}
          </div>
          
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
            <span className="truncate">{user.location}</span>
          </div>

          {user.fitnessLevel && (
            <div className="flex items-center text-gray-600 mb-3">
              <Dumbbell className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{user.fitnessLevel}</span>
            </div>
          )}

          {user.interests && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-1">
                {user.interests.split(',').slice(0, 3).map((interest, index) => (
                  <span 
                    key={index}
                    className="bg-pink-100 text-pink-700 px-2 py-1 rounded-full text-xs"
                  >
                    {interest.trim()}
                  </span>
                ))}
              </div>
            </div>
          )}

          {user.bio && (
            <p className="text-gray-600 text-sm line-clamp-2">{user.bio}</p>
          )}

          {/* Additional Info */}
          <div className="mt-3 flex gap-2 text-xs text-gray-500">
            {user.zodiacSign && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                {user.zodiacSign}
              </span>
            )}
            {user.mbtiType && (
              <span className="bg-gray-100 px-2 py-1 rounded">
                {user.mbtiType}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Helper function to parse photos JSON
function parsePhotos(photosJson) {
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
}

export default SwipeCard;