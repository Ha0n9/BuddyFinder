// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import {
  getAdminDashboard,
  getAllUsers,
  getAllActivities,
  // (tùy backend) getAllRatings
} from "../services/adminApi";
import OverviewCards from "../components/admin/OverviewCards";
import UsersTable from "../components/admin/UsersTable";
import ActivitiesTable from "../components/admin/ActivitiesTable";
import RatingsTable from "../components/admin/RatingsTable";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview"); // overview|users|activities|ratings
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  const refreshOverview = async () => {
    const res = await getAdminDashboard(); // expect { stats, recentUsers, recentActivities, recentRatings? }
    setStats(res?.stats || res);
    if (res?.recentUsers)   setUsers(res.recentUsers);
    if (res?.recentActivities) setActivities(res.recentActivities);
    if (res?.recentRatings) setRatings(res.recentRatings);
  };

  const refreshUsers = async () => {
    const data = await getAllUsers();
    setUsers(Array.isArray(data) ? data : data?.items || []);
  };

  const refreshActivities = async () => {
    const data = await getAllActivities();
    setActivities(Array.isArray(data) ? data : data?.items || []);
  };

  const refreshRatings = async () => {
    // Nếu có endpoint riêng:
    // const data = await getAllRatings();
    // setRatings(Array.isArray(data) ? data : data?.items || []);
    // Nếu chưa có, tạm dựa vào dashboard:
    await refreshOverview();
  };

  const initialLoad = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([refreshOverview(), refreshUsers(), refreshActivities()]);
      // Nếu có getAllRatings thì gọi thêm:
      // await refreshRatings();
    } catch (e) {
      console.error(e);
      setError("Failed to load admin data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initialLoad();
  }, []);

  if (loading) return <p className="p-6 text-center">Loading...</p>;
  if (error)   return <p className="p-6 text-center text-red-600">{error}</p>;

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 hidden md:block border-r border-neutral-200/60 dark:border-neutral-800 min-h-screen p-4">
          <div className="text-xl font-semibold">BuddyFinder Admin</div>
          <nav className="mt-6 grid gap-1">
            {["overview", "users", "activities", "ratings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-3 py-2 rounded-xl ${
                  activeTab === tab
                    ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                    : "hover:bg-neutral-100 dark:hover:bg-neutral-900 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main */}
        <main className="flex-1 p-4 md:p-8">
          <header className="flex items-center justify-between gap-3">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">Admin Dashboard</h1>
            <div className="flex items-center gap-2">
              <input placeholder="Search..." className="rounded-xl border px-3 py-2 w-48 md:w-72" />
              <button className="px-3 py-2 rounded-xl border">Export</button>
            </div>
          </header>

          <section className="mt-6 grid gap-6">
            {activeTab === "overview" && (
              <>
                <OverviewCards stats={stats} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Recent Users</h2>
                    <UsersTable users={users.slice(0, 10)} refresh={refreshUsers} />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold mb-3">Recent Activities</h2>
                    <ActivitiesTable activities={activities.slice(0, 10)} refresh={refreshActivities} />
                  </div>
                </div>
              </>
            )}

            {activeTab === "users" && (
              <UsersTable users={users} refresh={refreshUsers} />
            )}

            {activeTab === "activities" && (
              <ActivitiesTable activities={activities} refresh={refreshActivities} />
            )}

            {activeTab === "ratings" && (
              <RatingsTable ratings={ratings} refresh={refreshRatings} />
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
