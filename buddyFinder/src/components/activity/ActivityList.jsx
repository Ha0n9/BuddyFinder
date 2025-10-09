import { useState, useEffect } from 'react';
import { getActivities, joinActivity } from '../../services/api';
import Button from '../common/Button';

function ActivityList() {
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await getActivities();
        setActivities(response.data);
      } catch (error) {
        console.error('Failed to fetch activities:', error);
      }
    };
    fetchActivities();
  }, []);

  const handleJoin = async (activityId) => {
    try {
      await joinActivity(activityId);
      alert('Joined activity successfully!');
    } catch (error) {
      console.error('Failed to join activity:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      {activities.map((activity) => (
        <div key={activity.id} className="bg-white p-4 rounded shadow mb-4">
          <h3 className="text-lg font-bold">{activity.title}</h3>
          <p><strong>Type:</strong> {activity.activityType}</p>
          <p><strong>Location:</strong> {activity.location}</p>
          <p><strong>Time:</strong> {activity.time}</p>
          <Button onClick={() => handleJoin(activity.id)}>Join</Button>
        </div>
      ))}
    </div>
  );
}

export default ActivityList;