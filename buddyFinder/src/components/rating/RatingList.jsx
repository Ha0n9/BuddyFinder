// src/components/rating/RatingList.jsx
import { Star, User } from 'lucide-react';

function RatingList({ ratings }) {
  if (!ratings || ratings.length === 0) {
    return (
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-8 text-center">
        <p className="text-white opacity-80">No ratings yet</p>
      </div>
    );
  }

  const averageRating = (ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length).toFixed(1);

  return (
    <div className="space-y-4">
      {/* Average Rating Card */}
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6 text-center">
        <div className="flex items-center justify-center mb-2">
          <Star className="w-12 h-12 fill-yellow-400 text-yellow-400" />
          <span className="text-5xl font-bold text-white ml-3">{averageRating}</span>
        </div>
        <p className="text-white opacity-80">
          Based on {ratings.length} {ratings.length === 1 ? 'review' : 'reviews'}
        </p>
      </div>

      {/* Individual Ratings */}
      <div className="space-y-3">
        {ratings.map((rating) => (
          <div 
            key={rating.ratingId} 
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4"
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white bg-opacity-30 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold">
                    {rating.fromUser?.name || 'Anonymous'}
                  </p>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rating.rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-white text-opacity-30'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-white text-xs opacity-70">
                {new Date(rating.createdAt).toLocaleDateString()}
              </span>
            </div>

            {rating.review && (
              <p className="text-white opacity-90 text-sm mb-3">{rating.review}</p>
            )}

            {/* Detailed Scores */}
            {(rating.reliabilityScore || rating.punctualityScore || rating.friendlinessScore) && (
              <div className="flex gap-3 text-xs">
                {rating.reliabilityScore && (
                  <div className="bg-white bg-opacity-10 rounded-full px-3 py-1">
                    <span className="text-white">Reliability: {rating.reliabilityScore}/5</span>
                  </div>
                )}
                {rating.punctualityScore && (
                  <div className="bg-white bg-opacity-10 rounded-full px-3 py-1">
                    <span className="text-white">Punctuality: {rating.punctualityScore}/5</span>
                  </div>
                )}
                {rating.friendlinessScore && (
                  <div className="bg-white bg-opacity-10 rounded-full px-3 py-1">
                    <span className="text-white">Friendliness: {rating.friendlinessScore}/5</span>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default RatingList;