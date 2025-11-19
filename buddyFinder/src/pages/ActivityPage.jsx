import { useState } from 'react';
import ActivityPost from '../components/activity/ActivityPost';
import ActivityList from '../components/activity/ActivityList';
import { Flame } from 'lucide-react';

function ActivityPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleActivityPosted = () => {
    setRefreshKey((prev) => prev + 1); // Trigger refresh
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-text-primary)] py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Flame className="w-8 h-8 text-[var(--color-accent)]" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              Fitness Activities
            </h1>
          </div>
          <p className="text-[var(--color-text-secondary)] max-w-xl mx-auto text-sm md:text-base">
            Log your workouts, share your progress, and stay inspired with your community.
          </p>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch">
          {/* Left - Post Activity */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-md p-6 h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">
              Post a New Activity
            </h2>
            <ActivityPost onActivityPosted={handleActivityPosted} />
          </div>

          {/* Right - Activity Feed */}
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl shadow-md p-6 h-full flex flex-col">
            <h2 className="text-xl font-semibold mb-4 text-[var(--color-text-primary)]">
              Recent Activities
            </h2>
            <ActivityList refresh={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ActivityPage;
