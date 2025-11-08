// src/pages/CheckoutPage.jsx
import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function CheckoutPage() {
  const [params] = useSearchParams();
  const plan = (params.get("plan") || "PREMIUM").toUpperCase();
  const price = plan === "ELITE" ? 19.99 : plan === "PREMIUM" ? 9.99 : 0;
  const [agree, setAgree] = useState(false);

  const handlePay = async () => {
    // TODO: gọi backend tạo Stripe Checkout Session → redirect
    // const { url } = await createCheckoutSession({ plan });
    // window.location.href = url;
    alert(`Mock payment for ${plan} - $${price.toFixed(2)}`);
  };

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-3xl mx-auto p-4 md:p-8">
        <h1 className="text-2xl font-semibold tracking-tight">Checkout</h1>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {/* Billing */}
          <div className="md:col-span-2 rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900 p-4 md:p-6">
            <h2 className="text-lg font-semibold">Billing details</h2>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="rounded-xl border p-2 bg-white dark:bg-neutral-900" placeholder="First name" />
              <input className="rounded-xl border p-2 bg-white dark:bg-neutral-900" placeholder="Last name" />
              <input className="rounded-xl border p-2 bg-white dark:bg-neutral-900 md:col-span-2" placeholder="Email" />
              <input className="rounded-xl border p-2 bg-white dark:bg-neutral-900 md:col-span-2" placeholder="Card (mock only)" />
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm">
              <input type="checkbox" className="size-4" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
              I agree to the Terms and Refund Policy.
            </label>
            <button
              disabled={!agree}
              onClick={handlePay}
              className={`mt-4 w-full px-4 py-3 rounded-xl text-white ${agree ? "bg-neutral-900 hover:opacity-90 dark:bg-white dark:text-black" : "bg-neutral-300 cursor-not-allowed"}`}
            >
              Pay ${price.toFixed(2)}
            </button>
            <p className="mt-2 text-xs text-neutral-500">This is a UI mock. Connect to your backend to create a Stripe Checkout session and redirect.</p>
          </div>

          {/* Summary */}
          <div className="rounded-2xl border border-neutral-200/60 dark:border-neutral-800 bg-white/80 dark:bg-neutral-900 p-4 md:p-6">
            <h2 className="text-lg font-semibold">Order Summary</h2>
            <div className="mt-4 text-sm">
              <div className="flex justify-between py-1"><span>Plan</span><span>{plan}</span></div>
              <div className="flex justify-between py-1"><span>Subtotal</span><span>${price.toFixed(2)}</span></div>
              <div className="flex justify-between py-1"><span>Tax</span><span>Calculated by Stripe</span></div>
              <div className="border-t mt-2 pt-2 flex justify-between font-semibold"><span>Total</span><span>${price.toFixed(2)}</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
