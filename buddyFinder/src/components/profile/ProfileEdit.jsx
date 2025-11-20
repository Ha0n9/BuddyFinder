// src/components/profile/ProfileEdit.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../../store/authStore';
import { updateProfile } from '../../services/api';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Navigation } from 'lucide-react';
import { showError, showSuccess } from '../../utils/toast';

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP',
];

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer',
  'Leo', 'Virgo', 'Libra', 'Scorpio',
  'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];

const schema = yup.object({
  name: yup
    .string()
    .max(35, 'Name must be less than 35 characters')
    .required('Name is required'),
  age: yup
    .number()
    .typeError('Age is required')
    .min(18, 'Must be at least 18')
    .max(65, 'Must be 65 or younger')
    .required('Age is required'),
  gender: yup.string().required('Gender is required'),
  interests: yup.string().required('Interests are required'),
  location: yup
    .string()
    .max(40, 'Location must be less than 40 characters')
    .required('Location is required'),
  bio: yup.string().max(200, 'Bio must be less than 200 characters'),
  fitnessLevel: yup.string().required('Fitness level is required'),
  availability: yup
    .string()
    .max(120, 'Availability must be less than 120 characters')
    .required('Availability is required'),
  zodiacSign: yup.string().nullable(),
  mbtiType: yup.string().nullable(),
}).required();

