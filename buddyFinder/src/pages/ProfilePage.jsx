// src/pages/ProfilePage.jsx
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
  }, []); // ✅ Only fetch once on mount

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

  // FIX: This callback should only update local profile state
  // PhotoUpload component now manages its own photos independently
  const handlePhotoUploaded = (newPhotos) => {
    console.log('✅ Photos updated callback:', newPhotos);
    // Update local profile state for consistency
    setProfile(prev => {
      if (!prev) return prev;
      return { 
        ...prev, 
        photos: typeof newPhotos === 'string' ? newPhotos : JSON.stringify(newPhotos)
      };
    });
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
          <div className="max-w-2xl mx-auto space-y-8">
            <ProfileCard />
            
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6">
              {/* FIX: Pass user.userId to ensure PhotoUpload fetches correct user's photos */}
              <PhotoUpload
                userId={user?.userId}
                currentPhotos={profile?.photos ? parsePhotos(profile.photos) : []}
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

function parsePhotos(photosJson) {
  if (!photosJson || photosJson === 'null' || photosJson === '[]') {
    return [];
  }
  try {
    if (typeof photosJson === 'string') {
      return JSON.parse(photosJson);
    }
    if (Array.isArray(photosJson)) {
      return photosJson;
    }
    return [];
  } catch (e) {
    console.error('Error parsing photos:', e);
    return [];
  }
}

export default ProfilePage;