// src/components/admin/ActivitiesTable.jsx
// import React from "React";
import { deleteActivity } from "../../services/adminApi";
import { showSuccess } from "../../utils/toast";

const ActivitiesTable = ({ activities, refresh }) => {
  const handleDelete = async (id) => {
    if (!confirm("Delete this activity?")) return;
    await deleteActivity(id);
    showSuccess("Activity deleted");
    refresh();
  };

  if (!activities?.length)
    return <p className="text-center text-gray-400">No activities found.</p>;

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3 text-left">Title</th>
            <th>Location</th>
            <th>Creator</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {activities.map((a) => (
            <tr key={a.id /* or a.activityId depending your backend */} className="border-t dark:border-gray-700">
              <td className="p-2">{a.title}</td>
              <td>{a.location}</td>
              <td>{a.creator?.name}</td>
              <td className="text-center">
                <button
                  onClick={() => handleDelete(a.id)}
                  className="px-3 py-1 bg-gray-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ActivitiesTable;
