import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { submitRating } from '../../services/api';
import Button from '../common/Button';

const schema = yup.object({
  buddyId: yup.number().required('Buddy ID is required'),
  rating: yup.number().min(1).max(5).required('Rating is required'),
  review: yup.string().required('Review is required'),
}).required();

function RatingForm({ buddyId, buddyName }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { buddyId },
  });

  const onSubmit = async (data) => {
    try {
      await submitRating(data);
      alert('Rating submitted successfully!');
    } catch (error) {
      console.error('Rating submission failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4">
      <h3 className="text-lg font-bold">Rate {buddyName}</h3>
      <div>
        <label className="block text-gray-700">Rating (1-5)</label>
        <input
          {...register('rating')}
          className="w-full p-2 border rounded"
          type="number"
          min="1"
          max="5"
        />
        {errors.rating && <p className="text-red-500">{errors.rating.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Review</label>
        <textarea
          {...register('review')}
          className="w-full p-2 border rounded"
        ></textarea>
        {errors.review && <p className="text-red-500">{errors.review.message}</p>}
      </div>
      <Button type="submit">Submit Rating</Button>
    </form>
  );
}

export default RatingForm;