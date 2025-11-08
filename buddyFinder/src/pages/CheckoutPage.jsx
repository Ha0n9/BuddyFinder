// src/pages/CheckoutPage.jsx
import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { processMockPayment, upgradeMockSubscription } from "../services/mockPaymentService";
import { useAuthStore } from "../store/authStore";
import { showSuccess, showError } from "../utils/toast";
import { CreditCard, Calendar, Lock, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const plan = (params.get("plan") || "PREMIUM").toUpperCase();
  const price = plan === "ELITE" ? 19.99 : plan === "PREMIUM" ? 9.99 : 0;
  
  const [agree, setAgree] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: user?.email || '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    
    if (!agree) {
      showError("Please agree to the terms and conditions");
      return;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      showError("Please fill in all required fields");
      return;
    }

    setProcessing(true);

    try {
      // Mock payment processing
      const paymentResult = await processMockPayment(plan, paymentMethod);
      console.log('Payment Result:', paymentResult);

      // Mock subscription upgrade
      const subscriptionResult = await upgradeMockSubscription(user.userId, plan);
      console.log('Subscription Result:', subscriptionResult);

      // Update user tier in local state
      setUser({ ...user, tier: plan });

      showSuccess(`🎉 Payment successful! Welcome to ${plan} tier!`);
      
      // Navigate to success page after delay
      setTimeout(() => {
        navigate('/profile');
      }, 2000);

    } catch (error) {
      console.error('Payment error:', error);
      showError(error.message || 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate('/pricing')}
            className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-white ml-4">Checkout</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Payment Form */}
          <div className="md:col-span-2 bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6">
            <form onSubmit={handlePay} className="space-y-6">
              {/* Personal Info */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4">Billing Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      First Name *
                    </label>
                    <input
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="John"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">
                      Last Name *
                    </label>
                    <input
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="Doe"
                      required
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-white text-sm font-medium mb-2">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>
                
                <div className="space-y-3 mb-4">
                  <label className="flex items-center p-3 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-30 cursor-pointer hover:bg-opacity-20 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-white font-medium">Credit/Debit Card</span>
                  </label>
                  
                  <label className="flex items-center p-3 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-30 cursor-pointer hover:bg-opacity-20 transition-all">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="paypal"
                      checked={paymentMethod === 'paypal'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mr-3"
                    />
                    <span className="text-white font-medium">PayPal</span>
                  </label>
                </div>

                {paymentMethod === 'card' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white text-sm font-medium mb-2">
                        Card Number (Mock)
                      </label>
                      <input
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                        placeholder="4242 4242 4242 4242"
                        maxLength="19"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          Expiry Date
                        </label>
                        <input
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div>
                        <label className="block text-white text-sm font-medium mb-2">
                          CVV
                        </label>
                        <input
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                          placeholder="123"
                          maxLength="3"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 p-4 rounded-xl bg-white bg-opacity-10 border border-white border-opacity-30 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1"
                />
                <span className="text-white text-sm">
                  I agree to the Terms of Service and Refund Policy. This is a mock payment for demonstration purposes only.
                </span>
              </label>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!agree || processing}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 ${
                  agree && !processing
                    ? "bg-white text-pink-500 hover:shadow-2xl transform hover:scale-105"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                <Lock className="w-5 h-5" />
                {processing ? "Processing..." : `Pay $${price.toFixed(2)}`}
              </button>

              {/* Mock Notice */}
              <div className="bg-yellow-500 bg-opacity-20 border border-yellow-300 rounded-xl p-4">
                <p className="text-white text-sm">
                  ⚠️ <strong>Note:</strong> This is a mock payment system for demonstration purposes. 
                  No real charges will be made. Payment has 90% success rate for testing.
                </p>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6 sticky top-8">
              <h2 className="text-xl font-bold text-white mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-white">
                  <span>Plan</span>
                  <span className="font-bold">{plan}</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Billing Cycle</span>
                  <span>Monthly</span>
                </div>
                <div className="flex justify-between text-white">
                  <span>Subtotal</span>
                  <span>${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-white opacity-70 text-sm">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white border-opacity-30 mb-6">
                <div className="flex justify-between text-white font-bold text-xl">
                  <span>Total</span>
                  <span>${price.toFixed(2)}</span>
                </div>
                <p className="text-white opacity-70 text-xs mt-2">
                  Billed monthly. Cancel anytime.
                </p>
              </div>

              {/* Features Summary */}
              <div className="bg-white bg-opacity-10 rounded-xl p-4">
                <p className="text-white font-bold mb-2">What's Included:</p>
                <ul className="text-white text-sm space-y-2">
                  {plan === 'PREMIUM' ? (
                    <>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>Unlimited likes</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>Advanced filters (MBTI, Zodiac)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>Rewind last swipe</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>Ad-free experience</span>
                      </li>
                    </>
                  ) : (
                    <>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>Everything in Premium</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>See who liked you</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>Incognito mode</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">✓</span>
                        <span>VIP badge & support</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>

              {/* Security Badge */}
              <div className="mt-4 flex items-center justify-center text-white opacity-70 text-xs">
                <Lock className="w-3 h-3 mr-1" />
                Secure Mock Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}