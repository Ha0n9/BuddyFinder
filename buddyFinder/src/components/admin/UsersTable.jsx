// src/components/admin/UsersTable.jsx
import React from "react";
import {
  banUser,
  unbanUser,
  deleteUser,
} from "../../services/adminApi";

const UsersTable = ({ users, refresh }) => {
  const handleBan = async (id) => {
    if (!window.confirm("Are you sure you want to ban this user?")) return;
    await banUser(id);
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
                <td className="flex justify-center gap-2 py-2">
                  {u.isActive ? (
                    <button
                      onClick={() => handleBan(u.userId)}
                      className="px-3 py-1 bg-red-500 text-white rounded"
                    >
                      Ban
                    </button>
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
    </div>
  );
};

export default UsersTable;
