// src/components/rating/RatingList.jsx
import { Star, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

function RatingList({ ratings }) {
  if (!ratings || ratings.length === 0) {
    return (
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-8 text-center">
        <Star className="w-16 h-16 text-white opacity-50 mx-auto mb-4" />
        <p className="text-white opacity-80 text-lg">No ratings yet</p>
        <p className="text-white opacity-60 text-sm mt-2">
          Be the first to rate this buddy!
        </p>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = (
    ratings.reduce((sum, r) => sum + (r.rating || 0), 0) / ratings.length
  ).toFixed(1);

  // Calculate average scores
  const avgReliability = ratings.filter((r) => r.reliabilityScore).length
    ? (
        ratings.reduce((sum, r) => sum + (r.reliabilityScore || 0), 0) /
        ratings.filter((r) => r.reliabilityScore).length
      ).toFixed(1)
    : null;

  const avgPunctuality = ratings.filter((r) => r.punctualityScore).length
    ? (
        ratings.reduce((sum, r) => sum + (r.punctualityScore || 0), 0) /
        ratings.filter((r) => r.punctualityScore).length
      ).toFixed(1)
    : null;

  const avgFriendliness = ratings.filter((r) => r.friendlinessScore).length
    ? (
        ratings.reduce((sum, r) => sum + (r.friendlinessScore || 0), 0) /
        ratings.filter((r) => r.friendlinessScore).length
      ).toFixed(1)
    : null;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center mb-2">
            <Star className="w-12 h-12 fill-yellow-400 text-yellow-400" />
            <span className="text-5xl font-bold text-white ml-3">
              {averageRating}
            </span>
          </div>
          <p className="text-white opacity-80">
            Based on {ratings.length} {ratings.length === 1 ? "review" : "reviews"}
          </p>
        </div>

        {/* Detailed Averages */}
        {(avgReliability || avgPunctuality || avgFriendliness) && (
          <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-white border-opacity-20">
            {avgReliability && (
              <div className="text-center">
                <p className="text-white text-sm opacity-70">Reliability</p>
                <p className="text-white text-2xl font-bold">{avgReliability}</p>
              </div>
            )}
            {avgPunctuality && (
              <div className="text-center">
                <p className="text-white text-sm opacity-70">Punctuality</p>
                <p className="text-white text-2xl font-bold">{avgPunctuality}</p>
              </div>
            )}
            {avgFriendliness && (
              <div className="text-center">
                <p className="text-white text-sm opacity-70">Friendliness</p>
                <p className="text-white text-2xl font-bold">
                  {avgFriendliness}
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Individual Ratings */}
      <div className="space-y-3 max-h-[500px] overflow-y-auto scrollbar-thin">
        {ratings.map((rating) => (
          <div
            key={rating.ratingId}
            className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-4"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-white bg-opacity-30 rounded-full flex items-center justify-center mr-3">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-white font-bold">
                    {rating.fromUser?.name || "Anonymous"}
                  </p>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (rating.rating || 0)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-white text-opacity-30"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
              <span className="text-white text-xs opacity-70">
                {rating.createdAt
                  ? formatDistanceToNow(new Date(rating.createdAt), {
                      addSuffix: true,
                    })
                  : "Recently"}
              </span>
            </div>

            {rating.review && (
              <p className="text-white opacity-90 text-sm mb-3">
                {rating.review}
              </p>
            )}

            {/* Detailed Scores */}
            {(rating.reliabilityScore ||
              rating.punctualityScore ||
              rating.friendlinessScore) && (
              <div className="flex flex-wrap gap-2">
                {rating.reliabilityScore && (
                  <div className="bg-white bg-opacity-10 rounded-full px-3 py-1">
                    <span className="text-white text-xs">
                      Reliability: {rating.reliabilityScore}/5
                    </span>
                  </div>
                )}
                {rating.punctualityScore && (
                  <div className="bg-white bg-opacity-10 rounded-full px-3 py-1">
                    <span className="text-white text-xs">
                      Punctuality: {rating.punctualityScore}/5
                    </span>
                  </div>
                )}
                {rating.friendlinessScore && (
                  <div className="bg-white bg-opacity-10 rounded-full px-3 py-1">
                    <span className="text-white text-xs">
                      Friendliness: {rating.friendlinessScore}/5
                    </span>
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