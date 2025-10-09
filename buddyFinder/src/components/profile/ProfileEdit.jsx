import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../../store/authStore';
import { updateProfile } from '../../services/api';
import Button from '../common/Button';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup.number().positive().integer().required('Age is required'),
  interests: yup.string().required('Interests are required'),
  location: yup.string().required('Location is required'),
  availability: yup.string().required('Availability is required'),
}).required();

function ProfileEdit() {
  const { user, setUser } = useAuthStore();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: user,
  });

  const onSubmit = async (data) => {
    try {
      const response = await updateProfile(data);
      setUser(response.data);
    } catch (error) {
      console.error('Profile update failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4">
      <div>
        <label className="block text-gray-700">Name</label>
        <input
          {...register('name')}
          className="w-full p-2 border rounded"
          type="text"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Age</label>
        <input
          {...register('age')}
          className="w-full p-2 border rounded"
          type="number"
        />
        {errors.age && <p className="text-red-500">{errors.age.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Interests</label>
        <input
          {...register('interests')}
          className="w-full p-2 border rounded"
          type="text"
        />
        {errors.interests && <p className="text-red-500">{errors.interests.message}</p>}
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
        <label className="block text-gray-700">Availability</label>
        <input
          {...register('availability')}
          className="w-full p-2 border rounded"
          type="text"
        />
        {errors.availability && <p className="text-red-500">{errors.availability.message}</p>}
      </div>
      <Button type="submit">Save Changes</Button>
    </form>
  );
}

export default ProfileEdit;