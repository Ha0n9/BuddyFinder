import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import Navbar from './components/common/Navbar';
import { useEffect } from 'react';
import websocketService from './services/websocket';
import { useNotificationStore } from './store/notificationStore';
import { getUserProfile } from './services/api';
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
import PricingPage from "./pages/PricingPage";
import CheckoutPage from "./pages/CheckoutPage";
import UserProfileView from './pages/UserProfileView';
import RefundPage from './pages/RefundPage';
import ReportsPage from './pages/ReportsPage';
import ContactSupportPage from './pages/ContactSupportPage';
import LikesPage from './pages/LikesPage';

function App() {
  const { isAuthenticated, user, setUser, logout } = useAuthStore();
  const { addNotification } = useNotificationStore();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      logout();
      return;
    }

    getUserProfile()
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem('token');
        logout();
      });
  }, [logout, setUser]);

  useEffect(() => {
    if (!isAuthenticated || !user?.userId) {
      websocketService.disconnect();
      return;
    }

    const token = localStorage.getItem('token');
    let isActive = true;

    websocketService
      .connect(token)
      .then(() => {
        if (!isActive) return;
        websocketService.subscribeToNotifications(user.userId, (notification) => {
          addNotification(notification);
        });
      })
      .catch((err) => {
        console.error('Failed to connect to notification WebSocket:', err);
      });

    return () => {
      isActive = false;
      websocketService.unsubscribeFromNotifications(user.userId);
    };
  }, [isAuthenticated, user?.userId, addNotification]);

  // 🔥 Admin routing - Redirect to admin dashboard
  if (isAuthenticated && user?.isAdmin) {
    return (
      <>
        <Navbar />
        <Routes>
          <Route path="/admin/*" element={<AdminDashboard />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </>
    );
  }

  // 🎯 Regular user routing
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/search" />} />
        <Route path="/contact-support" element={<ContactSupportPage />} />
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

        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />

        <Route path="/user/:userId" element={
          <ProtectedRoute>
            <UserProfileView />
          </ProtectedRoute>
        } />

        <Route path="/refund" element={
          <ProtectedRoute>
            <RefundPage />
          </ProtectedRoute>
        } />

        <Route path="/likes" element={
          <ProtectedRoute>
            <LikesPage />
          </ProtectedRoute>
        } />

        <Route path="/reports" element={
          <ProtectedRoute>
            <ReportsPage />
          </ProtectedRoute>
        } />
      </Routes>
    </>
  );
}

export default App;
