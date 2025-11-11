import { useState } from 'react';
import { X, Upload, FileText, Shield, Loader, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { showError, showSuccess } from '../../utils/toast';

function VerificationModal({ isOpen, onClose, onSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [documentType, setDocumentType] = useState('POLICE_REPORT'); // POLICE_REPORT or PERSONAL_ID

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      showError('Please select an image or PDF file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      showError('File too large (max 10MB)');
      return;
    }

    setSelectedFile(file);

    // Create preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      showError('Please select a document to upload');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('document', selectedFile);
      formData.append('documentType', documentType);

      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:8080/api/verification/submit',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      showSuccess('Verification request submitted successfully!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Verification submission failed:', error);
      showError(error.response?.data?.message || 'Failed to submit verification request');
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      setSelectedFile(null);
      setPreviewUrl(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl max-w-lg w-full shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2A2A2A]">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#FF5F00]/20 rounded-xl">
              <Shield className="w-6 h-6 text-[#FF5F00]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Account Verification</h2>
              <p className="text-xs text-gray-400">Upload your verification document</p>
            </div>
          </div>
          <button
            onClick={handleClose}
            disabled={uploading}
            className="p-2 hover:bg-[#2A2A2A] rounded-xl transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Document Type Selection */}
          <div>
            <label className="block text-white text-sm font-medium mb-3">
              Document Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDocumentType('POLICE_REPORT')}
                disabled={uploading}
                className={`p-4 rounded-xl border-2 transition-all ${
                  documentType === 'POLICE_REPORT'
                    ? 'border-[#FF5F00] bg-[#FF5F00]/10'
                    : 'border-[#2A2A2A] hover:border-[#3A3A3A]'
                }`}
              >
                <FileText className="w-6 h-6 mx-auto mb-2 text-[#FF5F00]" />
                <p className="text-sm font-medium text-white">Police Report</p>
              </button>
              <button
                onClick={() => setDocumentType('PERSONAL_ID')}
                disabled={uploading}
                className={`p-4 rounded-xl border-2 transition-all ${
                  documentType === 'PERSONAL_ID'
                    ? 'border-[#FF5F00] bg-[#FF5F00]/10'
                    : 'border-[#2A2A2A] hover:border-[#3A3A3A]'
                }`}
              >
                <Shield className="w-6 h-6 mx-auto mb-2 text-[#FF5F00]" />
                <p className="text-sm font-medium text-white">Personal ID</p>
              </button>
            </div>
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-white text-sm font-medium mb-3">
              Upload Document
            </label>
            {!selectedFile ? (
              <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-[#2A2A2A] rounded-xl cursor-pointer bg-[#111111] hover:border-[#FF5F00] hover:shadow-[0_0_25px_rgba(255,95,0,0.2)] transition-all duration-300">
                <div className="text-center">
                  <Upload className="w-10 h-10 mx-auto mb-3 text-[#FF5F00]" />
                  <span className="text-white font-medium">Click to upload</span>
                  <p className="text-gray-400 text-xs mt-2">
                    Max 10MB • JPG, PNG, PDF
                  </p>
                </div>
                <input
                  type="file"
                  accept="image/*,.pdf"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="border-2 border-[#2A2A2A] rounded-xl p-4 bg-[#111111]">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-48 object-contain rounded-lg mb-3"
                  />
                ) : (
                  <div className="flex items-center justify-center h-48 bg-[#1A1A1A] rounded-lg mb-3">
                    <FileText className="w-12 h-12 text-gray-500" />
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-white truncate max-w-[250px]">
                      {selectedFile.name}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    disabled={uploading}
                    className="text-red-500 hover:text-red-400 text-sm font-medium"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Info Box */}
          <div className="bg-[#FF5F00]/10 border border-[#FF5F00]/30 rounded-xl p-4">
            <p className="text-sm text-gray-300">
              <strong className="text-[#FF5F00]">Important:</strong> Your document will be reviewed by our admin team. 
              You'll receive a notification once your verification is processed.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-[#2A2A2A] flex gap-3">
          <button
            onClick={handleClose}
            disabled={uploading}
            className="flex-1 px-4 py-3 rounded-xl bg-[#2A2A2A] text-white hover:bg-[#3A3A3A] font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={uploading || !selectedFile}
            className="flex-1 px-4 py-3 rounded-xl bg-[#FF5F00] text-white hover:bg-[#ff7133] font-bold shadow-[0_4px_12px_rgba(255,95,0,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5" />
                <span>Submit Verification</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerificationModal;