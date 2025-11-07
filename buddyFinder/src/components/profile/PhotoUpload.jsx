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
      const response = await axios.get(
        'http://localhost:8080/api/profile',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      const photosJson = response.data.photos;
      let parsedPhotos = [];
      
      if (photosJson && photosJson !== 'null' && photosJson !== '[]') {
        try {
          parsedPhotos = JSON.parse(photosJson);
        } catch (e) {
          console.error('Failed to parse photos:', e);
          parsedPhotos = [];
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

    if (!file.type.startsWith('image/')) {
      showError('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      showError('File too large (max 10MB)');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/profile/upload-photo',
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      const photosJson = response.data.photos;
      let newPhotos = [];
      
      if (photosJson && photosJson !== 'null' && photosJson !== '[]') {
        try {
          newPhotos = JSON.parse(photosJson);
        } catch (e) {
          console.error('Failed to parse photos:', e);
          newPhotos = [];
        }
      }

      setPhotos(newPhotos);
      
      if (onPhotoUploaded) {
        onPhotoUploaded(newPhotos);
      }

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
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          data: { photoUrl }
        }
      );

      const photosJson = response.data.photos;
      const newPhotos = photosJson && photosJson !== 'null' && photosJson !== '[]' 
        ? JSON.parse(photosJson) 
        : [];
      
      setPhotos(newPhotos);

      if (onPhotoUploaded) {
        onPhotoUploaded(newPhotos);
      }

      showSuccess('Photo deleted!');
    } catch (error) {
      console.error('Delete failed:', error);
      showError(error.response?.data?.message || 'Delete failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 text-white">
        My Photos ({photos.length}/6)
      </h3>

      {photos.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-4">
          {photos.map((url, index) => (
            <div key={index} className="relative aspect-square">
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                className="w-full h-full object-cover rounded-lg"
                onError={(e) => {
                  console.error('Image load error:', url);
                  e.target.src = 'https://via.placeholder.com/150?text=Error';
                }}
              />
              <button
                onClick={() => handleDeletePhoto(url)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                title="Delete photo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {photos.length < 6 && (
        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-white border-opacity-30 rounded-lg cursor-pointer hover:border-white hover:border-opacity-50 transition-colors bg-white bg-opacity-10">
          <div className="text-center">
            {uploading ? (
              <>
                <Loader className="w-8 h-8 mx-auto mb-2 text-white animate-spin" />
                <span className="text-white">Uploading...</span>
              </>
            ) : (
              <>
                <Camera className="w-8 h-8 mx-auto mb-2 text-white" />
                <span className="text-white">Add Photo</span>
                <p className="text-white text-xs opacity-70 mt-1">
                  Max 10MB • JPG, PNG
                </p>
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

      {photos.length === 0 && (
        <p className="text-white opacity-70 text-sm text-center mt-4">
          Add photos to your profile to get more matches!
        </p>
      )}

      {photos.length >= 6 && (
        <p className="text-white opacity-70 text-sm text-center mt-4">
          Maximum 6 photos reached. Delete a photo to add new ones.
        </p>
      )}
    </div>
  );
}

export default PhotoUpload;