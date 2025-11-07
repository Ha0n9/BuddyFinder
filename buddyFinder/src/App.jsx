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
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/common/ProtectedRoute';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/search" />} />
        <Route path="/register" element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/search" />} />
        
        <Route path="/profile/*" element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        } />
        
        <Route path="/search" element={
          <ProtectedRoute>
            <SearchPage />
          </ProtectedRoute>
        } />
        
        <Route path="/activities" element={
          <ProtectedRoute>
            <ActivityPage />
          </ProtectedRoute>
        } />
        
        <Route path="/chat" element={
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        } />
        
        <Route path="/rating" element={
          <ProtectedRoute>
            <RatingPage />
          </ProtectedRoute>
        } />
        
        <Route path="/admin" element={
          <ProtectedRoute requireAdmin={true}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;