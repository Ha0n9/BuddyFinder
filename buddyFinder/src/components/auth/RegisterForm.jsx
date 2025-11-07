import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../../store/authStore';
import { register as registerApi } from '../../services/api';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { showError, showSuccess } from '../../utils/toast';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  age: yup.number().positive().integer().required('Age is required'),
  interests: yup.string().required('Interests are required'),
  location: yup.string().required('Location is required'),
  availability: yup.string().required('Availability is required'),
}).required();

function RegisterForm() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await registerApi(data);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      showSuccess('Account created successfully!');
      navigate('/search');
    } catch (error) {
      console.error('Registration failed:', error);
      showError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4">
      <div>
        <label htmlFor="name" className="block text-gray-700">Name</label>
        <input
          id="name"
          {...register('name')}
          className="w-full p-2 border rounded"
          type="text"
          disabled={loading}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-gray-700">Email</label>
        <input
          id="email"
          {...register('email')}
          className="w-full p-2 border rounded"
          type="email"
          disabled={loading}
        />
        {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-gray-700">Password</label>
        <input
          id="password"
          {...register('password')}
          className="w-full p-2 border rounded"
          type="password"
          disabled={loading}
        />
        {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
      </div>
      <div>
        <label htmlFor="age" className="block text-gray-700">Age</label>
        <input
          id="age"
          {...register('age')}
          className="w-full p-2 border rounded"
          type="number"
          disabled={loading}
        />
        {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age.message}</p>}
      </div>
      <div>
        <label htmlFor="interests" className="block text-gray-700">Interests</label>
        <input
          id="interests"
          {...register('interests')}
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Gym, Running, Yoga"
          disabled={loading}
        />
        {errors.interests && <p className="text-red-500 text-sm mt-1">{errors.interests.message}</p>}
      </div>
      <div>
        <label htmlFor="location" className="block text-gray-700">Location</label>
        <input
          id="location"
          {...register('location')}
          className="w-full p-2 border rounded"
          type="text"
          disabled={loading}
        />
        {errors.location && <p className="text-red-500 text-sm mt-1">{errors.location.message}</p>}
      </div>
      <div>
        <label htmlFor="availability" className="block text-gray-700">Availability</label>
        <input
          id="availability"
          {...register('availability')}
          className="w-full p-2 border rounded"
          type="text"
          placeholder="Weekends, Evenings"
          disabled={loading}
        />
        {errors.availability && <p className="text-red-500 text-sm mt-1">{errors.availability.message}</p>}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Creating account...' : 'Register'}
      </Button>
    </form>
  );
}

export default RegisterForm;