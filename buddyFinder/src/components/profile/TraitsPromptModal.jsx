import { useEffect, useState } from 'react';
import { updateProfile } from '../../services/api';
import { showError, showSuccess } from '../../utils/toast';
import { useAuthStore } from '../../store/authStore';
import { Sparkles, Star, ExternalLink } from 'lucide-react';

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

function TraitsPromptModal({ isOpen, onClose, currentTraits = {}, plan, onUpdated }) {
  const { setUser } = useAuthStore();
  const [mbtiType, setMbtiType] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setMbtiType(currentTraits?.mbtiType || '');
      setZodiacSign(currentTraits?.zodiacSign || '');
    }
  }, [isOpen, currentTraits?.mbtiType, currentTraits?.zodiacSign]);

  if (!isOpen) return null;

  const handleSave = async () => {
    const payload = {};
    if (mbtiType) payload.mbtiType = mbtiType;
    if (zodiacSign) payload.zodiacSign = zodiacSign;

    if (!Object.keys(payload).length) {
      showError('Select at least one trait or skip for later.');
      return;
    }

    setSaving(true);
    try {
      const response = await updateProfile(payload);
      setUser(response.data);
      if (onUpdated) {
        onUpdated(response.data);
      }
      showSuccess('Personality traits updated!');
      onClose();
    } catch (error) {
      console.error('Failed to update traits:', error);
      const message =
        error.response?.data?.message || 'Unable to save traits. Please try again.';
      showError(message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center px-4">
      <div className="bg-[#111111] border border-[#FF5F00]/30 rounded-3xl w-full max-w-2xl p-6 shadow-[0_0_30px_rgba(255,95,0,0.25)]">
        <div className="flex items-start gap-3 mb-4">
          <div className="p-2 rounded-2xl bg-[#FF5F00]/20 text-[#FF5F00]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">
              {plan ? `${plan} perks unlocked!` : 'Premium perks unlocked!'}
            </h2>
            <p className="text-gray-400 mt-1">
              Add your MBTI type and Zodiac sign to unlock advanced filters and more compatible matches.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Sparkles className="w-4 h-4 text-[#FF5F00]" />
              MBTI Type
            </label>
            <select
              value={mbtiType}
              onChange={(e) => setMbtiType(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-white focus:border-[#FF5F00] focus:ring-1 focus:ring-[#FF5F00]"
            >
              <option value="">Select MBTI</option>
              {MBTI_TYPES.map((type) => (
                <option key={type} value={type} className="text-black">
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm text-gray-400 mb-2">
              <Star className="w-4 h-4 text-[#FF5F00]" />
              Zodiac Sign
            </label>
            <select
              value={zodiacSign}
              onChange={(e) => setZodiacSign(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#1A1A1A] border border-[#2A2A2A] text-white focus:border-[#FF5F00] focus:ring-1 focus:ring-[#FF5F00]"
            >
              <option value="">Select sign</option>
              {ZODIAC_SIGNS.map((sign) => (
                <option key={sign} value={sign} className="text-black">
                  {sign}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-2xl p-4 grid md:grid-cols-2 gap-4">
          <a
            href="https://www.16personalities.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#FF5F00]/10 border border-[#FF5F00]/30 text-white hover:bg-[#FF5F00]/20 transition"
          >
            <div>
              <p className="font-semibold">Don't know your MBTI?</p>
              <p className="text-sm text-gray-400">Take the test at 16personalities.com</p>
            </div>
            <ExternalLink className="w-4 h-4" />
          </a>
          <a
            href="https://www.zodiazsign.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-between gap-3 p-3 rounded-xl bg-[#FF5F00]/10 border border-[#FF5F00]/30 text-white hover:bg-[#FF5F00]/20 transition"
          >
            <div>
              <p className="font-semibold">Need your Zodiac sign?</p>
              <p className="text-sm text-gray-400">Lookup quickly at zodiazsign.com</p>
            </div>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row sm:justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto py-3 px-6 rounded-xl border border-[#2A2A2A] text-gray-300 hover:text-white hover:border-white transition"
          >
            Maybe later
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="w-full sm:w-auto py-3 px-6 rounded-xl bg-[#FF5F00] text-white font-semibold hover:bg-[#ff7133] transition disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save traits'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TraitsPromptModal;
