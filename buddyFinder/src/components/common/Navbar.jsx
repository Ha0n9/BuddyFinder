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

  // Ẩn navbar trên trang landing nếu chưa đăng nhập
  if (!isAuthenticated && location.pathname === '/') return null;

  return (
    <nav
      className="relative w-full
        backdrop-blur-md
        bg-[rgba(14,14,14,0.9)]
        border-b border-[var(--color-border)]
        shadow-[0_4px_25px_rgba(0,0,0,0.6)]"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-3">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-extrabold tracking-tight 
            text-[var(--color-primary)] 
            hover:text-[var(--color-primary-light)] 
            transition-colors duration-200"
        >
          BuddyFinder
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6 text-[var(--color-text-primary)]">
          <NavItem to="/" label="Home" />

          {isAuthenticated ? (
            <>
              <NavItem to="/profile" label="Profile" />
              <NavItem to="/search" label="Search" />
              <NavItem to="/activities" label="Activities" />
              <NavItem to="/chat" label="Chat" />
              <NavItem to="/rating" label="Rating" />
              <NavItem to="/pricing" label="Pricing" />

              {user?.isAdmin && (
                <NavItem to="/admin" label="Admin" highlight />
              )}

              <button
                onClick={handleLogout}
                className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] font-medium transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavItem to="/login" label="Login" />
              <NavItem to="/register" label="Register" />
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

/* ---------------- NAV ITEM COMPONENT ---------------- */
function NavItem({ to, label, highlight }) {
  return (
    <Link
      to={to}
      className={`text-sm md:text-base font-semibold tracking-wide transition-all duration-200 
        ${highlight
          ? 'text-[var(--color-primary)] border-b-2 border-[var(--color-primary)] pb-1'
          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:border-b-2 hover:border-[var(--color-primary)] pb-1'}`}
    >
      {label}
    </Link>
  );
}

export default Navbar;