function ProfileEdit() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const isPremiumTier = user?.tier === 'PREMIUM' || user?.tier === 'ELITE';
  const [geoLoading, setGeoLoading] = useState(false);
  const [geoError, setGeoError] = useState('');

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      age: user?.age || '',
      gender: user?.gender || '',
      interests: user?.interests || '',
      location: user?.location || '',
      bio: user?.bio || '',
      fitnessLevel: user?.fitnessLevel || '',
      availability: user?.availability || '',
      zodiacSign: user?.zodiacSign || '',
      mbtiType: user?.mbtiType || '',
      latitude: user?.latitude ?? null,
      longitude: user?.longitude ?? null,
    }
  });
  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const hasPreciseLocation =
    typeof latitude === 'number' && Number.isFinite(latitude) &&
    typeof longitude === 'number' && Number.isFinite(longitude);

  const onSubmit = async (data) => {
    try {
      const response = await updateProfile(data);
      setUser(response.data);
      showSuccess('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Profile update failed:', error);
      const message = error.response?.data?.message || 'Failed to update profile';
      showError(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0B0B] py-12 px-4 text-white">
      <div className="max-w-2xl mx-auto">
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-3xl p-8 shadow-[0_0_25px_rgba(255,95,0,0.15)] backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 text-gray-400 hover:text-[#FF5F00] hover:bg-[#1A1A1A] rounded-full transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold ml-4 text-[#FF5F00]">Edit Profile</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <input type="hidden" {...register('latitude', { valueAsNumber: true })} />
            <input type="hidden" {...register('longitude', { valueAsNumber: true })} />
            <div>
              <label className="block text-gray-400 mb-2">Name</label>
              <input
                {...register('name')}
                className="w-full p-3 rounded-lg bg-[#1A1A1A] text-white border border-[#2A2A2A] focus:outline-none focus:border-[#FF5F00] focus:ring-1 focus:ring-[#FF5F00] transition-all"
                type="text"
                maxLength={35}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-400 mb-2">Age</label>
                <input
                  {...register('age')}
                  className="w-full p-3 rounded-lg bg-[#1A1A1A] text-white border border-[#2A2A2A] focus:outline-none focus:border-[#FF5F00] focus:ring-1 focus:ring-[#FF5F00]"
                  type="number"
                  min={18}
                  max={65}
                  placeholder="25"
                />
                {errors.age && <p className="text-red-400 text-sm mt-1">{errors.age.message}</p>}
              </div>

              <div>
                <label className="block text-gray-400 mb-2">Gender</label>
                <select
                  {...register('gender')}
                  className="w-full p-3 rounded-lg bg-[#1A1A1A] text-white border border-[#2A2A2A] focus:outline-none focus:border-[#FF5F00] focus:ring-1 focus:ring-[#FF5F00]"
                >
                  <option value="">Select gender</option>
                  <option value="Male" className="text-black">Male</option>
                  <option value="Female" className="text-black">Female</option>
                  <option value="Other" className="text-black">Other</option>
                </select>
                {errors.gender && <p className="text-red-400 text-sm mt-1">{errors.gender.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Interests</label>
              <input
                {...register('interests')}
                className="w-full p-3 rounded-lg bg-[#1A1A1A] text-white border border-[#2A2A2A] focus:outline-none focus:border-[#FF5F00] focus:ring-1 focus:ring-[#FF5F00]"
                type="text"
                placeholder="Gym, Running, Yoga"
              />
              {errors.interests && <p className="text-red-400 text-sm mt-1">{errors.interests.message}</p>}
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Location</label>
              <input
                {...register('location')}
                className="w-full p-3 rounded-lg bg-[#1A1A1A] text-white border border-[#2A2A2A] focus:outline-none focus:border-[#FF5F00] focus:ring-1 focus:ring-[#FF5F00]"
                type="text"
                maxLength={40}
                placeholder="Vancouver"
              />
              {errors.location && <p className="text-red-400 text-sm mt-1">{errors.location.message}</p>}
            </div>

            <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-gray-300 font-semibold">Precise Location</p>
                  <p className="text-sm text-gray-500">Share GPS coordinates to appear in nearby searches.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setGeoError('');
                    if (!navigator.geolocation) {
                      setGeoError('Geolocation is not supported in this browser.');
                      return;
                    }
                    setGeoLoading(true);
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        setValue('latitude', Number(position.coords.latitude.toFixed(6)), { shouldDirty: true });
                        setValue('longitude', Number(position.coords.longitude.toFixed(6)), { shouldDirty: true });
                        setGeoLoading(false);
                      },
                      (error) => {
                        setGeoError(error.message || 'Unable to fetch your location.');
                        setGeoLoading(false);
                      },
                      { enableHighAccuracy: true, timeout: 10000 }
                    );
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#FF5F00]/15 text-[#FF5F00] font-semibold text-sm hover:bg-[#FF5F00]/25 transition disabled:opacity-50"
                  disabled={geoLoading}
                >
                  <Navigation className="w-4 h-4" />
                  {geoLoading ? 'Locating...' : 'Use my location'}
                </button>
              </div>
              <div className="mt-3 text-sm text-gray-400 space-y-1">
                {hasPreciseLocation ? (
                  <>
                    <p>Latitude: {latitude}</p>
                    <p>Longitude: {longitude}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setValue('latitude', null, { shouldDirty: true });
                        setValue('longitude', null, { shouldDirty: true });
                        setGeoError('');
                      }}
                      className="text-[#FF5F00] font-semibold hover:underline"
                    >
                      Clear coordinates
                    </button>
                  </>
                ) : (
                  <p>Add coordinates to help the app find buddies in your radius.</p>
                )}
                {geoError && <p className="text-red-400">{geoError}</p>}
              </div>
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Availability</label>
              <input
                {...register('availability')}
                className="w-full p-3 rounded-lg bg-[#1A1A1A] text-white border border-[#2A2A2A] focus:outline-none focus:border-[#FF5F00] focus:ring-1 focus:ring-[#FF5F00]"
                type="text"
                maxLength={120}
                placeholder="Weekends, Evenings"
              />
              {errors.availability && (
                <p className="text-red-400 text-sm mt-1">{errors.availability.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Bio</label>
              <textarea
                {...register('bio')}
                className="w-full p-3 rounded-lg bg-[#1A1A1A] text-white border border-[#2A2A2A] focus:outline-none focus:border-[#FF5F00] focus:ring-1 focus:ring-[#FF5F00]"
                rows="3"
                placeholder="Tell us about yourself..."
              />
              {errors.bio && <p className="text-red-400 text-sm mt-1">{errors.bio.message}</p>}
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Fitness Level</label>
              <select
                {...register('fitnessLevel')}
                className="w-full p-3 rounded-lg bg-[#1A1A1A] text-white border border-[#2A2A2A] focus:outline-none focus:border-[#FF5F00] focus:ring-1 focus:ring-[#FF5F00]"
              >
                <option value="">Select level</option>
                <option value="Beginner" className="text-black">Beginner</option>
                <option value="Intermediate" className="text-black">Intermediate</option>
                <option value="Advanced" className="text-black">Advanced</option>
              </select>
              {errors.fitnessLevel && <p className="text-red-400 text-sm mt-1">{errors.fitnessLevel.message}</p>}
            </div>

            <div className="bg-[#0F0F0F] border border-[#2A2A2A] rounded-2xl p-5 mt-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div>
                  <p className="text-gray-300 font-semibold">MBTI & Zodiac</p>
                  <p className="text-sm text-gray-500">Unlock better matches with advanced filters.</p>
                </div>
                {!isPremiumTier && (
                  <span className="text-xs uppercase tracking-wide text-[#FF5F00] font-semibold bg-[#FF5F00]/10 px-3 py-1 rounded-full">
                    Premium feature
                  </span>
                )}
              </div>
              <div className="grid md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-400 mb-2">MBTI Type</label>
                  <select
                    {...register('mbtiType')}
                    disabled={!isPremiumTier}
                    className="w-full p-3 rounded-lg bg-[#1A1A1A] text-white border border-[#2A2A2A] focus:outline-none focus:border-[#FF5F00] focus:ring-1 focus:ring-[#FF5F00] disabled:opacity-40"
                  >
                    <option value="">Select MBTI</option>
                    {MBTI_TYPES.map((type) => (
                      <option key={type} value={type} className="text-black">
                        {type}
                      </option>
                    ))}
                  </select>
                  {errors.mbtiType && <p className="text-red-400 text-sm mt-1">{errors.mbtiType.message}</p>}
                </div>
                <div>
                  <label className="block text-gray-400 mb-2">Zodiac Sign</label>
                  <select
                    {...register('zodiacSign')}
                    disabled={!isPremiumTier}
                    className="w-full p-3 rounded-lg bg-[#1A1A1A] text-white border border-[#2A2A2A] focus:outline-none focus:border-[#FF5F00] focus:ring-1 focus:ring-[#FF5F00] disabled:opacity-40"
                  >
                    <option value="">Select sign</option>
                    {ZODIAC_SIGNS.map((sign) => (
                      <option key={sign} value={sign} className="text-black">
                        {sign}
                      </option>
                    ))}
                  </select>
                  {errors.zodiacSign && <p className="text-red-400 text-sm mt-1">{errors.zodiacSign.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button
                type="button"
                onClick={() => navigate('/profile')}
                className="flex-1 bg-[#1A1A1A] border border-[#2A2A2A] text-gray-300 font-bold py-3 rounded-lg hover:border-[#FF5F00] hover:text-[#FF5F00] transition-all"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-[#FF5F00] text-white font-bold py-3 rounded-lg hover:bg-[#ff7533] transition-all"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileEdit;
