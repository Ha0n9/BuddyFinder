// src/components/rating/RatingForm.jsx
import React, { useState } from "react";
import { submitRating } from "../../services/api";
import Button from "../common/Button";
import { showError, showSuccess } from "../../utils/toast";
import { Star } from "lucide-react";

export default function RatingForm({ toUserId, onSubmitted }) {
  const [rating, setRating] = useState(0);
  const [reliabilityScore, setReliabilityScore] = useState(0);
  const [punctualityScore, setPunctualityScore] = useState(0);
  const [friendlinessScore, setFriendlinessScore] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const StarRow = ({ value, onChange, label }) => (
    <div className="space-y-2">
      <label className="block text-white text-sm font-medium">{label}</label>
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => {
          const starValue = i + 1;
          return (
            <button
              key={starValue}
              type="button"
              onClick={() => onChange(starValue)}
              className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                value >= starValue
                  ? "text-yellow-400 scale-110"
                  : "text-white text-opacity-30 hover:text-opacity-50"
              }`}
              aria-label={`Rate ${starValue} stars`}
            >
              <Star
                className="w-6 h-6"
                fill={value >= starValue ? "currentColor" : "none"}
              />
            </button>
          );
        })}
      </div>
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!toUserId) {
      showError("Missing target user");
      return;
    }

    if (!rating) {
      showError("Please select overall rating");
      return;
    }

    try {
      setSubmitting(true);
      await submitRating({
        toUserId,
        rating,
        reliabilityScore,
        punctualityScore,
        friendlinessScore,
        review: review.trim() || null,
      });

      showSuccess("Rating submitted successfully!");

      // Reset form
      setRating(0);
      setReliabilityScore(0);
      setPunctualityScore(0);
      setFriendlinessScore(0);
      setReview("");

      if (onSubmitted) {
        onSubmitted();
      }
    } catch (err) {
      console.error("Rating submission error:", err);
      showError(err.response?.data?.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6 space-y-6"
    >
      <h3 className="text-xl font-bold text-white">Rate Your Buddy</h3>

      {/* Overall Rating */}
      <StarRow value={rating} onChange={setRating} label="Overall Rating *" />

      {/* Detailed Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StarRow
          value={reliabilityScore}
          onChange={setReliabilityScore}
          label="Reliability"
        />
        <StarRow
          value={punctualityScore}
          onChange={setPunctualityScore}
          label="Punctuality"
        />
        <StarRow
          value={friendlinessScore}
          onChange={setFriendlinessScore}
          label="Friendliness"
        />
      </div>

      {/* Review Text */}
      <div className="space-y-2">
        <label className="block text-white text-sm font-medium">
          Review (Optional)
        </label>
        <textarea
          className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white resize-none"
          placeholder="Share your experience..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          maxLength={500}
        />
        <p className="text-white text-xs opacity-70 text-right">
          {review.length}/500
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={submitting || !rating}
        className="w-full bg-white text-pink-500 font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? "Submitting..." : "Submit Rating"}
      </Button>
    </form>
  );
}