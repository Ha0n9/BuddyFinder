// src/services/adminApi.js
import api from "./api";

// Fetch dashboard stats for admin
export const getAdminDashboard = () => {
  return api.get("/admin/dashboard");
};

// Fetch all users (admin)
export const getAllUsers = () => {
  return api.get("/admin/users");
};

// Ban a user by ID
export const banUser = (userId) => {
  return api.post(`/admin/users/${userId}/ban`);
};

// Unban a user by ID
export const unbanUser = (userId) => {
  return api.post(`/admin/users/${userId}/unban`);
};

// Delete a user by ID (admin)
export const deleteUser = (userId) => {
  return api.delete(`/admin/users/${userId}`);
};

// Fetch all activities (admin)
export const getAllActivities = () => {
  return api.get("/admin/activities");
};

// Delete an activity by ID (admin)
export const deleteActivity = (activityId) => {
  return api.delete(`/admin/activities/${activityId}`);
};

// Delete a rating by ID (for admin dashboard)
export async function deleteRating(id) {
  const res = await fetch(`/api/admin/ratings/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete rating");
  return res.json();
}

export default api;