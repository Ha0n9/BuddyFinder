import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { ArrowLeft, DollarSign, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { showSuccess, showError } from '../utils/toast';

function RefundPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    refundMethod: 'ORIGINAL_PAYMENT',
    refundType: 'FULL',
    reason: 'NOT_SATISFIED',
    description: '',
    originalTransId: '',
  });

  // Auto-calculate refund amount based on tier
    const getRefundAmount = () => {
        switch (user?.tier) {
            case 'PREMIUM':
            return 9.99;
            case 'ELITE':
            return 19.99;
            default:
            return 0;
        }
    };

    // 🔒 Restrict Refund Page for Free Users
    if (user?.tier === 'FREE') {
    return (
        <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-center text-white p-8">
        <div>
            <h1 className="text-3xl font-bold mb-4 text-[#FF5F00]">Refunds Unavailable</h1>
            <p className="text-gray-400">
            You are currently on a Free plan and have no eligible payments to refund.
            </p>
        </div>
        </div>
    );
    }


  useEffect(() => {
    fetchMyRefunds();
  }, []);

  const fetchMyRefunds = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/refunds/my', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch refunds');
      
      const data = await response.json();
      setRefunds(data);
    } catch (error) {
      console.error('Error fetching refunds:', error);
      showError('Failed to load refund history');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.description.trim()) {
      showError('Please provide a description');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Create refund request
      const requestBody = {
        subId: null, // Mock subscription ID
        refundMethod: formData.refundMethod,
        originalAmount: getRefundAmount(),
        refundType: formData.refundType,
        reason: formData.reason,
        description: formData.description,
        originalTransId: formData.originalTransId || `MOCK-TRANS-${Date.now()}`,
        paymentGateway: 'MOCK_GATEWAY',
      };

      const response = await fetch('http://localhost:8080/api/refunds', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit refund request');
      }

      showSuccess('Refund request submitted successfully!');
      
      // Reset form
      setFormData({
        refundMethod: 'ORIGINAL_PAYMENT',
        refundType: 'FULL',
        reason: 'NOT_SATISFIED',
        description: '',
        originalTransId: '',
      });
      
      setShowRequestForm(false);
      fetchMyRefunds();
    } catch (error) {
      console.error('Error submitting refund:', error);
      showError(error.message || 'Failed to submit refund request');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      UNDER_REVIEW: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      APPROVED: 'bg-green-500/20 text-green-300 border-green-500/30',
      COMPLETED: 'bg-green-600/20 text-green-400 border-green-600/30',
      REJECTED: 'bg-red-500/20 text-red-300 border-red-500/30',
      CANCELLED: 'bg-gray-500/20 text-gray-300 border-gray-500/30',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-300';
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: '⏳',
      UNDER_REVIEW: '🔍',
      APPROVED: '✅',
      COMPLETED: '💰',
      REJECTED: '❌',
      CANCELLED: '🚫',
    };
    return icons[status] || '📋';
  };

  if (loading && refunds.length === 0) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#FF5F00]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-12 px-4 text-white">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-400 hover:text-[#FF5F00] hover:bg-[#1A1A1A] rounded-full transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-[#FF5F00]">Refund Center</h1>
              <p className="text-gray-400 text-sm mt-1">Manage your refund requests</p>
            </div>
          </div>

          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="bg-[#FF5F00] hover:bg-[#ff7133] text-white px-6 py-3 rounded-xl font-bold shadow-[0_4px_12px_rgba(255,95,0,0.4)] transition-all flex items-center gap-2"
          >
            <DollarSign className="w-5 h-5" />
            {showRequestForm ? 'Cancel' : 'Request Refund'}
          </button>
        </div>

        {/* Refund Request Form */}
        {showRequestForm && (
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 mb-8 shadow-[0_0_20px_rgba(255,95,0,0.15)]">
            <h2 className="text-xl font-bold text-white mb-6">Submit Refund Request</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Auto Refund Amount Display */}
                <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4 flex items-center justify-between">
                <span className="text-gray-300 text-sm font-medium">
                    Refund Amount (based on your plan)
                </span>
                <span className="text-white font-bold text-lg">
                    ${getRefundAmount().toFixed(2)}
                </span>
                </div>


              {/* Refund Type */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Refund Type *
                </label>
                <select
                  name="refundType"
                  value={formData.refundType}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
                >
                  <option value="FULL">Full Refund</option>
                  <option value="PARTIAL">Partial Refund</option>
                </select>
              </div>

              {/* Refund Method */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Refund Method *
                </label>
                <select
                  name="refundMethod"
                  value={formData.refundMethod}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
                >
                  <option value="ORIGINAL_PAYMENT">Original Payment Method</option>
                  <option value="CREDIT">Account Credit</option>
                  <option value="BANK_TRANSFER">Bank Transfer</option>
                </select>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Reason *
                </label>
                <select
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] text-white focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
                >
                  <option value="NOT_SATISFIED">Not satisfied with service</option>
                  <option value="TECHNICAL_ISSUES">Technical issues</option>
                  <option value="ACCIDENTAL_PURCHASE">Accidental purchase</option>
                  <option value="DUPLICATE_CHARGE">Duplicate charge</option>
                  <option value="SERVICE_NOT_AVAILABLE">Service not available</option>
                  <option value="PRIVACY_CONCERNS">Privacy concerns</option>
                  <option value="OTHER">Other reason</option>
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  className="w-full p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
                  rows="4"
                  placeholder="Please provide details about your refund request..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.description.length}/500 characters
                </p>
              </div>

              {/* Info Box */}
              <div className="bg-[#FF5F00]/10 border border-[#FF5F00]/40 rounded-xl p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-[#FF5F00] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-300">
                  <p className="font-medium mb-1">Please note:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Refund requests are typically processed within 3-5 business days</li>
                    <li>• You'll receive a notification once your request is reviewed</li>
                    <li>• Mock payment system - refunds are instant for demonstration</li>
                  </ul>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#FF5F00] hover:bg-[#ff7133] text-white font-bold py-4 rounded-xl shadow-[0_4px_12px_rgba(255,95,0,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Refund Request'}
              </button>
            </form>
          </div>
        )}

        {/* Refund History */}
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 shadow-[0_0_20px_rgba(255,95,0,0.15)]">
          <h2 className="text-xl font-bold text-white mb-6">Refund History</h2>

          {refunds.length === 0 ? (
            <div className="text-center py-12">
              <DollarSign className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 text-lg">No refund requests yet</p>
              <p className="text-gray-500 text-sm mt-2">
                Submit a refund request if you need to return a payment
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {refunds.map((refund) => (
                <div
                  key={refund.refundId}
                  className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-5 hover:border-[#FF5F00]/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{getStatusIcon(refund.status)}</div>
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-white">
                            ${refund.originalAmount}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(refund.status)}`}>
                            {refund.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-400">
                          Refund ID: #{refund.refundId}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Refund Method</p>
                      <p className="text-sm text-gray-300">{refund.refundMethod.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Type</p>
                      <p className="text-sm text-gray-300">{refund.refundType}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Reason</p>
                      <p className="text-sm text-gray-300">{refund.reason.replace(/_/g, ' ')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Requested</p>
                      <p className="text-sm text-gray-300">
                        {new Date(refund.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {refund.description && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Description</p>
                      <p className="text-sm text-gray-300 bg-[#0B0B0B] p-3 rounded-lg">
                        {refund.description}
                      </p>
                    </div>
                  )}

                  {refund.adminNotes && (
                    <div className="bg-[#FF5F00]/10 border border-[#FF5F00]/30 rounded-lg p-3">
                      <p className="text-xs text-[#FF5F00] font-bold mb-1">Admin Response:</p>
                      <p className="text-sm text-gray-300">{refund.adminNotes}</p>
                    </div>
                  )}

                  {refund.processedAt && (
                    <div className="mt-3 pt-3 border-t border-[#2A2A2A]">
                      <p className="text-xs text-gray-500">
                        Processed on {new Date(refund.processedAt).toLocaleString()}
                        {refund.processedByName && ` by ${refund.processedByName}`}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RefundPage;
