// LoginPage.jsx
import LoginForm from '../components/auth/LoginForm';
import { Link } from 'react-router-dom';
import { Heart, ArrowLeft } from 'lucide-react';

function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-orange-400 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-10 w-16 h-16 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 left-8 w-12 h-12 bg-white bg-opacity-15 rounded-full animate-bounce delay-1000"></div>
        <div className="absolute top-1/2 right-1/4 w-8 h-8 bg-white bg-opacity-20 rounded-full animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-12 pb-8">
          <Link to="/" className="p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div className="flex items-center">
            <Heart className="w-6 h-6 text-white mr-2" />
            <span className="text-white font-bold text-lg">BuddyFinder</span>
          </div>
          <div className="w-10"></div> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                <p className="text-white opacity-80">Sign in to continue your fitness journey</p>
              </div>
              
              <LoginForm />
              
              <div className="mt-6 text-center">
                <p className="text-white opacity-80 text-sm">
                  Don't have an account?{' '}
                  <Link to="/register" className="text-white font-bold underline hover:no-underline">
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;