// import LoginForm from '../components/auth/LoginForm';
// import { Link } from 'react-router-dom';
// import { Dumbbell, ArrowLeft } from 'lucide-react';

// function LoginPage() {
//   return (
//     <div className="min-h-screen bg-[#0B0B0B] relative overflow-hidden text-white">
//       {/* Background accents */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute top-20 right-10 w-20 h-20 bg-[#FF5F00]/10 rounded-full blur-2xl animate-pulse" />
//         <div className="absolute bottom-24 left-12 w-16 h-16 bg-[#FF5F00]/20 rounded-full blur-xl animate-bounce delay-1000" />
//         <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-[#FF5F00]/10 rounded-full blur-lg animate-pulse delay-500" />
//       </div>

//       <div className="relative z-10 min-h-screen flex flex-col">
//         {/* Header */}
//         <div className="flex items-center justify-between px-6 pt-10 pb-6">
//           <Link
//             to="/"
//             className="p-2 text-gray-400 hover:text-[#FF5F00] hover:bg-[#1A1A1A] rounded-full transition-all duration-200"
//           >
//             <ArrowLeft className="w-6 h-6" />
//           </Link>
//           <div className="flex items-center">
//             <Dumbbell className="w-6 h-6 text-[#FF5F00] mr-2" />
//             <span className="text-[#FF5F00] font-extrabold text-lg tracking-tight">
//               BuddyFinder
//             </span>
//           </div>
//           <div className="w-10" /> {/* Spacer */}
//         </div>

//         {/* Content */}
//         <div className="flex-1 flex items-center justify-center px-6">
//           <div className="w-full max-w-md">
//             <div className="bg-[#111111] border border-[#2A2A2A] backdrop-blur-sm rounded-3xl p-8 shadow-[0_0_25px_rgba(255,95,0,0.15)]">
//               {/* Title */}
//               <div className="text-center mb-8">
//                 <h1 className="text-3xl font-extrabold text-[#FF5F00] mb-2 tracking-tight">
//                   Welcome Back
//                 </h1>
//                 <p className="text-gray-400 text-sm">
//                   Sign in to continue your fitness journey
//                 </p>
//               </div>

//               {/* Login form */}
//               <LoginForm />

//               {/* Sign up link */}
//               <div className="mt-6 text-center">
//                 <p className="text-gray-400 text-sm">
//                   Don’t have an account?{" "}
//                   <Link
//                     to="/register"
//                     className="text-[#FF5F00] font-bold hover:underline"
//                   >
//                     Sign Up
//                   </Link>
//                 </p>
//               </div>
//             </div>

//             {/* Decorative line */}
//             <div className="flex items-center justify-center mt-8">
//               <div className="h-[2px] w-16 bg-[#FF5F00] rounded-full animate-pulse" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default LoginPage;

import LoginForm from "../components/auth/LoginForm";
import { Link } from "react-router-dom";
import { Dumbbell, ArrowLeft } from "lucide-react";
import { showError } from "../utils/toast";

function LoginPage() {
  // Monkey patch toast lỗi khi đăng nhập bị ban
  // (chỉ chạy 1 lần để override showError behavior cho login)
  const originalShowError = showError;
  window.lastToastMessage = window.lastToastMessage || "";
  window.lastToastTime = window.lastToastTime || 0;

  const patchedShowError = (msg) => {
    const now = Date.now();

    // Chặn spam toast (cách nhau < 1 giây hoặc trùng nội dung)
    if (
      msg === window.lastToastMessage &&
      now - window.lastToastTime < 1000
    )
      return;

    window.lastToastMessage = msg;
    window.lastToastTime = now;

    // Ưu tiên hiển thị message gốc từ backend
    if (msg.toLowerCase().includes("banned")) {
      originalShowError("Your account has been banned. Please contact support.");
    } else if (msg.toLowerCase().includes("invalid") || msg.toLowerCase().includes("password")) {
      originalShowError("Invalid email or password");
    } else if (msg.toLowerCase().includes("access denied")) {
      // Tránh hiện "Access denied" khi user bị ban / login fail
      return;
    } else {
      originalShowError(msg);
    }
  };

  // Override global showError trong context trang login
  window.showError = patchedShowError;

  return (
    <div className="min-h-screen bg-[#0B0B0B] relative overflow-hidden text-white">
      {/* Background accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-20 h-20 bg-[#FF5F00]/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-24 left-12 w-16 h-16 bg-[#FF5F00]/20 rounded-full blur-xl animate-bounce delay-1000" />
        <div className="absolute top-1/3 left-1/4 w-12 h-12 bg-[#FF5F00]/10 rounded-full blur-lg animate-pulse delay-500" />
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
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="w-full max-w-md">
            <div className="bg-[#111111] border border-[#2A2A2A] backdrop-blur-sm rounded-3xl p-8 shadow-[0_0_25px_rgba(255,95,0,0.15)]">
              {/* Title */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-[#FF5F00] mb-2 tracking-tight">
                  Welcome Back
                </h1>
                <p className="text-gray-400 text-sm">
                  Sign in to continue your fitness journey
                </p>
              </div>

              {/* Login form */}
              <LoginForm />

              {/* Sign up link */}
              <div className="mt-6 text-center">
                <p className="text-gray-400 text-sm">
                  Don’t have an account?{" "}
                  <Link
                    to="/register"
                    className="text-[#FF5F00] font-bold hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </div>

            {/* Decorative line */}
            <div className="flex items-center justify-center mt-8">
              <div className="h-[2px] w-16 bg-[#FF5F00] rounded-full animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
