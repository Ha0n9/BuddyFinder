// src/services/adminApi.js
import api from "./api";
import { showError, showSuccess } from "../utils/toast";

// ============ DASHBOARD ============
export const getAdminDashboard = async () => {
  try {
    const res = await api.get("/admin/dashboard");
    return res.data;
  } catch (error) {
    handleAdminError(error, "fetching dashboard stats");
  }
};

// ============ USERS ============
export const getAllUsers = async () => {
  try {
    const res = await api.get("/admin/users");
    return res.data;
  } catch (error) {
    handleAdminError(error, "fetching all users");
  }
};

export const banUser = async (userId) => {
  try {
    const res = await api.post(`/admin/users/${userId}/ban`);
    showSuccess("User has been banned successfully.");
    return res.data;
  } catch (error) {
    handleAdminError(error, "banning user");
  }
};

export const unbanUser = async (userId) => {
  try {
    const res = await api.post(`/admin/users/${userId}/unban`);
    showSuccess("User has been unbanned successfully.");
    return res.data;
  } catch (error) {
    handleAdminError(error, "unbanning user");
  }
};

export const deleteUser = async (userId) => {
  try {
    const res = await api.delete(`/admin/users/${userId}`);
    showSuccess("User deleted successfully.");
    return res.data;
  } catch (error) {
    handleAdminError(error, "deleting user");
  }
};

// ============ ACTIVITIES ============
export const getAllActivities = async () => {
  try {
    const res = await api.get("/admin/activities");
    return res.data;
  } catch (error) {
    handleAdminError(error, "fetching all activities");
  }
};

export const deleteActivity = async (activityId) => {
  try {
    const res = await api.delete(`/admin/activities/${activityId}`);
    showSuccess("Activity deleted successfully.");
    return res.data;
  } catch (error) {
    handleAdminError(error, "deleting activity");
  }
};

// ============ RATINGS ============
export const getAllRatings = async () => {
  try {
    const res = await api.get("/admin/ratings");
    return res.data;
  } catch (error) {
    handleAdminError(error, "fetching all ratings");
  }
};

export const deleteRating = async (id) => {
  try {
    const res = await api.delete(`/admin/ratings/${id}`);
    showSuccess("Rating deleted successfully.");
    return res.data;
  } catch (error) {
    handleAdminError(error, "deleting rating");
  }
};

// ============ REPORTS ============
export const getAllReports = async () => {
  try {
    const res = await api.get("/admin/reports");
    return res.data;
  } catch (error) {
    handleAdminError(error, "fetching reports");
  }
};

export const updateReportStatus = async (reportId, payload) => {
  try {
    const res = await api.post(`/admin/reports/${reportId}/status`, payload);
    showSuccess("Report updated successfully.");
    return res.data;
  } catch (error) {
    handleAdminError(error, "updating report status");
  }
};

export const banReportedUser = async (reportId, payload) => {
  try {
    const res = await api.post(`/admin/reports/${reportId}/ban`, payload);
    showSuccess("User banned successfully.");
    return res.data;
  } catch (error) {
    handleAdminError(error, "banning user");
  }
};

// ============ REFUNDS ============
export const getAllRefunds = async () => {
  try {
    const res = await api.get("/admin/refunds");
    return res.data;
  } catch (error) {
    handleAdminError(error, "fetching all refunds");
  }
};

export const getPendingRefunds = async () => {
  try {
    const res = await api.get("/admin/refunds/pending");
    return res.data;
  } catch (error) {
    handleAdminError(error, "fetching pending refunds");
  }
};

export const approveRefund = async (refundId, adminNotes) => {
  try {
    const res = await api.put(`/admin/refunds/${refundId}/approve`, { adminNotes });
    showSuccess("Refund approved successfully.");
    return res.data;
  } catch (error) {
    handleAdminError(error, "approving refund");
  }
};

export const rejectRefund = async (refundId, adminNotes) => {
  try {
    const res = await api.put(`/admin/refunds/${refundId}/reject`, { adminNotes });
    showSuccess("Refund rejected successfully.");
    return res.data;
  } catch (error) {
    handleAdminError(error, "rejecting refund");
  }
};

// ============ VERIFICATIONS ============
export const getAllVerifications = async () => {
  try {
    const res = await api.get("/verification/admin/all");
    return res.data;
  } catch (error) {
    handleAdminError(error, "fetching verifications");
  }
};

export const getPendingVerifications = async () => {
  try {
    const res = await api.get("/verification/admin/pending");
    return res.data;
  } catch (error) {
    handleAdminError(error, "fetching pending verifications");
  }
};

export const approveVerification = async (verificationId, adminNotes) => {
  try {
    const res = await api.put(`/verification/admin/${verificationId}/approve`, { adminNotes });
    showSuccess("Verification approved successfully.");
    return res.data;
  } catch (error) {
    handleAdminError(error, "approving verification");
  }
};

export const rejectVerification = async (verificationId, adminNotes) => {
  try {
    const res = await api.put(`/verification/admin/${verificationId}/reject`, { adminNotes });
    showSuccess("Verification rejected successfully.");
    return res.data;
  } catch (error) {
    handleAdminError(error, "rejecting verification");
  }
};

// ============ ERROR HANDLER (CHỈ THAY ĐỔI TOAST) ============

// Lưu lỗi gần nhất để chống hiển thị trùng
let lastToastMessage = null;
let lastToastTime = 0;

function handleAdminError(error, action) {
  const now = Date.now();
  const message = error.response?.data?.message || "";

  // Chống hiển thị trùng trong vòng 1 giây
  if (message === lastToastMessage && now - lastToastTime < 1000) {
    return;
  }
  lastToastMessage = message;
  lastToastTime = now;

  // ✅ Hiển thị lỗi theo từng trường hợp cụ thể
  if (error.response?.status === 401) {
    showError("Session expired. Please log in again.");
    localStorage.removeItem("token");
    window.location.href = "/login";
  } else if (error.response?.status === 403) {
    // Nếu chưa đăng nhập hoặc token trống → đừng hiện Access denied
    const token = localStorage.getItem("token");
    if (!token) return;
    showError("Access denied: Admin privileges required.");
  } else if (message.toLowerCase().includes("banned")) {
    // User bị ban → hiện thông báo chính xác
    showError("Your account has been banned. Please contact support.");
  } else if (error.response?.data?.message) {
    // Hiển thị lỗi kèm hành động
    showError(`Error ${action}: ${error.response.data.message}`);
  } else {
    // Lỗi không xác định
    showError(`Unexpected error occurred while ${action}.`);
  }

  // Log đầy đủ cho dev
  console.error(`❌ Admin API error while ${action}:`, error);
}

export default api;
