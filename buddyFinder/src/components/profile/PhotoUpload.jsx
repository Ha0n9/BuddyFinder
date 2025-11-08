import { useState, useEffect } from 'react';
import { Camera, X, Loader } from 'lucide-react';
import axios from 'axios';
import { showError, showSuccess } from '../../utils/toast';

function PhotoUpload({ userId, currentPhotos, onPhotoUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserPhotos();
  }, [userId]);

  const fetchUserPhotos = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8080/api/profile', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const photosJson = response.data.photos;
      let parsedPhotos = [];
      if (photosJson && photosJson !== 'null' && photosJson !== '[]') {
        try {
          parsedPhotos = JSON.parse(photosJson);
        } catch (e) {
          console.error('Failed to parse photos:', e);
        }
      }
      setPhotos(parsedPhotos);
    } catch (error) {
      console.error('Failed to fetch photos:', error);
      showError('Failed to load photos');
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) return showError('Please select an image file');
    if (file.size > 10 * 1024 * 1024) return showError('File too large (max 10MB)');

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/profile/upload-photo',
        formData,
        { headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' } }
      );

      const photosJson = response.data.photos;
      const newPhotos =
        photosJson && photosJson !== 'null' && photosJson !== '[]'
          ? JSON.parse(photosJson)
          : [];

      setPhotos(newPhotos);
      onPhotoUploaded?.(newPhotos);
      showSuccess('Photo uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      showError(error.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeletePhoto = async (photoUrl) => {
    if (!confirm('Delete this photo?')) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(
        'http://localhost:8080/api/profile/delete-photo',
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { photoUrl },
        }
      );

      const photosJson = response.data.photos;
      const newPhotos =
        photosJson && photosJson !== 'null' && photosJson !== '[]'
          ? JSON.parse(photosJson)
          : [];

      setPhotos(newPhotos);
      onPhotoUploaded?.(newPhotos);
      showSuccess('Photo deleted!');
    } catch (error) {
      console.error('Delete failed:', error);
      showError(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-8 h-8 text-[#FF5F00] animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 text-white">
        My Photos ({photos.length}/6)
      </h3>

      {/* PHOTO GRID */}
      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {photos.map((url, index) => (
            <div
              key={index}
              className="relative aspect-square overflow-hidden rounded-xl border border-transparent
                         hover:border-[#FF5F00] hover:shadow-[0_0_25px_rgba(255,95,0,0.6)]
                         transform hover:scale-[1.04] transition-all duration-300 group"
            >
              {/* Image */}
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/150?text=Error';
                }}
              />

              {/* Overlay (mờ nhẹ khi hover) */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />

              {/* Delete Button */}
              <button
                onClick={() => handleDeletePhoto(url)}
                className="absolute top-2 right-2 bg-[#FF5F00] text-black p-1.5 rounded-full
                          hover:bg-[#E95000] hover:shadow-[0_0_12px_rgba(255,95,0,0.6)]
                          transition-all duration-200 active:scale-95"
                title="Delete photo"
              >
                <X className="w-4 h-4" strokeWidth={3} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ADD PHOTO */}
      {photos.length < 6 && (
        <label
          className="flex items-center justify-center w-full h-32 border-2 border-dashed border-[#2A2A2A]
                     rounded-xl cursor-pointer bg-[#1A1A1A]/80 hover:border-[#FF5F00]
                     hover:shadow-[0_0_25px_rgba(255,95,0,0.6)] transition-all duration-300"
        >
          <div className="text-center">
            {uploading ? (
              <>
                <Loader className="w-8 h-8 mx-auto mb-2 text-[#FF5F00] animate-spin" />
                <span className="text-white">Uploading...</span>
              </>
            ) : (
              <>
                <Camera className="w-8 h-8 mx-auto mb-2 text-[#FF5F00]" />
                <span className="text-white font-medium">Add Photo</span>
                <p className="text-gray-400 text-xs mt-1">Max 10MB • JPG, PNG</p>
              </>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            disabled={uploading}
            className="hidden"
          />
        </label>
      )}

      {/* Hints */}
      {photos.length === 0 && (
        <p className="text-gray-400 text-sm text-center mt-4">
          Add photos to your profile to get more matches!
        </p>
      )}
      {photos.length >= 6 && (
        <p className="text-gray-400 text-sm text-center mt-4">
          Maximum 6 photos reached. Delete a photo to add new ones.
        </p>
      )}
    </div>
  );
}

export default PhotoUpload;
