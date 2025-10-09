// import { Link, useNavigate } from 'react-router-dom';
// import { useAuthStore } from '../../store/authStore';
// function Navbar() {
//   const { isAuthenticated, logout } = useAuthStore();
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     logout();
//     localStorage.removeItem('token');
//     navigate('/login');
//   };

//   return (
//     <nav className="bg-blue-600 text-white p-4">
//       <div className="container mx-auto flex justify-between items-center">
//         <Link to="/" className="text-xl font-bold">BuddyFind</Link>
//         <div className="space-x-4">
//           <Link to="/" className="hover:underline">Home</Link>
//           {isAuthenticated ? (
//             <>
//               <Link to="/profile" className="hover:underline">Profile</Link>
//               <Link to="/search" className="hover:underline">Search</Link>
//               <Link to="/activities" className="hover:underline">Activities</Link>
//               <Link to="/chat" className="hover:underline">Chat</Link>
//               <Link to="/rating" className="hover:underline">Rating</Link>
//               <button onClick={handleLogout} className="hover:underline">Logout</button>
//             </>
//           ) : (
//             <>
//               <Link to="/login" className="hover:underline">Login</Link>
//               <Link to="/register" className="hover:underline">Register</Link>
//             </>
//           )}
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

function Navbar() {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    navigate('/login');
  };

  // Ẩn navbar trên homepage khi chưa đăng nhập
  if (!isAuthenticated && location.pathname === '/') return null;

  return (
    <nav className="relative top-0 left-0 right-0 z-50 bg-[linear-gradient(180deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0)_100%)] backdrop-blur-sm">
      <div className="container mx-auto flex justify-between items-center px-6 py-4">
        <Link to="/" className="text-xl font-bold text-black hover:text-gray-200 transition-colors">
          BuddyFinder
        </Link>
        
        <div className="flex items-center space-x-6">
          <Link 
            to="/" 
            className="text-black hover:underline hover:text-gray-200 transition-all duration-200"
          >
            Home
          </Link>
          
          {isAuthenticated ? (
            <>
              <Link 
                to="/profile" 
                className="text-black hover:underline hover:text-gray-200 transition-all duration-200"
              >
                Profile
              </Link>
              <Link 
                to="/search" 
                className="text-black hover:underline hover:text-gray-200 transition-all duration-200"
              >
                Search
              </Link>
              <Link 
                to="/activities" 
                className="text-black hover:underline hover:text-gray-200 transition-all duration-200"
              >
                Activities
              </Link>
              <Link 
                to="/chat" 
                className="text-black hover:underline hover:text-gray-200 transition-all duration-200"
              >
                Chat
              </Link>
              <Link 
                to="/rating" 
                className="text-black hover:underline hover:text-gray-200 transition-all duration-200"
              >
                Rating
              </Link>
              <button 
                onClick={handleLogout} 
                className="text-black hover:underline hover:text-gray-200 transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link 
                to="/login" 
                className="text-black hover:underline hover:text-gray-200 transition-all duration-200"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="text-black hover:underline hover:text-gray-200 transition-all duration-200"
              >
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