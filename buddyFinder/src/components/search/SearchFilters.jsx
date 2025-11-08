// src/components/search/SearchFilters.jsx - Update with tier check
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../common/Button';
import { Search, MapPin, Clock, Dumbbell, X, Crown, Lock } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

const schema = yup.object({
  activity: yup.string(),
  location: yup.string(),
  time: yup.string(),
  mbtiType: yup.string(),
  zodiacSign: yup.string(),
  fitnessLevel: yup.string(),
  gender: yup.string(),
});

function SearchFilters({ onSearch }) {
  const { user } = useAuthStore();
  const isPremium = user?.tier === 'PREMIUM' || user?.tier === 'ELITE';
  const isElite = user?.tier === 'ELITE';

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      activity: '',
      location: '',
      time: '',
      mbtiType: '',
      zodiacSign: '',
      fitnessLevel: '',
      gender: '',
    }
  });

  const watchedFields = watch();
  const hasFilters = Object.values(watchedFields).some(value => value);

  const onSubmit = async (data) => {
    const filters = Object.fromEntries(
      Object.entries(data).filter(([_, value]) => value)
    );
    onSearch(filters);
  };

  const handleClear = () => {
    reset();
    onSearch({});
  };

  const PremiumBadge = () => (
    <span className="inline-flex items-center gap-1 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
      <Crown className="w-3 h-3" />
      Premium
    </span>
  );

  const LockedFeature = ({ feature }) => (
    <div className="relative">
      <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
        <div className="text-center text-white p-4">
          <Lock className="w-8 h-8 mx-auto mb-2" />
          <p className="font-bold mb-1">{feature} Filter</p>
          <p className="text-xs mb-2">Premium Feature</p>
          <Link
            to="/pricing"
            className="inline-block bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold hover:bg-yellow-600 transition-all"
          >
            Upgrade
          </Link>
        </div>
      </div>
      <div className="opacity-30 pointer-events-none">
        <select
          disabled
          className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white border border-white border-opacity-30"
        >
          <option>Select {feature}</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6 sticky top-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Search className="w-5 h-5" />
          Find Gym Buddy
        </h3>
        {hasFilters && (
          <button
            onClick={handleClear}
            className="text-white opacity-70 hover:opacity-100 transition-opacity"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Basic Filters - Free for all */}
        <div>
          <label className="flex items-center text-white text-sm font-medium mb-2">
            <Dumbbell className="w-4 h-4 mr-2" />
            Activity
          </label>
          <input
            {...register('activity')}
            className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
            type="text"
            placeholder="e.g., Running, Yoga, Gym"
          />
        </div>

        <div>
          <label className="flex items-center text-white text-sm font-medium mb-2">
            <MapPin className="w-4 h-4 mr-2" />
            Location
          </label>
          <input
            {...register('location')}
            className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
            type="text"
            placeholder="e.g., Vancouver, Downtown"
          />
        </div>

        <div>
          <label className="flex items-center text-white text-sm font-medium mb-2">
            <Clock className="w-4 h-4 mr-2" />
            Time
          </label>
          <select
            {...register('time')}
            className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
          >
            <option value="" className="text-gray-800">Any time</option>
            <option value="morning" className="text-gray-800">Morning (6AM - 12PM)</option>
            <option value="afternoon" className="text-gray-800">Afternoon (12PM - 6PM)</option>
            <option value="evening" className="text-gray-800">Evening (6PM - 12AM)</option>
            <option value="weekends" className="text-gray-800">Weekends</option>
          </select>
        </div>

        {/* Premium Filters */}
        <div className="pt-4 border-t border-white border-opacity-20">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white text-xs opacity-70">Advanced Filters</p>
            {!isPremium && <PremiumBadge />}
          </div>
          
          {/* MBTI Type - Premium */}
          <div className="mb-4">
            <label className="flex items-center justify-between text-white text-sm font-medium mb-2">
              <span>MBTI Type</span>
              {!isPremium && <Lock className="w-3 h-3 opacity-70" />}
            </label>
            {isPremium ? (
              <select
                {...register('mbtiType')}
                className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="" className="text-gray-800">Any</option>
                <option value="INTJ" className="text-gray-800">INTJ</option>
                <option value="INTP" className="text-gray-800">INTP</option>
                <option value="ENTJ" className="text-gray-800">ENTJ</option>
                <option value="ENTP" className="text-gray-800">ENTP</option>
                <option value="INFJ" className="text-gray-800">INFJ</option>
                <option value="INFP" className="text-gray-800">INFP</option>
                <option value="ENFJ" className="text-gray-800">ENFJ</option>
                <option value="ENFP" className="text-gray-800">ENFP</option>
                <option value="ISTJ" className="text-gray-800">ISTJ</option>
                <option value="ISFJ" className="text-gray-800">ISFJ</option>
                <option value="ESTJ" className="text-gray-800">ESTJ</option>
                <option value="ESFJ" className="text-gray-800">ESFJ</option>
                <option value="ISTP" className="text-gray-800">ISTP</option>
                <option value="ISFP" className="text-gray-800">ISFP</option>
                <option value="ESTP" className="text-gray-800">ESTP</option>
                <option value="ESFP" className="text-gray-800">ESFP</option>
              </select>
            ) : (
              <LockedFeature feature="MBTI" />
            )}
          </div>

          {/* Zodiac Sign - Premium */}
          <div className="mb-4">
            <label className="flex items-center justify-between text-white text-sm font-medium mb-2">
              <span>Zodiac Sign</span>
              {!isPremium && <Lock className="w-3 h-3 opacity-70" />}
            </label>
            {isPremium ? (
              <select
                {...register('zodiacSign')}
                className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
              >
                <option value="" className="text-gray-800">Any</option>
                <option value="Aries" className="text-gray-800">Aries</option>
                <option value="Taurus" className="text-gray-800">Taurus</option>
                <option value="Gemini" className="text-gray-800">Gemini</option>
                <option value="Cancer" className="text-gray-800">Cancer</option>
                <option value="Leo" className="text-gray-800">Leo</option>
                <option value="Virgo" className="text-gray-800">Virgo</option>
                <option value="Libra" className="text-gray-800">Libra</option>
                <option value="Scorpio" className="text-gray-800">Scorpio</option>
                <option value="Sagittarius" className="text-gray-800">Sagittarius</option>
                <option value="Capricorn" className="text-gray-800">Capricorn</option>
                <option value="Aquarius" className="text-gray-800">Aquarius</option>
                <option value="Pisces" className="text-gray-800">Pisces</option>
              </select>
            ) : (
              <LockedFeature feature="Zodiac" />
            )}
          </div>

          {/* Fitness Level - Free */}
          <div className="mb-4">
            <label className="text-white text-sm font-medium mb-2 block">
              Fitness Level
            </label>
            <select
              {...register('fitnessLevel')}
              className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="" className="text-gray-800">Any</option>
              <option value="Beginner" className="text-gray-800">Beginner</option>
              <option value="Intermediate" className="text-gray-800">Intermediate</option>
              <option value="Advanced" className="text-gray-800">Advanced</option>
            </select>
          </div>

          {/* Gender - Free */}
          <div className="mb-4">
            <label className="text-white text-sm font-medium mb-2 block">
              Gender
            </label>
            <select
              {...register('gender')}
              className="w-full p-3 rounded-xl bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="" className="text-gray-800">Any</option>
              <option value="Male" className="text-gray-800">Male</option>
              <option value="Female" className="text-gray-800">Female</option>
              <option value="Other" className="text-gray-800">Other</option>
            </select>
          </div>
        </div>

        {/* Search Button */}
        <Button 
          type="submit"
          className="w-full bg-white text-pink-500 font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all shadow-lg"
        >
          <Search className="w-5 h-5 inline mr-2" />
          Search
        </Button>

        {/* Upgrade CTA for Free users */}
        {!isPremium && (
          <Link to="/pricing">
            <div className="mt-4 p-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl text-white text-center cursor-pointer hover:shadow-lg transition-all">
              <Crown className="w-6 h-6 mx-auto mb-2" />
              <p className="font-bold mb-1">Unlock Advanced Filters</p>
              <p className="text-xs opacity-90">Upgrade to Premium to search by MBTI & Zodiac</p>
            </div>
          </Link>
        )}

        {/* Tips */}
        <div className="mt-4 pt-4 border-t border-white border-opacity-20">
          <p className="text-white text-xs opacity-70 mb-2">💡 Search Tips:</p>
          <ul className="text-white text-xs opacity-60 space-y-1">
            <li>• Leave fields empty to see all matches</li>
            <li>• Be specific for better results</li>
            {!isPremium && <li>• Upgrade for personality-based matching</li>}
          </ul>
        </div>
      </form>
    </div>
  );
}

export default SearchFilters;