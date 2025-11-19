import { useState } from 'react';
import { submitSupportRequest } from '../../services/api';
import { showError, showSuccess } from '../../utils/toast';
import { Headset, Send } from 'lucide-react';

function EliteSupportBox({ email }) {
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) {
      showError('Let us know what you need help with.');
      return;
    }

    setSubmitting(true);
    try {
      await submitSupportRequest({
        email,
        message: `[Elite Support] ${message.trim()}`,
      });
      showSuccess('Your VIP request is on the way!');
      setMessage('');
    } catch (error) {
      console.error('Elite support failed:', error);
      const msg = error.response?.data?.message || 'Failed to contact support.';
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#1A1A1A]/70 border border-[#FF5F00]/30 rounded-3xl shadow-md p-6">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-3 rounded-2xl bg-[#FF5F00]/20 text-[#FF5F00]">
          <Headset className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm uppercase tracking-wide text-[#FF5F00] font-semibold">Elite Only</p>
          <h2 className="text-xl font-bold text-white mt-1">Priority Support</h2>
          <p className="text-sm text-gray-400 mt-1">
            Reach our concierge team directly for account, billing, or safety help.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows="4"
          placeholder="Describe your issue or request..."
          className="w-full px-4 py-3 rounded-2xl bg-[#0F0F0F] border border-[#2A2A2A] text-white placeholder-gray-500 focus:border-[#FF5F00] focus:ring-1 focus:ring-[#FF5F00]"
          disabled={submitting}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#FF5F00] text-white font-semibold hover:bg-[#ff7133] transition disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
          {submitting ? 'Sending...' : 'Send to Support'}
        </button>
      </form>
    </div>
  );
}

export default EliteSupportBox;
