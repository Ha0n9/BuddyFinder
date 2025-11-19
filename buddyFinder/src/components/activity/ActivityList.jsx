import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getActivities, joinActivity, deleteActivity, getActivityChatRoom } from '../../services/api';
import Button from '../common/Button';
import { MapPin, Clock, Users, Trash2 } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { showError, showSuccess } from '../../utils/toast';

const CONFLICT_WINDOW_MINUTES = 60;

function ActivityList({ refresh }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningId, setJoiningId] = useState(null);
  const [openingChatId, setOpeningChatId] = useState(null);
  const [conflictInfo, setConflictInfo] = useState(null);
  const [pendingJoinActivity, setPendingJoinActivity] = useState(null);
  const { user } = useAuthStore();
  const navigate = useNavigate();

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
    setJoiningId(activityId);
    try {
      const response = await joinActivity(activityId);
      const rawMessage =
        typeof response.data === 'string'
          ? response.data
          : response.data?.message;
      const normalized = rawMessage?.toLowerCase() || '';

      if (normalized.includes('already a participant')) {
        showError(rawMessage || 'You already joined this activity');
        markActivityAsJoined(activityId);
        return;
      }

      if (normalized.includes('full')) {
        showError(rawMessage || 'Activity is full');
        fetchActivities();
        return;
      }

      showSuccess(rawMessage || 'Joined activity successfully!');
      markActivityAsJoined(activityId);

      try {
        const roomResponse = await getActivityChatRoom(activityId);
        const roomId = roomResponse.data?.roomId;
        if (roomId) {
          navigate(`/chat?room=${roomId}&type=group`);
        }
      } catch (roomError) {
        console.error('Failed to retrieve activity chat room:', roomError);
      }
    } catch (error) {
      console.error('Failed to join activity:', error);
      showError(error.response?.data?.message || 'Failed to join activity');
    } finally {
      setJoiningId(null);
    }
  };

  const findConflictingActivities = (targetActivity) => {
    if (!targetActivity?.scheduledTime) return [];
    const targetTime = new Date(targetActivity.scheduledTime).getTime();
    const threshold = CONFLICT_WINDOW_MINUTES * 60 * 1000;

    return activities.filter((act) => {
      const isParticipant = act.participants?.some(
        (participant) => participant.user?.userId === user?.userId
      );
      const isCreator = act.creator?.userId === user?.userId;
      if (!isParticipant && !isCreator) return false;
      if (act.activityId === targetActivity.activityId) return false;
      if (!act.scheduledTime) return false;
      const diff = Math.abs(new Date(act.scheduledTime).getTime() - targetTime);
      return diff < threshold;
    });
  };

  const requestJoin = (activity) => {
    const conflicts = findConflictingActivities(activity);
    if (conflicts.length > 0) {
      setPendingJoinActivity(activity);
      setConflictInfo({ activity, conflicts });
      showError('This activity overlaps with another one you joined.');
      return;
    }
    executeJoin(activity.activityId);
  };

  const executeJoin = (activityId) => {
    handleJoin(activityId);
  };

  const confirmJoinDespiteConflict = () => {
    if (pendingJoinActivity) {
      executeJoin(pendingJoinActivity.activityId);
    }
    setPendingJoinActivity(null);
    setConflictInfo(null);
  };

  const cancelConflictJoin = () => {
    setPendingJoinActivity(null);
    setConflictInfo(null);
  };

  const markActivityAsJoined = (activityId) => {
    setActivities((prev) =>
      prev.map((activity) => {
        if (activity.activityId !== activityId) return activity;
        const alreadyParticipant = activity.participants?.some(
          (participant) => participant.user?.userId === user?.userId
        );

        if (alreadyParticipant) {
          return {
            ...activity,
            currentCount: activity.currentCount || 0,
          };
        }

        return {
          ...activity,
          currentCount: (activity.currentCount || 0) + 1,
          participants: [
            ...(activity.participants || []),
            { user: { userId: user?.userId } },
          ],
        };
      })
    );

    fetchActivities();
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

  const handleOpenChat = async (activityId) => {
    setOpeningChatId(activityId);
    try {
      const roomResponse = await getActivityChatRoom(activityId);
      const roomId = roomResponse.data?.roomId;
      if (roomId) {
        navigate(`/chat?type=group&room=${roomId}`);
      } else {
        showError('No chat room found for this activity yet.');
      }
    } catch (error) {
      console.error('Failed to load group chat:', error);
      showError('Unable to open group chat right now');
    } finally {
      setOpeningChatId(null);
    }
  };

  const categorizedActivities = useMemo(() => {
    const joined = [];
    const available = [];

    activities.forEach((activity) => {
      const isCreator = user?.userId === activity.creator?.userId;
      const isParticipant = activity.participants?.some(
        (participant) => participant.user?.userId === user?.userId
      );
      const isFull = (activity.currentCount || 0) >= activity.maxParticipants;
      const record = { activity, isCreator, isParticipant, isFull };

      if (isCreator || isParticipant) {
        joined.push(record);
      } else {
        available.push(record);
      }
    });

    return { joinedActivities: joined, availableActivities: available };
  }, [activities, user?.userId]);

  const renderActivityCard = ({ activity, isCreator, isParticipant, isFull }) => (
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

      {isCreator || isParticipant ? (
        <Button
          onClick={() => handleOpenChat(activity.activityId)}
          disabled={openingChatId === activity.activityId}
          className="w-full bg-white text-pink-500 font-bold py-2 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {openingChatId === activity.activityId ? 'Opening chat...' : 'Open Group Chat'}
        </Button>
      ) : (
        <Button 
          onClick={() => requestJoin(activity)}
          disabled={isFull || joiningId === activity.activityId}
          className="w-full bg-white text-pink-500 font-bold py-2 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isFull ? 'Full' : joiningId === activity.activityId ? 'Joining...' : 'Join Activity'}
        </Button>
      )}
    </div>
  );

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
    <div className="space-y-8">
      {categorizedActivities.joinedActivities.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-white">Joined Activities</h3>
          {categorizedActivities.joinedActivities.map(renderActivityCard)}
        </section>
      )}

      <section className="space-y-4">
        <h3 className="text-xl font-bold text-white">Available Activities</h3>
        {categorizedActivities.availableActivities.length === 0 ? (
          <div className="text-center text-white bg-white/10 rounded-2xl py-6">
            <p className="text-base">All available activities have been joined.</p>
            <p className="text-sm opacity-70">Check back later for new ones!</p>
          </div>
        ) : (
          categorizedActivities.availableActivities.map(renderActivityCard)
        )}
      </section>

      {conflictInfo && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 max-w-lg w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-3">Scheduling Conflict</h3>
            <p className="text-gray-300 text-sm mb-4">
              You’re already part of the following activities that overlap with <strong>{conflictInfo.activity.title}</strong>. Joining may cause conflicts:
            </p>
            <ul className="space-y-2 text-sm text-gray-200 mb-5">
              {conflictInfo.conflicts.map((conflict) => (
                <li key={conflict.activityId} className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-3">
                  <p className="font-semibold">{conflict.title}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(conflict.scheduledTime).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
            <div className="flex gap-3">
              <button
                onClick={cancelConflictJoin}
                className="flex-1 px-4 py-2 rounded-xl bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]"
              >
                Cancel
              </button>
              <button
                onClick={confirmJoinDespiteConflict}
                className="flex-1 px-4 py-2 rounded-xl bg-[#FF5F00] text-white font-bold hover:bg-[#ff7133]"
              >
                Join Anyway
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ActivityList;
