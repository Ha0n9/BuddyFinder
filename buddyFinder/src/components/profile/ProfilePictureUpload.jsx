import { useEffect, useState } from 'react';
import { Camera, Loader } from 'lucide-react';
import { uploadProfilePicture } from '../../services/api';
import { useAuthStore } from '../../store/authStore';
import { showError, showSuccess } from '../../utils/toast';

function ProfilePictureUpload({ initialUrl }) {
  const { user, setUser } = useAuthStore();
  const [preview, setPreview] = useState(initialUrl || '');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(initialUrl || '');
  }, [initialUrl]);

  const handleChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showError('Please choose an image file');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showError('File too large (max 10MB)');
      return;
    }

    setUploading(true);
    try {
      const response = await uploadProfilePicture(file);
      const newUrl = response.data?.profilePictureUrl;
      if (newUrl) {
        setPreview(newUrl);
        if (user) {
          setUser({ ...user, profilePictureUrl: newUrl });
        }
        showSuccess('Profile picture updated');
      } else {
        showError('No image URL returned');
      }
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      showError(error.response?.data?.message || 'Failed to upload profile picture');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-32 h-32 rounded-full border-4 border-[#FF5F00]/30 bg-[#1A1A1A] overflow-hidden">
        {preview ? (
          <img src={preview} alt="Profile" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <Camera className="w-10 h-10 mb-2 text-[#FF5F00]" />
            <span className="text-sm">No photo</span>
          </div>
        )}
        {uploading && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <Loader className="w-6 h-6 text-[#FF5F00] animate-spin" />
          </div>
        )}
      </div>

      <label className="px-5 py-2 rounded-full bg-[#FF5F00] text-white font-semibold cursor-pointer hover:bg-[#ff7133] transition">
        {preview ? 'Change Photo' : 'Upload Photo'}
        <input type="file" accept="image/*" onChange={handleChange} className="hidden" disabled={uploading} />
      </label>
      <p className="text-xs text-gray-400 text-center">JPEG or PNG up to 10MB</p>
    </div>
  );
}

export default ProfilePictureUpload;
