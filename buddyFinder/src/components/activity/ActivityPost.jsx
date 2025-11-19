import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { getActivityChatRoom, postActivity } from '../../services/api';
import Button from '../common/Button';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { showError, showSuccess } from '../../utils/toast';

const schema = yup.object({
  title: yup.string().required('Title is required'),
  description: yup.string().required('Description is required'),
  location: yup.string().required('Location is required'),
  scheduledTime: yup.string().required('Time is required'),
  maxParticipants: yup.number().positive().integer().required('Max participants required'),
  difficultyLevel: yup.string().required('Difficulty level required'),
}).required();

function ActivityPost({ onActivityPosted }) {
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      const response = await postActivity(data);
      showSuccess('Activity posted successfully!');
      reset();
      if (onActivityPosted) onActivityPosted();

      try {
        const chatRoom = await getActivityChatRoom(response.data.activityId);
        const roomId = chatRoom.data?.roomId;
        if (roomId) {
          navigate(`/chat?type=group&room=${roomId}`);
        }
      } catch (chatError) {
        console.error('Failed to open group chat after posting activity:', chatError);
      }
    } catch (error) {
      console.error('Activity posting failed:', error);
      showError(error.response?.data?.message || 'Failed to post activity');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-6 space-y-4">
      <h3 className="text-xl font-bold text-white mb-4">Post New Activity</h3>

      <div>
        <label className="block text-white mb-2">Title</label>
        <input
          {...register('title')}
          className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
          type="text"
          placeholder="Morning Run"
          disabled={submitting}
        />
        {errors.title && <p className="text-red-200 text-sm mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-white mb-2">Description</label>
        <textarea
          {...register('description')}
          className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
          rows="3"
          placeholder="5km run through Stanley Park"
          disabled={submitting}
        />
        {errors.description && <p className="text-red-200 text-sm mt-1">{errors.description.message}</p>}
      </div>

      <div>
        <label className="block text-white mb-2">Location</label>
        <input
          {...register('location')}
          className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
          type="text"
          placeholder="Stanley Park, Vancouver"
          disabled={submitting}
        />
        {errors.location && <p className="text-red-200 text-sm mt-1">{errors.location.message}</p>}
      </div>

      <div>
        <label className="block text-white mb-2">Scheduled Time</label>
        <input
          {...register('scheduledTime')}
          className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
          type="datetime-local"
          disabled={submitting}
        />
        {errors.scheduledTime && <p className="text-red-200 text-sm mt-1">{errors.scheduledTime.message}</p>}
      </div>

      <div>
        <label className="block text-white mb-2">Max Participants</label>
        <input
          {...register('maxParticipants')}
          className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white placeholder-white placeholder-opacity-70 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
          type="number"
          min="2"
          placeholder="5"
          disabled={submitting}
        />
        {errors.maxParticipants && <p className="text-red-200 text-sm mt-1">{errors.maxParticipants.message}</p>}
      </div>

      <div>
        <label className="block text-white mb-2">Difficulty Level</label>
        <select
          {...register('difficultyLevel')}
          className="w-full p-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-white"
          disabled={submitting}
        >
          <option value="" className="text-gray-800">Select difficulty</option>
          <option value="Beginner" className="text-gray-800">Beginner</option>
          <option value="Intermediate" className="text-gray-800">Intermediate</option>
          <option value="Advanced" className="text-gray-800">Advanced</option>
        </select>
        {errors.difficultyLevel && <p className="text-red-200 text-sm mt-1">{errors.difficultyLevel.message}</p>}
      </div>

      <Button 
        type="submit" 
        disabled={submitting}
        className="w-full bg-white text-pink-500 font-bold py-3 rounded-lg hover:bg-opacity-90 transition-all disabled:opacity-50"
      >
        {submitting ? 'Posting...' : 'Post Activity'}
      </Button>
    </form>
  );
}

export default ActivityPost;
