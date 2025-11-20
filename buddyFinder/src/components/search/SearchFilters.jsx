import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import Button from '../common/Button';
import { Search, MapPin, Clock, Dumbbell, X, Lock, Navigation } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

const optionalNumber = yup
  .number()
  .transform((value) => (Number.isNaN(value) ? undefined : value))
  .nullable();

const schema = yup.object({
  activity: yup.string(),
  location: yup.string(),
  time: yup.string(),
  mbtiType: yup.string(),
  zodiacSign: yup.string(),
  fitnessLevel: yup.string(),
  gender: yup.string(),
  latitude: optionalNumber,
  longitude: optionalNumber,
  radiusKm: optionalNumber
    .min(1, 'Radius must be at least 1km')
    .max(500, 'Radius must be less than 500km'),
});

function SearchFilters({ onSearch }) {
  const { user } = useAuthStore();
  const isPremium = user?.tier === 'PREMIUM' || user?.tier === 'ELITE';

  const { register, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      activity: '',
      location: '',
      time: '',
      mbtiType: '',
      zodiacSign: '',
      fitnessLevel: '',
      gender: '',
      latitude: null,
      longitude: null,
      radiusKm: null,
    }
  });

  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState('');

  const watchedFields = watch();
  const radiusKm = watch('radiusKm');
  const latitude = watch('latitude');
  const longitude = watch('longitude');
  const hasFilters = Object.values(watchedFields).some((v) => v);
  const hasPreciseLocation = Number.isFinite(latitude) && Number.isFinite(longitude);

  const onSubmit = (data) => {
    const filters = Object.fromEntries(
      Object.entries(data).filter(([, value]) => {
        if (typeof value === 'number') {
          return !Number.isNaN(value);
        }
        return Boolean(value);
      })
    );
    onSearch(filters);
  };

  const handleClear = () => {
    reset();
    setGeoError('');
    onSearch({});
  };

  const handleUseLocation = () => {
    setGeoError('');
    if (!navigator.geolocation) {
      setGeoError('Geolocation is not supported in this browser.');
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setValue('latitude', Number(position.coords.latitude.toFixed(6)), { shouldDirty: true });
        setValue('longitude', Number(position.coords.longitude.toFixed(6)), { shouldDirty: true });
        if (!Number.isFinite(radiusKm)) {
          setValue('radiusKm', 25, { shouldDirty: true });
        }
        setIsLocating(false);
      },
      (error) => {
        setGeoError(error.message || 'Unable to fetch your location.');
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const clearPreciseLocation = () => {
    setValue('latitude', null, { shouldDirty: true });
    setValue('longitude', null, { shouldDirty: true });
    setValue('radiusKm', null, { shouldDirty: true });
    setGeoError('');
  };

  return (
    <div className="bg-[#1A1A1A]/90 backdrop-blur-md border border-[#2A2A2A] rounded-3xl p-6 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <Search className="w-5 h-5 text-[#FF5F00]" />
          Find Gym Buddy
        </h3>

        {hasFilters && (
          <button
            onClick={handleClear}
            className="text-gray-300 hover:text-white transition"
            type="button"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <input type="hidden" {...register('latitude', { valueAsNumber: true })} />
        <input type="hidden" {...register('longitude', { valueAsNumber: true })} />

        {/* Activity */}
        <Field
          label="Activity"
          icon={<Dumbbell className="w-4 h-4 text-[#FF5F00]" />}
          placeholder="e.g., Running, Yoga, Gym"
          register={register('activity')}
        />

        {/* Location */}
        <Field
          label="Location"
          icon={<MapPin className="w-4 h-4 text-[#FF5F00]" />}
          placeholder="e.g., Vancouver, Downtown"
          register={register('location')}
        />

        {/* Geo radius */}
        <div className="bg-[#111111] border border-[#2A2A2A] rounded-2xl p-4 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-200">
              <MapPin className="w-4 h-4 text-[#FF5F00]" />
              Distance radius (km)
            </div>
            <button
              type="button"
              onClick={handleUseLocation}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-[#FF5F00]/20 text-[#FF5F00] hover:bg-[#FF5F00]/30 transition disabled:opacity-60"
              disabled={isLocating}
            >
              <Navigation className="w-4 h-4" />
              {isLocating ? 'Locating...' : hasPreciseLocation ? 'Update my location' : 'Use my location'}
            </button>
          </div>
          <input
            type="number"
            min={1}
            max={500}
            {...register('radiusKm', { valueAsNumber: true })}
            className="w-full p-3 rounded-xl bg-[#2A2A2A]/60 text-white placeholder-gray-400 border border-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#FF5F00] disabled:opacity-50"
            placeholder="e.g., 20"
            disabled={!hasPreciseLocation}
          />
          {errors.radiusKm && (
            <p className="text-xs text-red-400">{errors.radiusKm.message}</p>
          )}
          <div className="text-xs text-gray-400 space-y-1">
            <p>
              {hasPreciseLocation
                ? `Filtering users within ${radiusKm || 25} km of your precise location.`
                : 'Enable precise location to search by distance.'}
            </p>
            {hasPreciseLocation && (
              <>
                <p className="text-gray-500">
                  Lat: {latitude?.toFixed ? latitude.toFixed(3) : latitude} · Lon: {longitude?.toFixed ? longitude.toFixed(3) : longitude}
                </p>
                <button
                  type="button"
                  onClick={clearPreciseLocation}
                  className="text-[#FF5F00] font-semibold hover:underline"
                >
                  Clear precise location
                </button>
              </>
            )}
            {geoError && <p className="text-red-400">{geoError}</p>}
          </div>
        </div>

        {/* Time */}
        <SelectField
          label="Time"
          icon={<Clock className="w-4 h-4 text-[#FF5F00]" />}
          register={register('time')}
          options={[
            { value: '', label: 'Any time' },
            { value: 'morning', label: 'Morning (6AM - 12PM)' },
            { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
            { value: 'evening', label: 'Evening (6PM - 12AM)' },
            { value: 'weekends', label: 'Weekends' },
          ]}
        />

        {/* Divider */}
        <div className="border-t border-[#2A2A2A] pt-4">
          <p className="text-xs text-gray-400 mb-2">Advanced Filters</p>

          {/* MBTI */}
          {isPremium ? (
            <SelectField
              label="MBTI Type"
              register={register('mbtiType')}
              options={[
                { value: '', label: 'Any' },
                ...[
                  'INTJ','INTP','ENTJ','ENTP','INFJ','INFP','ENFJ','ENFP',
                  'ISTJ','ISFJ','ESTJ','ESFJ','ISTP','ISFP','ESTP','ESFP',
                ].map((t) => ({ value: t, label: t })),
              ]}
            />
          ) : (
            <LockedFeature feature="MBTI" />
          )}

          {/* Zodiac */}
          {isPremium ? (
            <SelectField
              label="Zodiac Sign"
              register={register('zodiacSign')}
              options={[
                { value: '', label: 'Any' },
                ...[
                  'Aries','Taurus','Gemini','Cancer','Leo','Virgo','Libra','Scorpio',
                  'Sagittarius','Capricorn','Aquarius','Pisces'
                ].map((z) => ({ value: z, label: z })),
              ]}
            />
          ) : (
            <LockedFeature feature="Zodiac" />
          )}

          {/* Fitness Level */}
          <SelectField
            label="Fitness Level"
            register={register('fitnessLevel')}
            options={[
              { value: '', label: 'Any' },
              { value: 'Beginner', label: 'Beginner' },
              { value: 'Intermediate', label: 'Intermediate' },
              { value: 'Advanced', label: 'Advanced' },
            ]}
          />

          {/* Gender */}
          <SelectField
            label="Gender"
            register={register('gender')}
            options={[
              { value: '', label: 'Any' },
              { value: 'Male', label: 'Male' },
              { value: 'Female', label: 'Female' },
              { value: 'Other', label: 'Other' },
            ]}
          />
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          variant="primary"
          className="w-full font-bold py-3 text-lg shadow-[0_0_20px_rgba(255,95,0,0.4)]"
        >
          <Search className="w-5 h-5 mr-2" /> Search
        </Button>

        {/* Tips */}
        <div className="mt-5 border-t border-[#2A2A2A] pt-4 text-gray-400 text-xs">
          <p className="mb-1">💡 Tips:</p>
          <ul className="space-y-1">
            <li>• Leave fields empty to see all matches</li>
            <li>• Be specific for better results</li>
            {!isPremium && <li>• Upgrade to unlock MBTI & Zodiac filters</li>}
          </ul>
        </div>
      </form>
    </div>
  );
}

/* --------------- Sub Components --------------- */
const Field = ({ label, icon, placeholder, register }) => (
  <div>
    <label className="text-sm font-medium text-gray-200 mb-2 block flex items-center gap-2">
      {icon} {label}
    </label>
    <input
      {...register}
      className="w-full p-3 rounded-xl bg-[#2A2A2A]/60 text-white placeholder-gray-400 border border-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
      placeholder={placeholder}
    />
  </div>
);

const SelectField = ({ label, icon, register, options }) => (
  <div>
    <label className="text-sm font-medium text-gray-200 mb-2 block flex items-center gap-2">
      {icon} {label}
    </label>
    <select
      {...register}
      className="w-full p-3 rounded-xl bg-[#2A2A2A]/60 text-white border border-[#3A3A3A] focus:outline-none focus:ring-2 focus:ring-[#FF5F00]"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="text-black">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

const LockedFeature = ({ feature }) => (
  <div className="relative mb-3">
    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm rounded-xl flex flex-col items-center justify-center text-white z-10">
      <Lock className="w-6 h-6 mb-1 text-[#FF5F00]" />
      <p className="text-sm font-bold mb-1">{feature} Filter</p>
      <Link
        to="/pricing"
        className="text-xs font-bold bg-[#FF5F00] text-black px-3 py-1 rounded-full hover:bg-[#E95000] transition-all"
      >
        Upgrade
      </Link>
    </div>
    <select
      disabled
      className="w-full p-3 rounded-xl bg-[#2A2A2A]/40 text-white border border-[#3A3A3A] opacity-30 pointer-events-none"
    >
      <option>Select {feature}</option>
    </select>
  </div>
);

export default SearchFilters;
