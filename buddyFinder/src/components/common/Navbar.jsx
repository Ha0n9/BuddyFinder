import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  if (!isAuthenticated && location.pathname === '/') return null;

  return (
    <nav className="relative top-0 left-0 right-0 z-50 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)] backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-xl font-bold text-black hover:text-gray-200 transition-colors">
          BuddyFinder
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link to="/" className="text-black hover:underline hover:text-gray-200 transition-all duration-200">
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link to="/profile" className="text-black hover:underline hover:text-gray-200 transition-all duration-200">
                Profile
              </Link>
              <Link to="/search" className="text-black hover:underline hover:text-gray-200 transition-all duration-200">
                Search
              </Link>
              <Link to="/activities" className="text-black hover:underline hover:text-gray-200 transition-all duration-200">
                Activities
              </Link>
              <Link to="/chat" className="text-black hover:underline hover:text-gray-200 transition-all duration-200">
                Chat
              </Link>
              <Link to="/rating" className="text-black hover:underline hover:text-gray-200 transition-all duration-200">
                Rating
              </Link>
              <Link to="/pricing" className="text-black hover:underline hover:text-gray-200 transition-all duration-200">
                Pricing
              </Link>
              {user?.isAdmin && (
                <Link to="/admin" className="text-black hover:underline hover:text-gray-200 transition-all duration-200 font-bold">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="text-black hover:underline hover:text-gray-200 transition-all duration-200">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-black hover:underline hover:text-gray-200 transition-all duration-200">
                Login
              </Link>
              <Link to="/register" className="text-black hover:underline hover:text-gray-200 transition-all duration-200">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;