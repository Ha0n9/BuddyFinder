import React from "react";
import { Link } from "react-router-dom";

export default function PricingPage() {
  const tiers = [
    {
      name: "FREE",
      price: "$0",
      features: [
        "Swipe & Match",
        "Basic filters",
        "Limited daily likes",
      ],
      cta: "Get Started",
    },
    {
      name: "PREMIUM",
      price: "$9.99",
      features: [
        "Unlimited likes",
        "Advanced filters (MBTI, Zodiac)",
        "Rewind last swipe",
        "Ad-free experience",
      ],
      cta: "Go Premium",
      popular: true,
    },
    {
      name: "ELITE",
      price: "$19.99",
      features: [
        "Everything in Premium",
        "See who liked you",
        "Incognito mode",
        "VIP badge & priority support",
      ],
      cta: "Upgrade to Elite",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white py-16 px-4">
      <div className="max-w-6xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-[#FF5F00]">
          Choose Your Plan
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Upgrade anytime. Cancel anytime.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative rounded-3xl p-8 border transition-all duration-300 flex flex-col items-center ${
                t.popular
                  ? "border-[#FF5F00] bg-[#1A1A1A] shadow-[0_0_20px_rgba(255,95,0,0.3)] scale-105"
                  : "border-[#2A2A2A] bg-[#111111] hover:border-[#FF5F00]/50 hover:shadow-[0_0_15px_rgba(255,95,0,0.2)]"
              }`}
            >
              {/* Badge */}
              {t.popular && (
                <div className="absolute top-4 left-4 bg-[#FF5F00] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </div>
              )}

              {/* Tier Header */}
              <div className="mt-4 text-xl font-bold tracking-wide">
                {t.name}
              </div>

              {/* Price */}
              <div className="mt-3 text-5xl font-extrabold text-[#FF5F00]">
                {t.price}
                <span className="text-base font-normal text-gray-400">/month</span>
              </div>

              {/* Features */}
              <ul className="mt-6 space-y-3 text-sm text-gray-300 text-left w-full">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <span className="text-[#FF5F00] font-bold">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Link
                to={`/checkout?plan=${t.name}`}
                className={`mt-8 inline-flex justify-center items-center w-full px-5 py-3 rounded-xl font-bold tracking-wide transition-all ${
                  t.popular
                    ? "bg-[#FF5F00] text-white hover:bg-[#ff7133] shadow-[0_4px_15px_rgba(255,95,0,0.4)]"
                    : "bg-transparent border border-[#FF5F00] text-[#FF5F00] hover:bg-[#FF5F00] hover:text-white shadow-[0_0_10px_rgba(255,95,0,0.3)]"
                }`}
              >
                {t.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <p className="mt-10 text-gray-500 text-sm">
          💡 All plans include access to core features, with no hidden fees.
        </p>
      </div>
    </div>
  );
}
