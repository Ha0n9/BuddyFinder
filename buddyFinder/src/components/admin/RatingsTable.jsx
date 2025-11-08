// src/components/admin/RatingsTable.jsx
import React from "react";
import { deleteRating } from "../../services/adminApi";
import { showSuccess } from "../../utils/toast";

export default function RatingsTable({ ratings, refresh }) {
  const handleDelete = async (id) => {
    if (!window.confirm("Remove this rating?")) return;
    await deleteRating(id);
    showSuccess("Rating removed");
    refresh && refresh();
  };

  if (!ratings?.length)
    return (
      <p className="text-center text-gray-500 py-6">
        No ratings found.
      </p>
    );

  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50/60 dark:bg-neutral-950/20">
            <tr className="text-left text-neutral-600 dark:text-neutral-300">
              <th className="p-3">From</th>
              <th className="p-3">To</th>
              <th className="p-3">Stars</th>
              <th className="p-3">Review</th>
              <th className="p-3">Date</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {ratings.map((r) => (
              <tr key={r.id} className="border-t border-neutral-200/60 dark:border-neutral-800">
                <td className="p-3">{r.fromUserName || r.fromUserId}</td>
                <td className="p-3">{r.toUserName || r.toUserId}</td>
                <td className="p-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className={i < (r.stars || r.rating) ? "text-yellow-500" : "text-neutral-300"}>★</span>
                  ))}
                </td>
                <td className="p-3 max-w-[32ch] truncate">{r.review || r.comment}</td>
                <td className="p-3">{r.createdAt?.slice(0,10)}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="px-3 py-1.5 rounded-xl bg-red-600 text-white hover:bg-red-700"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
