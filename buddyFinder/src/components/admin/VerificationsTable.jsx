import React, { useState } from "react";
import { showSuccess, showError } from "../../utils/toast";
import { Eye, CheckCircle, XCircle, FileText } from "lucide-react";

export default function VerificationsTable({ verifications, refresh }) {
  const [processingId, setProcessingId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");
  const [actionType, setActionType] = useState(null); // 'approve' or 'reject'
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleApprove = async (verification) => {
    setSelectedVerification(verification);
    setActionType('approve');
    setShowModal(true);
  };

  const handleReject = async (verification) => {
    setSelectedVerification(verification);
    setActionType('reject');
    setShowModal(true);
  };

  const handleViewDocument = (verification) => {
    setSelectedImage(verification.documentUrl);
    setShowImageModal(true);
  };

  const confirmAction = async () => {
    if (!selectedVerification) return;

    setProcessingId(selectedVerification.verificationId);
    const token = localStorage.getItem('token');

    try {
      const endpoint = actionType === 'approve' 
        ? `/api/verification/admin/${selectedVerification.verificationId}/approve`
        : `/api/verification/admin/${selectedVerification.verificationId}/reject`;

      const response = await fetch(`http://localhost:8080${endpoint}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ adminNotes: adminNotes || null })
      });

      if (!response.ok) throw new Error('Failed to process verification');

      showSuccess(`Verification ${actionType === 'approve' ? 'approved' : 'rejected'} successfully`);
      setShowModal(false);
      setAdminNotes("");
      setSelectedVerification(null);
      refresh();
    } catch (error) {
      console.error('Error processing verification:', error);
      showError('Failed to process verification');
    } finally {
      setProcessingId(null);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-500/20 text-yellow-300',
      APPROVED: 'bg-green-500/20 text-green-300',
      REJECTED: 'bg-red-500/20 text-red-300',
      CANCELLED: 'bg-gray-500/20 text-gray-300'
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300';
  };

  const getDocumentTypeLabel = (type) => {
    const labels = {
      POLICE_REPORT: 'Police Report',
      PERSONAL_ID: 'Personal ID',
      DRIVERS_LICENSE: "Driver's License",
      OTHER: 'Other'
    };
    return labels[type] || type;
  };

  if (!verifications?.length) {
    return (
      <p className="text-center text-gray-500 py-6">
        No verification requests found.
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
                <th className="p-3">Document Type</th>
                <th className="p-3">Status</th>
                <th className="p-3">Submitted</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {verifications.map((verification) => (
                <tr key={verification.verificationId} className="border-t border-neutral-200/60 dark:border-neutral-800">
                  <td className="p-3">#{verification.verificationId}</td>
                  <td className="p-3">
                    <div>
                      <p className="font-medium">{verification.userName}</p>
                      <p className="text-xs text-gray-500">{verification.userEmail}</p>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#FF5F00]" />
                      <span className="text-xs">{getDocumentTypeLabel(verification.documentType)}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${getStatusColor(verification.status)}`}>
                      {verification.status}
                    </span>
                  </td>
                  <td className="p-3 text-xs text-gray-500">
                    {new Date(verification.submittedAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    {verification.status === 'PENDING' ? (
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewDocument(verification)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleApprove(verification)}
                          disabled={processingId === verification.verificationId}
                          className="px-3 py-1.5 rounded-xl bg-green-600 text-white hover:bg-green-700 text-xs font-bold disabled:opacity-50 flex items-center gap-1"
                        >
                          <CheckCircle className="w-4 h-4" />
                          {processingId === verification.verificationId ? '...' : 'Approve'}
                        </button>
                        <button
                          onClick={() => handleReject(verification)}
                          disabled={processingId === verification.verificationId}
                          className="px-3 py-1.5 rounded-xl bg-red-600 text-white hover:bg-red-700 text-xs font-bold disabled:opacity-50 flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-end gap-1">
                        <button
                          onClick={() => handleViewDocument(verification)}
                          className="px-3 py-1.5 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-xs font-bold"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {verification.reviewedByName && (
                          <span className="text-xs text-gray-500">
                            by {verification.reviewedByName}
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Action Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">
              {actionType === 'approve' ? 'Approve Verification' : 'Reject Verification'}
            </h3>
            
            <div className="mb-4">
              <p className="text-gray-400 text-sm mb-2">User: {selectedVerification?.userName}</p>
              <p className="text-gray-400 text-sm mb-2">
                Document: {getDocumentTypeLabel(selectedVerification?.documentType)}
              </p>
            </div>

            <div className="mb-4">
              <label className="block text-white text-sm font-medium mb-2">
                Admin Notes {actionType === 'reject' ? '(Required)' : '(Optional)'}
              </label>
              <textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
                rows="3"
                placeholder={actionType === 'approve' ? "Add notes about this approval..." : "Reason for rejection..."}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setAdminNotes("");
                  setSelectedVerification(null);
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

      {/* Image View Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowImageModal(false)}>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">Verification Document</h3>
                <button
                  onClick={() => setShowImageModal(false)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <img
                src={selectedImage}
                alt="Verification document"
                className="w-full h-auto rounded-xl"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}