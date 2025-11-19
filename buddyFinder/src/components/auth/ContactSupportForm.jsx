import { useState } from 'react';
import { submitSupportRequest } from '../../services/api';
import { showError, showSuccess } from '../../utils/toast';

function ContactSupportForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) {
      showError('Please provide both email and message');
      return;
    }
    setSubmitting(true);
    try {
      await submitSupportRequest({ email: email.trim(), message: message.trim() });
      showSuccess('Thanks! Support will reach out soon.');
      setEmail('');
      setMessage('');
    } catch (error) {
      console.error('Support request failed:', error);
      const msg = error.response?.data?.message || 'Failed to send request';
      showError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#111111] border border-[#2A2A2A] backdrop-blur-sm rounded-3xl p-6 shadow-[0_0_20px_rgba(255,95,0,0.1)] mt-6">
      <h2 className="text-xl font-bold text-[#FF5F00] mb-2 text-center">Need Help?</h2>
      <p className="text-gray-400 text-sm text-center mb-4">
        Contact support if your account was banned or if you need assistance.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5F00]"
            placeholder="you@example.com"
            disabled={submitting}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-1">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows="4"
            className="w-full px-4 py-3 rounded-xl border border-[#2A2A2A] bg-[#0F0F0F] text-white placeholder-gray-500 focus:outline-none focus:border-[#FF5F00]"
            placeholder="Tell us what happened..."
            disabled={submitting}
          />
        </div>
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-xl bg-[#FF5F00] text-white font-semibold hover:bg-[#ff7133] transition disabled:opacity-50"
        >
          {submitting ? 'Sending...' : 'Contact Support'}
        </button>
      </form>
    </div>
  );
}

export default ContactSupportForm;
