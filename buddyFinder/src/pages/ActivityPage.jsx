// src/pages/ActivityPage.jsx
import { useState } from 'react';
import ActivityPost from '../components/activity/ActivityPost';
import ActivityList from '../components/activity/ActivityList';

function ActivityPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivityPosted = () => {
    setRefreshKey(prev => prev + 1); // Trigger refresh
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8 text-center">Fitness Activities</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <ActivityPost onActivityPosted={handleActivityPosted} />
          </div>
          
          <div>
            <ActivityList refresh={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityPage;