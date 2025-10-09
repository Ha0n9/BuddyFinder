import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/common/Navbar';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SearchPage from './pages/SearchPage';
import ActivityPage from './pages/ActivityPage';
import ChatPage from './pages/ChatPage';
import RatingPage from './pages/RatingPage';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="min-h-screen">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={
          isAuthenticated ? <Navigate to="/search" replace /> : <LoginPage />
        } />
        <Route path="/register" element={
          isAuthenticated ? <Navigate to="/search" replace /> : <RegisterPage />
        } />
        <Route path="/profile/*" element={
          isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />
        } />
        <Route path="/search" element={
          isAuthenticated ? <SearchPage /> : <Navigate to="/login" replace />
        } />
        <Route path="/activities" element={
          isAuthenticated ? <ActivityPage /> : <Navigate to="/login" replace />
        } />
        <Route path="/chat" element={
          isAuthenticated ? <ChatPage /> : <Navigate to="/login" replace />
        } />
        <Route path="/rating" element={
          isAuthenticated ? <RatingPage /> : <Navigate to="/login" replace />
        } />
      </Routes>
    </div>
  );
}

export default App;