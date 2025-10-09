import ActivityPost from '../components/activity/ActivityPost';
import ActivityList from '../components/activity/ActivityList';

function ActivityPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Activities</h1>
      <ActivityPost />
      <h2 className="text-xl font-bold mt-6 mb-4">Available Activities</h2>
      <ActivityList />
    </div>
  );
}

export default ActivityPage;