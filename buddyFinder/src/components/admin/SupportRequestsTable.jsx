import { useState } from 'react';
import { updateSupportRequestStatus } from '../../services/adminApi';

const statusColors = {
  OPEN: 'bg-yellow-500/20 text-yellow-300',
  IN_REVIEW: 'bg-blue-500/20 text-blue-300',
  RESOLVED: 'bg-green-500/20 text-green-300',
};

function SupportRequestsTable({ requests, refresh }) {
  const [processingId, setProcessingId] = useState(null);

  const handleUpdate = async (requestId, status) => {
    setProcessingId(requestId);
    try {
      await updateSupportRequestStatus(requestId, { status });
      refresh();
    } finally {
      setProcessingId(null);
    }
  };

  if (!requests?.length) {
    return <p className="text-center text-gray-400">No support tickets.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full table-auto border-collapse border border-gray-200 dark:border-gray-700">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-3 text-left">Email</th>
            <th>Message</th>
            <th>Status</th>
            <th>Submitted</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((req) => (
            <tr key={req.requestId} className="border-t dark:border-gray-700">
              <td className="p-2 text-sm">{req.email}</td>
              <td className="text-sm max-w-xs whitespace-pre-line">{req.message}</td>
              <td className="text-center">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[req.status] || 'bg-gray-600 text-white'}`}>
                  {req.status}
                </span>
              </td>
              <td className="text-sm text-gray-400">
                {req.createdAt ? new Date(req.createdAt).toLocaleString() : '-'}
              </td>
              <td className="flex justify-center gap-2 p-2 flex-wrap">
                {req.status !== 'OPEN' && (
                  <button
                    className="px-3 py-1 text-xs rounded bg-yellow-600 text-white"
                    disabled={processingId === req.requestId}
                    onClick={() => handleUpdate(req.requestId, 'OPEN')}
                  >
                    Reopen
                  </button>
                )}
                {req.status !== 'IN_REVIEW' && (
                  <button
                    className="px-3 py-1 text-xs rounded bg-blue-600 text-white"
                    disabled={processingId === req.requestId}
                    onClick={() => handleUpdate(req.requestId, 'IN_REVIEW')}
                  >
                    In Review
                  </button>
                )}
                {req.status !== 'RESOLVED' && (
                  <button
                    className="px-3 py-1 text-xs rounded bg-green-600 text-white"
                    disabled={processingId === req.requestId}
                    onClick={() => handleUpdate(req.requestId, 'RESOLVED')}
                  >
                    Resolve
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default SupportRequestsTable;
