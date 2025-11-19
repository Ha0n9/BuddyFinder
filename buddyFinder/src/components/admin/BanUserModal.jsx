import { useState } from 'react';

function BanUserModal({ isOpen, onClose, onConfirm, user }) {
  const [days, setDays] = useState('3');
  const [reason, setReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setSubmitting(true);
    try {
      await onConfirm({ days: Number(days), reason });
      setDays('3');
      setReason('');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[3000] flex items-center justify-center px-4">
      <div className="bg-[#121212] w-full max-w-md rounded-3xl border border-[#2A2A2A] p-6">
        <h3 className="text-xl font-bold text-white mb-2">Ban User {user?.name}</h3>
        <p className="text-sm text-gray-400 mb-4">
          Specify how long the ban should last and why you are taking action.
        </p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm text-gray-300 mb-1">Ban Duration</label>
            <select
              value={days}
              onChange={(e) => setDays(e.target.value)}
              className="w-full p-3 rounded-2xl bg-[#111111] border border-[#2A2A2A] text-white"
            >
              <option value="3">Ban 3 days</option>
              <option value="5">Ban 5 days</option>
              <option value="7">Ban 7 days</option>
              <option value="0">Permanent ban</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Reason / Admin Notes</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows="4"
              className="w-full p-3 rounded-2xl bg-[#111111] border border-[#2A2A2A] text-white"
              placeholder="Explain the policy violation ..."
            />
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-2xl bg-[#2A2A2A] text-white hover:bg-[#3A3A3A]"
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 py-3 rounded-2xl bg-red-600 text-white font-bold hover:bg-red-500 disabled:opacity-50"
              disabled={submitting}
            >
              {submitting ? 'Banning...' : 'Confirm Ban'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BanUserModal;
