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
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  age: yup.number().positive().integer().required('Age is required'),
  interests: yup.string().required('Interests are required'),
  location: yup.string().required('Location is required'),
  availability: yup.string().required('Availability is required'),
}).required();

function RegisterForm() {
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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-5"
    >
      {[
        { id: 'name', label: 'Name', type: 'text' },
        { id: 'email', label: 'Email', type: 'email' },
        { id: 'password', label: 'Password', type: 'password' },
        { id: 'age', label: 'Age', type: 'number' },
        {
          id: 'interests',
          label: 'Interests',
          type: 'text',
          placeholder: 'Gym, Running, Yoga',
        },
        { id: 'location', label: 'Location', type: 'text' },
        {
          id: 'availability',
          label: 'Availability',
          type: 'text',
          placeholder: 'Weekends, Evenings',
        },
      ].map((field) => (
        <div key={field.id}>
          <label
            htmlFor={field.id}
            className="block text-sm font-semibold text-gray-300 mb-2 tracking-wide"
          >
            {field.label}
          </label>
          <input
            id={field.id}
            {...register(field.id)}
            type={field.type}
            placeholder={field.placeholder || ''}
            disabled={loading}
            className="w-full p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-white placeholder-gray-500 
                     focus:border-[#FF5F00] focus:ring-2 focus:ring-[#FF5F00]/40 transition-all duration-200"
          />
          {errors[field.id] && (
            <p className="text-red-500 text-sm mt-1">
              {errors[field.id].message}
            </p>
          )}
        </div>
      ))}

      <Button
        type="submit"
        disabled={loading}
        className="w-full mt-4 py-3 font-bold bg-[#FF5F00] hover:bg-[#ff7533] text-white rounded-xl 
                   shadow-[0_0_20px_rgba(255,95,0,0.3)] hover:shadow-[0_0_25px_rgba(255,95,0,0.5)] 
                   transition-all duration-200"
      >
        {loading ? 'Creating account...' : 'Register'}
      </Button>
    </form>
  );
}

export default RegisterForm;
