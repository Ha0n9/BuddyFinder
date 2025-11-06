import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../../store/authStore';
import { login } from '../../services/api';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';

const schema = yup.object({
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
}).required();

function LoginForm() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await login(data);
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      navigate('/search');
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-md mx-auto p-4 space-y-4">
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          {...register('email')}
          className="w-full p-2 border rounded"
          type="email"
        />
        {errors.email && <p className="text-red-500">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-gray-700">Password</label>
        <input
          {...register('password')}
          className="w-full p-2 border rounded"
          type="password"
        />
        {errors.password && <p className="text-red-500">{errors.password.message}</p>}
      </div>
      <Button type="submit">Login</Button>
    </form>
  );
}

export default LoginForm;