// src/components/rating/RatingForm.jsx
import React, { useState } from "react";
import Button from "../common/Button";
import { showError, showSuccess } from "../../utils/toast";
import { createRating } from "../../services/api";

// props: { toUserId, onSubmitted }
export default function RatingForm({ toUserId, onSubmitted }) {
  const [stars, setStars] = useState(0);
  const [reliability, setReliability] = useState(0);
  const [punctuality, setPunctuality] = useState(0);
  const [friendliness, setFriendliness] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const StarRow = ({ value, onChange }) => (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, i) => {
        const idx = i + 1;
        return (
          <button
            key={idx}
            type="button"
            onClick={() => onChange(idx)}
            className={`w-8 h-8 leading-8 text-center rounded ${value >= idx ? "text-yellow-500" : "text-neutral-300"}`}
            aria-label={`Rate ${idx} stars`}
          >
            ★
          </button>
        );
      })}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!toUserId) return showError("Missing target user");
    if (!stars)    return showError("Please select overall stars");

    try {
      setSubmitting(true);
      await createRating({
        toUserId,
        stars,
        reliability,
        punctuality,
        friendliness,
        review
      });
      showSuccess("Rating submitted");
      setStars(0); setReliability(0); setPunctuality(0); setFriendliness(0); setReview("");
      onSubmitted && onSubmitted();
    } catch (err) {
      console.error(err);
      showError("Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="text-sm">
        <div className="mb-1">Overall</div>
        <StarRow value={stars} onChange={setStars} />
      </label>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <label className="text-sm">
          <div className="mb-1">Reliability</div>
          <StarRow value={reliability} onChange={setReliability} />
        </label>
        <label className="text-sm">
          <div className="mb-1">Punctuality</div>
          <StarRow value={punctuality} onChange={setPunctuality} />
        </label>
        <label className="text-sm">
          <div className="mb-1">Friendliness</div>
          <StarRow value={friendliness} onChange={setFriendliness} />
        </label>
      </div>

      <textarea
        className="rounded-2xl border p-3 min-h-28"
        placeholder="Write a short review (optional)"
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      <div className="flex justify-end">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Rating"}
        </Button>
      </div>
    </form>
  );
}
