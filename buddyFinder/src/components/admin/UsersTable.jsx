// src/components/admin/UsersTable.jsx
import React, { useState } from "react";
import {
  banUser,
  unbanUser,
  deleteUser,
} from "../../services/adminApi";
import BanUserModal from "./BanUserModal";

const UsersTable = ({ users, refresh }) => {
  const [banDays, setBanDays] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [banReason, setBanReason] = useState({});

  const handleBan = async (id) => {
    setSelectedUser(users.find((u) => u.userId === id));
    setModalOpen(true);
  };

  const confirmBan = async ({ days, reason }) => {
    if (!selectedUser) return;
    await banUser(selectedUser.userId, days, reason);
    setModalOpen(false);
    refresh();
  };

  const handleUnban = async (id) => {
    if (!window.confirm("Unban this user?")) return;
    await unbanUser(id);
    refresh();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this user permanently?")) return;
    await deleteUser(id);
    refresh();
  };

  if (!users?.length) {
    return <p className="text-center text-gray-400">No users found.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3 text-left">Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Role</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            console.log("User id:", u.userId);
            return (
              <tr key={u.userId} className="border-t dark:border-gray-700">
                <td className="p-2">{u.name}</td>
                <td>{u.email}</td>
                <td>{u.isActive ? "Active" : "Banned"}</td>
                <td>{u.isAdmin ? "Admin" : "User"}</td>
                <td className="flex flex-col items-center gap-2 py-2 sm:flex-row sm:justify-center">
                  {u.isActive ? (
                    <>
                      <button
                        onClick={() => handleBan(u.userId)}
                        className="px-3 py-1 bg-red-500 text-white rounded"
                      >
                        Ban
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleUnban(u.userId)}
                      className="px-3 py-1 bg-green-500 text-white rounded"
                    >
                      Unban
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(u.userId)}
                    className="px-3 py-1 bg-gray-500 text-white rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <BanUserModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={selectedUser}
        onConfirm={confirmBan}
      />
    </div>
  );
};

export default UsersTable;
