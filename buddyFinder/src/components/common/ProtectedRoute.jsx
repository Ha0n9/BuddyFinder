import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 flex items-center justify-center px-4">
        <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-8 max-w-md text-center">
          <h2 className="text-2xl font-bold text-white mb-4">🚫 Access Denied</h2>
          <p className="text-white opacity-80 mb-6">
            You need administrator privileges to access this page.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-white text-pink-500 px-6 py-3 rounded-full font-bold hover:shadow-lg transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;