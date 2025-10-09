import { Routes, Route } from 'react-router-dom';
import ProfileCard from '../components/profile/ProfileCard';
import ProfileEdit from '../components/profile/ProfileEdit';

function ProfilePage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Your Profile</h1>
      <Routes>
        <Route path="/" element={<ProfileCard />} />
        <Route path="edit" element={<ProfileEdit />} />
      </Routes>
    </div>
  );
}

export default ProfilePage;