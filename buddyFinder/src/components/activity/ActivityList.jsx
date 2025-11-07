import { useState, useEffect } from 'react';
import { getActivities, joinActivity, deleteActivity } from '../../services/api';
import Button from '../common/Button';
import { MapPin, Clock, Users, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { showError, showSuccess } from '../../utils/toast';

function ActivityList({ refresh }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  useEffect(() => {
    fetchActivities();
  }, [refresh]);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const response = await getActivities();
      setActivities(response.data);
    } catch (error) {
      console.error('Failed to fetch activities:', error);
      showError('Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async (activityId) => {
    try {
      await joinActivity(activityId);
      showSuccess('Joined activity successfully!');
      fetchActivities();
    } catch (error) {
      console.error('Failed to join activity:', error);
      showError(error.response?.data?.message || 'Failed to join activity');
    }
  };

  const handleDelete = async (activityId) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      await deleteActivity(activityId);
      showSuccess('Activity deleted successfully!');
      fetchActivities();
    } catch (error) {
      console.error('Failed to delete activity:', error);
      showError(error.response?.data?.message || 'Failed to delete activity');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white mx-auto"></div>
      </div>
    );
  }

  if (activities.length === 0) {
    return (
      <div className="text-center text-white py-8">
        <p className="text-lg">No activities available yet.</p>
        <p className="text-sm opacity-70">Be the first to create one!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Available Activities</h3>
      {activities.map((activity) => {
        const isCreator = user?.userId === activity.creator?.userId;
        const isFull = activity.currentCount >= activity.maxParticipants;

        return (
          <div key={activity.activityId} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 relative">
            {isCreator && (
              <button
                onClick={() => handleDelete(activity.activityId)}
                className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Delete activity"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <div className="flex justify-between items-start mb-3 pr-10">
              <div>
                <h4 className="text-lg font-bold text-white">{activity.title}</h4>
                {isCreator && (
                  <span className="text-xs text-white opacity-70">Created by you</span>
                )}
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                activity.difficultyLevel === 'Beginner' ? 'bg-green-500' :
                activity.difficultyLevel === 'Intermediate' ? 'bg-yellow-500' :
                'bg-red-500'
              } text-white`}>
                {activity.difficultyLevel}
              </span>
            </div>

            <p className="text-white opacity-90 mb-4">{activity.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-white">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="text-sm">{activity.location}</span>
              </div>
              <div className="flex items-center text-white">
                <Clock className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {new Date(activity.scheduledTime).toLocaleString()}
                </span>
              </div>
              <div className="flex items-center text-white">
                <Users className="w-4 h-4 mr-2" />
                <span className="text-sm">
                  {activity.currentCount || 0} / {activity.maxParticipants} participants
                </span>
              </div>
            </div>

            {!isCreator && (
              <Button 
                onClick={() => handleJoin(activity.activityId)}
                disabled={isFull}
                className="w-full bg-white text-pink-500 font-bold py-2 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isFull ? 'Full' : 'Join Activity'}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default ActivityList;