import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { postActivity } from '../../services/api';
import Button from '../common/Button';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  activityType: yup.string().required('Activity type is required'),
  location: yup.string().required('Location is required'),
  time: yup.string().required('Time is required'),
}).required();

function ActivityPost() {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      await postActivity(data);
      alert('Activity posted successfully!');
    } catch (error) {
      console.error('Activity posting failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4">
      <div>
        <label className="block text-gray-700">Title</label>
        <input
          {...register('title')}
          className="w-full p-2 border rounded"
          type="text"
        />
        {errors.title && <p className="text-red-500">{errors.title.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Activity Type</label>
        <input
          {...register('activityType')}
          className="w-full p-2 border rounded"
          type="text"
        />
        {errors.activityType && <p className="text-red-500">{errors.activityType.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Location</label>
        <input
          {...register('location')}
          className="w-full p-2 border rounded"
          type="text"
        />
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Time</label>
        <input
          {...register('time')}
          className="w-full p-2 border rounded"
          type="text"
        />
        {errors.time && <p className="text-red-500">{errors.time.message}</p>}
      </div>
      <Button type="submit">Post Activity</Button>
    </form>
  );
}

export default ActivityPost;