import { useState, useEffect } from "react";
import { getMatches, getRatings } from "../services/api";
import RatingForm from "../components/rating/RatingForm";
import RatingList from "../components/rating/RatingList";
import { User, Star, MessageCircle } from "lucide-react";

function RatingPage() {
  const [matches, setMatches] = useState([]);
  const [selectedBuddy, setSelectedBuddy] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState("rate"); // 'rate' or 'view'

  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
    if (selectedBuddy) {
      fetchRatings(selectedBuddy.userId);
    }
  }, [selectedBuddy]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const response = await getMatches();
      setMatches(response.data);
      if (response.data.length > 0) {
        setSelectedBuddy(response.data[0]);
      }
    } catch (error) {
      console.error("Failed to fetch matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRatings = async (userId) => {
    try {
      const response = await getRatings(userId);
      setRatings(response.data);
    } catch (error) {
      console.error("Failed to fetch ratings:", error);
      setRatings([]);
    }
  };

  const handleRatingSubmitted = () => {
    if (selectedBuddy) {
      fetchRatings(selectedBuddy.userId);
    }
    setView("view");
  };

  // 🔸 Loading screen
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF5F00]"></div>
      </div>
    );
  }

  // 💤 No Matches
  if (matches.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center px-4">
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-8 max-w-md text-center shadow-[0_0_20px_rgba(255,95,0,0.15)]">
          <MessageCircle className="w-20 h-20 text-[#FF5F00] mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">No Matches Yet</h2>
          <p className="text-gray-400">
            Start swiping to find workout buddies to rate!
          </p>
        </div>
      </div>
    );
  }

  // ⭐ Main Page
  return (
    <div className="min-h-screen bg-[#0B0B0B] py-12 px-4 text-white">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#FF5F00] mb-8 text-center">
          Rate Your Buddies
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {/* LEFT: Buddies List */}
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6">
            <h2 className="text-xl font-bold text-[#FF5F00] mb-4">
              Your Matches
            </h2>
            <div className="space-y-2 max-h-[600px] overflow-y-auto scrollbar-thin">
              {matches.map((buddy) => (
                <button
                  key={buddy.userId}
                  onClick={() => {
                    setSelectedBuddy(buddy);
                    setView("rate");
                  }}
                  className={`w-full text-left p-4 rounded-xl transition-all ${
                    selectedBuddy?.userId === buddy.userId
                      ? "bg-[#FF5F00]/20 border border-[#FF5F00] shadow-[0_0_15px_rgba(255,95,0,0.3)]"
                      : "bg-[#2A2A2A]/40 hover:bg-[#2A2A2A]/70 border border-transparent"
                  }`}
                >
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-[#FF5F00] rounded-full flex items-center justify-center mr-3 flex-shrink-0 shadow-[0_0_10px_rgba(255,95,0,0.4)]">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{buddy.name}</p>
                      <p className="text-gray-400 text-sm truncate">
                        {buddy.location}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: Rating Section */}
          <div className="md:col-span-2">
            {/* Toggle View */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setView("rate")}
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  view === "rate"
                    ? "bg-[#FF5F00] text-white shadow-[0_0_15px_rgba(255,95,0,0.4)]"
                    : "bg-[#1A1A1A] border border-[#2A2A2A] text-gray-300 hover:text-white"
                }`}
              >
                <Star className="w-5 h-5" />
                Rate Buddy
              </button>
              <button
                onClick={() => setView("view")}
                className={`flex-1 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 ${
                  view === "view"
                    ? "bg-[#FF5F00] text-white shadow-[0_0_15px_rgba(255,95,0,0.4)]"
                    : "bg-[#1A1A1A] border border-[#2A2A2A] text-gray-300 hover:text-white"
                }`}
              >
                <MessageCircle className="w-5 h-5" />
                View Ratings
              </button>
            </div>

            {/* Buddy Info */}
            {selectedBuddy && (
              <div className="space-y-4">
                <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-[#FF5F00] rounded-full flex items-center justify-center mr-4 shadow-[0_0_10px_rgba(255,95,0,0.4)]">
                      <User className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{selectedBuddy.name}</h3>
                      <p className="text-gray-400 text-sm">
                        {selectedBuddy.location}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Dynamic Content */}
                {view === "rate" ? (
                  <RatingForm
                    toUserId={selectedBuddy.userId}
                    onSubmitted={handleRatingSubmitted}
                  />
                ) : (
                  <RatingList ratings={ratings} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RatingPage;
