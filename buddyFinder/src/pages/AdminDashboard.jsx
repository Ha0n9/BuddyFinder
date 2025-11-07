import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Activity, MessageCircle, TrendingUp, Ban, Trash2, CheckCircle } from 'lucide-react';
import { showError, showSuccess } from '../utils/toast';

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { 'Authorization': `Bearer ${token}` } };

      const [statsRes, usersRes, activitiesRes] = await Promise.all([
        axios.get('http://localhost:8080/api/admin/dashboard', config),
        axios.get('http://localhost:8080/api/admin/users', config),
        axios.get('http://localhost:8080/api/admin/activities', config)
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setActivities(activitiesRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data:', error);
      showError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId, isCurrentlyActive) => {
    const action = isCurrentlyActive ? 'ban' : 'unban';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:8080/api/admin/users/${userId}/${action}`,
        {},
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      showSuccess(`User ${action}ned successfully`);
      fetchDashboardData();
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      showError(`Failed to ${action} user`);
    }
  };

  const handleDeleteActivity = async (activityId) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:8080/api/admin/activities/${activityId}`,
        { headers: { 'Authorization': `Bearer ${token}` } }
      );
      showSuccess('Activity deleted successfully');
      fetchDashboardData();
    } catch (error) {
      console.error('Failed to delete activity:', error);
      showError('Failed to delete activity');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {activeTab === 'overview' && stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<Users className="w-8 h-8" />}
              title="Total Users"
              value={stats.totalUsers}
              color="from-blue-500 to-cyan-500"
            />
            <StatCard
              icon={<Activity className="w-8 h-8" />}
              title="Activities"
              value={stats.totalActivities}
              color="from-green-500 to-emerald-500"
            />
            <StatCard
              icon={<TrendingUp className="w-8 h-8" />}
              title="Matches"
              value={stats.totalMatches}
              color="from-purple-500 to-pink-500"
            />
            <StatCard
              icon={<MessageCircle className="w-8 h-8" />}
              title="Messages"
              value={stats.totalMessages}
              color="from-orange-500 to-red-500"
            />
          </div>
        )}

        <div className="flex gap-4 mb-6">
          <TabButton
            active={activeTab === 'overview'}
            onClick={() => setActiveTab('overview')}
            label="Overview"
          />
          <TabButton
            active={activeTab === 'users'}
            onClick={() => setActiveTab('users')}
            label={`Users (${users.length})`}
          />
          <TabButton
            active={activeTab === 'activities'}
            onClick={() => setActiveTab('activities')}
            label={`Activities (${activities.length})`}
          />
        </div>

        {activeTab === 'users' && (
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">User Management</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {users.map(user => (
                <div key={user.userId} className="bg-white bg-opacity-10 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">{user.name}</p>
                    <p className="text-white text-sm opacity-70">{user.email}</p>
                    <div className="flex gap-2 mt-2">
                      <span className={`text-xs px-2 py-1 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'} text-white`}>
                        {user.isActive ? 'Active' : 'Banned'}
                      </span>
                      {user.isAdmin && (
                        <span className="text-xs px-2 py-1 rounded-full bg-yellow-500 text-white">
                          Admin
                        </span>
                      )}
                      {user.isVerified && (
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500 text-white">
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                  {!user.isAdmin && (
                    <button
                      onClick={() => handleBanUser(user.userId, user.isActive)}
                      className={`p-2 rounded-full ${user.isActive ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'} text-white transition-colors`}
                      title={user.isActive ? 'Ban user' : 'Unban user'}
                    >
                      {user.isActive ? <Ban className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6">
            <h2 className="text-xl font-bold text-white mb-4">Activity Management</h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {activities.map(activity => (
                <div key={activity.activityId} className="bg-white bg-opacity-10 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-white font-bold">{activity.title}</p>
                    <p className="text-white text-sm opacity-70">
                      by {activity.creator?.name || 'Unknown'}
                    </p>
                    <p className="text-white text-xs opacity-60 mt-1">
                      {activity.currentCount}/{activity.maxParticipants} participants • {activity.location}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteActivity(activity.activityId)}
                    className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    title="Delete activity"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <div className={`bg-gradient-to-r ${color} rounded-2xl p-6 text-white`}>
      <div className="flex items-center justify-between mb-2">
        {icon}
        <span className="text-3xl font-bold">{value}</span>
      </div>
      <p className="text-sm opacity-90">{title}</p>
    </div>
  );
}

function TabButton({ active, onClick, label }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-3 rounded-xl font-bold transition-all ${
        active
          ? 'bg-white text-pink-500'
          : 'bg-white bg-opacity-20 text-white hover:bg-opacity-30'
      }`}
    >
      {label}
    </button>
  );
}

export default AdminDashboard;