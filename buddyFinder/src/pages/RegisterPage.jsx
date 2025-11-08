import RegisterForm from '../components/auth/RegisterForm';
import { Link } from 'react-router-dom';
import { Dumbbell, ArrowLeft } from 'lucide-react';

function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] relative overflow-hidden text-white">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-20 h-20 bg-[#FF5F00]/10 rounded-full blur-2xl animate-bounce" />
        <div className="absolute bottom-32 right-12 w-16 h-16 bg-[#FF5F00]/20 rounded-full blur-xl animate-pulse delay-1000" />
        <div className="absolute top-2/3 left-1/4 w-12 h-12 bg-[#FF5F00]/15 rounded-full blur-lg animate-pulse delay-500" />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-10 pb-6">
          <Link
            to="/"
            className="p-2 text-gray-400 hover:text-[#FF5F00] hover:bg-[#1A1A1A] rounded-full transition-all duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <div className="flex items-center">
            <Dumbbell className="w-6 h-6 text-[#FF5F00] mr-2" />
            <span className="text-[#FF5F00] font-extrabold text-lg tracking-tight">
              BuddyFinder
            </span>
          </div>

          <div className="w-10" /> {/* Spacer */}
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <div className="bg-[#111111] border border-[#2A2A2A] backdrop-blur-sm rounded-3xl p-8 shadow-[0_0_25px_rgba(255,95,0,0.15)] animate-fadeInUp">
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-[#FF5F00] mb-2 tracking-tight">
                  Join the Squad
                </h1>
                <p className="text-gray-400 text-sm">
                  Create your account and find your gym buddy
                </p>
              </div>

              {/* Register form */}
              <RegisterForm />

              {/* Link */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-[#FF5F00] font-bold hover:underline"
                  >
                    Sign In
                  </Link>
                </p>
              </div>
            </div>

            {/* Bottom accent line */}
            <div className="flex items-center justify-center mt-8">
              <div className="h-[2px] w-16 bg-[#FF5F00] rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
