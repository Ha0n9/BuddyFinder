// src/components/profile/PhotoUpload.jsx
import { useState } from 'react';
import { Camera, X } from 'lucide-react';
import axios from 'axios';

function PhotoUpload({ userId, currentPhotos, onPhotoUploaded }) {
  const [uploading, setUploading] = useState(false);
  const [photos, setPhotos] = useState(currentPhotos || []);

  console.log('📷 Initial photos:', currentPhotos); // DEBUG

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File too large (max 10MB)');
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

      console.log('✅ Upload response:', response.data); // DEBUG

      // Parse photos from response
      const photosJson = response.data.photos;
      console.log('📸 Photos JSON:', photosJson); // DEBUG

      let newPhotos = [];
      
      if (photosJson && photosJson !== 'null' && photosJson !== '[]') {
        try {
          newPhotos = JSON.parse(photosJson);
        } catch (e) {
          console.error('❌ Failed to parse photos:', e);
          newPhotos = [];
        }
      }

      console.log('🖼️ Parsed photos:', newPhotos); // DEBUG

      setPhotos(newPhotos);
      
      if (onPhotoUploaded) {
        onPhotoUploaded(newPhotos);
      }

      alert('Photo uploaded successfully!');
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert('Upload failed: ' + (error.response?.data?.message || error.message));
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
      const newPhotos = photosJson ? JSON.parse(photosJson) : [];
      setPhotos(newPhotos);

      if (onPhotoUploaded) {
        onPhotoUploaded(newPhotos);
      }

      alert('Photo deleted!');
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Delete failed');
    }
  };

  console.log('🎨 Rendering with photos:', photos); // DEBUG

  return (
    <div>
      <h3 className="text-lg font-bold mb-4 text-white">Photos ({photos.length}/6)</h3>

      <div className="grid grid-cols-3 gap-4 mb-4">
        {photos.map((url, index) => (
          <div key={index} className="relative aspect-square">
            <img
              src={url}
              alt={`Photo ${index + 1}`}
              className="w-full h-full object-cover rounded-lg"
              onError={(e) => {
                console.error('❌ Image load error:', url);
                e.target.src = 'https://via.placeholder.com/150?text=Error';
              }}
            />
            <button
              onClick={() => handleDeletePhoto(url)}
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {photos.length < 6 && (
        <label className="flex items-center justify-center w-full h-32 border-2 border-dashed border-white border-opacity-30 rounded-lg cursor-pointer hover:border-white hover:border-opacity-50 transition-colors bg-white bg-opacity-10">
          <div className="text-center">
            <Camera className="w-8 h-8 mx-auto mb-2 text-white" />
            <span className="text-white">
              {uploading ? 'Uploading...' : 'Add Photo'}
            </span>
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
    </div>
  );
}

export default PhotoUpload;