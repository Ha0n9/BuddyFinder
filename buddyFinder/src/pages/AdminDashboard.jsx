import React, { useEffect, useState } from "react";
import {
  getAdminDashboard,
  getAllUsers,
  getAllActivities,
  getAllRatings,
  getAllReports,
  getSupportRequests,
} from "../services/adminApi";
import OverviewCards from "../components/admin/OverviewCards";
import UsersTable from "../components/admin/UsersTable";
import ActivitiesTable from "../components/admin/ActivitiesTable";
import RatingsTable from "../components/admin/RatingsTable";
import RefundsTable from "../components/admin/RefundsTable";
import VerificationsTable from "../components/admin/VerificationsTable";
import ReportsTable from "../components/admin/ReportsTable";
import SupportRequestsTable from "../components/admin/SupportRequestsTable";
import { Search, Download } from "lucide-react";
import { showError, showSuccess } from "../utils/toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [activities, setActivities] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refunds, setRefunds] = useState([]);
  const [verifications, setVerifications] = useState([]);
  const [reports, setReports] = useState([]);
  const [supportRequests, setSupportRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [exportingFormat, setExportingFormat] = useState(null);

  const refreshOverview = async () => {
    const res = await getAdminDashboard();
    setStats(res?.stats || res);
    if (res?.recentUsers) setUsers(res.recentUsers);
    if (res?.recentActivities) setActivities(res.recentActivities);
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
    const data = await getAllRatings();
    setRatings(Array.isArray(data) ? data : data?.items || []);
  };

  const refreshRefunds = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/api/admin/refunds/pending", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setRefunds(data || []);
  };

  const refreshVerifications = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:8080/api/verification/admin/pending", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setVerifications(data || []);
  };

  const refreshReports = async () => {
    const data = await getAllReports();
    setReports(Array.isArray(data) ? data : data?.items || []);
  };

  const refreshSupportRequests = async () => {
    const data = await getSupportRequests();
    setSupportRequests(Array.isArray(data) ? data : data?.items || []);
  };

  const initialLoad = async () => {
    try {
      setLoading(true);
      setError(null);
      await Promise.all([
        refreshOverview(), 
        refreshUsers(), 
        refreshActivities(),
        refreshRatings(),
        refreshRefunds(),
        refreshVerifications(),
        refreshReports(),
        refreshSupportRequests()
      ]);
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

  useEffect(() => {
    if (activeTab === "ratings" && ratings.length === 0) {
      refreshRatings();
    }
    if (activeTab === "refunds" && refunds.length === 0) {
      refreshRefunds();
    }
    if (activeTab === "verifications" && verifications.length === 0) {
      refreshVerifications();
    }
    if (activeTab === "reports" && reports.length === 0) {
      refreshReports();
    }
    if (activeTab === "support" && supportRequests.length === 0) {
      refreshSupportRequests();
    }
  }, [activeTab, ratings.length, refunds.length, verifications.length, reports.length, supportRequests.length]);

  const handleExportUsers = async (format) => {
    if (exportingFormat) return;
    try {
      setExportingFormat(format);
      const data = await getAllUsers();
      const list = Array.isArray(data) ? data : data?.items || [];

      if (!list.length) {
        showError("No user data available to export");
        return;
      }

      let blob;
      let filename;
      if (format === "json") {
        blob = new Blob([JSON.stringify(list, null, 2)], {
          type: "application/json",
        });
        filename = "buddyfinder-users.json";
      } else {
        const fields = [
          "userId",
          "name",
          "email",
          "age",
          "location",
          "tier",
          "isVerified",
          "isActive",
        ];
        const header = fields.join(",");
        const rows = list.map((user) =>
          fields
            .map((field) => {
              const value = user?.[field];
              if (value === undefined || value === null) return "";
              const stringValue = String(value).replace(/"/g, '""');
              return `"${stringValue}"`;
            })
            .join(",")
        );
        const csv = [header, ...rows].join("\n");
        blob = new Blob([csv], { type: "text/csv" });
        filename = "buddyfinder-users.csv";
      }

      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showSuccess("User data exported successfully");
    } catch (error) {
      console.error("Failed to export users", error);
      showError("Failed to export users");
    } finally {
      setExportingFormat(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-[#FF5F00] text-lg font-bold">
        Loading Dashboard...
      </div>
    );
  if (error)
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-red-500 text-lg font-bold">
        {error}
      </div>
    );

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filterItems = (list, fields) =>
    !normalizedQuery
      ? list
      : list.filter((item) =>
          fields.some((field) =>
            String(item?.[field] || "")
              .toLowerCase()
              .includes(normalizedQuery)
          )
        );

  const filteredUsers = filterItems(users, ["name", "email", "location"]);
  const filteredActivities = filterItems(activities, ["title", "location", "creatorName"]);
  const filteredRatings = filterItems(ratings, ["fromUserName", "toUserName", "comment"]);
  const filteredReports = filterItems(reports, ["reason", "description"]);
  const filteredSupport = filterItems(supportRequests, ["email", "message"]);

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-[#2A2A2A] bg-[#111111] shadow-[4px_0_10px_rgba(255,95,0,0.05)]">
        <div className="p-6 border-b border-[#2A2A2A]">
          <h1 className="text-xl font-extrabold text-[#FF5F00] tracking-tight">
            BuddyFinder Admin
          </h1>
        </div>
        <nav className="flex-1 mt-4 space-y-1 p-3">
          {["overview", "users", "activities", "ratings", "refunds", "verifications", "reports", "support"].map((tab) => {
            const badgeCount =
              tab === "refunds"
                ? refunds.filter((r) => r.status === "PENDING").length
                : tab === "verifications"
                ? verifications.filter((v) => v.status === "PENDING").length
                : tab === "reports"
                ? reports.filter((r) => r.status === "OPEN").length
                : tab === "support"
                ? supportRequests.filter((s) => s.status === "OPEN").length
                : 0;

            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-[#FF5F00] text-white shadow-[0_0_15px_rgba(255,95,0,0.4)]"
                    : "text-gray-400 hover:bg-[#1A1A1A] hover:text-[#FF5F00]"
                }`}
              >
                <span className="flex items-center justify-between gap-3">
                  <span>{tab.charAt(0).toUpperCase() + tab.slice(1)}</span>
                  {!!badgeCount && (
                    <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-semibold bg-red-500 text-white rounded-full">
                      {badgeCount}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-[#2A2A2A] text-xs text-gray-500 text-center">
          © 2025 BuddyFinder
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6 md:p-10">
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-[#2A2A2A] pb-4 mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-[#FF5F00]">
            Admin Dashboard
          </h1>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64 z-[100]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#111111] border border-[#2A2A2A] rounded-xl pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
              />
            </div>
            <button
              onClick={() => handleExportUsers("json")}
              disabled={!!exportingFormat}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF5F00] hover:bg-[#ff7133] rounded-xl text-white font-bold text-sm shadow-[0_2px_8px_rgba(255,95,0,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              JSON
            </button>
            <button
              onClick={() => handleExportUsers("csv")}
              disabled={!!exportingFormat}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF5F00] hover:bg-[#ff7133] rounded-xl text-white font-bold text-sm shadow-[0_2px_8px_rgba(255,95,0,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              CSV
            </button>
          </div>
        </header>

        {/* Content */}
        <section className="space-y-8">
          {activeTab === "overview" && (
            <>
              <OverviewCards stats={stats} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-[0_0_10px_rgba(255,95,0,0.05)]">
                  <h2 className="text-lg font-semibold text-[#FF5F00] mb-4">
                    Recent Users
                  </h2>
                  <UsersTable users={filteredUsers.slice(0, 10)} refresh={refreshUsers} />
                </div>

                <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-[0_0_10px_rgba(255,95,0,0.05)]">
                  <h2 className="text-lg font-semibold text-[#FF5F00] mb-4">
                    Recent Activities
                  </h2>
                  <ActivitiesTable
                    activities={filteredActivities.slice(0, 10)}
                    refresh={refreshActivities}
                  />
                </div>
              </div>
            </>
          )}

          {activeTab === "users" && (
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-[0_0_10px_rgba(255,95,0,0.1)]">
              <h2 className="text-lg font-semibold text-[#FF5F00] mb-4">
                All Users
              </h2>
              <UsersTable users={filteredUsers} refresh={refreshUsers} />
            </div>
          )}

          {activeTab === "activities" && (
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-[0_0_10px_rgba(255,95,0,0.1)]">
              <h2 className="text-lg font-semibold text-[#FF5F00] mb-4">
                All Activities
              </h2>
              <ActivitiesTable
                activities={filteredActivities}
                refresh={refreshActivities}
              />
            </div>
          )}

          {activeTab === "ratings" && (
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-[0_0_10px_rgba(255,95,0,0.1)]">
              <h2 className="text-lg font-semibold text-[#FF5F00] mb-4">
                Ratings Overview
              </h2>
              <RatingsTable ratings={filteredRatings} refresh={refreshRatings} />
            </div>
          )}

          {activeTab === "refunds" && (
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-[0_0_10px_rgba(255,95,0,0.1)]">
              <h2 className="text-lg font-semibold text-[#FF5F00] mb-4">
                Refund Requests
              </h2>
              <RefundsTable refunds={refunds} refresh={refreshRefunds} />
            </div>
          )}

          {activeTab === "verifications" && (
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-[0_0_10px_rgba(255,95,0,0.1)]">
              <h2 className="text-lg font-semibold text-[#FF5F00] mb-4">
                Account Verifications
              </h2>
              <VerificationsTable verifications={verifications} refresh={refreshVerifications} />
            </div>
          )}

          {activeTab === "reports" && (
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-[0_0_10px_rgba(255,95,0,0.1)]">
              <h2 className="text-lg font-semibold text-[#FF5F00] mb-4">
                User Reports
              </h2>
              <ReportsTable reports={filteredReports} refresh={refreshReports} />
            </div>
          )}

          {activeTab === "support" && (
            <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-6 shadow-[0_0_10px_rgba(255,95,0,0.1)]">
              <h2 className="text-lg font-semibold text-[#FF5F00] mb-4">
                Support Requests
              </h2>
              <SupportRequestsTable
                requests={filteredSupport}
                refresh={refreshSupportRequests}
              />
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default AdminDashboard;
