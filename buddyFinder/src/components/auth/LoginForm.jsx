import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../../store/authStore';
import { login } from '../../services/api';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { showError, showSuccess } from '../../utils/toast';

const schema = yup.object({
  email: yup
    .string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
}).required();

function LoginForm() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await login(data);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      showSuccess('Login successful!');
      navigate('/search');
    } catch (error) {
      console.error('Login failed:', error);

      const rawMessage = error.response?.data?.message || '';
      const msg = rawMessage.toLowerCase();
      const status = error.response?.status;

      if ((status === 403 && msg.includes('banned')) || msg.includes('banned')) {
        showError('Your account has been banned. Please contact support.');
      } else if (
        status === 401 ||
        msg.includes('invalid') ||
        msg.includes('credentials') ||
        msg.includes('password')
      ) {
        showError('Invalid email or password');
      } else {
        showError(rawMessage || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4">
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          {...register('email')}
          className="w-full px-4 py-3 rounded-lg border border-[#2A2A2A]
             bg-[#141414] text-white placeholder-gray-500
             focus:outline-none focus:border-[#FF5F00]"
          type="email"
          disabled={loading}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <input
          {...register('password')}
          className="w-full px-4 py-3 rounded-lg border border-[#2A2A2A]
             bg-[#141414] text-white placeholder-gray-500
             focus:outline-none focus:border-[#FF5F00]"
          type="password"
          disabled={loading}
        />
        {errors.password && (
          <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
        )}
      </div>
      <Button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  );
}

export default LoginForm;
