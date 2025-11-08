// src/pages/PricingPage.jsx
import React from "react";
import { Link } from "react-router-dom";

export default function PricingPage() {
  const tiers = [
    { name: "FREE",    price: "$0",     features: ["Swipe & Match", "Basic filters", "Limited daily likes"], cta: "Get Started" },
    { name: "PREMIUM", price: "$9.99",  features: ["Unlimited likes", "Advanced filters (MBTI, Zodiac)", "Rewind last swipe", "Ad-free"], cta: "Go Premium", popular: true },
    { name: "ELITE",   price: "$19.99", features: ["Everything in Premium", "See who liked you", "Incognito mode", "VIP badge & support"], cta: "Upgrade to Elite" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-950 dark:to-neutral-950">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <h1 className="text-center text-4xl font-bold tracking-tight">Choose your plan</h1>
        <p className="text-center text-neutral-500 mt-2">Upgrade anytime. Cancel anytime.</p>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`rounded-2xl border shadow p-6 flex flex-col ${
                t.popular ? "border-neutral-900 dark:border-white bg-white/90 dark:bg-neutral-900" : "border-neutral-200/60 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/70"
              }`}
            >
              {t.popular && (
                <div className="self-start px-2 py-1 text-xs rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black">
                  Most popular
                </div>
              )}
              <div className="mt-3 text-lg font-semibold">{t.name}</div>
              <div className="mt-2 text-4xl font-bold">{t.price}<span className="text-base font-normal">/month</span></div>
              <ul className="mt-4 space-y-2 text-sm text-neutral-600 dark:text-neutral-300">
                {t.features.map((f) => <li key={f} className="flex items-start gap-2"><span>✓</span><span>{f}</span></li>)}
              </ul>
              <Link to={`/checkout?plan=${t.name}`} className="mt-6 inline-flex justify-center items-center px-4 py-2 rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-black hover:opacity-90">
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
