import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLikesReceived } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { showError } from '../utils/toast';

const LikesPage = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [likes, setLikes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!user?.userId) return;
    fetchLikes();
  }, [user?.userId]);

  const fetchLikes = async () => {
    setLoading(true);
    try {
      const response = await getLikesReceived();
      setLikes(response.data || response);
    } catch (error) {
      console.error('Failed to load likes:', error);
      showError(error.response?.data?.message || 'Failed to load likes');
    } finally {
      setLoading(false);
    }
  };

  if (user?.tier !== 'ELITE') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-white">Elite exclusive</h2>
          <p className="text-gray-300">
            Upgrade to Elite to see the people who liked you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] px-6 py-8 bg-[#050505] text-white">
      <h1 className="text-3xl font-extrabold tracking-tight text-white mb-6">People who liked you</h1>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : likes.length === 0 ? (
        <p className="text-gray-400">No one has liked you yet.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {likes.map((like) => (
            <div key={like.userId} className="rounded-3xl p-5 bg-[#0d0d0d] border border-[#1f1f1f] shadow-[0_20px_45px_rgba(0,0,0,0.45)]">
              <div className="flex items-center space-x-3 mb-3">
                <img
                  src={
                    like.profilePictureUrl ||
                    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=60'
                  }
                  alt={like.name}
                  className="w-12 h-12 rounded-full object-cover border border-gray-600"
                />
                <div>
                  <h3 className="text-lg font-semibold text-white">{like.name}</h3>
                  <p className="text-sm text-gray-400">{like.location || 'Unknown location'}</p>
                </div>
              </div>
              <p className="text-sm text-gray-300 mb-2">{like.bio || 'No bio available.'}</p>
              <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                <span>{like.tier ? like.tier : 'Tier unknown'}</span>
                <span>{like.fitnessLevel || 'Fitness level TBD'}</span>
              </div>
              <button
                onClick={() => navigate(`/user/${like.userId}`)}
                className="w-full px-3 py-2 text-sm font-semibold rounded-full bg-[#FF5F00] text-white uppercase tracking-wide transition hover:bg-[#ff8b2c]"
              >
                View profile
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default LikesPage;
