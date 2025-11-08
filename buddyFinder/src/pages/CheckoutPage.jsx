import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { processMockPayment, upgradeMockSubscription } from "../services/mockPaymentService";
import { useAuthStore } from "../store/authStore";
import { showSuccess, showError } from "../utils/toast";
import { CreditCard, Lock, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuthStore();
  const plan = (params.get("plan") || "PREMIUM").toUpperCase();
  const price = plan === "ELITE" ? 19.99 : plan === "PREMIUM" ? 9.99 : 0;

  const [agree, setAgree] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: user?.email || "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
      const paymentResult = await processMockPayment(plan, paymentMethod);
      console.log("Payment Result:", paymentResult);

      const subscriptionResult = await upgradeMockSubscription(user.userId, plan);
      console.log("Subscription Result:", subscriptionResult);

      setUser({ ...user, tier: plan });
      showSuccess(`🎉 Payment successful! Welcome to ${plan} tier!`);

      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      console.error("Payment error:", error);
      showError(error.message || "Payment failed. Please try again.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-12 px-4 text-white">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-10">
          <button
            onClick={() => navigate("/pricing")}
            className="p-2 text-gray-300 hover:text-white hover:bg-[#FF5F00]/20 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-[#FF5F00] ml-4">Checkout</h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* LEFT: Payment Form */}
          <div className="md:col-span-2 bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 shadow-[0_0_20px_rgba(255,95,0,0.15)]">
            <form onSubmit={handlePay} className="space-y-6">
              {/* Billing Info */}
              <div>
                <h2 className="text-xl font-bold text-[#FF5F00] mb-4">Billing Details</h2>
                <div className="grid grid-cols-2 gap-4">
                  {["firstName", "lastName"].map((field) => (
                    <div key={field}>
                      <label className="block text-gray-300 text-sm font-medium mb-2 capitalize">
                        {field.replace("Name", " Name")} *
                      </label>
                      <input
                        name={field}
                        value={formData[field]}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
                        placeholder={field === "firstName" ? "John" : "Doe"}
                        required
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <label className="block text-gray-300 text-sm font-medium mb-2">Email *</label>
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
                    placeholder="john@example.com"
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-bold text-[#FF5F00] mb-4 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Method
                </h2>

                <div className="space-y-3 mb-4">
                  {[
                    { id: "card", label: "Credit/Debit Card" },
                    { id: "paypal", label: "PayPal" },
                  ].map((m) => (
                    <label
                      key={m.id}
                      className={`flex items-center p-3 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === m.id
                          ? "border-[#FF5F00] bg-[#FF5F00]/10"
                          : "border-[#2A2A2A] bg-[#111111] hover:border-[#FF5F00]/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value={m.id}
                        checked={paymentMethod === m.id}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mr-3 accent-[#FF5F00]"
                      />
                      <span className="font-medium">{m.label}</span>
                    </label>
                  ))}
                </div>

                {paymentMethod === "card" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">
                        Card Number (Mock)
                      </label>
                      <input
                        name="cardNumber"
                        value={formData.cardNumber}
                        onChange={handleInputChange}
                        className="w-full p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
                        placeholder="4242 4242 4242 4242"
                        maxLength="19"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">
                          Expiry Date
                        </label>
                        <input
                          name="expiryDate"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
                          placeholder="MM/YY"
                          maxLength="5"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-300 text-sm font-medium mb-2">CVV</label>
                        <input
                          name="cvv"
                          value={formData.cvv}
                          onChange={handleInputChange}
                          className="w-full p-3 rounded-xl bg-[#111111] border border-[#2A2A2A] text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
                          placeholder="123"
                          maxLength="3"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 p-4 rounded-xl border border-[#2A2A2A] bg-[#111111] cursor-pointer hover:border-[#FF5F00]/50 transition-all">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-1 accent-[#FF5F00]"
                />
                <span className="text-gray-300 text-sm leading-relaxed">
                  I agree to the Terms of Service and Refund Policy. This is a mock payment for demonstration purposes only.
                </span>
              </label>

              {/* Pay Button */}
              <button
                type="submit"
                disabled={!agree || processing}
                className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition-all ${
                  agree && !processing
                    ? "bg-[#FF5F00] hover:bg-[#ff7133] text-white shadow-[0_4px_15px_rgba(255,95,0,0.4)] hover:scale-[1.02]"
                    : "bg-[#333] text-gray-500 cursor-not-allowed"
                }`}
              >
                <Lock className="w-5 h-5" />
                {processing ? "Processing..." : `Pay $${price.toFixed(2)}`}
              </button>

              {/* Notice */}
              <div className="bg-[#FF5F00]/10 border border-[#FF5F00]/40 rounded-xl p-4 text-sm text-gray-300">
                ⚠️ <strong>Note:</strong> This is a mock payment system for demonstration purposes only.
              </div>
            </form>
          </div>

          {/* RIGHT: Summary */}
          <div className="md:col-span-1">
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-3xl p-6 sticky top-8 shadow-[0_0_20px_rgba(255,95,0,0.15)]">
              <h2 className="text-xl font-bold text-[#FF5F00] mb-4">
                Order Summary
              </h2>

              <div className="space-y-3 mb-6 text-gray-300">
                <div className="flex justify-between">
                  <span>Plan</span>
                  <span className="font-bold text-white">{plan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Billing Cycle</span>
                  <span>Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${price.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm opacity-70">
                  <span>Tax</span>
                  <span>Included</span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#2A2A2A] mb-6">
                <div className="flex justify-between font-bold text-white text-lg">
                  <span>Total</span>
                  <span>${price.toFixed(2)}</span>
                </div>
                <p className="text-gray-400 text-xs mt-2">
                  Billed monthly. Cancel anytime.
                </p>
              </div>

              {/* Features */}
              <div className="bg-[#111111] border border-[#2A2A2A] rounded-xl p-4">
                <p className="font-bold text-[#FF5F00] mb-2">What's Included:</p>
                <ul className="text-gray-300 text-sm space-y-2">
                  {plan === "PREMIUM" ? (
                    <>
                      <li>✓ Unlimited likes</li>
                      <li>✓ Advanced filters (MBTI, Zodiac)</li>
                      <li>✓ Rewind last swipe</li>
                      <li>✓ Ad-free experience</li>
                    </>
                  ) : (
                    <>
                      <li>✓ Everything in Premium</li>
                      <li>✓ See who liked you</li>
                      <li>✓ Incognito mode</li>
                      <li>✓ VIP badge & support</li>
                    </>
                  )}
                </ul>
              </div>

              <div className="mt-4 flex items-center justify-center text-gray-500 text-xs">
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
