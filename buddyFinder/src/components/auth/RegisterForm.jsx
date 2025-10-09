import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../../store/authStore';
import { register } from '../../services/api';
import Button from '../common/Button';

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
  const { register: formRegister, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await register(data);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4">
      <div>
        <label htmlFor="name" className="block text-gray-700">Name</label>
        <input
          id="name"
          {...formRegister('name')}
          className="w-full p-2 border rounded"
          type="text"
        />
        {errors.name && <p className="text-red-500">{errors.name.message}</p>}
      </div>
      <div>
        <label htmlFor="email" className="block text-gray-700">Email</label>
        <input
          id="email"
          {...formRegister('email')}
          className="w-full p-2 border rounded"
          type="email"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label htmlFor="password" className="block text-gray-700">Password</label>
        <input
          id="password"
          {...formRegister('password')}
          className="w-full p-2 border rounded"
          type="password"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>
      <div>
        <label htmlFor="age" className="block text-gray-700">Age</label>
        <input
          id="age"
          {...formRegister('age')}
          className="w-full p-2 border rounded"
          type="number"
        />
        {errors.age && <p className="text-red-500">{errors.age.message}</p>}
      </div>
      <div>
        <label htmlFor="interests" className="block text-gray-700">Interests</label>
        <input
          id="interests"
          {...formRegister('interests')}
          className="w-full p-2 border rounded"
          type="text"
        />
        {errors.interests && <p className="text-red-500">{errors.interests.message}</p>}
      </div>
      <div>
        <label htmlFor="location" className="block text-gray-700">Location</label>
        <input
          id="location"
          {...formRegister('location')}
          className="w-full p-2 border rounded"
          type="text"
        />
        {errors.location && <p className="text-red-500">{errors.location.message}</p>}
      </div>
      <div>
        <label htmlFor="availability" className="block text-gray-700">Availability</label>
        <input
          {...formRegister('availability')}
          className="w-full p-2 border rounded"
          type="text"
        />
        {errors.availability && <p className="text-red-500">{errors.availability.message}</p>}
      </div>
      <Button type="submit">Register</Button>
    </form>
  );
}

export default RegisterForm;