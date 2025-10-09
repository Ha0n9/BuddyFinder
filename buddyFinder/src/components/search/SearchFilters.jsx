import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { searchBuddies } from '../../services/api';
import Button from '../common/Button';

const schema = yup.object({
  activity: yup.string().required('Activity is required'),
  location: yup.string().required('Location is required'),
  time: yup.string().required('Time is required'),
}).required();

function SearchFilters({ onSearch }) {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await searchBuddies(data);
      onSearch(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4">
      <div>
        <label className="block text-gray-700">Activity</label>
        <input
          {...register('activity')}
          className="w-full p-2 border rounded"
          type="text"
          placeholder="e.g., Running, Yoga"
        />
        {errors.activity && <p className="text-red-500">{errors.activity.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Location</label>
        <input
          {...register('location')}
          className="w-full p-2 border rounded"
          type="text"
          placeholder="e.g., New York"
        />
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Time</label>
        <input
          {...register('time')}
          className="w-full p-2 border rounded"
          type="text"
          placeholder="e.g., Weekends"
        />
        {errors.time && <p className="text-red-500">{errors.time.message}</p>}
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
}

export default SearchFilters;