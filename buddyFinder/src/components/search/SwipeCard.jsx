import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Zap, X, MapPin, Dumbbell, User, Star } from 'lucide-react';
import { useState } from 'react';
import { parsePhotos } from '../../utils/photoUtils';

function SwipeCard({ user, onSwipe, style }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-25, 0, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const galleryPhotos = parsePhotos(user.photos);
  const photos =
    galleryPhotos.length > 0
      ? galleryPhotos
      : user.profilePictureUrl
      ? [user.profilePictureUrl]
      : [];
  const hasPhotos = photos.length > 0;

  const handleDragEnd = (_, info) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe(info.offset.x > 0 ? 'like' : 'pass');
    }
  };

  const nextPhoto = (e) => {
    e.stopPropagation();
    if (currentPhotoIndex < photos.length - 1) {
      setCurrentPhotoIndex((i) => i + 1);
    }
  };

  const prevPhoto = (e) => {
    e.stopPropagation();
    if (currentPhotoIndex > 0) {
      setCurrentPhotoIndex((i) => i - 1);
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
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-3xl shadow-[0_0_20px_rgba(255,95,0,0.15)] overflow-hidden h-full">
        {/* Photo Section */}
        <div className="relative h-3/5 bg-[#0B0B0B]">
          {hasPhotos ? (
            <>
              <img
                src={photos[currentPhotoIndex]}
                alt={user.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src =
                    'https://via.placeholder.com/400x300?text=No+Photo';
                }}
              />

              {/* Dots Indicator */}
              {photos.length > 1 && (
                <>
                  <div className="absolute top-3 left-0 right-0 flex justify-center gap-1">
                    {photos.map((_, index) => (
                      <div
                        key={index}
                        className={`h-1.5 rounded-full transition-all ${
                          index === currentPhotoIndex
                            ? 'bg-[#FF5F00] w-8'
                            : 'bg-[#FF5F00]/40 w-2'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Click Areas */}
                  <div className="absolute inset-0 flex">
                    <div className="w-1/2 cursor-pointer" onClick={prevPhoto} />
                    <div className="w-1/2 cursor-pointer" onClick={nextPhoto} />
                  </div>

                  {/* Photo Counter */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs">
                    {currentPhotoIndex + 1} / {photos.length}
                  </div>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
                {user.averageRating > 0 && (
                  <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-white shadow-[0_4px_12px_rgba(0,0,0,0.4)]">
                    <Star className="w-4 h-4 text-[#FF5F00]" />
                    <span>{user.averageRating.toFixed(1)}</span>
                    <span className="text-[10px] text-gray-300">
                      ({user.totalRatings || 0})
                    </span>
                  </div>
                )}
                {user.isVerified && (
                  <span className="bg-[#FF5F00] text-white px-3 py-1 rounded-full text-xs font-bold">
                    Verified
                  </span>
                )}
                {user.tier && user.tier !== 'FREE' && (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      user.tier === 'PREMIUM'
                        ? 'bg-[#FF5F00]/90 text-white'
                        : 'bg-yellow-500 text-black'
                    }`}
                  >
                    {user.tier}
                  </span>
                )}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#1A1A1A]">
              <User className="w-24 h-24 text-[#FF5F00]/50" />
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="p-6 h-2/5 overflow-y-auto text-white">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-2xl font-extrabold text-[#FF5F00]">
                {user.name}, {user.age}
              </h2>
              {user.averageRating > 0 && (
                <div className="flex items-center gap-1 text-sm text-gray-300 mt-1">
                  <span className="text-xs uppercase text-gray-500">Average Rating:</span>
                  <Star className="w-4 h-4 text-[#FF5F00]" />
                  <span className="font-semibold">{user.averageRating.toFixed(1)}</span>
                  <span className="text-xs text-gray-500">
                    ({user.totalRatings || 0})
                  </span>
                </div>
              )}
            </div>
            {user.tier && user.tier !== 'FREE' && (
              <span
                className={`px-2 py-1 rounded-full text-xs font-bold ${
                  user.tier === 'PREMIUM'
                    ? 'bg-[#FF5F00]/20 text-[#FF5F00]'
                    : 'bg-yellow-500/30 text-yellow-300'
                }`}
              >
                {user.tier}
              </span>
            )}
          </div>

          {user.location && (
            <div className="flex items-center text-gray-400 mb-1">
              <MapPin className="w-4 h-4 mr-2 text-[#FF5F00]" />
              <span className="truncate">{user.location}</span>
            </div>
          )}

          {user.fitnessLevel && (
            <div className="flex items-center text-gray-400 mb-2">
              <Dumbbell className="w-4 h-4 mr-2 text-[#FF5F00]" />
              <span>{user.fitnessLevel}</span>
            </div>
          )}

          {user.interests && (
            <div className="mb-3">
              <div className="flex flex-wrap gap-2">
                {user.interests
                  .split(',')
                  .slice(0, 3)
                  .map((interest, index) => (
                    <span
                      key={index}
                      className="bg-[#FF5F00]/15 text-[#FF5F00] px-3 py-1 rounded-full text-xs font-semibold"
                    >
                      {interest.trim()}
                    </span>
                  ))}
              </div>
            </div>
          )}

          {user.bio && (
            <p className="text-gray-400 text-sm line-clamp-2">{user.bio}</p>
          )}

          {/* Extra info */}
          <div className="mt-3 flex gap-2 text-xs text-gray-500">
            {user.zodiacSign && (
              <span className="bg-[#1A1A1A] border border-[#2A2A2A] px-2 py-1 rounded">
                {user.zodiacSign}
              </span>
            )}
            {user.mbtiType && (
              <span className="bg-[#1A1A1A] border border-[#2A2A2A] px-2 py-1 rounded">
                {user.mbtiType}
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}


export default SwipeCard;
