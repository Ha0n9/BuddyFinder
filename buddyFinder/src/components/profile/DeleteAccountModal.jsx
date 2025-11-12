// src/components/profile/DeleteAccountModal.jsx
import { useState } from 'react';
import { X, AlertTriangle, Trash2, Eye, EyeOff } from 'lucide-react';
import { deleteAccount } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../../utils/toast';

function DeleteAccountModal({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [confirmText, setConfirmText] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1); // 1: Warning, 2: Confirmation
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (confirmText !== 'DELETE MY ACCOUNT') {
      showError('Please type "DELETE MY ACCOUNT" to confirm');
      return;
    }

    if (!password.trim()) {
      showError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      await deleteAccount(password);
      showSuccess('Account deleted successfully');
      
      // Clear all data and logout
      logout();
      localStorage.clear();
      sessionStorage.clear();
      
      // Redirect to register page after a short delay
      setTimeout(() => {
        navigate('/register');
      }, 1500);
    } catch (error) {
      console.error('Delete account error:', error);
      if (error.response?.status === 401) {
        showError('Incorrect password');
      } else {
        showError(error.response?.data?.message || 'Failed to delete account');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setPassword('');
      setConfirmText('');
      setStep(1);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl max-w-lg w-full p-8 relative shadow-2xl">
        {/* Close Button */}
        {!loading && (
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        )}

        {step === 1 ? (
          // Step 1: Warning
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">Delete Account?</h2>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-300">
                Are you sure you want to permanently delete your BuddyFinder account?
              </p>

              <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 space-y-2">
                <p className="text-red-400 font-bold text-sm">⚠️ This action cannot be undone!</p>
                <ul className="text-sm text-gray-300 space-y-1 ml-4">
                  <li>• Your profile and photos will be permanently deleted</li>
                  <li>• All your matches and conversations will be removed</li>
                  <li>• Your activities and ratings will be deleted</li>
                  <li>• You will lose your Premium benefits (if any)</li>
                  <li>• All your personal data will be erased from our system</li>
                </ul>
              </div>

              <p className="text-gray-400 text-sm">
                In accordance with GDPR, all your personal data will be permanently removed from our servers within 30 days.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleClose}
                className="flex-1 bg-[#2A2A2A] hover:bg-[#333] text-white px-6 py-3 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => setStep(2)}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_12px_rgba(239,68,68,0.4)] transition-all flex items-center justify-center gap-2"
              >
                <Trash2 className="w-5 h-5" />
                Continue
              </button>
            </div>
          </>
        ) : (
          // Step 2: Confirmation
          <>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center">
                <Trash2 className="w-6 h-6 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-white">Final Confirmation</h2>
            </div>

            <div className="space-y-4 mb-6">
              <p className="text-gray-300">
                To confirm deletion, please type <span className="text-red-500 font-bold">DELETE MY ACCOUNT</span> below:
              </p>

              <input
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="DELETE MY ACCOUNT"
                className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                disabled={loading}
              />

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-[#111] border border-[#2A2A2A] rounded-xl px-4 py-3 pr-12 text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-colors"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep(1)}
                disabled={loading}
                className="flex-1 bg-[#2A2A2A] hover:bg-[#333] text-white px-6 py-3 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Back
              </button>
              <button
                onClick={handleDelete}
                disabled={loading || !password || confirmText !== 'DELETE MY ACCOUNT'}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_12px_rgba(239,68,68,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete Forever
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DeleteAccountModal;