import { useAuthStore } from '../../store/authStore';
import { Link } from 'react-router-dom';

function ProfileCard() {
  const { user } = useAuthStore();

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{user.name}</h2>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Age:</strong> {user.age}</p>
      <p><strong>Interests:</strong> {user.interests}</p>
      <p><strong>Location:</strong> {user.location}</p>
      <p><strong>Availability:</strong> {user.availability}</p>
      <Link to="/profile/edit" className="text-blue-500 hover:underline mt-4 block">Edit Profile</Link>
    </div>
  );
}

export default ProfileCard;