import { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileEdit from '../components/profile/ProfileEdit';
import PhotoUpload from '../components/profile/PhotoUpload';
import VerificationModal from '../components/profile/VerificationModal';
import InviteFriendModal from '../components/profile/InviteFriendModal';
import DeleteAccountModal from '../components/profile/DeleteAccountModal';
import { DollarSign, Shield, CheckCircle, Users, Trash2 } from 'lucide-react';
// import { Users } from 'lucide-react';
import { getProfile } from '../services/api';
import { useAuthStore } from '../store/authStore';

function ProfilePage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState(null);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchVerificationStatus();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      console.log('📸 Profile data:', response.data);
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVerificationStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/verification/status', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setVerificationStatus(data);
      }
    } catch (error) {
      console.error('Failed to fetch verification status:', error);
    }
  };

  const handlePhotoUploaded = (newPhotos) => {
    console.log('✅ Photos updated callback:', newPhotos);
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        photos: typeof newPhotos === 'string' ? newPhotos : JSON.stringify(newPhotos),
      };
    });
  };

  const handleVerificationSuccess = () => {
    fetchVerificationStatus();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF5F00]"></div>
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <div className="min-h-screen bg-[#0B0B0B] text-white py-12 px-4">
              <div className="max-w-2xl mx-auto space-y-8">
                
                {/* Profile Info */}
                <div className="bg-[#1A1A1A]/70 backdrop-blur-md border border-[#2A2A2A] rounded-3xl shadow-md p-6">
                  <ProfileCard />
                </div>

                {/* Photo Upload */}
                <div className="bg-[#1A1A1A]/70 backdrop-blur-md border border-[#2A2A2A] rounded-3xl shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4 text-white tracking-tight flex items-center gap-2">
                    📸 My Photos
                    <span className="text-xs bg-[#FF5F00] text-black font-bold px-3 py-1 rounded-full">
                      {profile?.photos && profile.photos !== '[]'
                        ? `${parsePhotos(profile.photos).length}/6`
                        : '0/6'}
                    </span>
                  </h2>
                  <PhotoUpload
                    userId={user?.userId}
                    currentPhotos={profile?.photos ? parsePhotos(profile.photos) : []}
                    onPhotoUploaded={handlePhotoUploaded}
                  />
                </div>

                {/* Account Verification Section */}
                <div className="bg-[#1A1A1A]/70 backdrop-blur-md border border-[#2A2A2A] rounded-3xl shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4 text-white tracking-tight flex items-center gap-2">
                    🛡️ Account Verification
                  </h2>
                  
                  {verificationStatus?.status === 'APPROVED' ? (
                    <div className="flex items-center justify-between bg-green-500/10 border border-green-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6 text-green-500" />
                        <div>
                          <p className="font-bold text-white">Verified Account</p>
                          <p className="text-sm text-gray-400">Your account is verified ✓</p>
                        </div>
                      </div>
                      <Shield className="w-8 h-8 text-green-500" />
                    </div>
                  ) : verificationStatus?.status === 'PENDING' ? (
                    <div className="flex items-center justify-between bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                      <div className="flex items-center gap-3">
                        <Shield className="w-6 h-6 text-yellow-500" />
                        <div>
                          <p className="font-bold text-white">Verification Pending</p>
                          <p className="text-sm text-gray-400">Your request is being reviewed</p>
                        </div>
                      </div>
                    </div>
                  ) : verificationStatus?.status === 'REJECTED' ? (
                    <div className="space-y-3">
                      <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Shield className="w-6 h-6 text-red-500" />
                          <p className="font-bold text-white">Verification Rejected</p>
                        </div>
                        {verificationStatus.adminNotes && (
                          <p className="text-sm text-gray-400 ml-9">
                            Reason: {verificationStatus.adminNotes}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setShowVerificationModal(true)}
                        className="w-full flex items-center justify-center gap-2 bg-[#FF5F00] hover:bg-[#ff7133] text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_12px_rgba(255,95,0,0.4)] transition-all"
                      >
                        <Shield className="w-5 h-5" />
                        Resubmit Verification
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4">
                        <p className="text-gray-400 text-sm mb-3">
                          Verify your account to build trust with other users.
                        </p>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#FF5F00]" />
                            Verified badge on your profile
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#FF5F00]" />
                            Increased trust from other users
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-[#FF5F00]" />
                            Better match recommendations
                          </li>
                        </ul>
                      </div>
                      <button
                        onClick={() => setShowVerificationModal(true)}
                        className="w-full flex items-center justify-center gap-2 bg-[#FF5F00] hover:bg-[#ff7133] text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_12px_rgba(255,95,0,0.4)] transition-all"
                      >
                        <Shield className="w-5 h-5" />
                        Verify Account
                      </button>
                    </div>
                  )}
                </div>

                {/* Refund Button */}
                {user?.tier !== 'FREE' && (
                  <div className="bg-[#1A1A1A]/70 backdrop-blur-md border border-[#2A2A2A] rounded-3xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 text-white tracking-tight flex items-center gap-2">
                      💵 Payment & Refund
                    </h2>
                    <div className="flex justify-center">
                      <button
                        onClick={() => navigate('/refund')}
                        className="flex items-center gap-2 bg-[#FF5F00] hover:bg-[#ff7133] text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_12px_rgba(255,95,0,0.4)] transition-all"
                      >
                        <DollarSign className="w-5 h-5" />
                        Request Refund
                      </button>
                    </div>
                  </div>
                )}

                {/* Delete Account Section - GDPR Compliance */}
                <div className="bg-[#1A1A1A]/70 backdrop-blur-md border border-red-500/30 rounded-3xl shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4 text-white tracking-tight flex items-center gap-2">
                    🗑️ Danger Zone
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Once you delete your account, there is no going back. All your data will be permanently removed in accordance with GDPR.
                  </p>
                  <button
                    onClick={() => setShowDeleteModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_12px_rgba(239,68,68,0.4)] transition-all"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete Account
                  </button>
                </div>

                {/* Invite Friends Section */}
                <div className="bg-[#1A1A1A]/70 backdrop-blur-md border border-[#2A2A2A] rounded-3xl shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4 text-white tracking-tight flex items-center gap-2">
                    👥 Invite Friends
                  </h2>
                  <p className="text-sm text-gray-400 mb-4">
                    Invite your friends to join BuddyFinder! Earn rewards when they sign up using your referral link.
                  </p>
                  <button
                    onClick={() => setShowInviteModal(true)}
                    className="w-full flex items-center justify-center gap-2 bg-[#FF5F00] hover:bg-[#ff7133] text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_12px_rgba(255,95,0,0.4)] transition-all"
                  >
                    <Users className="w-5 h-5" />
                    Invite a Friend
                  </button>
                </div>

                <InviteFriendModal
                  isOpen={showInviteModal}
                  onClose={() => setShowInviteModal(false)}
                />

              </div>
            </div>
          }
        />

        <Route
          path="edit"
          element={
            <div className="min-h-screen bg-[#0B0B0B] text-white py-12 px-4">
              <div className="max-w-3xl mx-auto bg-[#1A1A1A]/70 backdrop-blur-md border border-[#2A2A2A] rounded-3xl p-8 shadow-md">
                <h1 className="text-2xl font-bold text-white mb-6 tracking-tight flex items-center gap-2">
                  ✏️ Edit Profile
                </h1>
                <ProfileEdit />
              </div>
            </div>
          }
        />
      </Routes>

      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onSuccess={handleVerificationSuccess}
      />

      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
      />
    </>
  );
}

function parsePhotos(photosJson) {
  if (!photosJson || photosJson === 'null' || photosJson === '[]') return [];
  try {
    if (typeof photosJson === 'string') return JSON.parse(photosJson);
    if (Array.isArray(photosJson)) return photosJson;
    return [];
  } catch (e) {
    console.error('Error parsing photos:', e);
    return [];
  }
}

export default ProfilePage;