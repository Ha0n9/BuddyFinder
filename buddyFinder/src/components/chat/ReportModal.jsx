import { useState } from 'react';
import { submitReport } from '../../services/api';
import { showError, showSuccess } from '../../utils/toast';

function ReportModal({ isOpen, onClose, targetUser }) {
  const [reason, setReason] = useState('Harassment');
  const [description, setDescription] = useState('');
  const [attachmentUrl, setAttachmentUrl] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen || !targetUser) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      showError('Please provide a description');
      return;
    }
    setSubmitting(true);
    try {
      await submitReport({
        reportedUserId: targetUser.userId || targetUser.id,
        reason,
        description,
        attachmentUrl,
        initialMessage: description,
      });
      showSuccess('Report submitted to admin.');
      setDescription('');
      setAttachmentUrl('');
      onClose();
    } catch (error) {
      console.error('Failed to submit report:', error);
      showError(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 max-w-lg w-full">
        <h3 className="text-xl font-bold text-white mb-2">Report {targetUser.name}</h3>
        <p className="text-sm text-gray-400 mb-4">
          Provide details and optional image link as evidence.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Reason</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#111111] border border-[#2A2A2A] text-white"
            >
              <option>Harassment</option>
              <option>Spam</option>
              <option>Scam</option>
              <option>Inappropriate Content</option>
              <option>Other</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#111111] border border-[#2A2A2A] text-white"
              rows="4"
              placeholder="Describe what happened..."
            />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Image URL (optional)</label>
            <input
              value={attachmentUrl}
              onChange={(e) => setAttachmentUrl(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#111111] border border-[#2A2A2A] text-white"
              placeholder="https://..."
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 py-3 rounded-2xl bg-[#FF5F00] text-white font-bold hover:bg-[#ff7133] disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReportModal;
