// src/components/search/SwipeCard.jsx
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { Heart, X, MapPin, Dumbbell } from 'lucide-react';

function SwipeCard({ user, onSwipe, style }) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 0, 200], [-30, 0, 30]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);

  const handleDragEnd = (event, info) => {
    if (Math.abs(info.offset.x) > 100) {
      onSwipe(info.offset.x > 0 ? 'like' : 'pass');
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
        {/* Photo */}
        <div className="h-3/5 bg-gradient-to-br from-pink-300 to-orange-300 flex items-center justify-center">
          <Dumbbell className="w-24 h-24 text-white" />
        </div>

        {/* Info */}
        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            {user.name}, {user.age}
          </h2>
          
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="w-4 h-4 mr-1" />
            <span>{user.location}</span>
          </div>

          <div className="flex items-center text-gray-600 mb-3">
            <Dumbbell className="w-4 h-4 mr-1" />
            <span>{user.interests}</span>
          </div>

          <p className="text-gray-500 text-sm">{user.bio || 'No bio yet'}</p>
        </div>
      </div>
    </motion.div>
  );
}

export default SwipeCard;