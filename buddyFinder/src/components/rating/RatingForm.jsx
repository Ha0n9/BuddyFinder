// src/components/rating/RatingForm.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { submitRating } from '../../services/api';
import Button from '../common/Button';
import { Star } from 'lucide-react';

const schema = yup.object({
  rating: yup.number().min(1, 'Please select a rating').max(5).required('Rating is required'),
  review: yup.string().max(500, 'Review must be less than 500 characters'),
  reliabilityScore: yup.number().min(1).max(5),
  punctualityScore: yup.number().min(1).max(5),
  friendlinessScore: yup.number().min(1).max(5),
}).required();

function RatingForm({ buddy, onRatingSubmitted }) {
  const [hoveredRating, setHoveredRating] = useState(0);
  const [selectedRating, setSelectedRating] = useState(0);
  
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      rating: 0,
      review: '',
      reliabilityScore: 0,
      punctualityScore: 0,
      friendlinessScore: 0,
    }
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        toUserId: buddy.userId,
        rating: data.rating,
        review: data.review || '',
        reliabilityScore: data.reliabilityScore || null,
        punctualityScore: data.punctualityScore || null,
        friendlinessScore: data.friendlinessScore || null,
      };

      await submitRating(payload);
      alert('Rating submitted successfully!');
      
      if (onRatingSubmitted) {
        onRatingSubmitted();
      }
    } catch (error) {
      console.error('Rating submission failed:', error);
      alert('Failed to submit rating: ' + (error.response?.data?.message || error.message));
    }
  };

  const handleStarClick = (rating) => {
    setSelectedRating(rating);
    setValue('rating', rating);
  };

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        Rate {buddy.name}
      </h3>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Overall Rating */}
        <div>
          <label className="block text-white mb-3 text-center text-lg">Overall Rating</label>
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => handleStarClick(star)}
                onMouseEnter={() => setHoveredRating(star)}
                onMouseLeave={() => setHoveredRating(0)}
                className="transition-transform hover:scale-110"
              >
                <Star
                  className={`w-12 h-12 ${
                    star <= (hoveredRating || selectedRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-white text-opacity-30'
                  }`}
                />
              </button>
            ))}
          </div>
          {errors.rating && <p className="text-red-200 text-sm text-center mt-2">{errors.rating.message}</p>}
        </div>

        {/* Detailed Ratings */}
        <div className="space-y-4">
          <div>
            <label className="block text-white mb-2">Reliability (Optional)</label>
            <select
              {...register('reliabilityScore')}
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="" className="text-gray-800">Select score</option>
              <option value="1" className="text-gray-800">1 - Poor</option>
              <option value="2" className="text-gray-800">2 - Fair</option>
              <option value="3" className="text-gray-800">3 - Good</option>
              <option value="4" className="text-gray-800">4 - Very Good</option>
              <option value="5" className="text-gray-800">5 - Excellent</option>
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">Punctuality (Optional)</label>
            <select
              {...register('punctualityScore')}
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="" className="text-gray-800">Select score</option>
              <option value="1" className="text-gray-800">1 - Poor</option>
              <option value="2" className="text-gray-800">2 - Fair</option>
              <option value="3" className="text-gray-800">3 - Good</option>
              <option value="4" className="text-gray-800">4 - Very Good</option>
              <option value="5" className="text-gray-800">5 - Excellent</option>
            </select>
          </div>

          <div>
            <label className="block text-white mb-2">Friendliness (Optional)</label>
            <select
              {...register('friendlinessScore')}
              className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="" className="text-gray-800">Select score</option>
              <option value="1" className="text-gray-800">1 - Poor</option>
              <option value="2" className="text-gray-800">2 - Fair</option>
              <option value="3" className="text-gray-800">3 - Good</option>
              <option value="4" className="text-gray-800">4 - Very Good</option>
              <option value="5" className="text-gray-800">5 - Excellent</option>
            </select>
          </div>
        </div>

        {/* Review */}
        <div>
          <label className="block text-white mb-2">Review (Optional)</label>
          <textarea
            {...register('review')}
            className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
            rows="4"
            placeholder="Share your workout experience..."
          />
          {errors.review && <p className="text-red-200 text-sm mt-1">{errors.review.message}</p>}
        </div>

        <Button 
          type="submit"
          className="w-full bg-white text-pink-500 font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all"
        >
          Submit Rating
        </Button>
      </form>
    </div>
  );
}

export default RatingForm;