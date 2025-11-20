import { useState } from "react";
import {
  createAdminAccount,
  updateAdminAccountRole,
  deleteAdminAccount,
} from "../../services/adminApi";
import { showError } from "../../utils/toast";

const roleOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "SUPER_ADMIN", label: "Super Admin" },
];

function AdminAccountsTable({ accounts = [], refresh, currentUser }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "ADMIN",
  });
  const [creating, setCreating] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || form.password.length < 6) {
      showError("Please fill all fields (password >= 6 chars)");
      return;
    }
    try {
      setCreating(true);
      await createAdminAccount(form);
      setForm({ name: "", email: "", password: "", role: "ADMIN" });
      refresh();
    } finally {
      setCreating(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      setUpdatingId(userId);
      await updateAdminAccountRole(userId, newRole);
      refresh();
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (userId, label) => {
    if (!window.confirm(`Delete admin account ${label}?`)) return;
    setUpdatingId(userId);
    try {
      await deleteAdminAccount(userId);
      refresh();
    } finally {
      setUpdatingId(null);
    }
  };

  const renderRoleBadge = (user) =>
    user.isSuperAdmin ? (
      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 whitespace-nowrap">
        Super Admin
      </span>
    ) : (
      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#FF5F00]/15 text-[#FF5F00] whitespace-nowrap">
        Admin
      </span>
    );

  const isSelf = (user) => currentUser?.userId === user.userId;

  return (
    <div className="space-y-6">
      <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-4 sm:p-6 shadow-lg">
        <h3 className="text-xl font-bold text-[#FF5F00] mb-4">
          Create Admin Account
        </h3>
        <form
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
          onSubmit={handleCreate}
        >
          <input
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Name"
            className="p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-white w-full"
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleInputChange}
            placeholder="Email"
            className="p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-white w-full"
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleInputChange}
            placeholder="Temp password"
            className="p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-white w-full"
          />
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              name="role"
              value={form.role}
              onChange={handleInputChange}
              className="flex-1 p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-white"
            >
              {roleOptions.map((opt) => (
                <option key={opt.value} value={opt.value} className="text-black">
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={creating}
              className="w-full sm:w-auto px-4 py-2 bg-[#FF5F00] rounded-xl text-white font-semibold disabled:opacity-50"
            >
              {creating ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-4 sm:p-6 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h3 className="text-xl font-bold text-white">Admin Accounts</h3>
          <p className="text-sm text-gray-400">
            Total: {accounts.length} administrators
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-left text-gray-400 border-b border-[#2A2A2A]">
                <th className="py-2 pr-4 whitespace-nowrap">Name</th>
                <th className="py-2 pr-4 whitespace-nowrap">Email</th>
                <th className="py-2 pr-4 whitespace-nowrap">Role</th>
                <th className="py-2 pr-4 whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((admin) => (
                <tr key={admin.userId} className="border-b border-[#2A2A2A]">
                  <td className="py-3 pr-4">{admin.name}</td>
                  <td className="pr-4 break-all">{admin.email}</td>
                  <td className="pr-4">{renderRoleBadge(admin)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-2">
                      <select
                        value={admin.isSuperAdmin ? "SUPER_ADMIN" : "ADMIN"}
                        onChange={(e) =>
                          handleRoleChange(admin.userId, e.target.value)
                        }
                        disabled={isSelf(admin) || updatingId === admin.userId}
                        className="p-2 rounded-lg bg-[#1A1A1A] border border-[#2A2A2A] text-white text-xs"
                      >
                        {roleOptions.map((opt) => (
                          <option
                            key={opt.value}
                            value={opt.value}
                            className="text-black"
                          >
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() => handleDelete(admin.userId, admin.name)}
                        disabled={isSelf(admin) || updatingId === admin.userId}
                        className="px-3 py-1 rounded-lg bg-red-500/80 text-white text-xs font-semibold disabled:opacity-40"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {accounts.length === 0 && (
                <tr>
                  <td colSpan={4} className="py-6 text-center text-gray-500">
                    No admin accounts yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminAccountsTable;
