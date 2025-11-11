// src/services/adminApi.js
import api from "./api";

// ============ DASHBOARD ============
export const getAdminDashboard = () => {
  return api.get("/admin/dashboard");
};

// ============ USERS ============
export const getAllUsers = () => {
  return api.get("/admin/users");
};

export const banUser = (userId) => {
  return api.post(`/admin/users/${userId}/ban`);
};

export const unbanUser = (userId) => {
  return api.post(`/admin/users/${userId}/unban`);
};

export const deleteUser = (userId) => {
  return api.delete(`/admin/users/${userId}`);
};

// ============ ACTIVITIES ============
export const getAllActivities = () => {
  return api.get("/admin/activities");
};

export const deleteActivity = (activityId) => {
  return api.delete(`/admin/activities/${activityId}`);
};

// ============ RATINGS ============
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

// ============ REFUNDS ============
export const getAllRefunds = () => {
  return api.get("/admin/refunds");
};

export const getPendingRefunds = () => {
  return api.get("/admin/refunds/pending");
};

export const approveRefund = (refundId, adminNotes) => {
  return api.put(`/admin/refunds/${refundId}/approve`, { adminNotes });
};

export const rejectRefund = (refundId, adminNotes) => {
  return api.put(`/admin/refunds/${refundId}/reject`, { adminNotes });
};

// ============ VERIFICATIONS ============
export const getAllVerifications = () => {
  return api.get("/verification/admin/all");
};

export const getPendingVerifications = () => {
  return api.get("/verification/admin/pending");
};

export const approveVerification = (verificationId, adminNotes) => {
  return api.put(`/verification/admin/${verificationId}/approve`, { adminNotes });
};

export const rejectVerification = (verificationId, adminNotes) => {
  return api.put(`/verification/admin/${verificationId}/reject`, { adminNotes });
};

export default api;