// src/components/profile/ProfileEdit.jsx
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../../store/authStore';
import { updateProfile } from '../../services/api';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

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
}).required();

function ProfileEdit() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: user?.name || '',
      age: user?.age || '',
      gender: user?.gender || '',
      interests: user?.interests || '',
      location: user?.location || '',
      bio: user?.bio || '',
      fitnessLevel: user?.fitnessLevel || '',
    }
  });

  const onSubmit = async (data) => {
    try {
      const response = await updateProfile(data);
      setUser(response.data);
      alert('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Profile update failed:', error);
      alert('Failed to update profile');
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
