import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileEdit from '../components/profile/ProfileEdit';
import PhotoUpload from '../components/profile/PhotoUpload';
import { getProfile } from '../services/api';
import { useAuthStore } from '../store/authStore';

function ProfilePage() {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0B0B0B]">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF5F00]"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Profile View */}
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
            </div>
          </div>
        }
      />

      {/* Edit Profile */}
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
  );
}

/* ---------------- HELPER ---------------- */
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
