import React, { useState } from "react";
import { showSuccess, showError } from "../../utils/toast";

export default function RefundsTable({ refunds, refresh }) {
  const [processingId, setProcessingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'

  const handleApprove = async (refund) => {
    setSelectedRefund(refund);
    setActionType('approve');
    setShowModal(true);
  };

  const handleReject = async (refund) => {
    setSelectedRefund(refund);
    setActionType('reject');
    setShowModal(true);
  };

  const confirmAction = async () => {
    if (!selectedRefund) return;

    setProcessingId(selectedRefund.refundId);
    const token = localStorage.getItem('token');

    try {
      const endpoint = actionType === 'approve' 
        ? `/api/admin/refunds/${selectedRefund.refundId}/approve`
        : `/api/admin/refunds/${selectedRefund.refundId}/reject`;

      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminNotes: adminNotes || null })
      });

      if (!response.ok) throw new Error('Failed to process refund');

      showSuccess(`Refund ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`);
      setShowModal(false);
      setAdminNotes("");
      setSelectedRefund(null);
      refresh();
    } catch (error) {
      console.error('Error processing refund:', error);
      showError('Failed to process refund');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-500/20 text-yellow-300',
      APPROVED: 'bg-blue-500/20 text-blue-300',
      COMPLETED: 'bg-green-500/20 text-green-300',
      REJECTED: 'bg-red-500/20 text-red-300',
      CANCELLED: 'bg-gray-500/20 text-gray-300'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300';
  };

  if (!refunds?.length) {
    return (
      <p className="text-center text-gray-500 py-6">
        No refund requests found.
      </p>
    );
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-neutral-50/60 dark:bg-neutral-950/20">
              <tr className="text-left text-neutral-600 dark:text-neutral-300">
                <th className="p-3">ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Amount</th>
                <th className="p-3">Reason</th>
                <th className="p-3">Status</th>
                <th className="p-3">Requested</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {refunds.map((refund) => (
                <tr key={refund.refundId} className="border-t border-neutral-200/60 dark:border-neutral-800">
                  <td className="p-3">#{refund.refundId}</td>
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{refund.userName}</p>
                      <p className="text-xs text-gray-500">{refund.userEmail}</p>
                    </div>
                  </td>
                  <td className="p-3 font-bold text-[#FF5F00]">${refund.originalAmount}</td>
                  <td className="p-3">
                    <span className="text-xs">{refund.reasonDescription || refund.reason}</span>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(refund.status)}`}>
                      {refund.status}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-gray-500">
                    {new Date(refund.requestedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    {refund.status === 'PENDING' && (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApprove(refund)}
                          disabled={processingId === refund.refundId}
                          className="px-3 py-1.5 rounded-xl bg-green-600 text-white hover:bg-green-700 text-xs font-bold disabled:opacity-50"
                        >
                          {processingId === refund.refundId ? '...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(refund)}
                          disabled={processingId === refund.refundId}
                          className="px-3 py-1.5 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-bold disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                    {refund.status !== 'PENDING' && (
                      <span className="text-xs text-gray-500">
                        {refund.processedByName && `by ${refund.processedByName}`}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              {actionType === 'approve' ? 'Approve Refund' : 'Reject Refund'}
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-400 text-sm mb-2">User: {selectedRefund?.userName}</p>
              <p className="text-gray-400 text-sm mb-2">Amount: ${selectedRefund?.originalAmount}</p>
              <p className="text-gray-400 text-sm">Reason: {selectedRefund?.reasonDescription}</p>
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
                rows="3"
                placeholder="Add notes about this decision..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setAdminNotes("");
                  setSelectedRefund(null);
                }}
                className="flex-1 px-4 py-2 rounded-xl bg-[#2A2A2A] text-white hover:bg-[#3A3A3A] font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmAction}
                className={`flex-1 px-4 py-2 rounded-xl font-bold text-white ${
                  actionType === 'approve' 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm {actionType === 'approve' ? 'Approve' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}