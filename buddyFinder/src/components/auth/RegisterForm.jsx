import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../../store/authStore';
import { register as registerApi } from '../../services/api';
import Button from '../common/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { showError, showSuccess } from '../../utils/toast';

const schema = yup.object({
  name: yup
    .string()
    .max(35, 'Name must be 35 characters or fewer')
    .required('Name is required'),
  email: yup
    .string()
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Invalid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  age: yup
    .number()
    .typeError('Age is required')
    .min(18, 'Must be at least 18')
    .max(65, 'Must be 65 or younger')
    .required('Age is required'),
  interests: yup.string().required('Interests are required'),
  location: yup
    .string()
    .max(200, 'Location must be 200 characters or fewer')
    .required('Location is required'),
  availability: yup.string().required('Availability is required'),
}).required();

function RegisterForm() {
  const { setUser } = useAuthStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { referralCode: '' },
  });

  const referralCode = searchParams.get('ref') || '';

  useEffect(() => {
    if (referralCode) {
      setValue('referralCode', referralCode);
    }
  }, [referralCode, setValue]);

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
      <input type="hidden" {...register('referralCode')} />

      {[
        { id: 'name', label: 'Name', type: 'text', maxLength: 35 },
        { id: 'email', label: 'Email', type: 'email' },
        { id: 'password', label: 'Password', type: 'password' },
        { id: 'age', label: 'Age', type: 'number', min: 18, max: 65 },
        {
          id: 'interests',
          label: 'Interests',
          type: 'text',
          placeholder: 'Gym, Running, Yoga',
        },
        { id: 'location', label: 'Location', type: 'text', maxLength: 200 },
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
            maxLength={field.maxLength}
            min={field.min}
            max={field.max}
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
