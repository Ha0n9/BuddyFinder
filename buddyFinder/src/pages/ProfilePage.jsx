// src/pages/ProfilePage.jsx
import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileEdit from '../components/profile/ProfileEdit';
import PhotoUpload from '../components/profile/PhotoUpload';
import { getUserProfile } from '../services/api';
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
      const response = await getUserProfile();
      setProfile(response.data);
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePhotoUploaded = (newPhotos) => {
    setProfile(prev => ({ ...prev, photos: JSON.stringify(newPhotos) }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={
        <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 py-12 px-4">
          <div className="max-w-2xl mx-auto">
            <ProfileCard />
            <div className="mt-8">
              <PhotoUpload
                userId={user?.userId}
                currentPhotos={profile?.photos ? JSON.parse(profile.photos) : []}
                onPhotoUploaded={handlePhotoUploaded}
              />
            </div>
          </div>
        </div>
      } />
      <Route path="edit" element={<ProfileEdit />} />
    </Routes>
  );
}

export default ProfilePage;