import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../../store/authStore';
import { register as registerApi } from '../../services/api';
import Button from '../common/Button';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { showError, showSuccess } from '../../utils/toast';
import { Navigation } from 'lucide-react';

const schema = yup.object({
  name: yup
    .string()
    .max(35, 'Name must be 35 characters or fewer')
    .required('Name is required'),
  email: yup
    .string()
    .matches(/^(?=.*[A-Za-z])[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, 'Invalid email')
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
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: { referralCode: '', latitude: null, longitude: null },
  });

  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const hasPreciseLocation =
    typeof latitude === 'number' && Number.isFinite(latitude) &&
    typeof longitude === 'number' && Number.isFinite(longitude);

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

  const handleUseLocation = () => {
    setGeoError('');
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported in this browser.');
      return;
    }
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lon = Number(position.coords.longitude.toFixed(6));
        setValue('latitude', lat, { shouldDirty: true });
        setValue('longitude', lon, { shouldDirty: true });
        setGeoLoading(false);
      },
      (error) => {
        setGeoError(error.message || 'Unable to fetch your location.');
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const clearCoordinates = () => {
    setValue('latitude', null, { shouldDirty: true });
    setValue('longitude', null, { shouldDirty: true });
    setGeoError('');
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-5"
    >
      <input type="hidden" {...register('referralCode')} />
      <input type="hidden" {...register('latitude', { valueAsNumber: true })} />
      <input type="hidden" {...register('longitude', { valueAsNumber: true })} />

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

      <div className="bg-[#101010] border border-[#2A2A2A] rounded-2xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">Precise Location (optional)</p>
            <p className="text-xs text-gray-400">We only use this to find buddies near you.</p>
          </div>
          <button
            type="button"
            onClick={handleUseLocation}
            disabled={geoLoading || loading}
            className="flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FF5F00]/20 text-[#FF5F00] hover:bg-[#FF5F00]/30 disabled:opacity-50"
          >
            <Navigation className="w-4 h-4" />
            {geoLoading ? 'Locating...' : 'Use my location'}
          </button>
        </div>
        {hasPreciseLocation && (
          <div className="text-xs text-gray-300 space-y-1">
            <p>Latitude: {latitude}</p>
            <p>Longitude: {longitude}</p>
            <button
              type="button"
              onClick={clearCoordinates}
              className="text-[#FF5F00] font-semibold hover:underline"
            >
              Clear precise location
            </button>
          </div>
        )}
        {geoError && <p className="text-xs text-red-400">{geoError}</p>}
      </div>

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
