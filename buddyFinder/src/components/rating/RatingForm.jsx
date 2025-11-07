import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthStore } from '../../store/authStore';
import { updateProfile } from '../../services/api';
import Button from '../common/Button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { showError, showSuccess } from '../../utils/toast';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  age: yup.number().positive().integer().required('Age is required'),
  gender: yup.string().required('Gender is required'),
  interests: yup.string().required('Interests are required'),
  location: yup.string().required('Location is required'),
  bio: yup.string().max(200, 'Bio must be less than 200 characters'),
  fitnessLevel: yup.string().required('Fitness level is required'),
}).required();

function ProfileEdit() {
  const { user, setUser } = useAuthStore();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  
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
    setSubmitting(true);
    try {
      const response = await updateProfile(data);
      setUser(response.data);
      showSuccess('Profile updated successfully!');
      navigate('/profile');
    } catch (error) {
      console.error('Profile update failed:', error);
      showError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-8">
          <div className="flex items-center mb-8">
            <button
              onClick={() => navigate('/profile')}
              className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold text-white ml-4">Edit Profile</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-white mb-2">Name</label>
              <input
                {...register('name')}
                className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                type="text"
                placeholder="John Doe"
                disabled={submitting}
              />
              {errors.name && <p className="text-red-200 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white mb-2">Age</label>
                <input
                  {...register('age')}
                  className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  type="number"
                  placeholder="25"
                  disabled={submitting}
                />
                {errors.age && <p className="text-red-200 text-sm mt-1">{errors.age.message}</p>}
              </div>

              <div>
                <label className="block text-white mb-2">Gender</label>
                <select
                  {...register('gender')}
                  className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                  disabled={submitting}
                >
                  <option value="" className="text-gray-800">Select gender</option>
                  <option value="Male" className="text-gray-800">Male</option>
                  <option value="Female" className="text-gray-800">Female</option>
                  <option value="Other" className="text-gray-800">Other</option>
                </select>
                {errors.gender && <p className="text-red-200 text-sm mt-1">{errors.gender.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-white mb-2">Interests</label>
              <input
                {...register('interests')}
                className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                type="text"
                placeholder="Gym, Running, Yoga"
                disabled={submitting}
              />
              {errors.interests && <p className="text-red-200 text-sm mt-1">{errors.interests.message}</p>}
            </div>

            <div>
              <label className="block text-white mb-2">Location</label>
              <input
                {...register('location')}
                className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                type="text"
                placeholder="Vancouver"
                disabled={submitting}
              />
              {errors.location && <p className="text-red-200 text-sm mt-1">{errors.location.message}</p>}
            </div>

            <div>
              <label className="block text-white mb-2">Bio</label>
              <textarea
                {...register('bio')}
                className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                rows="3"
                placeholder="Tell us about yourself..."
                disabled={submitting}
              />
              {errors.bio && <p className="text-red-200 text-sm mt-1">{errors.bio.message}</p>}
            </div>

            <div>
              <label className="block text-white mb-2">Fitness Level</label>
              <select
                {...register('fitnessLevel')}
                className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
                disabled={submitting}
              >
                <option value="" className="text-gray-800">Select level</option>
                <option value="Beginner" className="text-gray-800">Beginner</option>
                <option value="Intermediate" className="text-gray-800">Intermediate</option>
                <option value="Advanced" className="text-gray-800">Advanced</option>
              </select>
              {errors.fitnessLevel && <p className="text-red-200 text-sm mt-1">{errors.fitnessLevel.message}</p>}
            </div>

            <div className="flex gap-4 mt-6">
              <Button 
                type="button"
                onClick={() => navigate('/profile')}
                disabled={submitting}
                className="flex-1 bg-white bg-opacity-20 text-white font-bold py-3 rounded-lg border-2 border-white border-opacity-30 hover:bg-opacity-30 transition-all disabled:opacity-50"
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={submitting}
                className="flex-1 bg-white text-pink-500 font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProfileEdit;