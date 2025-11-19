import { useState, useEffect } from "react";
import { getReferralInfo } from "../../services/api";
import { Copy } from "lucide-react";

export default function InviteFriendModal({ isOpen, onClose }) {
  const [referral, setReferral] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) fetchReferral();
  }, [isOpen]);

  const fetchReferral = async () => {
    try {
      setLoading(true);
      const data = await getReferralInfo();
      setReferral(data);
    } catch (e) {
      console.error("Failed to fetch referral info:", e);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-6 w-full max-w-md shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">🎁 Invite Friends</h2>

        {loading ? (
          <p className="text-gray-400 text-center">Loading...</p>
        ) : referral ? (
          <>
            {referral.featureLocked ? (
              <div className="mb-4 bg-green-500/10 border border-green-500/40 rounded-xl p-4 text-sm text-white">
                <p className="font-semibold mb-1">Referral challenge completed 🎉</p>
                <p className="text-gray-300">
                  You've already invited 3 friends and unlocked the reward. This perk can only be used once.
                </p>
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-1">Your unique referral link:</p>
                  <div className="flex items-center justify-between bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg p-2">
                    <span className="text-sm text-gray-300 truncate">
                      {referral.referralLink}
                    </span>
                    <button
                      onClick={() => copyToClipboard(referral.referralLink)}
                      className="ml-2 text-[#FF5F00] hover:text-[#ff7133]"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-gray-400 text-sm mb-1">Your referral code:</p>
                  <div className="flex items-center justify-between bg-[#0F0F0F] border border-[#2A2A2A] rounded-lg p-2">
                    <span className="text-sm text-gray-300">{referral.referralCode}</span>
                    <button
                      onClick={() => copyToClipboard(referral.referralCode)}
                      className="ml-2 text-[#FF5F00] hover:text-[#ff7133]"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>
              </>
            )}

            <div className="text-sm text-gray-400 mb-4">
              <p>Invited: {referral.totalInvited}</p>
              <p>Accepted: {referral.acceptedCount}</p>
            </div>

            <div className="flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-[#FF5F00] hover:bg-[#ff7133] text-white font-semibold rounded-lg"
              >
                Close
              </button>
            </div>
          </>
        ) : (
          <p className="text-gray-400 text-center">Unable to load referral info</p>
        )}
      </div>
    </div>
  );
}
