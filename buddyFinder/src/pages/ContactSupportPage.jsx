import ContactSupportForm from '../components/auth/ContactSupportForm';
import { Link } from 'react-router-dom';
import { ArrowLeft, Dumbbell } from 'lucide-react';

function ContactSupportPage() {
  return (
    <div className="min-h-screen bg-[#0B0B0B] text-white relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-20 h-20 bg-[#FF5F00]/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-24 left-12 w-16 h-16 bg-[#FF5F00]/20 rounded-full blur-xl animate-bounce delay-1000" />
      </div>
      <div className="relative z-10 min-h-screen flex flex-col">
        <div className="flex items-center justify-between px-6 pt-10 pb-6">
          <Link
            to="/login"
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
          <div className="w-10" />
        </div>

        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-lg">
            <ContactSupportForm />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactSupportPage;
